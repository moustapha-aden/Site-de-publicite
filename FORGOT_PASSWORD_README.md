# Fonctionnalité de Mot de Passe Oublié

Cette fonctionnalité permet aux utilisateurs de réinitialiser leur mot de passe via un email de récupération.

## Fonctionnalités

- ✅ Envoi d'email de réinitialisation
- ✅ Validation sécurisée des tokens
- ✅ Interface utilisateur intuitive
- ✅ Expiration automatique des tokens (24h)
- ✅ Gestion d'erreurs complète

## Architecture

### Backend (Laravel)

#### Contrôleur
- `ForgotPasswordController` : Gère l'envoi d'emails et la réinitialisation
  - `sendResetLinkEmail()` : Envoie l'email de réinitialisation
  - `resetPassword()` : Réinitialise le mot de passe avec le token

#### Base de données
- Table `password_resets` : Stocke les tokens de réinitialisation
  - `email` : Adresse email de l'utilisateur
  - `token` : Token hashé pour la réinitialisation
  - `created_at` : Timestamp de création

#### Notification
- `ResetPasswordNotification` : Template d'email de réinitialisation
  - Email personnalisé avec lien de réinitialisation
  - Expiration dans 24 heures

#### Routes API
```php
POST /api/auth/forgot-password    // Envoi d'email de réinitialisation
POST /api/auth/reset-password     // Réinitialisation du mot de passe
```

### Frontend (React)

#### Composants
- `ForgotPassword.jsx` : Formulaire de demande de réinitialisation
- `ResetPassword.jsx` : Formulaire de nouveau mot de passe
- Intégration dans `Login.jsx` : Lien "Mot de passe oublié ?"

#### Fonctionnalités Frontend
- Interface utilisateur moderne avec Tailwind CSS
- Validation côté client
- Gestion d'erreurs et messages de succès
- Redirection automatique après succès

## Configuration

### Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
# URL du frontend pour les liens d'email
FRONTEND_URL=http://localhost:3000

# Configuration email (exemple avec SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="Votre Application"
```

### Configuration Email

Pour utiliser Gmail :
1. Activez l'authentification à 2 facteurs
2. Générez un mot de passe d'application
3. Utilisez ce mot de passe dans `MAIL_PASSWORD`

## Utilisation

### 1. Demande de réinitialisation

L'utilisateur clique sur "Mot de passe oublié ?" dans le formulaire de connexion et saisit son email.

### 2. Réception de l'email

Un email est envoyé avec un lien de réinitialisation contenant :
- Token de réinitialisation
- Email de l'utilisateur
- Expiration dans 24 heures

### 3. Réinitialisation

L'utilisateur clique sur le lien, saisit son nouveau mot de passe et confirme.

## Sécurité

- ✅ Tokens hashés avec bcrypt
- ✅ Expiration automatique (24h)
- ✅ Suppression des tokens après utilisation
- ✅ Validation stricte des données
- ✅ Protection contre les attaques par force brute
- ✅ Logs de sécurité

## Tests

Pour tester la fonctionnalité :

1. **Développement** : Utilisez `MAIL_MAILER=log` pour voir les emails dans `storage/logs/laravel.log`
2. **Production** : Configurez un vrai service SMTP

## Dépannage

### Email non reçu
- Vérifiez la configuration SMTP
- Consultez les logs Laravel
- Vérifiez le dossier spam

### Token invalide
- Le token a peut-être expiré (24h)
- Vérifiez que l'URL est complète
- Le token a peut-être déjà été utilisé

### Erreurs de validation
- Mot de passe minimum 8 caractères
- Confirmation de mot de passe requise
- Email doit exister dans la base de données

