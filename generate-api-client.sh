#!/bin/bash
# Script pour régénérer le client TypeScript depuis l'API FastAPI

echo "🔄 Régénération du client TypeScript depuis l'API FastAPI..."

# Vérifier si l'API est en cours d'exécution
echo "📡 Vérification de l'API..."
if ! curl -s http://localhost:8000/health > /dev/null; then
    echo "❌ L'API n'est pas en cours d'exécution sur http://localhost:8000"
    echo "   Veuillez d'abord démarrer l'API avec: python start_api.py"
    exit 1
fi

# Télécharger le schéma OpenAPI
echo "📥 Téléchargement du schéma OpenAPI..."
python -c "import urllib.request; urllib.request.urlretrieve('http://localhost:8000/openapi.json', 'openapi.json')"

# Générer le client TypeScript
echo "🔨 Génération du client TypeScript..."
npx openapi-typescript-codegen -i openapi.json -o src/lib/api-generated

echo "✅ Client TypeScript régénéré avec succès!"
echo "📁 Fichiers générés dans src/lib/api-generated/"
