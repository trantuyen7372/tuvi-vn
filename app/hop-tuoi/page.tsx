import type { Metadata } from 'next';
import { publicMetadata } from '@/lib/seo';
import CompatibilityView from '@/components/CompatibilityView';

export const metadata: Metadata = publicMetadata(
  '/hop-tuoi',
  'Xem bói hợp tuổi – So sánh 2 lá số Tử Vi vợ chồng, làm ăn | Xem Tử Vi Online',
  'Bình giải tương hợp 2 tuổi theo Ngũ Hành Nạp Âm, Thiên Can Địa Chi, Cung Phi Bát Trạch và Tử Vi Đẩu Số. Nhận diện điểm sáng, thách thức và cách hóa giải thực tế.'
);

export default function HopTuoiPage() {
  return (
    <main className="editorial-page mx-auto max-w-5xl px-4 py-10">
      {/* Header Card */}
      <div className="relative mb-8 rounded-2xl border border-[#dcc9af] bg-gradient-to-r from-[#fffdf9] via-[#fcf5e8] to-[#f7eedc] p-6 sm:p-8 shadow-sm">
        <p className="site-eyebrow mb-2">
          <span className="eyebrow-line" /> THẤU HIỂU ĐỐI TÁC · BỒI ĐẮP DUYÊN LÀNH
        </p>
        <h1 className="font-serif text-3xl font-bold text-son sm:text-4xl">
          Xem bói hợp tuổi & So sánh 2 lá số
        </h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-[#5a4a36]">
          Phân tích đối sánh chuyên sâu giữa hai bản mệnh dựa trên 4 trụ cột truyền thống: Ngũ Hành Nạp Âm, Thiên Can Địa Chi, Cung Phi Bát Trạch và tổ hợp cung vị Tử Vi.
          Giúp bạn hiểu rõ cơ duyên hòa hợp, những điểm khác biệt cần tiết chế và phương pháp hóa giải thực tế cho hôn nhân hay cộng sự làm ăn.
        </p>
        <p className="mt-2 text-xs text-[#8c6729]">
          Đối chiếu thêm với <a href="/xem-ngay" className="text-son underline font-medium">xem ngày tốt cưới hỏi, khai trương</a> hoặc <a href="/huong-dan/y-nghia-12-cung" className="text-son underline font-medium">ý nghĩa 12 cung Tử Vi</a>.
        </p>
      </div>

      {/* Main Interactive Comparison Widget */}
      <CompatibilityView />

      {/* Cultural Knowledge Section */}
      <section className="mt-12 rounded-2xl border border-[#e5d8c3] bg-[#fffefa] p-6 sm:p-8 shadow-sm" aria-labelledby="hop-tuoi-guide-heading">
        <h2 id="hop-tuoi-guide-heading" className="font-serif text-2xl font-bold text-son">
          Cơ sở luận giải tương hợp trong mệnh lý cổ truyền
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-[#ebdcc7] bg-[#fffdf9] p-5">
            <h3 className="font-serif text-base font-bold text-[#352516]">1. Nạp âm bản mệnh</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5c4a35]">
              Ngũ hành nạp âm là gốc rễ khí chất. Kim - Mộc - Thủy - Hỏa - Thổ sinh dưỡng nhau tạo nên dòng năng lượng nuôi dưỡng hạnh phúc và tài lộc trường cửu.
            </p>
          </div>

          <div className="rounded-xl border border-[#ebdcc7] bg-[#fffdf9] p-5">
            <h3 className="font-serif text-base font-bold text-[#352516]">2. Cung phi Bát trạch</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5c4a35]">
              Quái mệnh nam nữ kết hợp theo Bát Du Niên tạo nên các cung Sinh Khí, Diên Niên, Thiên Y; xác định phương vị tương hỗ trong cuộc sống gia đình và sự nghiệp.
            </p>
          </div>

          <div className="rounded-xl border border-[#ebdcc7] bg-[#fffdf9] p-5">
            <h3 className="font-serif text-base font-bold text-[#352516]">3. Đức năng thắng số</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5c4a35]">
              Cổ thư luôn răn dạy: Duyên do trời định nhưng phận do người nắm giữ. Sự nhẫn nại, tôn trọng và sẻ chia chân thành là phương thuốc hóa giải mọi xung khắc can chi.
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-[#ebdcc7] pt-4 text-xs text-[#705e49] leading-relaxed">
          <p>
            <b>Ghi chú:</b> Luận giải hợp tuổi nhằm mang lại góc nhìn tham khảo khách quan, giúp đôi bên thấu hiểu thế mạnh và giới hạn của nhau để cùng nhau hoàn thiện cuộc sống.
          </p>
        </div>
      </section>
    </main>
  );
}
