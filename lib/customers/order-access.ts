import {get, run} from '../commerce/db';
import {customer, type Customer} from './auth';
import type {Order} from '../commerce/store';

export class AccessError extends Error {
  constructor(message: string, public status: number) {super(message);}
}

export function privateCustomer(req: Request): Customer {
  const owner = customer(req);
  if (!owner) throw new AccessError('Vui lòng đăng nhập tài khoản để xem đơn hàng và bài luận của bạn.', 401);
  return owner;
}

/** A URL token locates a record; the authenticated account grants access. */
export function authorizeOrder(orderId: string, owner: Customer) {
  let order = get<Order & {customer_id: string | null}>('SELECT * FROM orders WHERE id=?', orderId);
  if (!order) throw new AccessError('Không tìm thấy nội dung hoặc bạn không có quyền truy cập.', 404);
  // Migrate legacy guest purchases only after proving ownership of the email.
  if (!order.customer_id && owner.verified && order.email === owner.email) {
    run('UPDATE orders SET customer_id=? WHERE id=? AND customer_id IS NULL AND email=?', owner.id, order.id, owner.email);
    order = get<Order & {customer_id: string | null}>('SELECT * FROM orders WHERE id=?', order.id)!;
  }
  if (order.customer_id !== owner.id) throw new AccessError('Không tìm thấy nội dung hoặc bạn không có quyền truy cập.', 404);
  return order;
}
