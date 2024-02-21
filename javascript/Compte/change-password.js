// Récupérez les éléments de champ de mot de passe par leur ID
const currentPasswordInput = document.getElementsByName('oldPassword')[0];
const newPasswordInput = document.getElementsByName('newPassword')[0];

// Récupérez le formulaire par son ID
const form = document.getElementById('password-change-form');

// Ajoutez un gestionnaire d'événements pour la soumission du formulaire
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Empêche la soumission du formulaire par défaut

    // Récupérez les valeurs saisies dans les champs de mot de passe
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;

    // Récupérez le nom d'utilisateur de l'utilisateur actuellement connecté
    const loggedInUsername = getLoggedInUsername();

    // Effectuez ici la validation du mot de passe actuel, du nouveau mot de passe et de la confirmation
    if (currentPassword === '' || newPassword === '') {
        afficherModalDanger('Erreur', 'Veuillez remplir tous les champs.');
    } else {
        // Créez un objet JSON pour envoyer les données du formulaire
        const jsonData = {
            username: loggedInUsername,
            current_password: currentPassword,
            new_password: newPassword
        };

        // Effectuez une requête fetch pour appeler le fichier PHP
        fetch('./php/change-password.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Indiquez que vous envoyez des données JSON
            },
            body: JSON.stringify(jsonData), // Convertissez l'objet JSON en une chaîne JSON
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                afficherModalSucces('Succès', 'Votre mot de passe a été changé avec succès !');
                // Vous pouvez rediriger ou effectuer d'autres actions après la mise à jour du mot de passe
            } else {
                afficherModalDanger('Erreur', data.message);
            }
        })
        .catch(error => {
            afficherModalDanger('Erreur', 'Une erreur s\'est produite. Veuillez réessayer plus tard.')
        });
    }
});