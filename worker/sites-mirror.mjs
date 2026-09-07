// Sites is a canonical redirect mirror, not a second content origin.
// Replaced by build-sites-mirror.mjs from the exact committed source.
const sourceHead = /* BUILD_SOURCE_HEAD */ "development";

export default {
  /** @param {Request} request */
  fetch(request) {
    const url = new URL(request.url);
    if (url.hostname !== "dc-atlas-cn-us.catknowspray.chatgpt.site") {
      return new Response("Not found", { status: 404 });
    }
    url.protocol = "https:";
    url.host = "idc-index.com";
    return new Response(null, {
      status: 308,
      headers: {
        location: url.href,
        "x-atlas-source-head": sourceHead,
      },
    });
  },
};
