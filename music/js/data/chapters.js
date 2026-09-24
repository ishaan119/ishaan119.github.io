/* ------------------------------------------------------------------
   Chapter content, transcribed from the 10 PDFs in the parent folder.

   Notes on fidelity:
   - The PDFs are Word/WordPress exports. Their text still carried raw
     markup (</strong>, <li>, [audio wav="..."]) and the conversion
     dropped every image, so all the "as shown below" tables and
     diagrams are missing from the source files.
   - Prose here is the PDF prose, cleaned of that markup, with
     run-together words from text extraction (e.g. "itschosen") fixed.
   - Anything NOT in the PDFs is wrapped in a callout marked
     "Added" or "Rebuilt", so you always know what is your
     syllabus and what is study scaffolding.
   ------------------------------------------------------------------ */
window.CHAPTERS = [];

/* ----------------------------- CHAPTER 1 ----------------------------- */
window.CHAPTERS.push({
  id: 'ch01',
  num: 1,
  title: 'Introduction to Indian Art Music',
  subtitle: 'What stays constant, sangeet vs music, and how the tradition is passed on',
  pdf: 'CHAPTER 1_Intro to Indian Art music.pdf',
  sourceLabel: 'header inside the PDF reads "CHAPTER #3"',
  minutes: 5,
  tags: ['foundations', 'tradition'],
  sections: [
    {
      id: 'constants',
      heading: 'What has never changed',
      html: `
<p class="lead">Indian classical music, or art music, has constantly evolved, borrowed and modified musical traditions over the years. But some things have remained the same.</p>
<ul class="spaced">
  <li><b>Reliance on an oral tradition.</b></li>
  <li><b>Preference for melodic progression rather than harmonic</b> &mdash; the focus is on a single individual musician rendering a melody, rather than many musicians in concert rendering melodies simultaneously.</li>
  <li><b>Vocal music is regarded as the primary expression.</b></li>
  <li><b>It has consolidated the concepts of raga and tala</b> to raise its major musical structures.</li>
</ul>`
    },
    {
      id: 'music-vs-sangeet',
      heading: 'Music vs. Sangeet',
      html: `
<div class="compare">
  <div class="compare-card">
    <h4>Music</h4>
    <p>A western concept, comprised of vocal and instrumental music.</p>
  </div>
  <div class="compare-card accent">
    <h4>Sangeet</h4>
    <p>An Indian concept aggregating <b>three</b> forms of performing arts: vocal music, instrumental music and dance. It is a form of self-expression of one's emotions through the medium of musical notes (<i>swar</i>, the key melodic sounds used in sangeet) and rhythmic tempo (<i>laya</i>).</p>
  </div>
</div>`
    },
    {
      id: 'learning-by-imitation',
      heading: 'Learning by imitation',
      html: `
<p>In India we learn music by listening to what our teachers sing or play and repeating it so that we remember. We do not read it from a book &mdash; we remember the music by practising so that it stays in our minds.</p>
<p>Our music has been passed down this way from ancient times: teachers teach students who learn, and then when they grow up, they teach their students. And so on. This is called the <b>guru-shishya parampara</b> and it is a very important part of Indian music.</p>
<p>Students who are interested in learning approach a guru and ask him or her to teach them. The guru chooses students that he would like to teach and starts training them in both music theory and performance.</p>`
    },
    {
      id: 'notation',
      heading: 'Notation in music',
      html: `
<p>Just like you need an alphabet in order to represent a language in written form, you use <b>notation</b> to transmit and preserve music.</p>
<div class="callout fig">
  <h5>Figure missing from the source PDF</h5>
  <p>The PDF ends here mid-topic &mdash; the notation example that followed was lost in the conversion. Notation marks are covered in Chapter 3, and are rebuilt as an interactive board there.</p>
  <p><a href="#/ch03#notation-marks" class="inline-link">Jump to the notation marks &rarr;</a></p>
</div>`
    }
  ]
});

/* ----------------------------- CHAPTER 2 ----------------------------- */
window.CHAPTERS.push({
  id: 'ch02',
  num: 2,
  title: 'Learning &amp; Understanding Indian Art Music',
  subtitle: 'Gharanas, the performing set, shruti, and the two families of swara',
  pdf: 'CHAPTER 2_Learning and Understanding Indian art music.pdf',
  minutes: 9,
  tags: ['foundations', 'gharana', 'shruti'],
  sections: [
    {
      id: 'gharana',
      heading: 'Gharana',
      html: `
<p class="lead">When you have a guru-shishya parampara of professional musicians that has extended over many generations, either through family or through guru-shishya ties, it is called a <b>gharana</b>.</p>
<p>Gharana literally means a "house" or "family" and is often named after the place where the founder of the gharana came from. Some prominent gharanas are <b>Gwalior, Kirana, Mewati, Maihar</b> and <b>Agra</b>.</p>
<blockquote>If you think of music like a country, then each gharana would be like a state with its own features and specialities.</blockquote>
<p>Now more and more musicians are learning the good aspects from different gharanas and creating their own individual styles.</p>`
    },
    {
      id: 'three-things',
      heading: 'Three things to remember',
      html: `
<ol class="steps">
  <li>
    <h4>Start by imitating the guru</h4>
    <p>Students learn the basics by imitating the guru &mdash; just like you learn to write a language by first practising tracing the alphabet, then copying it by yourself.</p>
  </li>
  <li>
    <h4>Learn to improvise</h4>
    <p>Once students have mastered the basics, the guru teaches them to improvise and create their own music based on what they have learnt. This is like writing sentences, then essays and stories, once you know the basics of a language.</p>
  </li>
  <li>
    <h4>Practise always</h4>
    <p><i>Riyaz</i> or <i>sadhana</i>, which means practice, is the base on which all knowledge is built. Students must practise every day. Practice does not mean just repeating what you have learnt &mdash; it also means continuing to take what you have learnt and exploring it further.</p>
  </li>
</ol>
<div class="callout fig">
  <h5>Figure missing from the source PDF</h5>
  <p>At this point the PDF has three stray labels left over from a lost notation figure: <b>phrase</b> (underline with turns at the sides), <b>gamak</b>, and <b>meend</b>. The ornaments themselves are covered in Chapter 6.</p>
</div>`
    },
    {
      id: 'performing-set',
      heading: 'The performing set',
      html: `
<p>Usually an Indian art music performance has one or two main melody performers, one or many accompanying melody performers, a rhythm accompanist, and a drone player.</p>
<div class="grid-cards">
  <div class="card">
    <h4>Main performer</h4>
    <p>The primary music source. The accompanist supports and echoes the main performer. The main performer may be a vocalist, or play an instrument such as the <b>bansuri, sitar, veena, sarod, santoor</b> or <b>shehnai</b>.</p>
    <p>Sometimes two musicians perform together and take turns being the main performer. This is called a <b>jugalbandi</b>.</p>
  </div>
  <div class="card">
    <h4>Accompanying melody</h4>
    <p>Sometimes one or more players accompany the main performer, on the same or a different instrument. Typically a vocalist is accompanied by a <b>harmonium</b> or a <b>sarangi</b>; a bansuri by another bansuri, and a shehnai by another shehnai.</p>
  </div>
  <div class="card">
    <h4>Accompanying rhythm</h4>
    <p>There is typically only one accompanying rhythm: either a <b>tabla</b>, <b>pakhawaj</b> or <b>mridangam</b>.</p>
  </div>
  <div class="card">
    <h4>Drone</h4>
    <p>The drone provides a constant background pitch. It shows the musicians where the madhya saptak <b>Sa</b> is, so that they all stay at the same pitch. The drone could be a <b>tanpura</b> or a <b>shruti box</b>.</p>
  </div>
</div>`
    },
    {
      id: 'shruti',
      heading: 'Shruti',
      html: `
<p>In theory, the saptak is also divided into <b>22 micro-intervals called shrutis</b>. The term shruti is derived from the root <i>shru</i>, which means "that which is audible".</p>
<p>A shruti is a microtone and represents the smallest division of the saptak audible to a trained and sensitive human ear. In practice, few performers and listeners actively identify the shruti aspect of a saptak, although most listeners actively respond to the nuances of sound variation employed by skilled musicians.</p>
<p>The thirteenth century musicologist <b>Sarangadeva</b> named each of the 22 accepted shrutis.</p>
<p>A shruti does not have an independent existence, and its characteristics are best revealed when it is heard within the context of a melodic form. Shrutis are best appreciated during the process of embellishments, such as <i>gamak</i>, in a raga.</p>
<div class="callout fig">
  <h5>Figure missing from the source PDF &mdash; rebuilt below</h5>
  <p>The PDF says "named each of the 22 accepted shrutis as shown below" and then the table is gone. The names below are the standard list from Sarangadeva's <i>Sangita Ratnakara</i>, added here so the reference is not blank. Check them against your class notes before relying on them in an exam.</p>
</div>
<div class="tool" data-tool="shruti"></div>`
    },
    {
      id: 'recap-swara',
      heading: 'Recap: melody, shruti, swara',
      html: `
<ol class="spaced">
  <li><b>Melody</b> &mdash; a pleasing sequence of notes.</li>
  <li><b>Shruti</b> &mdash; a music-worthy note that is distinctly perceptible to the human ear. There are 22 known shrutis in a saptak.</li>
  <li><b>Swara</b> &mdash; the 7 key shrutis (out of the 22) that are most used in sangeet. These 7 swaras are S (Sadja), R (Rishabha), G (Gandhara), M (Madhyama), P (Panchama), D (Dhaivata), N (Nishada).</li>
</ol>
<h4>Two types of swara are used in Indian classical sangeet</h4>
<div class="compare">
  <div class="compare-card">
    <h4>Shuddha swara</h4>
    <p>The main swara that remains stable at its chosen point. There are <b>7</b> shuddha swaras. <b>S</b> and <b>P</b> are <i>achal swara</i>, as they do not move from their spots.</p>
  </div>
  <div class="compare-card accent">
    <h4>Vikrit swara</h4>
    <p>When a shuddha swara moves up or down from its original position. There are <b>5</b> vikrit swaras, of two types:</p>
    <ul>
      <li><b>Komal swara</b> &mdash; the swara moves below its original shuddha spot. 4 swaras: <b>R, G, D, N</b>.</li>
      <li><b>Tivra swara</b> &mdash; the swara moves above its original shuddha spot. 1 swara: <b>M</b>.</li>
    </ul>
  </div>
</div>`
    },
    {
      id: 'keywords',
      heading: 'Key words',
      html: `
<dl class="term-list">
  <dt>Guru-shishya parampara</dt><dd>The tradition of learning passed down across multiple generations of gurus and students. The guru teaches his/her shishyas, who then become gurus and teach their students, and so on.</dd>
  <dt>Gharana</dt><dd>A guru-shishya parampara of professional musicians that has extended over many generations, either through family or through guru-shishya ties.</dd>
  <dt>Riyaz</dt><dd>Also called sadhana. This means practice.</dd>
  <dt>Notation</dt><dd>A way of representing music in writing.</dd>
  <dt>Swara</dt><dd>A pleasing musical sound that can stand on its own, or a musical note. Swaras can be shuddha (major), komal (flat) or teevra (sharp).</dd>
  <dt>Saptak</dt><dd>The 7 major notes in consecutive order (Sa Re Ga Ma Pa Dha Ni) constituting an octave.</dd>
  <dt>Drone</dt><dd>An instrument that provides the background pitch for a musician.</dd>
</dl>`
    },
    {
      id: 'find-out-more',
      heading: 'Find out more',
      html: `
<div class="callout task">
  <h5>From the PDF</h5>
  <p>Pick any gharana and find out more about its founder, the gurus and shishyas in it, and what it is known for.</p>
</div>`
    }
  ]
});

