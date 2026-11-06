import { PayOS } from '@payos/node';
import { siteUrl } from './config';

export interface PaymentOrder { code: number; amount: number; expires: number; token: string }
export interface Gateway {
  name: string;
  create(order: PaymentOrder): Promise<{ id: string; checkoutUrl: string; qrCode: string }>;
  verify(body: unknown): Promise<{ orderCode: number; amount: number; reference: string; paymentLinkId: string; code: string; currency: string }>;
}
function client() {
  const { PAYOS_CLIENT_ID: clientId, PAYOS_API_KEY: apiKey, PAYOS_CHECKSUM_KEY: checksumKey } = process.env;
  if (!clientId || !apiKey || !checksumKey) throw new Error('Thanh toán chưa được cấu hình. Vui lòng quay lại sau.');
  return new PayOS({ clientId, apiKey, checksumKey });
}
export function gateway(): Gateway {
  if (process.env.PAYMENT_PROVIDER === 'mock') {
    if (process.env.TUVI_ALLOW_TEST_PAYMENTS !== '1' || process.env.ANTHROPIC_API_KEY) throw new Error('Chế độ thử chỉ dùng khi bật rõ ràng và không có khóa AI thật');
    return {
      name: 'mock',
      async create(o) { return { id: `test-${o.code}`, checkoutUrl: '', qrCode: '' }; },
      async verify() { throw new Error('Thanh toán thử không nhận webhook'); },
    };
  }
  return {
    name: 'payos',
    async create(o) {
      if (!process.env.ANTHROPIC_API_KEY || !process.env.OPERATOR_NAME || !process.env.SUPPORT_EMAIL || !process.env.SITE_URL?.startsWith('https://')) throw new Error('Chưa đủ cấu hình để nhận tiền thật');
      const url = `${siteUrl()}/don-hang/${o.token}`;
      const link = await client().paymentRequests.create({ orderCode: o.code, amount: o.amount,
        description: `TUVI${o.code}`, returnUrl: url, cancelUrl: url, expiredAt: Math.floor(o.expires / 1000) });
      return { id: link.paymentLinkId, checkoutUrl: link.checkoutUrl, qrCode: link.qrCode };
    },
    async verify(body) { return await client().webhooks.verify(body as Parameters<PayOS['webhooks']['verify']>[0]); },
  };
}
