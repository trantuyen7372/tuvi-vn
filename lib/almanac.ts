import { solar2lunar, getHeavenlyStemAndEarthlyBranchBySolarDate } from 'lunar-lite';

export const STEM_VI: Record<string, string> = {
  '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
  '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý'
};

export const BRANCH_VI: Record<string, string> = {
  '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', '巳': 'Tỵ',
  '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi'
};

export const BRANCH_ORDER = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

export const NAP_AM: Record<string, { name: string; element: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ' }> = {
  'Giáp Tý': { name: 'Hải Trung Kim', element: 'Kim' },
  'Ất Sửu': { name: 'Hải Trung Kim', element: 'Kim' },
  'Bính Dần': { name: 'Lư Trung Hỏa', element: 'Hỏa' },
  'Đinh Mão': { name: 'Lư Trung Hỏa', element: 'Hỏa' },
  'Mậu Thìn': { name: 'Đại Lâm Mộc', element: 'Mộc' },
  'Kỷ Tỵ': { name: 'Đại Lâm Mộc', element: 'Mộc' },
  'Canh Ngọ': { name: 'Lộ Bàng Thổ', element: 'Thổ' },
  'Tân Mùi': { name: 'Lộ Bàng Thổ', element: 'Thổ' },
  'Nhâm Thân': { name: 'Kiếm Phong Kim', element: 'Kim' },
  'Quý Dậu': { name: 'Kiếm Phong Kim', element: 'Kim' },
  'Giáp Tuất': { name: 'Sơn Đầu Hỏa', element: 'Hỏa' },
  'Ất Hợi': { name: 'Sơn Đầu Hỏa', element: 'Hỏa' },
  'Bính Tý': { name: 'Giản Hạ Thủy', element: 'Thủy' },
  'Đinh Sửu': { name: 'Giản Hạ Thủy', element: 'Thủy' },
  'Mậu Dần': { name: 'Thành Đầu Thổ', element: 'Thổ' },
  'Kỷ Mão': { name: 'Thành Đầu Thổ', element: 'Thổ' },
  'Canh Thìn': { name: 'Bạch Lạp Kim', element: 'Kim' },
  'Tân Tỵ': { name: 'Bạch Lạp Kim', element: 'Kim' },
  'Nhâm Ngọ': { name: 'Dương Liễu Mộc', element: 'Mộc' },
  'Quý Mùi': { name: 'Dương Liễu Mộc', element: 'Mộc' },
  'Giáp Thân': { name: 'Tuyền Trung Thủy', element: 'Thủy' },
  'Ất Dậu': { name: 'Tuyền Trung Thủy', element: 'Thủy' },
  'Bính Tuất': { name: 'Ốc Thượng Thổ', element: 'Thổ' },
  'Đinh Hợi': { name: 'Ốc Thượng Thổ', element: 'Thổ' },
  'Mậu Tý': { name: 'Tích Lịch Hỏa', element: 'Hỏa' },
  'Kỷ Sửu': { name: 'Tích Lịch Hỏa', element: 'Hỏa' },
  'Canh Dần': { name: 'Tùng Bách Mộc', element: 'Mộc' },
  'Tân Mão': { name: 'Tùng Bách Mộc', element: 'Mộc' },
  'Nhâm Thìn': { name: 'Trường Lưu Thủy', element: 'Thủy' },
  'Quý Tỵ': { name: 'Trường Lưu Thủy', element: 'Thủy' },
  'Giáp Ngọ': { name: 'Sa Trung Kim', element: 'Kim' },
  'Ất Mùi': { name: 'Sa Trung Kim', element: 'Kim' },
  'Bính Thân': { name: 'Sơn Hạ Hỏa', element: 'Hỏa' },
  'Đinh Dậu': { name: 'Sơn Hạ Hỏa', element: 'Hỏa' },
  'Mậu Tuất': { name: 'Bình Địa Mộc', element: 'Mộc' },
  'Kỷ Hợi': { name: 'Bình Địa Mộc', element: 'Mộc' },
  'Canh Tý': { name: 'Bích Thượng Thổ', element: 'Thổ' },
  'Tân Sửu': { name: 'Bích Thượng Thổ', element: 'Thổ' },
  'Nhâm Dần': { name: 'Kim Bạc Kim', element: 'Kim' },
  'Quý Mão': { name: 'Kim Bạc Kim', element: 'Kim' },
  'Giáp Thìn': { name: 'Phúc Đăng Hỏa', element: 'Hỏa' },
  'Ất Tỵ': { name: 'Phúc Đăng Hỏa', element: 'Hỏa' },
  'Bính Ngọ': { name: 'Thiên Hà Thủy', element: 'Thủy' },
  'Đinh Mùi': { name: 'Thiên Hà Thủy', element: 'Thủy' },
  'Mậu Thân': { name: 'Đại Trạch Thổ', element: 'Thổ' },
  'Kỷ Dậu': { name: 'Đại Trạch Thổ', element: 'Thổ' },
  'Canh Tuất': { name: 'Thoa Xuyến Kim', element: 'Kim' },
  'Tân Hợi': { name: 'Thoa Xuyến Kim', element: 'Kim' },
  'Nhâm Tý': { name: 'Tang Đố Mộc', element: 'Mộc' },
  'Quý Sửu': { name: 'Tang Đố Mộc', element: 'Mộc' },
  'Giáp Dần': { name: 'Đại Khê Thủy', element: 'Thủy' },
  'Ất Mão': { name: 'Đại Khê Thủy', element: 'Thủy' },
  'Bính Thìn': { name: 'Sa Trung Thổ', element: 'Thổ' },
  'Đinh Tỵ': { name: 'Sa Trung Thổ', element: 'Thổ' },
  'Mậu Ngọ': { name: 'Thiên Thượng Hỏa', element: 'Hỏa' },
  'Kỷ Mùi': { name: 'Thiên Thượng Hỏa', element: 'Hỏa' },
  'Canh Thân': { name: 'Thạch Lựu Mộc', element: 'Mộc' },
  'Tân Dậu': { name: 'Thạch Lựu Mộc', element: 'Mộc' },
  'Nhâm Tuất': { name: 'Đại Hải Thủy', element: 'Thủy' },
  'Quý Hợi': { name: 'Đại Hải Thủy', element: 'Thủy' },
};

