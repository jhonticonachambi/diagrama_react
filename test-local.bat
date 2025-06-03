@echo off
echo "🧪 Probando conexión con el backend..."
echo ""

REM Verificar si el backend local está funcionando
echo "📡 Verificando backend local (http://127.0.0.1:8000)..."
curl -s http://127.0.0.1:8000/docs > nul
if %ERRORLEVEL% EQU 0 (
    echo "✅ Backend local está funcionando"
    set BACKEND_URL=http://127.0.0.1:8000
) else (
    echo "❌ Backend local no responde"
    echo "🌐 Usando backend en la nube..."
    set BACKEND_URL=https://uml-clean-architecture.onrender.com
)

echo ""
echo "📋 Configuración actual:"
echo "   - Backend URL: %BACKEND_URL%"
echo "   - Frontend URL: http://localhost:3000"
echo ""

REM Verificar backend en la nube
echo "🔍 Verificando backend en la nube..."
curl -s https://uml-clean-architecture.onrender.com/docs > nul
if %ERRORLEVEL% EQU 0 (
    echo "✅ Backend en la nube está funcionando"
) else (
    echo "❌ Backend en la nube no responde"
)

echo ""
echo "🚀 Iniciando servidor de desarrollo..."
set VITE_API_BASE_URL=%BACKEND_URL%
npm run dev
