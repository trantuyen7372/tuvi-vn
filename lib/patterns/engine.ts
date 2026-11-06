/**
 * 紫微斗数格局识别（v2 严格化版本）
 *
 * 设计原则：
 * 1. 古书条件优先：每个格局列出"必须 / 加分 / 破格"三层结构，出处可考
 * 2. 倪师立场：不使用宫干自化、大限四化、来因宫等飞星派工具
 * 3. 庙旺利陷：用 brightness 字段（bright=庙旺、normal=平、dim=陷）
 * 4. 三方四正会照：命宫 + 财帛 + 官禄 + 迁移
 * 5. 夹宫：命宫前后两宫
 *
 * 主要古籍出处：
 *  - 《紫微斗数全集》（陈抟祖师传，明代刊本）
 *  - 《紫微斗数全书》（罗洪先编，明代刊本）
 *  - 《骨髓赋》《女命骨髓赋》《十二宫诸星得地合格诀》
 *  - 倪师《天纪》紫微斗数讲义
 */

import type { ZiweiChart, Palace, Star, SiHua } from './types';
import { vn } from './names';

// ────────────────── 类型 ──────────────────
export interface PatternCondition {
  required: string[];   // 必须满足条件（已通过的）
  bonus?: string[];     // 加分项（已触发）
  breaking?: string[];  // 破格警示（已触发）
}

export interface Pattern {
  name: string;
  level: 'excellent' | 'good' | 'neutral' | 'caution';
  description: string;
  palaces: string[];                 // 涉及宫位
  conditions?: PatternCondition;     // 成立条件分层（v2 新增）
  source?: string;                   // 古籍出处（v2 新增）
}

// ────────────────── 常量 ──────────────────
const SHA_NAMES = ['擎羊', '陀罗', '火星', '铃星', '地空', '地劫'];
const SHA_HARD = ['擎羊', '陀罗', '火星', '铃星'];   // 四煞
const SHA_KONG = ['地空', '地劫'];                  // 空劫
const ZUO_YOU = ['左辅', '右弼'];
const CHANG_QU = ['文昌', '文曲'];
const KUI_YUE = ['天魁', '天钺'];

// ────────────────── 辅助函数 ──────────────────
function getMajorStarNames(palace: Palace): string[] {
  return palace.stars.filter(s => s.type === 'major').map(s => s.name);
}
function findStar(palace: Palace, name: string): Star | undefined {
  return palace.stars.find(s => s.name === name);
}
function hasStar(palace: Palace, name: string): boolean {
  return palace.stars.some(s => s.name === name);
}
function findStarPalace(chart: ZiweiChart, name: string): Palace | undefined {
  return chart.palaces.find(p => p.stars.some(s => s.name === name));
}
function getPalaceByBranch(chart: ZiweiChart, branch: number): Palace | undefined {
  return chart.palaces.find(p => p.branch === ((branch % 12) + 12) % 12);
}
function shaCountInPalace(palace: Palace, list: string[] = SHA_HARD): number {
  return palace.stars.filter(s => list.includes(s.name)).length;
}
function hasShaInPalace(palace: Palace, list: string[] = SHA_NAMES): boolean {
  return palace.stars.some(s => list.includes(s.name));
}
function getSanFangPalaces(chart: ZiweiChart): Palace[] {
  const m = chart.mingGongBranch;
  const branches = [m, (m + 4) % 12, (m + 8) % 12, (m + 6) % 12];
  return chart.palaces.filter(p => branches.includes(p.branch));
}
function isInSanFang(chart: ZiweiChart, branch: number): boolean {
  const m = chart.mingGongBranch;
  return [m, (m + 4) % 12, (m + 8) % 12, (m + 6) % 12].includes(branch);
}
function getDuiGong(chart: ZiweiChart, branch: number): Palace | undefined {
  return getPalaceByBranch(chart, (branch + 6) % 12);
}
function getJiaPalaces(chart: ZiweiChart, branch: number): { prev?: Palace; next?: Palace } {
  return {
    prev: getPalaceByBranch(chart, (branch + 11) % 12),
    next: getPalaceByBranch(chart, (branch + 1) % 12),
  };
}
function sanFangAllStars(chart: ZiweiChart): Set<string> {
  return new Set(getSanFangPalaces(chart).flatMap(p => p.stars.map(s => s.name)));
}
function sanFangShaCount(chart: ZiweiChart, list: string[] = SHA_HARD): number {
  return getSanFangPalaces(chart).reduce((sum, p) => sum + shaCountInPalace(p, list), 0);
}
function isBright(palace: Palace, starName: string): boolean {
  const s = findStar(palace, starName);
  return s?.brightness === 'bright';
}
function isDim(palace: Palace, starName: string): boolean {
  const s = findStar(palace, starName);
  return s?.brightness === 'dim';
}
function getStarSiHua(palace: Palace, starName: string): Star['siHua'] | undefined {
  return findStar(palace, starName)?.siHua;
}
// 四化挂在星曜的 siHua 字段上，不是独立星名——不能用 hasStar / sanFangAllStars 查「化禄」
function palaceHasSiHua(palace: Palace, hua: SiHua): boolean {
  return palace.stars.some(s => s.siHua === hua);
}
function sanFangHasSiHua(chart: ZiweiChart, hua: SiHua): boolean {
  return getSanFangPalaces(chart).some(p => palaceHasSiHua(p, hua));
}
const BRANCH_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// ────────────────── 正格识别器 ──────────────────

/** 君臣庆会：紫微入命，左辅右弼同会（同宫或三方） */
function detectJunChenQingHui(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, '紫微')) return;
  const sanFangSet = sanFangAllStars(chart);
  const hasZuo = sanFangSet.has('左辅');
  const hasYou = sanFangSet.has('右弼');
  if (!hasZuo || !hasYou) return;

  const required = ['Tử Vi thủ Mệnh', 'Tả Phù, Hữu Bật cùng hội tam phương tứ chính'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('文昌') || sanFangSet.has('文曲')) bonus.push('Hội thêm Văn Xương hoặc Văn Khúc');
  if (sanFangSet.has('天魁') || sanFangSet.has('天钺')) bonus.push('Khôi Việt quý nhân chiếu');
  if (getStarSiHua(ming, '紫微') === '权') bonus.push('Tử Vi hoá Quyền');
  if (sanFangShaCount(chart, SHA_KONG) >= 2) breaking.push('Địa Không, Địa Kiếp hội chiếu (Tử Vi kỵ Không Kiếp)');

  patterns.push({
    name: 'Quân Thần Khánh Hội',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Tử Vi thủ Mệnh, có Tả Phù Hữu Bật cùng hội, như vua được hiền thần phò tá, chủ phú quý lớn, có tài lãnh đạo. Một đời không thiếu quý nhân, hợp con đường quản lý, lãnh đạo trong chính trường hay thương trường.',
    palaces: ['命宫'],
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Thư – cách Quân Thần Khánh Hội',
  });
}

/** 紫府同宫：紫微+天府于命宫（限寅、申宫） */
function detectZiFu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const ziwei = findStarPalace(chart, '紫微');
  const tianfu = findStarPalace(chart, '天府');
  if (!ziwei || !tianfu || ziwei.branch !== tianfu.branch) return;

  const inMing = ziwei.branch === chart.mingGongBranch;
  const required = inMing
    ? ['Tử Vi, Thiên Phủ cùng thủ Mệnh']
    : ['Tử Vi, Thiên Phủ đồng cung (không ở Mệnh, lực giảm)'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  const sanFangSet = sanFangAllStars(chart);
  if (sanFangSet.has('左辅') && sanFangSet.has('右弼')) bonus.push('Tả Phù, Hữu Bật cùng hội');
  if (sanFangSet.has('文昌') || sanFangSet.has('文曲')) bonus.push('Hội thêm Xương Khúc');
  if (hasShaInPalace(ziwei, SHA_KONG)) breaking.push('Cung Tử Phủ gặp Không Kiếp (phá quý khí)');
  if (shaCountInPalace(ziwei, SHA_HARD) >= 2) breaking.push('Cung Tử Phủ có hai sát tinh đồng cung');

  patterns.push({
    name: 'Tử Phủ Đồng Cung',
    level: inMing && !breaking.length ? 'excellent' : 'good',
    description: inMing
      ? 'Tử Vi, Thiên Phủ cùng thủ Mệnh, đế tinh và tài khố cùng đến, là mệnh tôn quý. Chủ phẩm hạnh đoan chính, cơm áo không lo, có tài lãnh đạo, hợp giữ vị trí quan trọng. Cần có Tả Hữu phò trợ mới thành đại cách trọn vẹn.'
      : 'Tử Vi, Thiên Phủ đồng cung nhưng không ở Mệnh, chủ một đời có quý nhân nâng đỡ, nhưng bản thân chưa chắc đại phú quý, còn tuỳ cát hung tinh hội chiếu.',
    palaces: [ziwei.name],
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Thư – cách Tử Phủ Đồng Cung',
  });
}