/* ----------------------------- CHAPTER 3 ----------------------------- */
window.CHAPTERS.push({
  id: 'ch03',
  num: 3,
  title: 'Swara &amp; Saptak',
  subtitle: 'The seven notes, their twelve states, and the three octaves you actually sing in',
  pdf: 'Chapter 3_SWARA AND SAPTAK.pdf',
  minutes: 8,
  tags: ['swara', 'saptak', 'notation'],
  sections: [
    {
      id: 'swara-saptak',
      heading: 'Swara and saptak',
      html: `
<p class="lead">In theory, any sound which can be heard and produced by a human, typically a human voice, has a musical use. A <b>swara</b> is simply a pleasing musical sound which can stand on its own.</p>
<p>The present day scale has seven basic swaras or notes, each with a full and a short name. Together they comprise one <b>saptak</b> or scale.</p>
<p>All musical notes have four determinate characteristics: <b>pitch, timbre, intensity</b> and <b>duration</b>.</p>`
    },
    {
      id: 'samagan',
      heading: 'Samagan: where the swaras came from',
      html: `
<p>The earliest form of vocal music began as a recitation of the sacred scriptures and was called <b>Samagan</b>, where <i>sam</i> means "melody" and <i>gan</i> means "to sing verses". Samagan had <b>3 tonal accents</b>, which were later named as swaras or musical notes.</p>
<div class="callout fig">
  <h5>Figure missing from the source PDF</h5>
  <p>The diagram of the three tonal accents, and the table linking swaras to the sounds of birds and animals, were both dropped in the conversion. The bird/animal mapping below is the commonly taught one, added so you have something to revise against &mdash; it is not from your PDF.</p>
</div>
<div class="tool" data-tool="animals"></div>`
    },
    {
      id: 'shuddha-vikrit',
      heading: 'Shuddha and vikrit (komal) swaras',
      html: `
<p>Once the saptak or scale of seven musical notes was defined, the swaras were refined further.</p>
<ul class="spaced">
  <li>Each of the seven swaras had one state, described as <b>shuddha</b>, i.e. pure or major.</li>
  <li>Four of the swaras &mdash; <b>Re, Ga, Dha</b> and <b>Ni</b> &mdash; have <b>komal</b> states, i.e. flat or minor.</li>
  <li>One swara &mdash; <b>Ma</b> &mdash; has a <b>teevra</b> or sharp state.</li>
</ul>
<p>The combination of shuddha, komal and teevra swaras makes a series of <b>twelve notes</b> in an entire scale. The komal and teevra swaras are also referred to as <b>vikrit</b> swaras or minor notes, as opposed to the seven shuddha swaras.</p>`
    },
    {
      id: 'notation-marks',
      heading: 'How the states are written',
      html: `
<p>Each of the seven swaras has a shuddha state (pure or major). Four of them &mdash; Re, Ga, Dha and Ni &mdash; also have a komal state (flat), which is lower/flatter than the shuddha state and is <b>denoted with an underline</b> in notation: <span class="sw komal">Re</span> <span class="sw komal">Ga</span> <span class="sw komal">Dha</span> <span class="sw komal">Ni</span>.</p>
<p>The swara <b>Ma</b> is the only one with a teevra state (sharp), which is slightly higher than normal Ma, and is shown in notation as <span class="sw teevra">&#7742;a</span>.</p>
<div class="callout fig">
  <h5>Rebuilt: the twelve swara states</h5>
  <p>Tap any note to hear it. This is the table the PDF referred to but never showed.</p>
</div>
<div class="tool" data-tool="swara-board"></div>`
    },
    {
      id: 'saptak',
      heading: 'Saptak',
      html: `
<p>The word <i>sapt</i> means seven. Indian music consists of 7 major notes or swaras in consecutive order, known as a <b>saptak</b> or octave: <b>S R G M P D N</b>.</p>
<p>Notes are the building blocks of music. The 7 basic notes repeat when you go higher or lower. Starting from the tonic <b>Sa</b>, as we go through each higher note, the eighth note we reach is <b>Sa</b> again.</p>
<div class="callout fig">
  <h5>Rebuilt: saptak and western equivalents</h5>
  <p>The PDF says "the saptak along with their corresponding western music equivalents are given below" &mdash; the table is missing. Reconstructed here with Sa taken as C, which is the usual teaching convention. Remember that in Indian music the pitch of Sa is not fixed (Chapter 4).</p>
</div>
<div class="tool" data-tool="saptak-map"></div>`
    },
    {
      id: 'three-saptaks',
      heading: 'The three saptaks',
      html: `
<p>This high Sa completes the saptak and is at a frequency twice that of the tonic Sa. It represents the tar (high) status position for this saptak and is the starting point of the next saptak.</p>
<div class="grid-cards three">
  <div class="card">
    <h4>Mandra <span class="dot-below-demo">S&#803;</span></h4>
    <p>The sound of the swaras is <b>low pitch</b> (half of the madhya saptak) and serious. Most of the sound is produced from the <b>gut</b>. The saptak obtained by going lower from the tonic Sa. Notes are denoted with a <b>dot below</b>.</p>
  </div>
  <div class="card accent">
    <h4>Madhya <span class="dot-below-demo">S</span></h4>
    <p>The sound of the swaras that is in the middle, i.e. neither too low nor too high pitch. The sound is produced from the <b>throat</b>. This middle saptak has <b>no dots</b>.</p>
  </div>
  <div class="card">
    <h4>Tar <span class="dot-below-demo">S&#775;</span></h4>
    <p>The sound of the swaras that is <b>high pitch</b> (twice as high as the madhya saptak). The effort to produce this sound comes from the <b>forehead</b>. Notes are denoted with a <b>dot above</b>.</p>
  </div>
</div>
<p>In music we normally explore these 3 saptaks. Sometimes tar saptak is extended higher to the <b>ati tar saptak</b>, denoted by a double dot above the note. Similarly the mandra saptak can be extended lower to the <b>ati mandra saptak</b>, denoted by two dots below. The notes of the ati tar and ati mandra saptak are rarely used &mdash; only a few instruments have the capacity to play these notes.</p>`
    },
    {
      id: 'alankars',
      heading: 'Alankars / Paltas',
      html: `
<p>Ascending and descending swara patterns, used to develop voice clarity and to provide speed exercises to students. They may or may not be bound in taal.</p>
<div class="callout added">
  <h5>Added: run them at your own speed</h5>
  <p>Three standard paltas to practise with, built on whichever thaat you pick. Not from the PDF &mdash; practice scaffolding.</p>
</div>
<div class="tool" data-tool="alankar"></div>`
    }
  ]
});

