# Guide de Test - Mot de Passe Oublié

## ✅ Problème Résolu

Le problème était que :
1. Le fichier `app.jsx` importait des composants inexistants (`ForgotPasswordPage`, `ResetPasswordPage`)
2. Le composant `LoginPage.jsx` avait un lien "Mot de passe oublié ?" non fonctionnel
3. Les composants `ForgotPassword` et `ResetPassword` étaient créés mais pas intégrés dans le système de routage

## 🔧 Corrections Apportées

### 1. Composants Créés
- ✅ `ForgotPasswordPage.jsx` - Page wrapper pour le composant ForgotPassword
- ✅ `ResetPasswordPage.jsx` - Page wrapper pour le composant ResetPassword

### 2. Modifications
- ✅ `LoginPage.jsx` - Lien "Mot de passe oublié ?" maintenant fonctionnel avec React Router
- ✅ `ForgotPassword.jsx` - Utilise maintenant `useNavigate()` au lieu de props
- ✅ Routes configurées dans `app.jsx` (déjà présentes)

## 🧪 Comment Tester

### 1. Démarrer les Serveurs
```bash
# Terminal 1 - Laravel Backend
php artisan serve
# → http://127.0.0.1:8000

# Terminal 2 - React Frontend  
npm run dev
# → http://localhost:5173 (ou port affiché)
```

### 2. Test du Flux Complet

#### Étape 1 : Page de Connexion
1. Allez sur `http://localhost:5173/login`
2. Vous devriez voir le formulaire de connexion
3. Cliquez sur "Mot de passe oublié ?" (en bas à droite)
4. ✅ **Résultat attendu** : Redirection vers `/forgot-password`

#### Étape 2 : Page Mot de Passe Oublié
1. Vous devriez voir le formulaire "Mot de passe oublié"
2. Entrez un email valide (ex: `admin@automarket.com`)
3. Cliquez sur "Envoyer le lien"
4. ✅ **Résultat attendu** : Message de succès "Email envoyé !"

#### Étape 3 : Test de l'Email (Développement)
1. Vérifiez les logs Laravel : `storage/logs/laravel.log`
2. Vous devriez voir l'email généré dans les logs
3. Copiez le lien de réinitialisation depuis les logs

#### Étape 4 : Page de Réinitialisation
1. Allez sur `http://localhost:5173/reset-password?token=VOTRE_TOKEN&email=VOTRE_EMAIL`
2. Entrez un nouveau mot de passe (min 8 caractères)
3. Confirmez le mot de passe
4. Cliquez sur "Réinitialiser le mot de passe"
5. ✅ **Résultat attendu** : Message de succès et redirection vers `/login`

### 3. Test des Boutons de Navigation
- ✅ Bouton "Retour" dans ForgotPassword → `/login`
- ✅ Bouton "Retour à la connexion" après succès → `/login`
- ✅ Bouton "Retour à la connexion" dans ResetPassword → `/login`

## 🐛 Dépannage

### Si le lien "Mot de passe oublié ?" ne fonctionne pas :
1. Vérifiez que les serveurs sont démarrés
2. Ouvrez la console du navigateur (F12) pour voir les erreurs
3. Vérifiez que les routes sont bien configurées dans `app.jsx`

### Si l'email n'est pas envoyé :
1. Vérifiez la configuration email dans `.env`
2. Pour le développement, utilisez `MAIL_MAILER=log`
3. Consultez `storage/logs/laravel.log`

### Si la réinitialisation ne fonctionne pas :
1. Vérifiez que le token dans l'URL est correct
2. Vérifiez que l'email correspond à celui utilisé
3. Vérifiez que le token n'a pas expiré (24h max)

## 📝 Configuration Email (Optionnel)

Pour tester avec un vrai email, ajoutez dans `.env` :
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-mot-de-passe-app
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=votre-email@gmail.com
MAIL_FROM_NAME="AutoMarket"
```

## ✅ Résultat Final

Le système de mot de passe oublié est maintenant **complètement fonctionnel** avec :
- ✅ Interface utilisateur moderne
- ✅ Navigation fluide entre les pages
- ✅ Validation côté client et serveur
- ✅ Sécurité avec tokens hashés et expiration
- ✅ Gestion d'erreurs complète
- ✅ Intégration parfaite avec React Router

