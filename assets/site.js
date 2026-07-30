---
---
/* Progressive enhancement only — the site is fully readable without this. */
(function () {
  'use strict';

  /* ---------- theme toggle ---------- */
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- topic filter (homepage) ---------- */
  var chips = document.querySelectorAll('.chip');
  var items = document.querySelectorAll('.card-item');
  var emptyNote = document.getElementById('empty-note');

  if (chips.length && items.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var want = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); });

        var shown = 0;
        items.forEach(function (item) {
          var match = want === 'all' || item.getAttribute('data-series') === want;
          item.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });
        if (emptyNote) emptyNote.hidden = shown !== 0;
      });
    });
  }

  /* ---------- reading progress ---------- */
  var bar = document.getElementById('progress');
  var toTop = document.getElementById('to-top');

  function onScroll() {
    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }
    if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 900);
  }

  if (bar || toTop) {
    var queued = false;
    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { onScroll(); queued = false; });
    }, { passive: true });
    onScroll();
  }

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- headings: slugs, anchors, table of contents ---------- */
  var content = document.getElementById('post-content');
  var tocNav = document.getElementById('toc-nav');
  var toc = document.getElementById('toc');

  function slugify(s) {
    return s.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  if (content) {
    var heads = content.querySelectorAll('h2, h3');
    var used = {};

    heads.forEach(function (h) {
      if (!h.id) {
        var base = slugify(h.textContent) || 'section';
        used[base] = (used[base] || 0) + 1;
        h.id = used[base] > 1 ? base + '-' + used[base] : base;
      }
      var a = document.createElement('a');
      a.className = 'heading-anchor';
      a.href = '#' + h.id;
      a.textContent = '#';
      a.setAttribute('aria-label', 'Link to this section');
      h.appendChild(a);
    });

    // Build the TOC from h2s only — h3s make it too noisy at this length.
    var tocTargets = Array.prototype.filter.call(heads, function (h) {
      return h.tagName === 'H2';
    });

    if (tocNav && toc && tocTargets.length > 2) {
      tocTargets.forEach(function (h) {
        var link = document.createElement('a');
        link.href = '#' + h.id;
        // Strip the trailing '#' from the anchor we just appended.
        link.textContent = h.textContent.replace(/#$/, '');
        link.className = h.tagName === 'H3' ? 'lvl-3' : 'lvl-2';
        tocNav.appendChild(link);
      });

      // Only show the rail when there's room for it.
      if (window.matchMedia('(min-width: 1181px)').matches) {
        toc.style.display = 'block';
      }
      window.addEventListener('resize', function () {
        toc.style.display = window.matchMedia('(min-width: 1181px)').matches ? 'block' : 'none';
      });

      // Highlight the section currently in view.
      var links = tocNav.querySelectorAll('a');
      if ('IntersectionObserver' in window) {
        var seen = new Map();
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { seen.set(e.target.id, e.isIntersecting); });
          var currentId = null;
          for (var i = 0; i < tocTargets.length; i++) {
            if (seen.get(tocTargets[i].id)) { currentId = tocTargets[i].id; break; }
          }
          if (currentId) {
            links.forEach(function (l) {
              l.classList.toggle('is-current', l.getAttribute('href') === '#' + currentId);
            });
          }
        }, { rootMargin: '-72px 0px -70% 0px' });
        tocTargets.forEach(function (h) { obs.observe(h); });
      }
    }

    /* ---------- copy buttons on code blocks ---------- */
    content.querySelectorAll('pre').forEach(function (pre) {
      var wrap = document.createElement('div');
      wrap.className = 'code-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = 'Copy';
      wrap.appendChild(btn);

      btn.addEventListener('click', function () {
        var text = pre.innerText;
        var done = function () {
          btn.textContent = 'Copied';
          btn.classList.add('is-done');
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('is-done');
          }, 1600);
        };
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(done, function () {});
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
    });
  }
})();