/* ----------------------------- CHAPTER 4 ----------------------------- */
window.CHAPTERS.push({
  id: 'ch04',
  num: 4,
  title: 'Raga',
  subtitle: 'How swaras become melody: aroha, avaroha, the rules, and where raga comes from',
  pdf: 'CHAPTER 4_Raga.pdf',
  sourceLabel: 'header inside the PDF reads "CHAPTER #8"',
  minutes: 10,
  tags: ['raga', 'theory'],
  sections: [
    {
      id: 'what-is-raga',
      heading: 'What is a raga?',
      html: `
<p class="lead">Raga is derived from the Sanskrit word <i>ranj</i>, which literally means colour or hue, and also means melody. At its simplest, a raga can be thought of as <b>music that pleases the mind</b>.</p>
<p>To understand what a raga is, let us go back to thinking of swaras as building blocks &mdash; there are <b>12</b> different kinds of these blocks, or swara states.</p>
<p>Ragas are made by combining some of these swaras in different ways, following certain rules.</p>
<blockquote>A raga is a musical melody that has the ability to touch the heart of a listener by channelising it through certain principles and features. A raga is born from a parental <b>thaat</b> scale but has its own distinct identity.</blockquote>
<p>The raga that is closest to the features of the parent thaat is called an <b>ashraya raga</b>, for example Raga Kafi or Raga Khamaj.</p>`
    },
    {
      id: 'aroha-avaroha',
      heading: 'Aroha and avaroha',
      html: `
<p>The swaras of a raga are defined by the <b>aroha</b> and <b>avaroha</b>, which tell you what swaras can be used while going up the octave, and what can be used while coming down, respectively.</p>
<p>In raga <b>Yaman</b>, the madhya saptak Sa and Pa are omitted while going up. The swaras used in this raga are all shuddha swaras except for Ma, which is the teevra <span class="sw teevra">&#7742;a</span>. Similarly, different ragas are formed using different swaras or patterns of swaras, for example raga <b>Bhoopali</b>.</p>
<div class="callout fig">
  <h5>Rebuilt: aroha / avaroha</h5>
  <p>The PDF had images of these scales (and links to bansuri and sitar clips, which are now dead links on the gurukul site). The scales below are taken from the aroha/avaroha written out in Chapter 7 of your own material, and are playable.</p>
</div>
<div class="tool" data-tool="raga-scale"></div>`
    },
    {
      id: 'bhatkhande-rules',
      heading: 'The rules of raga structure',
      html: `
<p>The rules concerning the structure of a raga were formulated by <b>Pandit V. N. Bhatkhande</b>:</p>
<ol class="rules">
  <li>A raga cannot have less than <b>five</b> notes.</li>
  <li>A raga can never omit <b>Sa</b>, and cannot omit both <b>Ma</b> and <b>Pa</b> at the same time.</li>
  <li>A raga should not consecutively include two states (i.e. flat and natural, or natural and sharp) of the same note.</li>
  <li>A raga should have a definite ascent and descent.</li>
</ol>
<p>While these rules are normally true, there are exceptions to each of them.</p>
<h4>Can you have an infinite number of ragas?</h4>
<p>In theory, yes. However in actual practice the number is limited. Approximately <b>150&ndash;200</b> ragas are well established. Of these, about <b>50</b> ragas are commonly practised and form the basic repertoire of almost every performing artiste.</p>`
    },
    {
      id: 'pitch',
      heading: 'Pitch is not absolute',
      html: `
<p>The first thing to remember is that in Indian music the pitch is <b>not absolute</b>, unlike western music. The madhya saptak Sa, or tonic Sa, does not always need to start at the same point &mdash; it is fixed based on what is suitable for the performer, singer or instrumentalist. For example, if you have a voice that ranges better in the lower octave, you could choose to set your Sa at a lower pitch than someone who can sing in a higher pitch.</p>
<p>However, <b>once the Sa is chosen, it stays so for the rest of the performance</b> and all the musicians need to follow this pitch.</p>
<p>The drone, which is normally a tanpura, plays the tonic Sa so that all the musicians can refer to it and perform in the same pitch. The PDF lists two example pitches: <b>Pitch 1 &mdash; C</b> and <b>Pitch 5 &mdash; G</b> (the tanpura sample links in the PDF are external and no longer load).</p>
<div class="callout added">
  <h5>Added: set your own Sa</h5>
  <p>A tanpura-style drone you can tune. Whatever you pick here becomes the Sa used by every player in this app.</p>
</div>
<div class="tool" data-tool="drone"></div>`
    },
    {
      id: 'evolution',
      heading: 'Evolution of raga',
      html: `
<p>The chain the PDF sets out, from cosmic sound down to raga:</p>
<div class="tool" data-tool="evolution"></div>`
    },
    {
      id: 'swar-varna',
      heading: 'Principles of a raga: swar varna',
      html: `
<p><b>Swar varna</b> is the manner in which a set of swaras is used. There are 4 types:</p>
<dl class="term-list">
  <dt>Sthayi varna</dt><dd>Repetition of the same swara. E.g. SSSS, RRRR, GGGG.</dd>
  <dt>Arohi varna</dt><dd>The swara pattern from madhya S to N. E.g. S R G M P D N &#7776;.</dd>
  <dt>Avrohi varna</dt><dd>The swara pattern from tar S to madhya R. E.g. &#7776; N D P M G R S.</dd>
  <dt>Sanchari varna</dt><dd>The combination of the above three. E.g. SSSS SRGM PMGR.</dd>
</dl>
<div class="callout added">
  <h5>Heads-up: the principles are split across your PDFs</h5>
  <p>Chapter 4 lists "4 principles of a raga" but only covers swar varna. The rest are scattered: <b>jati</b>, <b>vadi/samvadi</b>, <b>graha/nyas</b> and <b>prahar</b> are in Chapter 7; <b>pakad</b>, <b>name</b> and <b>ras</b> are at the end of Chapter 9; <b>pakad/chalan</b> is in Chapter 5. The card below pulls them into one place with links.</p>
</div>
<div class="tool" data-tool="raga-features"></div>`
    }
  ]
});

