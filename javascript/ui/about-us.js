// Fonction pour charger les favoris de l'utilisateur
async function loadUserFavorites(userId) {
    try {
        // Utilisez la fonction fetch pour envoyer une requête GET au fichier PHP
        const response = await fetch(`./php/get-favorite.php?userId=${userId}`);
        const data = await response.json();

        // Chargez les détails de chaque favori
        for (const barId of data) {
            await loadBarDetails(barId);
        }

    } catch (error) {
        // Gérez les erreurs (facultatif)
        console.error('Erreur lors du chargement des favoris :', error);
    }
}

// Fonction pour charger les détails d'un bar
async function loadBarDetails(barId) {
    try {
        // Utilisez la fonction fetch pour envoyer une requête GET au fichier PHP
        const response = await fetch(`./php/get-info-bar.php?id=${barId}`);
        const data = await response.json();

        // Créez un élément swiper pour chaque bar et ajoutez-le au conteneur
        createSwiperElement(data);
    } catch (error) {
        // Gérez les erreurs (facultatif)
        console.error(`Erreur lors du chargement des détails du bar ${barId} :`, error);
    }
}

// Fonction pour initialiser Swiper
function initializeSwiper() {
    swiperInstance = new Swiper('.swiper-container', {
        direction: 'horizontal',
        spaceBetween: 15,
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
        },
        // Ajoutez la configuration d'autoplay
        autoplay: {
            delay: 4000,
        },
    });
}

// Fonction pour créer et ajouter un élément swiper au conteneur
function createSwiperElement(barDetails) {
    // Sélectionnez le conteneur du swiper
    const swiperContainer = document.querySelector('.swiper-wrapper');

    // Créez un élément swiper
    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');

    // Créez la structure interne de l'élément swiper
    const content = document.createElement('div');
    content.classList.add('content', 'bg-lightblue');

    const wrapIcon = document.createElement('div');
    wrapIcon.classList.add('wrap-icon');

    const icon = document.createElement('i');
    icon.classList.add('icon', 'ion-ios-' + (barDetails.etab_type === 'Discothèque' ? 'star' : 'wine'));
    icon.classList.add(barDetails.etab_type === 'Discothèque' ? 'bg-purple' : 'bg-yellow');

    const text = document.createElement('div');
    text.classList.add('text');

    const h5 = document.createElement('h5');
    h5.textContent = barDetails.nom;

    const p = document.createElement('p');
    p.textContent = barDetails.etab_type;

    // Ajoutez les éléments créés les uns aux autres
    wrapIcon.appendChild(icon);
    content.appendChild(wrapIcon);
    text.appendChild(h5);
    text.appendChild(p);
    content.appendChild(text);
    swiperSlide.appendChild(content);

    // Ajoutez l'élément swiper au conteneur
    swiperContainer.appendChild(swiperSlide);

        // Réinitialisez l'instance Swiper après l'ajout dynamique
        if (swiperInstance) {
            swiperInstance.update();
            // Détruisez l'instance existante si nécessaire
            // swiperInstance.destroy();
            initializeSwiper();
        }
}

// Variable pour stocker l'instance Swiper
let swiperInstance;

// Fonction pour formater le nombre
function formatNumber(number) {
    if (number >= 1000 && number < 1000000) {
        // Format en K (kilo)
        return (number / 1000).toFixed(1) + 'K';
    } else if (number >= 1000000) {
        // Format en M (mille)
        return (number / 1000000).toFixed(1) + 'M';
    } else {
        // Pas de format spécial
        return number.toString();
    }
}

// Fonction pour récupérer le nombre de messages, le nombre de recherches, et la date de création du compte
async function loadUserStats(userId) {
    try {
        // Utilisez la fonction fetch pour envoyer une requête GET au fichier PHP
        const response = await fetch(`./php/get-infor-user.php?userId=${userId}`);
        const data = await response.json();

        // Affichez le nombre de messages dans l'élément avec l'ID 'number-message'
        const numberMessageElement = document.getElementById('number-message');
        numberMessageElement.textContent = data.messageCount;

        // Affichez le nombre de recherches dans l'élément avec l'ID 'recherche-number'
        const rechercheNumberElement = document.getElementById('recherche-number');
        rechercheNumberElement.textContent = formatNumber(data.searchCount === null ? 0 : data.searchCount);
        
        // Affichez la date de création du compte dans l'élément avec l'ID 'create-compte'
        const createCompteElement = document.getElementById('create-compte');
        createCompteElement.textContent = data.creationDate;

    } catch (error) {
        // Gérez les erreurs (facultatif)
        console.error('Erreur lors du chargement des statistiques utilisateur :', error);
    }
}



// Appelez la fonction pour charger les favoris de l'utilisateur
document.addEventListener('DOMContentLoaded', async function() {
    const loggedIn = checkUserLoggedIn();

        // Vérifier si l'utilisateur est connecté en vérifiant la présence du cookie
        if (loggedIn) {
            const loggedInUsername = getLoggedInUsername();
            const userId = await getId(loggedInUsername);
            // Récupérer l'ID de l'utilisateur connecté
            getId(loggedInUsername)
                .then(userId => {
                    if (userId) {
                        // Utiliser userId pour obtenir l'adresse e-mail de l'utilisateur
                        getUserEmail(userId)
                            .then(email => {
                                if (email) {
                                    // Mettre à jour la valeur de l'élément HTML avec l'adresse e-mail
                                    const emailElement = document.getElementById('email');
                                    emailElement.textContent = email; // Utilisez .value pour un champ de saisie
    
                                    // Mettre à jour la valeur de l'élément HTML avec le nom d'utilisateur
                                    const usernameElement = document.getElementById('username');
                                    usernameElement.textContent = loggedInUsername; // Utilisez .textContent pour un élément de texte

                                    // Charger les favoris de l'utilisateur et mettre à jour l'apparence des icônes de cœur
                                    loadUserFavorites(userId);
                                    loadUserStats(userId);

                                    // Initialiser Swiper
                                    initializeSwiper();
                                } else {
                                    console.error('Impossible de récupérer l\'adresse e-mail de l\'utilisateur.');
                                }
                            })
                            .catch(error => {
                                console.error('Erreur lors de la récupération de l\'adresse e-mail de l\'utilisateur :', error);
                            });
                    } else {
                        console.error('ID de l\'utilisateur non valide.');
                    }
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération de l'ID de l'utilisateur : " + error);
                    showAlert("Une erreur est survenue. Veuillez réessayer.");
                });
        } else {
            // L'utilisateur n'est pas connecté, vous pouvez rediriger vers la page de connexion
            window.location.href = 'sign-in.html';
        }
    
});