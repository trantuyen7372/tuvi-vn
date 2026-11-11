export interface GuideSection {
  id: string;
  title: string;
  paragraphs: string[];
  items?: {name: string; text: string}[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: GuideSection[];
  related: string[];
  sources: {name: string; href: string}[];
}

const basics = {name: 'Cốt Tuỷ Phú — nguyên lý đọc Mệnh, Thân và vận hạn (bản trích yếu)', href: '/co-thu/cot-tuy-phu#gsf-1-3'};
const inputSource = {name: 'Phương pháp và quy ước nhập dữ liệu trên website', href: '/phuong-phap'};

export const GUIDES: Guide[] = [
  {
    slug: 'cach-doc-la-so-tu-vi',
    title: 'Cách đọc lá số Tử Vi cho người mới: bắt đầu từ đâu?',
    description: 'Hướng dẫn đọc lá số theo từng bước: kiểm tra ngày giờ sinh, xác định Mệnh và Thân, xem các cung, chính tinh, đại hạn và lưu niên.',
    intro: 'Một lá số có nhiều tên sao và ký hiệu, nhưng bạn không cần đọc tất cả cùng lúc. Hãy bắt đầu từ dữ liệu sinh, sau đó đọc từng lớp thông tin. Bài này giúp bạn sử dụng lá số trên website và hiểu cách diễn giải truyền thống.',
    sections: [
      {id: 'kiem-tra-du-lieu', title: '1. Kiểm tra ngày, loại lịch và giờ sinh', paragraphs: [
        'Trước khi đọc bất kỳ cung nào, đối chiếu ngày sinh, lựa chọn âm hoặc dương lịch, tháng nhuận và canh giờ. Ngày dương lịch đã có trên giấy tờ có thể nhập trực tiếp với lựa chọn Dương lịch; không cần tự đổi sang âm lịch rồi nhập lại dưới nhãn Dương lịch.',
        'Năm xem hạn là năm muốn tham khảo, khác với năm sinh. Sau khi lập lá số, kiểm tra phần ngày âm/dương và khoảng giờ hiển thị. Nếu dữ liệu chưa chắc chắn, ghi lại điều đó trước khi đọc các đoạn mô tả; đừng chọn giờ chỉ vì kết quả nghe hợp với mình.',
      ]},
      {id: 'menh-va-than', title: '2. Tìm cung Mệnh và vị trí cung Thân', paragraphs: [
        'Trong cách đọc truyền thống, Mệnh là điểm khởi đầu để tìm hiểu các chủ đề về bản thân. Thân được đánh dấu tại một trong các cung, bổ sung một hướng diễn giải. Không nên đồng nhất tên sao tại Mệnh với một nhãn tính cách cố định áp dụng cho mọi người.',
        'Trên bảng lá số, chọn cung Mệnh rồi ghi lại chính tinh, phụ tinh và các ký hiệu đi kèm. Tiếp theo tìm dấu Thân. Một cung không có chính tinh vẫn có thể có phụ tinh và các quan hệ hội chiếu; đây không phải lỗi thiếu dữ liệu.',
      ]},
      {id: 'doc-theo-chu-de', title: '3. Đọc các cung theo câu hỏi bạn quan tâm', paragraphs: [
        'Nếu muốn tìm hiểu cách cổ thư diễn giải công việc, bắt đầu ở Quan Lộc rồi đối chiếu Mệnh, Tài Bạch và Thiên Di. Với quan hệ đôi lứa, đọc Phu Thê trong bối cảnh toàn lá số. Cùng một sao nhưng xuất hiện ở các cung khác nhau sẽ mang chủ đề diễn giải khác nhau.',
        'Ví dụ học cách đọc: thấy Tử Vi tại Quan Lộc, trước hết ghi nhận biểu tượng tổ chức và trách nhiệm trong lĩnh vực công việc. Sau đó kiểm tra các sao cùng cung và hội chiếu. Chưa đủ căn cứ để kết luận người đó chắc chắn giữ chức vụ cao.',
      ]},
      {id: 'tach-van-han', title: '4. Tách lá số gốc, đại hạn và lưu niên', paragraphs: [
        'Lá số gốc là lớp bố cục tính từ dữ liệu sinh. Đại hạn là lớp giai đoạn dài, còn lưu niên là lớp năm đang chọn. Khi đổi năm xem hạn, hãy so sánh phần vận năm trước, thay vì cho rằng toàn bộ đặc điểm của lá số gốc đã đổi.',
        'Kết thúc mỗi lần đọc, bạn có thể ghi ba cột: dữ liệu nhìn thấy trên lá số, cách tài liệu giải thích, và điều còn chưa rõ. Cách ghi này giúp phân biệt thông tin hiển thị với suy luận. Tử Vi là nội dung tham khảo, không phải phương pháp bảo đảm dự báo sự kiện.',
      ]},
    ],
    related: ['y-nghia-12-cung', 'chinh-tinh-va-phu-tinh', 'dai-han-va-luu-nien'],
    sources: [basics, {name: 'Bài luận minh họa trên website', href: '/bai-luan-mau'}],
  },
  {
    slug: 'y-nghia-12-cung',
    title: 'Ý nghĩa 12 cung trong lá số Tử Vi và cách tra cứu',
    description: 'Tra cứu ý nghĩa 12 cung Tử Vi: Mệnh, Phụ Mẫu, Phúc Đức, Điền Trạch, Quan Lộc, Nô Bộc, Thiên Di, Tật Ách, Tài Bạch, Tử Nữ, Phu Thê, Huynh Đệ.',
    intro: 'Mười hai cung là mười hai nhóm chủ đề dùng để tổ chức việc đọc lá số theo truyền thống. Tên cung cho biết bạn đang xem lĩnh vực nào; sao nằm trong cung là một lớp thông tin khác. Không thể chỉ nhìn tên cung để kết luận tốt hoặc xấu.',
    sections: [
      {id: 'muoi-hai-cung', title: '12 cung thường được hiểu như thế nào?', paragraphs: ['Bảng dưới đây giải thích phạm vi biểu tượng, không mô tả những sự kiện chắc chắn sẽ xảy ra trong đời một người.'], items: [
        {name: 'Mệnh', text: 'Điểm bắt đầu khi đọc về bản thân, cách biểu hiện và những chủ đề tổng quát của lá số.'},
        {name: 'Phụ Mẫu', text: 'Chủ đề về cha mẹ, bề trên và mối quan hệ với người nâng đỡ trong cách luận truyền thống.'},
        {name: 'Phúc Đức', text: 'Chủ đề về đời sống tinh thần, gia đình và cảm nhận an ổn; không phải thước đo đạo đức.'},
        {name: 'Điền Trạch', text: 'Biểu tượng về chỗ ở, nhà đất và môi trường sinh hoạt; không xác định giá trị tài sản thực tế.'},
        {name: 'Quan Lộc', text: 'Công việc, vai trò và cách tham gia hoạt động nghề nghiệp; không ấn định một nghề duy nhất.'},
        {name: 'Nô Bộc', text: 'Tên gọi cổ của nhóm chủ đề về bạn bè, đồng nghiệp, cộng sự và quan hệ hợp tác.'},
        {name: 'Thiên Di', text: 'Môi trường bên ngoài và cách tương tác khi ra ngoài phạm vi quen thuộc.'},
        {name: 'Tật Ách', text: 'Nhóm biểu tượng sức khỏe trong cổ thư. Không dùng cung này để xác định bệnh, tuổi thọ hoặc lựa chọn điều trị.'},
        {name: 'Tài Bạch', text: 'Chủ đề về nguồn lực và tiền bạc trong hệ thống biểu tượng; không dự báo lợi nhuận đầu tư.'},
        {name: 'Tử Nữ', text: 'Chủ đề về con cái và quan hệ giữa các thế hệ; không xác định khả năng sinh sản hay số con thực tế.'},
        {name: 'Phu Thê', text: 'Chủ đề về quan hệ đôi lứa. Không thể từ một sao mà khẳng định kết hôn, chia tay hoặc tính cách bạn đời.'},
        {name: 'Huynh Đệ', text: 'Chủ đề về anh chị em và sự tương trợ; cần đối chiếu với hoàn cảnh gia đình thực tế.'},
      ]},
      {id: 'cung-va-dia-chi', title: 'Phân biệt tên cung với địa chi', paragraphs: [
        'Mệnh, Quan Lộc hay Tài Bạch là tên cung chức năng; Tý, Sửu, Dần, Mão… là địa chi gắn với vị trí trên bảng. Vì vậy “Mệnh tại Tý” gồm hai thông tin khác nhau: cung đang đọc là Mệnh và vị trí của cung đó là Tý.',
        'Khi so sánh hai lá số, hãy tìm theo tên cung trước. Không lấy ô ở cùng một góc màn hình làm căn cứ rằng đó là cùng một lĩnh vực. Trên website, chọn cung theo tên để mở phần thông tin tương ứng.',
      ]},
      {id: 'lien-he-cac-cung', title: 'Vì sao cần đọc các cung cùng nhau?', paragraphs: [
        'Cổ thư thường đặt Mệnh trong quan hệ với Tài Bạch, Quan Lộc và Thiên Di khi nói về tam phương tứ chính. Đó là cách đặt một nhận định vào nhiều lớp bối cảnh, thay vì dựa vào một chữ “tốt” hoặc “xấu” của một sao.',
        'Ví dụ, một đoạn mô tả Quan Lộc chỉ là phần về công việc trong hệ thống này. Nó không đủ để quyết định nghỉ việc hoặc chọn ngành học. Dùng trải nghiệm, năng lực và điều kiện thực tế để đánh giá các lựa chọn của bạn.',
      ]},
    ],
    related: ['cach-doc-la-so-tu-vi', 'chinh-tinh-va-phu-tinh'],
    sources: [{name: 'Cốt Tuỷ Phú — luận mười hai cung (bản trích yếu)', href: '/co-thu/cot-tuy-phu#gsf-9-1'}, basics],
  },
  {
    slug: 'nhap-ngay-am-hay-duong',
    title: 'Lập lá số Tử Vi nhập ngày âm hay dương lịch?',
    description: 'Cách chọn âm lịch hoặc dương lịch khi lập lá số, đánh dấu tháng nhuận, đối chiếu ngày sau chuyển đổi và tránh nhập nhầm ngày sinh.',
    intro: 'Website cho phép nhập cả âm lịch và dương lịch. Hãy chọn loại lịch đúng với ngày sinh bạn đang có. Bạn không cần tự chuyển ngày nếu đã biết chắc ngày đó thuộc lịch nào.',
    sections: [
      {id: 'chon-loai-lich', title: 'Có ngày dương lịch: nhập trực tiếp', paragraphs: [
        'Chọn Dương lịch ở mục Lịch, sau đó điền ngày, tháng và năm tương ứng. Nếu bạn đang dùng ngày trên giấy tờ, hãy kiểm tra đó là ngày sinh thực tế hay ngày đăng ký được gia đình sử dụng. Website không thể tự xác minh sự khác biệt này.',
        'Ví dụ thao tác: bạn có ngày 15/08/1995 dương lịch thì chọn Dương lịch và nhập ngày 15, tháng 8, năm 1995. Không tự đổi sang ngày âm rồi giữ nguyên lựa chọn Dương lịch, vì như vậy hệ thống sẽ hiểu thành một ngày sinh khác.',
      ]},
      {id: 'ngay-am-va-thang-nhuan', title: 'Có ngày âm lịch: kiểm tra thêm tháng nhuận', paragraphs: [
        'Chọn Âm lịch khi ngày gia đình cung cấp là ngày âm. Nếu năm đó có tháng nhuận, cần xác nhận bạn sinh trong tháng thường hay tháng nhuận cùng số. Chỉ đánh dấu Tháng nhuận khi nguồn thông tin của bạn xác nhận điều đó.',
        'Tháng nhuận âm lịch khác với năm nhuận dương lịch có ngày 29/02. Một người sinh vào năm dương lịch nhuận không vì thế mà đánh dấu Tháng nhuận trong biểu mẫu âm lịch. Nếu thiếu thông tin, hỏi lại gia đình trước khi diễn giải kết quả.',
      ]},
      {id: 'doi-chieu-ket-qua', title: 'Kiểm tra ngày hiển thị sau khi lập lá số', paragraphs: [
        'Sau khi nhấn Lập lá số, đối chiếu ngày dương, ngày âm và khoảng giờ được hiển thị. Nếu có hai cách ghi của cùng ngày sinh, thử lần lượt dưới đúng loại lịch và kiểm tra các thông tin này có nhất quán hay không.',
        'Nếu hai kết quả khác nhau, kiểm tra lại loại lịch, tháng nhuận, năm và giờ trước. Đừng chọn lá số chỉ vì có nhiều lời giải thích dễ chịu hơn. Những trường hợp sinh sát nửa đêm hoặc có thông tin giờ ở nước ngoài cần thận trọng với quy ước thời gian; biểu mẫu hiện không có trường nơi sinh hoặc múi giờ.',
      ]},
      {id: 'du-lieu-con-thieu', title: 'Chọn đúng lịch chưa thay thế được giờ sinh', paragraphs: [
        'Ngày âm và ngày dương chỉ là hai cách ghi ngày. Bạn vẫn cần giờ sinh và các trường còn lại để tạo đúng đầu vào. Năm xem hạn là năm muốn xem, không phải phần thay thế cho năm sinh.',
        'Nếu chưa xác nhận được ngày hoặc giờ, bạn vẫn có thể đọc các bài kiến thức chung. Mọi kết quả lập bằng dữ liệu giả định chỉ nên được hiểu là ví dụ của giả định đó.',
      ]},
    ],
    related: ['khong-biet-gio-sinh', 'cach-doc-la-so-tu-vi'],
    sources: [inputSource],
  },
  {
    slug: 'khong-biet-gio-sinh',
    title: 'Không biết giờ sinh có lập lá số Tử Vi được không?',
    description: 'Cần làm gì khi chưa biết giờ sinh, sinh gần ranh giới canh giờ hoặc chỉ nhớ khoảng giờ? Hiểu giới hạn trước khi lập và đọc lá số.',
    intro: 'Bạn có thể tạo một lá số với giờ giả định, nhưng kết quả chỉ ứng với giờ đã chọn. Website hiện yêu cầu chọn canh giờ và không có chức năng tự tìm lại giờ sinh.',
    sections: [
      {id: 'vi-sao-can-gio', title: 'Vì sao giờ sinh là dữ liệu cần xác nhận?', paragraphs: [
        'Giờ sinh tham gia vào cách lập bố cục lá số của thư viện mà website sử dụng. Khi đổi canh giờ, vị trí Mệnh, Thân hoặc các sao có thể thay đổi. Vì vậy một đoạn luận được tính từ giờ chưa rõ không có cùng ý nghĩa với kết quả từ dữ liệu đã xác nhận.',
        'Biểu mẫu có một lựa chọn giờ mặc định để thao tác thuận tiện. Lựa chọn đang hiện trong ô không phải giờ hệ thống đã biết về bạn. Hãy chủ động chọn lại đúng khoảng giờ trước khi nhấn Lập lá số.',
      ]},
      {id: 'tim-lai-thong-tin', title: 'Nên kiểm tra thông tin ở đâu?', paragraphs: [
        'Hỏi người thân có mặt lúc sinh, đối chiếu giấy tờ hoặc hồ sơ sinh nếu gia đình còn lưu. Ghi lại nguồn và mức độ chắc chắn: “hồ sơ ghi 10:20” khác với “gia đình nhớ khoảng gần trưa”. Website không truy cập các nguồn này thay bạn.',
        'Nếu người thân nhớ các khoảng khác nhau, giữ nguyên sự không chắc chắn đó. Việc một mô tả tính cách nghe quen thuộc không phải bằng chứng xác nhận thời điểm sinh, vì nhiều mô tả có thể phù hợp với nhiều người.',
      ]},
      {id: 'ranh-gio', title: 'Nếu sinh gần ranh giới canh giờ', paragraphs: [
        'Hãy đọc khoảng thời gian ghi ngay trong danh sách Giờ sinh. Trên website, 10:20 nằm trong Tỵ (9h–11h), còn 11:20 nằm trong Ngọ (11h–13h). Nếu chỉ nhớ “khoảng 11 giờ”, bạn chưa có đủ thông tin để phân biệt hai trường hợp.',
        'Giờ Tý được tách thành 0h–1h và 23h–24h trong biểu mẫu theo đầu vào thư viện. Khi sinh gần nửa đêm, cần kiểm tra cả ngày ghi nhận và khoảng giờ. Với giờ sinh ở nước ngoài, website hiện không tự điều chỉnh theo nơi sinh hoặc giờ mùa hè.',
      ]},
      {id: 'so-sanh-gia-dinh', title: 'Có nên thử nhiều giờ để tìm lá số “đúng” không?', paragraphs: [
        'Bạn có thể so sánh các lá số như bài tập tìm hiểu cách đầu vào làm thay đổi bố cục. Hãy đặt tên ghi chú theo từng giả định và giữ nguyên các trường còn lại. So sánh này cho biết hệ thống trả gì, không xác định được giờ sinh thực tế.',
        'Khi chưa chắc giờ, nên đọc kiến thức và bài luận mẫu trước. Không cần mua nhiều lượt để thử đoán giờ; việc có nhiều bài luận không bổ sung được bằng chứng về thời điểm bạn sinh.',
      ]},
    ],
    related: ['nhap-ngay-am-hay-duong', 'cach-doc-la-so-tu-vi'],
    sources: [inputSource],
  },
  {
    slug: 'dai-han-va-luu-nien',
    title: 'Đại hạn và lưu niên là gì? Cách xem trên lá số',
    description: 'Phân biệt lá số gốc, đại hạn 10 năm và lưu niên theo năm xem hạn; cách đọc khoảng tuổi và giới hạn của thông tin vận năm trên website.',
    intro: 'Đại hạn và lưu niên là hai lớp thời gian trong cách luận Tử Vi truyền thống. Hiểu chúng là những khung tham khảo giúp bạn tránh nhầm một đoạn nói về giai đoạn dài với kết luận cho một năm cụ thể.',
    sections: [
      {id: 'ba-lop', title: 'Lá số gốc, đại hạn và lưu niên khác nhau ra sao?', paragraphs: [
        'Lá số gốc được lập từ dữ liệu sinh và là nền để đọc các cung, sao. Đại hạn thường chia thành các khoảng 10 năm. Lưu niên là phần thông tin gắn với năm bạn chọn ở trường Năm xem hạn.',
        'Cùng một ngày giờ sinh, đổi năm xem hạn sẽ làm thay đổi lớp vận năm và có thể chuyển sang đại hạn khác. Điều này không có nghĩa ngày sinh hoặc bố cục gốc đã bị thay thế. Khi đối chiếu, giữ nguyên dữ liệu sinh để chỉ so sánh tác động của năm đang chọn.',
      ]},
      {id: 'khoang-tuoi', title: 'Đọc khoảng tuổi trước khi đọc ý nghĩa', paragraphs: [
        'Trên lá số, xem khoảng tuổi ghi cho từng đại hạn và phần đánh dấu giai đoạn đang xét. Website dùng tuổi danh nghĩa do thư viện lập lá số trả về; không nên tự thay bằng tuổi tính theo ngày sinh mà không kiểm tra quy ước.',
        'Ở tuổi nhỏ, có thể chưa nằm trong một khoảng đại hạn 10 năm được đánh dấu. Không vì thế mà coi đây là lỗi hoặc tự gán một khoảng bất kỳ. Hãy đọc thông tin hiện có và giữ lại phần chưa áp dụng.',
      ]},
      {id: 'quy-uoc-nam', title: 'Năm xem hạn trên website được tính thế nào?', paragraphs: [
        'Nhập năm dương lịch muốn tham khảo tại trường Năm xem hạn. Hệ thống hiện dùng mốc ngày 01/07 của năm đó để lấy lớp lưu niên từ thư viện, nhằm lấy một mốc sau Tết cho phần tổng quan năm.',
        'Đây là quy ước cho tính năng tổng quan, không phải lựa chọn một ngày xảy ra sự kiện. Website không cung cấp dự báo chính xác từng ngày từ trường nhập này. Khi đọc về thời điểm đầu năm hoặc so sánh với trường phái khác, cần ghi nhận quy ước đang dùng.',
      ]},
      {id: 'doc-co-boi-canh', title: 'Đặt nhận định vận hạn vào bối cảnh', paragraphs: [
        'Ví dụ thao tác: lập hai kết quả với cùng dữ liệu sinh, lần lượt chọn năm 2026 và 2027. Ghi lại cung lưu niên và đại hạn hiển thị, rồi xem đoạn luận đang dẫn từ lớp nào. Đây là ví dụ so sánh cách đọc, không phải lời dự báo cho người sinh vào một năm cụ thể.',
        'Các nhãn cát, hung hoặc biến động thuộc ngôn ngữ của hệ thống truyền thống. Chúng không xác định một tai nạn, khoản lãi hoặc biến cố hôn nhân. Kế hoạch thực tế vẫn cần dựa trên thông tin và điều kiện bạn có thể kiểm chứng.',
      ]},
    ],
    related: ['cach-doc-la-so-tu-vi', 'y-nghia-12-cung'],
    sources: [basics, inputSource],
  },
  {
    slug: 'chinh-tinh-va-phu-tinh',
    title: 'Chính tinh, phụ tinh và cung vô chính diệu là gì?',
    description: 'Phân biệt 14 chính tinh với phụ tinh, hiểu cung vô chính diệu, các ký hiệu miếu vượng và tứ hóa để tránh đọc lá số từ một sao đơn lẻ.',
    intro: 'Tên sao trên lá số là những ký hiệu của hệ thống Tử Vi, không phải mô tả thiên văn trực tiếp về các ngôi sao đang ở trên trời. Bài này giúp bạn phân biệt các nhóm thông tin trước khi tra nghĩa từng sao.',
    sections: [
      {id: 'chinh-tinh', title: '14 chính tinh là lớp thông tin nào?', paragraphs: [
        'Nhóm 14 chính tinh gồm Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc, Thiên Đồng, Liêm Trinh, Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương, Thất Sát và Phá Quân. Bạn có thể tra từng tên trong mục 14 chính tinh của website.',
        'Khi đọc một cung, ghi nhận chính tinh đang hiện và chủ đề của cung đó trước. Cùng là Thiên Cơ, đoạn giải nghĩa ở Quan Lộc không thể được chép nguyên thành kết luận về Phu Thê. Tên sao cung cấp biểu tượng; cung và các quan hệ khác cung cấp bối cảnh.',
      ]},
      {id: 'phu-tinh', title: 'Phụ tinh bổ sung điều gì?', paragraphs: [
        'Các tên như Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi và Thiên Việt thường được nhắc đến như những yếu tố bổ trợ trong cổ thư. Những nhóm khác như Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không và Địa Kiếp được diễn giải bằng ngôn ngữ thử thách hoặc trở ngại.',
        'Website hiển thị các nhóm chính tinh, phụ tinh và tạp tinh theo dữ liệu thư viện. Cách phân nhóm có thể khác cách gọi của tài liệu khác. Không nên đếm số tên được gọi là “tốt” rồi trừ số tên “xấu” để chấm điểm một con người.',
      ]},
      {id: 'vo-chinh-dieu', title: 'Cung vô chính diệu không phải cung trống hoàn toàn', paragraphs: [
        'Vô chính diệu là cách gọi một cung không có chính tinh tọa thủ. Cung đó vẫn có thể có phụ tinh, tạp tinh và các quan hệ với cung khác. Nếu phần chính tinh để trống nhưng các thông tin còn lại vẫn hiện, đó không nhất thiết là lỗi lập lá số.',
        'Bản trích yếu cổ thư trên website giới thiệu cách tham khảo cung đối khi gặp vô chính diệu. Đây là nguyên tắc đọc truyền thống cần đặt trong toàn bộ bố cục, không phải lấy một sao ở cung khác rồi khẳng định nó tương đương hoàn toàn với sao tọa thủ.',
      ]},
      {id: 'ky-hieu', title: 'Miếu vượng và tứ hóa nên được đọc cùng bối cảnh', paragraphs: [
        'Miếu, vượng, đắc, hãm là các nhãn trạng thái sao theo quy tắc thư viện sử dụng. Lộc, Quyền, Khoa, Kỵ là các tên tứ hóa có thể đi kèm sao. Khi ghi chú, hãy giữ cả tên sao và nhãn đang hiển thị để tránh trộn hai tình huống khác nhau.',
        'Ví dụ: chỉ nhìn chữ Kỵ mà bỏ qua tên sao, cung và lớp thời gian sẽ làm mất bối cảnh. Những ký hiệu này không xác nhận bệnh tật, mất tiền hay một sự kiện chắc chắn. Hãy đọc phần giải thích như tài liệu tìm hiểu hệ thống biểu tượng.',
      ]},
    ],
    related: ['y-nghia-12-cung', 'cach-doc-la-so-tu-vi', 'dai-han-va-luu-nien'],
    sources: [{name: 'Tra cứu 14 chính tinh', href: '/sao'}, {name: 'Cốt Tuỷ Phú — cung vô chính diệu (bản trích yếu)', href: '/co-thu/cot-tuy-phu#gsf-9-4'}, inputSource],
  },
];

export function findGuide(slug: string) {
  return GUIDES.find(guide => guide.slug === slug);
}
