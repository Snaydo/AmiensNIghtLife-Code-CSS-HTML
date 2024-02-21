document.addEventListener('DOMContentLoaded', function () {
    // Sélectionner le formulaire de la newsletter
    var newsletterForm = document.getElementById('newsletterForm');

    // Fonction pour gérer l'envoi du formulaire
    function handleFormSubmission() {
        // Récupérer la valeur de l'e-mail depuis le champ du formulaire
        var emailInput = document.querySelector('#newsletterForm input[name="email"]');
        var email = emailInput.value;

        // Valider l'e-mail (vous pouvez ajouter une validation plus robuste ici)

        // Vérifier si le champ email est vide
        if (!email.trim()) {
            afficherModalDanger('Erreur de saisie', 'Veuillez saisir votre adresse e-mail.');
            return; // Ne pas soumettre le formulaire si le champ email est vide
        }

        // Envoyer une requête POST à register-nl.php via Fetch
        fetch('./php/register-nl.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'email=' + encodeURIComponent(email),
        })
        .then(response => response.json())  // Attendre une réponse JSON
        .then(data => {

            // Vérifier la valeur renvoyée par le serveur
            if (data.success) {
                // Afficher un message de réussite à l'utilisateur
                afficherModalSucces('Inscription réussie', data.message);
            } else {
                // Afficher un message d'erreur à l'utilisateur
                afficherModalDanger('Erreur lors de l\'inscription', data.message);
            }
        })
        .catch(error => {
            // En cas d'erreur lors de la requête
            console.error('Erreur lors de la requête:', error);

            // Afficher un message d'erreur dans le modal
            afficherModalDanger('Erreur de connexion', 'Une erreur s\'est produite lors de la requête.');
        });
    }

    // Ajouter un écouteur d'événement pour le formulaire
    newsletterForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Empêcher la soumission du formulaire par défaut
        handleFormSubmission();
    });

    // Désactiver le comportement du lien au clic
    var link = document.querySelector('#newsletterForm a');
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Empêcher le comportement par défaut du lien
        handleFormSubmission(); // Appeler la fonction d'envoi du formulaire
    });
});
