-- Script de création de la base de données pour le système de gestion de véhicules
-- Exécuter ce script dans MySQL pour créer la base de données

CREATE DATABASE IF NOT EXISTS vehicle_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Créer un utilisateur dédié (optionnel, pour la sécurité)
-- CREATE USER IF NOT EXISTS 'vehicle_user'@'localhost' IDENTIFIED BY 'secure_password';
-- GRANT ALL PRIVILEGES ON vehicle_management.* TO 'vehicle_user'@'localhost';
-- FLUSH PRIVILEGES;

USE vehicle_management;

-- Vérifier que la base de données a été créée
SELECT 'Base de données vehicle_management créée avec succès!' as message;
