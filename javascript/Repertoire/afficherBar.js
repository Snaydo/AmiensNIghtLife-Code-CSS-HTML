document.addEventListener('DOMContentLoaded', () => {
    const rectangleContainer = document.getElementById('rectangle-container');
    const barsOuverts = [];
    const barsBientotFermes = [];
    const barsFermes = [];

    function afficherBars(barsOuverts, barsBientotFermes, barsFermes) {
        rectangleContainer.innerHTML = ''; // Effacer le contenu précédent

        const allBars = barsOuverts.concat(barsBientotFermes, barsFermes);

        for (let i = 0; i < allBars.length; i += 2) {
            const bar1 = allBars[i];
            const bar2 = allBars[i + 1];

            afficherBar(
                bar1 ? bar1.nom : null, bar1 ? bar1.type : null, bar1 ? bar1.etab_type : null, bar1 ? bar1.statut : null, bar1 ? bar1.adresse : null, bar1 ? bar1.id : null,
                bar2 ? bar2.nom : null, bar2 ? bar2.type : null, bar2 ? bar2.etab_type : null, bar2 ? bar2.statut : null, bar2 ? bar2.adresse : null, bar2 ? bar2.id : null
            );
        }
    }

    function afficherBar(nomBar1, typeBar1, etabType1, statut1, adresse1, barId1, nomBar2, typeBar2, etabType2, statut2, adresse2, barId2) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        // Premier rectangle
        const colDiv1 = document.createElement('div');
        colDiv1.classList.add('col-6');
        const cardDiv1 = createCard(nomBar1, typeBar1, etabType1, statut1, adresse1, barId1);
        colDiv1.appendChild(cardDiv1);

        // Deuxième rectangle (s'il y a un deuxième bar)
        if (nomBar2) {
            const colDiv2 = document.createElement('div');
            colDiv2.classList.add('col-6');
            const cardDiv2 = createCard(nomBar2, typeBar2, etabType2, statut2, adresse2, barId2);
            colDiv2.appendChild(cardDiv2);
            // Ajoutez les colonnes à la ligne
            rowDiv.appendChild(colDiv1);
            rowDiv.appendChild(colDiv2);
        } else {
            // S'il n'y a pas de deuxième bar, ajoutez seulement la première colonne
            rowDiv.appendChild(colDiv1);
            // Ajoutez une colonne vide pour combler l'espace
            const colDivEmpty = document.createElement('div');
            colDivEmpty.classList.add('col-6', 'invisible');
            rowDiv.appendChild(colDivEmpty);
        }

        // Ajoutez la ligne à la liste des rectangles
        rectangleContainer.appendChild(rowDiv);
    }

    function createCard(nomBar, typeBar, etabType, statut, adresseBar, barId) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'card-highlight');
    
        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.classList.add('card-body');
    
        // Ajoutez le cœur
        const heartIcon = document.createElement('i');
        heartIcon.classList.add('icon', 'ion-ios-heart');
    
        const link = document.createElement('a');
        link.href = adresseBar; // Ajoutez ici l'URL du bar
        link.target = '_blank'; // Ouvrir dans un nouvel onglet
        const title = document.createElement('h5');
        title.classList.add('card-title');
        
        // Condition pour déterminer la classe de taille du titre
        if (nomBar.replace(/\s/g, '').length > 12) {
            title.classList.add('card-title-medium');
        } else {
            title.classList.add('card-title-large');
        }
    
        title.textContent = nomBar;
        title.dataset.barId = barId;
    
        const subtitle = document.createElement('h6');
        subtitle.classList.add('card-subtitle');
        subtitle.textContent = etabType; // Utilisez etabType au lieu de typeBar pour le type du bar
    
        const separatorDiv = document.createElement('div');
        separatorDiv.classList.add('separator-large');
    
        const statusDiv = document.createElement('div');
        statusDiv.classList.add('list-after');
    
        // Ajoutez la logique pour définir la classe de badge et créer le span correspondant
        const statusBadge = document.createElement('span');
        
        switch (statut) {
            case 'ouvert':
                statusBadge.textContent = 'Ouvert';
                statusBadge.classList.add('badge', 'badge-success');
                break;
            case 'bientot':
                statusBadge.textContent = 'Bientôt';
                statusBadge.classList.add('badge', 'badge-warning');
                break;
            case 'ferme':
                statusBadge.textContent = 'Fermé';
                statusBadge.classList.add('badge', 'badge-danger');
                break;
            default:
                statusBadge.textContent = 'Non détérminé';
                statusBadge.classList.add('badge', 'badge-danger');
                break;
        }
    
        if (statut === 'ouvert') {
            statusBadge.classList.add('badge', 'badge-success');
        } else if (statut === 'bientot') {
            statusBadge.classList.add('badge', 'badge-warning');
        } else if (statut === 'ferme') {
            statusBadge.classList.add('badge', 'badge-danger');
        }
    
        // Assemblez les éléments
        link.appendChild(title);
        cardBodyDiv.appendChild(heartIcon);
        cardBodyDiv.appendChild(link);
        cardBodyDiv.appendChild(subtitle);
        cardBodyDiv.appendChild(separatorDiv);
        cardBodyDiv.appendChild(statusBadge);
        cardDiv.appendChild(cardBodyDiv);
    
        return cardDiv;
    }    

    function trierBarsParStatut(data) {
        barsOuverts.length = 0; // Réinitialiser la liste
        barsBientotFermes.length = 0; // Réinitialiser la liste
        barsFermes.length = 0; // Réinitialiser la liste

        // Remplir les listes en fonction du statut
        for (const bar of data) {
            if (bar.statut === 'ouvert') {
                barsOuverts.push(bar);
            } else if (bar.statut === 'bientot') {
                barsBientotFermes.push(bar);
            } else if (bar.statut === 'ferme') {
                barsFermes.push(bar);
            }
        }

        // Appeler la fonction pour afficher les bars après les avoir triés par statut
        afficherBars(barsOuverts, barsBientotFermes, barsFermes);
    }

    function fetchBars() {
        fetch('./php/api.php')
            .then(response => response.json())
            .then(data => {
                trierBarsParStatut(data);
            })
            .catch(error => console.error('Erreur lors de la récupération des données :', error));
    }

    // Ajout de la fonction de recherche
    function filterEtablissement() {
        var input = document.querySelector('.searchInput');
        var filter = input.value.trim().toLowerCase();
    
        // Obtenez toutes les catégories actives
        var activeCategories = Array.from(filterTags)
            .filter(t => t.classList.contains('active'))
            .map(t => t.textContent.toLowerCase());
    
        // Filtrer les bars en fonction du terme de recherche et des catégories actives
        var filteredBars = barsOuverts.concat(barsBientotFermes, barsFermes).filter(bar => {
            var matchesSearch = bar.nom.toLowerCase().includes(filter);
    
            // Si des catégories sont actives, assurez-vous que la barre correspond à au moins l'une d'entre elles
            var matchesCategory = !activeCategories.length || activeCategories.some(category => {
                switch (category) {
                    case 'ouvert':
                        return bar.statut.toLowerCase() === 'ouvert';
                    case 'ferme bientôt':
                        return bar.statut.toLowerCase() === 'bientot';
                    case 'fermé':
                        return bar.statut.toLowerCase() === 'ferme';
                    case 'bar':
                        return bar.etab_type.toLowerCase().trim() === 'bar';
                    case 'bar à ambiance':
                        return bar.etab_type.toLowerCase().trim() === 'bar à ambiance';
                    case 'discothèques':
                        return bar.etab_type.toLowerCase().trim() === 'discothèque';
                    default:
                        return false;
                }
            });
    
            return matchesSearch && matchesCategory;
        });
    
        // Afficher les bars filtrés
        afficherBars(filteredBars, [], []);
    }
    
    // Ajout d'un gestionnaire d'événements à l'élément de recherche
    var searchInput = document.querySelector('.searchInput');
    searchInput.addEventListener('input', filterEtablissement);

    function filterByCategory(categories) {
    
        var filteredBars = barsOuverts.concat(barsBientotFermes, barsFermes).filter(bar => {
            // Si aucune catégorie n'est sélectionnée, affichez toutes les bars
            if (!categories || categories.length === 0) {
                return true;
            }
    
            // Vérifiez si la barre correspond à au moins une des catégories actives
            return categories.some(category => {
                switch (category) {
                    case 'ouvert':
                        return bar.statut.toLowerCase() === 'ouvert';
                    case 'ferme bientôt':
                        return bar.statut.toLowerCase() === 'bientot';
                    case 'fermé':
                        return bar.statut.toLowerCase() === 'ferme';
                    case 'bar':
                        return bar.etab_type.toLowerCase().trim() === 'bar';
                    case 'bar à ambiance':
                        return bar.etab_type.toLowerCase().trim() === 'bar à ambiance';
                    case 'discothèques':
                        return bar.etab_type.toLowerCase().trim() === 'discothèque';
                    default:
                        return false;
                }
            });
        });
    
        // Afficher les bars filtrés
        afficherBars(filteredBars, [], []);
    }
    
    
    var filterTags = document.querySelectorAll('.filter-tag span');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function () {
            // Inversez la classe 'active' du tag cliqué
            tag.classList.toggle('active');
    
            // Obtenez toutes les catégories actives
            var activeCategories = Array.from(filterTags)
                .filter(t => t.classList.contains('active'))
                .map(t => t.textContent.toLowerCase());
    
            // Appelez la fonction de filtrage en fonction des catégories sélectionnées
            // Si aucune catégorie n'est active, réaffichez tous les bars
            filterByCategory(activeCategories.length > 0 ? activeCategories : null);
        });
    });
    // Charger les bars au chargement de la page
    fetchBars();
});
