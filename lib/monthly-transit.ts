import type { ChartView, PalaceView } from '@/lib/tuvi';

export type MonthlyRating = 'Đại Cát' | 'Cát Lợi' | 'Bình Hòa' | 'Cẩn Trọng';

export interface MonthlyTransit {
  month: number; // 1..12
  monthLabel: string;
  lunarName: string; // e.g. "Tháng Giêng (Bính Dần)"
  canChi: string;
  palaceBranch: string;
  palaceName: string;
  rating: MonthlyRating;
  focusArea: string;
  majorStars: string[];
  auspiciousStars: string[];
  warningStars: string[];
  summary: string;
  actionAdvice: string;
}

const MONTH_BRANCHES = ['Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu'];
const STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

// Ngũ hổ độn khởi tháng Giêng theo can năm
const FIRST_MONTH_STEM_INDEX: Record<number, number> = {
  4: 2, // Giáp -> Bính (index 2)
  9: 2, // Kỷ -> Bính
  5: 4, // Ất -> Mậu (index 4)
  0: 4, // Canh -> Mậu
  6: 6, // Bính -> Canh (index 6)
  1: 6, // Tân -> Canh
  7: 8, // Đinh -> Nhâm (index 8)
  2: 8, // Nhâm -> Nhâm
  8: 0, // Mậu -> Giáp (index 0)
  3: 0, // Quý -> Giáp
};

const AUSPICIOUS_STAR_NAMES = new Set([
  'Tử Vi', 'Thiên Phủ', 'Thái Dương', 'Thái Âm', 'Vũ Khúc', 'Thiên Lương', 'Thiên Cơ', 'Thiên Tướng',
  'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Lộc Tồn', 'Tả Phụ', 'Hữu Bật', 'Thiên Khôi', 'Thiên Việt',
  'Văn Xương', 'Văn Khúc', 'Thiên Mã', 'Hồng Loan', 'Đào Hoa'
]);

const WARNING_STAR_NAMES = new Set([
  'Hóa Kỵ', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp',
  'Thiên Khốc', 'Thiên Hư', 'Tang Môn', 'Bạch Hổ', 'Đại Hao', 'Tiểu Hao'
]);

