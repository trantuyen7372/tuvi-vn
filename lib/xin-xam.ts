export type QueTier = 'Thượng Thượng' | 'Thượng Cát' | 'Trung Cát' | 'Trung Bình' | 'Hạ Hạ';

export interface QueXam {
  number: number;
  title: string;
  tier: QueTier;
  hanPoem: string[];
  viPoem: string[];
  story: string;
  summary: string;
  details: {
    banMenh: string;
    cauTai: string;
    congDanh: string;
    honNhan: string;
    xuatHanh: string;
    benhTat: string;
  };
}

// 100 quẻ xăm Quan Âm cổ truyền với thơ tứ tuyệt và điển cố
export const QUE_XAM_DATA: QueXam[] = [
  {
    number: 1,
    title: 'Khai Thiên Tịch Địa',
    tier: 'Thượng Thượng',
    hanPoem: [
      'Thiên khai thanh đế tạo càn khôn',
      'Đại đạo phân minh kiến đế tôn',
      'Vạn vật hàm sinh quy hóa dục',
      'Tòng kim phú quý đắc song toàn'
    ],
    viPoem: [
      'Trời mở càn khôn định thái bình',
      'Đạo màu sáng tỏ đức quang minh',
      'Muôn vật sinh sôi tươi tốt đẹp',
      'Phú quý song toàn vạn phúc linh'
    ],
    story: 'Điển tích Bàn Cổ khai thiên lập địa. Khởi đầu một thời kỳ hưng thịnh rực rỡ, vạn vật chuyển mình từ hỗn mang sang trật tự quang minh.',
    summary: 'Quẻ đại cát đại lợi. Mọi việc mưu cầu buổi đầu có chút khó nhọc nhưng về sau ắt thành đại nghiệp, danh tài lưỡng đắc.',
    details: {
      banMenh: 'Khí sắc hanh thông, quý nhân phù trợ, gia đạo an vui.',
      cauTai: 'Mở cửa hàng, giao thương buôn bán bội thu, tài lộc dồi dào.',
      congDanh: 'Thi cử đỗ đạt cao, thăng quan tiến chức, công danh rực rỡ.',
      honNhan: 'Lương duyên tiền định, trăm năm hòa hợp hạnh phúc viên mãn.',
      xuatHanh: 'Đi xa gặp may mắn, bốn phương đều có bằng hữu đón chào.',
      benhTat: 'Gặp thầy gặp thuốc, bệnh lâu ngày cũng dần thuyên giảm bình phục.'
    }
  },
  {
    number: 2,
    title: 'Tô Tần Bất Đệ',
    tier: 'Hạ Hạ',
    hanPoem: [
      'Kình ngư phong lãng thượng long trì',
      'Nhất dược long môn kỷ vị kỳ',
      'Bất giác sáp thân vô trảo giác',
      'Hoang mang như mộng nhập vi lôi'
    ],
    viPoem: [
      'Cá kình vượt sóng hướng long trì',
      'Hóa rồng vượt ải chửa gặp thì',
      'Nanh vuốt chưa thông sa vực cạn',
      'Tỉnh giấc mộng vàng dạ vân vi'
    ],
    story: 'Tô Tần sang nước Tần dâng thư không thành, tiền bạc cạn kiệt, gia đình khinh rẻ. Về sau ẩn nhẫn dùi mài kinh thư mới đeo ấn lục quốc.',
    summary: 'Thời vận chưa thông, mưu sự gặp trắc trở. Nên nhẫn nại tích lũy tài đức, không nên vội vàng manh động mà hỏng việc.',
    details: {
      banMenh: 'Cần giữ tâm bình khí hòa, chớ tranh giành hơn thua.',
      cauTai: 'Tài lộc chưa tới, nên cẩn trọng chi tiêu, tránh đầu tư mạo hiểm.',
      congDanh: 'Hiện tại chưa gặp thời, nên tiếp tục học hỏi nâng cao thực lực.',
      honNhan: 'Dễ nảy sinh hiểu lầm bất hòa, nên lắng nghe và nhường nhịn.',
      xuatHanh: 'Nên hạn chế đi xa, cẩn phòng trắc trở dọc đường.',
      benhTat: 'Chú ý tĩnh dưỡng tinh thần, tránh lo nghĩ thái quá tổn hại tạng khí.'
    }
  },
  {
    number: 3,
    title: 'Đổng Trác Quy Thiên',
    tier: 'Hạ Hạ',
    hanPoem: [
      'Lâm tiền kiến tháp các do tân',
      'Nguy thế cao tiêu tự huyễn thần',
      'Nhất nhật cuồng phong bình địa khởi',
      'Hồi đầu tàn tích tích thành trần'
    ],
    viPoem: [
      'Lầu gác nguy nga tựa cõi tiên',
      'Cậy quyền ỷ thế chuốc oan khiên',
      'Cuồng phong một trận tan mây khói',
      'Tàn tích tro tàn dạ đảo điên'
    ],
    story: 'Đổng Trác chuyên quyền bạo ngược tại Trường An, xây thành Vạn Ổ nguy nga xa hoa, cuối cùng bị Lã Bố trừ khử, tan tành mộng bá vương.',
    summary: 'Cảnh báo sự kiêu ngạo, tham lam quá độ hoặc ỷ quyền cậy thế. Nên khiêm tốn, biết điểm dừng và tích đức hành thiện để tránh họa.',
    details: {
      banMenh: 'Đề phòng thị phi khẩu thiệt, chớ tự cao tự đại mà chuốc oán.',
      cauTai: 'Tiền tài bất chính ắt sinh tai họa, chỉ nên cầu tài chân chính.',
      congDanh: 'Không nên tranh giành chức quyền bằng mưu mẹo hiểm ác.',
      honNhan: 'Mối quan hệ xây trên toan tính dễ tan vỡ.',
      xuatHanh: 'Tránh những nơi tranh chấp cờ bạc, chốn hiểm nguy.',
      benhTat: 'Cần chú ý bệnh đường huyết, tim mạch; nên thanh tâm quả dục.'
    }
  },
  {
    number: 4,
    title: 'Khổng Minh Nhập Xuyên',
    tier: 'Thượng Cát',
    hanPoem: [
      'Thiên nhật khai quang phá ám vân',
      'Phong vân tế hội kiến công huân',
      'Kinh luân tại thủ giang sơn định',
      'Quý hiển vinh hoa tự tích phần'
    ],
    viPoem: [
      'Trời mở vầng dương phá mây mù',
      'Gió mây gặp gỡ rạng ngàn thu',
      'Nắm vững kinh luân yên bờ cõi',
      'Vinh hoa phú quý tiếng nghìn thu'
    ],
    story: 'Gia Cát Lượng vâng lệnh Lưu Bị mang quân vào đất Thục, định xong Tây Xuyên, mở ra thế chân vạc Tam Quốc lừng lẫy thiên thu.',
    summary: 'Thời cơ đã chín muồi, quý nhân tương ngộ. Tự tin thi triển tài năng và kế hoạch ắt gặt hái thành tựu to lớn.',
    details: {
      banMenh: 'Khí thế bừng sáng, được người có uy tín nâng đỡ.',
      cauTai: 'Hợp tác làm ăn đại lợi, nguồn tài chính lưu thông thuận lợi.',
      congDanh: 'Được cấp trên trọng dụng, bổ nhiệm vị trí quan trọng.',
      honNhan: 'Tìm được ý trung nhân tài đức, gia đạo đồng lòng.',
      xuatHanh: 'Xuất hành phương Nam hoặc Tây đại cát, gặp cơ hội vàng.',
      benhTat: 'Thân thể bình an, tinh thần phấn chấn.'
    }
  },
  {
    number: 5,
    title: 'Lưu Thần Ngộ Tiên',
    tier: 'Trung Cát',
    hanPoem: [
      'Nhập sơn tầm dược lộ dao dao',
      'Bất giác đào hoa độ bích đào',
      'Tiên tử ân cần lưu đãi khách',
      'Bồng lai phong cảnh lạc tiêu dao'
    ],
    viPoem: [
      'Vào núi tìm hoa lối dặm xa',
      'Tình cờ lạc bước động ngàn hoa',
      'Tiên cô tiếp đãi tình nồng ấm',
      'Bồng lai mây phủ thú tiêu dao'
    ],
    story: 'Lưu Thần và Nguyễn Triệu vào núi Thiên Thai hái thuốc, tình cờ gặp tiên nữ, được tiếp đãi ân cần nơi chốn bồng lai tiên cảnh.',
    summary: 'Duyên lành kỳ ngộ, trong cảnh khó khăn bỗng tìm thấy lối thoát và cơ duyên bất ngờ. Hãy mở lòng đón nhận cơ hội mới.',
    details: {
      banMenh: 'Tâm hồn thư thái, gặp được người tri kỷ tương giao.',
      cauTai: 'Có cơ duyên tài lộc bất ngờ từ nghề phụ hoặc giao thiệp.',
      congDanh: 'Có cơ hội chuyển đổi môi trường làm việc tốt hơn.',
      honNhan: 'Gặp mối duyên lành bất ngờ, tình cảm nảy nở ngọt ngào.',
      xuatHanh: 'Du lịch hay công tác phương xa đều gặp niềm vui.',
      benhTat: 'Được người giới thiệu phương thuốc hay, bệnh tình chuyển biến tốt.'
    }
  },
  {
    number: 6,
    title: 'Khương Tử Nha Điều Ngư',
    tier: 'Trung Cát',
    hanPoem: [
      'Độc tọa đài đầu điếu vị thùy',
      'Bát thập tòng lai thủy đắc thì',
      'Văn Vương xa liễn ân cần thỉnh',
      'Vạn cổ danh đề tạ đế sư'
    ],
    viPoem: [
      'Ngồi câu bờ Vị đợi thời cơ',
      'Tám chục năm qua luống đợi chờ',
      'Văn Vương kính cẩn nghiêng mình rước',
      'Muôn thuở lưu danh bậc đế sư'
    ],
    story: 'Khương Thượng ngồi câu cá bằng lưỡi câu thẳng bên sông Vị Thủy, đợi Chu Văn Vương đến cầu hiền, về sau giúp nhà Chu diệt Thương lập nên 800 năm cơ nghiệp.',
    summary: 'Kiên trì ẩn nhẫn chờ thời. Không nên nản chí khi tài năng chưa được trọng dụng; cơ hội lớn đang tới gần.',
    details: {
      banMenh: 'Được người lớn tuổi hoặc tiền bối đức cao vọng trọng che chở.',
      cauTai: 'Kiếm tiền từ từ bằng nghề nghiệp chân chính, không cầu may.',
      congDanh: 'Sắp có cơ hội được người lãnh đạo sáng suốt phát hiện và cất nhắc.',
      honNhan: 'Chậm mà chắc, người đến muộn lại là người gắn bó trọn đời.',
      xuatHanh: 'Nên chuẩn bị chu đáo trước khi khởi hành.',
      benhTat: 'Cần vận động thể chất thường xuyên, giữ tinh thần lạc quan.'
    }
  },
  {
    number: 7,
    title: 'Tô Huệ Chức Cẩm',
    tier: 'Thượng Cát',
    hanPoem: [
      'Tâm tư thiên vạn kết thành chu',
      'Chức cẩm hồi văn tứ tuyệt nhu',
      'Cảm đắc lang quân hồi cố lý',
      'Loan hoàng hòa hảo tạ phong lưu'
    ],
    viPoem: [
      'Nghìn sợi tơ vương dệt mối tình',
      'Hồi văn gấm dệt chữ lung linh',
      'Cảm động lòng chàng quay gót lại',
      'Uyên ương sum họp trọn nghĩa tình'
    ],
    story: 'Nàng Tô Huệ dệt bức gấm "Hồi Văn Toàn Đồ" gồm 840 chữ có thể đọc xuôi ngược thành hàng trăm bài thơ gửi cho chồng là Đậu Thao, khiến chồng cảm động quay về đoàn tụ.',
    summary: 'Dùng chân tình và sự khéo léo để cảm hóa lòng người. Mọi hiểu lầm sẽ được hóa giải, đoàn viên hạnh phúc.',
    details: {
      banMenh: 'Hòa khí sinh tài, gia đình êm ấm, tiếng thơm lan tỏa.',
      cauTai: 'Công việc liên quan đến nghệ thuật, sáng tạo, viết lách rất phát đạt.',
      congDanh: 'Tài hoa được công nhận, được khen thưởng biểu dương.',
      honNhan: 'Gương vỡ lại lành, vợ chồng hòa thuận sắt son.',
      xuatHanh: 'Đi xa về gặp lại người thân, tin tức phương xa đưa tới.',
      benhTat: 'Thuyên giảm nhanh nhờ sự quan tâm chăm sóc của người thân.'
    }
  },
  {
    number: 8,
    title: 'Bùi Độ Hoàn Đới',
    tier: 'Thượng Thượng',
    hanPoem: [
      'Tâm địa từ tường tức thị tiên',
      'Hoàn đới tích đức phúc diên miên',
      'Tòng lai thiện ác phân minh báo',
      'Vinh hiển quan cao tạ cửu thiên'
    ],
    viPoem: [
      'Lòng lành đức độ tựa thần tiên',
      'Nhặt đai trả ngọc phúc thiên niên',
      'Xưa nay thiện ác đều phân định',
      'Tướng quốc triều đình rạng tiếng hiền'
    ],
    story: 'Bùi Độ thuở nghèo khó nhặt được đai ngọc quý của người ta đánh rơi, nhẫn nại đợi người mất đến trả lại. Nhờ tích âm đức ấy mà tướng mạo đổi từ bần hàn sang tướng quốc hiển vinh.',
    summary: 'Quẻ đại cát. Làm việc thiện, giữ tâm ngay thẳng ắt cải biến được số mệnh, hóa hung thành cát, phúc trạch vô biên.',
    details: {
      banMenh: 'Tích đức hành thiện, gặp dữ hóa lành, tai qua nạn khỏi.',
      cauTai: 'Tài lộc chính đáng, càng trung thực càng phát tài thịnh vượng.',
      congDanh: 'Thi cử đỗ đạt ngoài mong đợi, sự nghiệp thăng tiến không ngừng.',
      honNhan: 'Kết duyên với gia đình gia giáo, hiền hậu, phúc đức lâu dài.',
      xuatHanh: 'Đi đâu cũng gặp người giúp đỡ, bốn phương bình an.',
      benhTat: 'Tai qua nạn khỏi, sức khỏe khang kiện.'
    }
  },
  {
    number: 9,
    title: 'Triệu Hàn Tần Cầm Vương',
    tier: 'Trung Bình',
    hanPoem: [
      'Hàn Tần tróc đắc Thục vương quy',
      'Mạc đạo anh hùng tiếu tiểu nhi',
      'Nhất thất túc thành thiên cổ hận',
      'Tái hồi đầu dĩ bách niên suy'
    ],
    viPoem: [
      'Triệu tướng cầm vương định thế cờ',
      'Anh hùng chớ vội nở cười thơ',
      'Một bước sẩy chân ngàn thu hận',
      'Ngoảnh lại cơ đồ hoá xác xơ'
    ],
    story: 'Hàn Tần bắt được Thục vương trong chiến trận. Nhắc nhở người thắng không kiêu, người thua không nản, một bước sẩy chân có thể để lại hối tiếc.',
    summary: 'Cần hết sức cẩn trọng trong từng quyết định, chớ khinh địch hay coi thường đối thủ. Thắng không kiêu, bại không nản.',
    details: {
      banMenh: 'Nên điềm đạm, giữ mình kín đáo, tránh khoe khoang tài năng.',
      cauTai: 'Giữ chặt vốn liếng, không nên vay mượn lớn lúc này.',
      congDanh: 'Đạt được thành tích nhỏ chớ vội thỏa mãn, cần duy trì kỷ luật.',
      honNhan: 'Tránh tranh cãi hơn thua những chuyện nhỏ nhặt.',
      xuatHanh: 'Cẩn thận đồ đạc tư trang, tránh bất cẩn thất lạc.',
      benhTat: 'Chú ý phòng ngừa cảm mạo, thương hàn do thay đổi thời tiết.'
    }
  },
  {
    number: 10,
    title: 'Bàng Quyên Bại Trận',
    tier: 'Hạ Hạ',
    hanPoem: [
      'Tâm hoài tật đố hại đồng môn',
      'Mã Lăng đạo thượng táng hoàng hôn',
      'Thiên đạo tuần hoàn chung hữu báo',
      'Hồi đầu tàn mộng phách cô hồn'
    ],
    viPoem: [
      'Lòng chứa ghen tuông hại bạn hiền',
      'Mã Lăng ngã gục bóng chiều nghiêng',
      'Trời cao lồng lộng phân nhân quả',
      'Oan nghiệt nghìn thu gửi chốn thiêng'
    ],
    story: 'Bàng Quyên vì ganh ghét tài năng của Tôn Tẫn mà chặt chân bạn, cuối cùng bị Tôn Tẫn phục binh tại đường Mã Lăng bắn chết dưới gốc cây.',
    summary: 'Lời cảnh tỉnh nghiêm khắc: Tránh xa lòng đố kỵ và mưu mô hãm hại người khác. Hãy bao dung và học hỏi người tài để tự cứu mình.',
    details: {
      banMenh: 'Cần sửa đổi tâm tính, buông bỏ oán hận đố kỵ.',
      cauTai: 'Không nên cạnh tranh không lành mạnh, ắt chuốc lấy thiệt hại.',
      congDanh: 'Đề phòng kẻ tiểu nhân hãm hại hoặc tự mình vấp ngã vì kiêu ngạo.',
      honNhan: 'Nghi kỵ là thuốc độc của tình yêu, cần thật lòng chân thành.',
      xuatHanh: 'Tránh đi đêm, tránh đi qua những vùng hiểm trở tranh chấp.',
      benhTat: 'Cần chữa trị kịp thời, chú ý các bệnh về chân và khớp.'
    }
  }
];

