/* ------------------------------------------------------------------
   Quizzes.

   origin: 'pdf'   -> the question is printed in your PDF. The PDFs do
                      not print answer keys, so every answer here is
                      worked out from the chapter text; the "why" line
                      shows the reasoning, and "flag" marks the two
                      places where the source is genuinely ambiguous.
   origin: 'added' -> written for revision, because 7 of the 10
                      chapters have no quiz at all.
   ------------------------------------------------------------------ */
window.QUIZZES = {

  ch01: {
    added: [
      { q: 'Which of these is NOT one of the things that has stayed constant in Indian classical music?',
        options: ['Reliance on an oral tradition', 'Preference for harmonic progression rather than melodic', 'Vocal music as the primary expression', 'Consolidated concepts of raga and tala'],
        answer: 1,
        why: 'It is the other way round: the preference is for melodic progression rather than harmonic.' },
      { q: 'Sangeet aggregates which three performing arts?',
        options: ['Vocal music, dance and drama', 'Vocal music, instrumental music and dance', 'Instrumental music, dance and poetry', 'Vocal music, instrumental music and poetry'],
        answer: 1,
        why: 'Music is the western concept (vocal plus instrumental). Sangeet adds dance.' },
      { q: 'In the definition of sangeet, laya refers to',
        options: ['Melodic notes', 'Rhythmic tempo', 'The drone pitch', 'The parent scale'],
        answer: 1,
        why: 'Swar is the melodic sound, laya is the rhythmic tempo.' },
      { q: 'Why is notation needed?',
        options: ['To replace the guru', 'To transmit and preserve music', 'To fix the pitch of Sa', 'To count the taal cycle'],
        answer: 1,
        why: 'Just as an alphabet represents a language in written form, notation transmits and preserves music. It does not replace oral learning.' }
    ]
  },

  ch02: {
    pdf: [
      { q: 'How has music traditionally been learnt in India?',
        options: ['Orally', 'Through written notation', 'Neither of the above', 'Both of the above'],
        answer: 0,
        why: 'Chapter 1: reliance on an oral tradition. We do not read it from a book, we remember it by practising.' },
      { q: 'A gharana refers to multiple generations of professional musicians who are linked by',
        options: ['Guru shishya ties', 'Family ties', 'Style of singing', 'All of the above'],
        answer: 3,
        why: 'The definition names family and guru-shishya ties, and the chapter also says each gharana has its own features and specialities, i.e. its style.',
        flag: 'Read strictly, the PDF definition mentions only family and guru-shishya ties. "All of the above" is the intended answer because style is what distinguishes one gharana from another.' },
      { q: 'Normally when singing we use the following octaves the most',
        options: ['Ati mandra, mandra, madhya', 'Madhya, tar, ati tar', 'Mandra, madhya, tar', 'Ati mandra, madhya, ati tar'],
        answer: 2,
        why: 'Chapter 3: in music we normally explore these 3 saptaks. Ati mandra and ati tar are rarely used.' },
      { q: 'Which of the following statements is true?',
        options: ['The swaras Re, Ga, Dha and Ni have both shuddha and komal states', 'Sa and Pa have vikrit states', 'Ma and Dha have teevra states'],
        answer: 0,
        why: 'Sa and Pa are achal, they never move. Ma is the only swara with a teevra state.' },
      { q: 'A performing set typically consists of',
        options: ['The main performer, drone and accompanying melody', 'The main performer, drone, rhythm and accompanying melody', 'Main performer and accompanying melody only', 'Main performer and rhythm only'],
        answer: 1,
        why: 'One or two main melody performers, one or many accompanying melody performers, a rhythm accompanist, and a drone player.' }
    ],
    scramble: [
      { clue: 'Kirana, Maihar, Gwalior are all examples of this', scrambled: 'HNAGRAA', answer: 'GHARANA' },
      { clue: 'This type of swara is not shuddha', scrambled: 'IKVITR', answer: 'VIKRIT' },
      { clue: 'A way to transmit and preserve music', scrambled: 'OTOINNAT', answer: 'NOTATION' },
      { clue: 'You cannot learn music and get better without doing this', scrambled: 'ZAIRY', answer: 'RIYAZ' },
      { clue: 'A low octave that is rarely used', scrambled: 'DARAMITAN', answer: 'ATI MANDRA' },
      { clue: 'When 2 musicians perform together and alternate being the main performer', scrambled: 'DABLUGINJA', answer: 'JUGALBANDI' }
    ]
  },

  ch03: {
    added: [
      { q: 'How many notes are there in a full scale, once komal and teevra states are counted?',
        options: ['7', '10', '12', '22'],
        answer: 2,
        why: '7 shuddha plus 4 komal plus 1 teevra = 12 swara states. The 22 are shrutis, not swaras.' },
      { q: 'Which swaras have komal states?',
        options: ['Sa, Ma, Pa', 'Re, Ga, Dha, Ni', 'Re, Ma, Dha, Ni', 'All seven'],
        answer: 1,
        why: 'Four swaras have komal states. Ma alone has a teevra state, and Sa and Pa are achal.' },
      { q: 'Which saptak is produced from the throat?',
        options: ['Mandra', 'Madhya', 'Tar', 'Ati tar'],
        answer: 1,
        why: 'Mandra comes from the gut, madhya from the throat, tar from the forehead.' },
      { q: 'A single dot placed below a note means the note belongs to',
        options: ['Tar saptak', 'Mandra saptak', 'Ati tar saptak', 'Madhya saptak'],
        answer: 1,
        why: 'Dot below is mandra, no dot is madhya, dot above is tar. Two dots extend to ati mandra or ati tar.' },
      { q: 'What is the frequency relationship between the tonic Sa and the Sa that completes the saptak?',
        options: ['Half', 'Twice', 'Four times', 'They are the same'],
        answer: 1,
        why: 'The high Sa is at a frequency twice that of the tonic Sa, and starts the next saptak.' },
      { q: 'Alankars or paltas are practised in order to',
        options: ['Fix the pitch of the drone', 'Develop voice clarity and speed', 'Identify the raga', 'Mark the taal cycle'],
        answer: 1,
        why: 'They are ascending and descending patterns for voice clarity and speed, and may or may not be bound in taal.' }
    ]
  },

  ch04: {
    added: [
      { q: 'According to Bhatkhande, the minimum number of notes in a raga is',
        options: ['3', '5', '6', '7'],
        answer: 1,
        why: 'A raga cannot have less than five notes. A thaat, by contrast, must have all seven.' },
      { q: 'Which swara can a raga never omit?',
        options: ['Sa', 'Ma', 'Pa', 'Ni'],
        answer: 0,
        why: 'A raga can never omit Sa, and cannot omit both Ma and Pa at the same time.' },
      { q: 'About how many ragas form the basic repertoire of almost every performing artiste?',
        options: ['12', '50', '150', '200'],
        answer: 1,
        why: '150 to 200 ragas are well established; of these about 50 are commonly practised.' },
      { q: 'The raga closest to the features of its parent thaat is called',
        options: ['Ashraya raga', 'Vakra raga', 'Sampurna raga', 'Lakshan geet'],
        answer: 0,
        why: 'For example Raga Kafi or Raga Khamaj, each closest to the thaat of the same name.' },
      { q: 'In Indian art music the pitch of Sa is',
        options: ['Always middle C', 'Chosen to suit the performer, then held for the whole performance', 'Changed freely during the performance', 'Set by the tabla player'],
        answer: 1,
        why: 'Pitch is not absolute. Once Sa is chosen, it stays for the rest of the performance and every musician follows it.' },
      { q: 'In raga Yaman, which swaras are omitted while going up?',
        options: ['Ga and Ni', 'Sa and Pa of the madhya saptak', 'Ma and Dha', 'None'],
        answer: 1,
        why: 'Yaman omits madhya saptak Sa and Pa in the aroha, and uses teevra Ma.' }
    ]
  },

  ch05: {
    added: [
      { q: 'Which is more comprehensive?',
        options: ['Pakad', 'Chalan', 'They are identical', 'Neither, they describe tala'],
        answer: 1,
        why: 'Chalan shows how the raga moves through multiple octaves, and may combine several pakads. Some ragas have no pakad at all.' },
      { q: 'The sthayi usually operates within which saptaks?',
        options: ['Madhya and tar', 'Mandra and madhya', 'Tar and ati tar', 'Ati mandra and mandra'],
        answer: 1,
        why: 'Sthayi sits in the madhya and mandra saptak; the antara reaches from madhya into tar.' },
      { q: 'A raga whose vadi swara falls in S, R, G or M is called',
        options: ['Uttarang vadi', 'Purvang vadi', 'Sampurna', 'Vakra'],
        answer: 1,
        why: 'First half of the eight-note span is purvang; P, D, N and tar Sa are uttarang.' },
      { q: 'Dugun means',
        options: ['Half the original tempo', 'Twice the original tempo', 'Three times the original tempo', 'The original tempo'],
        answer: 1,
        why: 'Thaah is the original tempo, dugun twice, tigun thrice, chaugun four times.' }
    ]
  },

  ch06: {
    added: [
      { q: 'A slow glide that links notes into graceful curves is',
        options: ['Gamak', 'Meend', 'Murki', 'Khatka'],
        answer: 1,
        why: 'Meend is compared to appoggiatura in western music.' },
      { q: 'The quivering effect made by suddenly and speedily rendering the notes around the principal note is',
        options: ['Murki', 'Kana', 'Tan', 'Accent'],
        answer: 0,
        why: 'Murki, compared to acciaccatura. Chapter 6 also describes it as three swaras in quick succession, popular with thumri and tappa singers.' },
      { q: 'A faster attack on the principal note, so fast that it sounds jerky, is',
        options: ['Gamak', 'Meend', 'Khatka', 'Kana'],
        answer: 2,
        why: 'Khatka. Its notation symbol is ( ) with the main note inside.' },
      { q: 'Alaap is performed',
        options: ['Inside the taal cycle', 'Outside the taal cycle', 'Only in drut laya', 'Only in Teen Taal'],
        answer: 1,
        why: 'Alaap is the systematic elaboration of a raga outside the taal cycle, to build up its initial mood.' },
      { q: 'A musical phrase played three times to arrive at the sam is a',
        options: ['Tihai', 'Tan', 'Palta', 'Theka'],
        answer: 0,
        why: 'A tihai often marks the conclusion of a presentation.' },
      { q: 'Gamak is especially associated with which genre?',
        options: ['Thumri', 'Tappa', 'Dhrupad', 'Ghazal'],
        answer: 2,
        why: 'Gamak gives a swara seriousness and reverberation (kampan), which suits the deep character of dhrupad.' },
      { q: 'A composition that captures a raga in poetic form, to help students remember its characteristics, is a',
        options: ['Swar malika', 'Lakshan geet', 'Bandish', 'Bolbant'],
        answer: 1,
        why: 'A lakshan geet encodes vadi-samvadi, time of singing, thaat and so on in the lyrics.' }
    ]
  },

  ch07: {
    added: [
      { q: 'How many prahars are there in a day?',
        options: ['4', '6', '8', '12'],
        answer: 2,
        why: '24 hours divided into 8 equal parts of 3 hours each.' },
      { q: 'If the vadi of a raga is in the uttaranga (Pa, Dha, Ni, tar Sa), the raga suits',
        options: ['Midday to midnight (PM)', 'Midnight to midday (AM)', 'Only sunrise', 'Any time'],
        answer: 1,
        why: 'Uttaranga vadi points to AM hours; purvanga vadi points to PM hours.' },
      { q: 'Ragas belonging to sunrise and sunset, between 4 and 7 AM or PM, are called',
        options: ['Sandhiprakash ragas', 'Ashraya ragas', 'Vakra ragas', 'Sampurna ragas'],
        answer: 0,
        why: 'Twilight ragas.' },
      { q: 'An audav raga uses how many notes?',
        options: ['4', '5', '6', '7'],
        answer: 1,
        why: 'Audav 5, shadav 6, sampurna all 7.' },
      { q: 'A swara that is not part of a raga by its rules, but is used occasionally to enhance its beauty, is',
        options: ['Varjit', 'Vivadi', 'Anuvadi', 'Nyas'],
        answer: 1,
        why: 'Varjit swaras are the ones that must not be used at all; vivadi is the occasional guest.' },
      { q: 'Which raga does your PDF give as an example of the third prahar of the night?',
        options: ['Bhairav', 'Malkauns', 'Deepak', 'Megh'],
        answer: 1,
        why: 'Malkauns, midnight to 3 am. Bhairav is the first prahar of the day, 6 to 9 am.' },
      { q: 'Which seasonal pairing is correct?',
        options: ['Megh for summer', 'Deepak for monsoon', 'Malkauns for winter', 'Bhairav for spring'],
        answer: 2,
        why: 'Deepak for summer, Megh for monsoon, Bhairav for autumn, Malkauns for winter, Hindol and Vasanta for spring.' }
    ]
  },

  ch08: {
    pdf: [
      { q: 'Swaras are characterised by',
        options: ['Pitch and timbre', 'Pitch and intensity', 'Pitch, timbre, intensity and duration', 'Pitch, timbre and intensity'],
        answer: 2,
        why: 'Chapter 3: all musical notes have four determinate characteristics.' },
      { q: 'The number of possible notes in a scale is',
        options: ['12', '7'],
        answer: 0,
        why: 'The 7 shuddha swaras plus the 5 vikrit states make 12.' },
      { q: 'The following are characteristic features of a raga',
        options: ['Aroha and avaroha', 'Pakad and chalan', 'Thaat and jati', 'Tala', 'a, b, c', 'a, b, c, d'],
        answer: 4,
        why: 'Aroha/avaroha, pakad/chalan, thaat and jati all describe a raga. Tala is rhythm, a separate system, so option d is out. (The printed option reads "Thaat and Kati", a typo for jati.)' },
      { q: 'Read the statements and tick the correct option. A: Yaman and Khamaj are shadav sampurna ragas. B: Bhoopali is an audav-audav raga. C: Yaman is a sampurna raga belonging to Kalyan thaat. D: Bhoopali belongs to Bilawal thaat.',
        options: ['Only A and B are correct', 'A, B, D are correct', 'Only B and C are correct', 'Only B is correct'],
        answer: 0,
        why: 'A and B are stated in Chapter 7. C is wrong because Yaman is shadav-sampurna, not sampurna (it omits Sa and Pa going up), even though it does belong to Kalyan thaat.',
        flag: 'D is the tricky one. Bhoopali is conventionally placed in Kalyan thaat, which makes D false and the answer (a). If your class places Bhoopali under Bilawal, because all its notes are shuddha, then the answer is (b). Worth confirming with your guru.' },
      { q: 'Below are some rasas and their meanings. Choose the correct pairs.',
        options: ['Hasya humour, Adbhuta love, Bhibhatsa terror, Raudra fury', 'Hasya humour, Adbhuta wonder, Bhibhatsa disgust, Raudra fury', 'Hasya humour, Bhayanaka fury, Karuna peace, Vira heroic', 'Adbhuta happiness, Raudra terror, Karuna pathos, Bhakti devotion'],
        answer: 1,
        why: 'Adbhuta is wonder and bhibhatsa is disgust. In (c) bhayanaka is terror, not fury, and karuna is pathos, not peace. In (d) adbhuta is wonder, not happiness, and raudra is fury, not terror.' },
      { q: 'Which of the following statements are true?',
        options: ['A gamak is a twist and turn of the note that produces a broad shake', 'A murki is a slow and graceful rendering of a note', 'Both the tan and khatka are fast while a kana is a slow glide', 'a and c', 'a, b and c'],
        answer: 3,
        why: 'Statement b is false, a murki is fast and quivering. Statements a and c are the intended true ones.',
        flag: 'Strictly, the slow glide in Chapter 6 is meend; a kana is a grace note produced by "suddenly touching upon or gliding". The textbook treats (c) as true, so the key is (d).' },
      { q: 'Which of the following statements about talas are true? (select all)',
        options: ['Talas are time cycles with a specific number of maatras', 'The number of maatras in a tala can keep changing', 'The khaali helps counting of the time cycle as well as keeping track of the sam', 'Ek Taal has 6 beats', 'Only the rhythm players need to keep track of the tala'],
        answer: [0, 2], multi: true,
        why: 'b is false, the number of matras is fixed for a given tala. d is false, Ek Taal has 12 beats (Dadra has 6). e is false, every musician tracks the tala; the singer returns to sam at the end of each melodic statement.' }
    ],
    scramble: [
      { clue: 'The earliest form of Indian music', scrambled: 'AMANSAG', answer: 'SAMAGAN' },
      { clue: 'The smallest microtone audible to a human ear', scrambled: 'USHIRT', answer: 'SHRUTI' },
      { clue: 'Musicologist who systematised Hindustani music theory', scrambled: 'HABTANKED', answer: 'BHATKHANDE' },
      { clue: 'Ancient music treatise', scrambled: 'ANYHATSARATS', answer: 'NATYASHASTRA' },
      { clue: 'This tala has 8 beats and is used often in bhajans, geets and ghazals', scrambled: 'AWHERKE', answer: 'KEHERWA' }
    ],
    added: [
      { q: 'In Teen Taal, the khaali falls on which matra?',
        options: ['1st', '5th', '9th', '13th'],
        answer: 2,
        why: 'Taalis on 1, 5 and 13; khaali on 9. Without it, every group of 4 would feel identical.' },
      { q: 'Vilambit laya sits at roughly',
        options: ['80 bpm', '120 bpm', '160 plus bpm', '200 bpm'],
        answer: 0,
        why: 'Vilambit about 80, madhya 80 to 160, drut 160 plus.' },
      { q: 'One complete rotation of a taal cycle is called',
        options: ['Avartan', 'Theka', 'Ang', 'Sam'],
        answer: 0,
        why: 'Teen Taal: sam to the 16th matra and back to sam is one avartan.' },
      { q: 'The standardised set of bols for a tala is its',
        options: ['Ang', 'Theka', 'Jati', 'Laya'],
        answer: 1,
        why: 'For example Dha Dhin Dhin Dha for the first ang of Teen Taal.' }
    ]
  },

  ch09: {
    added: [
      { q: 'A thaat must contain',
        options: ['At least 5 swaras', 'All 7 swaras in consecutive order', 'Any 7 swara states', '12 swaras'],
        answer: 1,
        why: 'And it may never use both the shuddha and the vikrit version of the same swara.' },
      { q: 'Which thaat has only Ma in its teevra state?',
        options: ['Bilawal', 'Kalyan', 'Marwa', 'Todi'],
        answer: 1,
        why: 'Kalyan. Marwa and Todi also have teevra Ma, but they additionally have komal swaras.' },
      { q: 'Which thaat uses all four komal swaras (Re, Ga, Dha, Ni)?',
        options: ['Asavari', 'Bhairav', 'Bhairavi', 'Kafi'],
        answer: 2,
        why: 'Bhairavi. Asavari has Ga, Dha, Ni komal; Bhairav has Re and Dha komal; Kafi has Ga and Ni komal.' },
      { q: 'The 10 Hindustani thaats map to how many melakarta ragas in Carnatic music?',
        options: ['10', '22', '50', '72'],
        answer: 3,
        why: '72. Applying the thaat rules strictly also yields 72 possible thaats.' },
      { q: 'Raga Lalit is an exception to the thaat system because',
        options: ['It has only 4 notes', 'It uses both shuddha and teevra Ma', 'It omits Sa', 'It has no vadi'],
        answer: 1,
        why: 'Two states of the same swara, which a thaat may never contain, so Lalit does not fit neatly anywhere.' },
      { q: 'Is a thaat sung?',
        options: ['Yes, it is the basis of alaap', 'No, it is a parental scale with no sentiment of its own', 'Only in vilambit laya', 'Only in dhrupad'],
        answer: 1,
        why: 'A thaat is never sung. A raga is the channelised melody that evokes sentiment.' }
    ]
  },

  ch10: {
    pdf: [
      { q: 'This type of music is often dedicated to a higher power and often has rites and rituals for its preservation and teaching',
        options: ['Primitive music', 'Folk music', 'Art music', 'Devotional music'],
        answer: 0,
        why: 'Primitive or adima music is directed towards a higher power like nature, and its performers have special rituals for creating, presenting and preserving it.' },
      { q: 'This kind of music is more abstract and not directly related to tangible things',
        options: ['Folk music', 'Devotional music', 'Art music'],
        answer: 2,
        why: 'Art music is not intrinsically tied to nature, festivals or gods, and can be appreciated only by listening.' },
      { q: 'Songs sung during the Navratri garba and Bihu in Assam are examples of',
        options: ['Primitive music', 'Folk music', 'Art music'],
        answer: 1,
        why: 'Folk tunes, often tied to non-musical activities and festivals.' }
    ],
    scramble: [
      { clue: 'Music composed in regional languages in praise of God', scrambled: 'LADITOVENA', answer: 'DEVOTIONAL' },
      { clue: 'Music that has clearly defined rules and grammar', scrambled: 'TUSRMAIC', answer: 'ART MUSIC' },
      { clue: 'When different cultures in a society intermingle to create music that widely appeals to people', scrambled: 'APPORUL', answer: 'POPULAR' }
    ],
    added: [
      { q: 'Dhrupad takes its name from dhruva, which means',
        options: ['Imagination', 'Steady and unchanging', 'Light and playful', 'Devotion'],
        answer: 1,
        why: 'Khayal is the one that means imagination, from Persian.' },
      { q: 'Dhamar is always sung in',
        options: ['Teen Taal, 16 beats', 'Ek Taal, 12 beats', 'Dhamar tala, 14 beats', 'Keherwa, 8 beats'],
        answer: 2,
        why: 'Dhamar tala of 14 beats, describing the songs of Holi in a lighter style.' },
      { q: 'Which convention applies to dhrupad?',
        options: ['Tans are not permitted', 'Only the tabla may accompany', 'It must be sung in drut laya', 'It uses no alaap'],
        answer: 0,
        why: 'Convention does not permit tans in dhrupad, and it opens with a long alaap.' },
      { q: 'In a khayal presentation, the order is',
        options: ['Chota khayal, then bada khayal', 'Long alaap, then dhamar', 'Brief alaap, bada khayal (vilambit), then chota khayal (drut)', 'Tans, then alaap, then sthayi'],
        answer: 2,
        why: 'The chota khayal follows the bada khayal, and is not necessarily in the same tala.' },
      { q: 'Repeating and regrouping the words of a dhamar composition to show novel interpretations is called',
        options: ['Bolbant', 'Bandish', 'Layakari', 'Tihai'],
        answer: 0,
        why: 'Bolbant, sung as the laya changes to double, triple and quadruple tempo.' },
      { q: 'Who made thumri popular, writing many thumris up to the early 19th century?',
        options: ['Tansen', 'Amir Khusro', 'Raja Mansingh Tomar', 'Bahadur Shah Zafar'],
        answer: 3,
        why: 'Thumri developed in the Mughal era in the courts of nawabs.' }
    ]
  }
};
