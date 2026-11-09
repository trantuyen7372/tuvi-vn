export type AuthMailPurpose = 'verify' | 'reset';
export const AUTH_TOKEN_MINUTES = { verify: 24 * 60, reset: 30 } as const;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
}

export function authEmailContent(url: string, purpose: AuthMailPurpose, welcomeCredits = 0) {
  const verify = purpose === 'verify';
  const title = verify ? 'Xác minh email của bạn' : 'Đặt lại mật khẩu';
  const button = verify ? 'Xác minh email' : 'Đặt lại mật khẩu';
  const introduction = verify
    ? 'Cảm ơn bạn đã tạo tài khoản tại Xem Tử Vi Online. Bấm nút bên dưới để xác nhận địa chỉ email và hoàn tất đăng ký.'
    : 'Chúng tôi nhận được yêu cầu đặt lại mật khẩu tài khoản Xem Tử Vi Online của bạn. Bấm nút bên dưới để chọn mật khẩu mới.';
  const bonus = verify && welcomeCredits > 0
    ? `Tài khoản mới được tặng ${welcomeCredits} lượt trải nghiệm sau khi xác minh email. Ưu đãi chỉ cấp một lần; bài đã lưu được đọc lại miễn phí.`
    : '';
  const expires = verify ? '24 giờ' : `${AUTH_TOKEN_MINUTES.reset} phút`;
  const caution = verify
    ? 'Nếu bạn không tạo tài khoản, hãy bỏ qua email này. Không chia sẻ đường link xác minh với người khác.'
    : 'Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Mật khẩu hiện tại của bạn vẫn được giữ nguyên. Không chia sẻ đường link này với người khác.';
  const text = [title, introduction, bonus, `${button}: ${url}`, `Link chỉ dùng một lần và hết hạn sau ${expires}.`, caution, 'Xem Tử Vi Online'].filter(Boolean).join('\n\n');
  const safeUrl = escapeHtml(url);
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head>
<body style="margin:0;background:#f7f3ea;color:#30261b;font-family:Arial,sans-serif;line-height:1.7">
<div style="display:none;max-height:0;overflow:hidden">${verify?'Xác nhận email để hoàn tất đăng ký tài khoản.':'Tạo mật khẩu mới bằng đường link dùng một lần.'}</div>
<table role="presentation" style="width:100%;border-collapse:collapse"><tr><td style="padding:24px 12px">
<table role="presentation" style="width:100%;max-width:560px;margin:auto;background:#fff;border:1px solid #d9c7a3;border-radius:12px"><tr><td style="padding:28px">
<p style="margin:0 0 20px;font-size:14px;letter-spacing:1px;color:#8b2e21">XEM TỬ VI ONLINE</p>
<h1 style="font-size:26px;line-height:1.35;margin:0 0 18px">${title}</h1>
<p>${introduction}</p>${bonus?`<p style="padding:14px;background:#fff6e5;border-radius:8px">${bonus}</p>`:''}
<p style="margin:28px 0"><a href="${safeUrl}" style="display:inline-block;background:#8b2e21;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:bold">${button}</a></p>
<p>Link chỉ dùng một lần và hết hạn sau <strong>${expires}</strong>.</p>
<p style="font-size:13px;color:#6b5b45">Nếu nút không mở được, sao chép đường link này vào trình duyệt:</p>
<p style="font-size:12px;overflow-wrap:anywhere;word-break:break-all"><a href="${safeUrl}" style="color:#8b2e21">${safeUrl}</a></p>
<p style="margin-top:24px;padding-top:18px;border-top:1px solid #e9dfcd;font-size:13px;color:#6b5b45">${caution}</p>
</td></tr></table></td></tr></table></body></html>`;
  return { subject: verify ? 'Xác minh email tài khoản Xem Tử Vi Online' : 'Đặt lại mật khẩu Xem Tử Vi Online', text, html };
}
