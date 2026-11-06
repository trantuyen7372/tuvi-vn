import BirthForm from '@/components/BirthForm';
import { PRODUCTS, money, discountPercent } from '@/lib/commerce/config';
import CustomerNavigation from '@/components/CustomerNavigation';
import StructuredData from '@/components/StructuredData';
import {publicMetadata,SITE_NAME,SITE_ORIGIN} from '@/lib/seo';
export const dynamic='force-dynamic';
export const metadata=publicMetadata('/','Lập lá số Tử Vi miễn phí và luận giải','Lập lá số theo ngày giờ sinh, xem 12 cung, sao, đại hạn và lưu niên. Đọc bài luận giải có căn cứ sao–cung, lưu lá số và xem lại trong tài khoản.');

export default function Home() {
  const paid=process.env.PAYMENTS_ENABLED==='1';
  return (
    <main className="mx-auto max-w-6xl space-y-12 px-4 py-10">
    <StructuredData data={{'@context':'https://schema.org','@type':'WebSite',name:SITE_NAME,url:SITE_ORIGIN,inLanguage:'vi-VN'}}/>
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="pt-4">
        <p className="mb-3 text-sm font-semibold tracking-wide text-son">MIỄN PHÍ LẬP LÁ SỐ · KHÔNG CẦN ĐĂNG NHẬP</p>
        <h1 className="font-serif text-4xl font-bold leading-tight text-son md:text-5xl">Lập lá số Tử Vi</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#5a4a36]">
          Nhập ngày giờ sinh để an sao đủ 12 cung, xem Đại hạn và Lưu niên. Mở bài luận giải chi tiết
          về tính cách, sự nghiệp, tài lộc, tình duyên và vận năm, viết riêng cho lá số của bạn.
        </p>
        <a className="btn mt-5" href="#lap-la-so">Lập lá số miễn phí ngay</a>
        <ul className="mt-8 space-y-3 text-[#5a4a36]">
          <li>✦ Lá số đầy đủ chính tinh, phụ tinh, tứ hoá, tràng sinh</li>
          <li>✦ Đại hạn 10 năm và Lưu niên theo năm bạn chọn</li>
          <li>✦ Luận giải chi tiết, có dẫn căn cứ từng sao, từng cung</li>
          <li>✦ In hoặc lưu lá số dạng PDF</li>
        </ul>
        <a className="btn-outline mt-6" href="/bai-luan-mau">{paid?'Đọc thử trước khi mua →':'Xem bài luận minh họa →'}</a>
        <p className="mt-4 text-sm text-[#6b5b45]">Tử Vi mang tính tham khảo, giải trí. Ngày giờ sinh đúng giúp bạn tránh đọc nhầm lá số; không có bản luận nào bảo đảm các sự kiện sẽ xảy ra.</p>
      </section>
      <div id="lap-la-so" className="min-w-0">
      <BirthForm />
      </div>
    </div>
    <section aria-labelledby="steps-title"><h2 id="steps-title" className="font-serif text-2xl font-bold text-son">Từ lá số đến bài luận, trong ba bước</h2><ol className="mt-5 grid gap-4 md:grid-cols-3">{[
      ['01','Lập lá số miễn phí','Nhập ngày giờ sinh để xem 12 cung, sao, cách cục và đoạn tổng quan.'],
      ['02',paid?'Chọn phần bạn cần':'Lưu vào tài khoản',paid?'Đọc thử trước; chọn gói 1 lượt hoặc gói gia đình. Tổng tiền được hiển thị trước khi chuyển khoản.':'Tạo tài khoản và lưu thông tin ngày giờ sinh để dùng lại trên các thiết bị.'],
      ['03','Đọc và xem lại',paid?'Sau khi giao dịch được xác nhận, bài luận được tạo và lưu bằng link riêng. Giữ link để xem lại.':'Dùng lượt trải nghiệm để mở bài theo đúng lá số. Bài đã lưu xuất hiện trong tài khoản để đọc lại.'],
    ].map(([n,title,text])=><li key={n} className="rounded-xl border border-[#d9c7a3] bg-white p-5"><span className="text-sm font-bold text-son">{n}</span><h3 className="mt-2 font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[#6b5b45]">{text}</p></li>)}</ol></section>
    {paid?<section id="bang-gia" aria-labelledby="prices-title"><h2 id="prices-title" className="font-serif text-2xl font-bold text-son">Giá rõ ràng, mua theo lượt</h2><p className="mt-2 text-sm">Không thu phí lập lá số. Không đăng ký gia hạn định kỳ.</p><div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <article className="rounded-xl border border-[#d9c7a3] bg-white p-5"><h3 className="font-bold">Xem miễn phí</h3><p className="my-3 text-3xl font-bold">0đ</p><p className="text-sm leading-relaxed">Lá số 12 cung, sao cơ bản, cách cục, trích cổ thư và tổng quan tham khảo khi kho có dữ liệu.</p><a className="btn-outline mt-4" href="#lap-la-so">Bắt đầu miễn phí</a></article>
      {PRODUCTS.map(p=><article className="rounded-xl border border-[#d9c7a3] bg-white p-5" key={p.id}><h3 className="font-bold">{p.name}</h3><p className="my-3"><span className="text-3xl font-bold text-son">{money(p.price)}</span>{discountPercent(p)>0&&<><s className="ml-2 text-sm text-[#8a7a62]">{money(p.listPrice)}</s><span className="ml-2 rounded bg-son px-1.5 py-0.5 text-xs font-bold text-white">-{discountPercent(p)}%</span></>}</p><p className="text-sm leading-relaxed">{p.summary}</p>{p.credits>1&&<p className="mt-2 text-sm">Khoảng {money(p.price/p.credits)}/lượt; dùng cho nhiều lá số.</p>}<a className="btn-outline mt-4" href="#lap-la-so">Lập lá số để chọn gói</a></article>)}
    </div></section>:<section id="bang-gia" className="rounded-xl border border-[#d9c7a3] bg-white p-6"><h2 className="font-serif text-2xl font-bold text-son">Đang mở trải nghiệm miễn phí</h2><p className="mt-3">Lưu lá số và dùng lượt trải nghiệm luận giải theo đúng ngày giờ sinh trong tài khoản của bạn. Chưa có thu tiền hoặc yêu cầu chuyển khoản.</p><div className="mt-4 flex flex-wrap gap-3"><CustomerNavigation variant="home"/></div></section>}
    <section aria-labelledby="faq-title"><h2 id="faq-title" className="font-serif text-2xl font-bold text-son">Trước khi xem, bạn có thể muốn biết</h2><div className="mt-4 divide-y divide-[#d9c7a3] rounded-xl border border-[#d9c7a3] bg-white px-5">{[
      ['Chưa biết chính xác giờ sinh thì làm sao?','Hãy hỏi lại gia đình hoặc đối chiếu giấy tờ trước khi mua. Các canh giờ có thể cho lá số khác nhau; website không tự xác định được giờ sinh của bạn.'],
      ['Nên nhập ngày âm hay ngày dương?','Chọn đúng loại lịch bạn đang có. Với âm lịch, chỉ chọn tháng nhuận khi đã xác nhận tháng sinh là tháng nhuận.'],
      ['Đọc lại có mất thêm lượt không?','Không. Bài đã tạo được lưu trong tài khoản để đọc lại và in/lưu PDF. Lập lá số khác hoặc đổi năm xem hạn có thể dùng lượt mới.'],
      [paid?'Đã chuyển khoản nhưng chưa mở bài?':'Website hiện có thu tiền không?',paid?'Không chuyển thêm. Giữ mã đơn và mã giao dịch, liên hệ hỗ trợ để đối soát.':'Chưa. Website đang mở trải nghiệm, không yêu cầu chuyển khoản. Tài khoản mới được cấp lượt trải nghiệm theo chính sách đang áp dụng.'],
      ['Mất link hoặc đổi thiết bị thì sao?','Đăng nhập bằng email và mật khẩu để xem lịch sử lá số và bài luận. Chức năng quên mật khẩu dùng email đã đăng ký; cần xác minh địa chỉ email để nhận lại các đơn cũ theo email.'],
    ].map(([question,answer])=><details className="py-4" key={question}><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-3 text-sm leading-relaxed text-[#6b5b45]">{answer}</p></details>)}</div></section>
    </main>
  );
}
