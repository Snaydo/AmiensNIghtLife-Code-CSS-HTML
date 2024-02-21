// Fonction pour afficher la photo de profil de l'utilisateur
function displayProfileImage(username) {
    // Vérifier si le nom d'utilisateur est valide
    if (!username) {
        console.error('Nom d\'utilisateur non valide.');
        return;
    }

    // Envoyer une requête AJAX au serveur pour récupérer l'URL de la photo de profil
    fetch(`./php/get-profile-image.php?username=${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.imageUrl) {
                // L'URL de la photo de profil a été récupérée avec succès
                const profileImage = document.getElementById('profile-image');
                profileImage.src = data.imageUrl.replace('../', './');
            } else {
                console.error('Impossible de récupérer la photo de profil.');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de la photo de profil :', error);
        });
}

// Appeler la fonction pour afficher la photo de profil lors du chargement de la page
window.addEventListener('load', function () {
    const loggedInUsername = getLoggedInUsername();
    if (loggedInUsername) {
        displayProfileImage(loggedInUsername);
    }
});
