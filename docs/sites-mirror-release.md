# Same-source canonical mirror release

The public Sites hostname already redirects every request (308) to idc-index.com.
Do not upload the full site's historical images just to run this redirect.

1. Validate and commit the complete Cloudflare source, including the mirror entrypoint.
2. Run `npm run build:sites:mirror` in that same clean, committed checkout.
3. Run the installed Sites hosting `scripts/package-site.sh` helper with the printed
   `.sites-mirror-build` package root and a new archive path. It packages the generated
   Worker, not a second source checkout. Keep the full Cloudflare `dist` unchanged.
4. Push the main checkout's exact HEAD to the existing Sites source repository.
5. Save the packaged mirror against that HEAD. Only after saving succeeds, deploy
   Cloudflare and that saved Sites version. Preserve the current public audience.
6. Verify Sites saved source SHA and the live `x-atlas-source-head` redirect header
   both equal the Cloudflare release HEAD; follow its location and verify actual
   repaired HTML on idc-index.com, plus the API and daily snapshot.

The mirror is not an independent fallback content host. Do not claim it renders
content independently, alter access controls, drop paths/query strings, or replace
the Cloudflare build with this mirror artifact. Rollback is the previous saved
Sites version and the previously verified Cloudflare version.
