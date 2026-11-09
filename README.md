# Ashborn

Phone app version of Ashborn, a dark medieval text adventure. You survive the night your kingdom burned, grow up in hiding, and choose how the Demon Empress falls. 17 endings.

Your save and the endings you've found stay on your phone.

Rebuild after changing the Claude artifact: copy its HTML to `src/ashborn.html` and its `story.js` to `story.js`, then run `node tools/build.js src/ashborn.html`. Bump `CACHE` in `sw.js` so phones pick up the new version.

Preview locally with `node tools/serve.js` (http://localhost:8138).
