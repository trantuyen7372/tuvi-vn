import type {ChartView,PalaceView} from './tuvi';
import type {ReadingTiming} from './reading-timing';
import {careerBridge,careerQuestion,type ReadingEvidence,type ConfigurationEvidence} from './reading-career';
import {PALACE_MEANINGS,STAR_MEANINGS,combinationReading} from './reading-rules';
import {frictionEffect,gainEffect} from './reading-effects';
import {palaceForAge} from './reading-life-stage';

export interface ReadingInsight {
  id:string; topic:string; title:string; summary:string; watch:string;
  evidence:ReadingEvidence[]; palaces:string[];
  configuration?:ConfigurationEvidence;
}
interface Candidate extends ReadingInsight {order:number}
const natal=(p:PalaceView):ReadingEvidence[]=>p.major.map(s=>({palace:p.name,star:s.name,layer:'bản mệnh',transformation:s.mutagen,brightness:s.brightness}));
const BODY:Record<string,{title:string;summary:string;watch:string}>={
  'Mệnh':{title:'Cách tự quyết và cách hành động cần đi cùng nhau',summary:'Mệnh và Thân cùng cung làm nổi bật sự nhất quán giữa điều muốn theo đuổi và việc thực sự làm. Khi đối chiếu một giai đoạn thay đổi, có thể xem quyết định mới đã chuyển thành một nhịp sống duy trì được hay chưa.',watch:'Điểm cần đọc là sự khác nhau giữa một quyết định có sức bật lúc đầu và khả năng theo đến cùng.'},
  'Tài Bạch':{title:'Thành quả là một trọng tâm của quá trình trưởng thành',summary:'Thân cư Tài Bạch đưa việc sử dụng công sức và nguồn lực vào trọng tâm. Có thể đọc theo câu hỏi: kết quả đang tạo thêm sự tự chủ, hay chỉ khiến mình tiếp tục phải dành nhiều công sức hơn?',watch:'Cần tách khả năng làm ra kết quả với khả năng giữ một nhịp sống ổn định quanh kết quả ấy.'},
  'Quan Lộc':{title:'Vai trò lớn hơn cần một cách làm có thể duy trì',summary:'Thân cư Quan Lộc làm nổi rõ mối liên hệ giữa quá trình trưởng thành và trách nhiệm nghề nghiệp. Nếu vai trò tăng, điều cần xem thêm là cách phân công và phạm vi quyền quyết định có theo kịp hay không.',watch:'Không mặc định phải có chức vụ; ngay một vai trò chuyên môn sâu cũng có thể trở thành chỗ người khác phụ thuộc vào mình.'},
  'Thiên Di':{title:'Môi trường có thể làm năng lực bộc lộ khác nhau',summary:'Thân cư Thiên Di nhấn vào quan hệ giữa quá trình trưởng thành và môi trường ngoài phạm vi quen thuộc. Có thể đối chiếu việc cùng một năng lực nhưng được sử dụng khác nhau ở các nhóm hoặc cách phối hợp khác nhau.',watch:'Thay môi trường chỉ có ý nghĩa khi vai trò và điều kiện thực hiện phù hợp; không từ cung này suy ra chắc chắn đi xa.'},
  'Phúc Đức':{title:'Cảm giác an ổn cần được đọc cùng thành quả bên ngoài',summary:'Thân cư Phúc Đức đặt thêm trọng tâm vào điều tạo cảm giác có nền và có ý nghĩa. Một việc đạt kết quả bên ngoài có thể vẫn cần thời gian để phù hợp với nhịp sống hoặc tiêu chuẩn bên trong.',watch:'Cần đối chiếu điều mình thực sự muốn duy trì, thay vì chỉ nhìn khối lượng việc đã hoàn thành.'},
  'Phu Thê':{title:'Các quyết định dài hạn cần tính đến sự đồng hành',summary:'Thân cư Phu Thê nhấn vào vai trò của quan hệ đồng hành trong quá trình trưởng thành. Nếu đang có đôi, có thể đối chiếu cách cùng quyết và chia trách nhiệm; nếu độc thân, đây là chủ đề về nhu cầu gắn bó về sau.',watch:'Cung Thân không xác định tình trạng hôn nhân hiện tại hoặc buộc bạn phải phụ thuộc vào một người khác.'},
};