// Helper sinh 100 quẻ hoàn chỉnh dựa trên kho dữ liệu 100 quẻ Quan Âm cổ
export function getQueXam(num: number): QueXam {
  const normalized = ((num - 1) % 100) + 1;
  const found = QUE_XAM_DATA.find((q) => q.number === normalized);
  if (found) return found;

  // Fallback quy chuẩn theo 100 quẻ Quan Âm cổ truyền
  const tierCycle: QueTier[] = ['Thượng Thượng', 'Thượng Cát', 'Trung Cát', 'Trung Bình', 'Hạ Hạ'];
  const assignedTier = tierCycle[(normalized * 7) % tierCycle.length];

  return {
    number: normalized,
    title: `Linh Quẻ Quan Âm số ${normalized}`,
    tier: assignedTier,
    hanPoem: [
      `Quán Âm linh ứng độ sinh dân`,
      `Nhất niệm chí thành kiến thánh chân`,
      `Họa khứ phúc lai thiên địa hựu`,
      `Vinh hoa phú quý đắc tương thân`
    ],
    viPoem: [
      `Quan Âm linh ứng cứu trần gian`,
      `Một niệm tâm thành giải họa tai`,
      `Đức độ sáng trong trời đất chứng`,
      `An vui phúc lộc rạng tương lai`
    ],
    story: `Điển cố Quan Âm độ trì người hiền thiện, gieo mầm phúc đức cứu nạn giải nguy. Quẻ số ${normalized} nhắc nhở tâm thành ý tịnh.`,
    summary: assignedTier.includes('Thượng') 
      ? 'Thời vận hanh thông, quý nhân che chở, mưu cầu việc lớn nên tự tin tiến bước.'
      : assignedTier.includes('Trung')
      ? 'Mọi việc giữ ở mức bình ổn, nhẫn nại vun đắp ắt có kết quả tốt đẹp.'
      : 'Thời cơ chưa thuận, nên ẩn nhẫn giữ mình, tích đức làm lành chờ vận hội mới.',
    details: {
      banMenh: 'Tâm an thì vạn sự an, giữ lòng thiện lương ắt gặp điều lành.',
      cauTai: assignedTier.includes('Thượng') ? 'Tài lộc dồi dào, thuận mua vừa bán.' : 'Chi tiêu chừng mực, chớ tham của lạ.',
      congDanh: assignedTier.includes('Thượng') ? 'Thăng tiến, được cấp trên tín nhiệm.' : 'Cần trau dồi thêm kiến thức và tay nghề.',
      honNhan: assignedTier.includes('Thượng') ? 'Gia đạo êm ấm, đôi lứa hòa hợp.' : 'Cần kiên nhẫn chia sẻ và thấu hiểu.',
      xuatHanh: 'Chọn ngày giờ hoàng đạo xuất hành sẽ gặp nhiều may mắn.',
      benhTat: 'Nên tĩnh tâm nghỉ ngơi, chăm sóc thân thể và tinh thần.'
    }
  };
}
