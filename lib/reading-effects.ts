/** Từ vựng dùng chung để bản mệnh và các lớp hạn không diễn giải ngược nhau. */
export const GAIN_BY_STAR:Record<string,string>={
  'Phá Quân':'thay một cách làm hoặc cấu trúc không còn hiệu quả','Tham Lang':'kết nối và thử một khả năng mới',
  'Vũ Khúc':'hiệu quả thực hiện và cách quản lý nguồn lực','Cự Môn':'giải thích, trao đổi và thống nhất điều kiện',
  'Thiên Cơ':'kỹ năng và phương án giải quyết vấn đề','Thiên Đồng':'sự thích nghi và cách phối hợp lâu dài',
  'Thái Dương':'đóng góp được nhìn thấy và vai trò đứng ra','Thái Âm':'sự chuẩn bị kỹ và tích lũy',
  'Liêm Trinh':'chuyên môn, nguyên tắc và sự gắn bó','Thiên Lương':'kinh nghiệm và cách giữ chất lượng',
};
export const FRICTION_BY_STAR:Record<string,string>={
  'Tham Lang':'quá nhiều hướng theo đuổi','Thiên Cơ':'đổi phương án hoặc chưa thống nhất cách làm',
  'Cự Môn':'khác biệt cách hiểu và lý lẽ','Văn Xương':'thông tin, cách trình bày hoặc điều kiện đã ghi nhận',
  'Văn Khúc':'cách diễn đạt và đánh giá giá trị công sức','Vũ Khúc':'tiêu chuẩn kết quả hoặc cách kiểm soát nguồn lực',
  'Thái Âm':'điều còn bận lòng nhưng chưa dễ nói rõ','Thái Dương':'trách nhiệm đứng ra và sức gánh cho người khác',
  'Thiên Đồng':'sự chần chừ trước điều phải thay đổi','Liêm Trinh':'ranh giới, cam kết và sự tin tưởng',
};
export function frictionEffect(star:string,theme:string,fallback:string){
  const specific=FRICTION_BY_STAR[star];
  return specific?`${specific} có thể là điểm vướng khi xét ${theme}`:fallback;
}
export function gainEffect(star:string,theme:string,fallback:string){
  const specific=GAIN_BY_STAR[star];
  return specific?`${specific} có thể tạo điều kiện thuận cho ${theme}`:fallback;
}