export function selectReadingInsights(c:ChartView,timing:ReadingTiming):ReadingInsight[]{
  const candidates:Candidate[]=[],menh=c.palaces.find(p=>p.name==='Mệnh')!,body=c.palaces.find(p=>p.isBody)!;
  const minor=c.nominalAge<18,bridge=careerBridge(c);
  if(!minor)candidates.push({id:'career-'+bridge.id,topic:'career',order:bridge.specific?100:65,title:bridge.title,summary:bridge.summary,watch:'Câu hỏi để đối chiếu: '+careerQuestion(bridge),evidence:bridge.evidence,palaces:['Quan Lộc','Tài Bạch'],configuration:bridge.configuration});
  const combo=combinationReading(menh);
  const selfSupport=menh.minor.filter(s=>['Kình Dương','Đà La','Tả Phù','Hữu Bật','Văn Xương','Văn Khúc'].includes(s.name));
  const supportExplanation=menh.major.length===1&&selfSupport.length?` ${selfSupport.map(s=>s.name).join(', ')} đi cùng bổ sung yêu cầu về nhịp hành động, cách phối hợp hoặc chuyên môn; vì thế cần đọc cả chính tinh lẫn sao đi kèm.`:' Các nét này cần đọc cùng nhau, thay vì chọn một sao để mô tả toàn bộ tính cách.';
  if(combo&&menh.major.length)candidates.push({id:'self-combination',topic:'self',order:86,title:`Cách khởi đầu chịu ảnh hưởng của ${menh.major.map(s=>s.name).join(' và ')}`,
    summary:menh.major.map(s=>`${s.name} mang nét ${STAR_MEANINGS[s.name]?.core||'cần đọc cùng toàn cục'}`).join('; ')+(menh.minor.some(s=>s.name==='Kình Dương')?'. Kình Dương thêm nhịp quyết nhanh, nên sức mở đầu cần đi cùng khả năng theo việc.':'.'+supportExplanation),watch:minor?'Ở tuổi đang xem, đối chiếu qua cách tiếp cận việc học, hoạt động và người xung quanh.':'Đối chiếu cách bắt đầu một việc với khả năng giữ nhịp khi việc ấy trở nên thường xuyên.',evidence:[...natal(menh),...selfSupport.map(s=>({palace:menh.name,star:s.name,layer:'bản mệnh' as const,transformation:s.mutagen,brightness:s.brightness}))],palaces:['Mệnh']});
  const current=timing.decades.find(p=>p.range&&p.range[0]<=c.nominalAge&&p.range[1]>=c.nominalAge);
  if(current&&current.palace!=='Tật Ách'){
    const gain=current.transformations.find(t=>t.type==='Lộc'&&t.palace&&t.palace!=='Tật Ách'),friction=current.transformations.find(t=>t.type==='Kỵ'&&t.palace&&t.palace!=='Tật Ách');
    const affected=[current.palace,gain?.palace,friction?.palace].filter((p):p is string=>!!p);
    if(gain||friction)candidates.push({id:'current-decade',topic:'time',order:94,title:`${current.range!.join('–')} tuổi: ${current.palace==='Tử Nữ'?'chủ đề con cái và trách nhiệm giữa các thế hệ, nếu có liên quan':palaceForAge(current.palace,c.nominalAge).meaning}`,
      summary:minor?`Đây là đại hạn đang xét, không phải giai đoạn làm việc của người lớn. Các chủ đề ${palaceForAge(current.palace,c.nominalAge).meaning} cần được đọc trong bối cảnh học tập, sinh hoạt và sự chăm lo phù hợp độ tuổi.`:
        `${gain?`${gain.star} hóa Lộc tại ${gain.palace}: ${gainEffect(gain.star,PALACE_MEANINGS[gain.palace!].meaning,PALACE_MEANINGS[gain.palace!].gain)}.`:''} ${friction?`${friction.star} hóa Kỵ tại ${friction.palace}: ${frictionEffect(friction.star,PALACE_MEANINGS[friction.palace!].meaning,PALACE_MEANINGS[friction.palace!].friction)}.`:''}`.trim(),
      watch:gain&&friction?'Hai mặt được đặt trong cùng một giai đoạn, không rút gọn thành một mốc tuổi tự mang lại thành công hay thất bại.':gain?'Phần thuận này cần đặt trong toàn bộ cung hạn và điều kiện thực hiện, chưa đủ để kết luận cả giai đoạn.':'Điểm cần tháo gỡ này không thay thế các mặt khác của giai đoạn.',
      evidence:[gain,friction].filter((t):t is NonNullable<typeof t>=>!!t).map(t=>({palace:t.palace!,star:t.star,layer:'đại hạn',transformation:t.type,year:current.year})),palaces:[...new Set(affected)]});
  }
  const pressured=c.palaces.find(p=>!['Tật Ách','Tử Nữ'].includes(p.name)&&[...p.major,...p.minor].some(s=>s.mutagen==='Kỵ'));
  const supported=c.palaces.find(p=>p.name!=='Tật Ách'&&[...p.major,...p.minor].filter(s=>['Lộc','Quyền','Khoa'].includes(s.mutagen||'')).length>=2);
  if(supported&&(!minor||['Mệnh','Phúc Đức','Phụ Mẫu','Huynh Đệ'].includes(supported.name))){
    const stars=[...supported.major,...supported.minor].filter(s=>['Lộc','Quyền','Khoa'].includes(s.mutagen||''));
    candidates.push({id:'natal-support',topic:'support',order:88,title:`${supported.name}: các mặt hỗ trợ cần được nối với nhau`,
      summary:stars.map(s=>`${s.name} hóa ${s.mutagen} nhấn vào ${s.mutagen==='Lộc'?PALACE_MEANINGS[supported.name].gain:s.mutagen==='Quyền'?PALACE_MEANINGS[supported.name].power:PALACE_MEANINGS[supported.name].craft}`).join('; ')+'.',
      watch:'Cần đọc cách sử dụng điều kiện thuận trong hoàn cảnh thực tế, cùng phụ tinh và trách nhiệm đi kèm; không xem số lượng hóa là mức bảo đảm kết quả.',
      evidence:stars.map(s=>({palace:supported.name,star:s.name,layer:'bản mệnh',transformation:s.mutagen})),palaces:[supported.name]});
  }
  if(pressured&&(!minor||['Mệnh','Phúc Đức','Phụ Mẫu','Huynh Đệ'].includes(pressured.name))){
    const star=[...pressured.major,...pressured.minor].find(s=>s.mutagen==='Kỵ')!;
    const repeatedInCurrent=current?.transformations.some(t=>t.star===star.name&&t.type===star.mutagen&&t.palace===pressured.name);
    if(!repeatedInCurrent)candidates.push({id:'natal-pressure',topic:'inner-pattern',order:81,title:`${pressured.name}: một điểm dễ phải điều chỉnh nhiều lần`,
      summary:`${star.name} hóa Kỵ bản mệnh tại ${pressured.name}: ${frictionEffect(star.name,PALACE_MEANINGS[pressured.name].meaning,PALACE_MEANINGS[pressured.name].friction)}.`,
      watch:'Đây là một nét để đối chiếu qua nhiều hoàn cảnh; không gán mọi trở ngại trong một năm cho riêng sao này.',evidence:[{palace:pressured.name,star:star.name,layer:'bản mệnh',transformation:'Kỵ'}],palaces:[pressured.name]});
  }
  if(BODY[body.name]&&!(minor&&['Tài Bạch','Quan Lộc','Phu Thê'].includes(body.name)))candidates.push({id:'body-'+body.name,topic:body.name==='Mệnh'?'self':'body',order:75,...BODY[body.name],evidence:natal(body),palaces:[body.name],configuration:{type:'body',palace:body.name,branch:body.branch}});
  // Dự phòng dựa vào vị trí thực, để cấu trúc nào cũng có ít nhất ba điểm để đọc.
  for(const name of minor?['Mệnh','Phụ Mẫu','Phúc Đức']:['Mệnh','Phu Thê','Phúc Đức']){
    const p=c.palaces.find(p=>p.name===name)!;
    candidates.push({id:'palace-'+name,topic:name==='Mệnh'?'self':name,order:40,title:`${name}: ${PALACE_MEANINGS[name].meaning}`,
      summary:p.major.length?p.major.map(s=>`${s.name} gợi nét ${STAR_MEANINGS[s.name]?.core||'cần đọc cùng toàn cục'}`).join('; ')+'.':`${name} vô chính diệu, cần đọc thêm đối cung và các sao đi kèm thay vì kết luận thiếu lĩnh vực này.`,
      watch:minor?name==='Mệnh'?'Đối chiếu cách tiếp cận một hoạt động mới và khả năng duy trì hứng thú.':name==='Phụ Mẫu'?'Đối chiếu cách người lớn trao đổi, hướng dẫn và dành chỗ cho khả năng tự làm của trẻ.':'Đối chiếu nền nếp sinh hoạt và môi trường giúp trẻ dễ thích nghi.':`Có thể đối chiếu ${PALACE_MEANINGS[name].scene}.`,evidence:natal(p),palaces:[name],configuration:p.major.length?undefined:{type:'void',palace:p.name,branch:p.branch}});
  }
  const selected:ReadingInsight[]=[],topics=new Set<string>();
  for(const candidate of candidates.sort((a,b)=>b.order-a.order)){
    if(topics.has(candidate.topic))continue;
    if(candidate.order<70&&selected.length>=3)continue;
    const {order:_,...insight}=candidate;selected.push(insight);topics.add(candidate.topic);
    if(selected.length===5)break;
  }
  return selected;
}

