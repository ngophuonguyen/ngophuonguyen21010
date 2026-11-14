import type { Lesson } from "../features/studio/model";
// Adapted from the owner-supplied Part 1 reference; English learning notes are authored here.
export const berlinLesson: Lesson = {
  id: "berlin-arrival-v1",
  title: "Finding your place in Berlin",
  type: "narration",
  source:
    "Owner-supplied reference · original teaching text · synthetic narration",
  cues: [
    {
      start: 0,
      end: 12,
      de: "Seit ich in Berlin wohne, nehme ich die Vielfalt der Stadt bewusster wahr, obwohl mir manche Wege noch immer ungewohnt erscheinen.",
      en: "Since moving to Berlin, I have become more aware of the city’s diversity, although some routes still feel unfamiliar.",
      grammar:
        "Seit introduces an ongoing situation that began in the past; obwohl expresses concession. The conjugated verb ends each subordinate clause. Nehme … wahr is the separable verb wahrnehmen.",
    },
    {
      start: 12,
      end: 25,
      de: "Auf meinem Weg zur Arbeit komme ich an einem Café vorbei, dessen Besitzerin sowohl die Stammgäste als auch neue Nachbarn persönlich begrüßt.",
      en: "On my way to work, I pass a café whose owner greets both regular customers and new neighbours personally.",
      grammar:
        "Dessen expresses possession and refers to the neuter noun Café. Besitzerin is the subject of the relative clause. Sowohl … als auch links parallel elements.",
    },
    {
      start: 25,
      end: 38,
      de: "Dort wird nicht nur Kaffee ausgeschenkt, sondern es werden auch Gespräche geführt, durch die sich Menschen aus unterschiedlichen Lebenswelten näherkommen.",
      en: "People do more than serve coffee there: they also have conversations that bring people from different walks of life closer together.",
      grammar:
        "Process passive: wird ausgeschenkt / werden geführt. Durch takes the accusative; die refers to plural Gespräche. Nicht nur … sondern auch links complementary ideas.",
    },
    {
      start: 38,
      end: 50,
      de: "Wenn ich weniger unter Zeitdruck stünde, würde ich häufiger bleiben, um zuzuhören, statt sofort zur nächsten Verbindung weiterzulaufen.",
      en: "If I were under less time pressure, I would stay more often to listen instead of immediately rushing on to my next connection.",
      grammar:
        "Present hypothetical: stünde / würde bleiben. Um … zu expresses purpose; statt … zu presents an alternative action. Both infinitive clauses share the subject ich.",
    },
    {
      start: 50,
      end: 63,
      de: "Durch die Begegnung mit anderen Perspektiven habe ich gelernt, dass das Ankommen in einer Stadt mehr bedeutet als die bloße Anmeldung einer neuen Adresse.",
      en: "Encountering other perspectives has taught me that settling into a city means more than simply registering a new address.",
      grammar:
        "Nominalizations: die Begegnung, das Ankommen, die Anmeldung. A nominalized infinitive such as Ankommen is capitalized and neuter. Dass places bedeutet at the end.",
    },
    {
      start: 63,
      end: 76,
      de: "Trotz mancher Schwierigkeiten bin ich zuversichtlich, weil aus kleinen Gelegenheiten allmählich Beziehungen entstehen, auf die ich mich im Alltag verlassen kann.",
      en: "Despite some difficulties, I am optimistic because small opportunities gradually lead to relationships I can rely on in everyday life.",
      grammar:
        "Trotz takes the genitive here: mancher Schwierigkeiten. Sich verlassen auf takes the accusative, explaining auf die in the relative clause referring to Beziehungen.",
    },
  ],
};
