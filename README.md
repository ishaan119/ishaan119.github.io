# ishaan119.github.io

Source for [ishaan119.github.io](https://ishaan119.github.io) — a Jekyll blog on
GitHub Pages, built by GitHub Actions from `main`.

## Adding a post

Create `_posts/YYYY-MM-DD-slug.md` with front matter:

```yaml
---
layout: post
title: "Your Title"
subtitle: "Optional one-liner under the title"
date: 2026-07-30
description: >-
  Two or three sentences. Used for the homepage excerpt,
  SEO meta tags, and the RSS feed.
---
```

Then `git push` — Actions builds and deploys. The URL is `/slug/`, from the
filename minus the date.

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
_config.yml              site config
_posts/                  one markdown file per post
_layouts/                overrides of the minima theme's layouts
assets/main.scss         dark palette + long-form typography
.github/workflows/       build and deploy on push to main
```

The theme is [minima](https://github.com/jekyll/minima) with a dark palette and
typography set in `assets/main.scss`. Sass variables there must stay *above* the
`@import "minima"` line — the theme declares them with `!default`, so the first
definition wins.
