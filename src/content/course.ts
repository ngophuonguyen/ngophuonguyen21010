export type Example = { de: string; en: string };
export type Word = {
  id: string;
  article: string;
  word: string;
  plural: string;
  meaning: string;
  collocations: string[];
  examples: Example[];
  scenario: string;
  clue: string;
  forms: string[];
};
const records = [
  [
    "erfahrung",
    "die",
    "Erfahrung",
    "Erfahrungen",
    "experience",
    "Erfahrung sammeln|Erfahrung mit etwas haben",
    "Du organisierst einen Musikabend. Erzähle von deiner Erfahrung.",
    "Durch frühere Erlebnisse weiß ich, wie man einen Abend organisiert. Dieses Wissen habe ich über die Jahre gesammelt.",
    [
      [
        "Ich habe Erfahrung mit der Organisation von Veranstaltungen.",
        "I have experience organizing events.",
      ],
      [
        "Bei diesem Projekt konnte ich wertvolle Erfahrungen sammeln.",
        "I was able to gain valuable experience on this project.",
      ],
      [
        "Aus Erfahrung weiß ich, dass ein guter Plan hilft.",
        "I know from experience that a good plan helps.",
      ],
      [
        "Obwohl mir die Erfahrung fehlt, bleibe ich am Ball.",
        "Although I lack experience, I keep at it.",
      ],
    ],
  ],
  [
    "entscheidung",
    "die",
    "Entscheidung",
    "Entscheidungen",
    "decision",
    "eine Entscheidung treffen|eine Entscheidung begründen",
    "Kino oder ein Musikabend zu Hause? Begründe deine Entscheidung.",
    "Wir haben beide Möglichkeiten verglichen. Jetzt steht fest, welchen Weg wir wählen. Diesen Entschluss müssen wir begründen.",
    [
      [
        "Wir müssen heute eine Entscheidung treffen.",
        "We have to make a decision today.",
      ],
      [
        "Diese Entscheidung fällt mir nicht leicht.",
        "This decision is not easy for me.",
      ],
      [
        "Könntest du deine Entscheidung begründen?",
        "Could you explain your decision?",
      ],
      [
        "Nach langem Überlegen habe ich meine Entscheidung getroffen.",
        "After thinking for a long time, I made my decision.",
      ],
    ],
  ],
  [
    "herausforderung",
    "die",
    "Herausforderung",
    "Herausforderungen",
    "challenge",
    "eine Herausforderung meistern|vor einer Herausforderung stehen",
    "Du musst Arbeit und Freizeit unter einen Hut bringen. Beschreibe diese Herausforderung.",
    "Diese schwierige Aufgabe fordert uns, aber wir können daran wachsen. Wir wollen sie gemeinsam meistern.",
    [
      [
        "Die Organisation ist eine echte Herausforderung.",
        "Organizing it is a real challenge.",
      ],
      [
        "Gemeinsam können wir diese Herausforderung meistern.",
        "Together we can overcome this challenge.",
      ],
      [
        "Wir stehen vor einer neuen Herausforderung.",
        "We are facing a new challenge.",
      ],
      [
        "Die größte Herausforderung besteht darin, genug Zeit zu finden.",
        "The biggest challenge is finding enough time.",
      ],
    ],
  ],
  [
    "gelegenheit",
    "die",
    "Gelegenheit",
    "Gelegenheiten",
    "opportunity; occasion",
    "eine Gelegenheit nutzen|die Gelegenheit haben, zu …",
    "Ein freier Abend bietet eine Gelegenheit, alte Freunde wiederzusehen. Lade sie ein.",
    "Ein freier Abend bietet eine günstige Möglichkeit, alte Freunde wiederzusehen. Diese Chance sollten wir nutzen.",
    [
      [
        "Ich möchte die Gelegenheit nutzen, dich einzuladen.",
        "I would like to take this opportunity to invite you.",
      ],
      [
        "Der Abend bietet eine gute Gelegenheit zum Austausch.",
        "The evening offers a good opportunity to exchange ideas.",
      ],
      [
        "Hattest du schon Gelegenheit, den Plan zu lesen?",
        "Have you had a chance to read the plan yet?",
      ],
      [
        "Bei dieser Gelegenheit können wir alte Freunde treffen.",
        "On this occasion, we can meet old friends.",
      ],
    ],
  ],
  [
    "vorschlag",
    "der",
    "Vorschlag",
    "Vorschläge",
    "suggestion; proposal",
    "einen Vorschlag machen|einen Vorschlag annehmen",
    "Mache einen höflichen Vorschlag für Musik und Essen bei eurem Treffen.",
    "Ich habe eine Idee für unser Treffen und stelle sie zur Diskussion. Ihr könnt sie annehmen oder ablehnen.",
    [
      ["Darf ich einen Vorschlag machen?", "May I make a suggestion?"],
      ["Dein Vorschlag klingt gut.", "Your suggestion sounds good."],
      ["Wir haben den Vorschlag angenommen.", "We accepted the suggestion."],
      [
        "Ich hätte einen anderen Vorschlag für den Abend.",
        "I would have another suggestion for the evening.",
      ],
    ],
  ],
  [
    "zeitplan",
    "der",
    "Zeitplan",
    "Zeitpläne",
    "schedule; timeline",
    "einen Zeitplan erstellen|den Zeitplan einhalten",
    "Erkläre, wie ihr mit einem realistischen Zeitplan die Vorbereitung schafft.",
    "In dieser Übersicht steht, welche Aufgabe wann erledigt wird. Wenn wir uns daran halten, sind wir rechtzeitig fertig.",
    [
      [
        "Wir sollten einen realistischen Zeitplan erstellen.",
        "We should draw up a realistic schedule.",
      ],
      [
        "Leider konnten wir den Zeitplan nicht einhalten.",
        "Unfortunately, we could not keep to the schedule.",
      ],
      [
        "Laut Zeitplan beginnt das Treffen um acht Uhr.",
        "According to the schedule, the gathering starts at eight.",
      ],
      [
        "Mit einem klaren Zeitplan bekommen wir das hin.",
        "With a clear schedule, we can manage it.",
      ],
    ],
  ],
] as const;
export const vocabulary: Word[] = records.map(
  ([id, article, word, plural, meaning, col, scenario, clue, ex]) => ({
    id,
    article,
    word,
    plural: `die ${plural}`,
    meaning,
    collocations: col.split("|"),
    scenario,
    clue,
    forms: [word, plural],
    examples: ex.map(([de, en]) => ({ de, en })),
  }),
);
export const idioms = [
  {
    de: "am Ball bleiben",
    en: "to keep at it",
    register: "Conversational",
    note: "Ich bleibe am Ball. Use bleiben in the correct form.",
  },
  {
    de: "etwas unter einen Hut bringen",
    en: "to juggle or reconcile commitments",
    register: "Conversational",
    note: "Uses the accusative: unter einen Hut. Useful for work–life balance.",
  },
  {
    de: "Das kriegen wir hin.",
    en: "We can manage that.",
    register: "Informal spoken German",
    note: "Hinkriegen is separable. In formal writing, prefer bewältigen.",
  },
];
export type Insight = {
  title: string;
  quote: string;
  explanation: string;
  skill: string;
};
export type Passage = {
  id: string;
  title: string;
  kind: string;
  sentences: Example[];
  insights: Insight[];
};
export const passages: Passage[] = [
  {
    id: "evening",
    title: "A little planning, a good evening",
    kind: "Reading · B1–B2",
    sentences: [
      {
        de: "Am Freitag möchte Lena ihre Freunde einladen.",
        en: "On Friday, Lena would like to invite her friends.",
      },
      {
        de: "Obwohl sie wenig Zeit hat, will sie am Ball bleiben.",
        en: "Although she has little time, she wants to keep at it.",
      },
      {
        de: "Die größte Herausforderung besteht darin, Arbeit und Freizeit unter einen Hut zu bringen.",
        en: "The biggest challenge is juggling work and free time.",
      },
      {
        de: "Aus Erfahrung weiß sie, dass ein realistischer Zeitplan hilft.",
        en: "She knows from experience that a realistic schedule helps.",
      },
      {
        de: "Sie macht einen Vorschlag, den alle gut finden.",
        en: "She makes a suggestion that everyone likes.",
      },
      {
        de: "Nachdem sie die Entscheidung getroffen haben, nutzen sie die Gelegenheit zum Austausch.",
        en: "After making the decision, they use the opportunity to exchange ideas.",
      },
    ],
    insights: [
      {
        title: "Concession: obwohl",
        quote: "Obwohl sie wenig Zeit hat",
        explanation:
          "The subordinate clause has its conjugated verb at the end. The following main clause starts with its verb: will sie.",
        skill: "Speaking + writing",
      },
      {
        title: "Relative clauses",
        quote: "einen Vorschlag, den alle gut finden",
        explanation:
          "Den refers to masculine Vorschlag and is the accusative object of finden.",
        skill: "Writing",
      },
      {
        title: "Temporal order",
        quote: "Nachdem sie die Entscheidung getroffen haben",
        explanation:
          "The perfect marks a completed action before the present main clause. With a past main clause, use the pluperfect.",
        skill: "Writing",
      },
      {
        title: "A natural idiom",
        quote: "unter einen Hut zu bringen",
        explanation:
          "Reconciling commitments, not moving a hat. Zu belongs before bringen in this infinitive clause.",
        skill: "Speaking",
      },
    ],
  },
  {
    id: "dialogue",
    title: "Making plans without the stress",
    kind: "Dialogue · B1–B2",
    sentences: [
      {
        de: "Lena: Ich hätte einen Vorschlag für Freitag.",
        en: "Lena: I have a suggestion for Friday.",
      },
      {
        de: "Tom: Klingt gut! Was hast du vor?",
        en: "Tom: Sounds good! What are you planning?",
      },
      {
        de: "Lena: Wir könnten Musik hören, statt ins Kino zu gehen.",
        en: "Lena: We could listen to music instead of going to the cinema.",
      },
      {
        de: "Tom: Das kriegen wir hin. Ich kümmere mich um das Essen.",
        en: "Tom: We can manage that. I will take care of the food.",
      },
      {
        de: "Lena: Je früher wir anfangen, desto entspannter wird der Abend.",
        en: "Lena: The earlier we start, the more relaxed the evening will be.",
      },
      {
        de: "Tom: Dann lass uns einen Zeitplan erstellen.",
        en: "Tom: Then let us draw up a schedule.",
      },
    ],
    insights: [
      {
        title: "Polite suggestions",
        quote: "Ich hätte … / Wir könnten …",
        explanation:
          "Konjunktiv II softens a suggestion. It is more tactful than a direct command.",
        skill: "Speaking",
      },
      {
        title: "An alternative: statt … zu",
        quote: "statt ins Kino zu gehen",
        explanation:
          "Use statt + zu-infinitive when contrasting actions with the same implied subject.",
        skill: "Writing",
      },
      {
        title: "Parallel comparisons",
        quote: "Je früher …, desto entspannter …",
        explanation:
          "The je-clause has a final verb. Desto + comparative comes before the main-clause verb.",
        skill: "Writing + speaking",
      },
      {
        title: "Spoken reassurance",
        quote: "Das kriegen wir hin.",
        explanation:
          "An informal expression using separable hinkriegen. Prefer bewältigen in formal correspondence.",
        skill: "Speaking",
      },
    ],
  },
];
export const normalize = (s: string) =>
  s
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("de-DE")
    .replace(/[.!?,;:]+$/g, "");
export const wordCount = (s: string) =>
  s.match(/\p{L}+(?:[-’']\p{L}+)*/gu)?.length ?? 0;
export const hasTarget = (s: string, w: Word) =>
  w.forms.some((f) =>
    s.match(/\p{L}+/gu)?.some((t) => normalize(t) === normalize(f)),
  );
