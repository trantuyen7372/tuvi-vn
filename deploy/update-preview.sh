#!/usr/bin/env bash
set -Eeuo pipefail
cd /srv/tuvi-vn
test -f .tuvi-managed
test -f uploads/tuvi-release.tar.gz
export PATH=/opt/tuvi-node/bin:$PATH
export NEXT_TELEMETRY_DISABLED=1
snapshot="storage/backups/release-$(date -u +%Y%m%dT%H%M%SZ)"
install -d -m 700 "$snapshot"
tar -czf "$snapshot/source.tar.gz" app components lib scripts deploy package.json package-lock.json next.config.js postcss.config.js tailwind.config.ts tsconfig.json
tar -czf "$snapshot/build.tar.gz" .next
cp -p .env.local "$snapshot/env.local"
node --env-file=.env.local scripts/backup-db.mjs
rollback(){
  trap - ERR
  echo 'Cập nhật lỗi, đang khôi phục mã nguồn và build trước.' >&2
  sudo -n systemctl stop tuvi-vn || true
  tar -xzf "$snapshot/source.tar.gz"
  # Giữ build lỗi để xem lại; không xóa dữ liệu hoặc cấu hình riêng.
  if test -d .next; then mv .next "$snapshot/failed-next"; fi
  tar -xzf "$snapshot/build.tar.gz"
  cp -p "$snapshot/env.local" .env.local
  sudo -n systemctl start tuvi-vn
  exit 1
}
trap rollback ERR
sudo -n systemctl stop tuvi-vn
tar -xzf uploads/tuvi-release.tar.gz
if test -n "${INDEXED_DATASET_DIR:-}"; then node scripts/activate-indexed-dataset.mjs "$INDEXED_DATASET_DIR"; fi
# Đợt này không đổi dependency: kiểm tra lock trước khi dùng node_modules sẵn có.
tar -xOf "$snapshot/source.tar.gz" package-lock.json > "$snapshot/previous-package-lock.json"
cmp package-lock.json "$snapshot/previous-package-lock.json"
NODE_OPTIONS=--max-old-space-size=4096 npm run build
node --env-file=.env.local scripts/preflight.mjs
install -d -m 700 .next/cache
sudo -n systemctl start tuvi-vn
for attempt in {1..15}; do
  if curl --silent --fail http://127.0.0.1:3100/api/health > /dev/null; then break; fi
  sleep 1
done
node --env-file=.env.local scripts/smoke-server.mjs
trap - ERR
echo "Đã cập nhật bản trải nghiệm; backup trước cập nhật tại $snapshot. Thu tiền và cấu hình công khai không thay đổi."
