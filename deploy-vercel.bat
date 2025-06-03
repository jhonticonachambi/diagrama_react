@echo off
echo "🚀 Desplegando a Vercel..."
echo "📋 Configurando variables de entorno..."

REM Instalar Vercel CLI si no está instalado
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
)

REM Configurar variables de entorno en Vercel
echo "🔧 Configurando VITE_API_BASE_URL..."
vercel env add VITE_API_BASE_URL production

echo "🏗️  Construyendo y desplegando..."
vercel --prod

echo "✅ Despliegue completado!"
echo "🌐 Tu aplicación está disponible en la URL proporcionada por Vercel"
echo ""
echo "📝 Recuerda verificar que:"
echo "   - La variable VITE_API_BASE_URL esté configurada correctamente"
echo "   - El backend esté funcionando en: https://uml-clean-architecture.onrender.com"
echo "   - Los CORS estén configurados en el backend"