/** 府相朝垣：天府、天相分别坐守命宫的三方四正 */
function detectFuXiangChaoYuan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const tianfu = findStarPalace(chart, '天府');
  const tianxiang = findStarPalace(chart, '天相');
  if (!tianfu || !tianxiang) return;
  if (!isInSanFang(chart, tianfu.branch) || !isInSanFang(chart, tianxiang.branch)) return;
  if (tianfu.branch === chart.mingGongBranch && tianxiang.branch === chart.mingGongBranch) return;
  if (tianfu.branch === tianxiang.branch) return;

  const required = ['Thiên Phủ ở tam phương Mệnh', 'Thiên Tướng ở tam phương Mệnh', 'Hai sao không đồng cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (hasStar(ming, '禄存') || palaceHasSiHua(ming, '禄')) bonus.push('Cung Mệnh có Lộc');
  if (sanFangAllStars(chart).has('左辅')) bonus.push('Hội thêm Tả Phù');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('Cung Mệnh có sát tinh');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('Tam phương tứ chính nhiều sát tinh');

  patterns.push({
    name: 'Phủ Tướng Triều Viên',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thiên Phủ, Thiên Tướng chia nhau ở tam phương tứ chính cung Mệnh, văn võ kiêm toàn, quyền ấn song huy, chủ một đời cơm áo đầy đủ, địa vị cao. Sách xưa nói "Phủ Tướng triều viên, thiên chung thực lộc", thường gặp ở người làm quản lý, chính quyền, doanh nghiệp.',
    palaces: [tianfu.name, tianxiang.name],
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Thư – cách Phủ Tướng Triều Viên',
  });
}

/** 阳梁昌禄：太阳+天梁+文昌+禄存四星会命宫，大贵格 */
function detectYangLiangChangLu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('太阳') || !sanFangSet.has('天梁') ||
      !sanFangSet.has('文昌') || !sanFangSet.has('禄存')) return;

  const sun = findStarPalace(chart, '太阳')!;
  const liang = findStarPalace(chart, '天梁')!;
  const required = [
    'Thái Dương hội tam phương Mệnh',
    'Thiên Lương hội tam phương Mệnh',
    'Văn Xương hội tam phương Mệnh',
    'Lộc Tồn hội tam phương Mệnh',
  ];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (isBright(sun, '太阳')) bonus.push('Thái Dương miếu vượng');
  if (isBright(liang, '天梁')) bonus.push('Thiên Lương miếu vượng');
  if (sanFangHasSiHua(chart, '科')) bonus.push('Hội thêm hoá Khoa');
  if (isDim(sun, '太阳')) breaking.push('Thái Dương hãm địa (Dương Lương mất sáng)');
  if (sanFangShaCount(chart, SHA_HARD) >= 2) breaking.push('Tam phương nhiều sát');

  patterns.push({
    name: 'Dương Lương Xương Lộc',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thái Dương, Thiên Lương, Văn Xương, Lộc Tồn cùng hội tam phương Mệnh, gọi là "sao khoa cử", chủ thanh quý hiển đạt, thi cử rất tốt, hợp con đường học thuật, giáo dục, nghiên cứu, chứng chỉ chuyên môn, công danh dễ thành.',
    palaces: [sun.name, liang.name],
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Thư – cách Dương Lương Xương Lộc',
  });
}

/** 火贪格 / 铃贪格：贪狼+火星 或 贪狼+铃星 同宫或会照 */
function detectHuoTanLingTan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const tan = findStarPalace(chart, '贪狼');
  if (!tan) return;
  const huo = findStarPalace(chart, '火星');
  const ling = findStarPalace(chart, '铃星');

  for (const [shaName, shaPalace] of [['火星', huo], ['铃星', ling]] as const) {
    if (!shaPalace) continue;
    const sameOrTrine =
      tan.branch === shaPalace.branch ||
      (tan.branch + 4) % 12 === shaPalace.branch ||
      (tan.branch + 8) % 12 === shaPalace.branch ||
      (tan.branch + 6) % 12 === shaPalace.branch;
    if (!sameOrTrine) continue;
    if (!isInSanFang(chart, tan.branch)) continue;

    const required = [`Tham Lang ${tan.branch === shaPalace.branch ? 'đồng cung' : 'hội chiếu'} ${vn(shaName)}`, 'Tham Lang hội chiếu tam phương Mệnh'];
    const bonus: string[] = [];
    const breaking: string[] = [];
    if (isBright(tan, '贪狼')) bonus.push('Tham Lang miếu vượng');
    if (getStarSiHua(tan, '贪狼') === '禄' || getStarSiHua(tan, '贪狼') === '权') bonus.push('Tham Lang hoá Lộc/hoá Quyền');
    if (hasShaInPalace(tan, ['擎羊', '陀罗'])) breaking.push('Cung Tham Lang gặp Kình Đà (giảm sức phát bất ngờ)');
    if (hasShaInPalace(tan, SHA_KONG)) breaking.push('Tham Lang gặp Không Kiếp (tiền đến rồi đi)');

    patterns.push({
      name: shaName === '火星' ? 'Hoả Tham' : 'Linh Tham',
      level: breaking.length ? 'good' : 'excellent',
      description: `Tham Lang gặp ${vn(shaName)} ${tan.branch === shaPalace.branch ? 'đồng cung' : 'hội chiếu tam phương'}, chủ phát tài bất ngờ, cơ hội đến đột ngột. Sách xưa nói "Tham Lang gặp Hoả Linh ắt phát tài", nhưng đến nhanh đi cũng nhanh, nên biết điểm dừng.${breaking.length ? ' Lá số này có yếu tố phá cách nên sức phát giảm bớt.' : ''}`,
      palaces: [tan.name, shaPalace.name],
      conditions: { required, bonus, breaking },
      source: 'Tử Vi Đẩu Số Cốt Tuỷ Phú',
    });
  }
}

/** 武贪格：武曲+贪狼 同宫（丑、未） 或 对照 */
function detectWuTan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const wu = findStarPalace(chart, '武曲');
  const tan = findStarPalace(chart, '贪狼');
  if (!wu || !tan) return;
  const sameOrOppose = wu.branch === tan.branch || (wu.branch + 6) % 12 === tan.branch;
  if (!sameOrOppose) return;
  if (!isInSanFang(chart, wu.branch) && !isInSanFang(chart, tan.branch)) return;

  const required = [
    wu.branch === tan.branch ? 'Vũ Khúc, Tham Lang đồng cung (Sửu/Mùi)' : 'Vũ Khúc, Tham Lang xung chiếu',
    'Hội chiếu tam phương Mệnh',
  ];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('火星') || sanFangAllStars(chart).has('铃星'))
    bonus.push('Gặp thêm Hoả Tinh/Linh Tinh (cộng hưởng Hoả Tham/Linh Tham)');
  if (getStarSiHua(wu, '武曲') === '禄') bonus.push('Vũ Khúc hoá Lộc');
  if (hasShaInPalace(wu, ['擎羊', '陀罗'])) breaking.push('Cung Vũ Tham gặp Kình Đà');
  if (hasShaInPalace(wu, SHA_KONG)) breaking.push('Cung Vũ Tham gặp Không Kiếp');

  patterns.push({
    name: 'Vũ Tham',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Vũ Khúc, Tham Lang hội Mệnh, tài tinh gặp sao đào hoa. Sách xưa nói "Vũ Tham bất phát thiếu niên nhân", sau 30 tuổi mới tích luỹ rồi bứt phá. Chủ trung niên trở đi giàu có, tiền đến từ quan hệ, giao tế, hợp tài chính, kinh doanh, bán hàng, giải trí.',
    palaces: [wu.name, tan.name],
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Cốt Tuỷ Phú',
  });
}

