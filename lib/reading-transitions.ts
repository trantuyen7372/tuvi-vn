import type {Transformation} from './reading-timing';
import {palaceForAge} from './reading-life-stage';

type Hua=Transformation['type'];
/** Diễn giải sự đổi trọng tâm, không phải bảng cộng/trừ cát hung. */
const CHANGES:Record<string,string>={
  'Lộc>Quyền':'từ điều kiện thuận để tạo kết quả sang quyền chủ động và phần trách nhiệm khi thực hiện',
  'Lộc>Khoa':'từ điều kiện tạo thành quả sang cách làm rõ chất lượng, kiến thức và giá trị của phần đã làm',
  'Lộc>Kỵ':'từ một mặt có điều kiện thuận sang điều cần tháo gỡ để điều kiện ấy tiếp tục phát huy',
  'Quyền>Lộc':'từ phần tự quyết và trách nhiệm sang cách dùng vai trò ấy để tạo kết quả có ích',
  'Quyền>Khoa':'từ việc đứng ra quyết sang cách chứng minh năng lực và giải thích cơ sở của quyết định',
  'Quyền>Kỵ':'từ nhu cầu nắm vai trò sang giới hạn hoặc điều kiện khiến vai trò ấy khó thực hiện như mong muốn',
  'Khoa>Lộc':'từ kiến thức và cách làm được coi trọng sang việc sử dụng chúng để tạo một kết quả cụ thể',
  'Khoa>Quyền':'từ phần hiểu biết sang trách nhiệm lựa chọn, tổ chức hoặc hướng dẫn người khác thực hiện',
  'Khoa>Kỵ':'từ mặt coi trọng sự rõ ràng và chất lượng sang chỗ còn khác biệt cách hiểu hoặc cần kiểm tra lại',
  'Kỵ>Lộc':'từ một điểm thường phải điều chỉnh sang điều kiện thuận hơn để thử cách tháo gỡ',
  'Kỵ>Quyền':'từ điều còn vướng sang nhu cầu chủ động xử lý và xác định trách nhiệm rõ hơn',
  'Kỵ>Khoa':'từ một điểm khó sang việc hiểu rõ nguyên nhân, học thêm hoặc làm rõ thông tin để xử lý',
};
const IMPLICATIONS:Record<string,string>={
  'Mệnh':'Vì vậy, xu hướng cần theo dõi là cách tự quyết và duy trì thói quen sau lựa chọn ban đầu.',
  'Quan Lộc':'Nếu vai trò công việc thay đổi, kết quả còn phụ thuộc phạm vi được quyết, nguồn lực và phần trách nhiệm thực sự được giao.',
  'Tài Bạch':'Về nguồn lực, cần nối kết quả tạo ra với điều kiện ghi nhận và sử dụng; có thành quả chưa đồng nghĩa giữ được thành quả.',
  'Điền Trạch':'Ở chuyện nơi ở, xu hướng này thể hiện qua cách sắp xếp sinh hoạt và chia trách nhiệm; chưa đủ để suy ra mua bán nhà đất.',
  'Thiên Di':'Khi ra môi trường khác, khả năng thích nghi và cam kết với bên ngoài là điều kiện để năng lực được sử dụng lâu dài.',
  'Nô Bộc':'Trong việc chung, phần việc và tiêu chuẩn kết quả cần được thống nhất; hợp ý ban đầu chưa bảo đảm phối hợp bền.',
  'Phu Thê':'Nếu đang có người đồng hành, trọng tâm là điều chỉnh cách cùng quyết và chia trách nhiệm; nếu độc thân, đọc như nhu cầu gắn bó về sau.',
  'Phúc Đức':'Biểu hiện để đối chiếu là sự thay đổi giữa điều đem lại cảm giác có ý nghĩa và nhịp sống thực sự duy trì được.',
  'Phụ Mẫu':'Sự hỗ trợ của người lớn cần được đặt cạnh quyền tự quyết, nhất là khi lời khuyên và lựa chọn riêng chưa cùng hướng.',
  'Huynh Đệ':'Nếu có việc chung với anh chị em, mức hỗ trợ cần phù hợp khả năng từng người; quan hệ gần gũi không thay thế thỏa thuận rõ ràng.',
  'Tử Nữ':'Nếu chủ đề con cái có liên quan, đọc qua cách trao đổi và chia trách nhiệm giữa các thế hệ, chưa suy ra một sự kiện sinh con.',
};
export function transformationChange(from:Hua,to:Hua,palace:string,age:number){
  const change=CHANGES[`${from}>${to}`];
  if(!change||palace==='Tật Ách')return '';
  if(age<18&&['Phu Thê','Tử Nữ'].includes(palace))return '';
  const theme=palaceForAge(palace,age).meaning;
  const question=age<18?`Ở tuổi đang xem, đối chiếu qua ${theme}, chưa diễn thành sự kiện của người lớn.`:age>=65&&['Quan Lộc','Tài Bạch'].includes(palace)?'Nếu còn tham gia công việc hoặc hoạt động chung, đọc qua cách sử dụng kinh nghiệm và điều kiện thực hiện phù hợp hiện tại.':IMPLICATIONS[palace];
  return `Cách đọc ở ${palace} chuyển trọng tâm ${change}. ${question||'Cần đối chiếu điều kiện thực tế trước khi nêu một tình huống cụ thể.'}`;
}