/* ----------------------------- CHAPTER 5 ----------------------------- */
window.CHAPTERS.push({
  id: 'ch05',
  num: 5,
  title: 'Sthayi &amp; Antara',
  subtitle: 'Catching a raga with pakad and chalan, the two stanzas, and tempo multiples',
  pdf: 'CHAPTER 5_ASTHAI and ANTARA.pdf',
  minutes: 6,
  tags: ['raga', 'composition', 'laya'],
  sections: [
    {
      id: 'pakad-chalan',
      heading: 'Pakad and chalan',
      html: `
<p class="lead"><b>Pakad</b> literally means "that by which you can get hold". It is a distinctive combination of swaras, or melodic "catch phrase", which helps you identify a raga.</p>
<p><b>Chalan</b> literally means "movement" or "gait", and is a short ascending or descending pattern of notes indicating how the notes are used to make melodies in the raga.</p>
<p>Chalan is more comprehensive than a pakad. For example, in raga Yaman the pakad does not show that Pa is omitted in the aroha, whereas this can be shown in a chalan, which shows how the raga moves through multiple octaves.</p>
<p>Chalan may involve a combination of pakads. Some ragas may not have pakads, and the chalan will show how the raga is to be sung.</p>
<div class="callout fig">
  <h5>Missing from the source PDF</h5>
  <p>This section pointed to sitar and bansuri clips of Yaman's pakad and chalan, plus an editor's note that read "Examples TBD &mdash; cite whatever corresponds to the audio clip". No notation was printed, so there is nothing to rebuild here. Worth asking your guru to play the Yaman pakad and writing it in yourself.</p>
</div>`
    },
    {
      id: 'sthayi-antara',
      heading: 'Sthayi and antara',
      html: `
<div class="compare">
  <div class="compare-card accent">
    <h4>Sthayi</h4>
    <p>The first and the most important, repeated stanza in a musical composition (<i>bandish</i>). It usually operates within the <b>madhya</b> and the <b>mandra</b> saptak.</p>
  </div>
  <div class="compare-card">
    <h4>Antara</h4>
    <p>The second stanza in a musical composition, which joins back to the sthayi upon completion. It operates between the <b>madhya</b> and <b>tar</b> saptak.</p>
  </div>
</div>`
    },
    {
      id: 'purvang-uttarang',
      heading: 'Purvang and uttarang',
      html: `
<p>Musicologists have added a tar <b>&#7776;</b> to the 7 madhya saptak swaras to make them a total of 8, and divided them into two parts.</p>
<ul class="spaced">
  <li>Ragas that have their <b>vadi</b> swara falling in the first half (S, R, G, M) are called <b>purvang vadi</b> ragas.</li>
  <li>Ragas whose vadi swara falls in the second half (P, D, N, tar &#7776;) are called <b>uttarang vadi</b> ragas.</li>
</ul>
<div class="tool" data-tool="purvang"></div>
<p class="note-line">This split is what drives the time-of-day rule for ragas &mdash; see <a href="#/ch07#prahar" class="inline-link">Chapter 7: Prahar</a>.</p>`
    },
    {
      id: 'laya-multiples',
      heading: 'Tempo multiples: thaah, dugun, tigun',
      html: `
<dl class="term-list">
  <dt>Thaah</dt><dd>The start, or original, tempo in which a song is performed on an instrument or sung.</dd>
  <dt>Dugun</dt><dd>When anything is played or sung at <b>twice</b> the original tempo. Two swaras sung/played in two matras at the original tempo can now be sung/played in one matra.</dd>
  <dt>Tigun</dt><dd>When sung or played on an instrument at <b>thrice</b> the original tempo.</dd>
  <dt>Chaugun</dt><dd><b>Four</b> times the original tempo. (Listed in Chapter 6 of your material, included here to complete the set.)</dd>
</dl>
<div class="callout added">
  <h5>Added: see the multiples against a fixed cycle</h5>
  <p>The same 16-matra cycle at thaah, dugun, tigun and chaugun. Watch how many swaras fit into one matra.</p>
</div>
<div class="tool" data-tool="layakari"></div>`
    }
  ]
});

/* ----------------------------- CHAPTER 6 ----------------------------- */
window.CHAPTERS.push({
  id: 'ch06',
  num: 6,
  title: 'Nuances Used in Indian Art Music',
  subtitle: 'Ornaments that bring a raga to life, and the patterns built from them',
  pdf: 'CHAPTER 6_Nuances used in Indian art music.pdf',
  minutes: 12,
  tags: ['ornaments', 'performance'],
  sections: [
    {
      id: 'elaboration',
      heading: 'Musical elaboration',
      html: `
<p class="lead">Now let us see how you perform a raga. We know that each raga has a certain set of swaras associated with it, and some patterns. However, just performing these notes as they are will not bring a raga to life.</p>
<blockquote>When you build your home, it is not enough just to arrange the blocks or bricks one on top of another. You also need to lay out the pattern, put in cement, then paint, add fittings and furniture and decorations and personal items, that make it start looking like your home.</blockquote>
<p>Similarly, when performing a raga, you need to <b>embellish or ornament</b> its building blocks or swaras to bring out its character and personality. When you do so using your creativity, you also add your personal touches, just like you do in your house.</p>`
    },
    {
      id: 'ornaments',
      heading: 'The six ornaments',
      html: `
<dl class="term-list big">
  <dt>Gamak</dt><dd>Where the artiste twists or turns the note. Instead of performing one note and then the next, the artiste can slide, twist or turn to get to the next note, or even go back and forth between the two notes to create a <b>broad shake</b>.</dd>
  <dt>Tan</dt><dd>Notes are sung or played <b>quickly</b> one after the other, at a faster speed than normal (similar to an arpeggio in western music). This is like sprinting across different notes, as compared to walking normally between them.</dd>
  <dt>Kana</dt><dd>Swara or <b>grace notes</b>, produced by suddenly touching upon or gliding from one note to the next note, prior to the principal note.</dd>
  <dt>Meend</dt><dd>A <b>slow glide</b> to link notes together, resulting in graceful curves, similar to appoggiatura in western music.</dd>
  <dt>Murki</dt><dd>When the notes around the principal note are suddenly and speedily rendered, this produces a <b>quivering</b> effect. Similar to acciaccatura in western music.</dd>
  <dt>Khatka</dt><dd>A <b>faster attack</b> on the principal note, where the note is performed so fast that it has a jerky movement.</dd>
</dl>
<div class="callout fig">
  <h5>The PDF's audio examples are dead &mdash; synthesised here instead</h5>
  <p>Each ornament in the PDF linked to sitar and bansuri .wav files on vrindabangurukul.com. Every one of those URLs now returns 404, so the demos below are synthesised in your browser. They show the <i>shape</i> of each ornament, not a real bansuri tone &mdash; use them to recognise the gesture, and your guru's playing as the actual model.</p>
</div>
<div class="tool" data-tool="nuance-lab"></div>`
    },
    {
      id: 'singing-styles',
      heading: 'Types of singing styles: notes and patterns',
      html: `
<dl class="term-list">
  <dt>Alaap</dt><dd>The systematic elaboration of a raga using appropriate swara phrases, <b>outside of the taal cycle</b>, to build up its initial mood.</dd>
  <dt>Meend</dt><dd>A glide from one swara to another, either consecutive ones or by skipping some swaras in the middle, without breaking the sound continuity. The musician accentuates the impact in a graceful, smooth manner, thereby exhibiting his/her expertise.</dd>
  <dt>Accent</dt><dd>When a particular note is stressed, weight is added to it, making it louder than the other surrounding notes. Repetition of the same swara is often included in accent. E.g. SSSS, symbolised through <b>&gt;</b> placed on top of the swara.</dd>
  <dt>Gamak</dt><dd>When a particular swara is given seriousness as well as reverberations (<i>kampan</i>). Gamak is very popular in the <b>dhrupad</b> form of singing, to bring out its deep character.</dd>
  <dt>Khatka</dt><dd>When the swaras before and after the main note are sung/played quickly with some reverberations. The symbol is <b>( )</b> with the main note placed within it. E.g. (P) could represent PMDP.</dd>
  <dt>Murki</dt><dd>Three swaras are combined and sung in quick succession. Very popular amongst <b>thumri</b> and <b>tappa</b> singers. E.g. GMP.</dd>
  <dt>Kan or sparsh swar</dt><dd>When singing a deliberate main swara, a hint of an adjacent (prior or post) swara is made to enhance the beauty of the musical phrase. Two types:
    <ul>
      <li><b>Purva lagan kan swar</b> &mdash; the note prior to the main note is touched upon. E.g. M is touched before P.</li>
      <li><b>Anu lagan kan swar</b> &mdash; the note after the main note is touched upon. E.g. D is touched with P.</li>
    </ul>
  </dd>
  <dt>Vakra swar</dt><dd>When the journey from one swara to another includes going forward, then backward, then again forward to the final swara, the note from which the musician turned back is called a vakra swara. E.g. PMGMGS in Raga Bihag.</dd>
  <dt>Tan</dt><dd>Bound within the rules of the taal cycle: raga elaboration through swaras in fast (<i>drut laya</i>) tempo.</dd>
  <dt>Swar malika</dt><dd>A raga-based composition sung in sargam, bound in an appropriate taal cycle. Used to establish the introductory swara patterns and mood of a particular raga in a systematic manner.</dd>
  <dt>Lakshan geet</dt><dd>A type of musical composition that captures the key elements of a particular raga (such as vadi-samvadi, time of singing, thaat) in a <b>poetic form</b>. Very useful for students of music, to help remember the chief distinguishing characteristics of each raga.</dd>
</dl>`
    },
    {
      id: 'forms',
      heading: 'Further forms and devices',
      html: `
<dl class="term-list">
  <dt>Tihai</dt><dd>A musical phrase that is sung or played <b>three times</b> to arrive at the sam (the start of the taal cycle). Often marks the conclusion of a musical presentation.</dd>
  <dt>Alankars / paltas</dt><dd>Ascending/descending swara patterns to develop voice clarity and provide speed exercises to students. May or may not be bound in taal.</dd>
  <dt>Chaugun</dt><dd>When sung or played at four times the original tempo.</dd>
  <dt>Bada khayal</dt><dd>Invented by the Nawab of Jaunpur, Sultan Hussain Sharki. A musical composition sung in <b>vilambit laya</b>, in Ek Taal, Jhoomra, Ada Chau Taal etc. Artistic imagination-led alaap is woven into the khayal body, slowly evolving the raga character within its rules.</dd>
  <dt>Chota khayal</dt><dd>Invented by Amir Khusro on the basis of qawwali. Sung in <b>madhya or drut laya</b> in taals like Teen Taal, Jhaptaal etc. It showcases the preparedness of the musician. It follows the bada khayal in raga presentation, to demonstrate alaap and drut layakari.</dd>
</dl>
<div class="tool" data-tool="tihai"></div>`
    }
  ]
});

