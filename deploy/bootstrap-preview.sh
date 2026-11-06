#!/usr/bin/env bash
set -euo pipefail
cd /srv/tuvi-vn
test -f .tuvi-managed
tar -xzf uploads/tuvi-release.tar.gz -C /srv/tuvi-vn
install -d -m 700 storage
install -d -m 755 data
tar -xf uploads/tuvi-dataset.tar -C data
python3 - <<'PY'
import os,secrets
if not os.path.exists('.env.local'):
    values={
        'SITE_URL':'https://xemtuvionline.vn','ADMIN_PASSWORD':secrets.token_urlsafe(32),
        'TUVI_DB_PATH':'/srv/tuvi-vn/storage/tuvi.sqlite','TUVI_DATASET_DIR':'/srv/tuvi-vn/data/v4-vi',
        'READING_ENGINE':'dataset','FREE_READING_CREDITS':'3','PAYMENTS_ENABLED':'0',
        'PAYMENT_PROVIDER':'payos','TUVI_ALLOW_TEST_PAYMENTS':'0','TRUST_PROXY':'1',
        'ANTHROPIC_API_KEY':'','RESEND_API_KEY':'','MAIL_FROM':'','SUPPORT_EMAIL':'',
        'OPERATOR_NAME':'MINH ĐĂNG','OPERATOR_ADDRESS':'','OPERATOR_TAX_ID':'',
    }
    with os.fdopen(os.open('.env.local',os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600),'w') as f:
        for k,v in values.items():f.write(k+'='+v+'\n')
PY
export PATH=/opt/tuvi-node/bin:$PATH
export NEXT_TELEMETRY_DISABLED=1
npm ci --include=dev
NODE_OPTIONS=--max-old-space-size=4096 npm run build
install -d -m 700 .next/cache
node scripts/preflight.mjs
echo 'Đã chuẩn bị bản trải nghiệm; chưa xuất bản HTTPS và chưa bật thu tiền.'
