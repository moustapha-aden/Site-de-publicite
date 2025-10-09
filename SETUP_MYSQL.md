# 🗄️ Configuration MySQL pour le Système de Gestion de Véhicules

## Option 1: XAMPP (Recommandé pour le développement)

### 1. Installation de XAMPP
1. Téléchargez XAMPP depuis https://www.apachefriends.org/
2. Installez XAMPP avec Apache et MySQL
3. Démarrez XAMPP Control Panel
4. Activez Apache et MySQL

### 2. Création de la base de données
1. Ouvrez http://localhost/phpmyadmin dans votre navigateur
2. Créez une nouvelle base de données nommée `vehicle_management`
3. Définissez le charset à `utf8mb4_unicode_ci`

### 3. Configuration du fichier .env
Modifiez votre fichier `.env` avec ces paramètres :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vehicle_management
DB_USERNAME=root
DB_PASSWORD=
```

## Option 2: MySQL Server autonome

### 1. Installation de MySQL
1. Téléchargez MySQL Community Server depuis https://dev.mysql.com/downloads/mysql/
2. Installez MySQL avec un mot de passe root
3. Ajoutez MySQL au PATH système

### 2. Création de la base de données
```bash
mysql -u root -p
```
Puis exécutez le script `database/setup_mysql.sql`

## Option 3: Docker (Pour les développeurs avancés)

### 1. Création d'un docker-compose.yml
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: vehicle_mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: vehicle_management
      MYSQL_USER: vehicle_user
      MYSQL_PASSWORD: secure_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/setup_mysql.sql:/docker-entrypoint-initdb.d/setup_mysql.sql

volumes:
  mysql_data:
```

### 2. Démarrage avec Docker
```bash
docker-compose up -d
```

## Commandes Laravel après configuration MySQL

Une fois MySQL configuré, exécutez ces commandes :

```bash
# Arrêter le serveur actuel (Ctrl+C)
# Puis relancer les migrations
php artisan migrate:fresh --seed

# Démarrer le serveur de développement
php artisan serve

# Tester l'API
# Ouvrez http://127.0.0.1:8000/api/vehicles dans votre navigateur
```

## Vérification

1. **Test de connexion** : `php artisan migrate:status`
2. **Test API** : Visitez `http://127.0.0.1:8000/api/vehicles`
3. **Interface admin** : `http://127.0.0.1:8000/phpmyadmin` (si XAMPP)

## Dépannage

### Erreur "Connection refused"
- Vérifiez que MySQL est démarré
- Vérifiez le port 3306
- Vérifiez les credentials dans .env

### Erreur "Access denied"
- Vérifiez le nom d'utilisateur et mot de passe
- Créez l'utilisateur MySQL si nécessaire

### Erreur "Database doesn't exist"
- Créez la base de données `vehicle_management`
- Vérifiez le nom dans .env
