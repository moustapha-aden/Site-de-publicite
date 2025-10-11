import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import { Mail, Lock, CheckCircle, AlertCircle, Info, ArrowRight, ArrowLeft, Car, Wrench, Users, LayoutDashboard, LogOut } from 'lucide-react';

// --- Configuration et Utilitaires ---

// Composant réutilisable pour afficher les messages de statut/erreur
const MessageAlert = ({ type, message }) => {
  if (!message) return null;

  const baseClasses = "mb-6 p-4 rounded-xl flex items-start animate-fade-in";
  let colorClasses = "";
  let IconComponent = Info;

  if (type === 'success') {
    colorClasses = "bg-emerald-50 border border-emerald-200 text-emerald-700";
    IconComponent = CheckCircle;
  } else if (type === 'error') {
    // Gère les messages simples ou les tableaux d'erreurs de validation simulés
    colorClasses = "bg-red-50 border border-red-200 text-red-700";
    IconComponent = AlertCircle;
  }

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      <IconComponent className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium">
          {Array.isArray(message) ? "Oups! Quelque chose s'est mal passé." : message}
        </p>

        {Array.isArray(message) && (
          <ul className="mt-2 text-xs list-disc list-inside text-red-600">
            {message.map((err, index) => <li key={index}>{err}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
};

// --- Composant LoginForm (Anciennement App) ---

const LoginForm = ({ handleSuccessfulLogin,}) => {
  const [email, setEmail] = useState('admin@automarket.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // Pour les messages de session réussis
  const [errorMessage, setErrorMessage] = useState(null); // Pour les erreurs (y compris les erreurs de validation simulées)
  const [isReady, setIsReady] = useState(false);

  // Animation 'fade-in'
  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    if (!email || !password) {
      setErrorMessage(["L'adresse email et le mot de passe sont requis."]);
      setIsSubmitting(false);
      return;
    }

    try {
      // Appel réel vers le backend Laravel
      // IMPORTANT: utiliser le nouvel endpoint unifié
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login", {
        email,
        password,
      });

      const data = response.data?.data || {};

      setStatusMessage(`Connexion réussie ! Bienvenue ${data.user.name}. Redirection en cours...`);
      console.log(`Token reçu (aperçu): ${(data.token || '').slice(0, 12)}...`);

      // Mise à jour de l'état global et configuration d'Axios via la prop
      setTimeout(() => {
        handleSuccessfulLogin(data);
      }, 1500);

    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Une erreur inattendue est survenue lors de la connexion.";
      setErrorMessage(errorMsg);
      console.error("Erreur de connexion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div
        className={`w-full max-w-md transition-all duration-500 ease-out ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <div className="text-center mb-8">
          <div className="inline-block">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-3">
              AutoMarket
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full mx-auto"></div>
          </div>
          <p className="text-xl font-semibold text-slate-700 mt-6">Accès Administration</p>
          <p className="text-sm text-slate-500 mt-2">Connectez-vous pour gérer votre inventaire</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600"></div>

          <div className="p-8 sm:p-10">

            <MessageAlert type="success" message={statusMessage} />
            <MessageAlert type="error" message={errorMessage} />

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Adresse Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="block w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-slate-50 focus:bg-white"
                    placeholder="admin@automarket.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="block w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-slate-50 focus:bg-white"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-8">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 transition duration-200"
                    disabled={isSubmitting}
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-slate-600 group-hover:text-slate-900 transition duration-200">
                    Se souvenir de moi
                  </span>
                </label>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition duration-200">
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Bouton de Connexion */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                disabled={isSubmitting}
              >
                <span className="flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </span>
              </button>

            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-medium">Informations</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-xs text-slate-600 text-center flex items-center justify-center">
                <Info className="w-4 h-4 mr-1 text-slate-500 flex-shrink-0" />
                Accès réservé aux administrateurs autorisés (Utilisateurs de type **admin**).
                <span className='ml-1 font-bold'>Email/Pass: admin@automarket.com / password</span>.
              </p>
            </div>

          </div>
        </div>

        <div className="text-center mt-8">
          <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition duration-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la page des véhicules
          </a>
        </div>

        <div className="text-center mt-8 text-xs text-slate-500">
          <p>© 2024 AutoMarket. Tous droits réservés.</p>
        </div>

      </div>
    </div>
  );
};

// --- Composant StatCard (du Dashboard) ---

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    {/* Correction: Utiliser le style Tailwind correct pour les couleurs dynamiques */}
    <div className={`p-3 inline-flex items-center justify-center rounded-full ${color === 'indigo' ? 'bg-indigo-100 text-indigo-600' : color === 'amber' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'} mb-4`}>
      <Icon className="w-6 h-6" />
    </div>
    <p className="text-sm font-medium text-slate-500">{title}</p>
    <p className="text-3xl font-extrabold text-slate-900 mt-1">{value.toLocaleString('fr-FR')}</p>
  </div>
);

// --- Composant Dashboard ---

const Dashboard = ({ userData, handleLogout }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // userData contient maintenant { user: {...}, token: '...' }
  const userName = userData.user.name || "Administrateur";
  const userToken = userData.token;

  useEffect(() => {
    // Le header d'autorisation est déjà configuré globalement par la fonction handleSuccessfulLogin
    // dans le composant App, via axios.defaults.headers.common['Authorization']

    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Tentative de récupération du tableau de bord avec le token:", userToken.substring(0, 10) + '...');

        // Vrai appel vers le backend (protégé par Sanctum)
        // Axios utilisera le header d'autorisation global défini
        const response = await axios.get("http://127.0.0.1:8000/api/admin/dashboard");

        setDashboardData({
          user: userData.user,
          stats: response.data.stats,
          message: response.data.message
        });

      } catch (err) {
        console.error("Erreur lors de la récupération du tableau de bord:", err);
        // Si l'erreur est 401 (Unauthorized), forcer la déconnexion
        if (err.response && err.response.status === 401) {
          setError("Session expirée ou non autorisée. Déconnexion automatique.");
          // Forcer la déconnexion après un court délai pour que l'utilisateur voie le message
          setTimeout(handleLogout, 2000);
        } else {
          setError("Impossible de charger les données du tableau de bord. Vérifiez le serveur backend.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [userName, userToken, handleLogout]); // Dépend de handleLogout, et des données utilisateur pour se rafraîchir

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center p-10 bg-white rounded-xl shadow-lg">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-medium text-slate-700">Chargement du Tableau de Bord...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Barre de navigation */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <LayoutDashboard className="w-6 h-6 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-slate-900">Tableau de Bord Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-700 hidden sm:inline">Bienvenue, <span className="font-semibold text-indigo-600">{userName}</span></span>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 transition duration-200 shadow-md"
            >
              <LogOut className="w-4 h-4 mr-2" /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">

          {error && <MessageAlert type="error" message={error} />}

          {/* Message de bienvenue */}
          <div className="mb-8 p-6 bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm">
            <p className="text-lg font-semibold text-indigo-800">{dashboardData?.message}</p>
          </div>

          {/* Grille de Statistiques */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={Car}
              title="Total Véhicules"
              value={stats.total_vehicules || 0}
              color="indigo"
            />
            <StatCard
              icon={Wrench}
              title="Réparations en Cours"
              value={stats.reparations_en_cours || 0}
              color="amber"
            />
            <StatCard
              icon={Users}
              title="Nouveaux Clients (Mois)"
              value={stats.nouveaux_clients || 0}
              color="emerald"
            />
          </div>

          {/* Section rapide d'actions (Placeholder) */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Actions Rapides</h2>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <p className="text-slate-600">Prochaines étapes : Ajouter ici la gestion des véhicules et des utilisateurs.</p>
              <div className="mt-4 flex space-x-4">
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">Ajouter un Véhicule</button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Voir les Réparations</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};


// --- Composant Principal de l'Application (Gestionnaire d'état) ---

export default function App() {
  // Stocke les données de l'utilisateur et le token : { user: {...}, token: '...' }
  const [currentUserData, setCurrentUserData] = useState(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  // Fonction pour déconnecter l'utilisateur
  const handleLogout = useCallback(() => {
    // 1. Suppression du header Axios
    delete axios.defaults.headers.common['Authorization'];
    // 2. Nettoyage du localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // 3. Réinitialisation de l'état
    setCurrentUserData(null);
    console.log("Déconnexion effectuée. État réinitialisé.");
  }, []);

  // Fonction appelée par le formulaire de connexion en cas de succès
  const handleSuccessfulLogin = useCallback((data) => {
    const { token, user } = data;

    // 1. Sauvegarde dans le localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // 2. Configuration du header Axios pour toutes les requêtes subséquentes
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 3. Mise à jour de l'état de l'application
    setCurrentUserData({ token, user });
    console.log("Connexion réussie et état mis à jour.");
  }, []);


  // Effet pour vérifier le localStorage au chargement et restaurer la session
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const userData = { token, user };

        // Configurer Axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setCurrentUserData(userData);
        console.log("Session restaurée avec le token.");
      } catch (e) {
        console.error("Erreur lors de la lecture de la session. Déconnexion forcée:", e);
        handleLogout();
      }
    }
    setIsCheckingToken(false);
  }, [handleLogout]);


  // Rendu conditionnel
  if (isCheckingToken) {
    // Écran de chargement initial pendant la vérification du token
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center p-10 bg-white rounded-xl shadow-lg">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-medium text-slate-700">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur a des données de session, afficher le tableau de bord
  if (currentUserData) {
    return <Dashboard userData={currentUserData} handleLogout={handleLogout} />;
  }

  // Sinon, afficher l'écran de connexion
  return <LoginForm handleSuccessfulLogin={handleSuccessfulLogin} />;
}
