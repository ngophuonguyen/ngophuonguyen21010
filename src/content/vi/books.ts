import { bookUnits } from "../book-path/units.ts";
type Row = [
  string,
  string,
  string,
  string,
  [string, string],
  [string, string],
  string,
  string,
];
export const nativeBookUnits: Row[] = [
  [
    "Sắp xếp thông tin rõ ràng",
    "Mở rộng câu về sinh hoạt bằng phần trật tự từ trong sách.",
    "Giữ động từ đã chia ở vị trí thứ hai. Thứ tự thời gian–nguyên nhân–cách thức–địa điểm là một gợi ý trung tính, không phải quy tắc cứng cho mọi ngữ cảnh.",
    "Thứ Hai, sau giờ làm tôi học tập trung tại thư viện.",
    [
      "Câu nào đặt động từ ở vị trí thứ hai?",
      "Morgen ở vị trí đầu; động từ lerne đứng ngay sau.",
    ],
    [
      "Trong ví dụ, thành phần nào trả lời câu hỏi Wo?",
      "In der Bibliothek chỉ địa điểm; konzentriert chỉ cách thức.",
    ],
    "Có một cụm thời gian đầu câu và một lý do. Kiểm tra vị trí động từ đã chia.",
    "Mô tả lịch học sau khi chuyển nhà. Nêu thời gian, lý do, địa điểm và điều giúp bạn hòa nhập.",
  ],
  [
    "Kể trải nghiệm thành một đoạn rõ ràng",
    "Dùng góc nhìn trải nghiệm trong chủ đề chuyển nơi sống để luyện Perfekt.",
    "Đặt mốc thời gian và phân biệt sự kiện với tác động của nó. Chuyển vị trí thường dùng sein ở Perfekt; hành động có tân ngữ như organisieren dùng haben.",
    "Hai tháng trước tôi chuyển nhà, sau đó tổ chức một khóa học ngoại ngữ.",
    [
      "Chọn trợ động từ: Ich ___ nach Bremen gezogen.",
      "Ziehen mang nghĩa chuyển đến nơi mới dùng sein ở đây.",
    ],
    [
      "Chọn trợ động từ của hành động đã hoàn tất: Wir ___ die Anmeldung vorbereitet.",
      "Vorbereiten tạo Perfekt với haben; phân từ II là vorbereitet.",
    ],
    "Dùng hai động từ Perfekt với trợ động từ phù hợp và nêu một điều rút ra.",
    "Kể tình huống mới mà bạn đã vượt qua: hai sự kiện và một điều rút ra cho bước tiếp theo.",
  ],
  [
    "Sắp xếp trình tự từ các lời kể",
    "Vận dụng cách lập trình tự trong chương lịch sử vào bài kể quá khứ.",
    "Tách thời điểm xảy ra sự kiện với thời điểm kể lại sau này. Dùng Plusquamperfekt khi cần diễn tả sự việc hoàn tất trước một mốc quá khứ khác.",
    "Sau khi so sánh các lời kể, nhóm trình bày kết quả.",
    [
      "Hành động nào xảy ra trước?",
      "Mệnh đề nachdem đặt việc so sánh trước phần trình bày.",
    ],
    [
      "Điền: Bevor wir den Bericht schrieben, ___ wir die Daten geprüft.",
      "Hatten geprüft cho biết việc kiểm tra đã diễn ra trước sự việc quá khứ còn lại.",
    ],
    "Nêu ba mốc thời gian và phân biệt sự kiện với cách giải thích sự kiện.",
    "Mô tả một thay đổi ở trường hoặc thành phố. Sắp xếp ba sự kiện, phân biệt quan sát với lời giải thích sau này.",
  ],
  [
    "Chọn đúng giới từ và cách ngữ pháp",
    "Nối chủ đề lịch hẹn với phần động từ đi cùng giới từ trong sách.",
    "Học giới từ cùng động từ và cách đi kèm. Warten auf dùng Akkusativ; sprechen mit dùng Dativ. Không suy ra giới từ tiếng Đức chỉ từ bản dịch tiếng Anh hay tiếng Việt.",
    "Tôi đang chờ xác nhận và ngày mai sẽ nói chuyện với người phụ trách khóa học.",
    [
      "Điền: Wir warten ___ einen neuen Termin.",
      "Warten auf đi với Akkusativ: einen neuen Termin.",
    ],
    [
      "Điền: Ich spreche mit ___ Beraterin.",
      "Mit yêu cầu Dativ; mạo từ giống cái là der.",
    ],
    "Dùng hai cụm động từ–giới từ đúng cách ngữ pháp.",
    "Viết tin nhắn về lịch bị dời: bạn đang chờ gì, nói với ai và đề xuất giải pháp nào.",
  ],
  [
    "Lập luận cho một quyết định học tập",
    "Áp dụng cách tổ chức lập luận của bài học ngoại ngữ sớm vào phần lý do–kết quả.",
    "Lý do giải thích nhận định; ví dụ giúp chứng minh. Sau weil, động từ ở cuối. Sau deshalb trong câu chính, động từ đứng trước chủ ngữ.",
    "Tôi luyện đều vì muốn nói tự tin hơn. Vì vậy, tôi bố trí những cuộc trò chuyện ngắn.",
    [
      "Điền: Ich lerne im Tandem, weil ich mehr sprechen ___.",
      "Động từ ngôi thứ nhất möchte kết thúc mệnh đề weil.",
    ],
    [
      "Chọn mệnh đề chỉ kết quả đúng.",
      "Deshalb đứng đầu, sau đó là übe rồi ich.",
    ],
    "Phân biệt nhận định, lý do và ví dụ. Dùng weil và deshalb đúng vị trí.",
    "Có nên học ngoại ngữ mới càng sớm càng tốt? Nêu lập trường, lý do và một ví dụ từ nhóm học giả định.",
  ],
  [
    "Bất đồng mà không làm căng thẳng hơn",
    "Áp dụng phần giải quyết xung đột vào cấu trúc nhượng bộ.",
    "Thừa nhận một điểm trước khi phản đối. Obwohl đưa động từ về cuối mệnh đề; sau trotzdem là trật tự câu chính với động từ ở vị trí thứ hai.",
    "Dù hiểu ý kiến phản đối của bạn, tôi vẫn thấy lịch học cố định là có ích.",
    [
      "Điền: Obwohl der Vorschlag teuer ___, prüfen wir ihn.",
      "Ist là động từ đã chia ở cuối mệnh đề nhượng bộ.",
    ],
    [
      "Phản hồi nào có tính xây dựng?",
      "Phản hồi thứ hai thừa nhận góc nhìn khác rồi nêu một băn khoăn cụ thể.",
    ],
    "Thừa nhận mối quan tâm của người khác và dùng một cấu trúc nhượng bộ.",
    "Nhóm chưa thống nhất nơi gặp. Phản hồi một ý kiến phản đối, giải thích mong muốn và đề xuất dung hòa.",
  ],
  [
    "Giải thích giá trị của dự án địa phương",
    "Liên hệ hoạt động cộng đồng với mô-đun gắn kết xã hội.",
    "Đánh giá dự án ngắn cần mục tiêu, hành động và tác động hợp lý. Wer nói về người chưa xác định; cách của đại từ ở vế sau được quyết định theo chính vế đó.",
    "Ai tham gia đều đặn có thể làm quen thêm người trong câu lạc bộ.",
    [
      "Wer ở đây chỉ điều gì?",
      "Wer dẫn một người được mô tả bằng điều kiện trong mệnh đề quan hệ.",
    ],
    [
      "Nhận định nào nêu tác động cụ thể của dự án?",
      "Gặp hằng tuần và làm quen hàng xóm chỉ ra hành động cùng kết quả.",
    ],
    "Nêu mục tiêu, hành động, tác động và một mệnh đề wer đầy đủ.",
    "Thiết kế dự án nhỏ cho hàng xóm mới: mục tiêu, hoạt động chung và lợi ích. Dùng một câu với wer.",
  ],
  [
    "Làm rõ đề nghị qua điện thoại",
    "Dùng chiến lược hỏi lại của bài điện thoại để luyện đề nghị lịch sự.",
    "Nêu yêu cầu cụ thể, xác nhận thông tin quan trọng và hỏi lại thay vì đoán. Könnten Sie …? giúp đề nghị nhẹ nhàng; ob dẫn câu hỏi gián tiếp có/không.",
    "Quý vị có thể xác nhận lịch hẹn có diễn ra vào thứ Năm không?",
    [
      "Chọn lời đề nghị lịch sự.",
      "Könnten Sie cộng động từ nguyên mẫu là cách đề nghị lịch sự thông dụng.",
    ],
    [
      "Điền: Ich möchte wissen, ob der Kurs morgen ___.",
      "Động từ đã chia beginnt đứng cuối câu hỏi gián tiếp.",
    ],
    "Có yêu cầu, hỏi lại và xác nhận. Giữ cách xưng hô nhất quán.",
    "Viết hội thoại điện thoại ngắn để đăng ký khóa học: hỏi thông tin lịch sự, hỏi lại điểm chưa rõ và xác nhận lịch.",
  ],
  [
    "Diễn tả một ấn tượng giả định",
    "Mở rộng giả định bằng cách so sánh không có thật trong sách.",
    "Als ob dẫn so sánh không có thật hoặc còn nghi ngờ, đưa động từ xuống cuối. Hätte và wäre thường dùng; cấu trúc không khẳng định điều so sánh là sự thật.",
    "Đồng nghiệp nói cứ như anh ấy có thời gian vô hạn cho mọi việc.",
    [
      "Điền: Sie tut so, als ob sie alles ___.",
      "Wüsste là Konjunktiv II, đứng cuối mệnh đề als ob.",
    ],
    [
      "Người nói dùng als ob để làm gì?",
      "Cấu trúc so sánh một ấn tượng với tình huống giả định.",
    ],
    "Phân biệt ấn tượng với sự thật đã kiểm chứng. Dùng Konjunktiv II.",
    "Tả tình huống công việc giả định mà ấn tượng có thể sai. Dùng als ob và đề xuất cách làm rõ lịch sự.",
  ],
  [
    "Mô tả người một cách chính xác",
    "Nối mệnh đề quan hệ với cách phân biệt người cụ thể và người chưa xác định trong sách.",
    "Với der/die/das, giống và số theo danh từ được nhắc đến; cách theo vai trò bên trong mệnh đề quan hệ. Wer có thể chỉ người chưa xác định thay vì nhắc lại một danh từ cụ thể.",
    "Huấn luyện viên phụ trách dự án hỗ trợ các thành viên mới.",
    [
      "Điền: Das ist der Betreuer, ___ den Kurs organisiert.",
      "Đại từ giống đực số ít làm chủ ngữ của organisiert nên dùng Nominativ der.",
    ],
    [
      "Điền: Die Person, ___ ich helfe, ist neu im Verein.",
      "Helfen yêu cầu Dativ; đại từ quan hệ giống cái là der.",
    ],
    "Xác định danh từ được nhắc đến rồi kiểm tra cách trong mệnh đề quan hệ.",
    "Giới thiệu hai người trong câu lạc bộ giả định. Dùng mệnh đề quan hệ để tả nhiệm vụ và người họ giúp.",
  ],
  [
    "Giữ giới từ trong mệnh đề quan hệ",
    "Kết hợp cụm giới từ trong sách với mệnh đề quan hệ của ngày học.",
    "Giới từ có thể đứng ngay trước đại từ quan hệ và quyết định cách: mit dem, über die, an denen. Động từ đã chia vẫn đứng cuối mệnh đề.",
    "Đó là dự án mà nhóm chúng tôi đã làm từ tháng Một.",
    [
      "Điền: Das ist die Kollegin, mit ___ ich arbeite.",
      "Mit dùng Dativ; đại từ giống cái là der.",
    ],
    [
      "Điền: Hier ist der Bericht, über ___ wir gesprochen haben.",
      "Sprechen über dùng Akkusativ; der Bericht chuyển thành über den trong mệnh đề quan hệ.",
    ],
    "Học giới từ và cách cùng nhau. Đặt động từ đã chia ở cuối.",
    "Mô tả dự án và người bạn muốn làm cùng. Dùng hai mệnh đề quan hệ có giới từ khác nhau.",
  ],
  [
    "Nhắc lại mà không lặp mọi danh từ",
    "Dùng phần tham chiếu da-/wo- trong sách để mở rộng bài học.",
    "Dùng da(r)+giới từ cho sự vật/sự việc; giới từ+đại từ cho người. Chèn r trước nguyên âm: darauf, worauf. Mệnh đề dass tiếp theo có thể giải thích nội dung của darauf.",
    "Chúng tôi mong lớp hội thoại mới bắt đầu vào tuần tới.",
    [
      "Điền: Wartest du auf die Antwort? Ja, ich warte ___.",
      "Câu trả lời là sự việc, nên ghép auf với da và âm nối r.",
    ],
    [
      "Với người, chọn: Ich warte auf meine Schwester. Ich warte ___.",
      "Với người dùng auf cộng đại từ nhân xưng, không dùng darauf.",
    ],
    "Dùng da-/wo- cho sự vật và cấu trúc giới từ–đại từ cho người.",
    "Giải thích bạn chờ gì, vui về điều gì; một lần nói về sự vật và một lần nói về người.",
  ],
  [
    "Diễn tả quan hệ càng… càng…",
    "Gắn je … desto với mô-đun so sánh về ngôn ngữ cơ thể.",
    "Cả hai vế đều dùng dạng so sánh hơn. Vế je có động từ cuối; sau desto cộng so sánh hơn, động từ câu chính đứng trước chủ ngữ.",
    "Càng nghe kỹ, chúng ta càng dễ nhận ra hiểu lầm.",
    [
      "Điền: Je ruhiger wir sprechen, desto ___ verstehen uns andere.",
      "Cấu trúc tương quan yêu cầu so sánh hơn: besser.",
    ],
    [
      "Chọn vế sau đúng.",
      "Desto leichter ở vị trí đầu; lernen đứng trước wir.",
    ],
    "Có hai dạng so sánh hơn, đúng vị trí động từ và mối liên hệ hợp lý.",
    "Giải thích ngôn ngữ cơ thể và lắng nghe giúp hội thoại tốt hơn thế nào. Viết hai so sánh có je và desto.",
  ],
  [
    "Cân bằng hai ưu tiên nghề nghiệp",
    "Vận dụng cặp từ nối của bài tìm việc vào nhận định cân bằng.",
    "Sowohl … als auch bổ sung hai ý song song. Zwar … aber thừa nhận một điểm rồi đối chiếu điểm khác. Những thành phần được nối cần tương đương về ngữ pháp.",
    "Vị trí này có cả cơ hội bồi dưỡng lẫn giờ làm linh hoạt; công việc tuy thú vị nhưng đòi hỏi cao.",
    [
      "Điền: Ich suche sowohl Entwicklungsmöglichkeiten ___ ein gutes Team.",
      "Sowohl đi cùng als auch để bổ sung hai thành phần tương đương.",
    ],
    [
      "Cặp từ nối nào thể hiện nhượng bộ và tương phản?",
      "Zwar nêu điểm được thừa nhận; aber giới hạn hoặc đối chiếu điểm đó.",
    ],
    "Dùng cả hai cặp từ nối và các cụm danh từ song song.",
    "So sánh hai việc làm giả định: hai lợi ích chung và một khác biệt, rồi chọn có lý do.",
  ],
  [
    "Giải thích quy trình, không đặt người làm ở trung tâm",
    "Kết nối câu bị động với phần mô tả quy trình trong chương khoa học.",
    "Bị động quá trình dùng werden cộng phân từ II. Có động từ khuyết thiếu thì cuối câu là phân từ II cộng werden. Có thể bỏ người thực hiện nếu không quan trọng.",
    "Trong buổi thực hành, các thí nghiệm đơn giản được chuẩn bị; kết quả phải được ghi chép cẩn thận.",
    [
      "Điền: Die Daten ___ regelmäßig geprüft.",
      "Die Daten là số nhiều nên bị động hiện tại dùng werden.",
    ],
    [
      "Điền: Der Versuch muss wiederholt ___.",
      "Với muss, cụm bị động nguyên mẫu kết thúc bằng wiederholt werden.",
    ],
    "Dùng bị động hiện tại và một câu bị động có động từ khuyết thiếu.",
    "Giải thích ba bước làm việc trong phòng thực hành, không lặp lại người thực hiện ở mọi bước.",
  ],
  [
    "Phân biệt hành động và kết quả",
    "Mở rộng bị động quá khứ bằng bị động trạng thái trong bài mua sắm trực tuyến.",
    "Wurde repariert nói về hành động sửa trong quá khứ; war repariert mô tả trạng thái sau khi sửa. Ở hiện tại đối chiếu wird repariert với ist repariert.",
    "Khi khách gọi, thiết bị đã ở trạng thái sửa xong; nó được kiểm tra vào hôm trước.",
    [
      "Cách nào nhấn mạnh trạng thái đã hoàn tất?",
      "Ist genehmigt diễn tả trạng thái có được sau khi phê duyệt.",
    ],
    [
      "Điền bị động quá trình ở quá khứ: Die Ware ___ gestern verpackt.",
      "Wurde cộng verpackt nói về hành động đóng gói trong quá khứ.",
    ],
    "Đối chiếu một câu bị động quá trình và một câu trạng thái, có mốc thời gian rõ.",
    "Khách hỏi đơn hàng. Tả việc đã được xử lý hôm qua và trạng thái đã đạt được hôm nay.",
  ],
  [
    "Dùng cụm danh từ–động từ tự nhiên",
    "Vận dụng cụm động từ chức năng của chủ đề hành vi trực tuyến vào công việc.",
    "Học cụm danh từ–động từ như một đơn vị. Danh từ mang phần lớn nội dung; một số cụm có thể đổi thành động từ đơn, một số cần cách diễn đạt khác.",
    "Nhóm đưa ra quyết định và chịu trách nhiệm về các bước tiếp theo.",
    [
      "Chọn kết hợp thông dụng: eine Entscheidung ___.",
      "Eine Entscheidung treffen là một cụm danh từ–động từ thông dụng.",
    ],
    [
      "Unter Druck stehen trong ngữ cảnh này có nghĩa gì?",
      "Cụm nói về áp lực, không phải vị trí đứng trong không gian.",
    ],
    "Dùng hai cụm hoàn chỉnh và giải thích hành động được đề xuất.",
    "Tả cách nhóm học xử lý quá nhiều nhiệm vụ trực tuyến; dùng hai cụm danh từ–động từ và đề xuất giảm tải.",
  ],
  [
    "Hỏi thông tin hữu ích khi phỏng vấn",
    "Áp dụng phần phỏng vấn xin việc vào câu hỏi gián tiếp.",
    "Câu hỏi gián tiếp nhẹ nhàng hơn và đặt động từ đã chia ở cuối. Dùng ob cho câu hỏi có/không, từ để hỏi cho thông tin cụ thể.",
    "Tôi muốn biết nhân viên mới sẽ đảm nhận những nhiệm vụ nào.",
    [
      "Điền: Können Sie mir sagen, wann die Einarbeitung ___?",
      "Wann dẫn câu hỏi gián tiếp; beginnt là động từ đã chia đứng cuối.",
    ],
    [
      "Từ mở đầu nào phù hợp câu hỏi có/không?",
      "Ob nghĩa là liệu/có…không, dẫn câu hỏi gián tiếp dạng có/không.",
    ],
    "Có một câu hỏi ob, một câu với từ để hỏi và dẫn chứng cho một kỹ năng.",
    "Chuẩn bị hai câu hỏi lịch sự cho phỏng vấn và nêu kinh nghiệm của bạn bằng ví dụ cụ thể.",
  ],
  [
    "Giải thích một chiến lược bảo tồn",
    "Dùng cách liên kết văn bản trong chủ đề di sản cho bài vận dụng bền vững.",
    "Tóm tắt cần tham chiếu rõ: đại từ hoặc từ gần nghĩa phải chỉ về một ý nhận diện được. Tình huống môi trường ở đây là bài vận dụng mới ngoài chủ đề di sản của sách.",
    "Thành phố bảo vệ một công trình cũ. Nhờ vậy, nơi này vẫn dành cho các thế hệ sau tiếp cận.",
    [
      "Trong ví dụ, dieser Ort chỉ điều gì?",
      "Cụm này nhắc lại công trình/địa điểm đã được nêu trước.",
    ],
    [
      "Điền mệnh đề mục đích: Wir nutzen Materialien erneut, um Ressourcen ___ schonen.",
      "Um cộng zu-nguyên mẫu chỉ mục đích khi có cùng chủ ngữ.",
    ],
    "Có một mệnh đề mục đích và hai tham chiếu không gây nhầm lẫn.",
    "Thành phố muốn cải tạo trung tâm học cũ theo hướng bền vững. Nêu hai biện pháp, mục đích và liên kết các câu rõ ràng.",
  ],
  [
    "Đánh giá đề xuất cho ngày làm việc",
    "Vận dụng chiến lược nghe phỏng vấn về nghỉ ngơi vào chủ đề cân bằng và mục đích.",
    "Phân biệt lợi ích mà đề xuất nêu với đánh giá của bạn. Um … zu dùng cùng chủ ngữ; damit cho phép nêu chủ ngữ khác.",
    "Ban quản lý dự định có phòng nghỉ yên tĩnh để nhân viên hồi sức tốt hơn.",
    [
      "Vì sao dùng damit phù hợp trong ví dụ?",
      "Ban quản lý lập kế hoạch; nhân viên hồi sức. Damit diễn tả mục đích giữa hai chủ ngữ.",
    ],
    [
      "Điền: Ich lege eine Pause ein, um mich besser ___ konzentrieren.",
      "Cùng một người nghỉ và tập trung nên dùng um … zu.",
    ],
    "Phân biệt đề xuất và đánh giá. Dùng đúng một mệnh đề mục đích.",
    "Đánh giá đề xuất cải thiện giờ nghỉ: một lợi ích, một giới hạn và một phương án khả thi.",
  ],
  [
    "Lập luận về thói quen số",
    "Học lại chủ đề hành vi trực tuyến qua lập luận, khác bài luyện cụm từ ngày 17.",
    "Mô tả hành vi cụ thể trước khi đánh giá. Lập luận cần lý do, hệ quả và phương án có thể làm; không chẩn đoán một người chỉ từ một thói quen.",
    "Người liên tục kiểm tra tin nhắn làm gián đoạn công việc; vì vậy, khung giờ trực tuyến cố định có thể có ích.",
    [
      "Nhận định nào đủ cụ thể và có giới hạn?",
      "Nhận định thứ hai chỉ hành vi và tác động có thể có, không khái quát quá mức.",
    ],
    [
      "Chọn mệnh đề chỉ hệ quả đúng.",
      "Động từ tách schalten ở vị trí thứ hai; aus kết thúc câu.",
    ],
    "Có nhận định giới hạn, lý do và quy tắc khả thi; tránh chẩn đoán chung chung.",
    "Nhóm học có nên tắt thông báo khi làm chung? Nêu lập trường, phản biện và một quy tắc cụ thể.",
  ],
  [
    "So sánh điều các nguồn thực sự nêu",
    "Áp dụng cách trình bày nhiều nguồn trong chương lịch sử vào đánh giá thông tin.",
    "Tách nguồn, nhận định và bằng chứng. Hai nguồn lặp cùng xuất xứ không phải hai xác nhận độc lập. Konjunktiv I có thể thuật ý mà không tán thành ý đó.",
    "Báo cáo nói biện pháp có hiệu quả; tuy nhiên, nguồn thứ hai không đưa dữ liệu có thể so sánh.",
    [
      "Sei ở đây đánh dấu điều gì?",
      "Sei là Konjunktiv I, đánh dấu lời thuật lại chứ không xác nhận đã kiểm chứng.",
    ],
    [
      "Hai trang lặp lại cùng báo cáo gốc. Kết luận gì?",
      "Thông tin lặp có thể cùng một nguồn, nên cần xét cả xuất xứ lẫn số trang đăng.",
    ],
    "Nêu nguồn từng nhận định và phân biệt bằng chứng với diễn giải.",
    "Hai bản tin giả định đánh giá dự án thành phố khác nhau. Đối chiếu nhận định, chỉ thông tin thiếu và kết luận thận trọng.",
  ],
  [
    "Viết khiếu nại có yêu cầu khắc phục rõ",
    "Nối bài viết khiếu nại trong chương tương lai với vấn đề dịch vụ của ngày học.",
    "Nêu dịch vụ đã thỏa thuận, vấn đề quan sát được và yêu cầu hợp lý. Khiếu nại cụ thể, lịch sự dễ xử lý hơn cáo buộc không có chi tiết.",
    "Dù lịch đã được xác nhận, buổi tư vấn không diễn ra. Vì vậy, tôi đề nghị một lịch thay thế.",
    [
      "Yêu cầu nào có thể thực hiện được?",
      "Yêu cầu thứ hai nêu biện pháp khắc phục và thời hạn trả lời.",
    ],
    [
      "Chọn lời mở đầu trang trọng phù hợp.",
      "Cách thứ nhất phù hợp người nhận trang trọng mà ta chưa biết tên.",
    ],
    "Có thỏa thuận, vấn đề, giải pháp mong muốn; dùng văn phong trang trọng và lời kết rõ.",
    "Buổi thực hành trực tuyến đã đặt bị hủy không báo trước. Viết khiếu nại có thông tin đặt chỗ, vấn đề và giải pháp mong muốn.",
  ],
  [
    "Đề xuất phương án khác trong nhóm",
    "Áp dụng cấu trúc nguyên mẫu trong bài làm việc nhóm vào đề xuất chung.",
    "Um … zu chỉ mục đích; ohne … zu nói hành động đi kèm không xảy ra; statt … zu nêu phương án thay thế. Khác chủ ngữ thường cần mệnh đề có động từ đã chia.",
    "Thay vì gửi thêm tin nhắn, chúng ta có thể cùng làm rõ các câu hỏi còn mở.",
    [
      "Cấu trúc nào nêu phương án thay thế?",
      "Statt … zu đối chiếu một hành động với phương án khác.",
    ],
    [
      "Điền: Wir treffen uns, um den Ablauf ___ planen.",
      "Um den Ablauf zu planen là mệnh đề mục đích cùng chủ ngữ.",
    ],
    "Dùng statt … zu và một cấu trúc mục đích. Đề xuất cần cụ thể.",
    "Nhóm lên kế hoạch hoạt động chung. Đề xuất cách thay buổi họp dài và giải thích cách bảo đảm mục tiêu, thời gian.",
  ],
  [
    "Cân nhắc lập luận thay vì liệt kê ý kiến",
    "Trở lại chủ đề học ngoại ngữ để so sánh các lý do cạnh tranh.",
    "Lập luận thuyết phục khi lý do, ví dụ và giới hạn gắn kết với nhau. Mệnh đề nhượng bộ có thể thừa nhận ý hợp lý mà không bỏ lập trường của mình.",
    "Dù khóa trực tuyến linh hoạt, một số người cần lịch hội thoại cố định để nói đều đặn.",
    [
      "Bổ sung nào làm lập luận vững hơn?",
      "Ví dụ hỗ trợ lý do; giới hạn chỉ ra phạm vi của nhận định.",
    ],
    [
      "Mệnh đề nào trong ví dụ diễn tả mục đích?",
      "Damit dẫn kết quả mong muốn: nói đều đặn.",
    ],
    "Có nhận định, lý do, ví dụ, giới hạn; kết luận phải xuất phát từ lập luận.",
    "Khóa B2 có nên chủ yếu học trực tuyến? So sánh hai lập luận, thừa nhận giới hạn và kết luận có lý do.",
  ],
  [
    "Viết đơn hoặc thư ứng tuyển cụ thể",
    "Dùng chiến lược dẫn chứng trong bài xin việc cho email trang trọng.",
    "Nối yêu cầu với kinh nghiệm cụ thể và giải thích sự liên quan. Không tự nhận kỹ năng mà thiếu bằng chứng. Ví dụ của ứng dụng được viết mới, không phải đáp án mẫu của nhà xuất bản.",
    "Ở dự án trước tôi đã điều phối lịch; tôi muốn đóng góp kinh nghiệm đó cho nhóm của quý vị.",
    [
      "Câu nào chứng minh kỹ năng bằng dẫn chứng?",
      "Nhiệm vụ và bối cảnh cụ thể làm dẫn chứng cho khả năng điều phối.",
    ],
    [
      "Lời kết nào hợp thư hỏi thông tin trang trọng?",
      "Mit freundlichen Grüßen phù hợp thư từ trang trọng.",
    ],
    "Có mục đích, kỹ năng kèm dẫn chứng, sự liên quan, câu hỏi và lời kết trang trọng.",
    "Viết thư hỏi thực tập trang trọng: nối yêu cầu với kinh nghiệm cụ thể và đặt câu hỏi làm rõ.",
  ],
  [
    "Ghi chép bài nghe có cấu trúc",
    "Kết hợp ghi chú bài giảng B2 với quy ý người nói trong Teil 4 B1. Đây là hai bản ghi khác nhau.",
    "Với bài giảng, ghi chủ đề, nhận định, ví dụ, kết luận. Với thảo luận, thêm người nói và thay đổi lập trường. Đọc bản chép lời không chứng minh đã nghe âm thanh.",
    "Khi người dẫn hỏi thêm, khách mời giới hạn nhận định và đưa một ngoại lệ.",
    [
      "Ghi chú nào hữu ích nhất cho bài nhiều người nói?",
      "Người nói, lập trường và điều kiện giúp phân biệt nhận định với ý kiến khác.",
    ],
    [
      "Khi không có đúng âm thanh, có thể trung thực ghi nhận việc gì?",
      "Đọc bản chép lời giúp phân tích nhưng không thể chứng minh hoàn thành nghe.",
    ],
    "Ghi rõ ví dụ giả định. Phân biệt ghi cấu trúc bài giảng với quy ý người nói; không nhận là đã nghe khi chưa phát.",
    "Lập khung ghi chú cho bài giảng và thảo luận. Dùng ví dụ giả định để tách người nói, lập trường và giới hạn.",
  ],
  [
    "Kể chuyện dễ theo dõi",
    "Dùng bài kể chuyện bí ẩn văn hóa để luyện trình tự và quá khứ trước quá khứ.",
    "Truyện ngắn cần bối cảnh ban đầu, thay đổi và cách giải quyết. Chỉ dùng Plusquamperfekt cho sự việc xảy ra trước mốc quá khứ chính, không dùng cho mọi động từ.",
    "Khi nhóm đến bảo tàng, người phụ trách đã tìm thấy cuốn danh mục thất lạc.",
    [
      "Trong ví dụ, sự việc nào xảy ra trước?",
      "Hatte gefunden đánh dấu sự việc hoàn tất trước ankam.",
    ],
    [
      "Điền: Nachdem wir den Hinweis gelesen hatten, ___ wir den Raum.",
      "Hành động chính trong quá khứ dùng Präteritum: durchsuchten.",
    ],
    "Trình tự rõ và một mệnh đề Plusquamperfekt có dụng ý; tránh chỉ liệt kê sự kiện.",
    "Sáng tác truyện ngắn về đồ thất lạc trong thư viện. Sắp xếp việc phát hiện, nguyên nhân xảy ra trước và cách giải quyết.",
  ],
  [
    "Phân biệt quá khứ giả định và ấn tượng không thực",
    "Liên hệ so sánh Konjunktiv II trong sách với điều kiện quá khứ của ngày học.",
    "Giả định quá khứ dùng hätte/wäre cộng phân từ II. So sánh als ob mô tả ấn tượng; tự nó không nói điều gì đã có thể xảy ra khác đi.",
    "Nếu phân công sớm hơn, chúng tôi đã hoàn thành đúng giờ.",
    [
      "Điền: Wenn ich früher gefragt ___, hätte ich die Regel verstanden.",
      "Hätte gefragt là dạng giả định quá khứ ở mệnh đề điều kiện.",
    ],
    [
      "Câu nào nêu rõ phương án khác trong quá khứ?",
      "Hätten geplant và wären gewesen mô tả quá khứ giả định khác thực tế.",
    ],
    "Phân biệt phương án quá khứ không có thật với hành động tương lai thực tế.",
    "Tả lỗi lập kế hoạch giả định, nêu phương án khác trong quá khứ, rồi nói bạn thực sự sẽ đổi gì lần tới.",
  ],
  [
    "Biến tự đánh giá thành kế hoạch học tiếp",
    "Dùng từ nối đối chiếu trong bài nghề nghiệp tương lai để tổng kết và lập kế hoạch.",
    "Während có thể chỉ đồng thời hoặc đối chiếu. Kế hoạch tự đánh giá cần dẫn chứng quan sát được, mục tiêu vừa sức và hành động cụ thể, thay vì lời hứa chung chung.",
    "Trong khi việc đọc đã dễ hơn, tôi vẫn cần luyện nói tự phát nhiều hơn.",
    [
      "Während trong ví dụ diễn tả điều gì?",
      "Câu đối chiếu tiến bộ đọc với nhu cầu luyện nói còn lại.",
    ],
    [
      "Mục tiêu nào kiểm tra được?",
      "Mục tiêu thứ hai nêu hành động, số lượng, thời hạn và tiêu chí tự kiểm tra.",
    ],
    "Dùng dẫn chứng từ bài của mình, một ý đối chiếu và hành động đo được; tránh tự nhận trình độ thiếu căn cứ.",
    "Tổng kết hai kỹ năng, so sánh tiến bộ và khó khăn, rồi lập hai bước tiếp theo cùng mục tiêu kiểm tra được.",
  ],
];
export const bookMessages: Record<string, string> = {};
const put = (en: string, vi: string) => {
  bookMessages[en.replace(/\s+/g, " ").trim()] = vi;
};
for (const [i, r] of nativeBookUnits.entries()) {
  const u = bookUnits[i];
  const [focus, connection, insight, translation, q1, q2, checklist, prompt] =
    r;
  put(u.focus, focus);
  put(u.connection, connection);
  put(u.insight, insight);
  put(u.translation, translation);
  put(u.checklist, checklist);
  put(u.production, prompt);
  for (const [j, q] of [q1, q2].entries()) {
    put(u.questions[j].prompt, q[0]);
    put(u.questions[j].explanation, q[1]);
  }
  put(u.sources[0].purpose, `Tham khảo mục này trong sách. ${connection}`);
}
Object.assign(bookMessages, {
  "Both necessarily happened simultaneously.":
    "Cả hai nhất thiết xảy ra cùng lúc.",
  "A specific named association": "Một hội có tên cụ thể",
  "An unspecified person": "Một người chưa xác định",
  "A place": "Một địa điểm",
  "Certifying a fact": "Xác nhận một sự thật",
  "Making an unreal or doubtful comparison":
    "So sánh giả định hoặc còn nghi ngờ",
  "Giving a direct command": "Đưa mệnh lệnh trực tiếp",
  "To stand underneath a printer": "Đứng dưới máy in",
  "To experience pressure or stress": "Chịu áp lực hoặc căng thẳng",
  "To print a document": "In tài liệu",
  "An unnamed new city": "Một thành phố mới chưa được nêu tên",
  "The protected building or site": "Công trình hoặc địa điểm được bảo vệ",
  "A future generation": "Một thế hệ tương lai",
  "The two clauses have different subjects.":
    "Hai mệnh đề có chủ ngữ khác nhau.",
  "Damit always removes the verb.": "Damit luôn loại bỏ động từ.",
  "The sentence describes the past.": "Câu đang mô tả quá khứ.",
  "The writer's verified personal observation":
    "Quan sát cá nhân đã kiểm chứng của người viết",
  "A claim attributed to the report": "Một nhận định được thuật lại từ báo cáo",
  "A command to the reader": "Một mệnh lệnh cho người đọc",
  "There are automatically two independent confirmations.":
    "Tự động có hai xác nhận độc lập.",
  "Their independence still needs checking.":
    "Vẫn cần kiểm tra chúng có độc lập không.",
  "The claim must be false.": "Nhận định chắc chắn sai.",
  "A relevant example and a stated limitation":
    "Ví dụ phù hợp và giới hạn được nêu rõ",
  "Repeating the same opinion louder": "Lặp lại cùng ý kiến to hơn",
  "An unrelated anecdote without a link": "Giai thoại không liên quan",
  "A list of isolated familiar words": "Danh sách từ quen rời rạc",
  "Guest B: supports the proposal only if costs remain low":
    "Khách B: chỉ ủng hộ đề xuất nếu chi phí vẫn thấp",
  "Everything sounded positive": "Mọi thứ nghe có vẻ tích cực",
  "Native listening completed": "Đã hoàn thành nghe bản ngữ",
  "Transcript analysis; listening still pending":
    "Đã phân tích bản chép lời; phần nghe vẫn chưa làm",
  "An official listening score": "Điểm nghe chính thức",
  "The group's arrival": "Việc nhóm đến nơi",
  "The curator's finding the catalogue":
    "Việc người phụ trách tìm thấy danh mục",
  "Neither can be ordered": "Không thể xác định thứ tự",
  "A contrast between two skills": "Sự đối chiếu giữa hai kỹ năng",
  "Only a date": "Chỉ một ngày tháng",
  "A direct command": "Mệnh lệnh trực tiếp",
  "I will become perfect soon.": "Tôi sẽ sớm hoàn hảo.",
  "I will record two 90-second responses next week and review their verb order.":
    "Tuần tới tôi sẽ ghi âm hai bài nói 90 giây và kiểm tra vị trí động từ.",
  "I will somehow learn more.": "Tôi sẽ học thêm bằng cách nào đó.",
});
const phraseGlosses = [
  ["tổ chức sinh hoạt hằng ngày", "tìm cách thích nghi; tìm đường"],
  ["tích lũy kinh nghiệm", "dám bắt đầu lại"],
  ["dựng lại trình tự", "nhận ra bước ngoặt"],
  ["chờ phản hồi", "thống nhất lịch với ai"],
  ["cân nhắc lập luận", "giải thích lý do quyết định"],
  ["nghiêm túc xem xét ý kiến phản đối", "tìm phương án dung hòa"],
  ["tạo mối quan hệ", "nhận trách nhiệm"],
  ["hỏi thông tin", "đã hiểu đúng điều gì"],
  ["tạo ấn tượng", "quan tâm đến nhau"],
  ["tham gia hoạt động", "hỗ trợ ai"],
  ["làm một dự án", "tường thuật sự kiện"],
  ["mong chờ điều gì", "đề cập, giải đáp một ý"],
  ["nhận biết tín hiệu", "tránh hiểu lầm"],
  ["tích lũy kinh nghiệm nghề nghiệp", "đáp ứng yêu cầu"],
  ["tiến hành thí nghiệm", "ghi chép kết quả"],
  ["xử lý đơn hàng", "khắc phục khiếm khuyết"],
  ["đưa ra quyết định", "chịu áp lực"],
  ["chuẩn bị cho cuộc trao đổi", "đặt câu hỏi làm rõ"],
  ["bảo tồn di sản văn hóa", "tiết kiệm tài nguyên"],
  ["nghỉ một lúc", "đánh giá đề xuất"],
  ["xem xét lại thói quen", "hướng sự chú ý"],
  ["kiểm chứng nhận định", "so sánh các nguồn"],
  ["mô tả lỗi, khiếm khuyết", "yêu cầu khắc phục"],
  ["đề xuất phương án khác", "làm rõ câu hỏi còn mở"],
  ["bày tỏ lập trường", "thừa nhận giới hạn"],
  ["chứng minh một kỹ năng", "đóng góp kinh nghiệm"],
  ["giới hạn một nhận định", "ghi chú có chọn lọc"],
  ["phát hiện manh mối", "nêu nghi ngờ"],
  ["đã bỏ lỡ cơ hội", "rút kinh nghiệm từ lỗi"],
  ["đánh giá tiến bộ", "đặt mục tiêu kiểm tra được"],
];
for (const [i, u] of bookUnits.entries())
  for (const [j, p] of u.phrases.entries())
    put(p.split(" · ")[1], phraseGlosses[i][j]);
