// Créer l'élément input une seule fois en dehors de la fonction click
const input = document.getElementById('avatar-picture');
input.type = 'file';
input.accept = 'image/*';

// Fonction pour gérer l'événement onchange
input.onchange = function () {
    const file = input.files[0];
    const formData = new FormData();
    formData.append('profile-image', file);

    // Récupérer l'ID de l'utilisateur connecté en utilisant son nom d'utilisateur
    const loggedInUsername = getLoggedInUsername();

    // Vérifier si l'utilisateur est connecté
    if (loggedInUsername) {
        getIdAndUsername(loggedInUsername)
            .then(userData => {
                // Ajouter l'ID et le nom d'utilisateur à la requête
                formData.append('user-id', userData.userId);
                formData.append('user-username', userData.username);

                fetch('./php/upload-profile-image.php', {
                    method: 'POST',
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        afficherModalSucces('Succès', 'Image de profil mise à jour avec succès.');
                        // Mettre à jour l'image de profil affichée
                        const profileImage = document.getElementById('profile-image');
                        // Utilisez le chemin renvoyé par le serveur (data.imageUrl)
                        profileImage.src = data.imageUrl.replace('../', './');
                    } else {
                        if (data.message !== undefined) {
                            afficherModalDanger('Erreur', data.message);
                        } else {
                            afficherModalDanger('Erreur', 'Une erreur s\'est produite. Veuillez réessayer plus tard.');
                        }
                    }
                })
                .catch(error => {
                    afficherModalDanger('Erreur', 'Une erreur s\'est produite. Veuillez réessayer plus tard.');
                });
            })
            .catch(error => {
                afficherModalDanger('Erreur', 'Une erreur s\'est produite. Veuillez réessayer plus tard.');
            });
    } else {
        afficherModalDanger('Erreur', 'Vous devez être connecté pour effectuer cette action.');
    }
};

// Fonction pour afficher la photo de profil de l'utilisateur
function displayProfileImage(username) {
    // Vérifier si le nom d'utilisateur est valide
    if (!username) {
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
