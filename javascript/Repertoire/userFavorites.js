// favorites.js

document.addEventListener('DOMContentLoaded', async function() {
    const loggedIn = checkUserLoggedIn();
    
    if (loggedIn) {
        const loggedInUsername = getLoggedInUsername();
        const userId = await getId(loggedInUsername);

        // Charger les favoris de l'utilisateur et mettre à jour l'apparence des icônes de cœur
        loadUserFavorites(userId);
    }
});

// Fonction pour afficher le modal de connexion
function afficheModalLogin() {
    // Assurez-vous d'avoir le code pour afficher votre modal
    const loginModal = document.getElementById('loginModal');
    $(loginModal).modal('show'); // Utilisation de jQuery pour afficher le modal
}

document.addEventListener('click', async function(event) {
    const loggedIn = checkUserLoggedIn();
    const loggedInUsername = getLoggedInUsername();
    const target = event.target;

    // Vérifiez si l'élément cliqué est un cœur (icon ion-ios-heart)
    if (target.classList.contains('ion-ios-heart')) {
        if (loggedIn) {
            // Utilisez "await" pour attendre la résolution de la Promise
            const userId = await getId(loggedInUsername);
            const barId = target.closest('.card').querySelector('.card-title').dataset.barId;
            
            // Appel de la fonction pour ajouter ou retirer la classe "active"
            handleFavoriteClick(target, userId, barId);
        } else {
            // L'utilisateur n'est pas connecté, vous pouvez afficher un message ou rediriger vers la page de connexion.
            afficheModalLogin();
        }
    }
});

// Fonction pour charger les favoris de l'utilisateur
async function loadUserFavorites(userId) {
    try {
        // Utilisez la fonction fetch pour envoyer une requête GET au fichier PHP
        const response = await fetch(`./php/get-favorite.php?userId=${userId}`);
        const data = await response.json();

        // Mettre à jour l'apparence des icônes de cœur en fonction des favoris de l'utilisateur
        updateHeartIcons(data);
    } catch (error) {
        // Gérez les erreurs (facultatif)
        console.error('Erreur lors du chargement des favoris :', error);
    }
}

// Fonction pour mettre à jour l'apparence des icônes de cœur
function updateHeartIcons(favoriteBars) {
    // Sélectionnez tous les cœurs sur la page
    const heartIcons = document.querySelectorAll('.ion-ios-heart');

    // Parcourez les cœurs et mettez à jour l'apparence en fonction des favoris de l'utilisateur
    heartIcons.forEach(heartIcon => {
        // Récupérez l'ID du bar depuis l'attribut data-bar-id
        const barId = parseInt(heartIcon.closest('.card').querySelector('h5').dataset.barId);

        if (favoriteBars.includes(barId)) {
            // Si le bar est dans les favoris, ajoutez la classe 'active'
            heartIcon.classList.add('active');
        } else {
            // Sinon, retirez la classe 'active'
            heartIcon.classList.remove('active');
        }
    });
}




// Fonction pour ajouter ou retirer la classe "active" sur l'icône du cœur
function handleFavoriteClick(heartIcon, userId, barId) {
    // Ajoutez ou supprimez la classe 'active' pour changer l'apparence du cœur
    heartIcon.classList.toggle('active');

    // Envoi de l'ID utilisateur et de l'ID du bar au fichier PHP
    sendFavoriteToServer(userId, barId);
}

// Fonction pour envoyer l'ID utilisateur et l'ID du bar au fichier PHP
function sendFavoriteToServer(userId, barId) {
    // Utilisez la fonction fetch pour envoyer une requête POST au fichier PHP
    fetch('./php/setFavorite.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `userId=${userId}&barId=${barId}`,
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Erreur lors de la gestion du favori :', data.error);
        } else {

        }
    })
    .catch(error => {
        // Gérez les erreurs (facultatif)
        console.error('Erreur lors de l\'envoi de la requête :', error);
    });
}