import {
  aspekteModules,
  aspekteGuides,
  aspekteGrammar,
} from "../book-path/aspekte.ts";
const moduleTitles = [
  "Khởi đầu ở nơi ở mới",
  "Nhiều ngôn ngữ trong một đất nước",
  "Hiểu lầm văn hóa",
  "Hòa nhập ở Đức",
  "Ngôn ngữ cơ thể",
  "Học ngoại ngữ từ sớm",
  "Trò chuyện xã giao",
  "Bất đồng có tính xây dựng",
  "Tìm việc",
  "Hài lòng trong công việc",
  "Làm việc nhóm",
  "Chuẩn bị hồ sơ ứng tuyển",
  "Thể thao và hòa nhập xã hội",
  "Hiểu về nghèo đói",
  "Cuộc sống trực tuyến",
  "Quan hệ và mong đợi",
  "Khoa học cho trẻ em",
  "Sự thật và câu chuyện",
  "Hình dung thế giới khác",
  "Nghỉ ngơi trong ngày làm việc",
  "Mua sắm trực tuyến",
  "Hội thoại qua điện thoại",
  "Hòa hợp ở nơi làm việc",
  "Chuẩn bị cho kỳ thi",
  "Bảo vệ di sản văn hóa",
  "Câu chuyện bí ẩn văn hóa",
  "Ngôn ngữ có nguy cơ biến mất",
  "Giới thiệu tác phẩm văn hóa",
  "Trải nghiệm lịch sử",
  "Một ngày, nhiều nguồn",
  "Nhận định sai về lịch sử",
  "Vượt qua ranh giới",
  "Âm nhạc và đời sống",
  "Tác động của màu sắc",
  "Cảm xúc trong hội thoại",
  "Cảm xúc đan xen",
  "Robot trong xã hội",
  "Y tế tương lai",
  "Thế giới nghề nghiệp thay đổi",
  "Kịch bản tương lai và khiếu nại",
];
for (const [i, m] of aspekteModules.entries()) {
  put(m.title, moduleTitles[i]);
  const g = aspekteGuides.find((g) => g.id === m.id)!;
  put(g.label, `Chương ${m.chapter} · ${moduleTitles[i]}`);
  put(
    g.task,
    `Học trang in ${m.printedPage}–${m.printedPage + 1} (trang PDF ${m.pdfPage}–${m.pdfPage + 1}). Chọn một cấu trúc của mục này và tự viết ví dụ mới; bài liên kết trong ứng dụng là bài vận dụng tự biên soạn.`,
  );
}
for (const [id, page, focus] of aspekteGrammar) {
  const g = aspekteGuides.find((g) => g.id === `grammar-${id}`)!;
  put(
    g.task,
    `Đối chiếu quy tắc ở trang in ${page}, tương ứng trang PDF ${page + 1}, với bài của bạn. Câu hỏi ứng dụng là bài viết mới, không phải đáp án của nhà xuất bản.`,
  );
}
for (const u of bookUnits)
  for (const s of u.sources)
    if (s.purpose.startsWith("Optional B1 reinforcement:"))
      put(
        s.purpose,
        `Củng cố B1 tùy chọn: áp dụng chiến lược ${s.guideId === "teil4" ? "phân biệt người nói" : s.guideId === "reading" ? "đọc hiểu" : s.guideId === "writing" ? "viết" : s.guideId === "speaking" ? "nói" : "nghe"} vào đúng bản đề của bạn. Đây không phải câu hỏi tự biên soạn của ứng dụng.`,
      );