/** 杀破狼：七杀、破军、贪狼三方齐聚 */
function detectShaPoLang(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['七杀', '破军', '贪狼'].filter(s => sanFangSet.has(s));
  if (has.length < 3) return;

  const required = ['Thất Sát, Phá Quân, Tham Lang cùng ở tam phương tứ chính Mệnh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangHasSiHua(chart, '禄') || sanFangHasSiHua(chart, '权')) bonus.push('Tam phương có hoá Lộc hoặc hoá Quyền (biến động có lực)');
  if (sanFangSet.has('左辅') && sanFangSet.has('右弼')) bonus.push('Tả Hữu cùng hội (gặp quý nhân khi biến động)');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('Sát tinh quá nặng (động mà khó thành)');
  if (hasShaInPalace(ming, SHA_KONG)) breaking.push('Mệnh gặp Không Kiếp (biến động vất vả)');

  patterns.push({
    name: 'Sát Phá Tham',
    level: breaking.length ? 'caution' : 'good',
    description: 'Thất Sát, Phá Quân, Tham Lang hội Mệnh, là mệnh khai phá, xông pha. Một đời nhiều thay đổi, không chịu tầm thường, hợp khởi nghiệp, quân đội, công an, kinh doanh, bán hàng. Trung niên mới ổn định, khi trẻ dễ thất bại vì nóng vội.',
    palaces: getSanFangPalaces(chart).filter(p => has.includes(getMajorStarNames(p)[0])).map(p => p.name),
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Thư – Sát Phá Tham',
  });
}

/** 机月同梁：天机、太阴、天同、天梁四星齐入命迁财官 */
function detectJiYueTongLiang(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['天机', '太阴', '天同', '天梁'].filter(s => sanFangSet.has(s));
  if (has.length < 4) return;

  const required = ['Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng ở tam phương tứ chính Mệnh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('文昌') || sanFangSet.has('文曲')) bonus.push('Hội thêm Xương Khúc');
  if (sanFangHasSiHua(chart, '科')) bonus.push('Hội thêm hoá Khoa');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('Nhiều sát tinh (Cơ Nguyệt Đồng Lương kỵ sát)');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('Cung Mệnh có sát tinh');

  patterns.push({
    name: 'Cơ Nguyệt Đồng Lương',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng vào Mệnh, Di, Tài, Quan, người nho nhã, thông minh, giỏi mưu tính. Hợp nhất với công chức, học thuật, văn nghệ, y tế, dịch vụ, những nghề cần tích luỹ ổn định, không nên mạo hiểm đầu cơ lớn.',
    palaces: getSanFangPalaces(chart).filter(p => has.some(s => getMajorStarNames(p).includes(s))).map(p => p.name),
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Thư – cách Cơ Nguyệt Đồng Lương',
  });
}

/** 廉贞天相：同宫 */
function detectLianXiang(chart: ZiweiChart, patterns: Pattern[]) {
  const lian = findStarPalace(chart, '廉贞');
  const xiang = findStarPalace(chart, '天相');
  if (!lian || !xiang || lian.branch !== xiang.branch) return;

  const inMing = lian.branch === chart.mingGongBranch;
  const required = ['Liêm Trinh, Thiên Tướng đồng cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (hasStar(lian, '禄存') || getStarSiHua(lian, '廉贞') === '禄') bonus.push('Có Lộc Tồn hoặc Liêm Trinh hoá Lộc');
  if (sanFangAllStars(chart).has('左辅')) bonus.push('Tả Phù hội chiếu');
  if (hasShaInPalace(lian, ['擎羊'])) breaking.push('Cung Liêm Tướng có Kình Dương (thiên về Liêm Sát Dương)');
  if (getStarSiHua(lian, '廉贞') === '忌') breaking.push('Liêm Trinh hoá Kỵ');

  patterns.push({
    name: 'Liêm Trinh Thiên Tướng',
    level: breaking.length ? 'caution' : (inMing ? 'good' : 'neutral'),
    description: 'Liêm Trinh, Thiên Tướng đồng cung, cách ấn thụ, chủ làm việc công minh, có tiếng thanh liêm, hợp công chức, hành chính, pháp lý, kế hoạch. Kỵ gặp Kình Dương, hoá Kỵ, khi đó dễ vướng kiện tụng.',
    palaces: [lian.name],
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Thư',
  });
}

/** 武曲七杀：同宫，将星配财星 */
function detectWuQiSha(chart: ZiweiChart, patterns: Pattern[]) {
  const wu = findStarPalace(chart, '武曲');
  const qi = findStarPalace(chart, '七杀');
  if (!wu || !qi || wu.branch !== qi.branch) return;

  const inMing = wu.branch === chart.mingGongBranch;
  const required = ['Vũ Khúc, Thất Sát đồng cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (getStarSiHua(wu, '武曲') === '权') bonus.push('Vũ Khúc hoá Quyền');
  if (getStarSiHua(wu, '武曲') === '禄') bonus.push('Vũ Khúc hoá Lộc');
  if (getStarSiHua(wu, '武曲') === '忌') breaking.push('Vũ Khúc hoá Kỵ (dấu hiệu hao tài)');
  if (hasShaInPalace(wu, ['擎羊', '陀罗', '火星', '铃星'])) breaking.push('Cung Vũ Sát nhiều sát tinh');

  patterns.push({
    name: 'Vũ Khúc Thất Sát',
    level: breaking.length ? 'caution' : (inMing ? 'excellent' : 'good'),
    description: 'Vũ Khúc, Thất Sát đồng cung, tướng tinh đi với tài tinh, chủ quyết đoán, cứng rắn, giỏi quản lý tiền bạc, hợp tài chính, quân đội, khởi nghiệp. Kỵ gặp hoá Kỵ và sát tinh. Một đời phấn đấu, tích được của nhưng nhiều lo toan.',
    palaces: [wu.name],
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Thư',
  });
}

/** 天同天梁：同宫 */
function detectTongLiang(chart: ZiweiChart, patterns: Pattern[]) {
  const tong = findStarPalace(chart, '天同');
  const liang = findStarPalace(chart, '天梁');
  if (!tong || !liang || tong.branch !== liang.branch) return;

  const required = ['Thiên Đồng, Thiên Lương đồng cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('文昌')) bonus.push('Văn Xương hội chiếu');
  if (getStarSiHua(tong, '天同') === '禄') bonus.push('Thiên Đồng hoá Lộc');
  if (hasShaInPalace(tong, SHA_HARD)) breaking.push('Có sát tinh đồng cung');

  patterns.push({
    name: 'Thiên Đồng Thiên Lương',
    level: breaking.length ? 'neutral' : 'good',
    description: 'Thiên Đồng, Thiên Lương đồng cung, phúc tinh gặp ấm tinh, chủ rộng lượng, hiền hoà, thích giúp người, hợp y tế, giáo dục, tôn giáo, công tác xã hội. Tính ôn hoà, thận trọng nên khó thành đại phú quý.',
    palaces: [tong.name],
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Thư',
  });
}

/** 日月同宫：太阳太阴丑或未宫同宫 */
function detectRiYueTongGong(chart: ZiweiChart, patterns: Pattern[]) {
  const sun = findStarPalace(chart, '太阳');
  const moon = findStarPalace(chart, '太阴');
  if (!sun || !moon || sun.branch !== moon.branch) return;
  if (sun.branch !== 1 && sun.branch !== 7) return;  // 必须丑(1) 或 未(7)

  const inMing = sun.branch === chart.mingGongBranch;
  const required = [`Thái Dương, Thái Âm đồng cung tại ${BRANCH_NAMES[sun.branch]}`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sun.branch === 7) bonus.push('Nhật Nguyệt ở Mùi (sách xưa nói Nhật Nguyệt ở Mùi đều đẹp)');
  if (sanFangAllStars(chart).has('文昌') && sanFangAllStars(chart).has('文曲')) bonus.push('Xương Khúc hội chiếu');
  if (hasShaInPalace(sun, SHA_HARD)) breaking.push('Cung Nhật Nguyệt có sát tinh');

  patterns.push({
    name: 'Nhật Nguyệt Đồng Cung',
    level: breaking.length ? 'good' : (inMing ? 'excellent' : 'good'),
    description: `Thái Dương, Thái Âm đồng cung tại ${BRANCH_NAMES[sun.branch]}, âm dương cân bằng, văn võ kiêm toàn. Chủ có duyên với người khác giới, sự nghiệp thuận lợi, danh tiếng lan xa. ${sun.branch === 7 ? 'Ở Mùi thì Nhật Nguyệt đều đẹp, càng tốt.' : 'Ở Sửu thì lực Nhật Nguyệt bình thường hơn.'}`,
    palaces: [sun.name],
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Thư',
  });
}

/** 日月夹命：太阳太阴在命宫前后两宫 */
function detectRiYueJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasSun = hasStar(prev, '太阳');
  const prevHasMoon = hasStar(prev, '太阴');
  const nextHasSun = hasStar(next, '太阳');
  const nextHasMoon = hasStar(next, '太阴');
  const ok = (prevHasSun && nextHasMoon) || (prevHasMoon && nextHasSun);
  if (!ok) return;

  const sunPalace = prevHasSun ? prev : next;
  const moonPalace = prevHasMoon ? prev : next;
  const required = ['Thái Dương, Thái Âm ở hai cung giáp Mệnh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (isBright(sunPalace, '太阳')) bonus.push('Thái Dương miếu vượng');
  if (isBright(moonPalace, '太阴')) bonus.push('Thái Âm miếu vượng');
  if (isDim(sunPalace, '太阳') || isDim(moonPalace, '太阴')) breaking.push('Nhật Nguyệt hãm địa (giáp Mệnh mà không sáng)');

  patterns.push({
    name: 'Nhật Nguyệt Giáp Mệnh',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thái Dương, Thái Âm giáp hai bên cung Mệnh, người quang minh lỗi lạc, một đời có quý nhân giúp, sự nghiệp phát triển. Nam chủ quan quý, nữ chủ vượng phu ích gia. Nhật Nguyệt phải không hãm mới là giáp thật.',
    palaces: [sunPalace.name, moonPalace.name],
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Thư – Nhật Nguyệt Giáp Mệnh',
  });
}

/** 巨日同宫：巨门太阳同入寅或申 */
function detectJuRiTongGong(chart: ZiweiChart, patterns: Pattern[]) {
  const ju = findStarPalace(chart, '巨门');
  const sun = findStarPalace(chart, '太阳');
  if (!ju || !sun || ju.branch !== sun.branch) return;
  if (ju.branch !== 2 && ju.branch !== 8) return;  // 必须寅(2) 或 申(8)

  const inMing = ju.branch === chart.mingGongBranch;
  const required = [`Cự Môn, Thái Dương đồng cung tại ${BRANCH_NAMES[ju.branch]}`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (ju.branch === 2) bonus.push('Ở Dần Thái Dương miếu vượng, Cự Môn được ánh sáng hoá giải thị phi');
  if (getStarSiHua(ju, '巨门') === '禄' || getStarSiHua(ju, '巨门') === '权') bonus.push('Cự Môn hoá Lộc/hoá Quyền (nhờ ăn nói mà ra tiền)');
  if (getStarSiHua(ju, '巨门') === '忌') breaking.push('Cự Môn hoá Kỵ (khẩu thiệt, kiện tụng)');
  if (ju.branch === 8) breaking.push('Ở Thân Thái Dương đã ngả tây, tính ám của Cự Môn rõ hơn');

  patterns.push({
    name: 'Cự Nhật Đồng Cung',
    level: breaking.length ? 'caution' : (inMing && ju.branch === 2 ? 'excellent' : 'good'),
    description: `Cự Môn, Thái Dương đồng cung tại ${BRANCH_NAMES[ju.branch]}, Thái Dương hoá giải tính ám của Cự Môn, chủ lập nghiệp bằng ăn nói, truyền thông, ngoại ngữ, chuyên môn. Ở Dần tốt hơn, ở Thân lực giảm. Kỵ Cự Môn hoá Kỵ dễ vướng kiện tụng.`,
    palaces: [ju.name],
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Thư – Cự Nhật Đồng Cung',
  });
}

/** 石中隐玉：巨门入命于子午宫 */
function detectShiZhongYinYu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, '巨门')) return;
  if (ming.branch !== 0 && ming.branch !== 6) return;  // 子(0) 或 午(6)

  const required = [`Cự Môn thủ Mệnh tại ${BRANCH_NAMES[ming.branch]}`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (getStarSiHua(ming, '巨门') === '禄' || getStarSiHua(ming, '巨门') === '权') bonus.push('Cự Môn hoá Lộc/hoá Quyền');
  if (sanFangAllStars(chart).has('文昌')) bonus.push('Văn Xương hội chiếu (ngọc trong đá được sáng)');
  if (getStarSiHua(ming, '巨门') === '忌') breaking.push('Cự Môn hoá Kỵ (ngọc vùi sâu)');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('Mệnh có sát tinh');

  patterns.push({
    name: 'Thạch Trung Ẩn Ngọc',
    level: breaking.length ? 'caution' : 'excellent',
    description: 'Cự Môn thủ Mệnh ở Tý hoặc Ngọ, bề ngoài bình thường nhưng bên trong có tài học. Thời trẻ lặng lẽ, trung niên mới hiển quý, hợp chuyên môn, nghiên cứu, nghề dùng lời nói, truyền thông. Cần Lộc, Quyền hoặc Văn Xương giúp mới "đục đá thấy ngọc".',
    palaces: ['命宫'],
    conditions: { required, bonus, breaking },
    source: 'Cốt Tuỷ Phú – Thạch Trung Ẩn Ngọc',
  });
}

/** 明珠出海：命宫在未空宫，对宫丑宫为太阳太阴 */
function detectMingZhuChuHai(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (ming.branch !== 7) return;   // 命在未
  if (getMajorStarNames(ming).length > 0) return;   // 命宫为空宫
  const dui = getDuiGong(chart, ming.branch);
  if (!dui) return;
  if (!hasStar(dui, '太阳') || !hasStar(dui, '太阴')) return;

  const required = ['Cung Mệnh ở Mùi vô chính diệu', 'Cung đối ở Sửu có Thái Dương, Thái Âm'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('文昌') || sanFangAllStars(chart).has('文曲')) bonus.push('Hội thêm Xương Khúc');
  if (sanFangAllStars(chart).has('左辅') || sanFangAllStars(chart).has('右弼')) bonus.push('Tả Hữu trợ giúp');
  if (sanFangShaCount(chart, SHA_HARD) >= 2) breaking.push('Sát tinh hội chiếu (ánh ngọc mờ đi)');

  patterns.push({
    name: 'Minh Châu Xuất Hải',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Mệnh ở Mùi vô chính diệu, cung đối ở Sửu có Nhật Nguyệt chiếu về, gọi là "Minh Châu Xuất Hải". Chủ xuất thân bình thường, nhờ nỗ lực mà vươn lên, hợp đi xa lập nghiệp, nghiên cứu học thuật hoặc giữ vị trí cao ở công ty lớn, chủ phú quý.',
    palaces: ['命宫', dui.name],
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Tập – Minh Châu Xuất Hải',
  });
}

/** 紫微独坐入命 */
function detectZiWeiInMing(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, '紫微') || hasStar(ming, '天府')) return;

  const required = ['Tử Vi độc thủ Mệnh (không có Thiên Phủ)'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  const sanFangSet = sanFangAllStars(chart);
  if (sanFangSet.has('左辅') && sanFangSet.has('右弼')) bonus.push('Tả Phù, Hữu Bật cùng hội');
  if (sanFangSet.has('文昌') && sanFangSet.has('文曲')) bonus.push('Văn Xương, Văn Khúc cùng hội');
  if (!sanFangSet.has('左辅') && !sanFangSet.has('右弼')) breaking.push('Không có Tả Hữu (vua cô độc không bề tôi)');
  if (hasShaInPalace(ming, SHA_KONG)) breaking.push('Tử Vi gặp Không Kiếp (sách xưa rất kỵ)');

  patterns.push({
    name: 'Tử Vi thủ Mệnh',
    level: breaking.length ? 'caution' : (bonus.length ? 'excellent' : 'good'),
    description: 'Tử Vi độc thủ Mệnh, sao đế vương, lòng tự trọng cao, có sức hút lãnh đạo. Nhưng Tử Vi kỵ nhất là "vua cô độc": nếu không có Tả Hữu cùng hội thì dễ thành kiêu ngạo, cô độc, hay bị dèm pha.',
    palaces: ['命宫'],
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Thư',
  });
}

/** 辅弼夹命 */
function detectFuBiJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasZuo = hasStar(prev, '左辅');
  const prevHasYou = hasStar(prev, '右弼');
  const nextHasZuo = hasStar(next, '左辅');
  const nextHasYou = hasStar(next, '右弼');
  if (!((prevHasZuo && nextHasYou) || (prevHasYou && nextHasZuo))) return;

  const required = ['Tả Phù, Hữu Bật ở hai cung giáp Mệnh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('天魁') || sanFangAllStars(chart).has('天钺')) bonus.push('Hội thêm Khôi Việt');

  patterns.push({
    name: 'Tả Hữu Giáp Mệnh',
    level: 'excellent',
    description: 'Tả Phù, Hữu Bật giáp Mệnh, theo sách xưa là cách có quý nhân giúp, phúc dày. Hợp con đường quan chức, quản lý doanh nghiệp lớn, nơi phát huy tài tổ chức. Sách xưa nói "Tả Phù Hữu Bật, chung thân phúc hậu".',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required, bonus, breaking },
    source: 'Tử Vi Đẩu Số Toàn Thư – Tả Hữu Giáp Mệnh',
  });
}

/** 昌曲夹命 */
function detectChangQuJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasChang = hasStar(prev, '文昌');
  const prevHasQu = hasStar(prev, '文曲');
  const nextHasChang = hasStar(next, '文昌');
  const nextHasQu = hasStar(next, '文曲');
  if (!((prevHasChang && nextHasQu) || (prevHasQu && nextHasChang))) return;

  patterns.push({
    name: 'Xương Khúc Giáp Mệnh',
    level: 'excellent',
    description: 'Văn Xương, Văn Khúc giáp Mệnh, chủ thông minh, tuấn tú, văn hay, hợp giáo dục, học thuật, nghệ thuật, viết lách. Sách xưa nói "Xương Khúc giáp Mệnh chủ khoa giáp", rất lợi cho thi cử.',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required: ['Văn Xương, Văn Khúc ở hai cung giáp Mệnh'] },
    source: 'Tử Vi Đẩu Số Toàn Thư',
  });
}

