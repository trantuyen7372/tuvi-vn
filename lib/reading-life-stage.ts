import {PALACE_MEANINGS} from './reading-rules';
type Theme=typeof PALACE_MEANINGS[string];
const YOUNG:Record<string,Theme>={
  'Mệnh':{meaning:'cách học, thử việc mới và hình thành khả năng tự làm',scene:'khi làm quen một hoạt động hoặc nhiệm vụ phù hợp độ tuổi',gain:'có điều kiện thử khả năng và hứng thú mới',power:'nhu cầu tự làm và tham gia quyết định nhỏ rõ hơn',craft:'khả năng học hỏi và diễn đạt điều đã hiểu được chú ý',friction:'nhịp thích nghi hoặc cách tiếp cận việc mới cần được hỗ trợ'},
  'Quan Lộc':{meaning:'quá trình rèn kỹ năng và tham gia nhiệm vụ phù hợp độ tuổi',scene:'khi học một kỹ năng hoặc nhận phần việc trong hoạt động chung',gain:'có điều kiện khám phá khả năng và học thêm kỹ năng',power:'vai trò trong một nhiệm vụ học tập hoặc hoạt động chung được chú ý',craft:'cách học và thể hiện điều đã biết được chú ý',friction:'yêu cầu của một nhiệm vụ có thể cần được điều chỉnh cho phù hợp'},
  'Tài Bạch':{meaning:'cách dùng thời gian, đồ dùng và sự hỗ trợ đang có',scene:'khi sử dụng đồ dùng, thời gian hoặc sự hỗ trợ cho một hoạt động',gain:'có thêm điều kiện hoặc hỗ trợ cho việc học và sinh hoạt',power:'cách sử dụng thời gian và đồ dùng cần rõ hơn',craft:'khả năng sắp xếp và sử dụng điều đang có được chú ý',friction:'cách sử dụng thời gian hoặc đồ dùng có thể cần được hướng dẫn'},
  'Điền Trạch':{meaning:'nền nếp sinh hoạt và môi trường sống',scene:'khi thay đổi một cách sắp xếp sinh hoạt',gain:'điều kiện sinh hoạt và học tập phù hợp được nhấn mạnh',power:'việc sắp xếp nền nếp và hoạt động thường ngày được chú ý',craft:'khả năng hiểu quy tắc và thích nghi với nền nếp được chú ý',friction:'nhịp sinh hoạt hoặc không gian sử dụng có thể cần điều chỉnh'},
  'Nô Bộc':{meaning:'cách tham gia nhóm và trao đổi với bạn bè',scene:'khi cùng học hoặc chơi trong một nhóm',gain:'sự hỗ trợ từ bạn bè hoặc người cùng tham gia được chú ý',power:'vai trò và phần việc trong nhóm được chú ý',craft:'cách hợp tác và trao đổi trong hoạt động chung được chú ý',friction:'khác biệt cách hiểu hoặc cách tham gia có thể cần hướng dẫn'},
  'Thiên Di':{meaning:'cách làm quen môi trường và hoạt động mới',scene:'khi tham gia một môi trường hoặc hoạt động mới',gain:'cơ hội tham gia hoạt động phù hợp độ tuổi được nhấn mạnh',power:'khả năng tham gia và lên tiếng trong nhóm được chú ý',craft:'cách diễn đạt và học hỏi ở môi trường mới được chú ý',friction:'nhịp thích nghi với môi trường mới có thể cần hỗ trợ'},
  'Phụ Mẫu':{meaning:'cách người lớn hướng dẫn và hỗ trợ',scene:'khi cần trao đổi hoặc được hướng dẫn một việc',gain:'điều kiện được chăm lo và hướng dẫn được nhấn mạnh',power:'ranh giới giữa tự làm và cần người lớn giúp được chú ý',craft:'khả năng trao đổi dễ hiểu với người lớn được chú ý',friction:'khác biệt cách hiểu với người hướng dẫn có thể cần làm rõ'},
  'Huynh Đệ':{meaning:'quan hệ với anh chị em hoặc người thân cùng thế hệ',scene:'khi cùng tham gia một hoạt động trong gia đình',gain:'sự chia sẻ trong hoạt động với người thân được chú ý',power:'phần việc và giới hạn phù hợp từng người được chú ý',craft:'cách học hỏi và chia sẻ giữa người thân được chú ý',friction:'cách chia sẻ hoặc thống nhất trong việc chung có thể cần hướng dẫn'},
  'Phúc Đức':{meaning:'nền nếp gia đình và cảm giác thoải mái khi sinh hoạt',scene:'khi tìm một nhịp sinh hoạt dễ thích nghi',gain:'cảm giác được hỗ trợ và có nền sinh hoạt ổn định được nhấn mạnh',power:'khả năng tự sắp xếp trong giới hạn phù hợp được chú ý',craft:'việc nhận ra cách học và sinh hoạt phù hợp được chú ý',friction:'nhịp sinh hoạt hoặc kỳ vọng tự đặt có thể cần điều chỉnh'},
};
export function palaceForAge(name:string,age:number){return age<18?(YOUNG[name]||PALACE_MEANINGS[name]):PALACE_MEANINGS[name];}
export function deferredAtAge(name:string,age:number){return age<18&&['Phu Thê','Tử Nữ'].includes(name);}

export function missingDecadeText(age:number,ranges:[number,number][]){
  const first=Math.min(...ranges.map(r=>r[0])),last=Math.max(...ranges.map(r=>r[1]));
  return age<first?`Tuổi đang xem chưa có đại hạn tương ứng; đại hạn đầu bắt đầu từ ${first} tuổi âm.`:
    age>last?`Tuổi đang xem nằm ngoài các khoảng đại hạn ${first}–${last} tuổi âm trong dữ liệu an sao; không suy thêm đại hạn.`:
    'Chưa đối chiếu được đại hạn tương ứng với tuổi đang xem; không tự gán một cung hạn.';
}
