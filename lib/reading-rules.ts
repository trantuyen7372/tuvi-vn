import type {PalaceView, StarView} from './tuvi';
import {frictionEffect} from './reading-effects';

/** Diễn giải biên tập theo biểu tượng truyền thống, không phải xác suất dự báo. */
interface StarMeaning {core:string;work:string;money:string;bond:string;inner:string}
export const STAR_MEANINGS: Record<string,StarMeaning>={
  'Tử Vi':{core:'tổ chức, tự chủ và vị trí chịu trách nhiệm',work:'điều phối nguồn lực, đại diện tập thể hoặc đứng ra quyết định',money:'quản lý nguồn lực và giá trị của vị trí đảm nhiệm',bond:'mong muốn được tôn trọng và có tiếng nói trong việc chung',inner:'dễ tự đặt yêu cầu phải giữ được vai trò và sự vững vàng'},
  'Thiên Cơ':{core:'suy tính, kỹ năng và sự linh hoạt',work:'phân tích, thiết kế cách làm, kỹ thuật hoặc tham mưu',money:'tạo giá trị từ kiến thức và việc giải quyết vấn đề',bond:'cần sự trao đổi và khả năng cùng điều chỉnh kế hoạch',inner:'thường tìm phương án khác khi chuyện chưa đi đúng ý'},
  'Thái Dương':{core:'sự chủ động, chia sẻ và trách nhiệm với bên ngoài',work:'đứng ra trình bày, hướng dẫn hoặc đại diện cho công việc',money:'thành quả gắn với đóng góp được nhìn thấy và công sức bỏ ra',bond:'có nhu cầu chăm lo và làm rõ trách nhiệm giữa các bên',inner:'có thể khó yên tâm khi cảm thấy mình chưa làm đủ cho người khác'},
  'Vũ Khúc':{core:'thực thi, kỷ luật và giá trị đo được',work:'quản lý vận hành, kỹ thuật hoặc những việc cần kết quả rõ ràng',money:'quan tâm hiệu quả, khả năng kiểm soát và tích lũy nguồn lực',bond:'thường thể hiện sự quan tâm bằng hành động thiết thực',inner:'dễ tự đánh giá qua việc mình đã làm được và giữ được bao nhiêu'},
  'Thiên Đồng':{core:'sự hòa nhã, thích nghi và nhu cầu yên ổn',work:'phối hợp, phục vụ hoặc tạo môi trường làm việc dễ tiếp cận',money:'ưu tiên nhịp sống có thể duy trì, thay vì chỉ mở rộng quy mô',bond:'cần cảm giác dễ chia sẻ và được quan tâm',inner:'coi trọng sự thoải mái, nhưng có thể chần chừ trước việc phải thay đổi'},
  'Liêm Trinh':{core:'nguyên tắc, ranh giới và sự gắn bó',work:'giữ chuẩn mực, xử lý quan hệ trách nhiệm hoặc thể hiện kỹ năng riêng',money:'giá trị của chuyên môn cần đi cùng thỏa thuận rõ ràng',bond:'nhạy với sự tin tưởng, cam kết và điều gì được xem là công bằng',inner:'dễ bận lòng khi việc thực tế khác với nguyên tắc mình coi trọng'},
  'Thiên Phủ':{core:'giữ gìn, tổ chức và tạo sự ổn định',work:'quản lý việc thường xuyên, duy trì nguồn lực và xây nền vận hành',money:'chú trọng khả năng giữ và sử dụng nguồn lực có kế hoạch',bond:'cần sự đáng tin và cách cùng chăm lo đời sống lâu dài',inner:'muốn có một nền tảng chắc trước khi yên tâm thay đổi'},
  'Thái Âm':{core:'sự tinh tế, chăm lo và tích lũy',work:'chuẩn bị kỹ, làm việc có chiều sâu hoặc hỗ trợ phía sau',money:'thiên về gom góp, tính toán dài hơn và chú ý phần dự phòng',bond:'coi trọng sự thấu hiểu và những hỗ trợ kín đáo',inner:'thường suy xét lâu và giữ lại những điều chưa dễ nói ra'},
  'Tham Lang':{core:'khám phá, kết nối và động lực mở rộng',work:'tìm cơ hội, phát triển quan hệ hoặc thử một cách tiếp cận mới',money:'tìm nguồn tạo giá trị mới và khai thác năng lực đa dạng',bond:'coi trọng sức hút, sự tương tác và cảm giác cùng phát triển',inner:'dễ muốn theo nhiều hướng khi cùng lúc nhìn thấy nhiều khả năng'},
  'Cự Môn':{core:'lý lẽ, lời nói và việc làm rõ vấn đề',work:'phân tích, giải thích, thương lượng hoặc phát hiện chỗ chưa hợp lý',money:'tạo giá trị bằng hiểu biết, diễn đạt và thống nhất điều kiện hợp tác',bond:'cần nói rõ để hiểu nhau, nhưng có thể mắc vào tranh luận đúng sai',inner:'thường tiếp tục suy nghĩ về điều chưa được giải thích thỏa đáng'},
  'Thiên Tướng':{core:'trách nhiệm, phối hợp và giữ sự công bằng',work:'điều phối, hỗ trợ quyết định và giữ việc chung vận hành có trật tự',money:'thành quả gắn với vai trò được tin cậy và cách phối hợp',bond:'cần sự tương xứng trong việc cho, nhận và chia trách nhiệm',inner:'dễ cảm thấy mình phải đứng ra giữ ổn thỏa cho nhiều phía'},
  'Thiên Lương':{core:'nguyên tắc, sự nâng đỡ và kinh nghiệm',work:'hướng dẫn, kiểm soát chất lượng hoặc giải quyết việc bằng kinh nghiệm',money:'coi trọng giá trị bền và uy tín của cách làm',bond:'mong muốn chăm lo, bảo vệ và giữ chuẩn mực trong quan hệ',inner:'thường tự hỏi việc mình làm có đúng và có giúp được người khác không'},
  'Thất Sát':{core:'quyết đoán, kỷ luật và sức gánh việc khó',work:'nhận trách nhiệm lớn, xử lý trở ngại hoặc quyết định trong điều kiện áp lực',money:'thành quả gắn với mức khó của nhiệm vụ và trách nhiệm đảm nhận',bond:'cần sự thẳng thắn và độc lập, nhưng dễ thiếu khoảng mềm khi trao đổi',inner:'có thể quen tự gánh và khó buông việc khi chưa đạt kết quả'},
  'Phá Quân':{core:'thay đổi, tháo gỡ cái cũ và tổ chức lại',work:'cải tổ một cách vận hành, mở hướng mới hoặc xử lý việc đang bế tắc',money:'nguồn tạo giá trị có thể đổi theo mô hình, sản phẩm hoặc vai trò',bond:'cần khả năng cùng điều chỉnh khi hoàn cảnh thay đổi',inner:'khó bằng lòng với cách cũ khi thấy nó không còn hiệu quả'},
};
interface PalaceMeaning {meaning:string;scene:string;gain:string;power:string;craft:string;friction:string}
export const PALACE_MEANINGS:Record<string,PalaceMeaning>={
  'Mệnh':{meaning:'cách tiếp cận cuộc sống và quyết định',scene:'khi nhận một cơ hội mới, phản ứng đầu tiên và giới hạn bạn đặt cho mình',gain:'năng lực cá nhân có cơ hội được sử dụng rõ hơn',power:'mong muốn tự quyết và chủ động thể hiện rõ hơn',craft:'cách trình bày năng lực và gây dựng sự tin cậy được chú ý',friction:'mong muốn của bản thân có thể vượt nhịp thực hiện hoặc làm tăng sự sốt ruột'},
  'Quan Lộc':{meaning:'cách lập nghiệp, vai trò và trách nhiệm nghề nghiệp',scene:'khi đổi vị trí, nhận một dự án khó hoặc phải phối hợp nhiều bộ phận',gain:'có điều kiện khai thác năng lực nghề nghiệp',power:'vai trò quyết định và phần trách nhiệm cần được làm rõ',craft:'chuyên môn, cách làm và uy tín nghề nghiệp được đặt vào trọng tâm',friction:'tiến độ, kỳ vọng hoặc phạm vi công việc có thể trở thành điểm vướng'},
  'Tài Bạch':{meaning:'cách tạo thành quả, sử dụng và giữ nguồn lực',scene:'khi công sức bỏ ra chuyển thành thu nhập, và khi kết quả cần được phân chia',gain:'cơ hội tạo thành quả từ công việc hoặc cách làm được nhấn mạnh',power:'quyền chủ động với nguồn lực và trách nhiệm quản lý đi cùng nhau',craft:'chuyên môn, số liệu và cách diễn đạt giá trị công việc trở nên đáng chú ý',friction:'cách tính toán, ghi nhận hoặc phân chia thành quả có thể cần điều chỉnh'},
  'Phu Thê':{meaning:'nhu cầu gắn bó và cách xây đời sống đồng hành',scene:'khi hai người cần thống nhất thời gian, việc chung và trách nhiệm với gia đình',gain:'sự hỗ trợ và việc cùng xây một mục tiêu có thể nổi bật',power:'ai quyết định việc gì và cách chia trách nhiệm trở thành chủ đề rõ hơn',craft:'cách trao đổi bình tĩnh, tôn trọng và có căn cứ được nhấn mạnh',friction:'khác biệt kỳ vọng hoặc ranh giới giữa việc riêng và việc chung có thể lộ rõ'},
  'Điền Trạch':{meaning:'chỗ ở, nền tảng sinh hoạt và không gian gia đình',scene:'khi nơi ở, nơi làm việc hoặc cách sắp xếp sinh hoạt cần thay đổi',gain:'điều kiện xây dựng một nền tảng sinh hoạt phù hợp được nhấn mạnh',power:'quyền quyết định và phần việc phải gánh trong chuyện nơi chốn nổi bật hơn',craft:'việc sắp xếp, kiểm tra thông tin và tạo nền nếp cho nơi chốn được chú ý',friction:'kế hoạch về nơi ở hoặc nền sinh hoạt có thể phải sửa cho hợp hoàn cảnh'},
  'Thiên Di':{meaning:'cách tương tác với môi trường bên ngoài',scene:'khi bước sang một nhóm, khách hàng hoặc phạm vi hoạt động khác',gain:'cơ hội kết nối và sử dụng năng lực ngoài phạm vi quen thuộc được nhấn mạnh',power:'vai trò đại diện, điều phối hoặc quyết định trước người ngoài rõ hơn',craft:'cách thể hiện chuyên môn và tạo uy tín bên ngoài được chú ý',friction:'cam kết bên ngoài và khả năng thực hiện có thể lệch nhau'},
  'Nô Bộc':{meaning:'cách phối hợp với bạn bè, cộng sự và tập thể',scene:'khi chọn người cùng làm, chia phần việc hoặc thống nhất một cách phối hợp',gain:'sự hỗ trợ qua người cùng làm có thể là nguồn thuận lợi',power:'việc phân công, trách nhiệm và quyền quyết định giữa các bên rõ hơn',craft:'năng lực bổ sung cho nhau và cách phối hợp có phương pháp được nhấn mạnh',friction:'khác biệt phương pháp hoặc thay đổi kế hoạch giữa các bên có thể gây vướng'},
  'Phụ Mẫu':{meaning:'quan hệ với cha mẹ và cách tiếp nhận sự dẫn dắt',scene:'khi cần trao đổi với người lớn về một lựa chọn ảnh hưởng đến gia đình',gain:'sự quan tâm hoặc hỗ trợ giữa các thế hệ được nhấn mạnh',power:'ranh giới giữa lời khuyên và quyền tự quyết cần được làm rõ',craft:'khả năng giải thích và thống nhất thông tin giữa các thế hệ được chú ý',friction:'khác biệt cách hiểu, kỳ vọng hoặc cách nói có thể cần tháo gỡ'},
  'Huynh Đệ':{meaning:'cách chia sẻ và hỗ trợ giữa anh chị em',scene:'khi có một việc chung của gia đình cần chia trách nhiệm',gain:'sự chia sẻ hoặc hỗ trợ thiết thực giữa người thân được nhấn mạnh',power:'phần việc và tiếng nói của từng người cần được xác định',craft:'sự thấu hiểu và hỗ trợ đúng khả năng được chú ý',friction:'kỳ vọng về việc ai giúp ai hoặc giúp đến đâu có thể chưa thống nhất'},
  'Phúc Đức':{meaning:'đời sống bên trong, điều tạo cảm giác an ổn và nền nếp gia đình',scene:'khi công việc đã xong nhưng đầu óc vẫn chưa thể nghỉ, hoặc khi tìm lại nhịp sống phù hợp',gain:'những việc tạo cảm giác được nâng đỡ và có nền tảng được nhấn mạnh',power:'mong muốn tự sắp xếp nhịp sống và trách nhiệm gia đình rõ hơn',craft:'kinh nghiệm và cách nhìn có hệ thống có thể giúp hiểu điều mình đang theo đuổi',friction:'nỗi bận tâm hoặc tiêu chuẩn tự đặt có thể khiến cảm giác an ổn đến chậm'},
  'Tử Nữ':{meaning:'việc trao đổi và chia trách nhiệm về con cái, nếu có liên quan',scene:'nếu có con, khi hai thế hệ cần thống nhất kỳ vọng, cách hướng dẫn và mức tự lập',gain:'nếu chủ đề con cái có liên quan, sự hỗ trợ và tương tác trong việc chăm lo được chú ý',power:'nếu chủ đề con cái có liên quan, cách chia trách nhiệm và cân bằng hướng dẫn với quyền tự lập được nhấn mạnh',craft:'nếu chủ đề con cái có liên quan, giao tiếp và cách hướng dẫn phù hợp được chú ý',friction:'nếu chủ đề con cái có liên quan, khác biệt kỳ vọng hoặc cách trao đổi giữa các thế hệ có thể cần điều chỉnh'},
  'Tật Ách':{meaning:'một cung trong cấu trúc lá số, không phải chỉ dấu y khoa',scene:'không dùng vị trí sao để xác định sức khỏe thực tế',gain:'không được diễn thành bảo đảm sức khỏe tốt',power:'không xác định khả năng kiểm soát bệnh tật',craft:'không thay thế thông tin thăm khám',friction:'không được diễn thành dự báo bệnh, tai nạn hay tuổi thọ'},
};
const MODIFIERS:Record<string,string>={
  'Kình Dương':'thêm tính sắc, thẳng và thúc đẩy quyết định; khi quá tay có thể khiến nhịp trao đổi trở nên căng',
  'Đà La':'thêm nét chậm, vướng hoặc cần làm lại nhiều lần trước khi thống nhất',
  'Hỏa Tinh':'thêm cường độ và phản ứng nhanh; điều thuận là sức thúc đẩy, điều khó là giữ được nhịp ổn định',
  'Linh Tinh':'thêm sự nhạy với áp lực và thay đổi; cần đọc cả sức tập trung lẫn khả năng bị cuốn vào việc gấp',
  'Địa Không':'đặt thêm câu hỏi về khoảng cách giữa điều hình dung và điều thực hiện được',
  'Địa Kiếp':'làm nổi bật mặt gián đoạn hoặc phải sửa lại kế hoạch, chứ không tự xác định một mất mát cụ thể',
  'Tả Phù':'bổ sung mặt phối hợp, hỗ trợ và tổ chức việc chung',
  'Hữu Bật':'bổ sung khả năng được hỗ trợ và làm tốt hơn khi có người phối hợp phù hợp',
  'Văn Xương':'nhấn vào học hỏi, trình bày và làm rõ thông tin',
  'Văn Khúc':'nhấn vào chuyên môn, sự tinh tế trong diễn đạt và khả năng tạo ra một sản phẩm có dấu ấn',
  'Thiên Khôi':'bổ sung biểu tượng về sự nâng đỡ và cơ hội được nhìn nhận',
  'Thiên Việt':'bổ sung biểu tượng về hỗ trợ từ người có kinh nghiệm hoặc năng lực phù hợp',
  'Lộc Tồn':'nhấn vào gìn giữ và tích lũy nguồn lực, không đồng nghĩa chắc chắn có tiền',
  'Thiên Mã':'thêm tính dịch chuyển và đổi nhịp; có thể biểu hiện ở cách làm, không chỉ ở địa lý',
};
export function starLabel(s:StarView){return `${s.name}${s.brightness?` (${s.brightness})`:''}${s.mutagen?` hóa ${s.mutagen} bản mệnh`:''}`;}
export function palaceEvidence(p:PalaceView){
  const major=p.major.length?p.major.map(starLabel).join(', '):'vô chính diệu (không có chính tinh tọa thủ)';
  return `**Căn cứ: ${p.name} tại ${p.branch}: ${major}${p.minor.length?`; ${p.minor.map(starLabel).join(', ')}`:''}${p.isBody?'; Thân cư tại đây':''}.**`;
}
function lens(p:PalaceView):keyof Omit<StarMeaning,'core'>{
  if(['Quan Lộc','Thiên Di','Nô Bộc'].includes(p.name))return 'work';
  if(['Tài Bạch','Điền Trạch'].includes(p.name))return 'money';
  if(['Mệnh','Phúc Đức'].includes(p.name))return 'inner';
  return 'bond';
}
export function starReading(p:PalaceView,stars=p.major,concise=false){
  return stars.filter(s=>STAR_MEANINGS[s.name]).map(s=>{
    const home:Record<string,string>={'Tử Vi':'mong muốn tổ chức và có tiếng nói trong việc sắp xếp nơi chốn','Thiên Cơ':'cân nhắc, điều chỉnh cách bố trí sinh hoạt','Thái Dương':'chủ động chăm lo và đứng ra nhận trách nhiệm trong việc gia đình','Vũ Khúc':'quan tâm khả năng duy trì và sử dụng nguồn lực cho nền sống','Thiên Đồng':'nhu cầu có không gian dễ thích nghi và tạo cảm giác yên ổn','Liêm Trinh':'coi trọng ranh giới, nguyên tắc và cam kết trong việc chung','Thiên Phủ':'gìn giữ nền sinh hoạt và sắp xếp việc nhà có nền nếp','Thái Âm':'chăm lo không gian riêng, tích lũy và chuẩn bị cho nhu cầu lâu dài','Tham Lang':'muốn mở thêm khả năng sử dụng hoặc thay cách sắp xếp nơi chốn','Cự Môn':'cần làm rõ cách hiểu và trách nhiệm khi có quyết định về nơi chốn','Thiên Tướng':'muốn chia trách nhiệm và giữ việc gia đình ổn thỏa','Thiên Lương':'coi trọng nền nếp, sự chăm lo và nguyên tắc duy trì nền sống','Thất Sát':'muốn xử lý dứt điểm một bài toán sắp xếp nơi chốn','Phá Quân':'sẵn sàng thay cách bố trí khi nền sinh hoạt cũ không còn phù hợp'};
    if(p.name==='Điền Trạch')return `**${s.name}** tại Điền Trạch nhấn vào ${home[s.name]}.`;
    const m=STAR_MEANINGS[s.name];return concise?`**${s.name}** ở cung này được đọc theo hướng ${m[lens(p)]}.`:`**${s.name}** mang nghĩa ${m.core}. Đặt vào ${p.name}, nét này được đọc theo hướng ${m[lens(p)]}.`;
  }).join(' ');
}
export function brightnessReading(p:PalaceView){
  const strong=p.major.filter(s=>['miếu','vượng','đắc'].includes((s.brightness||'').toLocaleLowerCase('vi')));
  const weak=p.major.filter(s=>['hãm','bất'].includes((s.brightness||'').toLocaleLowerCase('vi')));
  return [strong.length?`${strong.map(s=>s.name).join(', ')} ở thế ${strong.map(s=>s.brightness).join('/')} được truyền thống xem là có điều kiện thể hiện sở trường; vẫn phải đọc cùng các sao đi kèm.`:'',
    weak.length?`${weak.map(s=>s.name).join(', ')} ở thế ${weak.map(s=>s.brightness).join('/')} khiến cách luận chú ý hơn đến mặt khó phát huy hoặc cần điều chỉnh; không biến cả cung thành kết luận xấu.`:''].filter(Boolean).join(' ');
}
export function modifiersReading(p:PalaceView,limit=Infinity){
  const all=p.minor.filter(s=>MODIFIERS[s.name]),difficult=new Set(['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp']);
  const balanced=[all.find(s=>!difficult.has(s.name)),all.find(s=>difficult.has(s.name)),...all].filter((s):s is StarView=>!!s);
  const chosen=[...new Map(balanced.map(s=>[s.name,s])).values()].slice(0,limit);
  const texts=chosen.map(s=>`**${s.name}** ${MODIFIERS[s.name]}.`);
  for(const s of [...p.major,...p.minor].filter(s=>s.mutagen)){
    const theme=PALACE_MEANINGS[p.name];
    const effect=s.mutagen==='Lộc'?theme.gain:s.mutagen==='Quyền'?theme.power:s.mutagen==='Khoa'?theme.craft:frictionEffect(s.name,theme.meaning,theme.friction);
    texts.push(`**${s.name} hóa ${s.mutagen} bản mệnh:** ${effect}.`);
  }
  return texts.join(' ');
}
/** Chỉ dùng khi cùng tọa thủ tại đúng cung; không suy ra bộ sao từ hội chiếu. */
function primaryCombinationReading(p:PalaceView):string{
  const names=new Set([...p.major,...p.minor].map(s=>s.name)),has=(...ns:string[])=>ns.every(n=>names.has(n));
  if(has('Tham Lang','Kình Dương'))return 'Khi Tham Lang đi cùng Kình Dương tại đây, sức mở cơ hội kết hợp với nhu cầu quyết nhanh. Một biểu hiện có thể gặp là nhận ra hướng mới và đứng ra chốt sớm; mặt khó là nhận thêm việc nhanh hơn khả năng theo đến cùng.';
  if(has('Thái Dương','Thiên Lương'))return 'Thái Dương và Thiên Lương đặt cạnh nhau tạo hai nét: chủ động đứng ra và muốn giữ điều hợp lý, bền vững. Nếu cùng có sao gây gián đoạn, nhu cầu dựng nền vẫn còn nhưng cách thực hiện có thể phải sửa nhiều lần; không thể chỉ cộng hai chính tinh rồi kết luận mọi việc đều thuận.';
  if(has('Liêm Trinh','Thiên Phủ'))return 'Liêm Trinh cần ranh giới và sự tin tưởng, còn Thiên Phủ muốn gìn giữ ổn định. Khi cùng tọa thủ, điểm cần đọc là cách bảo vệ một nền tảng chung mà vẫn nói rõ điều mình mong đợi; im lặng để giữ yên có thể khiến những việc chưa thống nhất kéo dài.';
  if(has('Thiên Đồng','Cự Môn'))return 'Thiên Đồng muốn hòa khí, Cự Môn muốn làm rõ bằng lý lẽ. Đi cùng nhau, có thể vừa quan tâm vừa khó thống nhất cách nói: một bên muốn được cảm thông, trong khi cuộc trao đổi lại đi vào việc ai đúng. Đây là khác biệt trong cách tương tác, không mặc định quan hệ đang bất hòa.';
  if(has('Vũ Khúc','Thiên Tướng'))return 'Vũ Khúc chú trọng hiệu quả, Thiên Tướng chú trọng trách nhiệm với người khác. Đi cùng nhau, kết quả cá nhân dễ gắn với việc giữ cho tập thể hoặc gia đình ổn thỏa; điểm khó là tiêu chuẩn tự đặt có thể tăng theo chính vai trò đang gánh.';
  if(has('Phá Quân','Hữu Bật')||has('Phá Quân','Văn Khúc'))return 'Phá Quân nhấn vào việc đổi cách làm, còn sao hỗ trợ đi cùng nhắc đến năng lực phối hợp hoặc chuyên môn. Vì vậy, sự thay đổi có nội dung cụ thể — giải quyết được một việc, tạo được một sản phẩm — là cách đọc sát hơn ý nghĩ chỉ cần đổi là sẽ có kết quả.';
  if(has('Tử Vi','Tả Phù'))return 'Tử Vi nhấn vào vai trò tổ chức, Tả Phù bổ sung sự phối hợp. Đặt cạnh nhau, quyền quyết định cần đi cùng người hỗ trợ và cách phân công; vai trò có thể rõ hơn khi làm trong một tập thể phù hợp, thay vì tự gánh mọi việc.';
  if(has('Thiên Cơ','Thái Âm'))return 'Thiên Cơ tìm phương án, Thái Âm muốn chuẩn bị kỹ và giữ nền. Hai nét này kết hợp thành cách đi có tính toán, nhưng cũng có thể khiến một việc bị cân nhắc quá lâu. Điểm để đối chiếu là khi nào sự chuẩn bị giúp quyết định tốt hơn, khi nào nó chỉ làm chậm bước thực hiện.';
  if(has('Thiên Cơ','Cự Môn'))return 'Thiên Cơ đặt câu hỏi về cách làm, Cự Môn đi sâu vào lý lẽ. Tổ hợp này gợi khả năng tìm ra chỗ bất hợp lý rồi giải thích hoặc sửa nó; mặt khó là tiếp tục đổi phương án vì còn muốn tranh luận cho rõ mọi chi tiết.';
  if(has('Thiên Cơ','Thiên Lương'))return 'Thiên Cơ linh hoạt về phương pháp, Thiên Lương coi trọng kinh nghiệm và chuẩn mực. Hai sao bổ sung cho nhau khi cần tìm cách mới mà vẫn giữ chất lượng; điểm vướng có thể là giằng co giữa muốn thử và muốn chắc.';
  if(has('Thái Dương','Thái Âm'))return 'Thái Dương nghiêng về đứng ra và chia sẻ, Thái Âm nghiêng về chuẩn bị và tích lũy. Cùng tọa thủ, hai nhịp hướng ra ngoài và giữ nền bên trong cần phối hợp; trạng thái sáng tối của từng sao sẽ điều chỉnh mức độ thể hiện, không phải cứ có cả hai là tự động cân bằng.';
  if(has('Thái Dương','Cự Môn'))return 'Thái Dương muốn làm rõ trách nhiệm, Cự Môn dùng lời nói và lý lẽ. Đi cùng nhau, sự thể hiện có thể dựa nhiều vào việc giải thích, thương lượng hoặc bảo vệ một quan điểm; điểm khó là lời nói có thể tạo sức ép nếu đi nhanh hơn sự đồng thuận.';
  if(has('Thiên Đồng','Thái Âm'))return 'Thiên Đồng cần hòa khí, Thái Âm cần cảm giác được thấu hiểu và có nền. Sự quan tâm có thể khá tinh tế, nhưng những việc khó nói cũng dễ được giữ lại để tránh làm mất yên ổn. Cần đối chiếu cách thể hiện nhu cầu thay vì chỉ xem quan hệ bên ngoài có êm hay không.';
  if(has('Thiên Đồng','Thiên Lương'))return 'Thiên Đồng tìm sự dễ chịu, Thiên Lương muốn chăm lo và giữ điều đúng. Mặt thuận là có xu hướng nâng đỡ và dung hòa; mặt cần đọc là sự quan tâm có thể chuyển thành làm thay hoặc giữ một cách cũ quá lâu nếu ngại thay đổi.';
  if(has('Vũ Khúc','Thiên Phủ'))return 'Vũ Khúc chú trọng thực thi, Thiên Phủ chú trọng giữ và tổ chức nguồn lực. Đi cùng nhau, trọng tâm nằm ở kết quả có thể duy trì, thay vì chỉ có một lần bứt lên; mặt khó là khả năng thích nghi khi kế hoạch ổn định phải đổi.';
  if(has('Vũ Khúc','Tham Lang'))return 'Vũ Khúc muốn thấy hiệu quả rõ, Tham Lang muốn mở thêm khả năng. Hai nét này có thể biến quan hệ và ý tưởng thành việc làm cụ thể; điểm dễ vướng là mở nhiều hướng trước khi biết hướng nào thực sự tạo được giá trị bền.';
  if(has('Vũ Khúc','Thất Sát'))return 'Vũ Khúc nhấn vào hiệu quả, Thất Sát nhấn vào quyết định và việc khó. Tổ hợp tạo nét gánh việc rõ, nhưng sức chịu áp lực không đồng nghĩa nên tự ôm mọi trách nhiệm; cần đối chiếu khả năng phối hợp và duy trì nhịp làm việc.';
  if(has('Vũ Khúc','Phá Quân'))return 'Vũ Khúc cần kết quả đo được, Phá Quân muốn thay cách cũ. Đi cùng nhau, thay đổi thường được nhìn qua câu hỏi có tạo hiệu quả hơn không; mặt khó là cái mới cần thời gian trong khi mong muốn thu kết quả có thể đến sớm.';
  if(has('Liêm Trinh','Thiên Tướng'))return 'Liêm Trinh coi trọng ranh giới, Thiên Tướng coi trọng trách nhiệm và sự công bằng. Hai sao gợi cách làm dựa vào vai trò rõ ràng; điểm vướng có thể xuất hiện khi một bên muốn giữ nguyên tắc còn bên kia cần được linh hoạt theo hoàn cảnh.';
  if(has('Liêm Trinh','Thất Sát'))return 'Liêm Trinh muốn giữ nguyên tắc, Thất Sát muốn xử lý dứt điểm. Hai nét kết hợp có thể tạo sức quyết định trong việc khó, nhưng cũng làm tăng độ cứng khi trao đổi; không được từ tổ hợp này suy ra một biến cố đã định.';
  if(has('Liêm Trinh','Phá Quân'))return 'Liêm Trinh muốn có ranh giới rõ, Phá Quân muốn sửa cấu trúc cũ. Tổ hợp đặt ra bài toán thay đổi đến đâu mà vẫn giữ cam kết và sự tin tưởng; việc thiếu thống nhất nguyên tắc có thể khiến quá trình đổi mới bị kéo dài.';
  if(has('Tử Vi','Thiên Phủ'))return 'Tử Vi nghiêng về tổ chức và quyết định, Thiên Phủ nghiêng về gìn giữ nền vận hành. Khi phối hợp tốt, việc dẫn dắt có phần duy trì phía sau; mặt phải đối chiếu là sự vững vàng có khiến khó nghe ý kiến khác hoặc ngại điều chỉnh không.';
  if(has('Tử Vi','Tham Lang'))return 'Tử Vi muốn giữ vai trò, Tham Lang muốn mở kết nối và cơ hội. Tổ hợp có thể thể hiện ở việc tạo ảnh hưởng qua quan hệ; điểm khó là kỳ vọng bên ngoài hoặc mong muốn mở rộng có thể đi nhanh hơn khả năng tổ chức.';
  if(has('Tử Vi','Thiên Tướng'))return 'Tử Vi đặt trọng tâm ở vai trò điều phối, Thiên Tướng ở trách nhiệm với người cùng làm. Khi phối hợp, khả năng dẫn dắt cần gắn với phân công và sự tin cậy; điểm khó là vừa muốn giữ quyền quyết định vừa muốn mọi phía đều hài lòng.';
  if(has('Tử Vi','Thất Sát'))return 'Tử Vi tổ chức và xác định hướng, Thất Sát chịu áp lực để thực hiện. Tổ hợp gợi việc đứng ra dẫn một nhiệm vụ khó; hiệu quả còn phụ thuộc phạm vi quyền hạn có tương xứng với trách nhiệm hay không.';
  if(has('Tử Vi','Phá Quân'))return 'Tử Vi muốn tạo trật tự, Phá Quân muốn thay cấu trúc không còn hiệu quả. Đặt cạnh nhau, sự thay đổi cần một hướng tổ chức rõ; mặt khó là khoảng chuyển tiếp khi cách cũ đã bỏ mà cách mới chưa vận hành ổn.';
  if(p.major.length===2)return `${p.major[0].name} và ${p.major[1].name} cùng tọa thủ: cần đọc cả hai tính chất trên khi đối chiếu ${PALACE_MEANINGS[p.name].meaning}, rồi xét phụ tinh và tứ hóa đi kèm.`;
  return '';
}

