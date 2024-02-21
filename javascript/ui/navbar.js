document.addEventListener("DOMContentLoaded", function() {
    // Vérifie si l'utilisateur est bien connécté
    const loggedInUsername = getLoggedInUsername();
    // Sélectionnez l'élément par son ID
    var login = document.getElementById("login");
    var profil = document.getElementById("profil");
    var settings = document.getElementById("settings");
    var logout = document.getElementById("logout");

    // Vérifiez si l'élément existe avant de tenter de le masquer
    if (!loggedInUsername) {        // Masquez l'élément en définissant sa propriété d'affichage sur "none"
        profil.style.display = "none";
        settings.style.display = "none";
        logout.style.display = "none";
    } else {
        login.style.display = "none";
        profil.style.display = "flex";
        settings.style.display = "flex";
        logout.style.display = "flex";
    }
});
