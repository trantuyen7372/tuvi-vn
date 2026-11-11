/** Chỉ gửi tín hiệu làm mới phiên; không lưu thông tin tài khoản/token trong trình duyệt. */
export const AUTH_CHANGED='tuvi:auth-changed';
export const AUTH_STORAGE_KEY='tuvi-auth-changed';
export function safeCustomerDestination(value:string){
  return value==='/tai-khoan'||/^\/la-so\?/.test(value)||/^\/(?:luan-giai|don-hang)\/[a-f0-9]{64}$/.test(value)?value:'/tai-khoan';
}
export function notifyAuthChanged(){
  window.dispatchEvent(new Event(AUTH_CHANGED));
  try{localStorage.setItem(AUTH_STORAGE_KEY,`${Date.now()}-${Math.random()}`);}catch{}
}
