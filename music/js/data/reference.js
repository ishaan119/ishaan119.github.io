/* ------------------------------------------------------------------
   Reference tables used by the interactive tools.

   "source: true"  -> the item appears in your PDFs.
   "extra: true"   -> added for practice, NOT in your PDFs.
   Semitone offsets are measured from Sa = 0 in the madhya saptak.
   ------------------------------------------------------------------ */

/* Swara states: the 12 notes of the scale ------------------------- */
window.SWARAS = [
  { s: 0,  short: 'S',  label: 'Sa',  full: 'Shadja',      state: 'shuddha', west: 'C',  achal: true },
  { s: 1,  short: 'r',  label: 'Re',  full: 'Rishabha',    state: 'komal',   west: 'Db' },
  { s: 2,  short: 'R',  label: 'Re',  full: 'Rishabha',    state: 'shuddha', west: 'D' },
  { s: 3,  short: 'g',  label: 'Ga',  full: 'Gandhara',    state: 'komal',   west: 'Eb' },
  { s: 4,  short: 'G',  label: 'Ga',  full: 'Gandhara',    state: 'shuddha', west: 'E' },
  { s: 5,  short: 'M',  label: 'Ma',  full: 'Madhyama',    state: 'shuddha', west: 'F' },
  { s: 6,  short: "M'", label: 'Ḿa', full: 'Madhyama',    state: 'teevra',  west: 'F#' },
  { s: 7,  short: 'P',  label: 'Pa',  full: 'Panchama',    state: 'shuddha', west: 'G',  achal: true },
  { s: 8,  short: 'd',  label: 'Dha', full: 'Dhaivata',    state: 'komal',   west: 'Ab' },
  { s: 9,  short: 'D',  label: 'Dha', full: 'Dhaivata',    state: 'shuddha', west: 'A' },
  { s: 10, short: 'n',  label: 'Ni',  full: 'Nishada',     state: 'komal',   west: 'Bb' },
  { s: 11, short: 'N',  label: 'Ni',  full: 'Nishada',     state: 'shuddha', west: 'B' }
];

/* The 10 thaats (Bhatkhande) ------------------------------------- */
window.THAATS = [
  { id: 'bilawal',  name: 'Bilawal',  notes: [0,2,4,5,7,9,11],  rule: 'All swaras shuddha',            note: 'The reference scale. Named after raga Bilawal.' },
  { id: 'kalyan',   name: 'Kalyan',   notes: [0,2,4,6,7,9,11],  rule: 'Only Ma is tivra',              note: 'Raga Yaman belongs here.' },
  { id: 'khamaj',   name: 'Khamaj',   notes: [0,2,4,5,7,9,10],  rule: 'Only Ni is komal',              note: 'Raga Khamaj is its ashraya raga.' },
  { id: 'bhairav',  name: 'Bhairav',  notes: [0,1,4,5,7,8,11],  rule: 'Re and Dha komal',              note: 'Raga Bhairav: morning, bhakti ras.' },
  { id: 'purvi',    name: 'Purvi',    notes: [0,1,4,6,7,8,11],  rule: 'Re, Dha komal and Ma tivra',    note: 'Sunset colour.' },
  { id: 'marwa',    name: 'Marwa',    notes: [0,1,4,6,7,9,11],  rule: 'Re komal, Ma tivra',            note: 'Twilight (sandhiprakash) family.' },
  { id: 'kafi',     name: 'Kafi',     notes: [0,2,3,5,7,9,10],  rule: 'Ga and Ni komal',               note: 'Raga Kafi is its ashraya raga.' },
  { id: 'asavari',  name: 'Asavari',  notes: [0,2,3,5,7,8,10],  rule: 'Ga, Dha, Ni komal',             note: 'Late morning weight.' },
  { id: 'bhairavi', name: 'Bhairavi', notes: [0,1,3,5,7,8,10],  rule: 'Re, Ga, Dha, Ni komal',         note: 'All four komal swaras at once.' },
  { id: 'todi',     name: 'Todi',     notes: [0,1,3,6,7,8,11],  rule: 'Re, Ga, Dha komal and Ma tivra', note: 'The most heavily altered thaat.' }
];

