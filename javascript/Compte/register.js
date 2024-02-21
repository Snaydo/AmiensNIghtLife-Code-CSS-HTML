document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    registrationForm.addEventListener('submit', handleRegistration);

    function handleRegistration(event) {
        event.preventDefault();

        const formData = new FormData(registrationForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Vérification du mot de passe
        const password = data['password'];

        // Assurez-vous que le mot de passe contient au moins une majuscule, un caractère spécial et a une longueur d'au moins 6 caractères
        if (!/[A-Z]/.test(password) || !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password) || password.length < 6) {
            afficherModalDanger("Erreur", "Le mot de passe contient au moins une majuscule, un caractère spécial et a une longueur d'au moins 6 caractères.");
            return;
        }

        fetch('./php/register.php', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                afficherModalSucces("Succès", "Inscription réussie !");
                registrationForm.reset();
            
                // Attendez que le modal soit entièrement masqué (fermé)
                $('#succesModal').on('hidden.bs.modal', function (e) {
                    // Redirigez vers la page de connexion après la fermeture du modal
                    window.location.href = 'sign-in.html';
                });            
            } else {
                afficherModalDanger("Erreur", "Inscription échouée. Veuillez réessayer. (Vérifier que votre e-mail / Username n'est pas déjà pris)");
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'inscription :', error);
            afficherModalDanger("Erreur", "Une erreur est survenue. Veuillez réessayer.");
        });
    }
});
