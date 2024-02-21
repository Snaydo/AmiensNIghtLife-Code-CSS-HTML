// Fonction pour vérifier si l'utilisateur est connecté
function checkUserLoggedIn() {
    // Vérifier si la session de l'utilisateur existe
    // Remarque : cette fonction suppose que vous avez démarré une session côté serveur (par exemple, dans login.php)
    // Si l'utilisateur est authentifié, une variable de session 'username' sera définie
    return sessionStorage.getItem('username') !== null;
}

// Fonction pour simuler la connexion de l'utilisateur
function setUserLoggedIn(username) {
    // Enregistrer le nom d'utilisateur dans la session pour simuler une connexion réussie
    sessionStorage.setItem('username', username);
}


// Fonction pour simuler la déconnexion de l'utilisateur
function setUserLoggedOut() {
    // Supprimer la variable de session 'username' pour simuler une déconnexion
    sessionStorage.removeItem('username');
}

// Fonction pour récupérer l'username de l'utilisateur connecté
function getLoggedInUsername() {
    // Vérifier si l'utilisateur est connecté en utilisant la fonction checkUserLoggedIn de users.js
    if (checkUserLoggedIn()) {
        // Récupérer le nom d'utilisateur à partir de la session
        return sessionStorage.getItem('username');
    } else {
        // Si l'utilisateur n'est pas connecté, renvoyer null ou une valeur par défaut
        return null;
    }
}

// Fonction pour obtenir l'ID de l'utilisateur
function getId(username) {
    // Vérifier si le nom d'utilisateur est valide
    if (!username) {
        console.error('Nom d\'utilisateur non valide.');
        return null;
    }

    // Envoyer une requête GET au serveur pour récupérer l'ID de l'utilisateur
    return fetch(`./php/get-user-id.php?username=${username}`)
        .then(response => response.json())
        .then(data => {
            // Vérifier si la requête a réussi et si l'ID est présent dans les données
            if (data.success && data.id) {
                return data.id;
            } else {
                console.error('Erreur lors de la récupération de l\'ID de l\'utilisateur.');
                return null;
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de l\'ID de l\'utilisateur :', error);
            return null;
        });
}

// Fonction pour obtenir l'ID et le nom d'utilisateur de l'utilisateur
function getIdAndUsername(username) {
    // Vérifier si le nom d'utilisateur est valide
    if (!username) {
        console.error('Nom d\'utilisateur non valide.');
        return null;
    }

    // Envoyer une requête GET au serveur pour récupérer l'ID de l'utilisateur
    return fetch(`./php/get-user-id.php?username=${username}`)
        .then(response => response.json())
        .then(data => {
            // Vérifier si la requête a réussi et si l'ID est présent dans les données
            if (data.success && data.id) {
                // Retourner un objet avec l'ID et le nom d'utilisateur
                return { userId: data.id, username: username };
            } else {
                console.error('Erreur lors de la récupération de l\'ID de l\'utilisateur.');
                return null;
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de l\'ID de l\'utilisateur :', error);
            return null;
        });
}

function getUserEmail(userId) {
    // Vérifiez si l'ID de l'utilisateur est valide
    if (!userId) {
        console.error('ID de l\'utilisateur non valide.');
        return null;
    }

    // Envoyez une requête GET au serveur pour récupérer l'adresse e-mail de l'utilisateur
    return fetch(`./php/get-user-email.php?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            // Vérifiez si la requête a réussi et si l'adresse e-mail est présente dans les données
            if (data.success && data.email) {
                return data.email;
            } else {
                console.error('Erreur lors de la récupération de l\'adresse e-mail de l\'utilisateur.');
                return null;
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de l\'adresse e-mail de l\'utilisateur :', error);
            return null;
        });
}

// Fonction pour récupérer la valeur d'un cookie par son nom
function getCookie(cookieName) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

// Fonction pour déconnecter l'utilisateur et supprimer les cookies
function logoutAndRemoveCookies() {
    // Supprimer le cookie loggedInUser
    document.cookie = 'loggedInUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    document.cookie = 'PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    setUserLoggedOut();

    // Rediriger vers la page de connexion ou toute autre page appropriée
    window.location.href = 'index.html'; // Changez 'login.html' en l'URL de votre page de connexion
}