export const TRUC_NAMES = [
  'Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp',
  'Phá', 'Nguy', 'Thành', 'Thâu', 'Khai', 'Bế'
];

export const TRUC_DETAILS: Record<string, { meaning: string; rating: 'cat' | 'binh' | 'hung'; good: string[]; bad: string[] }> = {
  'Kiến': {
    meaning: 'Khởi đầu, xuất phát; vạn vật bắt đầu sinh sôi nảy nở.',
    rating: 'binh',
    good: ['Nhậm chức', 'Cầu tài', 'Đính hôn', 'Xuất hành'],
    bad: ['Động thổ', 'Đào móng', 'Chôn cất'],
  },
  'Trừ': {
    meaning: 'Tẩy uế, giải trừ điều cũ, trừ bỏ điều xấu để đón khí mới.',
    rating: 'cat',
    good: ['Chữa bệnh', 'Tẩy uế', 'Phá dỡ nhà cũ', 'Cắt tóc', 'Cầu phúc'],
    bad: ['Cưới hỏi', 'Khai trương', 'Ký hợp đồng lớn'],
  },
  'Mãn': {
    meaning: 'Đầy đủ, sung túc, viên mãn; khí lành bao phủ dồi dào.',
    rating: 'cat',
    good: ['Cúng tế', 'Cầu tài', 'Mở kho hàng', 'Giao dịch', 'Tế tự'],
    bad: ['Kiện tụng', 'Tranh chấp', 'Chôn cất'],
  },
  'Bình': {
    meaning: 'Bình ổn, hòa hoãn; mọi việc cân bằng, nên giữ chừng mực.',
    rating: 'binh',
    good: ['Tu sửa nhỏ', 'Làm đường', 'Bồi đắp bờ cõi', 'Gặp gỡ bạn bè'],
    bad: ['Khởi công lớn', 'Tranh chấp kiện cáo'],
  },
  'Định': {
    meaning: 'Ổn định, chắc chắn, lâu bền; nền móng vững chãi cho tương lai.',
    rating: 'cat',
    good: ['Cưới hỏi', 'Ký khế ước', 'Giao dịch', 'Mua bán nhà đất', 'Hội họp'],
    bad: ['Kiện tụng', 'Đi xa mạo hiểm'],
  },
  'Chấp': {
    meaning: 'Nắm giữ, xây đắp, kiên định; giữ vững nguyên tắc và bổn phận.',
    rating: 'cat',
    good: ['Đặt móng', 'Gieo trồng', 'Xây dựng', 'Ký kết thỏa thuận'],
    bad: ['Xuất hành xa', 'Di dời chỗ ở'],
  },
  'Phá': {
    meaning: 'Phá vỡ, xung đột; thích hợp phá bỏ rào cản cũ, không nên lập mới.',
    rating: 'hung',
    good: ['Phá bỏ công trình cũ', 'Chữa bệnh', 'Trừ tai', 'Bỏ thói quen xấu'],
    bad: ['Cưới hỏi', 'Khai trương', 'Khởi công xây nhà', 'Ký hợp đồng'],
  },
  'Nguy': {
    meaning: 'Gập ghềnh, hiểm trở; cần thận trọng trong từng bước đi.',
    rating: 'hung',
    good: ['Tế lễ cầu an', 'Thắp hương cầu phúc', 'Tu tâm dưỡng tính'],
    bad: ['Đi đường sông nước', 'Mạo hiểm đầu tư', 'Leo cao'],
  },
  'Thành': {
    meaning: 'Thành tựu, trọn vẹn, hanh thông; mọi việc mưu cầu dễ đơm hoa kết trái.',
    rating: 'cat',
    good: ['Khai trương', 'Cưới hỏi', 'Nhập học', 'Ký kết hợp đồng', 'Khởi công', 'Cầu tài'],
    bad: ['Kiện tụng', 'Tranh chấp bất hòa'],
  },
  'Thâu': {
    meaning: 'Thu gom, gặt hái, tích lũy; đem lại thành quả sau thời gian vun trồng.',
    rating: 'cat',
    good: ['Thu nợ', 'Gặt hái', 'Mở kho', 'Giao dịch thương mại', 'Nhận chức'],
    bad: ['Chôn cất', 'Phá dỡ'],
  },
  'Khai': {
    meaning: 'Khai mở, thông suốt; vầng dương rực rỡ soi sáng con đường mới.',
    rating: 'cat',
    good: ['Khai trương', 'Xuất hành', 'Bắt đầu dự án mới', 'Nhập học', 'Động thổ'],
    bad: ['Đào huyệt', 'Việc u buồn'],
  },
  'Bế': {
    meaning: 'Khép lại, ngăn chặn; thích hợp phòng thủ, tích trữ và bảo mật.',
    rating: 'hung',
    good: ['Đắp đê ngăn nước', 'Phòng thủ', 'Cất giấu tài sản', 'An táng'],
    bad: ['Khai trương', 'Chữa mắt', 'Động thổ', 'Cưới hỏi'],
  },
};

