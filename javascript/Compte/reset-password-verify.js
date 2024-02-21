document.addEventListener('DOMContentLoaded', function () {
    var resetForm = document.getElementById('resetForm');

    resetForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var emailInput = document.querySelector('#resetForm input[name="email"]');
        var email = emailInput.value;

        fetch('./php/reset-password-verify.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'email=' + encodeURIComponent(email),
        })
        .then(response => response.json())
        .then(data => {

            if (data.success) {
                afficherModalSucces('Succès', 'Un e-mail de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception.');
            } else {
                afficherModalDanger('Erreur', 'Une erreur s\'est produite lors de la réinitialisation du mot de passe.');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la requête:', error);
        });
    });
});