/** 魁钺夹命 */
function detectKuiYueJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, '天魁') && hasStar(next, '天钺');
  const okB = hasStar(prev, '天钺') && hasStar(next, '天魁');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Khôi Việt Giáp Mệnh',
    level: 'good',
    description: 'Thiên Khôi, Thiên Việt giáp Mệnh, một đời có quý nhân nâng đỡ. Khi thi cử, xin việc, lúc quan trọng thường có người giúp bất ngờ.',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required: ['Thiên Khôi, Thiên Việt ở hai cung giáp Mệnh'] },
    source: 'Tử Vi Đẩu Số Toàn Thư',
  });
}

/** 双禄朝垣：化禄 + 禄存 同会三方 */
function detectShuangLuChaoYuan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFang = getSanFangPalaces(chart);
  let huaLuFound = false;
  let luCunFound = false;
  for (const p of sanFang) {
    if (p.stars.some(s => s.siHua === '禄')) huaLuFound = true;
    if (hasStar(p, '禄存')) luCunFound = true;
  }
  if (!huaLuFound || !luCunFound) return;

  patterns.push({
    name: 'Song Lộc Triều Viên',
    level: 'excellent',
    description: 'Hoá Lộc và Lộc Tồn cùng hội tam phương tứ chính Mệnh, tài nguồn dồi dào, cơm áo đầy đủ. Sách xưa nói "Song Lộc triều viên, phú tỷ Đào Chu", chủ một đời không lo tiền, có cả chính tài lẫn tài bất ngờ.',
    palaces: sanFang.map(p => p.name),
    conditions: {
      required: ['Hoá Lộc hội chiếu tam phương tứ chính', 'Lộc Tồn hội chiếu tam phương tứ chính'],
      breaking: hasShaInPalace(ming, SHA_KONG) ? ['Mệnh gặp Không Kiếp (Song Lộc gặp Không, tiền đến rồi đi)'] : undefined,
    },
    source: 'Tử Vi Đẩu Số Toàn Thư – Song Lộc Triều Viên',
  });
}