// 12 thần Hoàng Đạo & Hắc Đạo
export const HOANG_DAO_STARS: { name: string; isHoang: boolean }[] = [
  { name: 'Thanh Long', isHoang: true },
  { name: 'Minh Đường', isHoang: true },
  { name: 'Thiên Hình', isHoang: false },
  { name: 'Chu Tước', isHoang: false },
  { name: 'Kim Quỹ', isHoang: true },
  { name: 'Kim Đường', isHoang: true },
  { name: 'Bạch Hổ', isHoang: false },
  { name: 'Ngọc Đường', isHoang: true },
  { name: 'Thiên Lao', isHoang: false },
  { name: 'Huyền Vũ', isHoang: false },
  { name: 'Tư Mệnh', isHoang: true },
  { name: 'Câu Trận', isHoang: false },
];

// Khởi đầu Thanh Long cho các tháng (theo chi tháng)
// Tháng 1 (Dần) & Tháng 7 (Thân) khởi Tý (idx 0)
// Tháng 2 (Mão) & Tháng 8 (Dậu) khởi Dần (idx 2)
// Tháng 3 (Thìn) & Tháng 9 (Tuất) khởi Thìn (idx 4)
// Tháng 4 (Tỵ) & Tháng 10 (Hợi) khởi Ngọ (idx 6)
// Tháng 5 (Ngọ) & Tháng 11 (Tý) khởi Thân (idx 8)
// Tháng 6 (Mùi) & Tháng 12 (Sửu) khởi Tuất (idx 10)
export const MONTH_THANH_LONG_START: Record<string, number> = {
  'Dần': 0, 'Thân': 0,
  'Mão': 2, 'Dậu': 2,
  'Thìn': 4, 'Tuất': 4,
  'Tỵ': 6, 'Hợi': 6,
  'Ngọ': 8, 'Tý': 8,
  'Mùi': 10, 'Sửu': 10,
};

