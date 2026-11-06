import type {ChartView} from './tuvi';
import type {ReadingPeriod,Transformation} from './reading-timing';
import type {ReadingEvidence} from './reading-career';
import {PALACE_MEANINGS} from './reading-rules';
import {GAIN_BY_STAR as GAIN,FRICTION_BY_STAR as FRICTION} from './reading-effects';
import {palaceForAge,deferredAtAge} from './reading-life-stage';
import {transformationChange} from './reading-transitions';

const SCENARIOS:Record<string,string>={
  'Tài Bạch|Mệnh':'Nếu có cơ hội tạo thành quả từ cách làm mới, điểm nghẽn có thể là nhịp quyết định: nhận thêm hướng hoặc đổi kế hoạch quá sớm. Cơ hội và sự sốt ruột cần được đọc cùng nhau.',
  'Mệnh|Nô Bộc':'Nếu năng lực cá nhân được chú ý, chỗ cần tháo gỡ có thể nằm ở mục tiêu và cách phối hợp. Bản thân muốn tiến lên nhưng đội ngũ chưa đi cùng nhịp là một tình huống để đối chiếu.',
  'Phúc Đức|Tài Bạch':'Một hướng theo đuổi có thể tạo cảm giác có ý nghĩa, trong khi cách ghi nhận công sức hoặc phân chia thành quả chưa rõ. Cần phân biệt điều đáng theo đuổi với điều kiện để duy trì nó.',
  'Điền Trạch|Phụ Mẫu':'Nếu sắp xếp lại nơi chốn hoặc nhịp sinh hoạt, điều thuận cho mình có thể cần được thống nhất thêm với người lớn. Trọng tâm là cách phối hợp giữa nhu cầu riêng và kỳ vọng của các thế hệ.',
  'Phụ Mẫu|Phu Thê':'Nếu có một quyết định chung của gia đình, sự hỗ trợ từ người lớn cần được phối hợp với kỳ vọng trong quan hệ đồng hành. Câu hỏi là ai tham gia, ai quyết định và mỗi bên mong đợi điều gì.',
  'Huynh Đệ|Phụ Mẫu':'Sự chia sẻ giữa anh chị em có thể hữu ích trong một việc chung, nhưng yêu cầu hoặc cách hiểu giữa các thế hệ vẫn cần làm rõ. Đây là hai mối quan hệ khác nhau, không thay thế cho nhau.',
  'Phu Thê|Điền Trạch':'Nếu đang có người đồng hành, một mục tiêu chung có thể được hỗ trợ trong khi nơi ở hoặc cách chia việc chưa theo kịp. Với người độc thân, đọc như nhu cầu phối hợp dài hạn thay vì một sự kiện hôn nhân.',
  'Tài Bạch|Nô Bộc':'Một công việc có thể tạo được giá trị chuyên môn nhưng khó triển khai nếu phần việc và cách phối hợp chưa rõ. Cần đọc khả năng tạo thành quả cùng điều kiện để các bên thực hiện được phần đã nhận.',
  'Quan Lộc|Phu Thê':'Nếu nhận vai trò nghề nghiệp rõ hơn, thời gian và trách nhiệm trong quan hệ gần gũi có thể cần được sắp xếp lại. Vấn đề không chỉ là làm được việc, mà là các bên hiểu phạm vi cam kết thế nào.',
  'Quan Lộc|Điền Trạch':'Vai trò công việc có thể mở thêm hướng sử dụng năng lực, đồng thời đòi hỏi điều chỉnh nền sinh hoạt. Một tình huống để đối chiếu là trách nhiệm tăng nhưng cách bố trí thời gian hoặc không gian làm việc chưa phù hợp.',
  'Mệnh|Tài Bạch':'Động lực cá nhân có thể rõ hơn trong khi cách biến công sức thành kết quả vẫn cần điều chỉnh. Có thể đối chiếu sự khác nhau giữa một ý tưởng mình thấy hấp dẫn và việc người khác thật sự cần.',
  'Thiên Di|Mệnh':'Một môi trường mới có thể mở cách sử dụng năng lực, nhưng nhịp thích nghi hoặc kỳ vọng tự đặt vẫn tạo sức ép. Đổi môi trường và thay cách tự tổ chức là hai việc cần đọc cùng nhau.',
  'Thiên Di|Phu Thê':'Nếu quan hệ bên ngoài hoặc phạm vi hoạt động mở rộng, các cam kết gần gũi có thể cần trao đổi lại. Cần xem sự phát triển bên ngoài có đang được phối hợp với mục tiêu chung hay không.',
  'Nô Bộc|Tài Bạch':'Người cùng làm có thể đem lại hỗ trợ, nhưng cách ghi nhận và phân chia kết quả vẫn cần thống nhất. Sự hợp ý lúc bắt đầu chưa tự trả lời được câu hỏi mỗi bên đóng góp và chịu trách nhiệm đến đâu.',
  'Phu Thê|Mệnh':'Sự đồng hành có thể hỗ trợ một mục tiêu, trong khi thói quen tự quyết hoặc nhịp cá nhân vẫn cần điều chỉnh. Có thể đối chiếu khả năng lắng nghe mà vẫn giữ được trách nhiệm với lựa chọn của mình.',
  'Điền Trạch|Tài Bạch':'Nhu cầu xây nền sinh hoạt có thể nổi bật, nhưng cách sử dụng nguồn lực chưa chắc đã theo kịp. Một kế hoạch về nơi chốn cần được đặt cạnh khả năng duy trì công việc và các trách nhiệm đang có.',
  'Tài Bạch|Phu Thê':'Khả năng tạo thành quả có thể được nhấn mạnh trong khi cách cùng quyết và chia trách nhiệm còn vướng. Nếu có việc chung, cần đối chiếu lợi ích của công việc với thời gian và cam kết giữa các bên.',
  'Phúc Đức|Điền Trạch':'Một cách sống có thể đem lại cảm giác có ý nghĩa, nhưng nền sinh hoạt thực tế vẫn cần sắp xếp lại. Có thể đối chiếu sự khác nhau giữa điều muốn duy trì lâu dài và cách thời gian, nơi chốn đang được sử dụng.',
  'Phụ Mẫu|Mệnh':'Sự quan tâm hoặc kinh nghiệm của người lớn có thể là nguồn hỗ trợ, trong khi nhu cầu tự quyết cũng rõ. Chủ đề để đối chiếu là tiếp nhận lời khuyên đến đâu và tự chịu trách nhiệm phần nào.',
  'Huynh Đệ|Nô Bộc':'Sự chia sẻ từ người thân và sự phối hợp với người cùng làm cần được phân biệt. Cách giúp nhau trong quan hệ gần gũi chưa chắc đã phù hợp với vai trò và trách nhiệm trong một công việc chung.',
};
function label(t:Transformation,layer:string){return `${t.star} hóa ${t.type} ${layer} tại ${t.palace} gốc`;}
function evidence(t:Transformation,layer:ReadingEvidence['layer'],year:number):ReadingEvidence{
  return {palace:t.palace!,star:t.star,layer,transformation:t.type,year};
}