/** 三奇加会：化禄 化权 化科 同会三方 */
function detectSanQiJiaHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangPalaces = getSanFangPalaces(chart);
  let lu = false, quan = false, ke = false;
  for (const p of sanFangPalaces) {
    for (const s of p.stars) {
      if (s.siHua === '禄') lu = true;
      if (s.siHua === '权') quan = true;
      if (s.siHua === '科') ke = true;
    }
  }
  if (!(lu && quan && ke)) return;

  patterns.push({
    name: 'Tam Hoá Liên Châu (Tam Kỳ Gia Hội)',
    level: 'excellent',
    description: 'Hoá Lộc, hoá Quyền, hoá Khoa cùng hội tam phương tứ chính Mệnh, gọi là "Tam Kỳ Gia Hội". Chủ công danh, tiền tài, quý nhân đều đủ, là một trong những cách tốt nhất của Tử Vi.',
    palaces: sanFangPalaces.map(p => p.name),
    conditions: { required: ['Hoá Lộc, hoá Quyền, hoá Khoa cùng hội tam phương tứ chính Mệnh'] },
    source: 'Tử Vi Đẩu Số Toàn Thư – Tam Kỳ Gia Hội',
  });
}

/** 化禄入命/官/财 */
function detectHuaLuRuMing(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const huaLuStar = ming.stars.find(s => s.siHua === '禄' && s.type === 'major');
  if (!huaLuStar) return;

  patterns.push({
    name: `${vn(huaLuStar.name)} Hoá Lộc Thủ Mệnh`,
    level: 'good',
    description: `${vn(huaLuStar.name)} hoá Lộc thủ Mệnh, chủ kiếm tiền thuận lợi, nhân duyên tốt, nhiều cơ hội.${huaLuStar.name === '武曲' ? ' Vũ Khúc hoá Lộc là chính tài, hợp sản xuất, tài chính.' : huaLuStar.name === '太阴' ? ' Thái Âm hoá Lộc thiên về tài sản tích luỹ, bất động sản.' : huaLuStar.name === '贪狼' ? ' Tham Lang hoá Lộc là tiền đến từ quan hệ, giao tế.' : ''}`,
    palaces: ['命宫'],
    conditions: { required: [`${vn(huaLuStar.name)} hoá Lộc ở cung Mệnh`] },
    source: 'Tử Vi Đẩu Số Toàn Thư',
  });
}