// Giờ Hoàng Đạo theo Chi ngày
export const GIO_HOANG_DAO_BY_DAY_BRANCH: Record<string, { branch: string; star: string }[]> = {
  'Dần': [
    { branch: 'Tý', star: 'Thanh Long' }, { branch: 'Sửu', star: 'Minh Đường' },
    { branch: 'Thìn', star: 'Kim Quỹ' }, { branch: 'Tỵ', star: 'Kim Đường' },
    { branch: 'Mùi', star: 'Ngọc Đường' }, { branch: 'Tuất', star: 'Tư Mệnh' }
  ],
  'Thân': [
    { branch: 'Tý', star: 'Thanh Long' }, { branch: 'Sửu', star: 'Minh Đường' },
    { branch: 'Thìn', star: 'Kim Quỹ' }, { branch: 'Tỵ', star: 'Kim Đường' },
    { branch: 'Mùi', star: 'Ngọc Đường' }, { branch: 'Tuất', star: 'Tư Mệnh' }
  ],
  'Mão': [
    { branch: 'Tý', star: 'Tư Mệnh' }, { branch: 'Dần', star: 'Thanh Long' },
    { branch: 'Mão', star: 'Minh Đường' }, { branch: 'Ngọ', star: 'Kim Quỹ' },
    { branch: 'Mùi', star: 'Kim Đường' }, { branch: 'Dậu', star: 'Ngọc Đường' }
  ],
  'Dậu': [
    { branch: 'Tý', star: 'Tư Mệnh' }, { branch: 'Dần', star: 'Thanh Long' },
    { branch: 'Mão', star: 'Minh Đường' }, { branch: 'Ngọ', star: 'Kim Quỹ' },
    { branch: 'Mùi', star: 'Kim Đường' }, { branch: 'Dậu', star: 'Ngọc Đường' }
  ],
  'Thìn': [
    { branch: 'Dần', star: 'Tư Mệnh' }, { branch: 'Thìn', star: 'Thanh Long' },
    { branch: 'Tỵ', star: 'Minh Đường' }, { branch: 'Thân', star: 'Kim Quỹ' },
    { branch: 'Dậu', star: 'Kim Đường' }, { branch: 'Hợi', star: 'Ngọc Đường' }
  ],
  'Tuất': [
    { branch: 'Dần', star: 'Tư Mệnh' }, { branch: 'Thìn', star: 'Thanh Long' },
    { branch: 'Tỵ', star: 'Minh Đường' }, { branch: 'Thân', star: 'Kim Quỹ' },
    { branch: 'Dậu', star: 'Kim Đường' }, { branch: 'Hợi', star: 'Ngọc Đường' }
  ],
  'Tỵ': [
    { branch: 'Sửu', star: 'Ngọc Đường' }, { branch: 'Thìn', star: 'Tư Mệnh' },
    { branch: 'Ngọ', star: 'Thanh Long' }, { branch: 'Mùi', star: 'Minh Đường' },
    { branch: 'Tuất', star: 'Kim Quỹ' }, { branch: 'Hợi', star: 'Kim Đường' }
  ],
  'Hợi': [
    { branch: 'Sửu', star: 'Ngọc Đường' }, { branch: 'Thìn', star: 'Tư Mệnh' },
    { branch: 'Ngọ', star: 'Thanh Long' }, { branch: 'Mùi', star: 'Minh Đường' },
    { branch: 'Tuất', star: 'Kim Quỹ' }, { branch: 'Hợi', star: 'Kim Đường' }
  ],
  'Tý': [
    { branch: 'Tý', star: 'Kim Quỹ' }, { branch: 'Sửu', star: 'Kim Đường' },
    { branch: 'Mão', star: 'Ngọc Đường' }, { branch: 'Ngọ', star: 'Tư Mệnh' },
    { branch: 'Thân', star: 'Thanh Long' }, { branch: 'Dậu', star: 'Minh Đường' }
  ],
  'Ngọ': [
    { branch: 'Tý', star: 'Kim Quỹ' }, { branch: 'Sửu', star: 'Kim Đường' },
    { branch: 'Mão', star: 'Ngọc Đường' }, { branch: 'Ngọ', star: 'Tư Mệnh' },
    { branch: 'Thân', star: 'Thanh Long' }, { branch: 'Dậu', star: 'Minh Đường' }
  ],
  'Sửu': [
    { branch: 'Dần', star: 'Kim Quỹ' }, { branch: 'Mão', star: 'Kim Đường' },
    { branch: 'Tỵ', star: 'Ngọc Đường' }, { branch: 'Thân', star: 'Tư Mệnh' },
    { branch: 'Tuất', star: 'Thanh Long' }, { branch: 'Hợi', star: 'Minh Đường' }
  ],
  'Mùi': [
    { branch: 'Dần', star: 'Kim Quỹ' }, { branch: 'Mão', star: 'Kim Đường' },
    { branch: 'Tỵ', star: 'Ngọc Đường' }, { branch: 'Thân', star: 'Tư Mệnh' },
    { branch: 'Tuất', star: 'Thanh Long' }, { branch: 'Hợi', star: 'Minh Đường' }
  ],
};

