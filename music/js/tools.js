/* ------------------------------------------------------------------
   Interactive study tools. Each one is registered under a name and
   hydrated wherever a chapter has <div class="tool" data-tool="name">.
   ------------------------------------------------------------------ */
window.VF = window.VF || {};

VF.Tools = (function () {
  var A = VF.Audio;

  /* ---------------- small helpers ---------------- */
  function h(html) {
    var d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstElementChild;
  }

  function mod12(n) { return ((n % 12) + 12) % 12; }

  /* tools that own running audio register a stop function here; the list
     is drained on every route change, so nothing keeps playing and no
     listeners pile up across renders */
  var teardown = [];
  document.addEventListener('vf:route-change', function () {
    teardown.forEach(function (fn) { try { fn(); } catch (e) {} });
    teardown = [];
  });

  /* swara name as HTML, with komal underline, teevra mark and octave dots */
  function swaraHTML(semi, opts) {
    opts = opts || {};
    var sw = window.SWARAS[mod12(semi)];
    var oct = Math.floor(semi / 12);
    var cls = 'sw';
    if (sw.state === 'komal') cls += ' komal';
    if (sw.state === 'teevra') cls += ' teevra';
    if (oct > 0) cls += ' oct-up';
    if (oct < 0) cls += ' oct-down';
    var label = opts.short ? sw.short.replace("'", '') : sw.label;
    if (sw.state === 'teevra' && !opts.short) label = '\u1E3Ea';   // Ḿa
    var dots = '';
    if (oct > 0) dots = '<i class="oct" aria-hidden="true">' + (oct > 1 ? '\u00A8' : '\u02D9') + '</i>';
    if (oct < 0) dots = '<i class="oct below" aria-hidden="true">' + (oct < -1 ? '\u00A8' : '\u02D9') + '</i>';
    var title = sw.full + ' \u2014 ' + sw.state + (oct ? (oct > 0 ? ', tar' : ', mandra') : '');
    return '<span class="' + cls + '" title="' + title + '">' + label + dots + '</span>';
  }

  function swaraButtons(notes, opts) {
    return notes.map(function (n) {
      return '<button class="note-btn" data-semi="' + n + '">' + swaraHTML(n, opts) + '</button>';
    }).join('');
  }

  /* play whichever note button was clicked */
  function wireNoteButtons(root, dur) {
    root.addEventListener('click', function (e) {
      var b = e.target.closest('.note-btn');
      if (!b) return;
      A.note(parseInt(b.dataset.semi, 10), dur || 0.7);
      b.classList.add('lit');
      setTimeout(function () { b.classList.remove('lit'); }, 320);
    });
  }

  /* play a sequence and light each button as it sounds */
  function playRun(root, notes, noteDur) {
    var btns = root.querySelectorAll('.note-btn');
    A.sequence(notes, noteDur || 0.3, 0.02, 0, function (i) {
      btns.forEach(function (b) { b.classList.remove('lit'); });
      if (i >= 0 && btns[i]) btns[i].classList.add('lit');
    });
  }

  var T = {};

  /* ============================= CH 2 ============================= */
  T.shruti = function (el) {
    var chips = window.SHRUTIS.map(function (n, i) {
      return '<li><span class="num">' + (i + 1) + '</span>' + n + '</li>';
    }).join('');
    el.appendChild(h(
      '<div class="panel">' +
        '<div class="panel-head"><h4>The 22 shrutis</h4><span class="badge warn">added reference</span></div>' +
        '<ol class="shruti-grid">' + chips + '</ol>' +
        '<p class="fine">Sarangadeva, <i>Sangita Ratnakara</i>, 13th century. A shruti has no independent existence &mdash; it shows itself inside a melodic phrase, especially during embellishments such as gamak.</p>' +
      '</div>'
    ));
  };

  /* ============================= CH 3 ============================= */
  T.animals = function (el) {
    var rows = window.ANIMALS.map(function (a) {
      return '<tr><td class="c-swara">' + a.swara + '</td><td>' + a.full + '</td><td><span class="glyph">' + a.glyph + '</span>' + a.animal + '</td></tr>';
    }).join('');
    el.appendChild(h(
      '<div class="panel">' +
        '<div class="panel-head"><h4>Swaras and the sounds of birds and animals</h4><span class="badge warn">added reference</span></div>' +
        '<table class="tbl"><thead><tr><th>Swara</th><th>Full name</th><th>Sound linked to</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '</div>'
    ));
  };

  T['swara-board'] = function (el) {
    var all = window.SWARAS.map(function (s) {
      return '<button class="key ' + s.state + '" data-semi="' + s.s + '">' +
        '<span class="key-label">' + swaraHTML(s.s) + '</span>' +
        '<span class="key-meta">' + s.state + '</span>' +
        '<span class="key-west">' + s.west + '</span>' +
      '</button>';
    }).join('');
    var panel = h(
      '<div class="panel">' +
        '<div class="panel-head"><h4>The twelve swara states</h4>' +
          '<div class="head-actions"><button class="btn sm" data-act="asc">Play shuddha saptak</button><button class="btn sm" data-act="all">Play all twelve</button></div>' +
        '</div>' +
        '<div class="keyboard">' + all + '</div>' +
        '<ul class="legend">' +
          '<li><span class="swatch shuddha"></span>shuddha &mdash; pure, no mark</li>' +
          '<li><span class="swatch komal"></span>komal &mdash; written with an underline</li>' +
          '<li><span class="swatch teevra"></span>teevra &mdash; written &#7742;a</li>' +
          '<li><b>Sa</b> and <b>Pa</b> are <i>achal</i>: they never move</li>' +
        '</ul>' +
      '</div>'
    );
    panel.addEventListener('click', function (e) {
      var k = e.target.closest('.key');
      if (k) {
        A.note(parseInt(k.dataset.semi, 10), 0.8);
        k.classList.add('lit');
        setTimeout(function () { k.classList.remove('lit'); }, 380);
        return;
      }
      var b = e.target.closest('button[data-act]');
      if (!b) return;
      var keys = panel.querySelectorAll('.key');
      var notes = b.dataset.act === 'asc' ? [0, 2, 4, 5, 7, 9, 11, 12] : [0,1,2,3,4,5,6,7,8,9,10,11,12];
      A.sequence(notes, 0.34, 0.02, 0, function (i) {
        keys.forEach(function (k2) { k2.classList.remove('lit'); });
        if (i >= 0) {
          var semi = notes[i];
          var target = panel.querySelector('.key[data-semi="' + mod12(semi) + '"]');
          if (target) target.classList.add('lit');
        }
      });
    });
    el.appendChild(panel);
  };

  T['saptak-map'] = function (el) {
    var shuddha = [0, 2, 4, 5, 7, 9, 11, 12];
    var rows = shuddha.map(function (s) {
      var sw = window.SWARAS[mod12(s)];
      return '<tr><td>' + swaraHTML(s) + '</td><td>' + sw.full + '</td><td>' + sw.short + '</td><td>' + sw.west + (s === 12 ? '\u2032' : '') + '</td><td>' + (s === 12 ? 'completes the saptak, twice the frequency of the tonic' : (sw.achal ? 'achal, never moves' : '\u2014')) + '</td></tr>';
    }).join('');
    var panel = h(
      '<div class="panel">' +
        '<div class="panel-head"><h4>Saptak and western equivalents</h4>' +
          '<div class="head-actions"><button class="btn sm" data-act="up">Aroha</button><button class="btn sm" data-act="down">Avaroha</button></div></div>' +
        '<table class="tbl"><thead><tr><th>Swara</th><th>Full name</th><th>Short</th><th>Western</th><th>Note</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<p class="fine">Sa is shown as C only because that is the usual teaching convention. In practice you choose your own Sa &mdash; see Chapter 4 on pitch.</p>' +
      '</div>'
    );
    panel.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-act]');
      if (!b) return;
      var trs = panel.querySelectorAll('tbody tr');
      var order = b.dataset.act === 'up' ? shuddha : shuddha.slice().reverse();
      A.sequence(order, 0.36, 0.02, 0, function (i) {
        trs.forEach(function (t) { t.classList.remove('lit'); });
        if (i >= 0) {
          var idx = shuddha.indexOf(order[i]);
          if (trs[idx]) trs[idx].classList.add('lit');
        }
      });
    });
    el.appendChild(panel);
  };

  T.alankar = function (el) {
    var thaatOpts = window.THAATS.map(function (t) {
      return '<option value="' + t.id + '"' + (t.id === 'bilawal' ? ' selected' : '') + '>' + t.name + '</option>';
    }).join('');
    var panel = h(
      '<div class="panel">' +
        '<div class="panel-head"><h4>Alankar / palta practice</h4><span class="badge warn">added</span></div>' +
        '<div class="controls">' +
          '<label>Scale <select data-role="thaat">' + thaatOpts + '</select></label>' +
          '<label>Speed <input type="range" min="60" max="240" value="120" data-role="speed"><span class="val" data-role="speedval">120</span></label>' +
        '</div>' +
        '<div class="alankar-list"></div>' +
      '</div>'
    );

    function scaleNotes(id) {
      var t = window.THAATS.filter(function (x) { return x.id === id; })[0];
      return t.notes.concat([12]);
    }
    function buildPattern(kind, sc) {
      var out = [], i;
      if (kind === 'plain') {
        out = sc.concat(sc.slice(0, -1).reverse());
      } else if (kind === 'pairs') {
        for (i = 0; i < sc.length - 1; i++) out.push(sc[i], sc[i + 1]);
        for (i = sc.length - 1; i > 0; i--) out.push(sc[i], sc[i - 1]);
      } else {
        for (i = 0; i < sc.length - 2; i++) out.push(sc[i], sc[i + 1], sc[i + 2]);
        for (i = sc.length - 1; i > 1; i--) out.push(sc[i], sc[i - 1], sc[i - 2]);
      }
      return out;
    }

    function render() {
      var id = panel.querySelector('[data-role="thaat"]').value;
      var sc = scaleNotes(id);
      var list = panel.querySelector('.alankar-list');
      list.innerHTML = window.ALANKARS.map(function (al, idx) {
        var notes = buildPattern(al.pattern, sc);
        return '<div class="alankar" data-idx="' + idx + '">' +
            '<div class="alankar-head"><b>' + al.name + '</b><span class="fine">' + al.gloss + '</span>' +
              '<button class="btn sm play" data-idx="' + idx + '">Play</button></div>' +
            '<div class="run">' + notes.map(function (n) { return '<span class="note-cell">' + swaraHTML(n, { short: true }) + '</span>'; }).join('') + '</div>' +
          '</div>';
      }).join('');
    }

    panel.addEventListener('input', function (e) {
      if (e.target.dataset.role === 'speed') {
        panel.querySelector('[data-role="speedval"]').textContent = e.target.value;
      }
      if (e.target.dataset.role === 'thaat') render();
    });
    panel.addEventListener('change', function (e) {
      if (e.target.dataset.role === 'thaat') render();
    });
    panel.addEventListener('click', function (e) {
      var b = e.target.closest('button.play');
      if (!b) return;
      var idx = parseInt(b.dataset.idx, 10);
      var id = panel.querySelector('[data-role="thaat"]').value;
      var bpm = parseInt(panel.querySelector('[data-role="speed"]').value, 10);
      var notes = buildPattern(window.ALANKARS[idx].pattern, scaleNotes(id));
      var dur = 60 / bpm;
      var cells = panel.querySelectorAll('.alankar[data-idx="' + idx + '"] .note-cell');
      A.sequence(notes, dur * 0.9, dur * 0.1, 0, function (i) {
        cells.forEach(function (c) { c.classList.remove('lit'); });
        if (i >= 0 && cells[i]) cells[i].classList.add('lit');
      });
    });
    el.appendChild(panel);
    render();
  };

  /* ============================= CH 4 ============================= */
  T['raga-scale'] = function (el) {
    var tabs = window.RAGAS.map(function (r, i) {
      return '<button class="tab' + (i === 0 ? ' on' : '') + '" data-raga="' + r.id + '">' + r.name + '</button>';
    }).join('');
    var panel = h(
      '<div class="panel">' +
        '<div class="panel-head"><h4>Aroha &amp; avaroha</h4><span class="badge">from your PDFs</span></div>' +
        '<div class="tabs">' + tabs + '</div>' +
        '<div class="raga-body"></div>' +
      '</div>'
    );

    function render(id) {
      var r = window.RAGAS.filter(function (x) { return x.id === id; })[0];
      panel.querySelector('.raga-body').innerHTML =
        '<div class="raga-meta"><span><b>Thaat</b> ' + r.thaat + '</span><span><b>Jati</b> ' + r.jati + '</span></div>' +
        '<div class="scale-row"><div class="scale-label">Aroha<button class="btn sm" data-play="aroha">Play</button></div>' +
          '<div class="run" data-run="aroha">' + r.aroha.map(function (n) { return '<span class="note-cell">' + swaraHTML(n) + '</span>'; }).join('') + '</div></div>' +
        '<div class="scale-row"><div class="scale-label">Avaroha<button class="btn sm" data-play="avaroha">Play</button></div>' +
          '<div class="run" data-run="avaroha">' + r.avaroha.map(function (n) { return '<span class="note-cell">' + swaraHTML(n) + '</span>'; }).join('') + '</div></div>' +
        '<p class="fine">' + r.note + '</p>';
    }

    panel.addEventListener('click', function (e) {
      var tab = e.target.closest('.tab');
      if (tab) {
        panel.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('on'); });
        tab.classList.add('on');
        render(tab.dataset.raga);
        return;
      }
      var p = e.target.closest('[data-play]');
      if (!p) return;
      var id = panel.querySelector('.tab.on').dataset.raga;
      var r = window.RAGAS.filter(function (x) { return x.id === id; })[0];
      var which = p.dataset.play;
      var cells = panel.querySelectorAll('[data-run="' + which + '"] .note-cell');
      A.sequence(r[which], 0.4, 0.03, 0, function (i) {
        cells.forEach(function (c) { c.classList.remove('lit'); });
        if (i >= 0 && cells[i]) cells[i].classList.add('lit');
      });
    });
    el.appendChild(panel);
    render(window.RAGAS[0].id);
  };

  T.drone = function (el) {
    var opts = A.pitchNames.map(function (n, i) {
      return '<option value="' + i + '"' + (i === A.getSa() ? ' selected' : '') + '>' + n + '</option>';
    }).join('');
    var panel = h(
      '<div class="panel drone-panel">' +
        '<div class="panel-head"><h4>Your Sa</h4><span class="badge warn">added</span></div>' +
        '<div class="controls">' +
          '<label>Tonic Sa <select data-role="sa">' + opts + '</select></label>' +
          '<button class="btn primary" data-role="toggle">' + (A.droneOn() ? 'Stop drone' : 'Start drone') + '</button>' +
          '<span class="fine">Sa, its lower octave and Pa &mdash; the pitches a tanpura gives you.</span>' +
        '</div>' +
      '</div>'
    );
    panel.addEventListener('change', function (e) {
      if (e.target.dataset.role === 'sa') {
        A.setSa(parseInt(e.target.value, 10));
        document.dispatchEvent(new CustomEvent('vf:sa-changed'));
      }
    });
    panel.addEventListener('click', function (e) {
      var b = e.target.closest('[data-role="toggle"]');
      if (!b) return;
      if (A.droneOn()) { A.stopDrone(); b.textContent = 'Start drone'; b.classList.remove('on'); }
      else { A.startDrone(); b.textContent = 'Stop drone'; b.classList.add('on'); }
    });
    el.appendChild(panel);
  };

  T.evolution = function (el) {
    var steps = window.EVOLUTION.map(function (s) {
      var branch = '';
      if (s.branches) {
        branch = '<div class="branches">' + s.branches.map(function (b) {
          return '<div class="branch"><b>' + b.name + '</b><span>' + b.gloss + '</span></div>';
        }).join('') + '</div>';
      }
      return '<li><div class="step"><b>' + s.name + '</b><span>' + s.gloss + '</span></div>' + branch + '</li>';
    }).join('');
    el.appendChild(h('<div class="panel"><ol class="evolution">' + steps + '</ol></div>'));
  };

  T['raga-features'] = function (el) {
    var cards = window.RAGA_FEATURES.map(function (f) {
      return '<a class="feature" href="#/' + f.where + '#' + f.anchor + '">' +
        '<b>' + f.name + '</b><span>' + f.gloss + '</span>' +
        '<i>Ch ' + parseInt(f.where.replace('ch', ''), 10) + '</i></a>';
    }).join('');
    el.appendChild(h(
      '<div class="panel">' +
        '<div class="panel-head"><h4>Every feature of a raga, in one place</h4><span class="badge warn">added index</span></div>' +
        '<div class="features">' + cards + '</div>' +
      '</div>'
    ));
  };

  /* ============================= CH 5 ============================= */
  T.purvang = function (el) {
    var notes = [0, 2, 4, 5, 7, 9, 11, 12];
    var cells = notes.map(function (n, i) {
      return '<div class="split-cell ' + (i < 4 ? 'purvang' : 'uttarang') + '">' + swaraHTML(n) + '</div>';
    }).join('');
    el.appendChild(h(
      '<div class="panel">' +
        '<div class="split-row">' + cells + '</div>' +
        '<div class="split-legend"><span class="purvang">Purvang &mdash; vadi here means a PM raga</span><span class="uttarang">Uttarang &mdash; vadi here means an AM raga</span></div>' +
      '</div>'
    ));
  };

  T.layakari = function (el) {
    var guns = [
      { name: 'Thaah', mult: 1, gloss: 'original tempo, one swara per matra' },
      { name: 'Dugun', mult: 2, gloss: 'twice, two swaras per matra' },
      { name: 'Tigun', mult: 3, gloss: 'three times, three swaras per matra' },
      { name: 'Chaugun', mult: 4, gloss: 'four times, four swaras per matra' }
    ];
    var rows = guns.map(function (g) {
      var cells = '';
      for (var m = 1; m <= 8; m++) {
        var inner = '';
        for (var k = 0; k < g.mult; k++) inner += '<i></i>';
        cells += '<div class="lk-matra' + (m === 1 ? ' sam' : '') + '"><span class="lk-num">' + m + '</span><div class="lk-dots">' + inner + '</div></div>';
      }
      return '<div class="lk-row"><div class="lk-name"><b>' + g.name + '</b><span class="fine">' + g.gloss + '</span></div><div class="lk-cells">' + cells + '</div></div>';
    }).join('');
    el.appendChild(h(
      '<div class="panel">' +
        '<div class="panel-head"><h4>One cycle, four speeds</h4><span class="badge warn">added</span></div>' +
        '<div class="layakari">' + rows + '</div>' +
        '<p class="fine">The matras stay exactly as long. What changes is how many swaras you fit inside each one.</p>' +
      '</div>'
    ));
  };

  /* ============================= CH 6 ============================= */
  T['nuance-lab'] = function (el) {
    var orn = [
      { id: 'plain',  name: 'Plain note', gloss: 'The bare swara, for comparison' },
      { id: 'gamak',  name: 'Gamak',  gloss: 'Twists and turns between two notes: a broad shake' },
      { id: 'tan',    name: 'Tan',    gloss: 'Notes sprinted one after another, like an arpeggio' },
      { id: 'kana',   name: 'Kana',   gloss: 'A grace note touched before the principal note' },
      { id: 'meend',  name: 'Meend',  gloss: 'A slow glide linking notes, like appoggiatura' },
      { id: 'murki',  name: 'Murki',  gloss: 'Notes around the principal note, quick and quivering' },
      { id: 'khatka', name: 'Khatka', gloss: 'A jerky, very fast attack on the principal note' }
    ];
    var cards = orn.map(function (o) {
      return '<button class="ornament" data-orn="' + o.id + '"><b>' + o.name + '</b><span>' + o.gloss + '</span><i class="play-ic">&#9654;</i></button>';
    }).join('');
    var noteOpts = [0, 2, 4, 5, 7, 9, 11].map(function (n) {
      return '<option value="' + n + '"' + (n === 7 ? ' selected' : '') + '>' + window.SWARAS[n].label + '</option>';
    }).join('');
    var panel = h(
      '<div class="panel">' +
        '<div class="panel-head"><h4>Nuance lab</h4><span class="badge warn">synthesised, not a real bansuri</span></div>' +
        '<div class="controls"><label>Principal swara <select data-role="base">' + noteOpts + '</select></label></div>' +
        '<div class="ornaments">' + cards + '</div>' +
      '</div>'
    );
    panel.addEventListener('click', function (e) {
      var b = e.target.closest('.ornament');
      if (!b) return;
      var base = parseInt(panel.querySelector('[data-role="base"]').value, 10);
      var dur = A.ornament(b.dataset.orn, base) || 1;
      b.classList.add('lit');
      setTimeout(function () { b.classList.remove('lit'); }, dur * 1000);
    });
    el.appendChild(panel);
  };

  T.tihai = function (el) {
    var total = 16, phrase = 5, start = 2;
    var cells = '';
    for (var m = 1; m <= total; m++) {
      var rep = -1;
      if (m >= start) rep = Math.floor((m - start) / phrase);
      var cls = 'th-cell';
      if (m === 1) cls += ' sam';
      if (rep >= 0 && rep < 3) cls += ' r' + rep;
      cells += '<div class="' + cls + '"><span>' + m + '</span></div>';
    }
    el.appendChild(h(
      '<div class="panel">' +
        '<div class="panel-head"><h4>How a tihai lands on sam</h4><span class="badge warn">added illustration</span></div>' +
        '<div class="tihai-row">' + cells + '<div class="th-cell sam land"><span>1</span></div></div>' +
        '<p class="fine">A 5-matra phrase, played three times from matra 2 of a 16-matra cycle: 2 + 15 = 17, which is the sam of the next avartan. That arithmetic (start + 3 &times; phrase = matras + 1) is the whole trick.</p>' +
      '</div>'
    ));
  };

  /* ============================= CH 7 ============================= */
  T.prahar = function (el) {
    function group(half) {
      return window.PRAHARS.filter(function (p) { return p.half === half; }).map(function (p) {
        return '<div class="prahar' + (p.raga ? ' has-raga' : '') + (p.twilight ? ' twilight' : '') + '">' +
          '<span class="p-n">' + p.n + '</span>' +
          '<span class="p-time">' + p.from + ' &ndash; ' + p.to + '</span>' +
          (p.raga ? '<span class="p-raga">' + p.raga + '</span>' : '<span class="p-raga empty">&mdash;</span>') +
        '</div>';
      }).join('');
    }
    el.appendChild(h(
      '<div class="panel">' +
        '<div class="prahar-wrap">' +
          '<div class="prahar-half"><h5>Day prahars</h5>' + group('day') + '</div>' +
          '<div class="prahar-half"><h5>Night prahars</h5>' + group('night') + '</div>' +
        '</div>' +
        '<ul class="legend">' +
          '<li><span class="swatch has-raga"></span>the two examples your PDF gives</li>' +
          '<li><span class="swatch twilight"></span>includes the 4&ndash;7 window: sandhiprakash or twilight ragas</li>' +
        '</ul>' +
        '<p class="fine">Vadi in the purvanga (S R G M) points to PM hours. Vadi in the uttaranga (P D N tar Sa) points to AM hours.</p>' +
      '</div>'
    ));
  };

  T.jati = function (el) {
    var cells = window.JATIS.map(function (j) {
      return '<div class="jati-cell' + (j.eg ? ' has-eg' : '') + '">' +
        '<span class="j-pair">' + j.aroha + ' &ndash; ' + j.avaroha + '</span>' +
        (j.eg ? '<span class="j-eg">' + j.eg + '</span>' : '') +
      '</div>';
    }).join('');
    el.appendChild(h(
      '<div class="panel">' +
        '<div class="jati-grid">' + cells + '</div>' +
        '<p class="fine">Aroha jati first, avaroha jati second. Only the combinations with an example are named in your PDFs.</p>' +
      '</div>'
    ));
  };

  T.rasa = function (el) {
    var cards = window.RASAS.map(function (r) {
      return '<div class="rasa' + (r.original ? '' : ' later') + '">' +
        '<span class="r-glyph">' + r.glyph + '</span>' +
        '<b>' + r.name + '</b><span class="r-mood">' + r.mood + '</span>' +
      '</div>';
    }).join('');
    el.appendChild(h(
      '<div class="panel">' +
        '<div class="rasa-grid">' + cards + '</div>' +
        '<p class="fine">Bharata named 8 in the Natyashastra. Shanta and bhakti were added later &mdash; shown faded here.</p>' +
      '</div>'
    ));
  };

  /* ============================= CH 8 ============================= */
  T.tala = function (el) {
    var tabs = window.TALAS.map(function (t, i) {
      return '<button class="tab' + (i === 0 ? ' on' : '') + '" data-tala="' + t.id + '">' + t.name +
        '<span class="t-beats">' + t.matras + '</span>' + (t.extra ? '<i class="star" title="added, not in your PDF">+</i>' : '') + '</button>';
    }).join('');
    var layaBtns = window.LAYAS.map(function (l) {
      return '<button class="btn sm laya" data-bpm="' + l.bpm + '" title="' + l.desc + '">' + l.name + '</button>';
    }).join('');

    var panel = h(
      '<div class="panel tala-panel">' +
        '<div class="panel-head"><h4>Tala player</h4><span class="badge">rebuilt from your PDFs</span></div>' +
        '<div class="tabs tala-tabs">' + tabs + '</div>' +
        '<div class="tala-meta"></div>' +
        '<div class="tala-grid"></div>' +
        '<div class="controls tala-controls">' +
          '<button class="btn primary" data-role="play">Play cycle</button>' +
          '<span class="laya-group">' + layaBtns + '</span>' +
          '<label class="tempo">Tempo <input type="range" min="40" max="260" value="110" data-role="bpm"><span class="val" data-role="bpmval">110</span> bpm</label>' +
          '<span class="avartan">Avartan <b data-role="avartan">0</b></span>' +
        '</div>' +
        '<p class="fine" data-role="bolnote"></p>' +
      '</div>'
    );

    var current = window.TALAS[0];
    var metro = null;
    var avartan = 0;

    function markClass(mark) {
      if (mark === 'X') return 'sam';
      if (mark === '0') return 'khaali';
      if (mark) return 'taali';
      return '';
    }

    function render() {
      var t = current;
      panel.querySelector('.tala-meta').innerHTML =
        '<span><b>' + t.matras + '</b> matras</span>' +
        '<span><b>Angs</b> ' + t.angs.join(' + ') + '</span>' +
        '<span><b>Jati</b> ' + t.jati + '</span>' +
        '<span><b>Character</b> ' + t.bhava + '</span>' +
        '<span><b>Used in</b> ' + t.use + '</span>' +
        (t.extra ? '<span class="badge warn">added, not in your PDF</span>' : '');

      var html = '';
      var matra = 1;
      t.angs.forEach(function (angLen) {
        html += '<div class="ang">';
        for (var i = 0; i < angLen; i++) {
          var mark = t.marks[matra] || '';
          html += '<div class="matra ' + markClass(mark) + '" data-matra="' + matra + '">' +
            '<span class="m-mark">' + (mark || '&nbsp;') + '</span>' +
            '<span class="m-bol">' + (t.bols[matra - 1] || '') + '</span>' +
            '<span class="m-num">' + matra + '</span>' +
          '</div>';
          matra++;
        }
        html += '</div>';
      });
      panel.querySelector('.tala-grid').innerHTML = html;
      panel.querySelector('[data-role="bolnote"]').innerHTML =
        '<b>X</b> sam and first taali &middot; <b>2 3 4</b> further taalis &middot; <b>0</b> khaali. ' + (t.bolNote || '');
      avartan = 0;
      panel.querySelector('[data-role="avartan"]').textContent = '0';
    }

    function highlight(beat) {
      panel.querySelectorAll('.matra').forEach(function (m) { m.classList.remove('now'); });
      if (beat < 0) return;
      var cell = panel.querySelector('.matra[data-matra="' + (beat + 1) + '"]');
      if (cell) cell.classList.add('now');
      if (beat === 0) {
        avartan++;
        panel.querySelector('[data-role="avartan"]').textContent = String(avartan);
      }
    }

    function stop() {
      if (metro) { metro.stop(); metro = null; }
      panel.querySelector('[data-role="play"]').textContent = 'Play cycle';
      panel.querySelector('[data-role="play"]').classList.remove('on');
      panel.querySelectorAll('.matra').forEach(function (m) { m.classList.remove('now'); });
    }

    function start() {
      var bpm = parseInt(panel.querySelector('[data-role="bpm"]').value, 10);
      var t = current;
      avartan = 0;
      metro = new A.Metronome({
        bpm: bpm,
        beats: t.matras,
        kindFor: function (b) {
          var mark = t.marks[b + 1];
          if (mark === 'X') return 'sam';
          if (mark === '0') return 'khaali';
          if (mark) return 'taali';
          return 'tick';
        },
        onBeat: highlight
      });
      metro.start();
      panel.querySelector('[data-role="play"]').textContent = 'Stop';
      panel.querySelector('[data-role="play"]').classList.add('on');
    }

    panel.addEventListener('click', function (e) {
      var tab = e.target.closest('.tab');
      if (tab) {
        panel.querySelectorAll('.tala-tabs .tab').forEach(function (x) { x.classList.remove('on'); });
        tab.classList.add('on');
        current = window.TALAS.filter(function (x) { return x.id === tab.dataset.tala; })[0];
        var wasRunning = !!metro;
        stop();
        render();
        if (wasRunning) start();
        return;
      }
      var laya = e.target.closest('.laya');
      if (laya) {
        var v = laya.dataset.bpm;
        panel.querySelector('[data-role="bpm"]').value = v;
        panel.querySelector('[data-role="bpmval"]').textContent = v;
        if (metro) metro.setBpm(parseInt(v, 10));
        panel.querySelectorAll('.laya').forEach(function (x) { x.classList.remove('on'); });
        laya.classList.add('on');
        return;
      }
      var matra = e.target.closest('.matra');
      if (matra) {
        var mark = current.marks[matra.dataset.matra] || '';
        A.click(markClass(mark) || 'tick');
        matra.classList.add('tap');
        setTimeout(function () { matra.classList.remove('tap'); }, 220);
        return;
      }
      if (e.target.closest('[data-role="play"]')) {
        if (metro) stop(); else start();
      }
    });

    panel.addEventListener('input', function (e) {
      if (e.target.dataset.role === 'bpm') {
        panel.querySelector('[data-role="bpmval"]').textContent = e.target.value;
        if (metro) metro.setBpm(parseInt(e.target.value, 10));
      }
    });

    teardown.push(stop);
    el.appendChild(panel);
    render();
  };

  /* ============================= CH 9 ============================= */
  T.thaat = function (el) {
    var rows = window.THAATS.map(function (t) {
      var notes = t.notes.concat([12]);
      return '<div class="thaat-row" data-thaat="' + t.id + '">' +
        '<div class="th-name"><b>' + t.name + '</b><span class="fine">' + t.rule + '</span></div>' +
        '<div class="run">' + notes.map(function (n) { return '<span class="note-cell">' + swaraHTML(n) + '</span>'; }).join('') + '</div>' +
        '<div class="th-actions"><button class="btn sm" data-play="asc">&#9650;</button><button class="btn sm" data-play="desc">&#9660;</button></div>' +
        '<p class="th-note fine">' + t.note + '</p>' +
      '</div>';
    }).join('');
    var panel = h(
      '<div class="panel">' +
        '<div class="panel-head"><h4>The ten thaats</h4><span class="badge">accidentals restored</span></div>' +
        '<div class="thaat-list">' + rows + '</div>' +
        '<p class="fine">Komal swaras are underlined, teevra Ma is written &#7742;a, exactly as Chapter 3 describes. Compare Bhairav with Bhairavi, and Purvi with Marwa &mdash; one swara apart, completely different colour.</p>' +
      '</div>'
    );
    panel.addEventListener('click', function (e) {
      var b = e.target.closest('[data-play]');
      if (!b) return;
      var row = b.closest('.thaat-row');
      var t = window.THAATS.filter(function (x) { return x.id === row.dataset.thaat; })[0];
      var notes = t.notes.concat([12]);
      if (b.dataset.play === 'desc') notes = notes.slice().reverse();
      var cells = row.querySelectorAll('.note-cell');
      var order = b.dataset.play === 'desc' ? notes : notes;
      A.sequence(order, 0.34, 0.02, 0, function (i) {
        cells.forEach(function (c) { c.classList.remove('lit'); });
        if (i >= 0) {
          var idx = b.dataset.play === 'desc' ? (cells.length - 1 - i) : i;
          if (cells[idx]) cells[idx].classList.add('lit');
        }
      });
    });
    el.appendChild(panel);
  };

  /* ============================= CH 10 ============================ */
  T.genres = function (el) {
    var cards = window.GENRES.map(function (g) {
      return '<div class="genre' + (g.main ? ' main' : '') + '"><b>' + g.name + '</b><span>' + (g.line || '') + '</span></div>';
    }).join('');
    el.appendChild(h('<div class="panel"><div class="genre-grid">' + cards + '</div></div>'));
  };

  /* ---------------- hydrate ---------------- */
  function mount(root) {
    root.querySelectorAll('.tool[data-tool]').forEach(function (el) {
      if (el.dataset.mounted) return;
      var fn = T[el.dataset.tool];
      if (!fn) { el.innerHTML = '<div class="panel"><p class="fine">Missing tool: ' + el.dataset.tool + '</p></div>'; return; }
      try { fn(el); el.dataset.mounted = '1'; }
      catch (err) { el.innerHTML = '<div class="panel"><p class="fine">Tool failed: ' + el.dataset.tool + '</p></div>'; }
    });
  }

  return { mount: mount, swaraHTML: swaraHTML, registry: T };
})();
