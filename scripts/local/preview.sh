#!/usr/bin/env bash

l="${LANDSCAPE}"

set -euo pipefail

echo "🎨 Generating PWA assets..."
bun run generate-pwa-assets

echo "🔧 Exporting build info and building application..."

eval "$(./scripts/ci/export_build_info.sh)"

bun run build

wrangler dev --env "$l"