export const HOUR_RANGES: Record<string, string> = {
  'Tý': '23:00 – 01:00',
  'Sửu': '01:00 – 03:00',
  'Dần': '03:00 – 05:00',
  'Mão': '05:00 – 07:00',
  'Thìn': '07:00 – 09:00',
  'Tỵ': '09:00 – 11:00',
  'Ngọ': '11:00 – 13:00',
  'Mùi': '13:00 – 15:00',
  'Thân': '15:00 – 17:00',
  'Dậu': '17:00 – 19:00',
  'Tuất': '19:00 – 21:00',
  'Hợi': '21:00 – 23:00',
};

// 28 chòm sao Nhị Thập Bát Tú
export const STARS_28 = [
  { name: 'Giác', animal: 'Giác Mộc Giao', element: 'Mộc', isGood: true, meaning: 'Chủ về thi cử đỗ đạt, học hành tiến bộ, công danh thăng tiến.' },
  { name: 'Cang', animal: 'Cang Kim Long', element: 'Kim', isGood: false, meaning: 'Bất lợi cho việc cưới hỏi, khởi công xây dựng; nên cẩn trọng.' },
  { name: 'Đê', animal: 'Đê Thổ Lạc', element: 'Thổ', isGood: false, meaning: 'Kỵ việc khai trương lớn, động thổ móng; nên dưỡng tâm tĩnh khí.' },
  { name: 'Phòng', animal: 'Phòng Nhật Thố', element: 'Hỏa', isGood: true, meaning: 'Đại cát cho giá thú, nhập trạch, cầu tài, vạn sự hanh thông.' },
  { name: 'Tâm', animal: 'Tâm Nguyệt Hồ', element: 'Hỏa', isGood: false, meaning: 'Nên tránh tranh tụng kiện cáo, tránh mạo hiểm làm việc lớn.' },
  { name: 'Vĩ', animal: 'Vĩ Hỏa Hổ', element: 'Hỏa', isGood: true, meaning: 'Rất tốt cho cưới hỏi, xuất hành, thăng quan nhậm chức, tạo tác.' },
  { name: 'Cơ', animal: 'Cơ Thủy Báo', element: 'Thủy', isGood: true, meaning: 'Cát tinh chủ về tài lộc, mở cửa hàng, giao thương buôn bán đại lợi.' },
  { name: 'Đẩu', animal: 'Đẩu Mộc Giải', element: 'Mộc', isGood: true, meaning: 'Tốt cho xây cất, gieo trồng, cưới hỏi, kết giao bạn hữu.' },
  { name: 'Ngưu', animal: 'Ngưu Kim Ngưu', element: 'Kim', isGood: false, meaning: 'Tránh khởi công kinh doanh hay xuất hành đi xa; nên cẩn mật.' },
  { name: 'Nữ', animal: 'Nữ Thổ Bức', element: 'Thổ', isGood: false, meaning: 'Bất lợi cho cưới hỏi, tranh chấp đất đai; cẩn phòng khẩu thiệt.' },
  { name: 'Hư', animal: 'Hư Nhật Thử', element: 'Hỏa', isGood: false, meaning: 'Kỵ khai trương, ký kết việc trọng đại; dễ gặp trắc trở dở dang.' },
  { name: 'Nguy', animal: 'Nguy Nguyệt Yến', element: 'Hỏa', isGood: false, meaning: 'Nên cẩn trọng đường sông nước và các việc leo trèo nguy hiểm.' },
  { name: 'Thất', animal: 'Thất Hỏa Trư', element: 'Hỏa', isGood: true, meaning: 'Đại cát tinh; hưng vượng gia đạo, tốt cho mở hiệu, cưới hỏi, nhập trạch.' },
  { name: 'Bích', animal: 'Bích Thủy Du', element: 'Thủy', isGood: true, meaning: 'Rất tốt cho hôn nhân, khởi nghiệp, xây cất, mọi sự tốt lành.' },
  { name: 'Khuê', animal: 'Khuê Mộc Lang', element: 'Mộc', isGood: false, meaning: 'Bất lợi cho khai trương, sửa chữa nhà cửa; giữ tâm an định.' },
  { name: 'Lâu', animal: 'Lâu Kim Cẩu', element: 'Kim', isGood: true, meaning: 'Tốt cho nhập trạch, hôn phối, phát triển điền sản nông nghiệp.' },
  { name: 'Vị', animal: 'Vị Thổ Trĩ', element: 'Thổ', isGood: true, meaning: 'Cát lợi cho kinh doanh, mua bán, tích sản, mở rộng quan hệ.' },
  { name: 'Mão', animal: 'Mão Nhật Kê', element: 'Hỏa', isGood: false, meaning: 'Tránh việc đại sự, cưới hỏi, dạm ngõ; nên làm việc thường nhật.' },
  { name: 'Tất', animal: 'Tất Nguyệt Ô', element: 'Hỏa', isGood: true, meaning: 'Tốt cho giá thú, làm từ thiện, tu sửa công trình phúc lợi.' },
  { name: 'Chủy', animal: 'Chủy Hỏa Hầu', element: 'Hỏa', isGood: false, meaning: 'Kỵ tranh chấp, ký kết hợp đồng tài chính mạo hiểm.' },
  { name: 'Sâm', animal: 'Sâm Thủy Viên', element: 'Thủy', isGood: true, meaning: 'Cát tinh cho xuất hành, khai trương, cầu tài lộc và nhậm chức.' },
  { name: 'Tỉnh', animal: 'Tỉnh Mộc Hãn', element: 'Mộc', isGood: true, meaning: 'Tốt cho việc xây dựng, thi cử, kết hôn, mở rộng kinh doanh.' },
  { name: 'Quỷ', animal: 'Quỷ Kim Dương', element: 'Kim', isGood: false, meaning: 'Kỵ cưới hỏi, tiệc tùng lãng phí; nên hướng thiện tích đức.' },
  { name: 'Liễu', animal: 'Liễu Thổ Chương', element: 'Thổ', isGood: false, meaning: 'Không nên bắt đầu việc mới, tránh đi xa xuất hành.' },
  { name: 'Tinh', animal: 'Tinh Nhật Mã', element: 'Hỏa', isGood: false, meaning: 'Bất lợi cho việc đại sự, cưới hỏi, dựng nhà.' },
  { name: 'Trương', animal: 'Trương Nguyệt Lộc', element: 'Hỏa', isGood: true, meaning: 'Đại cát cho kinh doanh, nhập học, khởi công, bồi đắp công danh.' },
  { name: 'Dực', animal: 'Dực Hỏa Xà', element: 'Hỏa', isGood: false, meaning: 'Kỵ ký hợp đồng lớn, khai trương cửa hiệu; nên chờ ngày tốt hơn.' },
  { name: 'Chẩn', animal: 'Chẩn Thủy Dẫn', element: 'Thủy', isGood: true, meaning: 'Cát lợi cho cưới hỏi, xuất hành, thăng tiến sự nghiệp, bình an.' }
];