// ────────────────── 恶格识别器 ──────────────────

/** 化忌入命/迁 */
function detectHuaJiRuMingQian(chart: ZiweiChart, patterns: Pattern[]) {
  const qianBranch = (chart.mingGongBranch + 6) % 12;
  for (const palace of chart.palaces) {
    if (palace.branch !== chart.mingGongBranch && palace.branch !== qianBranch) continue;
    const jiStar = palace.stars.find(s => s.siHua === '忌' && s.type === 'major');
    if (!jiStar) continue;

    const inMing = palace.branch === chart.mingGongBranch;
    patterns.push({
      name: `${vn(jiStar.name)} Hoá Kỵ Nhập ${inMing ? 'Mệnh' : 'Thiên Di'}`,
      level: 'caution',
      description: inMing
        ? `${vn(jiStar.name)} hoá Kỵ ở cung Mệnh, nên lưu ý tính cố chấp, áp lực tâm lý hoặc sức khoẻ, việc gì cũng nên lùi một bước mà nghĩ. Hoá Kỵ không hẳn xấu, chỉ là năng lượng sao này cần được chú ý nhiều hơn.`
        : `${vn(jiStar.name)} hoá Kỵ ở cung Thiên Di, ra ngoài, đi xa, quan hệ xã hội dễ trắc trở, nên giữ hơn là động.`,
      palaces: [palace.name],
      conditions: { required: [`${vn(jiStar.name)} hoá Kỵ ở cung ${inMing ? 'Mệnh' : 'Thiên Di'}`] },
      source: 'Tử Vi Đẩu Số Toàn Thư',
    });
  }
}

/** 羊陀夹忌：化忌坐宫，左右被擎羊陀罗夹 */
function detectYangTuoJiaJi(chart: ZiweiChart, patterns: Pattern[]) {
  for (const palace of chart.palaces) {
    const jiStar = palace.stars.find(s => s.siHua === '忌');
    if (!jiStar) continue;
    if (palace.branch !== chart.mingGongBranch) continue;   // 只看命宫被夹

    const { prev, next } = getJiaPalaces(chart, palace.branch);
    if (!prev || !next) continue;
    const aPrev = hasStar(prev, '擎羊') && hasStar(next, '陀罗');
    const aNext = hasStar(prev, '陀罗') && hasStar(next, '擎羊');
    if (!aPrev && !aNext) continue;

    patterns.push({
      name: 'Kình Đà Giáp Kỵ',
      level: 'caution',
      description: 'Hoá Kỵ thủ Mệnh, hai bên có Kình Dương, Đà La giáp, sách xưa nói "Kình Đà giáp Kỵ là bại cục", chủ vất vả bôn ba, nhiều trắc trở. Nên tu dưỡng đức hạnh, chăm chỉ làm việc để hoá giải, việc gì cũng nên cẩn trọng.',
      palaces: ['命宫', prev.name, next.name],
      conditions: { required: ['Hoá Kỵ thủ Mệnh', 'Kình Dương, Đà La ở hai cung giáp Mệnh'] },
      source: 'Cốt Tuỷ Phú – Kình Đà Giáp Kỵ',
    });
    return;
  }
}

/** 火铃夹命：火星铃星分居命宫前后 */
function detectHuoLingJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, '火星') && hasStar(next, '铃星');
  const okB = hasStar(prev, '铃星') && hasStar(next, '火星');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Hoả Linh Giáp Mệnh',
    level: 'caution',
    description: 'Hoả Tinh, Linh Tinh giáp Mệnh, chủ tính nóng, dễ bốc đồng, dễ gặp chuyện bất ngờ hoặc tranh chấp. Nên rèn tính kiên nhẫn, tránh quyết định vội vàng.',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required: ['Hoả Tinh, Linh Tinh ở hai cung giáp Mệnh'] },
    source: 'Tử Vi Đẩu Số Toàn Thư',
  });
}

/** 空劫夹命：地空地劫分居命宫前后 */
function detectKongJieJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, '地空') && hasStar(next, '地劫');
  const okB = hasStar(prev, '地劫') && hasStar(next, '地空');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Không Kiếp Giáp Mệnh',
    level: 'caution',
    description: 'Địa Không, Địa Kiếp giáp Mệnh, chủ tiền đến rồi đi, tư tưởng thoát tục, dễ thiên về tôn giáo, triết học. Sách xưa nói "Không Kiếp giáp Mệnh, tài bất tụ". Hợp nghề kỹ thuật, nghệ thuật, nghiên cứu, không nặng vật chất.',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required: ['Địa Không, Địa Kiếp ở hai cung giáp Mệnh'] },
    source: 'Tử Vi Đẩu Số Toàn Thư',
  });
}

/** 廉杀羊：廉贞、七杀、擎羊三星会照（流年大限最凶） */
function detectLianShaYang(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('廉贞') && sanFangSet.has('七杀') && sanFangSet.has('擎羊'))) return;

  patterns.push({
    name: 'Liêm Sát Dương',
    level: 'caution',
    description: 'Liêm Trinh, Thất Sát, Kình Dương hội chiếu tam phương Mệnh, sách xưa xếp vào tổ hợp cần lưu ý. Khi đại hạn, lưu niên chạm tới nên thận trọng: lái xe an toàn, giữ hoà khí, quyết định sức khoẻ cần tỉnh táo. Đây là lời nhắc chủ động phòng tránh, không phải định mệnh.',
    palaces: ['命宫'],
    conditions: { required: ['Liêm Trinh, Thất Sát, Kình Dương hội chiếu tam phương tứ chính'] },
    source: 'Tử Vi Đẩu Số Toàn Thư – Liêm Sát Dương',
  });
}

/** 巨火羊：巨门、火星、擎羊会照 */
function detectJuHuoYang(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('巨门') && sanFangSet.has('火星') && sanFangSet.has('擎羊'))) return;

  patterns.push({
    name: 'Cự Hoả Dương',
    level: 'caution',
    description: 'Cự Môn, Hoả Tinh, Kình Dương hội chiếu, sách xưa xếp vào tổ hợp cần cảnh giác (lời xưa mang tính định mệnh, nay không áp dụng). Cách hiểu hiện nay: thẳng thắn dễ gây xung đột, cần tự nhận biết khi cảm xúc mạnh. Nên tập nói năng ôn hoà, chủ động hoá giải mâu thuẫn.',
    palaces: ['命宫'],
    conditions: { required: ['Cự Môn, Hoả Tinh, Kình Dương hội chiếu tam phương tứ chính'] },
    source: 'Cốt Tuỷ Phú – Cự Hoả Dương',
  });
}

/** 铃昌陀武：铃星、文昌、陀罗、武曲会照（限至投河） */
function detectLingChangTuoWu(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('铃星') && sanFangSet.has('文昌') && sanFangSet.has('陀罗') && sanFangSet.has('武曲'))) return;

  patterns.push({
    name: 'Linh Xương Đà Vũ',
    level: 'caution',
    description: 'Linh Tinh, Văn Xương, Đà La, Vũ Khúc cùng hội, sách xưa xếp vào tổ hợp cần lưu ý (lời xưa mang tính định mệnh, nay không áp dụng). Khi đại hạn, lưu niên chạm tới nên bình tĩnh trước quyết định lớn, chú ý cảm xúc, giữ cuộc sống ổn định.',
    palaces: ['命宫'],
    conditions: { required: ['Linh Tinh, Văn Xương, Đà La, Vũ Khúc hội chiếu tam phương tứ chính'] },
    source: 'Cốt Tuỷ Phú – Linh Xương Đà Vũ',
  });
}

