const refreshElement = document.getElementById('refresh-repert');

refreshElement.addEventListener('click', function () {
    // Ajoutez la classe pour la rotation de 360 degrés
    this.classList.add('rotate-360');

    // Attendez la fin de la transition, puis supprimez la classe pour la prochaine rotation
    setTimeout(() => {
        this.classList.remove('rotate-360');
        
        // Rechargez la page après la fin de l'animation
        setTimeout(() => {
            location.reload();
        }, 300); // Utilisez le même délai que la durée de la transition
    }, 300); // Utilisez le même délai que la durée de la transition
});
