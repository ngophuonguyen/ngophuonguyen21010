// Page references were checked against the supplied 202-page, 2015-imprint scan.
// Printed page n is PDF viewer page n + 1 in its instructional section.
export const aspekteChapters = [
  [
    1,
    "Home and belonging",
    8,
    [
      ["New beginnings", 10, "Word order and migration experiences"],
      ["Languages in one country", 12, "Reading and forum writing"],
      ["Cultural misunderstandings", 14, "Negation and intercultural speaking"],
      ["Integration in Germany", 16, "Listening notes and a project comment"],
    ],
  ],
  [
    2,
    "Communication",
    24,
    [
      ["Body language", 26, "Comparison clauses and je … desto"],
      ["Early language learning", 28, "Organising arguments from a text"],
      ["Small talk", 30, "The word es and listening notes"],
      ["Constructive disagreement", 32, "Criticism and conflict roleplay"],
    ],
  ],
  [
    3,
    "Working life",
    40,
    [
      ["Finding a job", 42, "Paired connectors"],
      ["Satisfaction at work", 44, "Explaining professional priorities"],
      ["Working as a team", 46, "um/ohne/statt zu and alternatives"],
      ["Presenting your application", 48, "CV, cover letter and interview"],
    ],
  ],
  [
    4,
    "Living together",
    56,
    [
      ["Sport and social inclusion", 58, "Relative clauses with wer"],
      ["Understanding poverty", 60, "Matching headings and discussing society"],
      ["Life online", 62, "Noun–verb combinations"],
      [
        "Relationships and expectations",
        64,
        "Future wishes and discussing problems",
      ],
    ],
  ],
  [
    5,
    "Science and knowledge",
    72,
    [
      ["Science for children", 74, "Passive forms and alternatives"],
      ["Truth and stories", 76, "Listening and narrative writing"],
      ["Imagining other worlds", 78, "Indefinite pronouns"],
      [
        "Rest during the working day",
        80,
        "Interview comprehension and a reader response",
      ],
    ],
  ],
  [
    6,
    "Everyday competence",
    88,
    [
      ["Shopping online", 90, "State passive"],
      ["Telephone conversations", 92, "Strategies for phone calls"],
      ["Getting along at work", 94, "Unreal comparisons with als ob"],
      [
        "Preparing for an examination",
        96,
        "Relaying information and personal letters",
      ],
    ],
  ],
  [
    7,
    "Culture",
    104,
    [
      ["Protecting cultural heritage", 106, "Text cohesion and summarising"],
      ["A cultural mystery", 108, "Narrating a short story"],
      ["Languages at risk", 110, "indem and dadurch, dass"],
      [
        "Reviewing a cultural work",
        112,
        "Understanding evaluations and presenting a work",
      ],
    ],
  ],
  [
    8,
    "History and evidence",
    120,
    [
      ["Experiencing history", 122, "Words with prepositions"],
      ["One date, several sources", 124, "Combining sources in a presentation"],
      ["Historical misconceptions", 126, "Reported speech with Konjunktiv I"],
      ["Overcoming borders", 128, "Comparing accounts and a chronology"],
    ],
  ],
  [
    9,
    "Feelings and expression",
    136,
    [
      ["Music and daily life", 138, "Nominalising verbs"],
      ["The effect of colour", 140, "Taking a position"],
      ["Emotion in conversation", 142, "Modal particles"],
      ["Mixed emotions", 144, "Structured notes and advice by email"],
    ],
  ],
  [
    10,
    "Looking ahead",
    152,
    [
      ["Robots in society", 154, "Participles as adjectives"],
      ["Future healthcare", 156, "Summarising from notes"],
      ["The changing world of work", 158, "während and genitive prepositions"],
      [
        "Future scenarios and complaints",
        160,
        "Complaint letters and discussing scenarios",
      ],
    ],
  ],
] as const;
export const aspekteModules = aspekteChapters.flatMap(
  ([chapter, chapterTitle, start, modules]) =>
    modules.map(([title, printedPage, focus], i) => ({
      id: `ch${chapter}-m${i + 1}`,
      chapter,
      chapterTitle,
      start,
      title,
      printedPage,
      pdfPage: printedPage + 1,
      focus,
    })),
);
export const aspekteGrammar = [
  ["tenses", 178, "Tenses and modal verbs"],
  ["hypothetical", 179, "Konjunktiv II"],
  ["reported", 179, "Konjunktiv I and reported speech"],
  ["passive", 180, "Process passive, state passive and alternatives"],
  ["noun-verbs", 181, "Noun–verb combinations"],
  ["pronominal", 184, "Pronominal adverbs and participles"],
  ["prepositions", 187, "Words with prepositions and negation"],
  ["word-order", 188, "Word order and modal particles"],
  ["comparisons", 190, "Comparative and unreal clauses"],
  ["connectors", 191, "Reason, concession, consequence and purpose"],
  ["sequence", 192, "Temporal and modal clauses"],
  ["relatives", 193, "Relative clauses"],
  ["cohesion", 194, "Text cohesion and reference"],
] as const;
export const aspekteGuides = [
  ...aspekteModules.map((m) => ({
    id: m.id,
    label: `Chapter ${m.chapter} · ${m.title}`,
    page: m.pdfPage,
    task: `Study printed pages ${m.printedPage}–${m.printedPage + 1}. Focus: ${m.focus}. Note one pattern and write a new example; the app's linked exercises are original transfer practice.`,
  })),
  ...aspekteGrammar.map(([id, page, focus]) => ({
    id: `grammar-${id}`,
    label: `Grammar reference · ${focus}`,
    page: page + 1,
    review: true,
    task: `Review printed page ${page}: ${focus}. Compare the rule with your own response; do not treat the app's authored check as the publisher's answer key.`,
  })),
];
