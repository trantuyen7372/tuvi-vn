import BirthForm from '@/components/BirthForm';
import {money,familySaving} from '@/lib/commerce/config';
import {availableProducts} from '@/lib/commerce/offers';
import FunnelSection from '@/components/FunnelSection';
import CustomerNavigation from '@/components/CustomerNavigation';
import StructuredData from '@/components/StructuredData';
import {publicMetadata,SITE_NAME,SITE_ORIGIN} from '@/lib/seo';
import GuideCards from '@/components/GuideCards';
import CelestialMark from '@/components/CelestialMark';
import {GUIDES} from '@/lib/guides';
export const dynamic='force-dynamic';
export const metadata=publicMetadata('/','Lập lá số Tử Vi miễn phí và luận giải','Lập lá số theo ngày giờ sinh, xem 12 cung, sao, đại hạn và lưu niên. Đọc bài luận giải có căn cứ sao–cung, lưu lá số và xem lại trong tài khoản.');

export default function Home(){
  const paid=process.env.PAYMENTS_ENABLED==='1';
  const products=availableProducts();
  const questions=[
    ['Chưa biết chính xác giờ sinh thì làm sao?','Hãy hỏi lại gia đình hoặc đối chiếu giấy tờ trước khi mua. Các canh giờ có thể cho lá số khác nhau; website không tự xác định được giờ sinh của bạn.'],
    ['Nên nhập ngày âm hay ngày dương?','Chọn đúng loại lịch bạn đang có. Với âm lịch, chỉ chọn tháng nhuận khi đã xác nhận tháng sinh là tháng nhuận.'],
    ['Đọc lại có mất thêm lượt không?','Không. Bài đã tạo được lưu trong tài khoản để đọc lại và in/lưu PDF. Lập lá số khác hoặc đổi năm xem hạn có thể dùng lượt mới.'],
    [paid?'Đã chuyển khoản nhưng chưa mở bài?':'Website hiện có thu tiền không?',paid?'Không chuyển thêm. Giữ mã đơn và mã giao dịch, liên hệ hỗ trợ để đối soát.':'Chưa. Website đang mở trải nghiệm, không yêu cầu chuyển khoản. Tài khoản mới được cấp lượt trải nghiệm theo chính sách đang áp dụng.'],
    ['Mất link hoặc đổi thiết bị thì sao?','Đăng nhập bằng email và mật khẩu để xem lịch sử lá số và bài luận. Chức năng quên mật khẩu dùng email đã đăng ký; cần xác minh địa chỉ email để nhận lại các đơn cũ theo email.'],
  ];
  return <main className="home-page">
    <StructuredData data={{'@context':'https://schema.org','@type':'WebSite',name:SITE_NAME,url:SITE_ORIGIN,inLanguage:'vi-VN'}}/>
    <section className="home-hero site-container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="site-eyebrow"><span className="eyebrow-line"/> TRI THỨC XƯA, GÓC NHÌN MỚI</p>
        <h1 id="hero-title">Lập lá số <span>Tử Vi</span></h1>
        <p className="hero-lead">Hiểu lá số.<br/>{' '}Mở thêm góc nhìn về chính mình.</p>
        <p className="hero-description">Khám phá 12 cung, hệ thống sao và những chặng vận hạn từ ngày giờ sinh của bạn. Bắt đầu bằng lá số miễn phí, rồi đọc sâu hơn khi bạn sẵn sàng.</p>
        <div className="hero-actions"><a className="btn" href="#lap-la-so">Lập lá số miễn phí ngay <span aria-hidden="true">↗</span></a><a className="hero-sample-link" href="/bai-luan-mau">{paid?'Đọc thử trước khi mua →':'Xem bài luận minh họa →'}</a></div>
        <p className="hero-reassurance"><span aria-hidden="true">✓</span> Miễn phí lập lá số <span aria-hidden="true">·</span> Không cần đăng nhập</p>
        <div className="hero-signature"><CelestialMark/><div><span>TỬ VI ĐẨU SỐ</span><p>Tìm hiểu để chiêm nghiệm.<br/>Tham khảo để hiểu mình hơn.</p><a href="/phuong-phap">Tìm hiểu phương pháp <span aria-hidden="true">↗</span></a></div></div>
      </div>
      <div id="lap-la-so" className="hero-form-wrap"><BirthForm/><p className="hero-form-note">Lá số được lập theo ngày giờ sinh và năm xem bạn chọn.</p></div>
    </section>

    <div className="home-highlights site-container"><div><span className="highlight-number">12</span><p>Cung trên lá số<span>Đọc trong mối liên hệ tổng thể</span></p></div><div><span className="highlight-number">14</span><p>Chính tinh để tra cứu<span>Ý nghĩa và nguồn tham khảo</span></p></div><div><span className="highlight-symbol" aria-hidden="true">↺</span><p>Lưu và đọc lại<span>Bài đã lưu không mất thêm lượt</span></p></div></div>

    <section className="home-section site-container" aria-labelledby="steps-title">
      <div className="section-heading"><div><p className="site-eyebrow">01 / HÀNH TRÌNH CỦA BẠN</p><h2 id="steps-title">Từ lá số đến bài luận,<br/>trong ba bước.</h2></div><p>Bắt đầu từ thông tin đúng.<br/>Đọc thử, rồi chọn phần bạn cần.</p></div>
      <ol className="home-steps">{[
        ['01','Lập lá số miễn phí','Nhập ngày giờ sinh để xem 12 cung, sao, cách cục và đoạn tổng quan.'],
        ['02',paid?'Chọn phần bạn cần':'Lưu vào tài khoản',paid?'Đọc thử trước; chọn bài từ kho nội dung hoặc bài chuyên sâu khi có sẵn. Xem rõ tổng tiền trước khi chuyển khoản.':'Tạo tài khoản và lưu thông tin ngày giờ sinh để dùng lại trên các thiết bị.'],
        ['03','Đọc và xem lại',paid?'Sau khi giao dịch được xác nhận, bài luận được tạo và lưu trong tài khoản. Đọc lại hoặc in khi bạn cần.':'Dùng lượt trải nghiệm để mở bài theo đúng lá số. Bài đã lưu xuất hiện trong tài khoản để đọc lại.'],
      ].map(([n,title,text])=><li key={n}><span className="step-number">{n}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
    </section>

    <section className="sample-band site-container" aria-labelledby="sample-title"><div className="sample-band-art" aria-hidden="true"><span>文</span><span>星</span></div><div><p className="site-eyebrow">ĐỌC THỬ TRƯỚC KHI CHỌN</p><h2 id="sample-title">Một bài luận được trình bày thế nào?</h2><p>Đọc trọn bài minh họa về 12 cung, đại hạn và vận năm. Xem cách diễn giải, đối chiếu căn cứ và lưu lại điều bạn muốn tìm hiểu.</p></div><a className="btn-outline" href="/bai-luan-mau">Khám phá bài mẫu <span aria-hidden="true">↗</span></a></section>

    {paid?<FunnelSection event="pricing_view" id="bang-gia" labelledBy="prices-title" className="home-section site-container">
      <div className="section-heading"><div><p className="site-eyebrow">02 / CHỌN CÁCH KHÁM PHÁ</p><h2 id="prices-title">Giá rõ ràng,<br/>mua theo lượt.</h2></div><p>Đọc thử miễn phí trước khi chọn.<br/>Không đăng ký gia hạn định kỳ.</p></div>
      <div className={`pricing-grid ${products.length===3?'has-deep':''}`}>
        <article className="price-card price-free"><p className="price-tag">KHÁM PHÁ</p><h3>Xem miễn phí</h3><div className="price-amount">0<span>đ</span></div><p className="price-description">Lập lá số để bắt đầu tìm hiểu những nét chính của bạn.</p><ul><li>Lá số đủ 12 cung và hệ thống sao</li><li>Cách cục và trích cổ thư</li><li>Tổng quan khi kho có dữ liệu</li></ul><a className="btn-outline" href="#lap-la-so">Bắt đầu miễn phí</a></article>
        {products.map(p=><article className={`price-card ${p.id==='single'?'price-featured':''}`} key={p.id}>
          <p className="price-tag">{p.id==='single'?'Bắt đầu tại đây':p.id==='deep'?'ĐI SÂU THEO CHỦ ĐỀ':'DÀNH CHO NHIỀU LÁ SỐ'}</p><h3>{p.name}</h3>
          <div className="price-amount">{money(p.price).replace('đ','')}<span>đ</span></div><p className="price-description">{p.summary}</p>
          <ul><li>{p.id==='deep'?'Chúng tôi biên soạn theo vấn đề bạn chọn':'Diễn giải từ kho nội dung sao–cung'}</li><li>{p.credits>1?`${p.credits} lượt cho nhiều lá số`:'1 bài theo lá số và năm xem'}</li><li>Lưu bài, xem lại và in / lưu PDF</li></ul>
          {p.id==='family'&&<p className="price-saving">{money(p.price/p.credits)}/lượt · Tiết kiệm {money(familySaving())} so với mua lẻ 5 lượt.</p>}
          <a className={p.id==='single'?'btn':'btn-outline'} href="#lap-la-so">Lập lá số và đọc thử <span aria-hidden="true">↗</span></a>
        </article>)}
      </div><p className="pricing-note">Mỗi lượt áp dụng cho một lá số và năm xem hạn. Đọc lại và in bài đã lưu không mất thêm lượt.</p>
    </FunnelSection>:<section id="bang-gia" className="experience-band site-container"><div><p className="site-eyebrow">02 / BẮT ĐẦU TRẢI NGHIỆM</p><h2>Đang mở trải nghiệm miễn phí</h2><p>Lưu lá số và dùng lượt trải nghiệm theo ngày giờ sinh trong tài khoản của bạn. Chưa có thu tiền hoặc yêu cầu chuyển khoản.</p></div><div className="experience-actions"><CustomerNavigation variant="home"/></div></section>}

    <section className="home-section knowledge-section site-container" aria-labelledby="guides-title"><div className="section-heading"><div><p className="site-eyebrow">03 / TỦ SÁCH TỬ VI</p><h2 id="guides-title">Hiểu từng phần.<br/>Đọc cả bức tranh.</h2></div><p>Từ cách chọn ngày giờ sinh đến ý nghĩa<br/>các cung và sao trên lá số.</p></div><GuideCards guides={GUIDES.filter(guide=>['cach-doc-la-so-tu-vi','nhap-ngay-am-hay-duong','khong-biet-gio-sinh','y-nghia-12-cung'].includes(guide.slug))}/><div className="knowledge-links"><a href="/huong-dan">Tất cả hướng dẫn <span aria-hidden="true">↗</span></a><a href="/sao">Tra cứu 14 chính tinh <span aria-hidden="true">↗</span></a><a href="/co-thu">Đọc trích yếu cổ thư <span aria-hidden="true">↗</span></a></div></section>

    <section className="home-faq home-section site-container" aria-labelledby="faq-title"><div><p className="site-eyebrow">04 / GIẢI ĐÁP</p><h2 id="faq-title">Hiểu rõ trước<br/>khi bắt đầu.</h2><p>Những điều thường gặp khi lập lá số và mở bài luận.</p><a href="/chinh-sach/gioi-thieu" className="text-link">Cần thêm hỗ trợ? <span aria-hidden="true">↗</span></a></div><div className="faq-list">{questions.map(([question,answer])=><details key={question}><summary><span>{question}</span><span className="faq-toggle" aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
    <p className="home-disclaimer site-container">Tử Vi mang tính tham khảo, giải trí. Ngày giờ sinh đúng giúp tránh đọc nhầm lá số; không có bản luận nào bảo đảm các sự kiện sẽ xảy ra.</p>
  </main>;
}
