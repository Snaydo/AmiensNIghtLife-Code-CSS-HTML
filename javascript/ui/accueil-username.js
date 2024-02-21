document.addEventListener('DOMContentLoaded', async function() {
    const loggedIn = checkUserLoggedIn();
    const lien = document.getElementById('profile-link'); // Sélectionnez le lien par la classe

    // Vérifier si l'utilisateur est connecté en vérifiant la présence du cookie
    if (loggedIn) {
        const loggedInUsername = getLoggedInUsername();
        const userId = await getId(loggedInUsername);

        // Récupérer l'ID de l'utilisateur connecté
        getId(loggedInUsername)
            .then(userId => {
                if (userId) {
                    // Utiliser userId pour obtenir l'adresse e-mail de l'utilisateur
                    getUserEmail(userId)
                        .then(email => {
                            if (email) {
                                // Mettre à jour la valeur de l'attribut href du lien
                                lien.setAttribute('href', 'mon-profile.html');
                                // Mettre à jour l'élément HTML avec le nom d'utilisateur
                                const usernameElement = document.getElementById('username');
                                usernameElement.textContent = loggedInUsername; // Utilisez .textContent pour un élément de texte
                            } else {
                                console.error("Impossible de récupérer l'adresse e-mail de l'utilisateur.");
                            }
                        })
                        .catch(error => {
                            console.error("Erreur lors de la récupération de l'adresse e-mail de l'utilisateur :", error);
                        });
                } else {
                    console.error("ID de l'utilisateur non valide.");
                }
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de l'ID de l'utilisateur : " + error);
            });
    } else {
        const usernameElement = document.getElementById('username');
        usernameElement.textContent = 'Utilisateur';

        // Mettre à jour la valeur de l'attribut href du lien pour la redirection vers "sign-in"
        lien.setAttribute('href', 'sign-in.html');
    }
});
