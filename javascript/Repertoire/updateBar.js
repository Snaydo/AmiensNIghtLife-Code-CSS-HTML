document.addEventListener('DOMContentLoaded', () => {
  const API_URL = './php/api.php';
  const UPDATE_URL = './php/update_statut.php';
  const INTERVAL_MS = 10000; // 1 minute

  function fetchJson(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
  }

  function updateBarStatut(nomBar, statut) {
    // console.log("Updating statut for bar:", nomBar, "Statut:", statut);
    fetchJson(UPDATE_URL, {
      nom: nomBar,
      statut: statut,
    })
      .then(data => {
        if (data.message === "Statut mis à jour avec succès.") {
          // console.log("Statut mis à jour avec succès pour le bar : " + nomBar);
        } else {
          // console.error("Erreur lors de la mise à jour du statut pour le bar " + nomBar + " :", data);
        }
      })
      .catch(error => {
        // console.error('Erreur lors de la mise à jour du statut pour le bar ' + nomBar + ' :', error);
      });
  }


// Fonction pour récupérer l'heure de fermeture du bar du jour précédent
function getPreviousDayClosingTime(horaires, dayOfWeek) {
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentIndex = daysOfWeek.indexOf(dayOfWeek);
  const previousIndex = (currentIndex - 1 + daysOfWeek.length) % daysOfWeek.length;
  const previousDayOfWeek = daysOfWeek[previousIndex];

  // Vérifier si les horaires pour le jour précédent sont définis
  if (horaires && horaires[previousDayOfWeek]) {
    const previousDayOpeningClosingTime = horaires[previousDayOfWeek].trim();
    const match = previousDayOpeningClosingTime.match(/(\d{2}:\d{2}) (\d{2}:\d{2})/);

    if (match) {
      const previousDayClosingTime = match[2];
      return previousDayClosingTime;
    }
  }

  // Si les horaires ne sont pas définis ou l'heure de fermeture n'a pas pu être extraite, retourner une heure de fermeture par défaut (par exemple minuit)
  return '00:00';
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return hours + ':' + minutes;
}



function isNextDay(fermetureTime, parisNow) {
  // Compare l'heure de fermeture avec l'heure actuelle
  // Renvoie true si l'heure de fermeture est le lendemain, sinon false
  const fermetureHour = fermetureTime.getHours();
  const fermetureMinutes = fermetureTime.getMinutes();
  const nowHour = parisNow.getHours();
  const nowMinutes = parisNow.getMinutes();

  if (fermetureHour < nowHour) {
    return true;
  } else if (fermetureHour === nowHour && fermetureMinutes <= nowMinutes) {
    return true;
  } else {
    return false;
  }
}


async function updateStatutBars() {
  try {
    const data = await fetchJson(API_URL);

    const now = new Date();
    const parisTimeZone = 'Europe/Paris';
    const parisTime = now.toLocaleString('en-US', { timeZone: parisTimeZone });
    const parisNow = new Date(parisTime);
    const parisNowFormatted = formatTime(parisNow);


    // console.log("parisNow:", parisNow);

    const dayOfWeek = parisNow.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    for (const bar of data) {
      const horaires = bar.horaires;

      const previousDayClosingTime = getPreviousDayClosingTime(horaires, dayOfWeek);

      if (typeof horaires === 'undefined' || horaires[dayOfWeek].trim() === '') {
        updateBarStatut(bar.nom, 'ferme');
      } else {
        const ouverture = horaires[dayOfWeek].split(' ')[0];
        const fermeture = horaires[dayOfWeek].split(' ')[1];
        const ouvertureTime = new Date(now.toDateString() + ' ' + ouverture);
        let fermetureTime = new Date(now.toDateString() + ' ' + fermeture);

        // Vérifier si l'heure de fermeture est le lendemain
        if (isNextDay(fermetureTime, ouvertureTime)) {
          const previousDayClosingTime = getPreviousDayClosingTime(horaires, dayOfWeek);
          fermetureTime = new Date(now.toDateString() + ' ' + previousDayClosingTime);

          // Ajouter un jour à la date d'ouverture pour obtenir la date de fermeture correcte
          const nextDay = new Date(now);
          nextDay.setDate(nextDay.getDate() + 1);
          fermetureTime = new Date(nextDay.toDateString() + ' ' + fermeture);
        } else {
          fermetureTime = new Date(now.toDateString() + ' ' + fermeture);
        }

        const isOpenToday = parisNow >= ouvertureTime && parisNow < fermetureTime;
        const isOpenYesterday = parisNowFormatted <= previousDayClosingTime;

        const fermetureTimeFormatted = formatTime(fermetureTime);

        // Parse les heures et minutes de parisNowFormatted et fermetureTimeFormatted
        const [parisNowHour, parisNowMinutes] = parisNowFormatted.split(":");
        const [fermetureTimeHour, fermetureTimeMinutes] = fermetureTimeFormatted.split(":");

        // Convertit les heures en nombres entiers
        const parisNowHourInt = parseInt(parisNowHour, 10);
        const fermetureTimeHourInt = parseInt(fermetureTimeHour, 10);

        // Convertit les minutes en nombres entiers en utilisant la fonction Number
        const parisNowMinutesInt = Number(parisNowMinutes);
        const fermetureTimeMinutesInt = Number(fermetureTimeMinutes);

        // Calcule la différence en minutes entre l'heure actuelle et l'heure de fermeture
        let timeDifferenceMinutes = (fermetureTimeHourInt - parisNowHourInt) * 60 + (fermetureTimeMinutesInt - parisNowMinutesInt);

        // Vérifie si l'heure de fermeture est après minuit (cas d'un bar ouvert la veille tard dans la nuit)
        if (fermetureTimeHourInt < parisNowHourInt) {
          // Ajoute une journée complète (24 heures) pour obtenir le temps restant correct
          timeDifferenceMinutes += 24 * 60;
        }

        //console.log(fermetureTimeHourInt + ':' + fermetureTimeMinutesInt);

        if (isOpenToday || isOpenYesterday) {
          if (timeDifferenceMinutes <= 30 && timeDifferenceMinutes > 0) {
            //console.log(bar.nom + ' - Ferme bientot');
            updateBarStatut(bar.nom, 'bientot');
          } else {
            //console.log(bar.nom + ' - Ouvert');
            updateBarStatut(bar.nom, 'ouvert');
          }
        } else {
          //console.log(bar.nom + ' - Fermé');
          updateBarStatut(bar.nom, 'ferme');
        }
      }
    }

    // console.log("Mise à jour de l'ordre des bars");
  } catch (error) {
    //console.error('Erreur lors de la mise à jour des statuts des bars :', error);
  }
}

  updateStatutBars();

  // Appeler la fonction updateStatutBars toutes les minutes
  setInterval(updateStatutBars, INTERVAL_MS);
});