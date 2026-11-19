// These questions ask about reasoning in the support language. All other book choices test German forms.
const supportQuestions = new Set([
  "7:0",
  "9:1",
  "17:1",
  "19:0",
  "20:0",
  "22:0",
  "22:1",
  "25:0",
  "27:0",
  "27:1",
  "28:0",
  "30:0",
  "30:1",
]);
export function bookAnswerLanguage(
  day: number,
  question: number,
  choice: number,
) {
  return supportQuestions.has(`${day}:${question}`) ||
    (day === 3 && question === 0 && choice === 2)
    ? "en"
    : "de";
}
