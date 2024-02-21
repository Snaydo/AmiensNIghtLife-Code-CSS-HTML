document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginForm');
    const loginButton = document.querySelector('#loginButton');

    loginForm.addEventListener('submit', handleLogin);

    function handleLogin(event) {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('./php/login.php', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Enregistrez l'utilisateur comme connecté dans un cookie
                setLoggedInCookie(result.username, 15); // Cookie expirant dans 15 jours
                // Appelez setUserLoggedIn pour marquer l'utilisateur comme connecté dans votre application
                setUserLoggedIn(result.username);
                // Affichez la modal
                $('#succesModal').modal('show');
                
                // Attendez que le modal soit entièrement masqué (fermé)
                $('#succesModal').on('hidden.bs.modal', function (e) {
                    // Redirigez vers la page principale après la fermeture du modal
                    window.location.reload();
                });
            } else {
                afficherModalDanger('Échec de la connexion', result.message);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la connexion :', error);
        });
    }

    // Fonction pour définir un cookie pour indiquer que l'utilisateur est connecté
    function setLoggedInCookie(username, expirationDays) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expirationDays);
        document.cookie = `loggedInUser=${username}; expires=${expirationDate.toUTCString()}; path=/`;
    }
});
