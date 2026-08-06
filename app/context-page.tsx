import type { ReactNode } from "react";
import Link from "next/link";

type ContextItem = {
  label: string;
  value: string;
};

type ContextSection = {
  label: string;
  title: string;
  copy: ReactNode;
};

type Props = {
  eyebrow: string;
  title: ReactNode;
  summary: string;
  backHref: string;
  backLabel: string;
  items: ContextItem[];
  sections: ContextSection[];
  boundary: ContextSection;
};

export function ContextPage({ eyebrow, title, summary, backHref, backLabel, items, sections, boundary }: Props) {
  return <div className="atlas-context-page atlas-console-content-page">
    <section className="atlas-context-hero">
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <p className="atlas-context-summary">{summary}</p>
        <Link href={backHref}>{backLabel}</Link>
      </div>
      <dl className="atlas-context-meta">
        {items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
      </dl>
    </section>
    <section className="atlas-context-grid" aria-label={eyebrow}>
      {sections.map((section) => <article key={section.title}>
        <span>{section.label}</span>
        <h2>{section.title}</h2>
        <p>{section.copy}</p>
      </article>)}
    </section>
    <section className="atlas-context-boundary">
      <span>{boundary.label}</span>
      <div><h2>{boundary.title}</h2><p>{boundary.copy}</p></div>
    </section>
  </div>;
}