/* ----------------------------- CHAPTER 7 ----------------------------- */
window.CHAPTERS.push({
  id: 'ch07',
  num: 7,
  title: 'Time Cycle (Prahar) &amp; Jati',
  subtitle: 'When a raga should be sung, how many notes it uses, and the rasa it evokes',
  pdf: 'Chapter 7_TIME CYCLE.pdf',
  minutes: 11,
  tags: ['raga', 'prahar', 'jati', 'rasa'],
  sections: [
    {
      id: 'prahar',
      heading: 'Prahar',
      html: `
<p class="lead">In Indian classical music, ragas are supposed to be rendered at a specific time of the day and in a specific season. The 24 hours in a day are divided into <b>8 equal parts called prahars</b>, and each raga is associated with a specific prahar, at which it can be performed for maximum effect.</p>
<p>A clue to finding out the prahar for a raga is to look at its <b>vadi</b> or dominant swara:</p>
<ul class="spaced">
  <li>If the vadi is in the <b>purvanga</b> (lower half of the octave &mdash; Sa, Re, Ga or Ma), the raga is suitable for the hours between <b>midday and midnight (PM)</b>.</li>
  <li>If the vadi is in the <b>uttaranga</b> (upper half &mdash; Pa, Dha, Ni, &#7776;a), it is suitable for the hours between <b>midnight and midday (AM)</b>.</li>
  <li>The ragas belonging to the time of sunrise and sunset (between 4 and 7 AM or PM) are called <b>sandhiprakash</b> or twilight ragas.</li>
</ul>
<p>The full day of 24 hours is divided into eight 3-hour intervals called prahars. According to the swara patterns and the mood it evokes, each raga is classified into a certain prahar, i.e. the most appropriate time of the day or night to sing it. For example, Raga <b>Bhairav</b> is sung in the morning from 6&ndash;9 am (first prahar of the day), while Raga <b>Malkauns</b> is sung from midnight to 3 am (third prahar of the night).</p>
<div class="callout fig">
  <h5>Rebuilt: the prahar clock</h5>
  <p>Built from the two worked examples in your PDF (Bhairav = first prahar of the day = 6&ndash;9 am; Malkauns = third prahar of the night = midnight&ndash;3 am).</p>
</div>
<div class="tool" data-tool="prahar"></div>`
    },
    {
      id: 'prahar-evolved',
      heading: 'How did the prahar theory evolve?',
      html: `
<p>It is thought that our moods and emotions are influenced by the time of the day and the season. So ragas were slotted into time slots or seasons that seem to fit the mood that they evoke.</p>
<div class="season-row">
  <div class="season"><span class="s-name">Deepak</span><span class="s-when">summer</span></div>
  <div class="season"><span class="s-name">Megh</span><span class="s-when">monsoon</span></div>
  <div class="season"><span class="s-name">Bhairav</span><span class="s-when">autumn</span></div>
  <div class="season"><span class="s-name">Malkauns</span><span class="s-when">winter</span></div>
  <div class="season"><span class="s-name">Hindol &amp; Vasanta</span><span class="s-when">spring</span></div>
</div>`
    },
    {
      id: 'jati',
      heading: 'Jati',
      html: `
<p>The number of notes or swaras used in the aroha (ascent) and avaroha (descent) is called <b>jati</b>. Expressed as a combination of the two. Ragas have three main classes or jatis:</p>
<ul class="spaced">
  <li><b>Sampurna</b> &mdash; using all 7 swaras. E.g. Raga Bihag, Bilawal.</li>
  <li><b>Shadav</b> (Sadava) &mdash; using 6 notes. E.g. Raga Khamaj (shadav&ndash;sampurna), Gujari Todi.</li>
  <li><b>Audav</b> (Odava) &mdash; using 5 notes. E.g. Raga Vrindavani Sarang, Bhupali.</li>
</ul>
<p>Based on different combinations of jatis in the aroha and avaroha, ragas can be further classified into <b>9</b> combinations:</p>
<div class="tool" data-tool="jati"></div>
<h4>Examples from the PDF</h4>
<table class="tbl">
  <thead><tr><th>Raga</th><th>Jati</th><th>Aroha</th><th>Avaroha</th></tr></thead>
  <tbody>
    <tr><td>Khamaj</td><td>Shadav &ndash; Sampurna</td><td>Sa Ga Ma Pa Dha <span class="sw komal">Ni</span> &#7776;a</td><td>&#7776;a <span class="sw komal">Ni</span> Dha Pa Ma Ga Re Sa</td></tr>
    <tr><td>Yaman</td><td>Shadav &ndash; Sampurna</td><td><span class="dotb">Ni</span> Re Ga <span class="sw teevra">&#7742;a</span> Dha Ni &#7776;a</td><td>&#7776;a Ni Dha Pa <span class="sw teevra">&#7742;a</span> Ga Re Sa</td></tr>
    <tr><td>Bhoopali</td><td>Audav &ndash; Audav</td><td>Sa Re Ga Pa Dha &#7776;a</td><td>&#7776;a Dha Pa Ga Re Sa</td></tr>
  </tbody>
</table>
<p>Additionally the aroha and avaroha can be further differentiated as <b>vakra</b> or convoluted, such that the progression of notes deviates from the sequence going up or down the scale, before resuming the sequence.</p>`
    },
    {
      id: 'swara-roles',
      heading: 'The roles a swara can play in a raga',
      html: `
<dl class="term-list">
  <dt>Vadi swara</dt><dd>The most important, most used swara in a raga.</dd>
  <dt>Samvadi swara</dt><dd>The second most important/used swara in a raga.</dd>
  <dt>Anuvadi swar</dt><dd>All other swaras used in a raga, other than vadi and samvadi.</dd>
  <dt>Vivadi swara</dt><dd>A swara not used in a raga based on its rules, but used occasionally to enhance its beauty.</dd>
  <dt>Varjit swara</dt><dd>Swaras that are not to be used in a raga according to its rules.</dd>
  <dt>Graha swara</dt><dd>The starting swara of a raga, which is more elaborate.</dd>
  <dt>Nyas swara</dt><dd>The ending swara of a raga.</dd>
  <dt>Ansh swara</dt><dd>The most prominently used swara in a raga, which later was known as nadi swara.</dd>
</dl>`
    },
    {
      id: 'taal-jati',
      heading: 'Jati of taals',
      html: `
<div class="callout added">
  <h5>Filed under the wrong chapter in your PDF</h5>
  <p>This block sits in the Time Cycle PDF but it is about <b>taal</b>, not raga. Read it together with <a href="#/ch08" class="inline-link">Chapter 8</a>.</p>
</div>
<p>Depending on the number of matras in each <b>ang</b> in a taal cycle, there are 5 broad classifications of taals:</p>
<table class="tbl">
  <thead><tr><th>Jati</th><th>Matras per ang</th><th>Examples</th></tr></thead>
  <tbody>
    <tr><td>Chatusra</td><td>2 or 4</td><td>Teen Taal 4+4+4+4, Ek Taal 2&times;7, Keherwa 4+4</td></tr>
    <tr><td>Tisra</td><td>3 or 6</td><td>Dadra 3+3</td></tr>
    <tr><td>Misra</td><td>3 and 4, or 3, 2 and 2</td><td>Rupak 3+2+2</td></tr>
    <tr><td>Khanda</td><td>5 beats per ang</td><td>Jhaptal 3+2, 3+2</td></tr>
    <tr><td>Sankirna</td><td>mixed groups</td><td>&mdash;</td></tr>
  </tbody>
</table>`
    },
    {
      id: 'rasa',
      heading: 'Aesthetics of a raga: bhava and rasa',
      html: `
<p>In Indian art music, musicians express their feelings and emotions, or <b>bhavas</b>, through their music, and arouse the same emotions in a sensitive listener. This is called the experience of <b>rasa</b>.</p>
<p>The sage <b>Bharata</b> identified <b>8</b> emotions or moods in his treatise, the <b>Natyashastra</b>. Later on, more rasas were added to the original 8.</p>
<div class="callout fig">
  <h5>Rebuilt: the navarasas</h5>
  <p>The figure was lost. The pairings below are reconstructed from the correct answer options in your own Chapter 8 quiz (hasya&ndash;humour, adbhuta&ndash;wonder, bhibhatsa&ndash;disgust, raudra&ndash;fury, karuna&ndash;pathos, vira&ndash;heroic, bhakti&ndash;devotion), filled out with the standard Natyashastra set.</p>
</div>
<div class="tool" data-tool="rasa"></div>`
    }
  ]
});

