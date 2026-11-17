import { NAP_AM } from '@/lib/almanac';

export type Gender = 'nam' | 'nu';
export type Purpose = 'hon-nhan' | 'lam-an';

export interface PersonInput {
  name: string;
  gender: Gender;
  year: number;
  month: number;
  day: number;
  hour: string; // e.g. "Tý (23h-01h)"
}

export interface CompatibilityAspect {
  title: string;
  score: number;
  maxScore: number;
  p1Value: string;
  p2Value: string;
  relationship: string;
  description: string;
  isFavorable: boolean;
}

export interface CompatibilityResult {
  p1: PersonInput & { canChi: string; element: string; napAm: string; quai: string };
  p2: PersonInput & { canChi: string; element: string; napAm: string; quai: string };
  purpose: Purpose;
  totalScore: number;
  ratingTier: 'Đại Cát' | 'Cát Lợi' | 'Bình Hòa' | 'Thách Thức';
  title: string;
  generalVerdict: string;
  aspects: CompatibilityAspect[];
  highlights: string[];
  challenges: string[];
  remedies: string[];
}

const STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const BRANCHES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

export function getCanChiYear(year: number): { can: string; chi: string; full: string } {
  const canIdx = (year - 4) % 10;
  const chiIdx = (year - 4) % 12;
  const can = STEMS[canIdx < 0 ? canIdx + 10 : canIdx];
  const chi = BRANCHES[chiIdx < 0 ? chiIdx + 12 : chiIdx];
  return { can, chi, full: `${can} ${chi}` };
}

// Bát Quái Cung Phi
const GUA_NAMES = ['', 'Khảm (Thủy)', 'Khôn (Thổ)', 'Chấn (Mộc)', 'Tốn (Mộc)', '', 'Càn (Kim)', 'Đoài (Kim)', 'Cấn (Thổ)', 'Ly (Hỏa)'];

export function getCungPhi(year: number, gender: Gender): { id: number; name: string } {
  const sumDigits = (n: number): number => {
    let s = 0;
    while (n > 0) {
      s += n % 10;
      n = Math.floor(n / 10);
    }
    return s >= 10 ? sumDigits(s) : s;
  };

  const remainder = sumDigits(year);
  let guaId: number;

  if (gender === 'nam') {
    guaId = (11 - remainder) % 9;
    if (guaId === 0) guaId = 9;
    if (guaId === 5) guaId = 2; // Nam 5 quy về Khôn 2
  } else {
    guaId = (4 + remainder) % 9;
    if (guaId === 0) guaId = 9;
    if (guaId === 5) guaId = 8; // Nữ 5 quy về Cấn 8
  }

  return { id: guaId, name: GUA_NAMES[guaId] || 'Khôn (Thổ)' };
}

