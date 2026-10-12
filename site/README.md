# Corporate Games website (the portal)

Static website, no build step, no external requests. Own fonts, own styles, nothing shared with any other site. The hero shows the five games in one frame. Every Corporate Games site has a slim bar linking to the other games and to this portal. Links to the portal carry `?from=<game>`, and the portal then shows "Back to <game>".

Status: built and checked locally (all links, headings, colour contrast; viewed at desktop and phone width). NOT deployed.

Deploy (free Cloudflare Pages), only after the owner says go:

    wrangler pages deploy site --project-name corporate-games --branch main

The legal pages are first drafts for a lawyer to read before launch.
