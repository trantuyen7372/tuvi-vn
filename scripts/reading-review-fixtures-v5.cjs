// Vòng rà thứ hai: hồ sơ mới, có biên năm âm lịch, tuổi 18 và ngoài khoảng hạn.
module.exports=[
  {id:'S01',date:'1964-09-22',hour:4,gender:'nam',purpose:'Trưởng thành muộn, phối hợp vai trò và nguồn lực'},
  {id:'S02',date:'1979-12-31',hour:9,gender:'nu',purpose:'Sinh cuối năm dương, các hóa đổi lớp'},
  {id:'S03',date:'1983-05-14',hour:2,gender:'nam',purpose:'Đọc nguyên nhân của đổi Lộc/Quyền/Khoa/Kỵ'},
  {id:'S04',date:'1986-10-02',hour:11,gender:'nu',purpose:'Vai trò ở ngoài và quan hệ gần gũi'},
  {id:'S05',date:'1991-07-19',hour:6,gender:'nam',year:2033,purpose:'Chọn năm khác 2026 và các năm tiếp theo'},
  {id:'S06',date:'1994-02-11',hour:1,gender:'nu',purpose:'Ngày sát Tết, điểm trùng giữa các lớp'},
  {id:'S07',date:'1998-09-03',hour:8,gender:'nam',purpose:'Độ sáng và cách tạo thành quả'},
  {id:'S08',date:'2004-04-17',hour:5,gender:'nu',purpose:'Đầu tuổi trưởng thành, hạn có phần trước 18'},
  {id:'S09',date:'2009-11-02',hour:7,gender:'nu',purpose:'Đúng 18 tuổi âm'},
  {id:'S10',date:'2008-02-06',hour:12,gender:'nam',purpose:'Tý muộn đúng giao thừa âm lịch'},
  {id:'S11',date:'2026-06-01',hour:0,gender:'nu',purpose:'Một tuổi, chưa vào đại hạn đầu'},
  {id:'S12',date:'1964-09-22',hour:4,gender:'nam',year:2100,purpose:'Năm 2100, tuổi ngoài các đại hạn hiện có'},
].map(c=>({calendar:'duong',leap:false,year:2026,...c}));
