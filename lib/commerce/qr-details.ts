/** Đọc thông tin từ chính payload VietQR của đơn; không suy từ cấu hình tài khoản. */
export function qrDetails(raw:string|null){
 try{
  if(!raw||!/^\d/.test(raw))return null;
  const bytes=Buffer.from(raw,'utf8');
  if(bytes.subarray(-8,-4).toString()!=='6304')return null;
  let crc=0xffff;for(const byte of bytes.subarray(0,-4)){crc^=byte<<8;for(let i=0;i<8;i++)crc=(crc&0x8000?crc<<1^0x1021:crc<<1)&0xffff;}
  if(crc.toString(16).padStart(4,'0').toUpperCase()!==bytes.subarray(-4).toString().toUpperCase())return null;
  function fields(buffer:Buffer){const result=new Map<string,Buffer>();let i=0;while(i<buffer.length){const id=buffer.subarray(i,i+2).toString(),lengthText=buffer.subarray(i+2,i+4).toString();if(!/^\d{2}$/.test(id)||!/^\d{2}$/.test(lengthText))throw Error();const n=Number(lengthText);if(i+4+n>buffer.length||result.has(id))throw Error();result.set(id,buffer.subarray(i+4,i+4+n));i+=4+n;}return result;}
  const top=fields(bytes),merchant=fields(top.get('38')||Buffer.alloc(0));if(merchant.get('00')?.toString()!=='A000000727')return null;
  const bank=fields(merchant.get('01')||Buffer.alloc(0)),accountNumber=bank.get('01')?.toString(),bankBin=bank.get('00')?.toString();
  const description=fields(top.get('62')||Buffer.alloc(0)).get('08')?.toString();
  if(!accountNumber||!bankBin||!/^\d{6}$/.test(bankBin)||!/^\d{4,35}$/.test(accountNumber))return null;
  return {accountNumber,bankBin,...(description?{description}:{})};
 }catch{return null;}
}
