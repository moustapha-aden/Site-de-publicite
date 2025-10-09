# 🚗 Système de Gestion de Véhicules

Une application web moderne de gestion de véhicules construite avec Laravel 12 et React 19.

## ✨ Fonctionnalités

### 🔧 Backend (Laravel 12)
- **API RESTful** avec Sanctum pour l'authentification
- **Validation robuste** avec Form Requests personnalisées
- **Gestion d'erreurs** standardisée avec Handler personnalisé
- **Logging professionnel** avec canaux séparés
- **Rate Limiting** pour la sécurité
- **Tests complets** (unitaires et fonctionnels)
- **Scopes Eloquent** pour des requêtes optimisées
- **API Resources** pour des réponses standardisées

### 🎨 Frontend (React 19)
- **Interface moderne** avec TailwindCSS 4
- **Recherche et filtres avancés** pour les véhicules
- **Pagination** intelligente
- **Gestion d'état** optimisée
- **Validation côté client**
- **Design responsive**

### 🚀 Fonctionnalités Principales
- **Catalogue de véhicules** avec filtres avancés
- **Recherche textuelle** (marque, modèle, description)
- **Filtres par prix, année, carburant, transmission**
- **Véhicules en vedette** et neufs/occasions
- **Authentification sécurisée** avec tokens
- **Upload de photos** pour les véhicules
- **Dashboard administrateur**

## 🛠️ Technologies Utilisées

### Backend
- **Laravel 12** - Framework PHP moderne
- **PHP 8.2+** - Version récente de PHP
- **Laravel Sanctum** - Authentification API
- **SQLite/MySQL** - Base de données
- **PHPUnit** - Tests automatisés

### Frontend
- **React 19** - Bibliothèque UI moderne
- **Vite** - Build tool rapide
- **TailwindCSS 4** - Framework CSS utilitaire
- **Lucide React** - Icônes modernes
- **Axios** - Client HTTP

## 📦 Installation

### Prérequis
- PHP 8.2 ou supérieur
- Composer
- Node.js 18+ et npm
- SQLite ou MySQL

### 1. Cloner le projet
```bash
git clone <repository-url>
cd project-name
```

### 2. Installation des dépendances
```bash
# Backend
composer install

# Frontend
npm install
```

### 3. Configuration
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configuration de la base de données (SQLite par défaut)
touch database/database.sqlite
```

### 4. Migration et seeders
```bash
# Exécuter les migrations
php artisan migrate

# Générer des données de test
php artisan db:seed
```

### 5. Build des assets
```bash
# Build de production
npm run build

# Ou pour le développement
npm run dev
```

## 🚀 Démarrage

### Mode développement
```bash
# Lancer le serveur Laravel et Vite en parallèle
composer run dev
```

### Mode production
```bash
# Serveur Laravel uniquement
php artisan serve

# Ou avec un serveur web (Apache/Nginx)
```

## 📚 API Documentation

### Authentification
```bash
# Connexion
POST /api/auth/login
{
    "email": "test@example.com",
    "password": "password"
}

# Déconnexion
POST /api/auth/logout
Authorization: Bearer {token}

# Utilisateur connecté
GET /api/auth/me
Authorization: Bearer {token}
```

### Véhicules
```bash
# Liste des véhicules (avec filtres)
GET /api/vehicles?search=BMW&brand=BMW&price_min=10000&price_max=50000

# Détails d'un véhicule
GET /api/vehicles/{id}

# Créer un véhicule (authentifié)
POST /api/vehicles
Authorization: Bearer {token}

# Modifier un véhicule (authentifié)
PUT /api/vehicles/{id}
Authorization: Bearer {token}

# Supprimer un véhicule (authentifié)
DELETE /api/vehicles/{id}
Authorization: Bearer {token}

# Options de filtres
GET /api/vehicles/filter/options
```

### Filtres disponibles
- `search` - Recherche textuelle
- `brand` - Marque
- `fuel` - Type de carburant
- `transmission` - Type de transmission
- `is_featured` - Véhicules en vedette
- `is_new` - Véhicules neufs
- `price_min` / `price_max` - Fourchette de prix
- `year_min` / `year_max` - Fourchette d'années
- `sort_by` - Tri (price, year, mileage, brand, created_at)
- `sort_order` - Ordre (asc, desc)

## 🧪 Tests

### Exécuter tous les tests
```bash
php artisan test
```

### Tests spécifiques
```bash
# Tests de fonctionnalités
php artisan test --testsuite=Feature

# Tests unitaires
php artisan test --testsuite=Unit

# Tests avec couverture
php artisan test --coverage
```

## 🔒 Sécurité

- **Sanctum** pour l'authentification API
- **Rate Limiting** sur les routes sensibles
- **Validation stricte** des données
- **CORS** configuré pour les domaines autorisés
- **Logging** des tentatives de connexion
- **Headers de sécurité** configurés

## 📊 Logging

Les logs sont séparés par canal :
- `storage/logs/laravel.log` - Logs généraux
- `storage/logs/api.log` - Logs API spécifiques

## 🎯 Structure du Projet

```
app/
├── Http/
│   ├── Controllers/     # Contrôleurs API
│   ├── Middleware/      # Middlewares personnalisés
│   ├── Requests/        # Form Requests de validation
│   └── Resources/       # API Resources
├── Models/              # Modèles Eloquent
└── Exceptions/          # Gestion d'erreurs

resources/
├── js/
│   ├── components/      # Composants React
│   └── app.jsx         # Point d'entrée
└── css/
    └── app.css         # Styles TailwindCSS

tests/
├── Feature/            # Tests fonctionnels
└── Unit/              # Tests unitaires
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur GitHub ou contactez l'équipe de développement.

---

**Développé avec ❤️ en utilisant Laravel 12 et React 19**