export function combinationReading(p:PalaceView):string{
  // Luận chính tinh trước, rồi mới bổ sung sao hỗ trợ: Tả/Hữu không che cặp chính tinh.
  let primary=primaryCombinationReading({...p,minor:[]});const names=new Set([...p.major,...p.minor].map(s=>s.name));
  if(p.name==='Phu Thê'&&names.has('Tử Vi')&&names.has('Thiên Phủ'))primary='Tử Vi coi trọng tiếng nói và vị trí trong việc chung, Thiên Phủ muốn gìn giữ nền ổn định. Trong quan hệ đồng hành, điểm cần đọc là cách hai bên cùng quyết mà vẫn tôn trọng nhu cầu an toàn và nhịp sống của nhau.';
  const additions:string[]=[];
  if(names.has('Tham Lang')&&names.has('Kình Dương'))additions.push('Khi Tham Lang đi cùng Kình Dương tại đây, sức mở cơ hội kết hợp với nhu cầu quyết nhanh. Mặt thuận là dám khởi đầu; mặt khó là nhận thêm việc nhanh hơn khả năng theo đến cùng.');
  if(names.has('Phá Quân')&&(names.has('Hữu Bật')||names.has('Văn Khúc')))additions.push('Phá Quân đi cùng sao hỗ trợ nhắc đến thay đổi có chuyên môn hoặc có người phối hợp. Cần xem cách làm mới giải quyết được việc gì, thay vì chỉ xem đã đổi nhiều đến đâu.');
  if(names.has('Tử Vi')&&names.has('Tả Phù'))additions.push('Tả Phù bổ sung mặt phối hợp cho Tử Vi: vai trò tổ chức cần có cách phân công và người hỗ trợ phù hợp.');
  return [primary,...additions.slice(0,1)].filter(Boolean).join(' ');
}
