// Fonction pour mettre à jour l'icône en fonction de la connexion de l'utilisateu
function updateIcon() {
    var iconElement = document.getElementById('login-toolbar');
    var isLoggedIn = checkUserLoggedIn();
  
    if (isLoggedIn) {
      // Utilisateur connecté : changer l'icône en conséquence
      iconElement.className = 'icon ion-ios-person';
    } else {
      // Utilisateur non connecté : mettre l'icône de connexion par défaut
      iconElement.className = 'icon ion-ios-log-in';
    }
  }
  
  // Appeler la fonction pour mettre à jour l'icône lorsque la page est chargée
  document.addEventListener('DOMContentLoaded', function () {
    updateIcon();
  });