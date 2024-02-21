document.addEventListener('DOMContentLoaded', () => {
    // Récupérer le nom d'utilisateur
    const LoggedIn = checkUserLoggedIn();
    const loggedInUsername = getLoggedInUsername();

    // Vérifier si l'utilisateur est connecté en vérifiant la présence du cookie
    if (LoggedIn) {
        // Récupérer l'ID de l'utilisateur connecté
        getId(loggedInUsername)
            .then(userId => {
                if (userId) {
                    // Utiliser userId pour obtenir l'adresse e-mail de l'utilisateur
                    getUserEmail(userId)
                        .then(email => {
                            if (email) {
                                // Mettre à jour la valeur de l'élément HTML avec l'adresse e-mail
                                const emailElement = document.getElementsByName('email')[0];
                                emailElement.value = email; // Utilisez .value pour un champ de saisie
                                emailElement.disabled = true; // Désactiver le champ de saisie

                                // Mettre à jour la valeur de l'élément HTML avec le nom d'utilisateur
                                const usernameElement = document.getElementsByName('username')[0];
                                usernameElement.value = loggedInUsername; // Utilisez .textContent pour un élément de texte
                                usernameElement.disabled = true;
                            } else {
                                console.error('Impossible de récupérer l\'adresse e-mail de l\'utilisateur.');
                            }
                        })
                        .catch(error => {
                            console.error('Erreur lors de la récupération de l\'adresse e-mail de l\'utilisateur :', error);
                        });
                } else {
                    console.error('ID de l\'utilisateur non valide.');
                }
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de l'ID de l'utilisateur : " + error);
                showAlert("Une erreur est survenue. Veuillez réessayer.");
            });
    } else {
        // L'utilisateur n'est pas connecté, vous pouvez rediriger vers la page de connexion
        window.location.href = 'sign-in.html';
    }
});
