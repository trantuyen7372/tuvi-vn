export const READING_FOCUS={career:'Công việc và nguồn lực',relationship:'Tình cảm và đồng hành',family:'Gia đình và sinh hoạt'} as const;
export type ReadingFocus=keyof typeof READING_FOCUS;
export const READING_SITUATIONS:Record<ReadingFocus,Record<string,string>>={
  career:{studying:'Đang học hoặc rèn kỹ năng',working:'Đang làm việc',changing:'Đang cân nhắc đổi hướng',inactive:'Hiện không tham gia công việc'},
  relationship:{single:'Đang độc thân',partnered:'Đang có người đồng hành'},
  family:{shared:'Đang sắp xếp sinh hoạt chung',parents:'Quan tâm quan hệ với cha mẹ',children:'Quan tâm việc chăm lo con cái'},
};
export interface ReadingPreferences{focus:ReadingFocus;situation?:string;note?:string}
export function validateReadingPreferences(raw:unknown):ReadingPreferences|undefined{
  if(raw==null)return undefined;
  if(typeof raw!=='object'||Array.isArray(raw))throw Error('Lựa chọn chủ đề không hợp lệ');
  const r=raw as Record<string,unknown>;
  if(!r.focus&&!r.situation&&!r.note)return undefined;
  if(typeof r.focus!=='string'||!Object.hasOwn(READING_FOCUS,r.focus))throw Error('Vui lòng chọn chủ đề muốn đọc');
  const focus=r.focus as ReadingFocus;
  if(r.situation!=null&&typeof r.situation!=='string')throw Error('Hoàn cảnh không hợp lệ');
  const situation=String(r.situation||'');
  if(situation&&!Object.hasOwn(READING_SITUATIONS[focus],situation))throw Error('Hoàn cảnh không phù hợp chủ đề đã chọn');
  if(r.note!=null&&typeof r.note!=='string')throw Error('Ghi chú không hợp lệ');
  const note=String(r.note||'').normalize('NFC').trim();
  if(note.length>400)throw Error('Ghi chú tối đa 400 ký tự');
  if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(note))throw Error('Ghi chú có ký tự không hợp lệ');
  return {focus,...(situation?{situation}:{}),...(note?{note}: {})};
}
export function escapeReadingNote(text:string){return text.replace(/\s+/gu,' ').replace(/[\\`*_{}\[\]<>()#!|~>]/g,'\\$&');}
export function preferencesText(p:ReadingPreferences|undefined,age:number){
  if(!p)return '';
  const status=p.situation?READING_SITUATIONS[p.focus][p.situation]:'';
  const guide=p.focus==='career'?(age<18?'Đọc chủ đề này qua việc học và rèn kỹ năng phù hợp độ tuổi.':p.situation==='changing'?'Khi đọc các chặng dưới đây, ưu tiên phân biệt nhu cầu đổi hướng với điều kiện thực hiện: kỹ năng, phạm vi trách nhiệm và nguồn lực đang có.':p.situation==='inactive'?'Đọc qua hoạt động và nguồn lực hiện có, không mặc định bạn đang đi làm hoặc cần nhận chức vụ.':'Ưu tiên nối vai trò công việc với cách tạo và giữ thành quả, thay vì chỉ tìm một mốc thăng tiến.'):
    p.focus==='relationship'?(age<18?'Ở độ tuổi này, chưa dùng chủ đề đã chọn để luận quan hệ đôi lứa.':p.situation==='single'?'Đọc qua nhu cầu gắn bó và khả năng cùng xây kế hoạch; không coi cung hạn là bằng chứng đã có người yêu hoặc sắp kết hôn.':'Ưu tiên cách trao đổi, cùng quyết và chia trách nhiệm; không từ một hóa riêng suy ra chia tay hoặc kết hôn.'):
    p.situation==='parents'?'Ưu tiên cách tiếp nhận sự hỗ trợ và trao đổi giữa các thế hệ; không từ sao suy ra sức khỏe hay biến cố của cha mẹ.':p.situation==='children'?(age<18?'Chủ đề con cái chỉ được ghi nhận cho dài hạn, chưa diễn thành hoàn cảnh hiện tại.':'Ưu tiên cách chăm lo và chia trách nhiệm nếu có liên quan; không suy ra khả năng sinh sản hoặc sự kiện sinh con.'):'Ưu tiên cách sắp xếp nơi ở, thời gian và trách nhiệm trong sinh hoạt chung; không đồng nhất thay đổi nền nếp với mua bán nhà đất.';
  return `**Chủ đề bạn chọn:** ${READING_FOCUS[p.focus]}.\n\n${status||p.note?`**Thông tin bạn cung cấp, chưa được xác minh:** ${[status,p.note?`“${escapeReadingNote(p.note)}”`:''].filter(Boolean).join(' · ')}.\n\n`:''}${guide} Lựa chọn này giúp ưu tiên cách đọc, không thay đổi vị trí sao hoặc được dùng làm bằng chứng cho lời luận. Ghi chú được giữ để bạn đối chiếu, không tự suy diễn thành sự kiện.`;
}