/* Ragas written out in your material ----------------------------- */
window.RAGAS = [
  {
    id: 'yaman', name: 'Yaman', thaat: 'Kalyan', jati: 'Shadav – Sampurna', source: true,
    aroha: [-1, 2, 4, 6, 9, 11, 12],
    avaroha: [12, 11, 9, 7, 6, 4, 2, 0],
    note: 'Madhya saptak Sa and Pa are omitted going up. All swaras shuddha except teevra Ḿa. Aroha starts on mandra Ni.'
  },
  {
    id: 'bhoopali', name: 'Bhoopali', thaat: '—', jati: 'Audav – Audav', source: true,
    aroha: [0, 2, 4, 7, 9, 12],
    avaroha: [12, 9, 7, 4, 2, 0],
    note: 'Five notes up, five notes down. Ma and Ni are dropped entirely.'
  },
  {
    id: 'khamaj', name: 'Khamaj', thaat: 'Khamaj', jati: 'Shadav – Sampurna', source: true,
    aroha: [0, 4, 5, 7, 9, 10, 12],
    avaroha: [12, 10, 9, 7, 5, 4, 2, 0],
    note: 'Re is skipped going up and komal Ni is used coming down.'
  }
];

/* Talas ---------------------------------------------------------- */
window.TALAS = [
  {
    id: 'teentaal', name: 'Teen Taal', matras: 16, angs: [4,4,4,4], source: true,
    marks: { 1: 'X', 5: '2', 9: '0', 13: '3' },
    bols: ['Dha','Dhin','Dhin','Dha','Dha','Dhin','Dhin','Dha','Dha','Tin','Tin','Ta','Ta','Dhin','Dhin','Dha'],
    bolNote: 'Your PDF gives only the first four bols (Dha Dhin Dhin Dha); the rest is the standard theka.',
    jati: 'Chatusra', use: 'Khayal, chota khayal and most genres', bhava: '3 taali, 1 khaali'
  },
  {
    id: 'ektaal', name: 'Ek Taal', matras: 12, angs: [2,2,2,2,2,2], source: true,
    marks: { 1: 'X', 3: '0', 5: '2', 7: '0', 9: '3', 11: '4' },
    bols: ['Dhin','Dhin','Dhage','Tirakita','Tu','Na','Kat','Ta','Dhage','Tirakita','Dhi','Na'],
    bolNote: 'Bols added: not printed in your PDF.',
    jati: 'Chatusra', use: 'Bada khayal in vilambit laya', bhava: 'Serious. 4 taali, 2 khaali'
  },
  {
    id: 'keherwa', name: 'Keherwa', matras: 8, angs: [4,4], source: true,
    marks: { 1: 'X', 5: '0' },
    bols: ['Dha','Ge','Na','Ti','Na','Ka','Dhi','Na'],
    bolNote: 'Bols added: not printed in your PDF.',
    jati: 'Chatusra', use: 'Bhajan, geet, ghazal', bhava: '1 taali, 1 khaali'
  },
  {
    id: 'dadra', name: 'Dadra', matras: 6, angs: [3,3], source: true,
    marks: { 1: 'X', 4: '0' },
    bols: ['Dha','Dhin','Na','Dha','Tu','Na'],
    bolNote: 'Bols added: not printed in your PDF.',
    jati: 'Tisra', use: 'Bhajan, geet, ghazal', bhava: 'Light. 1 taali, 1 khaali'
  },
  {
    id: 'jhaptal', name: 'Jhaptal', matras: 10, angs: [2,3,2,3], extra: true,
    marks: { 1: 'X', 3: '2', 6: '0', 8: '3' },
    bols: ['Dhi','Na','Dhi','Dhi','Na','Ti','Na','Dhi','Dhi','Na'],
    bolNote: 'Whole tala added. Your PDF names Jhaptal only as an example of khanda jati (3+2, 3+2); the clap positions here follow the standard 2+3+2+3 reading.',
    jati: 'Khanda', use: 'Chota khayal', bhava: '3 taali, 1 khaali'
  },
  {
    id: 'rupak', name: 'Rupak', matras: 7, angs: [3,2,2], extra: true,
    marks: { 1: '0', 4: '2', 6: '3' },
    bols: ['Tin','Tin','Na','Dhin','Na','Dhin','Na'],
    bolNote: 'Whole tala added. Your PDF names Rupak only as an example of misra jati (3+2+2). Note its sam falls on a khaali, which is unusual.',
    jati: 'Misra', use: 'Bhajan, chota khayal', bhava: 'Sam is khaali'
  }
];

/* Laya bands, from Chapter 8 ------------------------------------- */
window.LAYAS = [
  { id: 'vilambit', name: 'Vilambit', western: 'Lento',    bpm: 60,  desc: 'Slow tempo, 80 bpm on a metronome' },
  { id: 'madhya',   name: 'Madhya',   western: 'Moderato', bpm: 110, desc: 'Medium tempo, 80–160 bpm' },
  { id: 'drut',     name: 'Drut',     western: 'Allegro',  bpm: 180, desc: 'Fast tempo, 160+ bpm' }
];