/* ----------------------------- CHAPTER 8 ----------------------------- */
window.CHAPTERS.push({
  id: 'ch08',
  num: 8,
  title: 'Introduction to Tala',
  subtitle: 'Time cycles: matra, theka, ang, taali, khaali, sam, laya and avartan',
  pdf: 'CHAPTER 8_Intro to Tala.pdf',
  minutes: 11,
  tags: ['tala', 'rhythm'],
  sections: [
    {
      id: 'what-is-tala',
      heading: 'What is a tala?',
      html: `
<p class="lead">A tala is the means by which a musician establishes a rhythm in his or her own performance.</p>
<blockquote>If you think of the march-past during a parade, the drumbeats tell the soldiers at what speed they should march and enable them to coordinate all their movements. Similarly the tala helps musicians control the speed and rhythm of what they sing or play.</blockquote>
<p>A tala is a <b>time cycle of a given number of maatras</b>, i.e. a period of time in which a certain number of beats occur in a rhythm. These maatras are grouped to form patterns, with each grouping distinguished by the <b>taali</b> and the <b>khaali</b>.</p>
<p>Musicians mark time using their hands striking down with their palms (<b>taali</b>), counting on their fingers, and also an empty clap or waving the palm in the air (<b>khaali</b>). Depending on the number of beats or maatras, and the kind of maatras, different talas are formed. The starting point, or the first beat or maatra, is called the <b>sam</b>.</p>`
    },
    {
      id: 'teen-taal',
      heading: 'Teen Taal (16 beats &mdash; taali 3, khaali 1)',
      html: `
<p>This is a cycle of 16 maatras divided into 4 equal groups of 4 maatras, with taalis on the 1st, 5th and 13th maatra and the khaali on the 9th maatra.</p>
<p>This evolved pattern is known as <b>Teen Taal</b>, as it has <i>teen</i> (three) taali or claps and one (0) empty clap. <b>X</b> denotes the first taali or clap, as well as the sam; <b>2</b> on the fifth beat and <b>3</b> on the thirteenth denote the second and the third taalis or claps; <b>0</b> denotes the khaali (empty clap).</p>
<div class="callout fig">
  <h5>Rebuilt: the tala table, now playable</h5>
  <p>The tables for every tala were lost in the conversion. These are rebuilt from the descriptions in your PDFs. Teen Taal, Ek Taal, Keherwa and Dadra are the four your PDF names; Jhaptal and Rupak are marked as extras. Bols (theka syllables) beyond Teen Taal's first four matras are the standard ones, added for practice.</p>
</div>
<div class="tool" data-tool="tala"></div>`
    },
    {
      id: 'role-of-khaali',
      heading: 'The role of the khaali',
      html: `
<p>The role of the khaali is important, since without it the Teen Taal maatras would be the same after every 4 beats (each group of 4 would have a taali followed by 3 finger counts). It is the khaali that enables musicians to <b>keep track of the sam</b>.</p>
<p>Therefore, by having a khaali, the arrival of the 3rd taali is clearly known, as well as the subsequent sam. The use of khaali also facilitates counting of the time cycle while reciting compositions in a tala.</p>`
    },
    {
      id: 'other-talas',
      heading: 'Other prominent talas',
      html: `
<table class="tbl">
  <thead><tr><th>Taal</th><th>Beats</th><th>Taali / khaali</th><th>Used in</th></tr></thead>
  <tbody>
    <tr><td>Teen Taal</td><td>16</td><td>3 taali, 1 khaali</td><td>khayal, most genres</td></tr>
    <tr><td>Ek Taal</td><td>12</td><td>4 taali, 2 khaali</td><td>bada khayal (vilambit)</td></tr>
    <tr><td>Keherwa</td><td>8</td><td>1 taali, 1 khaali</td><td>bhajan, geet, ghazal</td></tr>
    <tr><td>Dadra</td><td>6</td><td>1 taali, 1 khaali</td><td>bhajan, geet, ghazal</td></tr>
  </tbody>
</table>`
    },
    {
      id: 'rhythm-taal',
      heading: 'Rhythm and taal',
      html: `
<dl class="term-list">
  <dt>Rhythm</dt><dd>A regularised sequence of beats.</dd>
  <dt>Taal</dt><dd>A time measure of rhythm, brought under certain principles of number of beats, subdivisions etc. It is used to measure sangeet from a time perspective, in a cyclical manner.</dd>
</dl>`
    },
    {
      id: 'principles-of-taal',
      heading: 'Principles of taal',
      html: `
<dl class="term-list big">
  <dt>Matra</dt><dd>An equally spaced unit of rhythm (beat) inside a taal cycle, that can help control the laya (tempo) at which a taal cycle rotates.</dd>
  <dt>Theka</dt><dd>The standardised set of <i>bols</i> representing the prescribed number of matras in a taal cycle. E.g. <b>Dha Dhin Dhin Dha</b> is the theka for the first four matras of Teen Taal.</dd>
  <dt>Ang</dt><dd>The subdivisions inside a taal cycle that lend it a distinct personality and help a musician identify the point at which they are in a taal cycle. The start of each ang is marked by a bar line and shown with either a taali or a khaali. E.g. Teen Taal's 16 beats is divided into 4 angs, with a taali on the 1st, 5th and 13th beats and a khaali on the 9th.</dd>
  <dt>Taali / khaali / sam</dt><dd>The first matra of each ang in a taal cycle is marked by either a clap (taali) or an open hand gesture (khaali) when reciting its theka orally. The first matra of a taal cycle is called the <b>sam</b> and is usually marked by a taali. It is the most accentuated beat of the taal, is denoted by a <b>+</b> sign, and represents a sense of calm after agitation.</dd>
  <dt>Laya</dt><dd>The tempo in which a composition is played or sung. Three types:
    <ul>
      <li><b>Vilambit</b> &mdash; slow tempo, lento, 80 beats per minute on a metronome.</li>
      <li><b>Madhya</b> &mdash; medium tempo, moderato, 80&ndash;160 bpm.</li>
      <li><b>Drut</b> &mdash; fast tempo, allegro, 160+ bpm.</li>
    </ul>
  </dd>
  <dt>Name / bhava</dt><dd>By the distribution of the matras as well as bols, taals have different names and characters. E.g. Dadra is light, and Ek Taal is serious.</dd>
  <dt>Avartan</dt><dd>One complete cyclical rotation of a taal. E.g. Teen Taal has 16 matras, so one avartan consists of moving from sam (1st matra) to the 16th matra and back to sam.</dd>
</dl>`
    }
  ]
});

