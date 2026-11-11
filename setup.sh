#!/usr/bin/env bash
# Reinstala todo en una sesión nueva. Ejecutar desde la carpeta del repositorio.
set -e
npm install -g hyperframes
(cd remotion-video && npm install)
(cd motion-canvas-video && npm install)
(cd hyperframes-video && npm install || true)
if [ ! -d ../MoneyPrinterTurbo ]; then
  git clone --depth 1 https://github.com/harry0703/MoneyPrinterTurbo.git ../MoneyPrinterTurbo
fi
command -v uv >/dev/null || pip install uv
(cd ../MoneyPrinterTurbo && uv sync)
cp moneyprinterturbo/config.toml ../MoneyPrinterTurbo/config.toml
echo "Listo."
