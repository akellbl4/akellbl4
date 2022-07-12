## Overview

- `src/pages/api/*` - [API routes](https://nextjs.org/docs/api-routes/introduction) makes Now Playing in my Spotify work as well as counting numbers of views with Redis.
- `src/pages/blog/*` - Static pre-rendered blog pages using [MDX](https://github.com/mdx-js/mdx).
- `src/pages/*` - All other static pages.



If you want to make work counting view and Spotify features you need to copy config and put credentials there.

```
$ cp .env.example .env.local
```