const DU_NIEN_MAP: Record<string, { name: string; score: number; type: 'tot' | 'xau' | 'binh'; desc: string }> = {
  // Sinh Khí (+25)
  '1-4': { name: 'Sinh Khí', score: 25, type: 'tot', desc: 'Đại Cát · Sinh sôi nảy nở, tài lộc dồi dào, sinh lực tràn trề và sự nghiệp thăng hoa.' },
  '4-1': { name: 'Sinh Khí', score: 25, type: 'tot', desc: 'Đại Cát · Sinh sôi nảy nở, tài lộc dồi dào, sinh lực tràn trề và sự nghiệp thăng hoa.' },
  '3-9': { name: 'Sinh Khí', score: 25, type: 'tot', desc: 'Đại Cát · Tương trợ vượng khí, tài danh rực rỡ và gia đạo hưng thịnh.' },
  '9-3': { name: 'Sinh Khí', score: 25, type: 'tot', desc: 'Đại Cát · Tương trợ vượng khí, tài danh rực rỡ và gia đạo hưng thịnh.' },
  '8-2': { name: 'Sinh Khí', score: 25, type: 'tot', desc: 'Đại Cát · Điền sản bội thu, bền vững lâu dài, phúc đức dồi dào.' },
  '2-8': { name: 'Sinh Khí', score: 25, type: 'tot', desc: 'Đại Cát · Điền sản bội thu, bền vững lâu dài, phúc đức dồi dào.' },
  '6-7': { name: 'Sinh Khí', score: 25, type: 'tot', desc: 'Đại Cát · Đồng lòng đại thắng, công việc kinh doanh mở rộng không ngừng.' },
  '7-6': { name: 'Sinh Khí', score: 25, type: 'tot', desc: 'Đại Cát · Đồng lòng đại thắng, công việc kinh doanh mở rộng không ngừng.' },

  // Diên Niên / Phúc Đức (+22)
  '1-9': { name: 'Diên Niên', score: 22, type: 'tot', desc: 'Thượng Cát · Tình cảm thủy chung son sắt, tuổi thọ an khang, các mối quan hệ êm ấm.' },
  '9-1': { name: 'Diên Niên', score: 22, type: 'tot', desc: 'Thượng Cát · Tình cảm thủy chung son sắt, tuổi thọ an khang, các mối quan hệ êm ấm.' },
  '3-4': { name: 'Diên Niên', score: 22, type: 'tot', desc: 'Thượng Cát · Thuận hòa như ý, tương trợ gia đạo vững chắc trăm năm.' },
  '4-3': { name: 'Diên Niên', score: 22, type: 'tot', desc: 'Thượng Cát · Thuận hòa như ý, tương trợ gia đạo vững chắc trăm năm.' },
  '6-2': { name: 'Diên Niên', score: 22, type: 'tot', desc: 'Thượng Cát · Bền chặt sắt son, cùng đồng lòng dựng xây cơ đồ.' },
  '2-6': { name: 'Diên Niên', score: 22, type: 'tot', desc: 'Thượng Cát · Bền chặt sắt son, cùng đồng lòng dựng xây cơ đồ.' },
  '8-7': { name: 'Diên Niên', score: 22, type: 'tot', desc: 'Thượng Cát · Hài hòa phong thủy, gia đình hạnh phúc ấm no.' },
  '7-8': { name: 'Diên Niên', score: 22, type: 'tot', desc: 'Thượng Cát · Hài hòa phong thủy, gia đình hạnh phúc ấm no.' },

  // Thiên Y (+20)
  '1-3': { name: 'Thiên Y', score: 20, type: 'tot', desc: 'Trung Cát · Sức khỏe dẻo dai, quý nhân phù trợ lúc ngặt nghèo, tài lộc ổn định.' },
  '3-1': { name: 'Thiên Y', score: 20, type: 'tot', desc: 'Trung Cát · Sức khỏe dẻo dai, quý nhân phù trợ lúc ngặt nghèo, tài lộc ổn định.' },
  '4-9': { name: 'Thiên Y', score: 20, type: 'tot', desc: 'Trung Cát · Tiêu trừ tai ách, gặp hung hóa cát, tinh thần phấn chấn.' },
  '9-4': { name: 'Thiên Y', score: 20, type: 'tot', desc: 'Trung Cát · Tiêu trừ tai ách, gặp hung hóa cát, tinh thần phấn chấn.' },
  '6-8': { name: 'Thiên Y', score: 20, type: 'tot', desc: 'Trung Cát · Bác ái nhân từ, giàu sang trường thọ, con cái thành đạt.' },
  '8-6': { name: 'Thiên Y', score: 20, type: 'tot', desc: 'Trung Cát · Bác ái nhân từ, giàu sang trường thọ, con cái thành đạt.' },
  '2-7': { name: 'Thiên Y', score: 20, type: 'tot', desc: 'Trung Cát · Hòa khí sinh tài, gặp nạn có người nâng đỡ.' },
  '7-2': { name: 'Thiên Y', score: 20, type: 'tot', desc: 'Trung Cát · Hòa khí sinh tài, gặp nạn có người nâng đỡ.' },

  // Phục Vị (+18)
  'same': { name: 'Phục Vị', score: 18, type: 'binh', desc: 'Bình Cát · Bình yên, gắn bó thâm sâu, củng cố sức mạnh tinh thần cho nhau.' },

  // Hung du niên
  '1-2': { name: 'Tuyệt Mệnh', score: 5, type: 'xau', desc: 'Hung Hạn · Khí trường bất đồng, dễ phát sinh trở ngại, cần lấy đức và hòa khí để hóa giải.' },
  '2-1': { name: 'Tuyệt Mệnh', score: 5, type: 'xau', desc: 'Hung Hạn · Khí trường bất đồng, dễ phát sinh trở ngại, cần lấy đức và hòa khí để hóa giải.' },
  '3-7': { name: 'Tuyệt Mệnh', score: 5, type: 'xau', desc: 'Hung Hạn · Khác biệt quan điểm, cần nhẫn nại lắng nghe và phân định rõ ràng.' },
  '7-3': { name: 'Tuyệt Mệnh', score: 5, type: 'xau', desc: 'Hung Hạn · Khác biệt quan điểm, cần nhẫn nại lắng nghe và phân định rõ ràng.' },
  '4-8': { name: 'Tuyệt Mệnh', score: 5, type: 'xau', desc: 'Hung Hạn · Nên chọn hướng nhà hoặc năm sinh con trung gian để hóa giải.' },
  '8-4': { name: 'Tuyệt Mệnh', score: 5, type: 'xau', desc: 'Hung Hạn · Nên chọn hướng nhà hoặc năm sinh con trung gian để hóa giải.' },
  '6-9': { name: 'Tuyệt Mệnh', score: 5, type: 'xau', desc: 'Hung Hạn · Lửa trời nung kim loại, cần dưỡng thủy để làm mát khí vận.' },
  '9-6': { name: 'Tuyệt Mệnh', score: 5, type: 'xau', desc: 'Hung Hạn · Lửa trời nung kim loại, cần dưỡng thủy để làm mát khí vận.' },
};