export function calculateMonthlyTransits(chart: ChartView): MonthlyTransit[] {
  const year = chart.year || new Date().getFullYear();
  const yearStemRemainder = year % 10;
  const startStemIdx = FIRST_MONTH_STEM_INDEX[yearStemRemainder] ?? 2;

  const result: MonthlyTransit[] = [];

  for (let m = 1; m <= 12; m++) {
    const branch = MONTH_BRANCHES[m - 1];
    const stem = STEMS[(startStemIdx + m - 1) % 10];
    const canChi = `${stem} ${branch}`;

    // Tìm cung trên lá số tương ứng với chi của tháng
    const palace = chart.palaces.find((p) => p.branch === branch);
    const palaceName = palace ? palace.name : `Cung ${branch}`;

    const majorStars = palace ? palace.major.map((s) => s.name) : [];
    const minorNames = palace ? palace.minor.map((s) => s.name) : [];
    const allStars = [...majorStars, ...minorNames];

    const auspiciousStars = allStars.filter((s) => AUSPICIOUS_STAR_NAMES.has(s));
    const warningStars = allStars.filter((s) => WARNING_STAR_NAMES.has(s));

    // Đánh giá cát hung
    let rating: MonthlyRating = 'Bình Hòa';
    if (auspiciousStars.length >= 3 && warningStars.length <= 1) {
      rating = 'Đại Cát';
    } else if (auspiciousStars.length >= 2 && warningStars.length <= 2) {
      rating = 'Cát Lợi';
    } else if (warningStars.length >= 3) {
      rating = 'Cẩn Trọng';
    } else if (warningStars.length >= 2 && auspiciousStars.length === 0) {
      rating = 'Cẩn Trọng';
    }

    // Xác định trọng tâm theo cung vị
    let focusArea = 'Công danh & Sự nghiệp';
    let summary = '';
    let actionAdvice = '';

    const monthLabel = m === 1 ? 'Tháng Giêng' : m === 12 ? 'Tháng Chạp' : `Tháng ${m}`;
    const lunarName = `${monthLabel} (${canChi})`;

    if (palaceName.includes('Mệnh') || palaceName.includes('Thân')) {
      focusArea = 'Bản mệnh & Định hướng';
      summary = `Vận khí chiếu trực tiếp về bản cung. Tháng này năng lượng hành động dồi dào, tâm thế sẵn sàng cho các quyết định then chốt.`;
      actionAdvice = rating === 'Cẩn Trọng' 
        ? 'Giữ tâm bình khí hòa, tránh bốc đồng nóng vội gây tổn hại uy tín cá nhân.' 
        : 'Chủ động nắm bắt cơ hội, khai mở các kế hoạch cá nhân đã ấp ủ từ trước.';
    } else if (palaceName.includes('Tài Bạch')) {
      focusArea = 'Tài lộc & Tiền bạc';
      summary = `Dòng tiền và các nguồn thu chi sôi động. Cơ hội tích lũy hoặc mở rộng nguồn thu từ kinh doanh, đầu tư.`;
      actionAdvice = rating === 'Cẩn Trọng'
        ? 'Đề phòng hao tài tốn của, siết chặt chi tiêu và hạn chế cho vay mượn mạo hiểm.'
        : 'Thích hợp thương lượng tài chính, ký kết giao thương hoặc thu hồi công nợ.';
    } else if (palaceName.includes('Quan Lộc')) {
      focusArea = 'Công danh & Sự nghiệp';
      summary = `Công việc chuyển biến rõ nét, được cấp trên để mắt hoặc có bước tiến triển trong dự án quan trọng.`;
      actionAdvice = rating === 'Cẩn Trọng'
        ? 'Tập trung hoàn thành tốt nhiệm vụ chuyên môn, cẩn trọng giấy tờ sổ sách tránh sai sót.'
        : 'Tự tin đề xuất ý tưởng mới, mở rộng phạm vi phụ trách để khẳng định năng lực.';
    } else if (palaceName.includes('Phu Thê')) {
      focusArea = 'Tình duyên & Hôn nhân';
      summary = `Phương diện tình cảm là điểm sáng hoặc cần nhiều sự thấu cảm, gắn kết giữa đôi bên.`;
      actionAdvice = rating === 'Cẩn Trọng'
        ? 'Dành thời gian lắng nghe bạn đời, tránh tranh cãi chuyện nhỏ nhặt gây rạn nứt.'
        : 'Thời điểm lý tưởng hâm nóng tình cảm hoặc bàn tính chuyện trọng đại hôn nhân.';
    } else if (palaceName.includes('Thiên Di')) {
      focusArea = 'Xuất hành & Đối ngoại';
      summary = `Tháng có nhiều dịp dịch chuyển, công tác xa hoặc thiết lập các mối quan hệ giao tế bên ngoài.`;
      actionAdvice = rating === 'Cẩn Trọng'
        ? 'Khi ra đường chú ý xe cộ, đi xa cần kiểm tra kỹ phương tiện và kế hoạch trình.'
        : 'Tích cực gặp gỡ đối tác ngoại giao, mạng lưới quan hệ mở rộng mang lại cơ hội tốt.';
    } else if (palaceName.includes('Điền Trạch')) {
      focusArea = 'Nhà cửa & Tích lũy';
      summary = `Liên quan đến gia cư, sửa sang nhà cửa, nơi ở hoặc các giao dịch tài sản tích lũy dài hạn.`;
      actionAdvice = rating === 'Cẩn Trọng'
        ? 'Kiểm tra an toàn nơi ở, cẩn trọng hỏa hoạn hoặc thủ tục pháp lý bất động sản.'
        : 'Thích hợp trang hoàng tổ ấm, củng cố nền tảng gia đạo và nơi làm việc.';
    } else if (palaceName.includes('Tật Ách')) {
      focusArea = 'Sức khỏe & Bình an';
      summary = `Cơ thể phát tín hiệu cần được chăm sóc, nghỉ ngơi điều độ sau chuỗi ngày làm việc căng thẳng.`;
      actionAdvice = 'Duy trì chế độ sinh hoạt lành mạnh, khám sức khỏe định kỳ và giải tỏa áp lực tâm lý.';
    } else if (palaceName.includes('Nô Bộc') || palaceName.includes('Huynh Đệ')) {
      focusArea = 'Bạn bè & Đồng nghiệp';
      summary = `Các mối quan hệ tương hỗ xã hội diễn ra nhộn nhịp, có người trợ lực hoặc đồng hành.`;
      actionAdvice = rating === 'Cẩn Trọng'
        ? 'Chọn bạn mà chơi, cẩn trọng thị phi bằng mặt không bằng lòng sau lưng.'
        : 'Tận dụng sức mạnh tập thể và sự hỗ trợ chân thành từ các cộng sự đáng tin.';
    } else if (palaceName.includes('Phúc Đức')) {
      focusArea = 'Tâm trí & Quý nhân';
      summary = `Được tổ tiên che chở, tâm tư thanh thản, trực giác nhạy bén dẫn dắt đi đúng hướng.`;
      actionAdvice = 'Làm việc thiện tích phúc, hướng về cội nguồn và giữ tinh thần an lạc, hướng thiện.';
    } else {
      focusArea = 'Gia đạo & Con cái';
      summary = `Không khí gia đình ấm cúng, có tin vui từ người thân hoặc con cái trong nhà.`;
      actionAdvice = 'Dành thời gian chăm sóc con cái và gắn kết tình cảm giữa các thế hệ.';
    }

    result.push({
      month: m,
      monthLabel,
      lunarName,
      canChi,
      palaceBranch: branch,
      palaceName,
      rating,
      focusArea,
      majorStars,
      auspiciousStars,
      warningStars,
      summary,
      actionAdvice,
    });
  }

  return result;
}