/* The 22 shrutis named by Sarangadeva (added reference) ---------- */
window.SHRUTIS = [
  'Tivra','Kumudvati','Manda','Chandovati','Dayavati','Ranjani','Ratika','Raudri',
  'Krodhi','Vajrika','Prasarini','Priti','Marjani','Kshiti','Rakta','Sandipani',
  'Alapini','Madanti','Rohini','Ramya','Ugra','Kshobhini'
];

/* Navarasas (reconstructed) -------------------------------------- */
window.RASAS = [
  { name: 'Shringar',  mood: 'love',      glyph: '❦', original: true,  source: false },
  { name: 'Hasya',     mood: 'humour',    glyph: '☺', original: true,  source: true },
  { name: 'Karuna',    mood: 'pathos',    glyph: '☂', original: true,  source: true },
  { name: 'Raudra',    mood: 'fury',      glyph: '⚡', original: true,  source: true },
  { name: 'Veer',      mood: 'heroic',    glyph: '⚔', original: true,  source: true },
  { name: 'Bhayanaka', mood: 'terror',    glyph: '☾', original: true,  source: true },
  { name: 'Bhibhatsa', mood: 'disgust',   glyph: '⊘', original: true,  source: true },
  { name: 'Adbhuta',   mood: 'wonder',    glyph: '✧', original: true,  source: true },
  { name: 'Shanta',    mood: 'peace',     glyph: '◯', original: false, source: true },
  { name: 'Bhakti',    mood: 'devotion',  glyph: '❀', original: false, source: true }
];

/* Swaras and the sounds of birds and animals (added reference) --- */
window.ANIMALS = [
  { swara: 'Sa',  full: 'Shadja',   animal: 'Peacock',           glyph: '🦚' },
  { swara: 'Re',  full: 'Rishabha', animal: 'Skylark / bull',    glyph: '🐂' },
  { swara: 'Ga',  full: 'Gandhara', animal: 'Goat',              glyph: '🐐' },
  { swara: 'Ma',  full: 'Madhyama', animal: 'Heron / crane',     glyph: '🦢' },
  { swara: 'Pa',  full: 'Panchama', animal: 'Cuckoo (koyal)',    glyph: '🐦' },
  { swara: 'Dha', full: 'Dhaivata', animal: 'Horse / frog',      glyph: '🐎' },
  { swara: 'Ni',  full: 'Nishada',  animal: 'Elephant',          glyph: '🐘' }
];

/* The prahar clock ---------------------------------------------- */
window.PRAHARS = [
  { half: 'day',   n: 1, from: '6 am',       to: '9 am',       raga: 'Bhairav', source: true, twilight: true },
  { half: 'day',   n: 2, from: '9 am',       to: '12 noon',    raga: '' },
  { half: 'day',   n: 3, from: '12 noon',    to: '3 pm',       raga: '' },
  { half: 'day',   n: 4, from: '3 pm',       to: '6 pm',       raga: '', twilight: true },
  { half: 'night', n: 1, from: '6 pm',       to: '9 pm',       raga: '' },
  { half: 'night', n: 2, from: '9 pm',       to: '12 midnight', raga: '' },
  { half: 'night', n: 3, from: '12 midnight', to: '3 am',      raga: 'Malkauns', source: true },
  { half: 'night', n: 4, from: '3 am',       to: '6 am',       raga: '', twilight: true }
];

/* The 9 jati combinations --------------------------------------- */
window.JATIS = [
  { aroha: 'Audav',     avaroha: 'Audav',     eg: 'Bhoopali' },
  { aroha: 'Audav',     avaroha: 'Shadav',    eg: '' },
  { aroha: 'Audav',     avaroha: 'Sampurna',  eg: '' },
  { aroha: 'Shadav',    avaroha: 'Audav',     eg: '' },
  { aroha: 'Shadav',    avaroha: 'Shadav',    eg: '' },
  { aroha: 'Shadav',    avaroha: 'Sampurna',  eg: 'Khamaj, Yaman' },
  { aroha: 'Sampurna',  avaroha: 'Audav',     eg: '' },
  { aroha: 'Sampurna',  avaroha: 'Shadav',    eg: '' },
  { aroha: 'Sampurna',  avaroha: 'Sampurna',  eg: 'Bilawal' }
];