export function analyzeCompatibility(p1: PersonInput, p2: PersonInput, purpose: Purpose = 'hon-nhan'): CompatibilityResult {
  const cc1 = getCanChiYear(p1.year);
  const cc2 = getCanChiYear(p2.year);

  const napAm1 = NAP_AM[cc1.full] || { name: 'Bản Mệnh', element: 'Kim' as const };
  const napAm2 = NAP_AM[cc2.full] || { name: 'Bản Mệnh', element: 'Thủy' as const };

  const gua1 = getCungPhi(p1.year, p1.gender);
  const gua2 = getCungPhi(p2.year, p2.gender);

  const aspects: CompatibilityAspect[] = [];

  // 1. Ngũ Hành Nạp Âm Bản Mệnh (Thang 25)
  const el1 = napAm1.element;
  const el2 = napAm2.element;

  const SINH: Record<string, string> = { 'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
  const KHAC: Record<string, string> = { 'Hỏa': 'Kim', 'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa' };

  let napAmScore = 15;
  let napAmRel = 'Bình Hòa';
  let napAmDesc = `Hai mệnh cùng mang tính chất bình ổn, không tương sinh nhưng cũng không khắc hại, dung hòa tự nhiên.`;
  let napAmFavorable = true;

  if (SINH[el1] === el2) {
    napAmScore = 25;
    napAmRel = `${el1} sinh ${el2} (Tương Sinh Tuyệt Hảo)`;
    napAmDesc = `${p1.name || 'Người thứ nhất'} (${el1}) sinh dưỡng, nâng đỡ trợ lực cho ${p2.name || 'Người thứ hai'} (${el2}), làm ăn hanh thông, gia đạo thuận hòa.`;
  } else if (SINH[el2] === el1) {
    napAmScore = 24;
    napAmRel = `${el2} sinh ${el1} (Tương Sinh Đắc Lợi)`;
    napAmDesc = `${p2.name || 'Người thứ hai'} (${el2}) là điểm tựa vững chắc, bồi bổ nguyên khí cho ${p1.name || 'Người thứ nhất'} (${el1}).`;
  } else if (el1 === el2) {
    napAmScore = 20;
    napAmRel = `${el1} cùng ${el2} (Đồng Hành Tương Trợ)`;
    napAmDesc = `Hai người cùng thuộc hành ${el1}, có nhiều nét tính cách tương đồng, dễ đồng cảm và thấu hiểu nhau.`;
  } else if (KHAC[el1] === el2) {
    napAmScore = 10;
    napAmRel = `${el1} khắc ${el2} (Tương Khắc Cần Tiết Chế)`;
    napAmDesc = `${el1} khắc chế ${el2}. Trong giao tiếp dễ lấn lướt ý kiến đối phương, cần kiềm chế cái tôi và lấy tình nghĩa làm trọng.`;
    napAmFavorable = false;
  } else if (KHAC[el2] === el1) {
    napAmScore = 10;
    napAmRel = `${el2} khắc ${el1} (Tương Khắc Cần Nhường Nhịn)`;
    napAmDesc = `${el2} khắc ${el1}. Cần người thứ ba hoặc vật phẩm phong thủy làm cầu nối tương sinh để chuyển hóa xung lực.`;
    napAmFavorable = false;
  }

  aspects.push({
    title: 'Ngũ Hành Nạp Âm Bản Mệnh',
    score: napAmScore,
    maxScore: 25,
    p1Value: `${napAm1.name} (${el1})`,
    p2Value: `${napAm2.name} (${el2})`,
    relationship: napAmRel,
    description: napAmDesc,
    isFavorable: napAmFavorable,
  });

  // 2. Thiên Can & Địa Chi (Thang 25)
  // Can Hợp: Giáp-Kỷ, Ất-Canh, Bính-Tân, Đinh-Nhâm, Mậu-Quý
  const CAN_HOP: Record<string, string> = { 'Giáp': 'Kỷ', 'Kỷ': 'Giáp', 'Ất': 'Canh', 'Canh': 'Ất', 'Bính': 'Tân', 'Tân': 'Bính', 'Đinh': 'Nhâm', 'Nhâm': 'Đinh', 'Mậu': 'Quý', 'Quý': 'Mậu' };
  const canIsHop = CAN_HOP[cc1.can] === cc2.can;

  // Chi Tam Hợp
  const TAM_HOP = [
    new Set(['Thân', 'Tý', 'Thìn']),
    new Set(['Dần', 'Ngọ', 'Tuất']),
    new Set(['Tỵ', 'Dậu', 'Sửu']),
    new Set(['Hợi', 'Mão', 'Mùi']),
  ];
  const chiIsTamHop = TAM_HOP.some((set) => set.has(cc1.chi) && set.has(cc2.chi));

  // Chi Lục Hợp
  const LUC_HOP: Record<string, string> = { 'Tý': 'Sửu', 'Sửu': 'Tý', 'Dần': 'Hợi', 'Hợi': 'Dần', 'Mão': 'Tuất', 'Tuất': 'Mão', 'Thìn': 'Dậu', 'Dậu': 'Thìn', 'Tỵ': 'Thân', 'Thân': 'Tỵ', 'Ngọ': 'Mùi', 'Mùi': 'Ngọ' };
  const chiIsLucHop = LUC_HOP[cc1.chi] === cc2.chi;

  // Chi Lục Xung
  const LUC_XUNG: Record<string, string> = { 'Tý': 'Ngọ', 'Ngọ': 'Tý', 'Sửu': 'Mùi', 'Mùi': 'Sửu', 'Dần': 'Thân', 'Thân': 'Dần', 'Mão': 'Dậu', 'Dậu': 'Mão', 'Thìn': 'Tuất', 'Tuất': 'Thìn', 'Tỵ': 'Hợi', 'Hợi': 'Tỵ' };
  const chiIsLucXung = LUC_XUNG[cc1.chi] === cc2.chi;

  let canChiScore = 15;
  let canChiRel = 'Bình Hòa Tương Phù';
  let canChiDesc = 'Thiên Can và Địa Chi ở mức hài hòa, không xung phá nhưng cần sự thấu cảm trong các quyết định chung.';
  let canChiFavorable = true;

  if (canIsHop && (chiIsTamHop || chiIsLucHop)) {
    canChiScore = 25;
    canChiRel = 'Thiên Can Hợp Hóa · Địa Chi Tam Hợp (Đại Cát)';
    canChiDesc = `Can ${cc1.can} hợp ${cc2.can}, Chi ${cc1.chi} kết hợp ${cc2.chi} tạo nên thế tương hòa toàn bích, vạn sự thuận buồm xuôi gió.`;
  } else if (chiIsTamHop || chiIsLucHop) {
    canChiScore = 22;
    canChiRel = chiIsTamHop ? 'Địa Chi Tam Hợp (Cát Lợi)' : 'Địa Chi Lục Hợp (Thượng Cát)';
    canChiDesc = `Địa chi hai tuổi thuộc vòng tam hợp / lục hợp, hỗ trợ nhau rất mạnh về vận thế và ý chí lập nghiệp.`;
  } else if (canIsHop) {
    canChiScore = 20;
    canChiRel = 'Thiên Can Ngũ Hợp (Cát)';
    canChiDesc = `Trời trao duyên lành, tư tưởng và định hướng cuộc sống đồng điệu, dễ thống nhất quan điểm.`;
  } else if (chiIsLucXung) {
    canChiScore = 8;
    canChiRel = 'Địa Chi Tương Xung (Cần Hóa Giải)';
    canChiDesc = `Hai chi nằm trong thế lục xung (${cc1.chi} - ${cc2.chi}). Dễ xảy ra tranh luận hoặc bất đồng quan điểm, cần nhẫn nại.`;
    canChiFavorable = false;
  }

  aspects.push({
    title: 'Thiên Can & Địa Chi Năm Sinh',
    score: canChiScore,
    maxScore: 25,
    p1Value: cc1.full,
    p2Value: cc2.full,
    relationship: canChiRel,
    description: canChiDesc,
    isFavorable: canChiFavorable,
  });

  // 3. Cung Phi Bát Trạch (Thang 25)
  const pairKey = gua1.id === gua2.id ? 'same' : `${gua1.id}-${gua2.id}`;
  const duNien = DU_NIEN_MAP[pairKey] || {
    name: 'Phục Vị',
    score: 18,
    type: 'binh',
    desc: 'Bát Quái hòa hợp, khí trường ổn định giúp cả hai cảm thấy an toàn và thoải mái bên nhau.',
  };

  aspects.push({
    title: 'Cung Phi Bát Trạch (Quái Mệnh)',
    score: duNien.score,
    maxScore: 25,
    p1Value: gua1.name,
    p2Value: gua2.name,
    relationship: duNien.name,
    description: duNien.desc,
    isFavorable: duNien.type === 'tot' || duNien.type === 'binh',
  });

  // 4. Tử Vi & Cung Vị Tương Tác (Thang 25)
  let tuviScore = 18;
  let tuviRel = 'Âm Dương Hòa Hợp · Tính Cách Bổ Trợ';
  let tuviDesc = 'Hai người có tố chất bổ khuyết cho nhau: một người linh hoạt nhìn xa trông rộng, một người cẩn trọng vững vàng.';

  if (napAmScore >= 20 && canChiScore >= 20) {
    tuviScore = 24;
    tuviRel = 'Cương Nhu Tương Tế · Hợp Lực Đại Thành';
    tuviDesc = 'Tố chất bản mệnh và cung số của đôi bên phối hợp tuyệt hảo, người này mở lối, người kia gìn giữ nền tảng.';
  } else if (napAmScore < 15 || canChiScore < 15) {
    tuviScore = 14;
    tuviRel = 'Cần Điều Hòa Cái Tôi · Lắng Nghe Nhường Nhịn';
    tuviDesc = 'Mỗi người đều có cá tính rất mạnh, nếu cùng bảo thủ sẽ dễ va chạm. Cần phân định rõ ai nắm chính từng lĩnh vực.';
  }

  aspects.push({
    title: purpose === 'hon-nhan' ? 'Tử Vi Cung Mệnh & Phu Thê' : 'Tử Vi Hợp Tác & Nô Bộc',
    score: tuviScore,
    maxScore: 25,
    p1Value: `${p1.gender === 'nam' ? 'Nam' : 'Nữ'} sinh năm ${p1.year}`,
    p2Value: `${p2.gender === 'nam' ? 'Nam' : 'Nữ'} sinh năm ${p2.year}`,
    relationship: tuviRel,
    description: tuviDesc,
    isFavorable: tuviScore >= 16,
  });

  // Tổng điểm
  const totalScore = napAmScore + canChiScore + duNien.score + tuviScore;

  let ratingTier: CompatibilityResult['ratingTier'] = 'Bình Hòa';
  let title = 'Hai tuổi tương hợp mức độ trung bình';
  let generalVerdict = '';

  if (totalScore >= 85) {
    ratingTier = 'Đại Cát';
    title = purpose === 'hon-nhan' ? 'Duyên Trời Tác Hợp · Trăm Năm Hạnh Phúc' : 'Đối Tác Vàng · Hợp Lực Đại Thành';
    generalVerdict = `Điểm số tương hợp đạt ${totalScore}/100. Đây là sự kết hợp tuyệt hảo cả về ngũ hành bản mệnh lẫn thiên can địa chi. ${
      purpose === 'hon-nhan'
        ? 'Vợ chồng yêu thương gắn kết, cùng chung chí hướng, gia đạo hưng vượng tài lộc dồi dào.'
        : 'Hai bên tin cậy tuyệt đối, bù đắp tài năng cho nhau, kinh doanh buôn bán ắt thu gặt nhiều thắng lợi lớn.'
    }`;
  } else if (totalScore >= 70) {
    ratingTier = 'Cát Lợi';
    title = purpose === 'hon-nhan' ? 'Lương Duyên Cát Lợi · Tương Trợ Đắc Đức' : 'Cộng Sự Ăn Ý · Đồng Tâm Phát Triển';
    generalVerdict = `Điểm số tương hợp đạt ${totalScore}/100. Khí trường đôi bên dung hòa rất tốt, điểm tương sinh chiếm ưu thế. ${
      purpose === 'hon-nhan'
        ? 'Chỉ cần giữ được sự tôn trọng và chia sẻ cởi mở thì hôn nhân ngày càng viên mãn.'
        : 'Hợp tác làm ăn suôn sẻ, phân minh rành mạch trong công việc sẽ tạo đà bứt phá vững chắc.'
    }`;
  } else if (totalScore >= 55) {
    ratingTier = 'Bình Hòa';
    title = 'Duyên Phận Cần Vun Đắp · Lấy Nghĩa Làm Trọng';
    generalVerdict = `Điểm số tương hợp đạt ${totalScore}/100. Có điểm hợp và có điểm khắc bù trừ lẫn nhau. Đôi bên cần học cách lắng nghe, nhường nhịn và không nên áp đặt suy nghĩ của mình lên đối phương.`;
  } else {
    ratingTier = 'Thách Thức';
    title = 'Nhiều Khác Biệt Khí Vận · Cần Hóa Giải Để Bền Lâu';
    generalVerdict = `Điểm số tương hợp đạt ${totalScore}/100. Sự kết hợp này mang nhiều điểm xung khắc về nạp âm hoặc địa chi. Cần vận dụng phong thủy trung hòa và giữ tâm đức rộng mở để chuyển nguy thành an.`;
  }

  // Điểm sáng & Thách thức
  const highlights = aspects.filter((a) => a.isFavorable).map((a) => `${a.title}: ${a.relationship} (+${a.score}đ)`);
  const challenges = aspects.filter((a) => !a.isFavorable).map((a) => `${a.title}: ${a.relationship} - ${a.description}`);

  // Phương pháp hóa giải
  const remedies: string[] = [
    'Tâm niệm "Đức năng thắng số": Sự nhường nhịn, tôn trọng và đồng lòng là chìa khóa hóa giải mọi xung khắc số mệnh.',
  ];

  if (purpose === 'hon-nhan') {
    remedies.push(
      'Chọn năm sinh con đóng vai trò ngũ hành trung gian (Ví dụ: Chồng Mộc vợ Kim thì sinh con mệnh Thủy để Kim sinh Thủy, Thủy sinh Mộc).'
    );
    remedies.push(
      'Bố trí hướng phòng ngủ và ban thờ gia tiên theo cung Sinh Khí hoặc Diên Niên của người chủ gia đình để kích hoạt cát khí.'
    );
  } else {
    remedies.push(
      'Phân định rõ ràng bằng văn bản và hợp đồng về vai trò, trách nhiệm và tỷ lệ phân chia lợi nhuận trước khi bắt đầu.'
    );
    remedies.push(
      'Bố trí bàn làm việc quay về hướng tương sinh, có thể mời thêm cộng sự mệnh trung gian để điều hòa khí vận văn phòng.'
    );
  }

  return {
    p1: { ...p1, canChi: cc1.full, element: el1, napAm: napAm1.name, quai: gua1.name },
    p2: { ...p2, canChi: cc2.full, element: el2, napAm: napAm2.name, quai: gua2.name },
    purpose,
    totalScore,
    ratingTier,
    title,
    generalVerdict,
    aspects,
    highlights,
    challenges,
    remedies,
  };
}
