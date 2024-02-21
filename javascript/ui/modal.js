
function afficherModalDanger(titre, message) {
    // Assurez-vous d'avoir le code pour afficher votre modal
    const dangerModal = document.getElementById('dangerModal');

    // Personnalisez le titre et le texte du modal en fonction des paramètres
    const titreElement = dangerModal.querySelector('.modal-icon-title h5');
    const textSmallElement = dangerModal.querySelector('.modal-icon-title p');

    if (titreElement && textSmallElement) {
        titreElement.textContent = titre || 'Erreur rencontrée'; // Utilisez une valeur par défaut si aucun titre n'est fourni
        textSmallElement.textContent = message || 'Message par défaut'; // Utilisez une valeur par défaut si aucun message n'est fourni
    }

    // Utilisation de jQuery pour afficher le modal
    $(dangerModal).modal('show');
}

function afficherModalSucces(titre, message) {
    // Assurez-vous d'avoir le code pour afficher votre modal
    const succesModal = document.getElementById('succesModal');

    // Personnalisez le titre et le texte du modal en fonction des paramètres
    const titreElement = succesModal.querySelector('.modal-icon-title h5');
    const textSmallElement = succesModal.querySelector('.modal-icon-title p');

    if (titreElement && textSmallElement) {
        titreElement.textContent = titre || 'Succès'; // Utilisez une valeur par défaut si aucun titre n'est fourni
        textSmallElement.textContent = message || 'Message par défaut'; // Utilisez une valeur par défaut si aucun message n'est fourni
    }

    // Utilisation de jQuery pour afficher le modal
    $(succesModal).modal('show');
}
