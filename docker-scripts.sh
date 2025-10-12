#!/bin/bash

# Scripts Docker pour Payload CMS

case "$1" in
  "build")
    echo "🔨 Construction de l'image Docker..."
    docker-compose build
    ;;
  "up")
    echo "🚀 Démarrage de Payload CMS sur le port 3300..."
    docker-compose up -d
    ;;
  "down")
    echo "🛑 Arrêt de Payload CMS..."
    docker-compose down
    ;;
  "logs")
    echo "📋 Affichage des logs..."
    docker-compose logs -f payload-cms
    ;;
  "restart")
    echo "🔄 Redémarrage de Payload CMS..."
    docker-compose restart payload-cms
    ;;
  "shell")
    echo "🐚 Accès au shell du conteneur..."
    docker-compose exec payload-cms sh
    ;;
  "clean")
    echo "🧹 Nettoyage des conteneurs et images..."
    docker-compose down -v
    docker system prune -f
    ;;
  *)
    echo "Usage: $0 {build|up|down|logs|restart|shell|clean}"
    echo ""
    echo "Commandes disponibles:"
    echo "  build   - Construire l'image Docker"
    echo "  up      - Démarrer Payload CMS sur le port 3300"
    echo "  down    - Arrêter Payload CMS"
    echo "  logs    - Afficher les logs en temps réel"
    echo "  restart - Redémarrer Payload CMS"
    echo "  shell   - Accéder au shell du conteneur"
    echo "  clean   - Nettoyer les conteneurs et images"
    echo ""
    echo "Exemples:"
    echo "  ./docker-scripts.sh build"
    echo "  ./docker-scripts.sh up"
    echo "  ./docker-scripts.sh logs"
    exit 1
    ;;
esac