/* Evolution of raga, Chapter 4 ---------------------------------- */
window.EVOLUTION = [
  { name: 'Nada Brahma',    gloss: 'cosmic sound' },
  { name: 'Nada Bindu',     gloss: 'sound that can be heard by yogic practice' },
  { name: 'Anahata Nada',   gloss: 'sound not audible without effort' },
  { name: 'Ahata Nada',     gloss: 'sound audible without effort', branches: [
      { name: 'Madhura Nada', gloss: 'pleasing' },
      { name: 'Pratyahata Nada', gloss: 'noise' }
  ]},
  { name: 'Shruti',         gloss: 'sound distinctly heard by the human ear' },
  { name: 'Swar',           gloss: 'main sounds that are used in sangeet' },
  { name: 'Saptak',         gloss: '7 shuddha swaras arranged consecutively' },
  { name: 'Thaat',          gloss: 'parental scale of 7 notes from which raga is born' },
  { name: 'Raga',           gloss: 'heart-touching musical melody bound in principles' }
];

/* Features of a raga, pulled together from chapters 4, 5, 7, 9 -- */
window.RAGA_FEATURES = [
  { name: 'Swar varna',        where: 'ch04', anchor: 'swar-varna',       gloss: 'How a set of swaras is used: sthayi, arohi, avrohi, sanchari.' },
  { name: 'Aroha / avaroha',   where: 'ch04', anchor: 'aroha-avaroha',    gloss: 'Which swaras are allowed going up, and coming down.' },
  { name: 'Pakad / chalan',    where: 'ch05', anchor: 'pakad-chalan',     gloss: 'The catch phrase, and the movement of the raga.' },
  { name: 'Purvang / uttarang',where: 'ch05', anchor: 'purvang-uttarang', gloss: 'Which half of the octave the vadi sits in.' },
  { name: 'Jati',              where: 'ch07', anchor: 'jati',             gloss: 'How many notes in the ascent and descent.' },
  { name: 'Vadi / samvadi',    where: 'ch07', anchor: 'swara-roles',      gloss: 'The most and second-most important swaras.' },
  { name: 'Graha / nyas',      where: 'ch07', anchor: 'swara-roles',      gloss: 'Where the raga starts, and where it rests.' },
  { name: 'Prahar',            where: 'ch07', anchor: 'prahar',           gloss: 'The time of day it should be performed.' },
  { name: 'Ras',               where: 'ch09', anchor: 'more-raga-principles', gloss: 'The sentiment it evokes.' },
  { name: 'Thaat',             where: 'ch09', anchor: 'ten-thaats',       gloss: 'The parent scale it is born from.' },
  { name: 'Name',              where: 'ch09', anchor: 'more-raga-principles', gloss: 'Named after gods, places, seasons, characteristics or composers.' }
];

/* Genres, Chapter 10 -------------------------------------------- */
window.GENRES = [
  { name: 'Dhrupad', main: true, line: 'Oldest and most disciplined. Fixed raga, long alaap, bhakti and veer rasa. No tans.' },
  { name: 'Dhamar',  main: true, line: 'Ancient and serious. Always in Dhamar tala of 14 beats. Holi songs in Braj, with bolbant.' },
  { name: 'Khayal',  main: true, line: 'Persian for imagination. Brief alaap, bada khayal (vilambit), then chota khayal (drut).' },
  { name: 'Thumri',  main: true, line: 'The lightest of the three main genres. Love songs where the words matter most.' },
  { name: 'Tarana',  line: 'Listed in your PDF as a further genre.' },
  { name: 'Tappa',   line: 'Murki is very popular with tappa singers (Chapter 6).' },
  { name: 'Dadra',   line: 'Shares its name with the 6-beat tala.' },
  { name: 'Ghazal',  line: 'Often set in Keherwa or Dadra.' },
  { name: 'Bhajan',  line: 'Devotional. Often Keherwa or Dadra.' },
  { name: 'Kajari',  line: 'Listed in your PDF as a further genre.' }
];

/* Alankars / paltas (added practice patterns) ------------------- */
window.ALANKARS = [
  { name: 'Palta 1', asc: [0,1,2,3,4,5,6,7], pattern: 'plain', gloss: 'Straight up and straight down the scale.' },
  { name: 'Palta 2', pattern: 'pairs',  gloss: 'S R, R G, G M, M P ... in pairs.' },
  { name: 'Palta 3', pattern: 'triads', gloss: 'S R G, R G M, G M P ... in threes.' }
];
