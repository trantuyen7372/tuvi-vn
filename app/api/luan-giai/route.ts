// Endpoint cũ không còn cho phép TUVI_CODES gọi AI.
export async function POST() {
  return Response.json({ error: "Vui lòng tạo đơn và mở luận giải từ đường link riêng." }, { status: 410 });
}
