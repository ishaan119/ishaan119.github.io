/* ------------------------------------------------------------------
   App shell: routing, sidebar, search, progress, quizzes, flashcards,
   glossary and the riyaz page. Plain script, no build step, works
   straight off the filesystem.
   ------------------------------------------------------------------ */
(function () {
  var A = VF.Audio;
  var CH = window.CHAPTERS;
  var CFG = window.VF_CONFIG || { pdfBase: '../', pdfs: true };

  var K = {
    read: 'vf.read',
    theme: 'vf.theme',
    last: 'vf.last',
    quiz: 'vf.quiz',
    cards: 'vf.cards'
  };

  /* ---------------------------- storage ---------------------------- */
  function load(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v === null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  var readSet = load(K.read, []);
  var quizState = load(K.quiz, {});
  var cardState = load(K.cards, {});

  function isRead(id) { return readSet.indexOf(id) !== -1; }
  function toggleRead(id) {
    var i = readSet.indexOf(id);
    if (i === -1) readSet.push(id); else readSet.splice(i, 1);
    save(K.read, readSet);
    paintProgress();
    buildNav();
    return isRead(id);
  }

  /* ---------------------------- helpers ---------------------------- */
  var scratch = document.createElement('div');
  function plain(html) { scratch.innerHTML = html; return scratch.textContent || ''; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function pdfHref(name) { return CFG.pdfBase + encodeURIComponent(name); }
  function chapterById(id) { return CH.filter(function (c) { return c.id === id; })[0]; }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2100);
  }

  /* ---------------------------- glossary --------------------------- */
  var GLOSSARY = (function () {
    var out = [];
    var seen = {};
    CH.forEach(function (c) {
      c.sections.forEach(function (s) {
        var d = document.createElement('div');
        d.innerHTML = s.html;
        var dts = d.querySelectorAll('dl.term-list dt');
        dts.forEach(function (dt) {
          var dd = dt.nextElementSibling;
          if (!dd || dd.tagName !== 'DD') return;
          var term = dt.textContent.trim();
          var key = term.toLowerCase();
          var def = dd.textContent.replace(/\s+/g, ' ').trim();
          if (seen[key]) {
            // same word defined twice (e.g. meend, gamak) - keep both readings
            if (seen[key].def.indexOf(def) === -1) seen[key].extra.push({ def: def, ch: c });
            return;
          }
          var item = { term: term, def: def, ch: c, section: s.id, extra: [] };
          seen[key] = item;
          out.push(item);
        });
      });
    });
    return out.sort(function (a, b) { return a.term.localeCompare(b.term); });
  })();

  /* ------------------------- search index ------------------------- */
  var INDEX = (function () {
    var rows = [];
    CH.forEach(function (c) {
      rows.push({
        ch: c, section: null,
        heading: plain(c.title),
        text: plain(c.title) + ' ' + c.subtitle + ' ' + (c.tags || []).join(' ')
      });
      c.sections.forEach(function (s) {
        rows.push({
          ch: c, section: s,
          heading: plain(s.heading),
          text: plain(s.heading) + ' ' + plain(s.html).replace(/\s+/g, ' ')
        });
      });
    });
    GLOSSARY.forEach(function (g) {
      rows.push({ ch: g.ch, section: { id: g.section, heading: 'Glossary' }, heading: g.term, text: g.term + ' ' + g.def, glossary: true });
    });
    return rows;
  })();

  function search(q) {
    q = q.trim().toLowerCase();
    if (q.length < 2) return [];
    var terms = q.split(/\s+/);
    var hits = [];
    INDEX.forEach(function (row) {
      var lc = row.text.toLowerCase();
      var score = 0, ok = true;
      terms.forEach(function (t) {
        var at = lc.indexOf(t);
        if (at === -1) { ok = false; return; }
        score += 10;
        if (row.heading.toLowerCase().indexOf(t) !== -1) score += 30;
        if (lc.indexOf(' ' + t) !== -1) score += 4;
        if (row.glossary) score += 8;
      });
      if (!ok) return;
      hits.push({ row: row, score: score, at: lc.indexOf(terms[0]) });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    return hits.slice(0, 24);
  }

  function snippet(text, q, at) {
    var start = Math.max(0, at - 58);
    var slice = (start > 0 ? '…' : '') + text.slice(start, start + 168) + (text.length > start + 168 ? '…' : '');
    var re = new RegExp('(' + q.trim().split(/\s+/).map(function (t) {
      return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('|') + ')', 'gi');
    return esc(slice).replace(re, '<mark>$1</mark>');
  }

  /* ---------------------------- sidebar ---------------------------- */
  function buildNav() {
    var ul = document.getElementById('chapterNav');
    ul.innerHTML = CH.map(function (c) {
      return '<li><a class="nav-item" href="#/' + c.id + '" data-ch="' + c.id + '">' +
        '<span class="ni-num">' + c.num + '</span>' +
        '<span class="ni-title">' + c.title + '</span>' +
        (isRead(c.id) ? '<span class="ni-done" aria-label="read">✓</span>' : '') +
      '</a></li>';
    }).join('');
    paintActive();
  }

  function paintActive() {
    var path = route().path;
    document.querySelectorAll('.nav-item').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + path);
    });
    document.querySelectorAll('.nav-link').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + path);
    });
  }

  function paintProgress() {
    var pct = readSet.length / CH.length;
    var ring = document.querySelector('.ring-fg');
    var C = 2 * Math.PI * 19;
    ring.style.strokeDasharray = C.toFixed(1);
    ring.style.strokeDashoffset = (C * (1 - pct)).toFixed(1);
    document.getElementById('progressLabel').textContent = readSet.length + '/' + CH.length;
    var hint = document.getElementById('progressHint');
    hint.textContent = readSet.length === 0 ? 'Mark a chapter done as you finish it'
      : readSet.length === CH.length ? 'All ten done. Now go practise.'
      : (CH.length - readSet.length) + ' to go';
  }

  /* ----------------------------- router ---------------------------- */
  function route() {
    var raw = location.hash.replace(/^#/, '');
    if (!raw) return { path: '/', anchor: null };
    var parts = raw.split('#');
    return { path: parts[0] || '/', anchor: parts[1] || null };
  }

  function go() {
    var r = route();
    document.dispatchEvent(new CustomEvent('vf:route-change'));
    var view = document.getElementById('view');
    var seg = r.path.replace(/^\//, '').split('/');
    var head = seg[0] || '';

    if (/^ch\d\d$/.test(head)) renderChapter(view, chapterById(head), r.anchor);
    else if (head === 'practice') renderPractice(view, seg[1]);
    else if (head === 'cards') renderCards(view);
    else if (head === 'riyaz') renderRiyaz(view);
    else if (head === 'glossary') renderGlossary(view);
    else if (head === 'sources') renderSources(view);
    else renderHome(view);

    paintActive();
    document.body.classList.remove('nav-open');
    document.getElementById('menuBtn').setAttribute('aria-expanded', 'false');

    if (r.anchor) {
      var target = document.getElementById(r.anchor);
      if (target) { target.scrollIntoView(); window.scrollBy(0, -10); }
      else window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
    view.focus({ preventScroll: true });
  }

  /* ------------------------------ home ---------------------------- */
  function renderHome(view) {
    document.title = 'Indian Art Music — study';
    var lastId = load(K.last, null);
    var last = lastId ? chapterById(lastId) : null;
    var nextUp = CH.filter(function (c) { return !isRead(c.id); })[0];

    var totalQ = 0;
    Object.keys(window.QUIZZES).forEach(function (k) {
      var q = window.QUIZZES[k];
      totalQ += (q.pdf || []).length + (q.added || []).length + (q.scramble || []).length;
    });

    view.innerHTML =
      '<div class="page">' +
        '<div class="hero">' +
          '<h1>Ten chapters, one place to study them</h1>' +
          '<p>Your Vrindaban Gurukul course material, cleaned up and made playable: every tala you can hear, every thaat you can compare, and the figures the PDFs lost rebuilt as interactive panels.</p>' +
          '<div class="hero-actions">' +
            (last ? '<a class="btn primary" href="#/' + last.id + '">Continue: ' + last.title + '</a>' : '') +
            (nextUp && (!last || nextUp.id !== last.id) ? '<a class="btn" href="#/' + nextUp.id + '">' + (last ? 'Next unread: ' : 'Start: ') + nextUp.title + '</a>' : '') +
            '<a class="btn" href="#/riyaz">Riyaz tools</a>' +
            '<a class="btn" href="#/practice">Practice</a>' +
          '</div>' +
        '</div>' +

        '<div class="stat-row">' +
          '<div class="stat"><b>' + readSet.length + '/' + CH.length + '</b><span>chapters read</span></div>' +
          '<div class="stat"><b>' + GLOSSARY.length + '</b><span>glossary terms</span></div>' +
          '<div class="stat"><b>' + totalQ + '</b><span>practice questions</span></div>' +
          '<div class="stat"><b>' + window.TALAS.length + '</b><span>playable talas</span></div>' +
          '<div class="stat"><b>' + window.THAATS.length + '</b><span>thaats</span></div>' +
        '</div>' +

        '<div class="section-head"><h2>Chapters</h2><span>in the order your files are numbered</span></div>' +
        '<div class="ch-grid">' + CH.map(function (c) {
          return '<a class="ch-card' + (isRead(c.id) ? ' read' : '') + '" href="#/' + c.id + '">' +
            '<div class="cc-top"><span class="cc-num">' + c.num + '</span><span class="cc-mins">' + c.minutes + ' min</span></div>' +
            '<h3>' + c.title + '</h3>' +
            '<p>' + c.subtitle + '</p>' +
            '<div class="cc-tags">' + (c.tags || []).map(function (t) { return '<span class="cc-tag">' + t + '</span>'; }).join('') + '</div>' +
          '</a>';
        }).join('') + '</div>' +

        '<div class="section-head"><h2>Practise instead of re-reading</h2></div>' +
        '<div class="tool-grid">' +
          toolCard('♪', '#/riyaz', 'Riyaz tools', 'Tala player, swara board, thaat explorer, nuance lab and your Sa drone, all in one page.') +
          toolCard('✓', '#/practice', 'Quizzes', 'Every question printed in your PDFs, with worked answers, plus extra questions for the seven chapters that have none.') +
          toolCard('▣', '#/cards', 'Flashcards', GLOSSARY.length + ' terms pulled straight from the chapter key-word lists.') +
          toolCard('≡', '#/glossary', 'Glossary', 'One searchable list, each term linked back to where it is taught.') +
        '</div>' +

        '<div class="section-head" style="margin-top:36px"><h2>About this reader</h2></div>' +
        '<div class="callout fig">' +
          '<h5>What changed from the PDFs</h5>' +
          '<p>The ten source files are Word or WordPress exports. Their text still carried raw markup and their images were dropped in conversion, so every "as shown below" table was blank. Prose here is your prose, cleaned up. Anything I added is labelled <span class="badge warn">added</span>, and rebuilt figures say so. The audio clips the chapters link to on vrindabangurukul.com are all 404 now, so demos are synthesised in the browser instead.</p>' +
          '<p><a class="inline-link" href="#/sources">' + (CFG.pdfs ? 'Open the original PDFs' : 'Where this came from') + ' →</a></p>' +
        '</div>' +
      '</div>';
  }

  function toolCard(ic, href, title, desc) {
    return '<a class="tool-card" href="' + href + '"><span class="tc-ic">' + ic + '</span><b>' + title + '</b><span>' + desc + '</span></a>';
  }

  /* ---------------------------- chapter --------------------------- */
  function renderChapter(view, c, anchor) {
    if (!c) { renderHome(view); return; }
    document.title = plain(c.title) + ' — Indian Art Music';
    save(K.last, c.id);

    var idx = CH.indexOf(c);
    var prev = CH[idx - 1], next = CH[idx + 1];
    var q = window.QUIZZES[c.id];
    var qCount = q ? (q.pdf || []).length + (q.added || []).length + (q.scramble || []).length : 0;

    view.innerHTML =
      '<div class="page"><div class="reader">' +
        '<article class="article">' +
          '<header class="ch-head">' +
            '<div class="eyebrow">' +
              '<span>Chapter ' + c.num + '</span><span class="sep">·</span><span>' + c.minutes + ' min read</span>' +
              (c.sourceLabel ? '<span class="sep">·</span><span>' + c.sourceLabel + '</span>' : '') +
            '</div>' +
            '<h1 class="ch-title">' + c.title + '</h1>' +
            '<p class="ch-sub">' + c.subtitle + '</p>' +
            '<div class="ch-actions">' +
              '<button class="btn ' + (isRead(c.id) ? 'done' : '') + '" data-act="read">' + (isRead(c.id) ? '✓ Read' : 'Mark as read') + '</button>' +
              (qCount ? '<a class="btn" href="#/practice/' + c.id + '">Quiz · ' + qCount + ' questions</a>' : '') +
              (CFG.pdfs ? '<a class="btn ghost" href="' + pdfHref(c.pdf) + '" target="_blank" rel="noopener">Original PDF</a>' : '') +
            '</div>' +
          '</header>' +
          c.sections.map(function (s) {
            return '<section><h2 id="' + s.id + '">' + s.heading + '</h2>' + s.html + '</section>';
          }).join('') +
          '<footer class="ch-foot">' +
            '<div class="ch-actions">' +
              '<button class="btn ' + (isRead(c.id) ? 'done' : 'primary') + '" data-act="read">' + (isRead(c.id) ? '✓ Read' : 'Mark as read') + '</button>' +
              (qCount ? '<a class="btn" href="#/practice/' + c.id + '">Test yourself</a>' : '') +
            '</div>' +
            '<div class="ch-nav">' +
              (prev ? '<a class="prev" href="#/' + prev.id + '"><small>← Chapter ' + prev.num + '</small><b>' + prev.title + '</b></a>' : '<span></span>') +
              (next ? '<a class="next" href="#/' + next.id + '"><small>Chapter ' + next.num + ' →</small><b>' + next.title + '</b></a>' : '<span></span>') +
            '</div>' +
          '</footer>' +
        '</article>' +
        '<aside class="rail"><h6>On this page</h6>' +
          c.sections.map(function (s) { return '<a href="#/' + c.id + '#' + s.id + '" data-spy="' + s.id + '">' + s.heading + '</a>'; }).join('') +
        '</aside>' +
      '</div></div>';

    view.querySelectorAll('[data-act="read"]').forEach(function (b) {
      b.addEventListener('click', function () {
        var now = toggleRead(c.id);
        toast(now ? 'Marked as read' : 'Marked as unread');
        view.querySelectorAll('[data-act="read"]').forEach(function (btn) {
          btn.textContent = now ? '✓ Read' : 'Mark as read';
          btn.classList.toggle('done', now);
          btn.classList.remove('primary');
        });
      });
    });

    VF.Tools.mount(view);
    spy(view);
  }

  /* scroll spy for the right rail */
  var spyObserver = null;
  function spy(view) {
    if (spyObserver) spyObserver.disconnect();
    var links = {};
    view.querySelectorAll('[data-spy]').forEach(function (a) { links[a.dataset.spy] = a; });
    var heads = view.querySelectorAll('.article h2[id]');
    if (!heads.length) return;
    spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.remove('on'); });
        var a = links[en.target.id];
        if (a) a.classList.add('on');
      });
    }, { rootMargin: '-70px 0px -70% 0px' });
    heads.forEach(function (hEl) { spyObserver.observe(hEl); });
  }

  /* ---------------------------- practice -------------------------- */
  function renderPractice(view, chId) {
    document.title = 'Practice — Indian Art Music';
    var ids = chId ? [chId] : Object.keys(window.QUIZZES);
    var chips = '<div class="tabs">' +
      '<a class="tab' + (chId ? '' : ' on') + '" href="#/practice">All chapters</a>' +
      Object.keys(window.QUIZZES).map(function (id) {
        var c = chapterById(id);
        return '<a class="tab' + (chId === id ? ' on' : '') + '" href="#/practice/' + id + '">Ch ' + c.num + '</a>';
      }).join('') + '</div>';

    var body = ids.map(function (id) {
      var c = chapterById(id);
      var q = window.QUIZZES[id];
      if (!c || !q) return '';
      var out = '<div class="qgroup">' +
        '<div class="qgroup-head"><h3>Chapter ' + c.num + ' · ' + c.title + '</h3>' +
        '<a class="btn sm" href="#/' + c.id + '">Read chapter</a></div>';
      if (q.pdf) {
        out += '<div class="panel-head"><h4>Test your understanding</h4><span class="badge">printed in your PDF</span></div>';
        out += q.pdf.map(function (item, i) { return mcqHTML(id, 'pdf', i, item); }).join('');
      }
      if (q.scramble) {
        out += '<div class="panel-head" style="margin-top:22px"><h4>Unscramble the word</h4><span class="badge">printed in your PDF</span></div>';
        out += q.scramble.map(function (item, i) { return scrambleHTML(id, i, item); }).join('');
      }
      if (q.added) {
        out += '<div class="panel-head" style="margin-top:22px"><h4>Extra revision questions</h4><span class="badge warn">added</span></div>';
        out += q.added.map(function (item, i) { return mcqHTML(id, 'added', i, item); }).join('');
      }
      return out + '</div>';
    }).join('');

    view.innerHTML = '<div class="page"><div class="article quiz-root" style="max-width:780px">' +
      '<h1 class="ch-title">Practice</h1>' +
      '<p class="quiz-intro ch-sub">Answers are worked out from the chapter text, since the PDFs print no answer key. Where the source is genuinely ambiguous, the question says so.</p>' +
      chips + body +
      '<div class="score-bar" id="scoreBar"><span>Answered <b data-role="done">0</b></span><span>Correct <b data-role="ok">0</b></span>' +
      '<button class="btn sm" data-act="reset">Reset</button></div>' +
      '</div></div>';

    // bind to the freshly built container, never to #view, so handlers
    // cannot stack up across visits
    wireQuiz(view.querySelector('.quiz-root'));
  }

  function letter(i) { return 'abcdefgh'[i]; }

  function mcqHTML(chId, kind, i, item) {
    var key = chId + ':' + kind + ':' + i;
    var multi = !!item.multi;
    return '<div class="q" data-key="' + key + '" data-multi="' + multi + '">' +
      '<div class="q-num">' + (kind === 'pdf' ? 'Q' : 'Extra ') + (i + 1) + (multi ? ' · select all that apply' : '') + '</div>' +
      '<p class="q-text">' + item.q + '</p>' +
      '<div class="q-opts">' + item.options.map(function (o, oi) {
        return '<button class="q-opt" data-i="' + oi + '"><span class="letter">' + letter(oi) + '</span><span>' + o + '</span></button>';
      }).join('') + '</div>' +
      '<div class="q-actions">' +
        (multi ? '<button class="btn sm" data-act="check">Check</button>' : '') +
        '<button class="btn sm ghost" data-act="reveal">Show answer</button>' +
      '</div>' +
      '<div class="q-why" hidden><b>Why:</b> ' + item.why + '</div>' +
      (item.flag ? '<div class="q-flag" hidden>' + item.flag + '</div>' : '') +
    '</div>';
  }

  function scrambleHTML(chId, i, item) {
    var key = chId + ':scr:' + i;
    return '<div class="q scr" data-key="' + key + '">' +
      '<div class="scramble">' +
        '<span class="word">' + item.scrambled + '</span>' +
        '<span class="clue">' + item.clue + '</span>' +
        '<input type="text" placeholder="answer" aria-label="Your answer for ' + esc(item.clue) + '">' +
        '<button class="btn sm" data-act="reveal">Show</button>' +
      '</div>' +
    '</div>';
  }

  function quizItem(key) {
    var p = key.split(':');
    var q = window.QUIZZES[p[0]];
    if (p[1] === 'scr') return q.scramble[+p[2]];
    return (p[1] === 'pdf' ? q.pdf : q.added)[+p[2]];
  }

  function wireQuiz(root) {
    var view = root;                       // scoped to this render, not #view
    var bar = view.querySelector('#scoreBar');

    function refreshScore() {
      var keys = Object.keys(quizState);
      var done = 0, ok = 0;
      keys.forEach(function (k) {
        if (quizState[k] && quizState[k].answered) { done++; if (quizState[k].correct) ok++; }
      });
      bar.querySelector('[data-role="done"]').textContent = done;
      bar.querySelector('[data-role="ok"]').textContent = ok;
    }

    function record(key, correct) {
      quizState[key] = { answered: true, correct: !!correct };
      save(K.quiz, quizState);
      refreshScore();
    }

    function revealAnswer(qEl, item, markPicked) {
      var opts = qEl.querySelectorAll('.q-opt');
      var ans = Array.isArray(item.answer) ? item.answer : [item.answer];
      opts.forEach(function (o) {
        var oi = +o.dataset.i;
        if (ans.indexOf(oi) !== -1) o.classList.add('right');
        else if (markPicked && o.classList.contains('picked')) o.classList.add('wrong');
      });
      qEl.querySelector('.q-why').hidden = false;
      var flag = qEl.querySelector('.q-flag');
      if (flag) flag.hidden = false;
      qEl.dataset.done = '1';
    }

    view.addEventListener('click', function (e) {
      var resetBtn = e.target.closest('[data-act="reset"]');
      if (resetBtn) {
        quizState = {};
        save(K.quiz, quizState);
        go();
        toast('Quiz progress cleared');
        return;
      }

      var qEl = e.target.closest('.q');
      if (!qEl) return;
      var key = qEl.dataset.key;
      var item = quizItem(key);

      var reveal = e.target.closest('[data-act="reveal"]');
      if (reveal) {
        if (qEl.classList.contains('scr')) {
          var inp = qEl.querySelector('input');
          inp.value = item.answer;
          inp.classList.add('right');
          record(key, false);
        } else {
          revealAnswer(qEl, item, true);
          if (!quizState[key]) record(key, false);
        }
        return;
      }

      var opt = e.target.closest('.q-opt');
      if (opt) {
        if (qEl.dataset.done) return;
        var multi = qEl.dataset.multi === 'true';
        if (multi) {
          opt.classList.toggle('picked');
          return;
        }
        qEl.querySelectorAll('.q-opt').forEach(function (o) { o.classList.remove('picked'); });
        opt.classList.add('picked');
        var correct = +opt.dataset.i === item.answer;
        revealAnswer(qEl, item, true);
        record(key, correct);
        return;
      }

      var check = e.target.closest('[data-act="check"]');
      if (check) {
        if (qEl.dataset.done) return;
        var picked = [];
        qEl.querySelectorAll('.q-opt.picked').forEach(function (o) { picked.push(+o.dataset.i); });
        var ans = item.answer.slice().sort().join(',');
        revealAnswer(qEl, item, true);
        record(key, picked.sort().join(',') === ans);
      }
    });

    view.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var inp = e.target.closest('.scr input');
      if (!inp) return;
      var qEl = inp.closest('.q');
      var item = quizItem(qEl.dataset.key);
      var val = inp.value.replace(/\s+/g, '').toUpperCase();
      var want = item.answer.replace(/\s+/g, '').toUpperCase();
      var good = val === want;
      inp.classList.toggle('right', good);
      inp.classList.toggle('wrong', !good);
      record(qEl.dataset.key, good);
      if (good) toast('Correct');
    });

    refreshScore();
  }

  /* --------------------------- flashcards ------------------------- */
  function renderCards(view) {
    document.title = 'Flashcards — Indian Art Music';
    var deck = GLOSSARY.slice();
    // least-known first, then unseen, then the rest
    deck.sort(function (a, b) {
      var sa = cardState[a.term.toLowerCase()] || { known: 0 };
      var sb = cardState[b.term.toLowerCase()] || { known: 0 };
      return (sa.known || 0) - (sb.known || 0) || (Math.random() - 0.5);
    });

    var i = 0, flipped = false;

    view.innerHTML = '<div class="page"><div class="cards-wrap">' +
      '<div class="section-head"><h2>Flashcards</h2><span>' + deck.length + ' terms from the chapter key-word lists</span></div>' +
      '<div class="flashcard" id="fc"></div>' +
      '<div class="fc-controls">' +
        '<button class="btn" data-act="again">Again</button>' +
        '<button class="btn" data-act="flip">Flip <kbd>space</kbd></button>' +
        '<button class="btn primary" data-act="known">Got it</button>' +
      '</div>' +
      '<p class="fc-meta" id="fcMeta"></p>' +
      '</div></div>';

    var wrap = view.querySelector('.cards-wrap');   // fresh node each render
    var card = view.querySelector('#fc');
    var meta = view.querySelector('#fcMeta');

    function paint() {
      var g = deck[i % deck.length];
      var st = cardState[g.term.toLowerCase()] || { known: 0, again: 0 };
      card.innerHTML = '<span class="fc-src">Ch ' + g.ch.num + '</span>' +
        '<div class="fc-term">' + g.term + '</div>' +
        (flipped ? '<div class="fc-def">' + g.def + (g.extra.length ? '<br><br><i>' + g.extra.map(function (x) { return x.def; }).join('<br>') + '</i>' : '') + '</div>'
                 : '<span class="fc-hint">tap to reveal</span>');
      meta.innerHTML = (i % deck.length + 1) + ' of ' + deck.length +
        ' · got it ' + (st.known || 0) + '×, again ' + (st.again || 0) + '×' +
        ' · <a class="inline-link" href="#/' + g.ch.id + '#' + g.section + '">where this is taught</a>';
    }

    function mark(kind) {
      var g = deck[i % deck.length];
      var k = g.term.toLowerCase();
      var st = cardState[k] || { known: 0, again: 0 };
      st[kind] = (st[kind] || 0) + 1;
      cardState[k] = st;
      save(K.cards, cardState);
      i++; flipped = false; paint();
    }

    card.addEventListener('click', function () { flipped = !flipped; paint(); });
    wrap.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b) return;
      if (b.dataset.act === 'flip') { flipped = !flipped; paint(); }
      if (b.dataset.act === 'known') mark('known');
      if (b.dataset.act === 'again') mark('again');
    });

    view._cardKeys = function (e) {
      if (e.key === ' ') { e.preventDefault(); flipped = !flipped; paint(); }
      if (e.key === '1') mark('again');
      if (e.key === '2') mark('known');
    };
    paint();
  }

  /* ----------------------------- riyaz --------------------------- */
  function renderRiyaz(view) {
    document.title = 'Riyaz tools — Indian Art Music';
    var blocks = [
      { tool: 'drone', title: 'Your Sa', note: 'Fix your tonic first. Everything else in the app plays relative to it.' },
      { tool: 'tala', title: 'Tala player', note: 'Chapter 8. Tap any matra to hear its stroke, or run the whole cycle.' },
      { tool: 'swara-board', title: 'Swara board', note: 'Chapter 3. All twelve states, with notation and western equivalents.' },
      { tool: 'thaat', title: 'Thaat explorer', note: 'Chapter 9. Hear how one changed swara repaints the scale.' },
      { tool: 'raga-scale', title: 'Raga scales', note: 'Chapter 4 and 7. Aroha and avaroha for the three ragas your material writes out.' },
      { tool: 'alankar', title: 'Alankars / paltas', note: 'Chapter 3. Speed exercises on any thaat.' },
      { tool: 'nuance-lab', title: 'Nuance lab', note: 'Chapter 6. The six ornaments, synthesised.' },
      { tool: 'layakari', title: 'Layakari', note: 'Chapter 5. Thaah, dugun, tigun, chaugun against a fixed cycle.' }
    ];
    view.innerHTML = '<div class="page"><div class="article" style="max-width:840px">' +
      '<h1 class="ch-title">Riyaz tools</h1>' +
      '<p class="ch-sub">Everything playable, in one place. Sound is synthesised in the browser, so it works offline.</p>' +
      blocks.map(function (b) {
        return '<section><h2 id="' + b.tool + '">' + b.title + '</h2><p class="note-line">' + b.note + '</p>' +
          '<div class="tool" data-tool="' + b.tool + '"></div></section>';
      }).join('') +
      '</div></div>';
    VF.Tools.mount(view);
  }

  /* ---------------------------- glossary -------------------------- */
  function renderGlossary(view) {
    document.title = 'Glossary — Indian Art Music';
    view.innerHTML = '<div class="page"><div class="article" style="max-width:820px">' +
      '<h1 class="ch-title">Glossary</h1>' +
      '<p class="ch-sub">' + GLOSSARY.length + ' terms, lifted from the key-word lists and definitions in your chapters.</p>' +
      '<div class="gloss-filter"><input type="search" id="glossQ" placeholder="Filter terms…" autocomplete="off"></div>' +
      '<dl class="gloss-list" id="glossList"></dl>' +
      '</div></div>';

    function paint(filter) {
      filter = (filter || '').toLowerCase();
      var list = GLOSSARY.filter(function (g) {
        return !filter || g.term.toLowerCase().indexOf(filter) !== -1 || g.def.toLowerCase().indexOf(filter) !== -1;
      });
      document.getElementById('glossList').innerHTML = list.length ? list.map(function (g) {
        return '<div class="gloss-item">' +
          '<dt>' + g.term + '<a class="g-src" href="#/' + g.ch.id + '#' + g.section + '">Chapter ' + g.ch.num + ' →</a></dt>' +
          '<dd>' + g.def + (g.extra.length ? ' <i>' + g.extra.map(function (x) { return '(also: ' + x.def + ')'; }).join(' ') + '</i>' : '') + '</dd>' +
        '</div>';
      }).join('') : '<p class="search-empty">Nothing matches that.</p>';
    }
    document.getElementById('glossQ').addEventListener('input', function (e) { paint(e.target.value); });
    paint('');
  }

  /* ----------------------------- sources -------------------------- */
  function renderSources(view) {
    document.title = (CFG.pdfs ? 'Source PDFs' : 'Sources') + ' — Indian Art Music';

    var list = CFG.pdfs
      ? '<div class="src-list">' + CH.map(function (c) {
          return '<a class="src-item" href="' + pdfHref(c.pdf) + '" target="_blank" rel="noopener">' +
            '<span class="src-ic">▤</span><span><b>Chapter ' + c.num + ' · ' + c.title + '</b><span>' + c.pdf + '</span></span>' +
            '<span class="src-open">open ↗</span></a>';
        }).join('') + '</div>'
      : '<div class="callout task"><h5>The PDFs are not published with this copy</h5>' +
          '<p>This reader is derived from ten chapter PDFs of the Vrindaban Gurukul bansuri course. Those files are the gurukul&rsquo;s material, so they are not redistributed here &mdash; only the study reader is. If you are studying this course, you will have the PDFs from your guru.</p>' +
          '<p>Run this app in the same folder layout as the PDFs and every chapter gains an "Original PDF" button.</p>' +
        '</div>' +
        '<div class="src-list">' + CH.map(function (c) {
          return '<div class="src-item" style="cursor:default">' +
            '<span class="src-ic">▤</span><span><b>Chapter ' + c.num + ' · ' + c.title + '</b><span>' + c.pdf + '</span></span>' +
            '<span class="src-open" style="color:var(--ink-3)">not published</span></div>';
        }).join('') + '</div>';

    view.innerHTML = '<div class="page"><div class="article" style="max-width:780px">' +
      '<h1 class="ch-title">' + (CFG.pdfs ? 'Source PDFs' : 'Sources') + '</h1>' +
      '<p class="ch-sub">' + (CFG.pdfs ? 'The originals, untouched, in the folder above this one.' : 'What this reader was built from.') + '</p>' +
      list +
      '<div class="callout fig" style="margin-top:24px"><h5>Known problems in the sources</h5>' +
        '<p>Chapter 1 stops mid-sentence under "Notation in music". Chapters 1, 4, 9 and 10 carry chapter numbers from a different course outline (#3, #8, 22, #19/#20). Chapter 2 ends with material that belongs to Chapter 3, and Chapter 7 contains a block about taal jati that belongs with Chapter 8. Chapter 9 prints all ten thaats identically because the komal and teevra marks were lost. Ek Taal is described as 2+2+2+2+2+2+2, which adds to 14 rather than its 12 matras.</p>' +
        '<p>Each of those is called out in place, where it matters.</p>' +
      '</div>' +
      '</div></div>';
  }

  /* ----------------------------- search UI ------------------------ */
  var overlay = document.getElementById('searchOverlay');
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');
  var cursor = -1;

  function openSearch() {
    overlay.hidden = false;
    input.value = '';
    results.innerHTML = '<p class="search-empty">Type at least two letters.</p>';
    cursor = -1;
    input.focus();
  }
  function closeSearch() { overlay.hidden = true; }

  function paintResults() {
    var q = input.value;
    var hits = search(q);
    if (!hits.length) {
      results.innerHTML = '<p class="search-empty">' + (q.trim().length < 2 ? 'Type at least two letters.' : 'No matches.') + '</p>';
      return;
    }
    results.innerHTML = hits.map(function (hit, i) {
      var r = hit.row;
      var href = '#/' + r.ch.id + (r.section ? '#' + r.section.id : '');
      return '<a class="sr-item' + (i === 0 ? ' on' : '') + '" href="' + href + '">' +
        '<div class="sr-top"><span class="sr-ch">Ch ' + r.ch.num + (r.glossary ? ' · term' : '') + '</span><span class="sr-head">' + esc(r.heading) + '</span></div>' +
        '<div class="sr-snippet">' + snippet(r.text, q, hit.at) + '</div>' +
      '</a>';
    }).join('');
    cursor = 0;
  }

  function moveCursor(d) {
    var items = results.querySelectorAll('.sr-item');
    if (!items.length) return;
    items[Math.max(0, cursor)].classList.remove('on');
    cursor = (cursor + d + items.length) % items.length;
    items[cursor].classList.add('on');
    items[cursor].scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('input', paintResults);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
  results.addEventListener('click', function (e) { if (e.target.closest('.sr-item')) closeSearch(); });

  document.getElementById('searchBtn').addEventListener('click', openSearch);

  /* ----------------------------- chrome --------------------------- */
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    save(K.theme, t);
  }
  applyTheme(load(K.theme, window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  document.getElementById('themeBtn').addEventListener('click', function () {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  var droneBtn = document.getElementById('droneBtn');
  droneBtn.addEventListener('click', function () {
    if (A.droneOn()) { A.stopDrone(); droneBtn.classList.remove('on'); toast('Drone off'); }
    else { A.startDrone(); droneBtn.classList.add('on'); toast('Drone on · Sa = ' + A.saName()); }
  });
  document.addEventListener('vf:sa-changed', function () {
    droneBtn.classList.toggle('on', A.droneOn());
    toast('Sa = ' + A.saName());
  });

  document.getElementById('menuBtn').addEventListener('click', function () {
    var open = document.body.classList.toggle('nav-open');
    this.setAttribute('aria-expanded', String(open));
  });

  /* ---------------------------- keyboard -------------------------- */
  document.addEventListener('keydown', function (e) {
    var typing = /input|textarea|select/i.test(document.activeElement.tagName);

    if (!overlay.hidden) {
      if (e.key === 'Escape') { closeSearch(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); moveCursor(1); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); moveCursor(-1); return; }
      if (e.key === 'Enter') {
        var on = results.querySelector('.sr-item.on');
        if (on) { location.hash = on.getAttribute('href').slice(1); closeSearch(); }
        return;
      }
      return;
    }

    if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !typing) {
      e.preventDefault(); openSearch(); return;
    }
    if (typing) return;

    var r = route();
    var cur = /^\/ch\d\d$/.test(r.path) ? chapterById(r.path.slice(1)) : null;
    var view = document.getElementById('view');

    if (e.key === 'ArrowRight' && cur) {
      var nx = CH[CH.indexOf(cur) + 1]; if (nx) location.hash = '#/' + nx.id;
    }
    if (e.key === 'ArrowLeft' && cur) {
      var pv = CH[CH.indexOf(cur) - 1]; if (pv) location.hash = '#/' + pv.id;
    }
    if (e.key === 'm' && cur) {
      var now = toggleRead(cur.id);
      toast(now ? 'Marked as read' : 'Marked as unread');
      go();
    }
    if (e.key === 't') document.getElementById('themeBtn').click();
    if (e.key === 'd') droneBtn.click();
    if (view._cardKeys && r.path === '/cards') view._cardKeys(e);
  });

  /* ------------------------------ boot --------------------------- */
  if (!CFG.pdfs) {
    var sl = document.querySelector('#sourcesLink .nl-text');
    if (sl) sl.textContent = 'Sources';
  }
  window.addEventListener('hashchange', go);
  buildNav();
  paintProgress();
  go();
})();