export const CONFLICTING_BRANCHES: Record<string, string> = {
  'Tý': 'Ngọ', 'Sửu': 'Mùi', 'Dần': 'Thân', 'Mão': 'Dậu',
  'Thìn': 'Tuất', 'Tỵ': 'Hợi', 'Ngọ': 'Tý', 'Mùi': 'Sửu',
  'Thân': 'Dần', 'Dậu': 'Mão', 'Tuất': 'Thìn', 'Hợi': 'Tỵ',
};

export interface AuspiciousHour {
  branch: string;
  timeRange: string;
  star: string;
  isHoangDao: boolean;
}

export interface AlmanacDay {
  solarDate: string; // YYYY-MM-DD
  solarDay: number;
  solarMonth: number;
  solarYear: number;
  dayOfWeek: string;
  dayOfWeekShort: string;

  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
  isLeapMonth: boolean;
  lunarText: string; // "9/10"
  lunarFullText: string; // "Ngày 9 tháng 10 năm Bính Ngọ"

  canChiDay: string;
  canChiMonth: string;
  canChiYear: string;

  elementNapAm: string;
  element: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

  isHoangDao: boolean;
  hoangDaoStar: string;
  dayType: 'Hoàng Đạo' | 'Hắc Đạo';

  truc: {
    name: string;
    meaning: string;
    rating: 'cat' | 'binh' | 'hung';
  };