export function periodOpportunity(p:ReadingPeriod){
  const gain=p.transformations.find(t=>t.type==='Lộc'),friction=p.transformations.find(t=>t.type==='Kỵ');
  if(!gain?.palace||!friction?.palace||gain.palace==='Tật Ách'||friction.palace==='Tật Ách')return '';
  if(p.age<18)return ''; // Dữ liệu tứ hóa vẫn có; không ghép tình huống người lớn cho trẻ.
  const specific=SCENARIOS[`${gain.palace}|${friction.palace}`],layer=p.range?'đại hạn':'lưu niên';
  const repeatsWholeDecade=p.contextDecade&&p.transformations.length===4&&p.transformations.every(t=>p.contextDecade!.transformations.some(d=>d.star===t.star&&d.type===t.type&&d.palace===t.palace));
  if(repeatsWholeDecade)return `**Liên hệ với đại hạn:** ${label(gain,layer)} và ${label(friction,layer)} lặp đúng cặp chủ đề đã luận ở đại hạn ${p.contextDecade!.range.join('–')} tuổi. Trong năm ${p.year}, lưu niên đặt trọng tâm tại ${p.palace}; cần đọc phần này cùng giai đoạn, không xem là hai sự kiện độc lập.`;
  const movement=GAIN[gain.star],block=FRICTION[friction.star];
  const mechanism=movement&&block?`${gain.star} nhấn vào ${movement}; ${friction.star} đưa điểm vướng về ${block}. `:'';
  if(specific)return `**Cơ hội đi cùng điều kiện nào?** ${label(gain,layer)} đi cùng ${label(friction,layer)}. ${mechanism}${specific}`;
  if(gain.palace===friction.palace)return `**Một chủ đề, hai mặt:** ${label(gain,layer)} và ${label(friction,layer)} cùng nhấn vào ${gain.palace}. ${mechanism}Có thể có điều kiện thuận để bắt đầu nhưng vẫn còn việc cần điều chỉnh để giữ được kết quả; không cộng trừ hai hóa thành một kết luận tốt/xấu duy nhất.`;
  return `**Đọc hai mặt của giai đoạn:** ${label(gain,layer)} đi cùng ${label(friction,layer)}. ${mechanism}Điều thuận ở ${gain.palace} cần đọc cạnh yêu cầu điều chỉnh ở ${friction.palace}, nhất là khi một lựa chọn ảnh hưởng đến cả hai lĩnh vực.`;
}

