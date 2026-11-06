#!/usr/bin/env bash
set -euo pipefail
# Runtime riêng; không thay /usr/bin/node, PHP, nginx hoặc app khác.
target=/opt/tuvi-node
if [[ -x "$target/bin/node" ]]; then
  "$target/bin/node" -e 'const [a,b]=process.versions.node.split(".").map(Number);if(a<22||(a===22&&b<15))process.exit(1);console.log(process.version)'
  exit 0
fi
if [[ -e "$target" ]]; then echo 'Đường dẫn runtime đã tồn tại nhưng không có Node; cần kiểm tra thủ công.' >&2; exit 1; fi
case "$(uname -m)" in aarch64) arch=arm64 ;; x86_64) arch=x64 ;; *) echo 'Kiến trúc chưa hỗ trợ'; exit 1 ;; esac
stage=$(mktemp -d /tmp/tuvi-node.XXXXXX)
cd "$stage"
curl -fsS --connect-timeout 15 --max-time 180 https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt -o SHASUMS256.txt
archive=$(awk -v arch="$arch" '$2 ~ ("-linux-" arch ".tar.xz$") {print $2}' SHASUMS256.txt)
[[ "$archive" =~ ^node-v24\.[0-9]+\.[0-9]+-linux-(arm64|x64)\.tar\.xz$ ]]
curl -fsS --connect-timeout 15 --max-time 300 "https://nodejs.org/dist/latest-v24.x/$archive" -o "$archive"
awk -v name="$archive" '$2==name' SHASUMS256.txt > selected.sha256
sha256sum --check selected.sha256
install -d -m 755 "$target"
tar -xJf "$archive" --strip-components=1 -C "$target"
"$target/bin/node" --version
echo "Runtime đã cài riêng tại $target; gói kiểm chứng giữ tại $stage"
