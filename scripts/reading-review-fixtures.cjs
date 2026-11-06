// Hồ sơ minh họa để biên tập, không phải dữ liệu khách hàng.
module.exports=[
  {id:'R01',date:'1976-02-01',hour:10,gender:'nam',purpose:'Sát Phá Tham, Thân cư Tài'},
  {id:'R02',date:'1988-08-08',hour:5,gender:'nu',purpose:'Liêm Tướng/Vũ Khúc, Thân cư Phu'},
  {id:'R03',date:'1990-06-15',hour:3,gender:'nam',purpose:'Thiên Cơ/Cự Môn, chuyên môn và diễn đạt'},
  {id:'R04',date:'1995-11-20',hour:10,gender:'nu',purpose:'Vũ Khúc/Tử Phủ, tổ chức và nguồn lực'},
  {id:'R05',date:'2000-01-01',hour:0,gender:'nam',purpose:'Thái Âm/Đồng Lương, năm sinh trước Tết'},
  {id:'R06',date:'1976-02-01',hour:2,gender:'nu',purpose:'Mệnh và Quan vô chính diệu'},
  {id:'R07',date:'1976-02-01',hour:1,gender:'nam',purpose:'Mệnh vô chính diệu, Thân cư Phúc'},
  {id:'R08',date:'1988-08-08',hour:10,gender:'nu',purpose:'Liêm Sát/Vũ Phá, chính tinh và sao hỗ trợ'},
  {id:'R09',date:'2002-03-10',hour:6,gender:'nu',purpose:'Giai đoạn đầu trưởng thành'},
  {id:'R10',date:'1950-01-01',hour:0,gender:'nam',purpose:'Tuổi cao, không giả định đang làm/nghỉ hưu'},
  {id:'R11',date:'2023-02-05',hour:4,gender:'nu',calendar:'am',leap:true,purpose:'Trẻ em, âm lịch tháng nhuận'},
  {id:'R12',date:'2000-01-01',hour:12,gender:'nam',purpose:'Tý muộn và vị trí Thân'},
].map(c=>({calendar:'duong',leap:false,year:2026,...c}));
