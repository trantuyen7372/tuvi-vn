/**
 * Giải nghĩa 14 chính tinh.
 * Việt hoá và biên tập lại từ dữ liệu sao trong dự án ziwei-doushu (MIT),
 * đã bỏ phần trích giảng của Nghê Hải Hạ (giấy phép phi thương mại).
 */
export interface StarInfo {
  name: string;
  slug: string;
  element: string;
  nature: string;
  keywords: string[];
  coQuyet: string;
  bestPalace: string;
  worstPalace: string;
  career: string;
  love: string;
  wealth: string;
  health: string;
}

export const STARS: StarInfo[] = [
  {
    name: 'Tử Vi', slug: 'tu-vi', element: 'Thổ', nature: 'Trung tính thiên cát',
    keywords: ['Đế vương', 'Tôn quý', 'Độc lập'],
    coQuyet: 'Tử Vi là đế tọa, thủ Mệnh thì tôn quý, thống lĩnh các sao, chủ uy quyền hiển đạt.',
    bestPalace: 'Mệnh (Thìn, Tuất), Quan Lộc',
    worstPalace: 'Tật Ách, Phu Thê',
    career: 'Chính quyền, quản lý cấp cao, tự khởi nghiệp. Khí chất lãnh đạo, hợp vị trí tự mình gánh vác.',
    love: 'Trong tình cảm hơi bị động, tự trọng cao, cần đối phương chủ động. Có xu hướng cô độc, lập gia đình muộn thì tốt.',
    wealth: 'Tài vận ổn định, giữ của giỏi hơn mở rộng. Hợp đầu tư tích luỹ dài hạn.',
    health: 'Hành Thổ, chú ý tỳ vị, tiêu hoá. Tránh làm việc quá sức, nên sinh hoạt điều độ.',
  },
  {
    name: 'Thiên Cơ', slug: 'thien-co', element: 'Mộc', nature: 'Cát tinh',
    keywords: ['Trí tuệ', 'Linh hoạt', 'Mưu lược'],
    coQuyet: 'Người tinh khôn, thích kinh doanh tính toán; Thiên Cơ thủ Mệnh thường xa quê mới phát.',
    bestPalace: 'Mệnh (Mão), Quan Lộc',
    worstPalace: 'Phu Thê',
    career: 'Chuyên gia kỹ thuật, tham mưu, nghiên cứu, công nghệ thông tin, kế hoạch. Dùng đầu óc hơn tay chân, hợp đi xa lập nghiệp.',
    love: 'Tình cảm hay thay đổi, suy nghĩ nhiều, khó chuyên nhất. Nên kết hôn muộn, sau hôn nhân cần bớt lo nghĩ.',
    wealth: 'Kiếm tiền bằng trí tuệ và kỹ năng, không giỏi giữ tiền. Làm nghề chuyên môn thì tài vận ổn định.',
    health: 'Hành Mộc, chú ý gan mật, thần kinh. Suy nghĩ nhiều dễ mất ngủ, nên tập tĩnh tâm.',
  },
  {
    name: 'Thái Dương', slug: 'thai-duong', element: 'Hoả', nature: 'Cát tinh',
    keywords: ['Dương cương', 'Quan quý', 'Hào phóng'],
    coQuyet: 'Thái Dương ở Ngọ là nhập miếu, ánh sáng rực rỡ, chủ hiển quý, mệnh nam tốt nhất; hãm địa thì vất vả, trước siêng sau lười.',
    bestPalace: 'Mệnh (từ Mão đến Ngọ), Quan Lộc',
    worstPalace: 'Phu Thê (mệnh nữ), Tật Ách',
    career: 'Công chức, chính quyền, quản lý, quan hệ công chúng, giáo dục, truyền thông. Thích đứng trước đám đông.',
    love: 'Nam có duyên nhưng dễ đa tình, nữ độc lập mạnh mẽ. Hôn nhân cần dung hoà, nên chọn người hiền hoà, chu đáo.',
    wealth: 'Tiền nhờ nỗ lực, hào phóng, không giỏi tích luỹ. Miếu vượng thì tài vận tốt, hãm thì lên xuống.',
    health: 'Hành Hoả, chú ý tim, mắt. Khi hãm địa dễ làm quá sức, cần nghỉ ngơi đủ.',
  },
  {
    name: 'Vũ Khúc', slug: 'vu-khuc', element: 'Kim', nature: 'Trung tính',
    keywords: ['Tài tinh', 'Cương nghị', 'Quyết đoán'],
    coQuyet: 'Vũ Khúc thuộc Kim, tính cương cường; thủ Mệnh ở đất vượng thì xuất tướng nhập tướng.',
    bestPalace: 'Mệnh (Thìn, Tuất, Sửu, Mùi), Tài Bạch, Quan Lộc',
    worstPalace: 'Phu Thê',
    career: 'Tài chính, quân đội, công an, kế toán, kỹ thuật. Năng lực thực thi rất mạnh, hợp việc cần bản lĩnh và quyết đoán.',
    love: 'Tình cảm thẳng thắn, ít lãng mạn, cần người dịu dàng bổ trợ.',
    wealth: 'Là tài tinh, tài vận mạnh, quản lý tiền giỏi.',
    health: 'Hành Kim, chú ý phổi, hô hấp, răng. Khi hoá Kỵ nên cẩn thận tai nạn.',
  },
  {
    name: 'Thiên Đồng', slug: 'thien-dong', element: 'Thuỷ', nature: 'Cát tinh',
    keywords: ['Ôn hoà', 'Hưởng phúc', 'Tuỳ duyên'],
    coQuyet: 'Thiên Đồng là sao phúc đức, thủ Mệnh thì hưởng phúc có thừa, một đời thong dong, không phải lao khổ.',
    bestPalace: 'Mệnh, Phúc Đức',
    worstPalace: 'Quan Lộc',
    career: 'Dịch vụ, giải trí, ẩm thực, văn nghệ. Hợp môi trường nhẹ nhàng, không hợp áp lực cạnh tranh cao.',
    love: 'Tình cảm ôn hoà, không chủ động, hôn nhân khá ổn định, dễ gần.',
    wealth: 'Tài vận không nổi bật, dựa vào lương ổn định, không giỏi đầu cơ. Đủ ăn đủ mặc nhưng khó đại phú.',
    health: 'Hành Thuỷ, chú ý thận, bàng quang. Thể chất hơi yếu, nên vận động vừa phải, giữ tinh thần thoải mái.',
  },
  {
    name: 'Liêm Trinh', slug: 'liem-trinh', element: 'Hoả', nature: 'Hung trung đới cát',
    keywords: ['Tài nghệ', 'Kỷ luật', 'Đào hoa'],
    coQuyet: 'Liêm Trinh là thứ đào hoa, tài hoa hơn người, tình cảm nhiều sóng gió; Liêm Tướng đồng cung thì hoá hung thành cát, thành cách ấn thụ, nắm quyền hành.',
    bestPalace: 'Quan Lộc (cùng Thiên Tướng), Mệnh (khi hoá Lộc)',
    worstPalace: 'Mệnh (khi hoá Kỵ), Phu Thê',
    career: 'Nghệ thuật, giải trí, pháp luật, công chức (khi đi với Thiên Tướng). Tài nghệ nổi bật, giữ nghề chính đáng mới bền.',
    love: 'Nhiều đào hoa, tình cảm phức tạp, dễ vướng rắc rối tình cảm. Nên kết hôn muộn, chọn người chín chắn.',
    wealth: 'Tài vận lên xuống, kiếm tiền bằng tài nghệ. Khi hoá Kỵ cần phòng tranh chấp tiền bạc, pháp lý.',
    health: 'Hành Hoả, chú ý tim, máu, gan. Khi hoá Kỵ cẩn thận tai nạn, phẫu thuật.',
  },
  {
    name: 'Thiên Phủ', slug: 'thien-phu', element: 'Thổ', nature: 'Cát tinh',
    keywords: ['Tài khố', 'Vững vàng', 'Thận trọng'],
    coQuyet: 'Thiên Phủ là sao kho tài, thủ Mệnh thì vững vàng, thận trọng, chủ tích của vượng nhà; mệnh nữ gặp thì vượng phu ích tử.',
    bestPalace: 'Mệnh, Tài Bạch, Điền Trạch',
    worstPalace: 'Thiên Di',
    career: 'Hành chính, tài chính, bảo hiểm, bất động sản. Cầu ổn định, không mạo hiểm, hợp nghề giữ gìn, quản lý.',
    love: 'Tình cảm ổn định, chăm lo gia đình, là người bạn đời tốt, coi trọng sự an toàn và kinh tế gia đình.',
    wealth: 'Tài vận rất tốt, giữ tiền giỏi, hợp đầu tư tích luỹ và mua bất động sản.',
    health: 'Hành Thổ, chú ý tỳ vị, tiêu hoá. Thể chất khá vững, nên ăn uống sinh hoạt điều độ.',
  },
  {
    name: 'Thái Âm', slug: 'thai-am', element: 'Thuỷ', nature: 'Cát tinh',
    keywords: ['Dịu dàng', 'Tài phú', 'Tinh tế'],
    coQuyet: 'Thái Âm là tài tinh, lợi cho mệnh nữ; ở Hợi Tý nhập miếu, sáng trọn vẹn, tài vận rất vượng; ở Ngọ hãm địa thì đa sầu đa cảm, tài vận bình thường.',
    bestPalace: 'Mệnh (Hợi, Tý), Tài Bạch',
    worstPalace: 'Mệnh (hãm ở Ngọ)',
    career: 'Tài chính, ngân hàng, bất động sản, nghệ thuật, giáo dục. Tỉ mỉ, kiên nhẫn, hợp nghề cần thẩm mỹ và sự mềm mỏng.',
    love: 'Tình cảm dịu dàng, tinh tế, coi trọng cảm xúc bên trong, cần mối quan hệ ổn định, an toàn.',
    wealth: 'Miếu vượng thì tài vận rất tốt, hãm thì phải cố gắng. Quản lý tiền cẩn thận, giỏi tích luỹ, không thích mạo hiểm.',
    health: 'Hành Thuỷ, chú ý thận, sức khoẻ sinh sản (nữ). Cảm xúc ảnh hưởng sức khoẻ, nên giữ tâm trạng thoải mái.',
  },
  {
    name: 'Tham Lang', slug: 'tham-lang', element: 'Mộc', nature: 'Trung tính',
    keywords: ['Ham muốn', 'Đào hoa', 'Đa tài'],
    coQuyet: 'Tham Lang phát phúc hanh thông, đa tài đa nghệ, đào hoa nặng nhất; thường khó phát trước 30 tuổi, phần nhiều phát muộn.',
    bestPalace: 'Mệnh (khi hoá Lộc), Phúc Đức, Thiên Di',
    worstPalace: 'Tật Ách',
    career: 'Nghệ thuật, giải trí, quan hệ công chúng, bán hàng, huyền học. Dựa vào quan hệ và tài nghệ.',
    love: 'Đào hoa rất vượng, tình cảm đa dạng. Nên kết hôn muộn, sau hôn nhân cần tiết chế mới bền lâu.',
    wealth: 'Kiếm tiền nhờ quan hệ và tài nghệ, tài vận trung vãn niên mới ổn. Khi hoá Lộc thì tiền vào nhiều nguồn, khi trẻ nên giữ chắc.',
    health: 'Hành Mộc (kiêm Thuỷ), chú ý gan, thận. Ham vui dễ hao sức, nên điều độ.',
  },
  {
    name: 'Cự Môn', slug: 'cu-mon', element: 'Thuỷ', nature: 'Hung trung đới cát',
    keywords: ['Ăn nói', 'Thị phi', 'Biện luận'],
    coQuyet: 'Cự Môn là ám tinh, chủ khẩu thiệt thị phi; hoá Lộc, hoá Quyền thì chuyển thành sống bằng tài ăn nói, chủ phú quý.',
    bestPalace: 'Quan Lộc (khi hoá Lộc, Quyền), Mệnh (Tý, Ngọ)',
    worstPalace: 'Phu Thê, Tật Ách (khi hoá Kỵ)',
    career: 'Luật sư, giáo viên, bán hàng, dẫn chương trình, đàm phán. Tài ăn nói là lợi thế chính.',
    love: 'Hay nghi ngờ, nghĩ nhiều, giao tiếp là chìa khoá của hôn nhân, nên chọn người kiên nhẫn.',
    wealth: 'Kiếm tiền bằng ăn nói và chuyên môn. Hoá Lộc thì tài vận tốt, hoá Kỵ cần phòng tranh chấp, khẩu thiệt.',
    health: 'Hành Thuỷ, chú ý thận, tai, răng miệng. Lo nghĩ nhiều dễ hại sức, nên học cách thư giãn.',
  },
  {
    name: 'Thiên Tướng', slug: 'thien-tuong', element: 'Thuỷ', nature: 'Cát tinh',
    keywords: ['Phò tá', 'Hành chính', 'Ấn thụ'],
    coQuyet: 'Thiên Tướng là sao ấn thụ, chủ việc hành chính; Liêm Tướng đồng cung thì hoá hung thành cát, nắm quyền hành chính.',
    bestPalace: 'Quan Lộc, Mệnh (cùng Liêm Trinh)',
    worstPalace: 'Tài Bạch, Mệnh (cùng Phá Quân)',
    career: 'Công chức, hành chính, thư ký, trợ lý. Giỏi vai trò hỗ trợ, cần người dẫn dắt.',
    love: 'Tình cảm ổn định, trung hậu, là người bạn đời tốt, thường để đối phương định hướng.',
    wealth: 'Tài vận bình ổn, tích luỹ từ lương, không hợp đầu tư mạo hiểm.',
    health: 'Hành Thuỷ, chú ý thận, hệ bạch huyết. Nên giữ thói quen sinh hoạt đều đặn.',
  },
  {
    name: 'Thiên Lương', slug: 'thien-luong', element: 'Thổ', nature: 'Cát tinh',
    keywords: ['Che chở', 'Y dược', 'Bề trên'],
    coQuyet: 'Thiên Lương là ấm tinh, chủ che chở; thủ Mệnh thì có duyên với bề trên, thời trẻ chịu rèn luyện, về già hưởng thanh phúc.',
    bestPalace: 'Mệnh, Phụ Mẫu, Phúc Đức',
    worstPalace: 'Mệnh (khi hoá Kỵ), Tài Bạch',
    career: 'Y tế, tôn giáo, pháp luật, công tác xã hội, từ thiện. Thích giúp người, có tâm che chở người khác.',
    love: 'Hay có duyên với người chênh lệch tuổi, hoặc duyên đến muộn, cần kiên nhẫn chờ đợi.',
    wealth: 'Tài vận nhờ quý nhân, thời trẻ chưa tốt, về già mới vững. Nên giữ hơn là xông pha.',
    health: 'Hành Thổ, chú ý tỳ vị, xương khớp. Nên chăm sóc sức khoẻ tuổi già từ sớm.',
  },
  {
    name: 'Thất Sát', slug: 'that-sat', element: 'Kim', nature: 'Hung tinh',
    keywords: ['Tướng tinh', 'Quyết đoán', 'Cô khắc'],
    coQuyet: 'Thất Sát là sao tướng quân, quyết đoán, xông xáo; thủ Mệnh thì tính cô khắc nặng, duyên lục thân mỏng.',
    bestPalace: 'Mệnh (có phụ tinh tốt), Quan Lộc',
    worstPalace: 'Phu Thê, Phụ Mẫu',
    career: 'Quân đội, công an, khởi nghiệp, giao dịch tài chính, việc tự gánh vác. Cần quyết định nhanh và bản lĩnh.',
    love: 'Tình cảm cô khắc, khó tìm người hợp, cần người bao dung được tính mạnh mẽ, nên kết hôn muộn.',
    wealth: 'Tài vận biến động lớn, có cơ hội giàu to nhưng cũng nhiều thăng trầm.',
    health: 'Hành Kim, chú ý phổi, đại tràng. Tính nóng dễ hại sức, nên học kiềm chế cảm xúc.',
  },
  {
    name: 'Phá Quân', slug: 'pha-quan', element: 'Thuỷ', nature: 'Hung tinh',
    keywords: ['Khai phá', 'Biến động', 'Phá cũ'],
    coQuyet: 'Phá Quân là sao phá cũ lập mới, thủ Mệnh thì cô khắc, duyên lục thân mỏng nhưng khả năng khai phá rất mạnh; hoá Lộc thì phá rồi lập, có thể thành nghiệp lớn.',
    bestPalace: 'Quan Lộc (khi hoá Lộc), Thiên Di',
    worstPalace: 'Phu Thê, Phụ Mẫu',
    career: 'Khởi nghiệp, quân đội, cải cách, quản lý thay đổi. Hợp công việc tiên phong, mở lối mới.',
    love: 'Tình cảm nhiều sóng gió, hợp tan bất định, nên chọn người độc lập và bao dung.',
    wealth: 'Tài vận lên xuống mạnh, hoá Lộc thì chuyển tốt. Chỉ giữ thì dễ hao, phải liên tục mở hướng mới mới tích được của.',
    health: 'Hành Thuỷ, chú ý thận, bàng quang, sinh dục. Nên duy trì thói quen vận động đều đặn.',
  },
];

export const STAR_BY_NAME: Record<string, StarInfo> = Object.fromEntries(STARS.map((s) => [s.name, s]));
export const STAR_BY_SLUG: Record<string, StarInfo> = Object.fromEntries(STARS.map((s) => [s.slug, s]));
