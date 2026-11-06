/**
 * Trích yếu cổ thư Tử Vi, Việt hoá từ dữ liệu của dự án ziwei-doushu (MIT / CC BY 4.0).
 * Lưu ý: đây là bản trích lược, có đoạn đã được diễn giải lại, không phải nguyên văn toàn bộ sách.
 * Đã bỏ các đoạn dẫn lời Nghê Hải Hạ (giấy phép phi thương mại).
 */
export interface ClassicParagraph {
  id: string;
  vi: string;
  /** từ khoá để chọn đoạn liên quan khi luận giải */
  tags: string[];
}
export interface ClassicChapter {
  title: string;
  subtitle?: string;
  paragraphs: ClassicParagraph[];
}
export interface ClassicBook {
  slug: string;
  title: string;
  hanTitle: string;
  era: string;
  author: string;
  intro: string;
  chapters: ClassicChapter[];
}

const p = (id: string, vi: string, tags: string[] = []): ClassicParagraph => ({ id, vi, tags });

export const BOOKS: ClassicBook[] = [
  {
    slug: 'cot-tuy-phu',
    title: 'Cốt Tuỷ Phú',
    hanTitle: '骨髓赋',
    era: 'Đời Minh',
    author: 'Không rõ tác giả',
    intro: 'Bài phú cô đọng nhất của Tử Vi Đẩu Số, khoảng 1.500 chữ, tóm lại những nguyên lý cốt lõi mà người học Tử Vi nào cũng phải đọc.',
    chapters: [
      {
        title: 'Tổng luận', subtitle: 'Nguyên lý cơ bản',
        paragraphs: [
          p('gsf-1-1', 'Thái cực tinh diệu là chủ của các sao. Tử Vi là đế tọa, tôn quý nhất trong các sao. Thiên Phủ là lệnh tinh của Nam Bắc đẩu; Tả Phù, Hữu Bật là sao phò tá.', ['Tử Vi', 'Thiên Phủ', 'Tả Phù', 'Hữu Bật']),
          p('gsf-1-2', 'Tử Vi là vua, lấy Tả Phù, Hữu Bật làm tướng. Thiên Phủ là bề tôi, lấy Lộc Tồn làm kho. Thiên Cơ là thiện, Thiên Lương là ấm, gặp thì tốt; Liêm Trinh là tù, Phá Quân là hao, gặp thì xấu.', ['Tử Vi', 'Thiên Phủ', 'Thiên Cơ', 'Thiên Lương', 'Liêm Trinh', 'Phá Quân', 'Lộc Tồn']),
          p('gsf-1-3', 'Cốt yếu xem mệnh là xem cung Mệnh trước. Chính tinh cung Mệnh định cách cục, tam phương tứ chính định chỗ dụng võ. Sau đó xem cung Thân, định vãn cảnh và chỗ nương tựa. Rồi xem đại hạn, lưu niên để định lúc tiến lúc lùi trong đời.', ['Mệnh', 'Thân', 'đại hạn']),
        ],
      },
      {
        title: 'Luận sao Tử Vi', subtitle: 'Đế tọa được phò thì quý',
        paragraphs: [
          p('gsf-2-1', 'Tử Vi là sao đế tọa, được Tả Hữu thì quý, được Xương Khúc thì tú, được Khôi Việt thì có quý nhân phù trì. Tử Vi đơn độc không người phò thì dù quý cũng không lâu; có cát tinh tam phương tứ chính hội chiếu mới là đại cách chính tông.', ['Tử Vi', 'Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt']),
          p('gsf-2-2', 'Tử Vi ở Tý Ngọ là thế "quay mặt về nam", chủ đại phú quý; Tử Vi ở Sửu Mùi đồng cung Phá Quân, chủ cương nghị quyết đoán; Tử Vi ở Dần Thân đồng cung Thiên Phủ gọi là cách "Tử Phủ đồng cung", chủ phẩm hạnh đoan chính, cơm áo đầy đủ.', ['Tử Vi', 'Phá Quân', 'Thiên Phủ']),
          p('gsf-2-3', 'Tử Vi ở Quan Lộc, không bị sát tinh xung phá, ắt làm quan cao; Tử Vi ở Điền Trạch, có tổ nghiệp lại tự tạo được; Tử Vi ở Phu Thê, vợ chồng đoan trang, khí chất hơn người, nhưng nên lấy muộn.', ['Tử Vi', 'Quan Lộc', 'Điền Trạch', 'Phu Thê']),
          p('gsf-2-4', 'Tử Vi kỵ Không Kiếp, chủ có địa vị mà không có lộc. Tử Vi kỵ cô quân không người phò, như núi đứng trơ trọi, khó thành việc lớn. Tử Vi hoá Quyền chủ độc đoán, hoá Khoa chủ danh tiếng, hoá Kỵ chủ bị người khác chế ngự.', ['Tử Vi', 'Địa Không', 'Địa Kiếp']),
        ],
      },
      {
        title: 'Luận sao Thất Sát', subtitle: 'Tướng tinh cô độc, hợp võ nghiệp',
        paragraphs: [
          p('gsf-3-1', 'Thất Sát là tướng tinh, tính cương nghị quyết đoán. Thất Sát thủ Mệnh không thích đồng cung với các cát tinh, đi con đường riêng mới đúng bản cách. Thất Sát gặp Không Kiếp chủ cô độc phiêu bạt, sự nghiệp khó thành.', ['Thất Sát', 'Địa Không', 'Địa Kiếp']),
          p('gsf-3-2', 'Cách Thất Sát triều đẩu: Thất Sát ở Tý Ngọ, Dần Thân, cung đối có Tử Vi Thiên Phủ chiếu, chủ tước lộc vinh xương. Hợp nhất với quân đội, công an, khai phá. Một đời quý khí khó cản, nhưng phải qua rèn luyện mới thành đại khí.', ['Thất Sát', 'Tử Vi', 'Thiên Phủ']),
          p('gsf-3-3', 'Thất Sát gặp Kình Đà chủ thương tích; gặp Hoả Linh chủ uy vũ cương liệt; gặp hoá Lộc chủ võ quý; gặp hoá Kỵ lại chủ sa sút, sự nghiệp nhiều thất bại.', ['Thất Sát', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh']),
        ],
      },
      {
        title: 'Cách Sát Phá Tham', subtitle: 'Mệnh khai phá, biến động',
        paragraphs: [
          p('gsf-4-1', 'Thất Sát, Phá Quân, Tham Lang hội ở Mệnh, Di, Tài, Quan gọi là cách Sát Phá Tham. Chủ một đời nhiều biến động, không chịu tầm thường, hợp khởi nghiệp, quân đội, kinh doanh. Khi trẻ dễ thất bại vì nóng vội, trung niên mới ổn định.', ['Thất Sát', 'Phá Quân', 'Tham Lang']),
          p('gsf-4-2', 'Sát Phá Tham mà tam phương có hoá Lộc hoặc hoá Quyền thì động có lực, làm được việc lớn; nếu tam phương sát tinh quá nặng (Kình Đà Hoả Linh cùng chiếu) thì động mà không thành, nên giữ yên.', ['Thất Sát', 'Phá Quân', 'Tham Lang']),
        ],
      },
      {
        title: 'Cơ Nguyệt Đồng Lương', subtitle: 'Tích luỹ ổn định, hợp công chức',
        paragraphs: [
          p('gsf-5-1', 'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng vào Mệnh, Di, Tài, Quan gọi là cách Cơ Nguyệt Đồng Lương. Chủ nho nhã, thông minh, giỏi mưu tính. Hợp nhất công chức, học thuật, văn nghệ, y tế, dịch vụ, không nên mạo hiểm đầu cơ lớn.', ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương']),
          p('gsf-5-2', '"Cơ Nguyệt Đồng Lương tác lại nhân": người có cách này hợp làm công chức, hành chính, giấy tờ, an ổn một đời. Gặp thêm Xương Khúc, hoá Khoa thì danh tiếng xa. Kỵ nhất sát tinh nhiều, khi đó lại chủ hay thay đổi, khó yên.', ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương']),
        ],
      },
      {
        title: 'Luận Tứ Hoá', subtitle: 'Cát hung của Lộc Quyền Khoa Kỵ',
        paragraphs: [
          p('gsf-6-1', 'Hoá Lộc chủ tài, chủ duyên, chủ biến năng lực thành tiền; hoá Quyền chủ quyền, chủ quyết đoán, chủ tự gánh vác; hoá Khoa chủ danh, chủ quý nhân, chủ giấy tờ; hoá Kỵ chủ bệnh, chủ trở ngại, chủ bài học sâu sắc.', ['Lộc', 'Quyền', 'Khoa', 'Kỵ']),
          p('gsf-6-2', 'Hoá Lộc nhập Mệnh, tiền vào nhiều nguồn; hoá Quyền nhập Mệnh, gánh được việc lớn; hoá Khoa nhập Mệnh, danh tiếng xa; hoá Kỵ nhập Mệnh, phải qua rèn luyện mới nên người.', ['Lộc', 'Quyền', 'Khoa', 'Kỵ', 'Mệnh']),
          p('gsf-6-3', 'Hoá Kỵ nhập Tài, tiền đến rồi đi; nhập Quan, sự nghiệp trắc trở; nhập Phu Thê, hôn nhân nhiều sóng gió; nhập Tử Nữ, duyên con cái mỏng hoặc cha con hay va chạm.', ['Kỵ', 'Tài Bạch', 'Quan Lộc', 'Phu Thê', 'Tử Nữ']),
          p('gsf-6-4', 'Lộc Tồn và hoá Lộc cùng hội tam phương Mệnh gọi là "Song Lộc triều viên", chủ giàu như Đào Chu; hoá Khoa và hoá Quyền cùng hội gọi là "Khoa Quyền song hội", chủ danh quyền đều đẹp.', ['Lộc Tồn', 'Lộc', 'Khoa', 'Quyền']),
        ],
      },
      {
        title: 'Luận Phụ Bật Khôi Việt', subtitle: 'Sự quý của lục cát tinh',
        paragraphs: [
          p('gsf-7-1', 'Tả Phù Hữu Bật là "tướng tinh", chủ trợ lực, quý nhân; Văn Xương Văn Khúc là "văn tinh", chủ thông minh tuấn tú; Thiên Khôi Thiên Việt là "quý nhân tinh", chủ lúc then chốt có người nâng đỡ.', ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt']),
          p('gsf-7-2', 'Lục cát tinh cùng hội tam phương tứ chính Mệnh, chủ một đời không thiếu quý nhân, nhân duyên rất tốt. Dù mệnh cách bình thường cũng có thể nhờ sức lục cát mà làm nên việc lớn.', ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt']),
          p('gsf-7-3', 'Phụ Bật giáp Mệnh: Tả Phù Hữu Bật ở hai cung trước sau cung Mệnh, chủ một đời có quý nhân phù trì, gặp khó có người giúp. Tốt nhất là đồng cung với Tử Vi, gọi là cách "Quân Thần Khánh Hội".', ['Tả Phù', 'Hữu Bật', 'Tử Vi']),
        ],
      },
      {
        title: 'Luận Lục Sát', subtitle: 'Cái hung của Kình Đà Hoả Linh Không Kiếp',
        paragraphs: [
          p('gsf-8-1', 'Kình Dương, Đà La là "sát tinh", chủ thương tích, thị phi, trở ngại; Hoả Tinh, Linh Tinh là "táo tinh", chủ bốc đồng, nóng nảy, tai nạn; Địa Không, Địa Kiếp là "không vong", chủ hao tài, hư danh, không thực.', ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp']),
          p('gsf-8-2', 'Sát tinh không hoàn toàn xấu: sát tinh như đá mài dao, rèn ra sức phá thế mà người thường không có. Khi trẻ dễ nóng vội tự hại, trung niên mới hoá sát thành quyền.', ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh']),
          p('gsf-8-3', 'Kình Đà giáp Kỵ: Kình Dương Đà La giáp cung có sao hoá Kỵ, chủ rất xấu. Năm ấy, đại hạn ấy cần đặc biệt cảnh giác thương tích, kiện tụng, biến cố lớn.', ['Kình Dương', 'Đà La', 'Kỵ']),
          p('gsf-8-4', 'Không Kiếp giáp Mệnh: Địa Không Địa Kiếp ở hai cung trước sau cung Mệnh, chủ một đời hợp việc tinh thần hơn vật chất, hợp văn nghệ, tôn giáo, huyền học, không hợp buôn bán đầu tư.', ['Địa Không', 'Địa Kiếp']),
        ],
      },
      {
        title: 'Luận Mười hai cung', subtitle: 'Chủ tượng và cát hung từng cung',
        paragraphs: [
          p('gsf-9-1', 'Cung Mệnh là gốc, tam phương là dụng: Tài Bạch chủ nguồn tiền, Quan Lộc chủ sự nghiệp, Thiên Di chủ duyên bên ngoài. Tam phương tứ chính có cát tinh hội chiếu thì mệnh cách mới phát huy trọn vẹn.', ['Mệnh', 'Tài Bạch', 'Quan Lộc', 'Thiên Di']),
          p('gsf-9-2', 'Phu Thê xem khí chất người phối ngẫu, Tử Nữ xem duyên con cái, Tật Ách xem điểm yếu cơ thể, Thiên Di xem vận ra ngoài. Chính tinh và tứ hoá mỗi cung quyết định cát hung lĩnh vực đó.', ['Phu Thê', 'Tử Nữ', 'Tật Ách', 'Thiên Di']),
          p('gsf-9-3', 'Điền Trạch là kho của lá số, giữ được chính tài hay không xem cung này; Phúc Đức là hưởng thụ tinh thần, lòng có yên hay không xem cung này; Phụ Mẫu là quan hệ với bề trên, cũng chủ giấy tờ hợp đồng.', ['Điền Trạch', 'Phúc Đức', 'Phụ Mẫu']),
          p('gsf-9-4', 'Cung vô chính diệu thì mượn cung đối mà luận: cung nào không có chính tinh thì lấy chính tinh cung đối để luận việc cung đó. Như cung Mệnh vô chính diệu thì mượn chính tinh cung Thiên Di định mệnh cách.', ['Vô chính diệu']),
        ],
      },
    ],
  },
  {
    slug: 'toan-tap',
    title: 'Tử Vi Đẩu Số Toàn Tập',
    hanTitle: '紫微斗数全集',
    era: 'Đời Minh',
    author: 'Tương truyền do Trần Đoàn truyền lại',
    intro: 'Một trong những sách gốc quan trọng nhất của Tử Vi Đẩu Số, tương truyền do Trần Đoàn (Hy Di tiên sinh) đời Tống truyền lại.',
    chapters: [
      {
        title: 'Quyển 1 – Tổng luận', subtitle: 'Phép lập cơ bản',
        paragraphs: [
          p('qj-1-1', 'Tử Vi Đẩu Số do Trần Đoàn truyền lại, lấy Tử Vi làm đế tọa, thống ngự trăm sao. Mỗi sao có chỗ chủ riêng, có miếu vượng lợi hãm, có hội chiếu cát hung. Người xem mệnh trước hết an sao, sau định Mệnh Thân, thứ ba xem cát hung mười hai cung, thứ tư xét đại hạn lưu niên.', ['Tử Vi', 'Mệnh', 'Thân']),
          p('qj-1-2', 'Phép an sao: trước định vị trí Tử Vi, Tử Vi định rồi thì các sao theo phép mà xếp vào mười hai cung. Mười bốn chính tinh ở đúng chỗ, lục cát lục sát phụ theo. Lá số đã lập thì muôn tượng đều hiện.', ['Tử Vi']),
          p('qj-1-3', 'Cung Mệnh là gốc, chủ cách cục một đời; cung Thân là phụ, chủ hướng đi sau 30 tuổi. Mệnh Thân rõ ràng mới biết người tiến lùi ra sao. Tam phương tứ chính hội chiếu mới biết chỗ dụng võ. Mười hai cung mỗi cung một việc mới thấy toàn cảnh đời người.', ['Mệnh', 'Thân']),
        ],
      },
      {
        title: 'Quyển 2 – Luận sao Tử Vi', subtitle: 'Đế tọa tôn quý',
        paragraphs: [
          p('qj-2-1', 'Tử Vi là chủ Bắc đẩu, thống quản các sao. Tử Vi thuộc Thổ, là sao tôn quý, hoá khí là tôn, chủ trung hậu, có uy nghi. Mệnh nam mệnh nữ đều thích Tử Vi thủ Mệnh, nhưng cần Tả Phù Hữu Bật chầu về mới là chính cách.', ['Tử Vi', 'Tả Phù', 'Hữu Bật']),
          p('qj-2-2', 'Tử Vi độc tọa cần có Tả Hữu, Xương Khúc, Khôi Việt giáp trì mới dùng được. Tử Vi đơn độc không chỗ dựa thì dù quý không lâu; có cát tinh tam phương tứ chính hội chiếu mới là đại cách Quân Thần Khánh Hội.', ['Tử Vi']),
          p('qj-2-3', 'Tử Vi ở Huynh Đệ, anh em có quý khí, được anh cả giúp; ở Tử Nữ, con cái có quý khí, nhưng dạy dỗ cần công bằng; ở Phu Thê, vợ chồng đoan trang, nên lấy muộn.', ['Tử Vi', 'Huynh Đệ', 'Tử Nữ', 'Phu Thê']),
          p('qj-2-4', 'Tử Vi ở Điền Trạch, có tổ nghiệp lại tự tạo được, nhà đất có thể là trục làm giàu; ở Phúc Đức, đời sống tinh thần coi trọng phong cách, tự trọng cao; ở Quan Lộc, chủ đại phú quý, nên ở vị trí cao.', ['Tử Vi', 'Điền Trạch', 'Phúc Đức', 'Quan Lộc']),
        ],
      },
      {
        title: 'Quyển 3 – Luận Nam đẩu', subtitle: 'Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương',
        paragraphs: [
          p('qj-3-1', 'Thiên Phủ thuộc Thổ, lệnh tinh Nam đẩu, chủ kho lộc. Thiên Phủ độc tọa chủ phẩm hạnh đoan chính, cơm áo không lo. Thiên Phủ đồng cung Tử Vi gọi là "Tử Phủ đồng cung", chủ tôn quý. Thiên Phủ thích gặp Lộc Tồn, chủ giàu lớn.', ['Thiên Phủ', 'Tử Vi', 'Lộc Tồn']),
          p('qj-3-2', 'Thái Âm thuộc Thuỷ. Thái Âm miếu vượng chủ nhà đất, phú quý; hãm địa chủ vất vả bôn ba. Mệnh nữ có Thái Âm là tốt nhất, chủ xinh đẹp hiền thục. Thái Âm ở Hợi Tý chủ giàu lớn, ở Ngọ Mùi thì giảm lực.', ['Thái Âm']),
          p('qj-3-3', 'Tham Lang là sao đào hoa, ham muốn, thuộc Mộc kiêm Thuỷ. Tham Lang chủ đa tài, giao thiệp rộng. Tham Lang gặp Hoả Tinh là cách "Hoả Tham", gặp Linh Tinh là "Linh Tham", đều chủ phát tài bất ngờ. Nhưng Tham Lang kỵ Không Kiếp, chủ hoa mà không thực.', ['Tham Lang', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp']),
          p('qj-3-4', 'Cự Môn thuộc Thuỷ, hoá khí là ám, chủ khẩu thiệt thị phi. Cự Môn là sao ăn nói, hợp luật sư, giáo viên, truyền thông. Cự Môn hoá Lộc chủ "nhờ miệng ra tiền", hoá Kỵ thì khẩu thiệt kiện tụng không dứt.', ['Cự Môn']),
          p('qj-3-5', 'Thiên Tướng thuộc Thuỷ, hoá khí là ấn, là sao phò tá. Thiên Tướng trung hậu thật thà, hợp hành chính, thư ký, pháp vụ. Thiên Tướng không thích độc tọa, tốt nhất đồng cung Tử Vi hoặc Liêm Trinh, mượn uy mà thành việc.', ['Thiên Tướng', 'Tử Vi', 'Liêm Trinh']),
          p('qj-3-6', 'Thiên Lương thuộc Thổ, hoá khí là ấm, là sao người già. Thiên Lương chủ lương thiện, từ bi, cô khắc, hoá giải. Hợp pháp luật, y học, giáo dục, tôn giáo. Thiên Lương hoá Khoa chủ danh tiếng, hoá Lộc lại dễ hư phù.', ['Thiên Lương']),
        ],
      },
      {
        title: 'Quyển 4 – Luận Bắc đẩu', subtitle: 'Thiên Cơ, Thái Dương, Vũ Khúc, Liêm Trinh, Phá Quân',
        paragraphs: [
          p('qj-4-2', 'Thiên Cơ thuộc Mộc, hoá khí là thiện, là sao trí tuệ. Thiên Cơ chủ thông minh, linh hoạt, hiếu động. Thiên Cơ nhập Mệnh, tư duy nhanh, hợp tư vấn, kế hoạch, giáo dục. Kỵ nhất hay thay đổi không chủ kiến, cần Xương Khúc hội chiếu mới thành.', ['Thiên Cơ', 'Văn Xương', 'Văn Khúc']),
          p('qj-4-3', 'Thái Dương thuộc Hoả, hoá khí là quý, là sao quý của nam. Thái Dương chủ danh dự, việc công, giao tế. Miếu vượng chủ đại quý, hãm địa thì làm mà không được. Thái Dương hợp ở Mão Thìn Tỵ Ngọ, ở Tuất Hợi Tý Sửu thì giảm lực.', ['Thái Dương']),
          p('qj-4-4', 'Vũ Khúc thuộc Kim, hoá khí là tài, là chủ tài tinh. Vũ Khúc chủ cương nghị quyết đoán, giỏi quản lý tiền, kinh doanh. Vũ Khúc hoá Kỵ chủ phẫu thuật, tai nạn kim khí. Vũ Khúc đồng cung Thất Sát gọi là cách "Vũ Sát", chủ cương trực, võ quý.', ['Vũ Khúc', 'Thất Sát']),
          p('qj-4-5', 'Liêm Trinh thuộc Hoả kiêm Mộc, hoá khí là tù, là thứ đào hoa. Liêm Trinh văn võ kiêm toàn, đa tài nghệ. Liêm Trinh hoá Kỵ chủ thương tích, kiện tụng, rắc rối tình cảm. Liêm Trinh đồng cung Thiên Tướng là cách "Liêm Tướng", chủ có tiếng thanh liêm.', ['Liêm Trinh', 'Thiên Tướng']),
          p('qj-4-6', 'Phá Quân thuộc Thuỷ, hoá khí là hao, là sao phá cũ đổi mới. Phá Quân chủ khai phá, biến động, duyên lục thân mỏng. Phá Quân hợp dùng chuyên môn kỹ thuật đi khắp nơi. Phá Quân hoá Lộc gọi là "phá rồi lập", chủ trước tán sau tụ.', ['Phá Quân']),
        ],
      },
      {
        title: 'Quyển 5 – Tứ Hoá và cách cục', subtitle: 'Sức mạnh tứ hoá và các cách cục quan trọng',
        paragraphs: [
          p('qj-5-1', 'Hoá Lộc chủ nguồn tiền, chủ duyên, chủ biến năng lực thành tiền. Hoá Lộc vào tam phương Mệnh chủ tiền vào nhiều nguồn; vào Tài Bạch chủ chính tài ổn định.', ['Lộc', 'Tài Bạch']),
          p('qj-5-2', 'Hoá Quyền chủ quyền lực, quyết đoán, gánh vác. Hoá Quyền nhập Mệnh chủ tự gánh vác được; nhập Quan Lộc chủ sự nghiệp có quyền điều hành, hợp con đường quản lý hoặc chuyên gia.', ['Quyền', 'Quan Lộc']),
          p('qj-5-3', 'Hoá Khoa chủ danh tiếng, giấy tờ, quý nhân. Hoá Khoa nhập Mệnh chủ danh tiếng xa; nhập Thân chủ lấy danh làm lợi, hợp giáo dục, nghiên cứu, tư vấn.', ['Khoa']),
          p('qj-5-4', 'Hoá Kỵ chủ bệnh, chủ trở ngại, chủ bài học sâu. Hoá Kỵ vào tam phương Mệnh chủ đời có một "điểm vướng", đó là bài học lớn nhất, vượt qua được là đại trí tuệ.', ['Kỵ']),
          p('qj-5-5', 'Cách Tử Phủ đồng cung: Tử Vi, Thiên Phủ cùng thủ Mệnh, chủ phẩm hạnh đoan chính, cơm áo không lo, có tài lãnh đạo. Cần Tả Hữu phò trợ mới thành đại cách trọn vẹn.', ['Tử Vi', 'Thiên Phủ']),
          p('qj-5-6', 'Cách Thất Sát triều đẩu: Thất Sát thủ Mệnh ở Tý Ngọ Dần Thân, cung đối có Tử Vi Thiên Phủ chiếu, chủ tước lộc vinh xương, võ nghiệp hiển quý, hợp quân đội, chính quyền, quản lý doanh nghiệp.', ['Thất Sát', 'Tử Vi', 'Thiên Phủ']),
          p('qj-5-7', 'Cách Song Lộc triều viên: hoá Lộc và Lộc Tồn cùng hội tam phương tứ chính Mệnh, tài nguồn dồi dào, cơm áo đầy đủ. Xưa nói "Song Lộc triều viên, phú tỷ Đào Chu".', ['Lộc Tồn', 'Lộc']),
          p('qj-5-8', 'Cách Cơ Nguyệt Đồng Lương: Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng vào Mệnh, Di, Tài, Quan, chủ nho nhã, thông minh, giỏi mưu tính, hợp những nghề cần tích luỹ ổn định.', ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương']),
          p('qj-5-9', 'Cách Sát Phá Tham: Thất Sát, Phá Quân, Tham Lang hội Mệnh, chủ nhiều biến động, không chịu tầm thường, hợp khởi nghiệp, quân đội, kinh doanh. Trung niên mới ổn định.', ['Thất Sát', 'Phá Quân', 'Tham Lang']),
          p('qj-5-10', 'Cách Nhật Nguyệt đồng cung: Thái Dương, Thái Âm cùng ở Sửu hoặc Mùi, chủ có duyên với người khác giới, sự nghiệp thuận, danh tiếng xa.', ['Thái Dương', 'Thái Âm']),
        ],
      },
    ],
  },
  {
    slug: 'toan-thu',
    title: 'Tử Vi Đẩu Số Toàn Thư',
    hanTitle: '紫微斗数全书',
    era: 'Đời Minh',
    author: 'La Hồng Tiên biên soạn',
    intro: 'Bộ sách có hệ thống nhất về Tử Vi Đẩu Số, nhấn mạnh quan hệ giữa mười hai cung và tứ hoá, là giáo trình chính của người học Tử Vi từ đời Thanh trở đi.',
    chapters: [
      {
        title: 'Mười hai cung – Cung Mệnh', subtitle: 'Gốc của việc xem mệnh',
        paragraphs: [
          p('qs-1-1', 'Cung Mệnh là gốc rễ của một thân, then chốt của muôn việc. Cung Mệnh định thì cách cục một đời định. Xem cung Mệnh trước xem chính tinh, sau xem phụ tinh, sát tinh, rồi xem tứ hoá và tam phương tứ chính hội chiếu.', ['Mệnh']),
          p('qs-1-2', 'Chính tinh cung Mệnh miếu vượng chủ có lợi thế bẩm sinh, làm việc nhẹ nhàng; hãm địa chủ bất lợi bẩm sinh, nhưng chính vì "không cam lòng" mà có thể bứt phá điều người miếu vượng không làm được.', ['Mệnh']),
          p('qs-1-3', 'Cung Mệnh gặp lục cát tinh, chủ một đời không thiếu quý nhân; gặp lục sát tinh, chủ nhiều sóng gió rèn luyện, nhưng nhẫn qua được thì thành đại khí.', ['Mệnh']),
        ],
      },
      {
        title: 'Mười hai cung – Cung Tài Bạch', subtitle: 'Nơi có nguồn tiền',
        paragraphs: [
          p('qs-2-1', 'Cung Tài Bạch chủ nguồn tiền, thu nhập, cách quản lý tiền. Chính tinh khác nhau thì cách kiếm tiền khác nhau: Tử Vi ở Tài là tiền từ chức vụ, Vũ Khúc là tiền buôn bán, Thái Âm là tiền nhà đất, Cự Môn là tiền nhờ ăn nói.', ['Tài Bạch', 'Tử Vi', 'Vũ Khúc', 'Thái Âm', 'Cự Môn']),
          p('qs-2-2', 'Tài Bạch có hoá Lộc chủ tiền vào nhiều nguồn; có hoá Kỵ chủ tiền đến rồi đi; có Lộc Tồn chủ tích luỹ ổn định; gặp Không Kiếp chủ hao tài, hư danh.', ['Tài Bạch', 'Lộc Tồn']),
        ],
      },
      {
        title: 'Mười hai cung – Cung Quan Lộc', subtitle: 'Gốc của sự nghiệp',
        paragraphs: [
          p('qs-3-1', 'Cung Quan Lộc chủ sự nghiệp, địa vị, thành tựu xã hội. Tử Vi ở Quan hợp nền tảng lớn, vị trí cao; Thái Dương hợp việc công, danh tiếng; Vũ Khúc hợp tài chính, sản xuất; Liêm Trinh hợp văn võ kiêm toàn.', ['Quan Lộc', 'Tử Vi', 'Thái Dương', 'Vũ Khúc', 'Liêm Trinh']),
          p('qs-3-2', 'Quan Lộc có hoá Quyền chủ tự gánh vác được; có hoá Lộc chủ tiền từ nghề nghiệp; có hoá Kỵ chủ công việc nhiều trắc trở.', ['Quan Lộc']),
        ],
      },
      {
        title: 'Mười hai cung – Cung Phu Thê', subtitle: 'Khí chất người phối ngẫu',
        paragraphs: [
          p('qs-4-1', 'Cung Phu Thê chủ khí chất người phối ngẫu và tình trạng hôn nhân. Tử Vi ở Phu Thê chủ vợ chồng đoan trang có uy, nên lấy muộn; Tham Lang chủ người phối ngẫu đa tình; Thiên Lương chủ người phối ngẫu chín chắn, lớn tuổi hơn.', ['Phu Thê', 'Tử Vi', 'Tham Lang', 'Thiên Lương']),
          p('qs-4-2', 'Phu Thê hoá Kỵ xung Mệnh chủ hôn nhân nhiều sóng gió. Phu Thê gặp lục sát cần đặc biệt chú ý sự thử thách trong tình cảm. Phu Thê gặp lục cát chủ người phối ngẫu là quý nhân.', ['Phu Thê']),
        ],
      },
      {
        title: 'Luận Tứ Hoá', subtitle: 'Hoá Lộc, Quyền, Khoa, Kỵ',
        paragraphs: [
          p('qs-5-1', 'Tứ hoá là tinh hoa của lá số: hoá Lộc chủ tài, hoá Quyền chủ thế, hoá Khoa chủ danh, hoá Kỵ chủ bệnh. Tứ hoá rơi vào cung nào thì quyết định các mốc quan trọng của đời người ở đó.', ['Lộc', 'Quyền', 'Khoa', 'Kỵ']),
          p('qs-5-3', 'Hoá Lộc vào tam phương tứ chính Mệnh: tiền ổn định, duyên rộng, năng lực ra tiền. Hoá Lộc vào Phu Thê: hôn nhân ngọt ngào. Hoá Lộc vào Quan Lộc: sự nghiệp có tiền tương ứng.', ['Lộc', 'Phu Thê', 'Quan Lộc']),
          p('qs-5-4', 'Hoá Kỵ vào tam phương tứ chính Mệnh: đời có bài học sâu, nên đối mặt thay vì né tránh. Hoá Kỵ vào Phu Thê: hôn nhân nhiều thử thách. Hoá Kỵ vào Quan Lộc: sự nghiệp nhiều trắc trở, nhưng qua rèn luyện lại thành người chuyên môn giỏi.', ['Kỵ', 'Phu Thê', 'Quan Lộc']),
        ],
      },
      {
        title: 'Cách Cơ Nguyệt Đồng Lương', subtitle: 'Mệnh tích luỹ ổn định',
        paragraphs: [
          p('qs-6-1', 'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng vào tam phương tứ chính Mệnh gọi là cách Cơ Nguyệt Đồng Lương. Nho nhã, thông minh, giỏi mưu tính, hợp công chức, học thuật, văn nghệ, y tế, dịch vụ.', ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương']),
        ],
      },
      {
        title: 'Cách Song Lộc triều viên', subtitle: 'Giàu như Đào Chu',
        paragraphs: [
          p('qs-7-1', 'Hoá Lộc và Lộc Tồn cùng hội tam phương tứ chính Mệnh gọi là cách Song Lộc triều viên. Xưa nói "Song Lộc triều viên, phú tỷ Đào Chu", chủ một đời không lo tiền.', ['Lộc Tồn', 'Lộc']),
          p('qs-7-2', 'Song Lộc triều viên kỵ nhất Không Kiếp: Không Kiếp xung vào thì Song Lộc thành hư danh. Cần gặp Tả Hữu hoặc Xương Khúc mới là chính cách.', ['Lộc Tồn', 'Địa Không', 'Địa Kiếp']),
        ],
      },
    ],
  },
];

/** Đoạn nói về một cách cục cụ thể: chỉ dùng khi lá số có cách cục đó. */
const PATTERN_ONLY: Record<string, string> = {
  'gsf-4-1': 'Sát Phá Tham', 'gsf-4-2': 'Sát Phá Tham', 'qj-5-9': 'Sát Phá Tham',
  'gsf-5-1': 'Cơ Nguyệt Đồng Lương', 'gsf-5-2': 'Cơ Nguyệt Đồng Lương', 'qj-5-8': 'Cơ Nguyệt Đồng Lương', 'qs-6-1': 'Cơ Nguyệt Đồng Lương',
  'qj-5-7': 'Song Lộc', 'qs-7-1': 'Song Lộc', 'qs-7-2': 'Song Lộc',
  'qj-5-5': 'Tử Phủ', 'qj-5-10': 'Nhật Nguyệt Đồng Cung', 'gsf-8-3': 'Kình Đà Giáp Kỵ', 'gsf-8-4': 'Không Kiếp Giáp Mệnh',
  'gsf-7-3': 'Giáp Mệnh', 'gsf-3-2': '__never__', 'qj-5-6': '__never__',
};

/** Chọn các đoạn cổ thư liên quan tới lá số để làm căn cứ cho AI. */
export function relevantParagraphs(
  weights: Map<string, number>,
  patternNames: string[],
  limit = 8,
): { book: string; chapter: string; text: string }[] {
  const scored: { score: number; key: string; book: string; chapter: string; text: string }[] = [];
  for (const b of BOOKS)
    for (const c of b.chapters)
      for (const para of c.paragraphs) {
        const need = PATTERN_ONLY[para.id];
        if (need && !patternNames.some((n) => n.includes(need))) continue;
        const score = para.tags.reduce((sum, t) => sum + (weights.get(t) ?? 0), 0) / Math.sqrt(para.tags.length || 1);
        if (score > 0) scored.push({ score, key: [...para.tags].sort().join('|'), book: b.title, chapter: c.title, text: para.vi });
      }
  const seen = new Set<string>();
  return scored
    .sort((a, b) => b.score - a.score)
    .filter((x) => (seen.has(x.key) ? false : (seen.add(x.key), true)))
    .slice(0, limit);
}