/** 马头带箭：擎羊在午宫坐命 */
function detectMaTouDaiJian(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (ming.branch !== 6) return;   // 必须午
  if (!hasStar(ming, '擎羊')) return;

  const required = ['Kình Dương thủ Mệnh tại Ngọ'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('七杀') || sanFangAllStars(chart).has('破军')) bonus.push('Hội thêm Thất Sát hoặc Phá Quân (võ nghiệp hiển quý)');
  if (sanFangAllStars(chart).has('天魁') || sanFangAllStars(chart).has('天钺')) bonus.push('Khôi Việt chiếu');

  patterns.push({
    name: 'Mã Đầu Đới Tiễn',
    level: bonus.length ? 'good' : 'caution',
    description: 'Kình Dương thủ Mệnh tại Ngọ, gọi là "Mã Đầu Đới Tiễn", sách xưa nói "uy trấn biên cương". Cách này tượng trưng cho sự quyết đoán, tinh thần cạnh tranh, hợp nghề cần thực thi và quyết định nhanh. Cần có cát tinh đi kèm mới phát huy tốt nhất.',
    palaces: ['命宫'],
    conditions: { required, bonus },
    source: 'Cốt Tuỷ Phú – Mã Đầu Đới Tiễn',
  });
}

// ────────────────── 基础格局（提升识别覆盖率）──────────────────
// 设计：让普通命盘也能识别出 1-3 个常见格局，而不是 30+ 严格古书格局都不匹配。
// 这些都是单一条件触发的轻量识别，level 多为 neutral / good。

/** 禄存守身：禄存入身宫（或命宫与身宫同宫） */
function detectLuCunShouShen(chart: ZiweiChart, patterns: Pattern[]) {
  const luCunPalace = findStarPalace(chart, '禄存');
  if (!luCunPalace) return;
  const inMing = luCunPalace.branch === chart.mingGongBranch;
  const inShen = luCunPalace.branch === chart.shenGongBranch;
  if (!inMing && !inShen) return;
  patterns.push({
    name: inMing ? 'Lộc Tồn Thủ Mệnh' : 'Lộc Tồn Thủ Thân',
    level: 'good',
    description: inMing
      ? 'Lộc Tồn thủ Mệnh, chủ một đời cơm áo không lo, tiền bạc ổn định. Tính thận trọng, giỏi tích luỹ, nhưng Lộc Tồn luôn bị Kình Đà giáp nên cần đề phòng tiểu nhân. Có thêm hoá Lộc, Tả Hữu thì thành đại cách.'
      : 'Lộc Tồn ở cung Thân, chủ từ trung niên tài nguồn ổn định, tự mình hưởng lộc. Vợ chồng hoặc hướng sự nghiệp có thể mang lại tiền bạc ổn định.',
    palaces: [inMing ? '命宫' : '身宫'],
    conditions: { required: [inMing ? 'Lộc Tồn ở cung Mệnh' : 'Lộc Tồn ở cung Thân'] },
    source: 'Tử Vi Đẩu Số Toàn Thư – sao Lộc Tồn',
  });
}

/** 天马入命/迁：驿马星动 */
function detectTianMaRuMing(chart: ZiweiChart, patterns: Pattern[]) {
  const tianMaPalace = findStarPalace(chart, '天马');
  if (!tianMaPalace) return;
  const inMing = tianMaPalace.branch === chart.mingGongBranch;
  const inQian = tianMaPalace.branch === ((chart.mingGongBranch + 6) % 12);
  if (!inMing && !inQian) return;
  patterns.push({
    name: inMing ? 'Thiên Mã Thủ Mệnh' : 'Thiên Mã Ở Thiên Di',
    level: 'neutral',
    description: inMing
      ? 'Thiên Mã thủ Mệnh, chủ một đời bôn ba, nhờ di chuyển mà có tiền, hợp buôn bán, công việc bên ngoài, phát triển đa lĩnh vực. Nếu gặp thêm Lộc Tồn hoặc hoá Lộc là cách "Lộc Mã giao trì", chủ giàu.'
      : 'Thiên Mã ở cung Thiên Di, chủ ra ngoài có lợi, đi xa có tiền, hợp lập nghiệp nơi khác. Gặp hoá Lộc thì kiếm tiền ở xa, gặp sát tinh thì đi lại nhiều trắc trở.',
    palaces: [tianMaPalace.name],
    conditions: { required: [inMing ? 'Thiên Mã ở cung Mệnh' : 'Thiên Mã ở cung Thiên Di'] },
    source: 'Tử Vi Đẩu Số Toàn Thư – sao Thiên Mã',
  });
}

/** 化禄入财：财帛宫主星化禄 */
function detectHuaLuRuCai(chart: ZiweiChart, patterns: Pattern[]) {
  const cai = chart.palaces.find(p => p.name === '财帛');
  if (!cai) return;
  const luStar = cai.stars.find(s => s.type === 'major' && s.siHua === '禄');
  if (!luStar) return;
  patterns.push({
    name: 'Hoá Lộc Nhập Tài Bạch',
    level: 'good',
    description: `${vn(luStar.name)} hoá Lộc ở cung Tài Bạch, chủ tài nguồn thông suốt, thu nhập ổn định. Năng lực mà sao ${vn(luStar.name)} đại diện chính là trục kiếm tiền của bạn. Có thêm Lộc Tồn hoặc Thiên Mã thì nguồn tiền rộng hơn.`,
    palaces: ['财帛'],
    conditions: { required: [`${vn(luStar.name)} hoá Lộc ở cung Tài Bạch`] },
    source: 'Tử Vi Đẩu Số Toàn Thư – luận Tứ Hoá',
  });
}

/** 化权入官：官禄宫主星化权 */
function detectHuaQuanRuGuan(chart: ZiweiChart, patterns: Pattern[]) {
  const guan = chart.palaces.find(p => p.name === '官禄');
  if (!guan) return;
  const quanStar = guan.stars.find(s => s.type === 'major' && s.siHua === '权');
  if (!quanStar) return;
  patterns.push({
    name: 'Hoá Quyền Nhập Quan Lộc',
    level: 'good',
    description: `${vn(quanStar.name)} hoá Quyền ở cung Quan Lộc, chủ sự nghiệp có quyền chủ động, đủ sức đảm nhận vị trí độc lập. Hoá Quyền là quyền lực và năng lực thực thi: bạn có thể thành người ra quyết định hoặc trụ cột trong công việc, hợp con đường quản lý hoặc chuyên gia.`,
    palaces: ['官禄'],
    conditions: { required: [`${vn(quanStar.name)} hoá Quyền ở cung Quan Lộc`] },
    source: 'Tử Vi Đẩu Số Toàn Thư – luận Tứ Hoá',
  });
}

/** 化科入命/身：科名加身 */
function detectHuaKeRuMingShen(chart: ZiweiChart, patterns: Pattern[]) {
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  const shen = chart.palaces.find(p => p.branch === chart.shenGongBranch);
  const target = [ming, shen].filter((p): p is Palace => Boolean(p));
  for (const p of target) {
    const keStar = p.stars.find(s => s.type === 'major' && s.siHua === '科');
    if (!keStar) continue;
    const isMing = p.branch === chart.mingGongBranch;
    patterns.push({
      name: isMing ? 'Hoá Khoa Nhập Mệnh' : 'Hoá Khoa Nhập Thân',
      level: 'good',
      description: `${vn(keStar.name)} hoá Khoa ở cung ${isMing ? 'Mệnh' : 'Thân'}, chủ danh tiếng, giấy tờ, học hành. Hoá Khoa mang lại phẩm chất được người khác coi trọng, hợp giáo dục, nghiên cứu, tư vấn, sáng tạo nội dung, những nghề "lấy danh làm lợi".`,
      palaces: [isMing ? '命宫' : '身宫'],
      conditions: { required: [`${vn(keStar.name)} hoá Khoa ở cung ${isMing ? 'Mệnh' : 'Thân'}`] },
      source: 'Tử Vi Đẩu Số Toàn Thư – luận Tứ Hoá',
    });
    return; // 命和身重复时只识别一次
  }
}

