// Fonction pour déconnecter l'utilisateur et supprimer les cookies
function logoutAndRemoveCookies() {
    // Supprimer le cookie loggedInUser
    document.cookie = 'loggedInUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    document.cookie = 'PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    setUserLoggedOut();

    // Rediriger vers la page de connexion ou toute autre page appropriée
    window.location.href = 'index.html'; // Changez 'login.html' en l'URL de votre page de connexion
}

// Sélectionnez le bouton de déconnexion par son ID
const logoutButton = document.getElementById('logout');

// Ajoutez un gestionnaire d'événements click au bouton
logoutButton.addEventListener('click', logoutAndRemoveCookies);
