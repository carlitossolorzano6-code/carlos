# Proyectos de vídeo

| Carpeta | Herramienta | Qué es |
|---|---|---|
| `remotion-video/` | [Remotion](https://www.remotion.dev) | Vídeos hechos con React |
| `hyperframes-video/` | [HyperFrames](https://hyperframes.heygen.com) | Vídeos hechos con HTML |
| `moneyprinterturbo/` | [MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Configuración (`config.toml`) para generar vídeos cortos con IA |

## Instalar en una sesión nueva

```bash
./setup.sh
```

## Uso rápido

- Remotion: `cd remotion-video && npx remotion render HelloWorld out/video.mp4`
- HyperFrames: `cd hyperframes-video && hyperframes render -o out/video.mp4`
- MoneyPrinterTurbo (interfaz web): `cd ../MoneyPrinterTurbo && .venv/bin/streamlit run webui/Main.py`

## Claves

`config.toml` **no contiene claves reales**: el valor `proxy-injected` es un marcador.
La clave de OpenAI está guardada de forma segura en el entorno de Claude Code.
La API de OpenAI necesita saldo propio (platform.openai.com/settings/organization/billing);
la suscripción de ChatGPT no sirve para la API.
