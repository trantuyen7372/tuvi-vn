import fs from 'node:fs';

/** LRU theo dung lượng Buffer; chỉ giữ nội dung kho, không giữ dữ liệu tài khoản. */
export class DatasetMonthCache {
  private entries=new Map<string,{version:string;text:Buffer;bytes:number}>();
  private bytes=0;
  constructor(private readonly limit=64*1024*1024){}
  read(file:string,decode:(file:string)=>Buffer){
    // stat mỗi lượt để bản kho thay tại cùng đường dẫn không bị dùng lại.
    const stat=fs.statSync(file),version=`${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeMs}:${stat.ctimeMs}`;
    const old=this.entries.get(file);
    if(old){
      this.entries.delete(file);this.bytes-=old.bytes;
      if(old.version===version){this.entries.set(file,old);this.bytes+=old.bytes;return old.text;}
    }
    const text=decode(file),bytes=text.byteLength;
    if(bytes<=this.limit){
      while(this.bytes+bytes>this.limit&&this.entries.size){
        const key=this.entries.keys().next().value!;
        this.bytes-=this.entries.get(key)!.bytes;this.entries.delete(key);
      }
      this.entries.set(file,{version,text,bytes});this.bytes+=bytes;
    }
    return text;
  }
  get sizeBytes(){return this.bytes;}
}