/* ----------------------------- CHAPTER 9 ----------------------------- */
window.CHAPTERS.push({
  id: 'ch09',
  num: 9,
  title: 'Thaat',
  subtitle: 'The ten parent scales, and how a thaat differs from a raga',
  pdf: 'CHAPTER 9_THAAT.pdf',
  sourceLabel: 'header inside the PDF reads "CHAPTER 22"',
  minutes: 9,
  tags: ['thaat', 'theory'],
  sections: [
    {
      id: 'what-is-thaat',
      heading: 'What is a thaat?',
      html: `
<p class="lead">The thaat is the most basic feature of a raga, and is the base from which ragas are launched.</p>
<p>A thaat is a particular combination of <b>7 swaras in ascending and descending order</b>. It has all 7 swaras and will <b>never feature both the shuddha and vikrit version of the same swara</b>. Ragas are formed by combining and arranging these 7 swaras in different ways. While the notes in a thaat may not have any particular appeal, the ragas must be pleasing to the ear.</p>
<blockquote>If you think of the thaat as a parent, all the ragas from that thaat are like its children. They will have swaras drawn from the parent, but depending on how these are combined, each will have very different characteristics.</blockquote>
<p>A thaat is also referred to as the <b>parental scale</b> and is <b>never sung</b>.</p>`
    },
    {
      id: 'ten-thaats',
      heading: 'The thaat system: ten thaats',
      html: `
<p><b>Pandit Bhatkhande</b> evolved a system of 10 basic thaats. Each thaat groups a particular set of swaras in their order of succession. Pandit Bhatkhande named the thaats after well-known ragas so that they would be easier to recognise &mdash; so the first thaat, Bilawal, is named after raga Bilawal, even though other ragas are also derived from it.</p>
<div class="callout fig">
  <h5>Rebuilt: the table in your PDF is broken</h5>
  <p>The thaat table in the PDF lost every underline and teevra mark, so all ten rows print as an identical "Sa Re Ga Ma Pa Dha Ni Sa". The accidentals below are restored from the numbered list further down in the same PDF (Bilawal all shuddha, Kalyan only Ma tivra, Khamaj only Ni komal, and so on). Tap a thaat to hear it.</p>
</div>
<div class="tool" data-tool="thaat"></div>`
    },
    {
      id: 'thaat-count',
      heading: 'Ten thaats, 72 thaats, and the exceptions',
      html: `
<p>These 10 thaats in Hindustani classical music map to <b>72 melakarta</b> ragas in Carnatic music. If you follow the thaat rules strictly, you can also have a total of 72 thaats, by using various combinations of shuddha or vikrit versions of the swaras Re, Ga, Ma, Dha and Ni, to encompass all the existing ragas.</p>
<p>Even then, there are some exceptions to every rule. Raga <b>Lalit</b>, for example, has both teevra and shuddha Ma. Thus there may be ragas which will be difficult to fit into any of the thaats without disrupting their basic framework.</p>`
    },
    {
      id: 'more-raga-principles',
      heading: 'More principles of a raga',
      html: `
<dl class="term-list">
  <dt>Pakad (catch phrase)</dt><dd>The shortest possible combination of swaras that helps identify or establish a raga.</dd>
  <dt>Name</dt><dd>Raga names are based on gods/goddesses, places/seasons, male/female characteristics, and composers.</dd>
  <dt>Ras (sentiment)</dt><dd>The mood or sentiment evoked by a raga through its combination of swaras. E.g. Raga Bhairav is devotional in nature so has <b>bhakti ras</b>, while Raga Bihag has <b>shringar ras</b> in it.</dd>
</dl>`
    },
    {
      id: 'thaat-vs-raga',
      heading: 'Difference between a thaat and a raga',
      html: `
<table class="tbl compare-tbl">
  <thead><tr><th></th><th>Thaat</th><th>Raga</th></tr></thead>
  <tbody>
    <tr>
      <th>Minimum swaras</th>
      <td>Must be all 7 swaras, in a consecutive manner.</td>
      <td>Must be at least 5 swaras, and need not be arranged consecutively.</td>
    </tr>
    <tr>
      <th>Types of swaras</th>
      <td>Can have only one form (shuddha or vikrit) of each of the 7 swaras.</td>
      <td>Can have more than one form of the same swara.</td>
    </tr>
    <tr>
      <th>Use</th>
      <td>A parental scale used to create a set of ragas, with no sentiment of its own. Never sung.</td>
      <td>A channelised melody that entertains the hearts of listeners through a clear sentiment that it evokes within them.</td>
    </tr>
  </tbody>
</table>
<div class="callout task">
  <h5>From the PDF</h5>
  <p>Pick any thaat and find out 3 ragas that are a part of it, along with the characteristics of those ragas.</p>
</div>`
    }
  ]
});

