import { notFound } from 'next/navigation';
import {publicMetadata} from '@/lib/seo';
const policies: Record<string,{title:string;paragraphs:string[]}> = {
  'dieu-khoan': {title:'Điều khoản sử dụng',paragraphs:[
    'Bạn có thể lập lá số, xem sao, cách cục và trích cổ thư miễn phí. Các gói luận giải chi tiết được bán theo số lượt và giá hiển thị trước khi đặt đơn. Mỗi lượt áp dụng cho một lá số và năm xem hạn; thay đổi ngày, giờ sinh hoặc năm xem hạn có thể dùng một lượt mới.',
    'Sau khi thanh toán được xác nhận, bạn có thể tạo bài luận và xem lại bản đã lưu mà không mất thêm lượt. Đơn chuyển khoản hết hạn sau 30 phút; giao dịch đến muộn hoặc không khớp cần được hỗ trợ đối soát.',
    'Tử Vi và nội dung luận giải chỉ mang tính tham khảo, giải trí, có thể sai hoặc không phù hợp hoàn cảnh thực tế. Không dùng để chẩn đoán bệnh, quyết định điều trị, đầu tư, pháp lý hoặc những quyết định quan trọng khác.',
    'Bạn cần nhập thông tin chính xác và chỉ cung cấp dữ liệu của người khác khi có sự đồng ý phù hợp. Không dùng dịch vụ để gây hại, quấy rối hoặc tiết lộ thông tin riêng tư.',
    'Đơn hàng và kết quả cần đăng nhập đúng tài khoản sở hữu. Đơn cũ chưa gắn tài khoản chỉ được nhận lại khi email tài khoản đã xác minh trùng email đặt đơn. Không công khai đường link hoặc bản sao nội dung cá nhân.'
  ]},
  'bao-mat': {title:'Chính sách bảo mật',paragraphs:[
    'Để cung cấp dịch vụ, website lưu email nhận kết quả, tên nếu bạn nhập, ngày giờ sinh, giới tính, lịch âm/dương, năm xem hạn, đơn hàng, giao dịch thanh toán, số lượt và bài luận đã tạo. Nếu tự nguyện chọn chủ đề, hoàn cảnh hoặc ghi chú, thông tin này được lưu trong bài riêng; bạn có thể thay đổi hoặc xóa bằng lựa chọn đọc tổng thể mà không dùng thêm lượt.',
    'Thông tin lá số và dữ liệu liên quan có thể được xử lý qua hạ tầng kỹ thuật đối tác để lập bài luận, gửi bản sao qua email (nếu tính năng gửi thư được bật) và đối soát giao dịch qua cổng thanh toán. Website không yêu cầu lưu mật khẩu ngân hàng hay thông tin thẻ.',
    'Dữ liệu được dùng để lập lá số, tạo và gửi bài luận, đối soát thanh toán, hỗ trợ khách hàng và vận hành dịch vụ. Chúng tôi không công bố công khai thông tin ngày giờ sinh hoặc kết quả của bạn.',
    'Website có thể lưu link gói đã mua trong bộ nhớ trình duyệt và dùng cookie phiên cho tài khoản, quản trị. Link không thay thế đăng nhập. Bạn có thể xóa dữ liệu trình duyệt rồi đăng nhập lại để xem nội dung thuộc tài khoản.',
    'Kết quả được giữ để phục vụ xem lại cho đến khi có yêu cầu xóa đã xác minh hoặc dịch vụ có thông báo thay đổi. Bạn có thể yêu cầu truy cập, sửa hoặc xóa dữ liệu qua kênh liên hệ bên dưới. Dữ liệu cần giữ để đối soát kế toán, xử lý tranh chấp hoặc thực hiện nghĩa vụ áp dụng có thể được lưu riêng; không dùng việc xóa dữ liệu cá nhân để xóa lịch sử thu chi.',
    'Khi yêu cầu xóa, đơn vị vận hành sẽ xác minh quyền sở hữu, xóa email, dữ liệu sinh và bài luận trong hệ thống hoạt động; các bản sao lưu được xử lý theo quy trình lưu trữ của đơn vị vận hành. Không gửi mật khẩu ngân hàng, mã OTP hoặc khóa bí mật cho bộ phận hỗ trợ.'
  ]},
  'hoan-tien': {title:'Chính sách hoàn tiền và xử lý sự cố',paragraphs:[
    'Nếu đã chuyển khoản nhưng đơn chưa mở, không chuyển thêm. Liên hệ hỗ trợ với mã đơn, thời gian, số tiền và mã giao dịch để đối soát. Giao dịch sai số tiền, sai mã hoặc đến sau hạn không được tự động coi là đã thanh toán.',
    'Nếu bài luận không tạo được, bạn có tối đa ba lần xử lý cho một bài. Khi hết số lần mà vẫn lỗi, lượt được trả lại; hãy liên hệ hỗ trợ trước khi tiếp tục. Không thu thêm tiền chỉ để xem lại kết quả đã lưu.',
    'Bạn có thể gửi yêu cầu hoàn tiền cho giao dịch trùng, khoản thu không khớp hoặc phần dịch vụ không cung cấp được. Đơn vị vận hành kiểm tra lịch sử đơn và trao đổi phương án hoàn về tài khoản phù hợp. Không yêu cầu bạn trả phí hoặc cung cấp OTP để nhận hoàn tiền.',
    'Yêu cầu đối với bài luận đã cung cấp sẽ được xem xét theo tình trạng dịch vụ và nội dung phản ánh; không cam kết các nhận định Tử Vi sẽ xảy ra. Việc ghi nhận hoàn tiền trên website không tự chuyển tiền ngân hàng: đơn vị vận hành cần thực hiện và đối soát khoản hoàn thực tế.'
  ]},
  'gioi-thieu': {title:'Giới thiệu và liên hệ',paragraphs:[
    'Website hỗ trợ lập lá số Tử Vi Đẩu Số, xem cách cục và cổ thư, cùng bài luận giải chi tiết theo từng lá số có tham khảo bộ dữ liệu tiếng Việt. Nội dung phục vụ tham khảo và giải trí.',
    'Khi liên hệ về thanh toán, hãy gửi mã đơn thay vì công khai ngày giờ sinh hoặc đường link riêng trên mạng xã hội. Chúng tôi không yêu cầu mã OTP, mật khẩu ngân hàng hoặc thông tin đăng nhập của bạn.'
  ]},
};
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) { const {slug}=await params,p=policies[slug];return p?publicMetadata(`/chinh-sach/${slug}`,p.title,`${p.title} của Xem Tử Vi Online: thông tin sử dụng dịch vụ, quyền của khách hàng và cách liên hệ hỗ trợ.`):{}; }
export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const p=policies[(await params).slug];if(!p)notFound();
  return <main className="mx-auto max-w-3xl px-4 py-10"><article className="space-y-4 rounded-xl border border-[#d9c7a3] bg-white p-6"><h1 className="font-serif text-3xl font-bold text-son">{p.title}</h1>
    {p.paragraphs.map((text,i)=><p key={i} className="leading-relaxed">{text}</p>)}
    <section className="border-t pt-4"><h2 className="font-bold">Đơn vị vận hành và hỗ trợ</h2>
      <p>{process.env.OPERATOR_NAME||'Thông tin đơn vị vận hành chưa được cấu hình; chưa mở nhận thanh toán thật.'}</p>
      {process.env.OPERATOR_ADDRESS&&<p>Địa chỉ: {process.env.OPERATOR_ADDRESS}</p>}
      {process.env.OPERATOR_TAX_ID&&<p>Mã số thuế: {process.env.OPERATOR_TAX_ID}</p>}
      {process.env.SUPPORT_EMAIL&&<p>Email: <a className="underline" href={`mailto:${process.env.SUPPORT_EMAIL}`}>{process.env.SUPPORT_EMAIL}</a></p>}
    </section>
  </article></main>;
}
