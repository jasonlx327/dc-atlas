// Node-only transport. Honor existing proxy settings without logging credentials.
import { EnvHttpProxyAgent, fetch as undiciFetch } from "undici";
if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.https_proxy || process.env.http_proxy) {
  const dispatcher = new EnvHttpProxyAgent();
  globalThis.fetch = (input, init) => undiciFetch(input, { ...init, dispatcher });
}