  sao28: {
    name: string;
    animal: string;
    element: string;
    isGood: boolean;
    meaning: string;
  };

  gioHoangDao: AuspiciousHour[];
  gioHacDao: AuspiciousHour[];

  tuoiXung: string[];
  goodActivities: string[];
  badActivities: string[];

  suitableFor: {
    khaiTruong: boolean;
    cuoiHoi: boolean;
    xuatHanh: boolean;
    dongTho: boolean;
    nhapTrach: boolean;
    giaoDich: boolean;
    cauTai: boolean;
  };
}

const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const WEEKDAYS_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function getJulianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export function getAlmanacDay(dateStr: string): AlmanacDay {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const dayOfWeekIndex = dateObj.getUTCDay();

  const lunar = solar2lunar(dateStr);
  const ganzhi = getHeavenlyStemAndEarthlyBranchBySolarDate(dateStr, 0);

  const canDay = STEM_VI[ganzhi.daily[0]] || ganzhi.daily[0];
  const chiDay = BRANCH_VI[ganzhi.daily[1]] || ganzhi.daily[1];
  const canMonth = STEM_VI[ganzhi.monthly[0]] || ganzhi.monthly[0];
  const chiMonth = BRANCH_VI[ganzhi.monthly[1]] || ganzhi.monthly[1];
  const canYear = STEM_VI[ganzhi.yearly[0]] || ganzhi.yearly[0];
  const chiYear = BRANCH_VI[ganzhi.yearly[1]] || ganzhi.yearly[1];

  const canChiDay = `${canDay} ${chiDay}`;
  const canChiMonth = `${canMonth} ${chiMonth}`;
  const canChiYear = `${canYear} ${chiYear}`;

  const napAmInfo = NAP_AM[canChiDay] || { name: 'Ngũ Hành', element: 'Thổ' as const };

  // Tính Trực
  const monthBranchIdx = BRANCH_ORDER.indexOf(chiMonth);
  const dayBranchIdx = BRANCH_ORDER.indexOf(chiDay);
  const trucOffset = (dayBranchIdx - monthBranchIdx + 12) % 12;
  const trucName = TRUC_NAMES[trucOffset] || 'Thành';
  const trucDetail = TRUC_DETAILS[trucName] || TRUC_DETAILS['Thành'];

  // Tính Hoàng Đạo / Hắc Đạo
  const thanhLongStart = MONTH_THANH_LONG_START[chiMonth] ?? 0;
  const starOffset = (dayBranchIdx - thanhLongStart + 12) % 12;
  const hoangDaoObj = HOANG_DAO_STARS[starOffset] || { name: 'Minh Đường', isHoang: true };

  // Giờ Hoàng Đạo
  const auspiciousList = GIO_HOANG_DAO_BY_DAY_BRANCH[chiDay] || [];
  const auspiciousBranchSet = new Set(auspiciousList.map((x) => x.branch));
  const gioHoangDao: AuspiciousHour[] = auspiciousList.map((item) => ({
    branch: item.branch,
    timeRange: HOUR_RANGES[item.branch] || '',
    star: item.star,
    isHoangDao: true,
  }));

  const gioHacDao: AuspiciousHour[] = BRANCH_ORDER.filter((b) => !auspiciousBranchSet.has(b)).map((b) => ({
    branch: b,
    timeRange: HOUR_RANGES[b] || '',
    star: 'Hắc Đạo',
    isHoangDao: false,
  }));

  // Nhị Thập Bát Tú (28 sao)
  const jdn = getJulianDay(y, m, d);
  const star28Idx = (jdn + 16) % 28;
  const sao28 = STARS_28[star28Idx] || STARS_28[0];

  // Tuổi xung
  const conflictBranch = CONFLICTING_BRANCHES[chiDay] || 'Sửu';
  const tuoiXung = [`Kỷ ${conflictBranch}`, `Quý ${conflictBranch}`, `Tân ${conflictBranch}`];

  // Đánh giá việc phù hợp (Suitable Activities)
  const isGoodDay = hoangDaoObj.isHoang;
  const isTrucGood = trucDetail.rating === 'cat';
  const isStarGood = sao28.isGood;

  // Tính việc phù hợp
  const suitableFor = {
    khaiTruong: (isGoodDay || isTrucGood) && ['Thành', 'Khai', 'Mãn'].includes(trucName) && trucName !== 'Phá' && trucName !== 'Bế',
    cuoiHoi: isGoodDay && ['Định', 'Thành'].includes(trucName) && isStarGood,
    xuatHanh: (isGoodDay || isTrucGood) && ['Khai', 'Kiến', 'Xuất', 'Thành'].includes(trucName) && trucName !== 'Phá',
    dongTho: isGoodDay && ['Chấp', 'Thành', 'Khai', 'Định'].includes(trucName) && trucName !== 'Phá' && trucName !== 'Bế',
    nhapTrach: (isGoodDay || isTrucGood) && ['Khai', 'Thành', 'Định'].includes(trucName) && trucName !== 'Bế',
    giaoDich: (isGoodDay || isTrucGood) && ['Mãn', 'Định', 'Thành', 'Thâu'].includes(trucName),
    cauTai: (isGoodDay || isTrucGood) && ['Thành', 'Mãn', 'Thâu'].includes(trucName),
  };

  const goodActivities = Array.from(new Set([...trucDetail.good, ...(sao28.isGood ? ['Cầu tài', 'Cầu phúc'] : [])]));
  const badActivities = Array.from(new Set([...trucDetail.bad, ...(!sao28.isGood ? ['Tránh việc mạo hiểm'] : [])]));

  return {
    solarDate: dateStr,
    solarDay: d,
    solarMonth: m,
    solarYear: y,
    dayOfWeek: WEEKDAYS[dayOfWeekIndex],
    dayOfWeekShort: WEEKDAYS_SHORT[dayOfWeekIndex],
    lunarDay: lunar.lunarDay,
    lunarMonth: lunar.lunarMonth,
    lunarYear: lunar.lunarYear,
    isLeapMonth: lunar.isLeap,
    lunarText: `${lunar.lunarDay}/${lunar.lunarMonth}`,
    lunarFullText: `Ngày ${lunar.lunarDay} tháng ${lunar.lunarMonth}${lunar.isLeap ? ' (nhuận)' : ''} năm ${canChiYear}`,
    canChiDay,
    canChiMonth,
    canChiYear,
    elementNapAm: napAmInfo.name,
    element: napAmInfo.element,
    isHoangDao: hoangDaoObj.isHoang,
    hoangDaoStar: hoangDaoObj.name,
    dayType: hoangDaoObj.isHoang ? 'Hoàng Đạo' : 'Hắc Đạo',
    truc: {
      name: trucName,
      meaning: trucDetail.meaning,
      rating: trucDetail.rating,
    },
    sao28: {
      name: sao28.name,
      animal: sao28.animal,
      element: sao28.element,
      isGood: sao28.isGood,
      meaning: sao28.meaning,
    },
    gioHoangDao,
    gioHacDao,
    tuoiXung,
    goodActivities,
    badActivities,
    suitableFor,
  };
}

export function getAlmanacMonth(year: number, month: number): AlmanacDay[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const list: AlmanacDay[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    list.push(getAlmanacDay(dateStr));
  }
  return list;
}