/* ----------------------------- CHAPTER 10 ---------------------------- */
window.CHAPTERS.push({
  id: 'ch10',
  num: 10,
  title: 'Genres of Indian Art Music',
  subtitle: 'Five kinds of music, and the four main genres of Hindustani art music',
  pdf: 'CHAPTER 10_Genres of Indian Art Music.pdf',
  sourceLabel: 'header inside the PDF reads "CHAPTER #19/#20"',
  minutes: 13,
  tags: ['genres', 'history'],
  sections: [
    {
      id: 'five-kinds',
      heading: 'Five kinds of music',
      html: `
<p class="lead">All music in India has a long standing tradition and has evolved over thousands of years. So the term "traditional" cannot be confined to non-elite music, as is generally the practice in the western world.</p>
<p>Hindustani (North Indian) music is one of the oldest and most popular types of Indian art music. It can be further divided into different genres:</p>
<div class="chip-row">
  <span class="chip">Primitive or Adima music</span>
  <span class="chip">Folk music</span>
  <span class="chip">Popular music</span>
  <span class="chip">Devotional music</span>
  <span class="chip">Art music</span>
</div>`
    },
    {
      id: 'primitive',
      heading: 'Primitive or Adima music',
      html: `
<p>In many cases, primitive music involves dancing, singing and the playing of instruments. It is normally directed towards a higher power, like nature. People who perform this kind of music often have <b>special rituals</b> associated with creating, presenting and preserving music.</p>
<p>An interesting aspect of primitive music is that ordinary objects and procedures may be used in music making. In primitive music, the <b>sense of touch</b> also comes into play. For example, hand holding, foot stamping and body thumping can become noticeable contributors to the final effect.</p>`
    },
    {
      id: 'folk',
      heading: 'Folk music',
      html: `
<p>Folk music has a clearer adherence to <b>melodic songs</b>. It has two salient features: its consistent use of sustained, unbroken sounds, and that each song should be "hummable".</p>
<p>Folk tunes can also be related to non-musical activities such as harvesting, pounding of grain etc., which have songs associated with them in many parts of India. For example, the Gujarati songs sung during Navratri for garba, or songs sung in Assam during Bihu, are all folk music.</p>
<p>Art music can be found in folk music, where folk musicians try to borrow, change or assimilate some features.</p>`
    },
    {
      id: 'popular',
      heading: 'Popular music',
      html: `
<p>Popular music is created when people from different cultures interact in society and produce music that is influenced by their cultures, different musical forms and traditions. This music appeals to people across all sections of society.</p>
<p>Some reasons leading to the making of popular music are societal changes such as the entry of a new wave of immigrants, temporary fascination with cults or political movements, and sudden exposure to new musical forms.</p>`
    },
    {
      id: 'devotional',
      heading: 'Devotional music',
      html: `
<p>Indian devotional music surges in two streams &mdash; one closer to art music and the other closer to folk music.</p>
<p>Devotional music, or <b>bhakti sangeet</b>, evolved at the time of the Bhakti movement, when many saint-poets like <b>Meerabai, Surdas</b> and <b>Appar</b> composed and sang songs in praise of God.</p>
<p>These songs were initially devoted to Lord Shiva or Lord Vishnu, and later spread to include other gods as well. Bhakti sangeet spread largely through the <b>oral tradition</b> and was composed in <b>regional languages</b> that people could understand.</p>`
    },
    {
      id: 'art-music',
      heading: 'Art music',
      html: `
<p>Art music refers to music that has a more <b>formal tradition</b>, with a definite theory and structure associated with it. Indian art music is one of the oldest and goes back thousands of years &mdash; Sage Bharata's <b>Natyashastra</b>, a treatise on Indian classical music and dance, is dated between <b>200 BCE and 200 CE</b>.</p>
<p>Art music is more <b>abstract</b> compared to the other kinds of music, as it is not intrinsically related to tangible or easily familiar things like nature, festivals or gods. Art music can be appreciated only by listening to it, and the performers aim to get both aesthetic and artistic appreciation from the audience for how they express themselves through music.</p>
<p>In art music, the styles, schools, guru-shishya tradition and other systems have been set up with more deliberation. The rules and grammar of the music are clearly laid out, both in the oral tradition and through books, and musicians need to follow them.</p>`
    },
    {
      id: 'genre-keywords',
      heading: 'Keywords',
      html: `
<dl class="term-list">
  <dt>Primitive music</dt><dd>Music directed towards a higher power like nature, involving singing, dancing, playing of instruments, as well as the sense of touch.</dd>
  <dt>Folk music</dt><dd>Music with a clear melodic strain that uses sustained unbroken sounds and catchy tunes; typically associated with non-music activities like harvest.</dd>
  <dt>Popular music</dt><dd>Music that appeals to a wide cross section of people, formed by the intermingling of different cultures in a society.</dd>
  <dt>Devotional music</dt><dd>Music dedicated to God, largely composed in regional languages.</dd>
  <dt>Art music</dt><dd>Music that has a long standing formal tradition as well as a definite theory and structure.</dd>
</dl>`
    },
    {
      id: 'genres-of-raga',
      heading: 'One raga, many genres',
      html: `
<blockquote>Imagine that you have been asked to present an idea, such as friendship. There are many ways in which you can show or describe it. You could draw a picture of two friends, you could write a poem about what friendship means, or you could do some actions to show what you do with your friends.</blockquote>
<p>In music too, the same raga can be presented in a lot of different ways or genres. <b>Hindustani art music</b> is a word that describes the many ways, forms and genres of presenting a raga. Its history can be traced between the period of <b>1300&ndash;1800 AD</b>.</p>
<p>A few examples of these genres are <b>Dhrupad, Dhamar, Khayal</b> and <b>Thumri</b>. Other genres include <b>Tarana, Tappa, Dadra, Ghazal, Bhajan</b> and <b>Kajari</b>.</p>
<p>It should be noted that although the terms <i>genre</i> and <i>style</i> are often used interchangeably, style can also denote a particular technique that characterises the artiste, use of a unique ornamentation, or overall pattern of expression.</p>
<div class="callout fig">
  <h5>All 14 audio examples in this chapter are dead links</h5>
  <p>This chapter leaned heavily on .wav clips hosted on vrindabangurukul.com (Tarana, Tappa, Dadra, Ghazal, Bhajan, Kajari, Dhrupad, Dhamar, the Khayal alaap/sthayi/antara/chota set, Thumri). All of them now return 404. The genre cards below are the text; for listening, search for a recording of each and note down what you hear.</p>
</div>
<div class="tool" data-tool="genres"></div>`
    },
    {
      id: 'dhrupad',
      heading: 'Dhrupad',
      html: `
<h4>Introduction</h4>
<p>Dhrupad comes from the word <b>dhruva</b>, which means steady and unchanging. Much like its name, the dhrupad genre has words in a <b>fixed raga</b>. It is the <b>oldest and the most disciplined</b> genre of Hindustani music practised today.</p>
<h4>History</h4>
<p>It became popular in the <b>15th century</b> under <b>Raja Mansingh Tomar</b>, king of Gwalior. It was also made popular by <b>Tansen</b>, one of the 9 gems of emperor Akbar's court.</p>
<h4>Presentation</h4>
<p>A dhrupad presentation begins with a <b>long alaap</b> that slowly shows the different properties of the raga.</p>
<p>Dhrupad music is serious and its songs are based on gods and worship (<b>bhakti rasa</b>) or heroes and their deeds (<b>veer rasa</b>). The songs are mainly written in <b>Hindi, Braj</b> and <b>Urdu</b>. This music is very difficult and more suited to male singers.</p>
<p>Convention does not permit the use of <b>tans</b> in dhrupad.</p>`
    },
    {
      id: 'dhamar',
      heading: 'Dhamar',
      html: `
<h4>History</h4>
<p>Similar to dhrupad, dhamar is an ancient and serious music genre that primarily describes scenes in the <b>Braj</b> language pertaining to <b>Holi</b>, a colourful Indian festival. Previously this style of singing was simply known as "Holi" or "Hori", although now Holi and Dhamar are considered two different presentations, that both describe the festival of Holi.</p>
<h4>Composition</h4>
<p>Dhamar remains raga based and is always sung in <b>Dhamar tala of 14 beats</b>, and describes the songs of Holi in a lighter style. Like dhrupad, dhamar also uses non-meaningful syllables like <i>te, re, ri, nom</i> in the alaap, and has complex <b>layakaries</b> (rhythmic patterns). Its compositions are mostly written in Hindi and Braj.</p>
<h4>Rendition</h4>
<p>The <b>pakhawaj</b> has been primarily used to accompany dhamar presentation, however the tabla is now used on occasion. After the full composition has been rendered in <i>barabar laya</i>, the song text may be repeated in double, triple and quadruple tempo. In changing the laya, slow improvisations are sung, repeating and regrouping the words to show novel interpretations, called <b>bolbant</b>.</p>
<p>The singer and the pakhawaj player simultaneously indulge in improvisations and come together on <b>sam</b>, at which point the singer repeats the first line of the composition or a small part of it. As the tempo increases, the rhythmic patterns become increasingly complex, culminating in a fascinating competition between the singer and percussionist.</p>`
    },
    {
      id: 'khayal',
      heading: 'Khayal',
      html: `
<h4>Introduction</h4>
<p><b>Khayal</b> is a Persian word which means <b>imagination</b>. The khayal genre, therefore, is more flexible than the dhrupad genre. You can use your imagination and make changes to the raga while performing.</p>
<h4>History</h4>
<p><b>Amir Khusro</b> was one of the most well-known singers of this genre. He mainly sang <b>qawwali</b>, a call and response form of Muslim religious singing.</p>
<h4>Rendition</h4>
<p>Khayal singing uses a very <b>brief introductory alaap</b>, often not more than a few phrases. This is followed by a slow composition known as the <b>Vilambit</b> or <b>Bada Khayal</b>, sung to the accompaniment of the tabla, consisting of two stanzas: <b>sthayi</b> and <b>antara</b>.</p>
<p>After presenting the composition, the singer begins developing the alaap and the tabla player continues to play the basic <b>theka</b> without much improvisation. The singer invariably returns to the <b>sam</b> upon completion of each melodic statement. The development of the alaap may be inspired by the form of the composition, which is termed the <i>bharata</i>. After the alaap has been completed, a few rhythmic improvisations may be used before going to the <b>tans</b>. The tans may not be very elaborate at this point, as they become more prominent in the later part of the performance.</p>
<p>The fast composition, sung after the bada khayal, is known as the <b>Drut</b> or <b>Chota Khayal</b>. This is not necessarily in the same tala. The structure and tempo of the composition afford scope for a variety of tans and rhythmic patterns (<b>layakaries</b>).</p>
<div class="flow">
  <span>brief alaap</span><span>bada khayal (vilambit): sthayi + antara</span><span>alaap development over theka</span><span>rhythmic improvisation</span><span>tans</span><span>chota khayal (drut)</span>
</div>`
    },
    {
      id: 'thumri',
      heading: 'Thumri',
      html: `
<h4>Introduction</h4>
<p>This genre is the <b>lightest</b> form of Hindustani art music amongst the three main genres.</p>
<h4>History</h4>
<p>Thumri developed in the <b>Mughal era</b> in the courts of nawabs. <b>Bahadur Shah Zafar</b> made this genre popular and wrote many thumris, up until the early half of the <b>19th century</b>.</p>
<h4>Presentation</h4>
<p>Most thumris are <b>love songs</b>, with the <b>words</b> playing a very important role.</p>`
    }
  ]
});
