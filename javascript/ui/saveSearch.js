// script.js

// Ajoutez un écouteur d'événements sur le focus du champ de recherche
document.getElementById('searchInput').addEventListener('focus', function () {
    // Ajoutez un événement de saisie pour déclencher saveSearchOnInput lorsque l'utilisateur tape quelque chose
    this.addEventListener('input', saveSearchOnInput);
});

let isSearchStarted = false; // Variable pour suivre si la recherche a commencé

function getUserId() {
    const loggedIn = checkUserLoggedIn();
    const loggedInUsername = getLoggedInUsername();
    const userId = getId(loggedInUsername);

    return userId;
}

function saveSearch(event) {
    event.preventDefault(); // Empêche l'envoi du formulaire par défaut

    // Récupérez le terme de recherche et l'ID de l'utilisateur
    const search_term = document.getElementById('searchInput').value;

    // Utilisez then pour traiter le résultat de la promesse
    getUserId().then(user_id => {
        // Vérifiez si le terme de recherche est non vide et si la recherche a commencé
        if (search_term.trim() !== '' && isSearchStarted) {
            // Utilisez AJAX pour envoyer les données au serveur
            const xhr = new XMLHttpRequest();
            const url = './php/save_recherche.php'; // Remplacez par le chemin de votre fichier côté serveur
            const params = `user_id=${user_id}&search_term=${encodeURIComponent(search_term)}`;

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Réponse du serveur (vous pouvez gérer la réponse ici si nécessaire)
                    // console.log('Réponse du serveur:', xhr.responseText);
                }
            };

            xhr.send(params);

            // Réinitialisez la variable pour indiquer que la recherche a été enregistrée
            isSearchStarted = false;
        } else {
            // Gérez le cas où le terme de recherche est vide ou si la recherche n'a pas commencé
            // console.log('Veuillez entrer un terme de recherche et la recherche doit avoir commencé.');
        }
    });
}

function saveSearchOnInput() {
    // Réinitialisez la variable pour indiquer que la recherche a commencé
    isSearchStarted = true;

    // Appeler saveSearch pour enregistrer la recherche après la première saisie
    saveSearch(new Event('fake'));
}
