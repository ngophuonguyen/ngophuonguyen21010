import { vocabulary, passages, idioms } from "../course.ts";
export const studioMessages: Record<string, string> = {};
const put = (en: string, vi: string) => {
  studioMessages[en.replace(/\s+/g, " ").trim()] = vi;
};
const words = [
  [
    "kinh nghiệm",
    [
      "Tôi có kinh nghiệm tổ chức sự kiện.",
      "Qua dự án này, tôi có thể tích lũy kinh nghiệm quý báu.",
      "Từ kinh nghiệm, tôi biết kế hoạch tốt sẽ giúp ích.",
      "Dù thiếu kinh nghiệm, tôi vẫn kiên trì.",
    ],
    "Bạn tổ chức một buổi tối âm nhạc. Hãy kể về kinh nghiệm của mình.",
  ],
  [
    "quyết định",
    [
      "Hôm nay chúng ta phải đưa ra quyết định.",
      "Quyết định này không dễ với tôi.",
      "Bạn có thể giải thích lý do quyết định của mình không?",
      "Sau khi suy nghĩ lâu, tôi đã đưa ra quyết định.",
    ],
    "Đi xem phim hay nghe nhạc ở nhà? Giải thích lựa chọn của bạn.",
  ],
  [
    "thử thách",
    [
      "Việc tổ chức là một thử thách thực sự.",
      "Cùng nhau, chúng ta có thể vượt qua thử thách này.",
      "Chúng ta đang đối mặt với một thử thách mới.",
      "Thử thách lớn nhất là tìm đủ thời gian.",
    ],
    "Bạn phải cân bằng công việc và thời gian rảnh. Hãy mô tả thử thách đó.",
  ],
  [
    "cơ hội; dịp",
    [
      "Tôi muốn nhân dịp này mời bạn.",
      "Buổi tối tạo cơ hội tốt để trao đổi ý tưởng.",
      "Bạn đã có cơ hội đọc kế hoạch chưa?",
      "Nhân dịp này, chúng ta có thể gặp bạn cũ.",
    ],
    "Một tối rảnh là dịp gặp bạn cũ. Hãy mời họ.",
  ],
  [
    "đề xuất; gợi ý",
    [
      "Tôi có thể đưa ra một đề xuất không?",
      "Đề xuất của bạn nghe có vẻ hay.",
      "Chúng tôi đã chấp nhận đề xuất.",
      "Tôi có một đề xuất khác cho buổi tối.",
    ],
    "Đề xuất lịch sự về âm nhạc và đồ ăn cho buổi gặp.",
  ],
  [
    "lịch trình; kế hoạch thời gian",
    [
      "Chúng ta nên lập lịch trình thực tế.",
      "Tiếc là chúng tôi không theo kịp lịch trình.",
      "Theo lịch trình, buổi gặp bắt đầu lúc tám giờ.",
      "Với lịch trình rõ ràng, chúng ta có thể làm được.",
    ],
    "Giải thích cách nhóm chuẩn bị kịp nhờ một lịch trình thực tế.",
  ],
] as const;
for (const [i, w] of vocabulary.entries()) {
  put(w.meaning, words[i][0]);
  for (const [j, e] of w.examples.entries()) put(e.en, words[i][1][j]);
  put(w.scenario, words[i][2]);
}
const translations = [
  [
    "Thứ Sáu, Lena muốn mời bạn bè đến.",
    "Dù ít thời gian, cô ấy vẫn muốn kiên trì thực hiện.",
    "Thử thách lớn nhất là cân bằng công việc với thời gian rảnh.",
    "Từ kinh nghiệm, cô ấy biết lịch trình thực tế sẽ giúp ích.",
    "Cô ấy đưa ra đề xuất mà mọi người đều thích.",
    "Sau khi quyết định, họ tận dụng dịp này để trao đổi.",
  ],
  [
    "Lena: Mình có một đề xuất cho thứ Sáu.",
    "Tom: Nghe hay đấy! Bạn định làm gì?",
    "Lena: Chúng ta có thể nghe nhạc thay vì đi xem phim.",
    "Tom: Chúng ta làm được thôi. Mình sẽ lo đồ ăn.",
    "Lena: Càng bắt đầu sớm, buổi tối càng thoải mái.",
    "Tom: Vậy cùng lập lịch trình nhé.",
  ],
];
const explanations = [
  [
    "Mệnh đề phụ có động từ đã chia ở cuối. Câu chính tiếp theo bắt đầu bằng động từ: will sie.",
    "Den nhắc lại Vorschlag giống đực và là tân ngữ Akkusativ của finden.",
    "Perfekt đánh dấu hành động đã hoàn tất trước câu chính hiện tại. Nếu câu chính ở quá khứ, dùng Plusquamperfekt.",
    "Thành ngữ nói về dung hòa các trách nhiệm, không phải chuyển một chiếc mũ. Zu đứng trước bringen trong mệnh đề nguyên mẫu này.",
  ],
  [
    "Konjunktiv II giúp lời đề xuất nhẹ nhàng, tế nhị hơn mệnh lệnh trực tiếp.",
    "Dùng statt + zu-nguyên mẫu khi đối chiếu hai hành động có cùng chủ ngữ được ngầm hiểu.",
    "Mệnh đề je có động từ ở cuối. Desto + so sánh hơn đứng trước động từ câu chính.",
    "Cách nói thân mật dùng động từ tách hinkriegen. Khi viết trang trọng, ưu tiên bewältigen.",
  ],
];
for (const [i, p] of passages.entries()) {
  for (const [j, s] of p.sentences.entries()) put(s.en, translations[i][j]);
  for (const [j, g] of p.insights.entries())
    put(g.explanation, explanations[i][j]);
}
const idiomGlosses = [
  "kiên trì; tiếp tục cố gắng",
  "dung hòa; cân bằng nhiều trách nhiệm",
  "Chúng ta làm được thôi.",
];
for (const [i, v] of idioms.entries()) put(v.en, idiomGlosses[i]);
Object.assign(studioMessages, {
  "A little planning, a good evening": "Một chút chuẩn bị cho buổi tối vui vẻ",
  "Making plans without the stress": "Lên kế hoạch mà không căng thẳng",
  "Reading · B1–B2": "Bài đọc · B1–B2",
  "Dialogue · B1–B2": "Hội thoại · B1–B2",
  "Concession: obwohl": "Nhượng bộ: obwohl",
  "Relative clauses": "Mệnh đề quan hệ",
  "Temporal order": "Trình tự thời gian",
  "A natural idiom": "Thành ngữ tự nhiên",
  "Polite suggestions": "Đề xuất lịch sự",
  "An alternative: statt … zu": "Phương án thay thế: statt … zu",
  "Parallel comparisons": "So sánh tương quan",
  "Spoken reassurance": "Lời trấn an trong hội thoại",
  "Speaking + writing": "Nói và viết",
  "Writing + speaking": "Viết và nói",
  Conversational: "Dùng trong hội thoại",
  "Informal spoken German": "Tiếng Đức giao tiếp thân mật",
  "Ich bleibe am Ball. Use bleiben in the correct form.":
    "Ich bleibe am Ball. Chia bleiben theo đúng ngôi và thì.",
  "Uses the accusative: unter einen Hut. Useful for work–life balance.":
    "Dùng Akkusativ: unter einen Hut. Hữu ích khi nói về cân bằng công việc và cuộc sống.",
  "Hinkriegen is separable. In formal writing, prefer bewältigen.":
    "Hinkriegen là động từ tách. Văn viết trang trọng nên dùng bewältigen.",
  "Use würde + infinitive for a hypothetical situation: If I had more time, I would study German every day.":
    "Dùng würde + nguyên mẫu cho tình huống giả định: Nếu có thêm thời gian, tôi sẽ học tiếng Đức mỗi ngày.",
  "Die refers to feminine Kollegin and is the subject of the relative clause.":
    "Die nhắc lại Kollegin giống cái và làm chủ ngữ của mệnh đề quan hệ.",
  "Sich interessieren für takes the accusative.":
    "Sich interessieren für đi với Akkusativ.",
  "Je … desto … expresses a proportional comparison: The more I practice, the more confidently I speak.":
    "Je … desto … biểu thị càng… càng…: Càng luyện nhiều, tôi càng nói tự tin.",
  "Passive in the past: wurde + past participle.":
    "Bị động quá khứ: wurde + phân từ II.",
});
const glosses = `
at; on|vào; tại
Friday|thứ Sáu
would like|muốn, cách nói lịch sự
her; their|của cô ấy; của họ
friends|bạn bè
to invite|mời
although|mặc dù
she; they|cô ấy; họ
little; not much|ít; không nhiều
time|thời gian
has|có
wants to|muốn
ball|quả bóng
to stay; remain|ở lại; tiếp tục
the; who; that|mạo từ xác định; người mà; cái mà
biggest; greatest|lớn nhất
consists; lies|bao gồm; nằm ở
in it; in that|trong đó; ở việc đó
work|công việc
and|và
free time|thời gian rảnh
under; among|dưới; giữa
a; an|một; mạo từ không xác định
hat|cái mũ
to|đến; dấu hiệu trước nguyên mẫu
to bring|mang đến
from; out of|từ; ra khỏi
knows|biết
that|rằng; điều đó
realistic|thực tế
schedule|lịch trình
helps|giúp
makes; does|làm; tạo
the; whom; that|mạo từ; người/cái mà ở Akkusativ
everyone; all|mọi người; tất cả
good; well|tốt
to find; consider|tìm thấy; cho là
after|sau khi
made; met; hit|đã làm; đã gặp; đã đánh trúng
to have|có
to use; take advantage of|sử dụng; tận dụng
for; to the|cho; đến
exchange|sự trao đổi
I|tôi
would have|sẽ có, giả định
for|cho
sounds|nghe có vẻ
what|cái gì; điều gì
have|có
you|bạn
planned; in mind|dự định
we|chúng tôi; chúng ta
could|có thể, cách nói giả định
music|âm nhạc
to hear; listen|nghe
instead of|thay vì
into the; to the|vào; đến
cinema|rạp chiếu phim
to go|đi
the; that|mạo từ; điều đó
to manage; get done|xoay xở làm được
done; managed|đã làm xong
take care|chăm lo; phụ trách
myself; me|tôi; bản thân tôi
about; around; at|về; xung quanh; vào
food; meal|đồ ăn; bữa ăn
the …|càng…
earlier|sớm hơn
to start|bắt đầu
more relaxed|thoải mái hơn
becomes; will be|trở nên; sẽ là
the|mạo từ xác định
evening|buổi tối
then|sau đó; vậy thì
let|để; hãy
us|chúng tôi; chúng ta
to draw up; create|lập; tạo
`;
for (const row of glosses.trim().split("\n")) {
  const i = row.indexOf("|");
  put(row.slice(0, i), row.slice(i + 1));
}
Object.assign(studioMessages, {
  library: "thư viện",
  "Finding your place in Berlin": "Tìm chỗ đứng của mình ở Berlin",
  "Owner-supplied reference · original teaching text · synthetic narration":
    "Tài liệu chủ dự án cung cấp · bài tự biên soạn · giọng tổng hợp",
  "Original app teaching text · synthetic narration":
    "Bài tự biên soạn của ứng dụng · giọng tổng hợp",
  "Since moving to Berlin, I have become more aware of the city’s diversity, although some routes still feel unfamiliar.":
    "Từ khi sống ở Berlin, tôi cảm nhận rõ hơn sự đa dạng của thành phố, dù một số tuyến đường vẫn còn lạ.",
  "On my way to work, I pass a café whose owner greets both regular customers and new neighbours personally.":
    "Trên đường đi làm, tôi qua một quán cà phê có chủ quán đích thân chào cả khách quen lẫn hàng xóm mới.",
  "People do more than serve coffee there: they also have conversations that bring people from different walks of life closer together.":
    "Ở đó không chỉ phục vụ cà phê; còn có những cuộc trò chuyện đưa người từ các hoàn cảnh khác nhau đến gần nhau.",
  "If I were under less time pressure, I would stay more often to listen instead of immediately rushing on to my next connection.":
    "Nếu bớt áp lực thời gian, tôi sẽ ở lại nghe thường xuyên hơn thay vì vội chạy đến chuyến xe tiếp theo.",
  "Encountering other perspectives has taught me that settling into a city means more than simply registering a new address.":
    "Tiếp xúc với góc nhìn khác giúp tôi hiểu rằng hòa nhập vào một thành phố không chỉ là đăng ký địa chỉ mới.",
  "Despite some difficulties, I am optimistic because small opportunities gradually lead to relationships I can rely on in everyday life.":
    "Dù có khó khăn, tôi vẫn lạc quan vì từ những cơ hội nhỏ dần hình thành các mối quan hệ đáng tin cậy trong đời sống.",
  "Seit introduces an ongoing situation that began in the past; obwohl expresses concession. The conjugated verb ends each subordinate clause. Nehme … wahr is the separable verb wahrnehmen.":
    "Seit dẫn tình huống bắt đầu trong quá khứ và còn tiếp diễn; obwohl biểu thị nhượng bộ. Động từ đã chia kết thúc từng mệnh đề phụ. Nehme … wahr thuộc động từ tách wahrnehmen.",
  "Dessen expresses possession and refers to the neuter noun Café. Besitzerin is the subject of the relative clause. Sowohl … als auch links parallel elements.":
    "Dessen diễn tả sở hữu và nhắc Café giống trung. Besitzerin là chủ ngữ mệnh đề quan hệ. Sowohl … als auch nối các thành phần song song.",
  "Process passive: wird ausgeschenkt / werden geführt. Durch takes the accusative; die refers to plural Gespräche. Nicht nur … sondern auch links complementary ideas.":
    "Bị động quá trình: wird ausgeschenkt / werden geführt. Durch yêu cầu Akkusativ; die nhắc Gespräche số nhiều. Nicht nur … sondern auch nối các ý bổ sung.",
  "Present hypothetical: stünde / würde bleiben. Um … zu expresses purpose; statt … zu presents an alternative action. Both infinitive clauses share the subject ich.":
    "Giả định hiện tại: stünde / würde bleiben. Um … zu chỉ mục đích; statt … zu nêu hành động thay thế. Hai mệnh đề nguyên mẫu có cùng chủ ngữ ich.",
  "Nominalizations: die Begegnung, das Ankommen, die Anmeldung. A nominalized infinitive such as Ankommen is capitalized and neuter. Dass places bedeutet at the end.":
    "Danh từ hóa: die Begegnung, das Ankommen, die Anmeldung. Động từ nguyên mẫu danh từ hóa như Ankommen viết hoa và có giống trung. Sau dass, bedeutet ở cuối.",
  "Trotz takes the genitive here: mancher Schwierigkeiten. Sich verlassen auf takes the accusative, explaining auf die in the relative clause referring to Beziehungen.":
    "Trotz dùng Genitiv ở đây: mancher Schwierigkeiten. Sich verlassen auf yêu cầu Akkusativ nên mệnh đề quan hệ nhắc Beziehungen dùng auf die.",
  "Notice the position of the conjugated verb and the noun collocations in this sentence.":
    "Chú ý vị trí động từ đã chia và các cụm danh từ thường đi cùng nhau trong câu.",
});
import { dictionary } from "../dictionary.ts";
const lookupNotes = [
  "Am Freitag chỉ ngày; am Ball bleiben là thành ngữ.",
  "Dùng am Freitag để nói vào thứ Sáu.",
  "Mong muốn lịch sự, theo sau là động từ nguyên mẫu.",
  "Nhân vật hội thoại giả định.",
  "Ở đây là Akkusativ số nhiều, nhắc lại Freunde.",
  "Ở đây dùng Akkusativ số nhiều sau einladen.",
  "Mời ai: jemanden einladen.",
  "Động từ đã chia đứng cuối mệnh đề.",
  "Dựa vào ngữ cảnh và động từ để xác định số ít hay số nhiều.",
  "Wenig Zeit nghĩa là ít thời gian.",
  "Zeit haben: có thời gian.",
  "Có thể là động từ chính hoặc trợ động từ Perfekt.",
  "Diễn tả ý định, không phải từ chỉ tương lai will trong tiếng Anh.",
  "Am Ball bleiben: kiên trì tiếp tục.",
  "Am Ball bleiben: kiên trì tiếp tục.",
  "Xác định cách và giống từ mệnh đề.",
  "Ở đây là Nominativ giống cái sau die.",
  "Eine Herausforderung meistern: vượt qua thử thách.",
  "Besteht darin, … zu … giải thích thử thách nằm ở việc gì.",
  "Có thể dẫn tới mệnh đề nguyên mẫu ở phía sau.",
  "Khi chỉ công việc, từ này thường không đếm được.",
  "Nối các từ hoặc mệnh đề ngang hàng.",
  "In der Freizeit: trong thời gian rảnh.",
  "Thành ngữ dùng Akkusativ: unter einen Hut.",
  "Đánh dấu tân ngữ trực tiếp giống đực.",
  "Unter einen Hut bringen: cân bằng nhiều trách nhiệm.",
  "Ở đây là dấu hiệu của nguyên mẫu.",
  "Là một phần của thành ngữ unter einen Hut bringen.",
  "Aus Erfahrung: từ kinh nghiệm.",
  "Erfahrung sammeln: tích lũy kinh nghiệm.",
  "Thường có mệnh đề dass theo sau.",
  "Động từ đã chia đứng cuối mệnh đề.",
  "Ở đây là Nominativ giống đực trước Zeitplan.",
  "Đuôi -er sau ein trước danh từ chủ ngữ giống đực.",
  "Einen Zeitplan erstellen / einhalten: lập / tuân theo lịch trình.",
  "Người nhận tác động dùng Dativ.",
  "Einen Vorschlag machen: đưa ra đề xuất.",
  "Einen Vorschlag annehmen: chấp nhận đề xuất.",
  "Ở đây là Akkusativ giống đực, nhắc lại Vorschlag.",
  "Ở đây là chủ ngữ của finden.",
  "Etwas gut finden: thấy điều gì hay, thích điều gì.",
  "Etwas gut finden: thấy hay, thích.",
  "Chọn thì theo thứ tự các sự việc.",
  "Eine Entscheidung treffen: đưa ra quyết định.",
  "Ở đây thuộc cụm eine Entscheidung getroffen haben.",
  "Ở đây đi với getroffen để tạo Perfekt.",
  "Eine Gelegenheit nutzen: tận dụng cơ hội.",
  "Die Gelegenheit haben, etwas zu tun: có cơ hội làm gì.",
  "Zum Austausch: để trao đổi ý tưởng.",
  "Trao đổi ý kiến hoặc kinh nghiệm.",
  "Động từ chia theo ngôi thứ nhất số ít.",
  "Làm lời đề xuất nhẹ nhàng hơn.",
  "Für Freitag: dành cho thứ Sáu.",
  "Nhân vật hội thoại giả định.",
  "Klingt gut là dạng nói gọn của Das klingt gut.",
  "Hỏi về sự vật hoặc hành động.",
  "Ở đây tạo động từ tách vorhaben.",
  "Dùng Sie khi xưng hô trang trọng.",
  "Was hast du vor? nghĩa là bạn định làm gì?",
  "Đi với động từ ngôi thứ nhất số nhiều.",
  "Đưa ra đề xuất còn mang tính thăm dò.",
  "Musik hören: nghe nhạc.",
  "Musik hören không cần giới từ.",
  "Nêu hành động thay thế để đối chiếu.",
  "Ins Kino gehen: đi xem phim.",
  "Ins Kino gehen là đi đến rạp; im Kino sein là đang ở trong rạp.",
  "Dùng sein khi tạo Perfekt.",
  "Ở đây nhắc lại toàn bộ kế hoạch đã đề xuất.",
  "Das kriegen wir hin: chúng ta làm được thôi.",
  "Ở đây là phần tách đi với kriegen.",
  "Sich um etwas kümmern đi với Akkusativ.",
  "Là thành phần phản thân trong ich kümmere mich.",
  "Là giới từ bắt buộc của sich kümmern um.",
  "Ở đây chỉ đồ ăn, không phải hành động ăn.",
  "Đi cặp với desto.",
  "Je früher: càng sớm.",
  "Sau je, cả cụm động từ nằm ở cuối mệnh đề.",
  "Desto + so sánh hơn đứng đầu câu chính.",
  "Tính từ vị ngữ sau wird.",
  "Ở đây nối chủ ngữ với tính từ.",
  "Nhắc lại Abend.",
  "Am Abend: vào buổi tối.",
  "Nêu thứ tự hành động.",
  "Lass uns + nguyên mẫu: chúng ta hãy…",
  "Dùng trong cụm lass uns.",
  "Einen Zeitplan erstellen: lập lịch trình.",
];
for (const [i, e] of Object.values(dictionary).entries())
  put(e.note, lookupNotes[i]);
