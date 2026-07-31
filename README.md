# ishaan119.github.io

Source for [ishaan119.github.io](https://ishaan119.github.io) — a Jekyll blog on
GitHub Pages with a hand-rolled theme (no parent theme).

## Adding a post

Create `_posts/YYYY-MM-DD-slug.md` with front matter:

```yaml
---
title: "Your Title"
subtitle: "Optional one-liner under the title"
date: 2026-07-30
series: "LLM Internals"
description: >-
  Two or three sentences. Used for the homepage card,
  meta tags, and the RSS feed.
source_repo: https://github.com/ishaan119/some-repo   # optional
featured: true                                        # optional
---
```

`layout: post` is applied automatically by the `defaults` block in `_config.yml`.

`series` drives the badge on the card and the homepage filter chips — reuse an
existing string exactly to group posts, or introduce a new one to add a chip.
The homepage stats (post count, series count, total reading minutes) are all
computed from the posts, so there's nothing to update by hand.

A *new* series does need one manual step: its colour. `main.scss` maps each
slugified series to a `--tint` in three places — `.chip[data-filter=…]`,
`.card-item[data-series=…]`, and `.post`/`.post-nav[data-series=…]`. Miss one and
that series silently falls back to `--accent`, so it looks correct on the card
and wrong on the post. Also add the post to the listing in `about.md`, which is
hand-maintained.

`hero_image` renders a full-width image between the header and the body. It is
deliberately *not* cropped to a fixed height — several heroes are multi-panel
comics or labelled diagrams, and `object-fit: cover` eats a panel.

Don't write an `# H1` at the top of the body — the layout renders the title.

Then `git push`. The URL is `/slug/`, taken from the filename minus the date.

Two gotchas: the date can't be in the future or the post won't build, and
literal `{{` or `{%` in the body need wrapping in `{% raw %}...{% endraw %}`
because Liquid will try to interpret them.

## Local preview

The system Ruby on macOS is too old for Jekyll 4, so use Homebrew's:

```bash
brew install ruby
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"

bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000. It live-reloads on save, except for
`_config.yml` — that needs a restart.

## Layout

```
_config.yml         site config, hero copy, post defaults
_posts/             one markdown file per post
_layouts/
  default.html      shell: header, nav, theme toggle, footer
  home.html         hero, computed stats, filter chips, card grid
  post.html         progress bar, TOC rail, prev/next
  page.html         plain pages (about)
assets/main.scss    all styles
assets/site.js      theme toggle, filters, TOC, copy buttons
```

## Theme notes

Styling is entirely in `assets/main.scss` — CSS custom properties on `:root`
for dark, overridden under `[data-theme="light"]`. To recolour the site, change
the tokens at the top; nothing below hardcodes a colour.

Two things that are easy to break:

- **Vertical rhythm in posts** comes from `.post-content > * + * { margin-top }`.
  Adding a bare `margin: 0` to an element inside `.post-content` outranks that
  selector and silently flattens the spacing between every paragraph. The gap is
  in `em`, not `rem`, on purpose: it has to stay clearly taller than the line
  height *inside* a paragraph, and a fixed `rem` gap loses that margin as soon as
  the prose font size goes up.
- **Code blocks must not wrap** (`white-space: pre` + `overflow-x: auto`) —
  several posts contain ASCII architecture diagrams that become unreadable if
  the lines reflow.
- **Tables are wrapped by `site.js`** in a `.table-wrap` scroll container and
  given `min-width: 30rem`. Without it, a three-column comparison table squeezed
  into a 342px phone column renders roughly one word per line. The wrapper picks
  up the rhythm margin, so the table inside is reset to `margin: 0`.

Note that GitHub's alert syntax (`> [!NOTE]`) does **not** render in kramdown —
it comes out as literal text. When importing a README, convert those to plain
blockquotes.

Deploys use the GitHub Pages legacy branch build from `main`, so only
[allowlisted plugins](https://pages.github.com/versions/) work. There's a
GitHub Actions workflow parked in `.ci-disabled/pages.yml.txt` if the build ever
needs unlisted plugins — moving it to `.github/workflows/` requires a token with
the `workflow` scope.