/** 机月同梁三星会（3 星不全格，非四星真格）：天机/太阴/天同/天梁 任 3 星齐入三方四正 */
function detectJiYueTongLiangPartial(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['天机', '太阴', '天同', '天梁'].filter(s => sanFangSet.has(s));
  if (has.length !== 3) return; // 4 星齐由 detectJiYueTongLiang 处理
  // 避免和上面 detectJiYueTongLiang 重复（4 星齐的不进这里）
  const missing = ['天机', '太阴', '天同', '天梁'].filter(s => !sanFangSet.has(s));
  patterns.push({
    name: 'Cơ Nguyệt Đồng Lương (thiếu một sao)',
    level: 'neutral',
    description: `Cách Cơ Nguyệt Đồng Lương cần đủ Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương hội tam phương tứ chính; lá số này chỉ có 3 sao (${has.map(vn).join(', ')}), thiếu ${missing.map(vn).join(', ')}, nên chưa phải chân cách, lực giảm một bậc. Người nho nhã, có mưu tính, hợp công chức, giáo dục, y tế, dịch vụ, những nghề cần tích luỹ ổn định.`,
    palaces: getSanFangPalaces(chart).filter(p => has.some(s => getMajorStarNames(p).includes(s))).map(p => p.name),
    conditions: { required: [`Tam phương tứ chính hội ${has.map(vn).join(', ')} (thiếu ${missing.map(vn).join(', ')})`] },
    source: 'Tử Vi Đẩu Số Toàn Thư – cách Cơ Nguyệt Đồng Lương',
  });
  void ming;
}

/** 昌曲同会：文昌+文曲都在命三方四正 */
function detectChangQuTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('文昌') || !sanFangSet.has('文曲')) return;
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!ming) return;
  const inMing = hasStar(ming, '文昌') && hasStar(ming, '文曲');
  patterns.push({
    name: inMing ? 'Xương Khúc Thủ Mệnh' : 'Xương Khúc Cùng Hội',
    level: 'good',
    description: inMing
      ? 'Văn Xương, Văn Khúc cùng thủ Mệnh, chủ thông minh, tuấn tú, văn hay, hợp văn chương, giáo dục, viết lách, tư vấn. Kỵ nhất là hoá Kỵ: Xương Khúc hoá Kỵ dễ thiệt về giấy tờ, hợp đồng.'
      : 'Văn Xương, Văn Khúc cùng hội tam phương tứ chính, chủ tài hoa, ăn nói và viết đều giỏi. Hợp nghề cần diễn đạt, văn chương, có hoá Khoa thì càng nổi danh.',
    palaces: ['命宫'],
    conditions: { required: ['Văn Xương, Văn Khúc cùng hội tam phương tứ chính Mệnh'] },
    source: 'Tử Vi Đẩu Số Toàn Thư – luận văn tinh',
  });
}

/** 辅弼同会：左辅+右弼都在命三方四正 */
function detectFuBiTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('左辅') || !sanFangSet.has('右弼')) return;
  patterns.push({
    name: 'Tả Hữu Cùng Hội',
    level: 'good',
    description: 'Tả Phù, Hữu Bật cùng hội tam phương tứ chính Mệnh, chủ một đời không thiếu quý nhân, nhân duyên rất tốt. Hợp vị trí lãnh đạo và công việc làm theo nhóm. Đây không phải mệnh đơn độc, nên biết dựa vào các mối quan hệ.',
    palaces: ['命宫'],
    conditions: { required: ['Tả Phù, Hữu Bật cùng hội tam phương tứ chính Mệnh'] },
    source: 'Tử Vi Đẩu Số Toàn Thư – luận Tả Hữu',
  });
}

/** 魁钺同会：天魁+天钺都在命三方四正 */
function detectKuiYueTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('天魁') || !sanFangSet.has('天钺')) return;
  patterns.push({
    name: 'Khôi Việt Cùng Hội',
    level: 'good',
    description: 'Thiên Khôi, Thiên Việt cùng hội tam phương tứ chính Mệnh, có "quý nhân" phù trợ, lúc then chốt thường có người nâng đỡ. Gặp khó khăn sẽ có người giúp, nên chủ động giữ gìn các mối quan hệ.',
    palaces: ['命宫'],
    conditions: { required: ['Thiên Khôi, Thiên Việt cùng hội tam phương tứ chính Mệnh'] },
    source: 'Tử Vi Đẩu Số Toàn Thư – luận Khôi Việt',
  });
}

/** 科权双会：化科 + 化权 同会三方四正 */
function detectKeQuanShuangHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sfPalaces = getSanFangPalaces(chart);
  let hasKe = false, hasQuan = false;
  for (const p of sfPalaces) {
    for (const s of p.stars) {
      if (s.type === 'major' && s.siHua === '科') hasKe = true;
      if (s.type === 'major' && s.siHua === '权') hasQuan = true;
    }
  }
  if (!hasKe || !hasQuan) return;
  patterns.push({
    name: 'Khoa Quyền Song Hội',
    level: 'good',
    description: 'Hoá Khoa và hoá Quyền cùng hội tam phương tứ chính, chủ danh và quyền đều tốt: vừa có học thức, tiếng tăm (Khoa), vừa có năng lực điều hành (Quyền). Hợp con đường chuyên gia như bác sĩ, luật sư, giảng viên, kỹ sư giỏi, danh lợi đều có và nền tảng vững.',
    palaces: ['命宫'],
    conditions: { required: ['Hoá Khoa, hoá Quyền cùng hội tam phương tứ chính Mệnh'] },
    source: 'Tử Vi Đẩu Số Toàn Thư – Tứ Hoá hội chiếu',
  });
}

// ────────────────── 主入口 ──────────────────
export function detectPatterns(chart: ZiweiChart): Pattern[] {
  const patterns: Pattern[] = [];
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!ming) return patterns;

  // 上格
  detectJunChenQingHui(chart, ming, patterns);
  detectZiFu(chart, ming, patterns);
  detectFuXiangChaoYuan(chart, ming, patterns);
  detectYangLiangChangLu(chart, ming, patterns);
  detectHuoTanLingTan(chart, ming, patterns);
  detectWuTan(chart, ming, patterns);
  detectShaPoLang(chart, ming, patterns);
  detectJiYueTongLiang(chart, ming, patterns);

  // 中格
  detectLianXiang(chart, patterns);
  detectWuQiSha(chart, patterns);
  detectTongLiang(chart, patterns);
  detectRiYueTongGong(chart, patterns);
  detectRiYueJiaMing(chart, patterns);
  detectJuRiTongGong(chart, patterns);
  detectShiZhongYinYu(chart, ming, patterns);
  detectMingZhuChuHai(chart, ming, patterns);
  detectZiWeiInMing(chart, ming, patterns);

  // 助力格
  detectFuBiJiaMing(chart, patterns);
  detectChangQuJiaMing(chart, patterns);
  detectKuiYueJiaMing(chart, patterns);
  detectShuangLuChaoYuan(chart, ming, patterns);
  detectSanQiJiaHui(chart, patterns);
  detectHuaLuRuMing(chart, ming, patterns);

  // 恶格
  detectHuaJiRuMingQian(chart, patterns);
  detectYangTuoJiaJi(chart, patterns);
  detectHuoLingJiaMing(chart, patterns);
  detectKongJieJiaMing(chart, patterns);
  detectLianShaYang(chart, patterns);
  detectJuHuoYang(chart, patterns);
  detectLingChangTuoWu(chart, patterns);
  detectMaTouDaiJian(chart, ming, patterns);

  // 基础格局（提升识别覆盖率，让普通命盘也能识别 1-3 个）
  detectLuCunShouShen(chart, patterns);
  detectTianMaRuMing(chart, patterns);
  detectHuaLuRuCai(chart, patterns);
  detectHuaQuanRuGuan(chart, patterns);
  detectHuaKeRuMingShen(chart, patterns);
  detectJiYueTongLiangPartial(chart, ming, patterns);
  detectChangQuTongHui(chart, patterns);
  detectFuBiTongHui(chart, patterns);
  detectKuiYueTongHui(chart, patterns);
  detectKeQuanShuangHui(chart, patterns);

  return patterns;
}

