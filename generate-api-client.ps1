# Script PowerShell pour régénérer le client TypeScript depuis l'API FastAPI

Write-Host "🔄 Régénération du client TypeScript depuis l'API FastAPI..." -ForegroundColor Cyan

# Vérifier si l'API est en cours d'exécution
Write-Host "📡 Vérification de l'API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -ne 200) {
        throw "API non disponible"
    }
} catch {
    Write-Host "❌ L'API n'est pas en cours d'exécution sur http://localhost:8000" -ForegroundColor Red
    Write-Host "   Veuillez d'abord démarrer l'API avec: python start_api.py" -ForegroundColor Yellow
    exit 1
}

# Télécharger le schéma OpenAPI
Write-Host "📥 Téléchargement du schéma OpenAPI..." -ForegroundColor Yellow
python -c "import urllib.request; urllib.request.urlretrieve('http://localhost:8000/openapi.json', 'openapi.json')"

# Générer le client TypeScript
Write-Host "🔨 Génération du client TypeScript..." -ForegroundColor Yellow
npx openapi-typescript-codegen -i openapi.json -o src/lib/api-generated

Write-Host "✅ Client TypeScript régénéré avec succès!" -ForegroundColor Green
Write-Host "📁 Fichiers générés dans src/lib/api-generated/" -ForegroundColor Cyan