export interface PeriodRelation {
  id:'natal-change'|'decade-gain-year-friction'|'decade-friction-year-gain'|'same-theme'|'responsibility-reputation';
  evidence:ReadingEvidence[]; text:string;
}
/** So sánh các lớp dựa trên sao + hóa + cung thực tế, không chỉ trùng tên cung hạn. */
export function periodRelations(c:ChartView,p:ReadingPeriod):PeriodRelation[]{
  const results:PeriodRelation[]=[],layer=p.range?'đại hạn':'lưu niên';
  const candidates=[...p.transformations].sort((a,b)=>Number(b.type==='Kỵ')-Number(a.type==='Kỵ'));
  for(const t of candidates){
    if(!t.palace||t.palace==='Tật Ách'||deferredAtAge(t.palace,p.age))continue;
    const base=c.palaces.find(p=>p.name===t.palace)!;
    const natal=[...base.major,...base.minor].find(s=>s.name===t.star&&s.mutagen&&s.mutagen!==t.type);
    if(natal){results.push({id:'natal-change',evidence:[{palace:base.name,star:natal.name,layer:'bản mệnh',transformation:natal.mutagen},evidence(t,layer,p.year)],
      text:`**Bản mệnh và thời điểm:** ${natal.name} hóa ${natal.mutagen} bản mệnh tại ${base.name}, đồng thời ${label(t,layer)}. ${transformationChange(natal.mutagen as Transformation['type'],t.type,base.name,p.age)}${natal.mutagen==='Kỵ'||t.type==='Kỵ'?' Không coi hóa này xóa hóa kia.':''}`});break;}
  }
  const decade=p.contextDecade;
  if(!decade)return results;
  const safe=(t:Transformation)=>!!t.palace&&t.palace!=='Tật Ách'&&!deferredAtAge(t.palace,p.age);
  const yearFriction=p.transformations.find(t=>t.type==='Kỵ'&&safe(t)),yearGain=p.transformations.find(t=>t.type==='Lộc'&&safe(t));
  const decadeGain=decade.transformations.find(t=>t.type==='Lộc'&&safe(t)&&t.palace===yearFriction?.palace);
  const decadeFriction=decade.transformations.find(t=>t.type==='Kỵ'&&safe(t)&&t.palace===yearGain?.palace);
  if(yearFriction&&decadeGain)results.push({id:'decade-gain-year-friction',evidence:[evidence(decadeGain,'đại hạn',p.year),evidence(yearFriction,'lưu niên',p.year)],
    text:`**Nối năm với đại hạn:** ${label(decadeGain,'đại hạn')}, còn ${label(yearFriction,'lưu niên')}. Hướng tạo thành quả của cả giai đoạn có thể vẫn còn, nhưng năm ${p.year} đặt thêm việc cần tháo gỡ tại ${yearFriction.palace}. Đối chiếu cơ hội dài hơn với điều kiện thực hiện của riêng năm này.`});
  else if(yearGain&&decadeFriction)results.push({id:'decade-friction-year-gain',evidence:[evidence(decadeFriction,'đại hạn',p.year),evidence(yearGain,'lưu niên',p.year)],
    text:`**Một khoảng thuận trong chủ đề đang cần điều chỉnh:** ${label(decadeFriction,'đại hạn')} đi cùng ${label(yearGain,'lưu niên')}. Điều kiện thuận của năm ${p.year} có thể giúp xử lý một phần việc lâu hơn tại ${yearGain.palace}; không có nghĩa điểm vướng của cả đại hạn đã tự biến mất.`});
  else{
    const repeated=p.transformations.find(t=>safe(t)&&decade.transformations.some(d=>d.star===t.star&&d.type===t.type&&d.palace===t.palace));
    if(repeated){const d=decade.transformations.find(d=>d.star===repeated.star&&d.type===repeated.type&&d.palace===repeated.palace)!;
      results.push({id:'same-theme',evidence:[evidence(d,'đại hạn',p.year),evidence(repeated,'lưu niên',p.year)],text:`**Chủ đề được nhắc lại ở hai lớp:** ${label(d,'đại hạn')} cũng là ${label(repeated,'lưu niên')}. Năm ${p.year} lặp lại một chủ đề của cả giai đoạn tại ${repeated.palace}; sự trùng này không phải hai lần may/rủi và không xác định chắc một sự kiện.`});
    }else{
      const yearCraft=p.transformations.find(t=>t.type==='Khoa'&&safe(t)),decadePower=decade.transformations.find(t=>t.type==='Quyền'&&safe(t)&&t.palace===yearCraft?.palace);
      if(yearCraft&&decadePower)results.push({id:'responsibility-reputation',evidence:[evidence(decadePower,'đại hạn',p.year),evidence(yearCraft,'lưu niên',p.year)],text:`**Trách nhiệm cần có cách thể hiện năng lực:** ${label(decadePower,'đại hạn')} đi cùng ${label(yearCraft,'lưu niên')}. Trong chủ đề ${palaceForAge(yearCraft.palace!,p.age).meaning}, vai trò cần được nối với khả năng và cách làm rõ thông tin.`});
    }
  }
  return results;
}
export function periodLayers(c:ChartView,p:ReadingPeriod,explained?:Map<string,string>){
  return periodRelations(c,p).map(r=>{
    if(!explained||r.id!=='natal-change')return r.text;
    const key=(p.age<18?'young':p.age>=65?'senior':'adult')+':'+r.evidence.map(e=>`${e.star}|${e.palace}|${e.transformation}`).join('>');
    const earlier=explained.get(key),here=p.range?`đại hạn ${p.range.join('–')} tuổi`:`năm ${p.year}`;
    if(!earlier){explained.set(key,here);return r.text;}
    const [natal,timed]=r.evidence;
    return `**Đối chiếu bản mệnh:** ${natal.star} hóa ${natal.transformation} bản mệnh tại ${natal.palace}, đồng thời hóa ${timed.transformation} ${p.range?'đại hạn':'lưu niên'} tại cung này. Xem cách phối hợp hai hóa đã giải thích ở ${earlier}; ở ${here}, cần đọc thêm nền đại hạn và các hóa còn lại bên trên.`;
  }).join('\n\n');
}
