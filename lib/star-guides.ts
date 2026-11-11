export interface StarGuide {
  overview: string;
  context: string;
  example: string;
  related: string[];
}

// Diễn giải để học cách đọc; không phải dữ liệu dự báo đã được kiểm chứng.
export const STAR_GUIDES: Record<string, StarGuide> = {
  'tu-vi': {
    overview: 'Trong ngôn ngữ cổ thư, Tử Vi thường được ví với đế tọa, nhấn mạnh tính tổ chức, vị trí trung tâm và trách nhiệm. Hình ảnh này giúp giải thích từ khóa “tôn quý”, nhưng không có nghĩa ai có sao Tử Vi cũng giàu có hoặc nắm quyền.',
    context: 'Các đoạn luận Tử Vi thường nhắc Tả Phù, Hữu Bật và sự hội chiếu của các sao bổ trợ. Vì vậy cần ghi nhận sao đồng cung, các cung liên hệ và chủ đề đang đọc trước khi dùng hình ảnh “lãnh đạo” để mô tả một lá số.',
    example: 'Nếu Tử Vi xuất hiện ở Quan Lộc, câu hỏi học cách đọc là vai trò tổ chức và trách nhiệm được diễn giải thế nào trong công việc. Nếu ở Phu Thê, chủ đề chuyển sang quan hệ đôi lứa. Hai vị trí không cho phép dùng chung một kết luận về chức vụ.',
    related: ['thien-phu', 'thien-tuong'],
  },
  'thien-co': {
    overview: 'Thiên Cơ được diễn giải bằng các hình ảnh mưu tính, linh hoạt và khả năng xoay xở. Các từ khóa này nói về một kiểu biểu tượng trong Tử Vi, không phải phép đo trí thông minh hoặc bằng chứng rằng một người hợp mọi nghề kỹ thuật.',
    context: 'Khi đọc Thiên Cơ, nên phân biệt sự linh hoạt với lời khẳng định luôn thay đổi. Cần xem sao nằm tại cung nào và những sao cùng tham gia. Trong bản trích yếu, Thiên Cơ còn được nhắc cùng Thái Âm, Thiên Đồng, Thiên Lương ở nhóm Cơ Nguyệt Đồng Lương.',
    example: 'Ở Quan Lộc, có thể dùng các từ khóa của Thiên Cơ để đặt câu hỏi về cách giải quyết vấn đề hoặc tổ chức công việc. Không từ đó suy ra người có lá số phải đổi nghề hay đi xa; các lựa chọn này cần căn cứ vào điều kiện thực tế.',
    related: ['thai-am', 'thien-luong', 'thien-dong'],
  },
  'thai-duong': {
    overview: 'Thái Dương dùng hình tượng mặt trời để diễn giải sự biểu lộ, tính chủ động và vai trò với tập thể. Đọc theo hình tượng này giúp hiểu cách cổ thư sử dụng các từ như sáng, hiển lộ hay danh tiếng.',
    context: 'Tài liệu truyền thống thường xét Thái Dương cùng vị trí miếu vượng hoặc hãm. Không nên bỏ phần trạng thái sao rồi dùng một mô tả chung cho mọi lá số. Các cách gán vai trò giới trong cổ thư cũng cần được hiểu trong bối cảnh lịch sử của tài liệu.',
    example: 'Nếu thấy Thái Dương ở cung công việc, trước hết xác định trạng thái sao và các yếu tố đi cùng. Một mô tả về hoạt động trước tập thể chỉ là cách diễn giải biểu tượng; nó không bảo đảm người đó sẽ có danh tiếng hoặc chức vụ.',
    related: ['thai-am', 'cu-mon'],
  },
  'vu-khuc': {
    overview: 'Vũ Khúc thường được gọi là tài tinh, gắn với hình ảnh quyết đoán, kỷ luật và quản lý nguồn lực. “Tài tinh” là tên gọi trong hệ thống, không phải cam kết về thu nhập hay khả năng đầu tư.',
    context: 'Đọc Vũ Khúc tại Tài Bạch là đọc chủ đề tiền bạc; tại Quan Lộc là đọc chủ đề công việc. Cần xem bố cục chung và các sao đi kèm, thay vì kết luận một người giàu hoặc nghèo chỉ từ sự có mặt của Vũ Khúc.',
    example: 'Khi tra Vũ Khúc ở Tài Bạch, bạn có thể ghi chú từ khóa quản lý nguồn lực rồi đối chiếu đoạn cổ thư có liên quan. Không dùng nhận định này để chọn khoản đầu tư, vay tiền hoặc ước lượng tài sản tương lai.',
    related: ['thien-phu', 'that-sat'],
  },
  'thien-dong': {
    overview: 'Thiên Đồng thường được gọi là phúc tinh, với những từ khóa ôn hòa, hưởng thụ và thích nghi. Đó là ngôn ngữ mô tả xu hướng biểu tượng, không phải lời bảo đảm rằng cuộc sống của một người luôn nhẹ nhàng.',
    context: 'Khi đọc sao này, cần tách hình ảnh “hưởng phúc” khỏi các kết luận về hoàn cảnh sống thật. Thiên Đồng cũng xuất hiện trong cách gọi Cơ Nguyệt Đồng Lương; phải kiểm tra toàn bộ các sao và cung liên quan trước khi gán tên cách cục.',
    example: 'Nếu gặp Thiên Đồng ở Quan Lộc, hãy đọc đoạn mô tả như một gợi ý tìm hiểu cách cổ thư nhìn môi trường làm việc. Không suy ra người đó không thể làm việc áp lực hoặc chỉ phù hợp với một nhóm nghề cố định.',
    related: ['thien-co', 'thai-am', 'thien-luong'],
  },
  'liem-trinh': {
    overview: 'Liêm Trinh có nhiều lớp hình tượng, từ kỷ luật và ranh giới đến tài nghệ và quan hệ xã hội. Vì vậy chỉ lấy một nhãn “đào hoa” để giải nghĩa toàn bộ sao này sẽ bỏ mất phần lớn bối cảnh.',
    context: 'Bản trích yếu nhắc đến Liêm Trinh cùng Thiên Tướng và các quan hệ tứ hóa. Cần ghi rõ tổ hợp sao thực tế trên lá số. Không biến các từ cổ mang sắc thái phán xét thành kết luận đạo đức về người có sao Liêm Trinh.',
    example: 'Tại Quan Lộc, bạn có thể tìm các đoạn nói về kỷ luật, vai trò hoặc tổ chức. Tại Phu Thê, cần đọc trong chủ đề quan hệ. Chỉ tên sao không đủ căn cứ để khẳng định một người có vấn đề tình cảm hoặc pháp lý.',
    related: ['thien-tuong', 'tham-lang'],
  },
  'thien-phu': {
    overview: 'Thiên Phủ được ví như kho, gắn với sự gìn giữ, ổn định và quản lý. Hình tượng tài khố giải thích cách cổ thư nói về nguồn lực, nhưng không chứng minh một người sở hữu nhà đất hay của cải.',
    context: 'Khi đối chiếu Thiên Phủ và Tử Vi, tài liệu sử dụng hai hình ảnh khác nhau: kho và vị trí trung tâm. Nếu gặp tổ hợp Tử Phủ, cần kiểm tra sao có thực sự đồng cung hoặc hội chiếu theo đoạn tài liệu đang đọc hay không.',
    example: 'Ở Điền Trạch, hình tượng giữ gìn được đọc trong chủ đề nơi ở và tài sản theo truyền thống. Không từ đó xác định số căn nhà hoặc khả năng mua đất. Hãy ghi nhận đây là phép diễn giải biểu tượng.',
    related: ['tu-vi', 'vu-khuc'],
  },
  'thai-am': {
    overview: 'Thái Âm sử dụng hình tượng mặt trăng, thường gắn với sự tích lũy, đời sống bên trong và tính chăm chút. Những mô tả này là cách đọc truyền thống, không phải phép đo tính cách đã được xác nhận.',
    context: 'Đọc Thái Âm cần lưu ý vị trí và trạng thái sao mà tài liệu đang nói tới. Những câu luận dựa trên vai trò nam nữ trong cổ thư có bối cảnh lịch sử riêng; không nên áp chúng thành yêu cầu về tính cách của người đọc hiện nay.',
    example: 'Nếu Thái Âm ở Điền Trạch, có thể tìm hiểu vì sao bản trích yếu liên hệ sao này với nơi ở và sự tích lũy. Sự liên hệ đó không đủ để dự báo giá bất động sản hoặc kết luận người có lá số sẽ nhận thừa kế.',
    related: ['thai-duong', 'thien-co', 'thien-dong'],
  },
  'tham-lang': {
    overview: 'Tham Lang thường được diễn giải qua giao tiếp, sở thích, ham muốn và sự đa dạng trong trải nghiệm. Từ “đào hoa” trong tài liệu không nên được dùng như nhãn phán xét chuyện tình cảm của một cá nhân.',
    context: 'Tham Lang xuất hiện trong nhóm Sát Phá Tham và các tên gọi Hỏa Tham, Linh Tham. Một tên cách cục đòi hỏi điều kiện kết hợp cụ thể; thấy riêng Tham Lang chưa đủ để khẳng định cả tổ hợp có mặt.',
    example: 'Nếu đọc thấy từ “phát” trong đoạn nói về Hỏa Tham, hãy kiểm tra đầy đủ các điều kiện mà đoạn đó nêu. Đây không phải tín hiệu mua tài sản, đặt cược hoặc chấp nhận rủi ro tiền bạc.',
    related: ['that-sat', 'pha-quan', 'liem-trinh'],
  },
  'cu-mon': {
    overview: 'Cự Môn gắn với lời nói, sự phân tích và tranh luận trong ngôn ngữ cổ thư. Cùng một hình tượng có thể được diễn giải thành khả năng trình bày hoặc bất đồng, tùy ngữ cảnh.',
    context: 'Khi tài liệu nhắc “khẩu thiệt”, cần hiểu đây là thuật ngữ biểu tượng, không phải xác nhận rằng một người sẽ kiện tụng hoặc không đáng tin. Vị trí cung, tứ hóa và các sao liên quan đều là phần của cách đọc truyền thống.',
    example: 'Ở Quan Lộc, Cự Môn có thể được dùng để bàn về vai trò của giao tiếp trong công việc. Bạn vẫn cần căn cứ vào kỹ năng và kinh nghiệm để chọn nghề; tên sao không quyết định ai sẽ là luật sư, giáo viên hay người làm truyền thông.',
    related: ['thai-duong', 'thien-co'],
  },
  'thien-tuong': {
    overview: 'Thiên Tướng thường được mô tả bằng hình tượng phò tá, điều phối và gìn giữ trật tự. Cách gọi “ấn” nói tới biểu tượng vai trò, không đồng nghĩa người có sao này chắc chắn giữ quyền hành.',
    context: 'Tài liệu hay nhắc Thiên Tướng cùng Tử Vi hoặc Liêm Trinh. Đọc phần quan hệ giữa các sao giúp tránh hiểu “phò tá” thành tính cách luôn phụ thuộc, bởi ý nghĩa còn tùy lĩnh vực của cung và toàn bộ bố cục.',
    example: 'Nếu Thiên Tướng nằm ở Quan Lộc, hãy đặt câu hỏi tài liệu đang diễn giải vai trò hỗ trợ hay điều phối thế nào. Không lấy mô tả này làm giới hạn rằng người đó không thể làm chủ hoặc tự quyết định công việc.',
    related: ['tu-vi', 'liem-trinh', 'thien-phu'],
  },
  'thien-luong': {
    overview: 'Thiên Lương gắn với hình tượng che chở, kinh nghiệm và nguyên tắc trong cách đọc truyền thống. Các từ như “ấm” hay “giải” mô tả vai trò biểu tượng, không bảo đảm tránh được rủi ro ngoài đời.',
    context: 'Thiên Lương có mặt trong nhóm Cơ Nguyệt Đồng Lương và thường được diễn giải cùng các sao khác. Không nên từ một sao mà đánh giá phẩm chất đạo đức, tuổi thọ hoặc năng lực chữa bệnh của một cá nhân.',
    example: 'Tại cung công việc, tài liệu có thể liên hệ Thiên Lương với các hoạt động hướng dẫn hoặc bảo trợ. Đó không phải chứng chỉ hành nghề hay bằng chứng người có lá số phù hợp với mọi công việc giáo dục hoặc y tế.',
    related: ['thien-co', 'thien-dong', 'thai-am'],
  },
  'that-sat': {
    overview: 'Thất Sát được ví với tướng tinh, nhấn mạnh quyết đoán, sức chịu áp lực và việc đối diện thay đổi. Chữ “sát” trong tên gọi không phải bằng chứng về bạo lực, tai nạn hoặc tính nguy hiểm của một người.',
    context: 'Các đoạn luận có thể xét Thất Sát cùng Tử Vi, Thiên Phủ hoặc nhóm Sát Phá Tham. Hãy đọc điều kiện tổ hợp và cung được nói tới trước. Không đánh đồng mọi lá số có Thất Sát với cùng một đường nghề nghiệp.',
    example: 'Nếu Thất Sát ở Quan Lộc, bạn có thể đối chiếu hình tượng trách nhiệm và sức ép trong đoạn tham khảo. Không từ đó kết luận người ấy phải theo quân đội, đổi nghề hoặc chắc chắn trải qua một biến cố.',
    related: ['pha-quan', 'tham-lang', 'tu-vi'],
  },
  'pha-quan': {
    overview: 'Phá Quân thường dùng hình tượng phá bỏ cấu trúc cũ, đổi mới và tiêu hao nguồn lực trong quá trình thay đổi. Tên sao không có nghĩa người có lá số sẽ phá sản hay làm đổ vỡ các mối quan hệ.',
    context: 'Khi đọc Phá Quân trong nhóm Sát Phá Tham hoặc cùng Tử Vi, cần xác nhận các điều kiện trên lá số. Các từ “hao” và “biến động” cần được giữ trong bối cảnh của tài liệu, không tự chuyển thành dự báo mất tiền.',
    example: 'Ở Quan Lộc, hình tượng thay đổi có thể được dùng để tìm hiểu cách cổ thư nói về tái tổ chức công việc. Nó không phải lời khuyên nghỉ việc hoặc khởi nghiệp; quyết định thực tế cần kế hoạch và thông tin có thể kiểm chứng.',
    related: ['that-sat', 'tham-lang', 'tu-vi'],
  },
};
