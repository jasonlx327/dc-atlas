import unittest
from collect import coherent_wire_rss, collect_feed, CLOUDFLARE, NVIDIA
from unittest.mock import patch
from types import SimpleNamespace
import subprocess
from xml.etree import ElementTree as ET

def fixture(source='Coherent Corp.', date='October 22, 2026 14:15 ET'):
    return f'''<ul><li class="row"><div class="newsLink pl-0"><div class="date-source"><span>{date}</span><span>|</span><span>Source: <a class="sourceLink">{source}</a></span></div><div class="mainLink"><a href="/news-release/2026/10/22/1/11543/en/test.html">Optics &amp; AI</a></div></div></li></ul>'''.encode()

class WireTests(unittest.TestCase):
    def test_nvidia_atom_keeps_publication_not_modified_date(self):
        body=b'''<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>GPU &amp; networking</title><link rel="self" href="https://developer.nvidia.com/blog/api"/><link rel="alternate" href="https://developer.nvidia.com/blog/example/"/><id>official-id</id><published>2026-10-22T14:15:00-04:00</published><updated>2026-10-23T20:00:00Z</updated><content>PRIVATE BODY</content></entry></feed>'''
        with patch('collect.subprocess.run', return_value=SimpleNamespace(stdout=body)):
            entry=collect_feed(NVIDIA,{})
        self.assertEqual(entry['status'],'ok')
        item=ET.fromstring(entry['data']).find('./channel/item')
        self.assertEqual(item.findtext('pubDate'),'Thu, 22 Oct 2026 14:15:00 -0400')
        self.assertEqual(item.findtext('link'),'https://developer.nvidia.com/blog/example/')
        self.assertNotIn('PRIVATE BODY',entry['data'])
        summarized=body.replace(b'<content>',b'<summary type="html">Proposed capacity remains subject to power delivery.</summary><content>')
        with patch('collect.subprocess.run',return_value=SimpleNamespace(stdout=summarized)):
            with_teaser=collect_feed(NVIDIA,{})
        self.assertEqual(ET.fromstring(with_teaser['data']).findtext('./channel/item/description'),'Proposed capacity remains subject to power delivery.')
        self.assertNotIn('PRIVATE BODY',with_teaser['data'])
        for bad in (body.replace(b'<published>',b'<missing>').replace(b'</published>',b'</missing>'),body.replace(b'https://developer.nvidia.com/blog/example/',b'https://other.example/article'),b'<html>Access denied</html>'):
            with patch('collect.subprocess.run',return_value=SimpleNamespace(stdout=bad)):
                failed=collect_feed(NVIDIA,entry)
            self.assertEqual(failed['status'],'failed')
            self.assertEqual(failed['fetchedAt'],entry['fetchedAt'])
            self.assertEqual(failed['data'],entry['data'])
    def test_cloudflare_short_source_excerpt_and_failure_keep_original_fetch_time(self):
        body=b'<rss xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><item><title>Cloudflare update</title><link>https://blog.cloudflare.com/update/</link><pubDate>Thu, 22 Oct 2026 14:15:00 GMT</pubDate><description><![CDATA[<p>Publisher teaser only; not a verified deployment.</p><script>PRIVATE_SCRIPT</script>]]></description><content:encoded>PRIVATE ARTICLE BODY</content:encoded></item></channel></rss>'
        with patch('collect.subprocess.run', return_value=SimpleNamespace(stdout=body)):
            entry=collect_feed(CLOUDFLARE,{})
        self.assertEqual(entry['status'],'ok')
        self.assertEqual(entry['sourceUrl'],CLOUDFLARE)
        item=ET.fromstring(entry['data']).find('./channel/item')
        self.assertEqual(item.findtext('description'),'Publisher teaser only; not a verified deployment.')
        self.assertNotIn('PRIVATE ARTICLE BODY',entry['data'])
        self.assertNotIn('PRIVATE_SCRIPT',entry['data'])
        self.assertIn('Thu, 22 Oct 2026 14:15:00 GMT',entry['data'])
        with patch('collect.subprocess.run', side_effect=subprocess.CalledProcessError(22,'curl')):
            failed=collect_feed(CLOUDFLARE,entry)
        self.assertEqual(failed['status'],'failed')
        self.assertEqual(failed['fetchedAt'],entry['fetchedAt'])
        self.assertEqual(failed['data'],entry['data'])
    def test_excerpt_is_bounded_and_missing_teaser_does_not_become_article_content(self):
        body=b'<rss><channel><item><title>AI update</title><link>https://example.com/update</link><description>'+b'Words '*200+b'</description></item></channel></rss>'
        with patch('collect.subprocess.run',return_value=SimpleNamespace(stdout=body)):
            entry=collect_feed(CLOUDFLARE,{})
        self.assertLessEqual(len(ET.fromstring(entry['data']).findtext('./channel/item/description')),320)
        body=b'<rss xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><item><title>AI update</title><link>https://example.com/update</link><content:encoded>PRIVATE ARTICLE BODY</content:encoded></item></channel></rss>'
        with patch('collect.subprocess.run',return_value=SimpleNamespace(stdout=body)):
            entry=collect_feed(CLOUDFLARE,{})
        self.assertEqual(ET.fromstring(entry['data']).findtext('./channel/item/description',''),'')
        self.assertNotIn('PRIVATE ARTICLE BODY',entry['data'])
    def test_metadata_and_dst(self):
        item = ET.fromstring(coherent_wire_rss(fixture())).find('./channel/item')
        self.assertEqual(item.findtext('title'), 'Optics & AI')
        self.assertEqual(item.findtext('pubDate'), 'Thu, 22 Oct 2026 14:15:00 -0400')
        winter = ET.fromstring(coherent_wire_rss(fixture(date='December 22, 2026 14:15 ET')))
        self.assertTrue(winter.findtext('./channel/item/pubDate').endswith('-0500'))

    def test_other_issuer_rejected(self):
        with self.assertRaisesRegex(ValueError, 'issuer-mismatch'):
            coherent_wire_rss(fixture(source='Coherent Global'))

    def test_empty_or_invalid_date_rejected(self):
        with self.assertRaises(ValueError):
            coherent_wire_rss(b'<html>Access denied</html>')
        with self.assertRaises(ValueError):
            coherent_wire_rss(fixture(date='unknown'))

if __name__ == '__main__':
    unittest.main()
