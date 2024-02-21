document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.querySelector('.chat-form input[type="text"]');

    // Limite de caractères pour le message
    const maxCharacters = 200;

    // Fonction pour mettre à jour le compteur de caractères restants
    function updateCharacterCount() {
        const remainingCharacters = maxCharacters - messageInput.value.length;
    }

    // Ajouter un événement "beforeinput" à l'input pour vérifier avant l'insertion de texte
    messageInput.addEventListener('beforeinput', (event) => {
        // Empêcher l'ajout de nouveaux caractères si le nombre de caractères restants est strictement inférieur à 0
        if (event.inputType === 'insertText' && messageInput.value.length >= maxCharacters) {
            event.preventDefault();
        }
    });

    // Ajouter un événement "paste" à l'input pour empêcher le collage de texte dépassant la limite
    messageInput.addEventListener('paste', (event) => {
        const pastedText = event.clipboardData.getData('text');
        const totalLength = messageInput.value.length + pastedText.length;

        if (totalLength > maxCharacters) {
            event.preventDefault();
        }
    });

    // Ajouter un événement "input" à l'input pour mettre à jour le compteur en temps réel
    messageInput.addEventListener('input', updateCharacterCount);

    // Au chargement initial, mettre à jour le compteur pour afficher les caractères restants
    updateCharacterCount();
});
