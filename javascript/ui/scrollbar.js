function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
}

// Appeler la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    scrollToBottom();
});