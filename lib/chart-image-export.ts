import type { ChartView } from '@/lib/tuvi';
import { BRANCH_GRID } from '@/lib/chart-layout';
import { starElement, FIVE_ELEMENTS } from '@/lib/five-elements';

export async function exportChartAsPng(chart: ChartView): Promise<void> {
  const width = 1200;
  const height = 1450;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Background
  ctx.fillStyle = '#fbf7ee';
  ctx.fillRect(0, 0, width, height);

  // Outer border
  ctx.strokeStyle = '#b5894c';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Inner border
  ctx.strokeStyle = '#dccbb2';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  // Corner brackets
  const drawCorner = (x: number, y: number, dx: number, dy: number) => {
    ctx.strokeStyle = '#8a1818';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + dx * 20, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * 20);
    ctx.stroke();
  };
  drawCorner(34, 34, 1, 1);
  drawCorner(width - 34, 34, -1, 1);
  drawCorner(34, height - 34, 1, -1);
  drawCorner(width - 34, height - 34, -1, -1);

  // 2. Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#8c6729';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('✦ BẢN MỆNH THIÊN BÀN · TỬ VI ĐẨU SỐ ✦', width / 2, 60);

  ctx.fillStyle = '#8a1818';
  ctx.font = 'bold 34px "Noto Serif", Georgia, serif';
  ctx.fillText('LÁ SỐ TỬ VI TRỌN ĐỜI', width / 2, 100);

  const nameText = chart.input.name ? `Đương số: ${chart.input.name}` : 'Đương số: Khuyết danh';
  const genderText = chart.input.gender === 'nu' ? 'Nữ mệnh' : 'Nam mệnh';
  ctx.fillStyle = '#423323';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${nameText}  ·  ${genderText}  ·  Năm xem: ${chart.year} (${chart.nominalAge} tuổi âm)`, width / 2, 130);

  ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#6e5842';
  ctx.fillText(`Dương lịch: ${chart.solarDate}  ·  Âm lịch: ${chart.lunarText}  ·  ${chart.time} (${chart.timeRange})`, width / 2, 154);

  // 3. Grid Coordinates
  const gridStartX = 40;
  const gridStartY = 175;
  const gridWidth = width - 80;
  const gridHeight = 1180;
  const cellW = gridWidth / 4;
  const cellH = gridHeight / 4;

  // Background for grid
  ctx.fillStyle = '#fffdf9';
  ctx.fillRect(gridStartX, gridStartY, gridWidth, gridHeight);

  // Draw 12 Palaces
  chart.palaces.forEach((p) => {
    const gridPos = BRANCH_GRID[p.branch];
    if (!gridPos) return;
    const colIdx = gridPos[1] - 1; // 0..3
    const rowIdx = gridPos[0] - 1; // 0..3
    const x = gridStartX + colIdx * cellW;
    const y = gridStartY + rowIdx * cellH;

    // Cell border
    ctx.strokeStyle = '#d8c5a8';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, cellW, cellH);

    // Cell header
    ctx.fillStyle = p.isYearlyNow ? '#faeed9' : '#faf3e6';
    ctx.fillRect(x + 1, y + 1, cellW - 2, 28);
    ctx.strokeStyle = '#e8d8be';
    ctx.strokeRect(x + 1, y + 1, cellW - 2, 28);

    // Can Chi & Palace Name
    ctx.textAlign = 'left';
    ctx.fillStyle = '#7a6652';
    ctx.font = '600 11px -apple-system, sans-serif';
    ctx.fillText(`${p.stem} ${p.branch}`, x + 8, y + 18);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#8a1818';
    ctx.font = 'bold 13px "Noto Serif", Georgia, serif';
    ctx.fillText(p.name, x + cellW - 8, y + 19);

    if (p.isBody) {
      ctx.fillStyle = '#8a1818';
      ctx.fillRect(x + cellW - 65, y + 6, 26, 16);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('THÂN', x + cellW - 52, y + 18);
    }

    // Stars list
    let starY = y + 46;
    ctx.textAlign = 'left';

    // Major Stars
    if (p.major.length === 0) {
      ctx.fillStyle = '#9e8d77';
      ctx.font = 'italic 11px -apple-system, sans-serif';
      ctx.fillText('Vô chính diệu', x + 10, starY);
      starY += 18;
    } else {
      p.major.forEach((s) => {
        const el = starElement(s.name);
        const color = el && FIVE_ELEMENTS[el] ? FIVE_ELEMENTS[el].color : '#8a1818';
        ctx.fillStyle = color;
        ctx.font = 'bold 12.5px "Noto Serif", Georgia, serif';
        ctx.fillText(s.name, x + 10, starY);

        if (s.brightness) {
          ctx.fillStyle = '#786550';
          ctx.font = '10px -apple-system, sans-serif';
          ctx.fillText(`(${s.brightness})`, x + 72, starY - 0.5);
        }

        if (s.mutagen) {
          ctx.fillStyle = '#8a1818';
          ctx.fillRect(x + 94, starY - 10, 36, 14);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px -apple-system, sans-serif';
          ctx.fillText(`Hóa ${s.mutagen}`, x + 97, starY);
        }

        starY += 19;
      });
    }

    // Minor Stars
    starY += 4;
    p.minor.slice(0, 7).forEach((s) => {
      const el = starElement(s.name);
      ctx.fillStyle = el && FIVE_ELEMENTS[el] ? FIVE_ELEMENTS[el].color : '#5c4a35';
      ctx.font = '11px -apple-system, sans-serif';
      ctx.fillText(s.name, x + 10, starY);

      if (s.mutagen) {
        ctx.fillStyle = '#8a1818';
        ctx.fillRect(x + 75, starY - 9, 36, 13);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8.5px -apple-system, sans-serif';
        ctx.fillText(`Hóa ${s.mutagen}`, x + 78, starY);
      }

      starY += 16;
    });

    // Cell Footer (Decadal, Changsheng, Boshi)
    const footY = y + cellH - 8;
    ctx.fillStyle = '#6e5a44';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${p.changsheng} · ${p.boshi}`, x + 8, footY);

    ctx.textAlign = 'right';
    ctx.fillStyle = p.isDecadalNow ? '#8a1818' : '#705c47';
    ctx.font = p.isDecadalNow ? 'bold 11px -apple-system, sans-serif' : '10.5px -apple-system, sans-serif';
    ctx.fillText(`ĐH ${p.decadal[0]}–${p.decadal[1]}`, x + cellW - 8, footY);
  });

  // Central Thiên Bàn (col 1..2, row 1..2 in 0-indexed coords)
  const tbX = gridStartX + cellW;
  const tbY = gridStartY + cellH;
  const tbW = cellW * 2;
  const tbH = cellH * 2;

  // Thiên Bàn Background
  ctx.fillStyle = '#fffefb';
  ctx.fillRect(tbX, tbY, tbW, tbH);
  ctx.strokeStyle = '#b5894c';
  ctx.lineWidth = 2;
  ctx.strokeRect(tbX + 8, tbY + 8, tbW - 16, tbH - 16);

  // Double dashed border inside
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = '#d4b88a';
  ctx.lineWidth = 1;
  ctx.strokeRect(tbX + 14, tbY + 14, tbW - 28, tbH - 28);
  ctx.setLineDash([]);

  // Central content
  ctx.textAlign = 'center';
  ctx.fillStyle = '#8c6729';
  ctx.font = 'bold 11px -apple-system, sans-serif';
  ctx.fillText('✦ THIÊN BÀN MỆNH SỐ ✦', tbX + tbW / 2, tbY + 46);

  ctx.fillStyle = '#8a1818';
  ctx.font = 'bold 26px "Noto Serif", Georgia, serif';
  ctx.fillText(chart.input.name || 'LÁ SỐ TỬ VI', tbX + tbW / 2, tbY + 80);

  ctx.fillStyle = '#3a2b1c';
  ctx.font = '13px -apple-system, sans-serif';
  ctx.fillText(`Năm sinh: ${chart.canChi}  ·  Cục: ${chart.cuc}`, tbX + tbW / 2, tbY + 115);
  ctx.fillText(`Mệnh chủ: ${chart.menhChu}  ·  Thân chủ: ${chart.thanChu}`, tbX + tbW / 2, tbY + 140);
  ctx.fillText(`Cung Mệnh tại: ${chart.menhBranch}  ·  Thân cư tại: ${chart.thanBranch}`, tbX + tbW / 2, tbY + 165);

  // Red Seal stamp
  const sealX = tbX + tbW / 2 - 40;
  const sealY = tbY + tbH - 110;
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 2;
  ctx.strokeRect(sealX, sealY, 80, 80);
  ctx.strokeRect(sealX + 3, sealY + 3, 74, 74);
  ctx.fillStyle = '#991b1b';
  ctx.font = 'bold 13px "Noto Serif", serif';
  ctx.fillText('TỬ VI', tbX + tbW / 2, sealY + 30);
  ctx.fillText('ĐẨU SỐ', tbX + tbW / 2, sealY + 50);
  ctx.font = 'bold 9px sans-serif';
  ctx.fillText('XEMTUVIONLINE', tbX + tbW / 2, sealY + 68);

  // Footer copyright
  ctx.textAlign = 'center';
  ctx.fillStyle = '#8f7a63';
  ctx.font = '11px -apple-system, sans-serif';
  ctx.fillText('Xem Tử Vi Online · Tri Thức Cổ Truyền · https://xemtuvionline.vn', width / 2, height - 28);

  // Convert to blob and download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (chart.input.name || 'la-so')
      .trim()
      .replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '-')
      .toLowerCase();
    a.download = `la-so-tu-vi-${safeName}-${chart.year}.png`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, 'image/png');
}
