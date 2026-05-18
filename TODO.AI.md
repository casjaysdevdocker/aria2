# aria2 — TODO (AI living list)

## Done
- [x] Dockerfile: BUILD_DATE → 202605131434, prerequisites RUN → `true`, removed inline APK repo setup from "Creating and editing system files" RUN
- [x] .env.scripts: header updated to 2026, all aria2-specific values preserved
- [x] entrypoint.sh: UUOC fix (cat → bash builtin), CONTAINER_NAME="aria2" already correct
- [x] pkmgr: copied verbatim from canonical template
- [x] functions/entrypoint.sh: copied verbatim from canonical template (1724 lines)
- [x] Setup scripts 00-04, 06-07: copied from canonical template
- [x] 05-custom.sh: preserved (AriaNg install + wipe-and-replace logic)
- [x] init.d/00-aria2c.sh: full canonical rewrite (04-example.sh pattern, aria2-specific hooks preserved)
- [x] README.md: user-facing install/run docs with ports, volumes, env vars
- [x] IDEA.md: one-paragraph service intent
- [x] AI.md: build flow, runtime chain, key paths, token substitution table
- [x] CLAUDE.md: minimal agent context pointer
- [x] PLAN.md: already complete from earlier migration work
- [x] bash -n validation: all modified scripts pass syntax check

## Pending
- [ ] Smoke test: `docker run` + curl RPC + curl AriaNg UI (requires buildx to run first)
- [ ] Pre-bundle AriaNg zip on host: `mkdir -p rootfs/tmp/ariang-src && curl -fsSL -o rootfs/tmp/ariang-src/AriaNg-1.3.13.zip https://github.com/mayswind/AriaNg/releases/download/1.3.13/AriaNg-1.3.13.zip`
- [ ] buildx: `cd /root/Projects/github/casjaysdevdocker/aria2 && buildx`
- [ ] gitcommit when smoke test passes