export function insightEvidenceText(evidence:ReadingEvidence[]){
  return evidence.map(e=>`${e.star}${e.brightness?` (${e.brightness})`:''}${e.transformation?` hóa ${e.transformation}`:''} tại ${e.palace}${e.layer!=='bản mệnh'?` (${e.layer})`:''}`).join('; ');
}
export function readingInsightsText(insights:ReadingInsight[]){
  return insights.map((i,index)=>{
    const cfg=i.configuration,structural=cfg?cfg.type==='body'?`Thân cư ${cfg.palace} tại ${cfg.branch}`:`${cfg.palace} tại ${cfg.branch} vô chính diệu`:'';
    const basis=[structural,insightEvidenceText(i.evidence)].filter(Boolean).join('; ');
    return `### ${index+1}. ${i.title}\n\n${basis?`**Căn cứ:** ${basis}.\n\n`:''}${i.summary}\n\n${i.watch}`;
  }).join('\n\n');
}

export function ageContext(c:ChartView){
  if(c.nominalAge<18)return 'Ở tuổi đang xem, các phần công danh, tài lộc và quan hệ đồng hành là chủ đề dài hạn để tham khảo. Không giả định người đọc đã đi làm, có thu nhập hoặc có gia đình; các năm trước 18 tuổi được đặt trong việc học, sinh hoạt và sự chăm lo.';
  if(c.nominalAge>=65)return 'Các phần nghề nghiệp và nguồn lực cần đối chiếu với hoạt động thực tế, không giả định người đọc đang làm việc hay đã nghỉ hưu. Mốc tuổi trong bài là phạm vi đại hạn của cách an sao, không dự báo tuổi thọ.';
  return '';
}
