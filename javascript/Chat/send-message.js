const messageInput = document.querySelector('.chat-form input[type="text"]'); // Champ de saisie
const sendButton = document.querySelector('.button-send i'); // Bouton d'envoi

// Fonction pour afficher le modal de connexion
function afficheModalLogin() {
    // Assurez-vous d'avoir le code pour afficher votre modal
    const loginModal = document.getElementById('loginModal');
    $(loginModal).modal('show'); // Utilisation de jQuery pour afficher le modal
}

function viderChampSaisie() {
    if (messageInput) {
        messageInput.value = '';
    }
}

    function createMessageContainer(message, username) {
        const loggedInUsername = getLoggedInUsername();
        
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container'); // Ajoutez la classe à messageContainer
        const messageDiv = document.createElement('div');
        
        const isMyChat = message.username === loggedInUsername;
        
        messageDiv.classList.add('chat-item', 'text-small', isMyChat ? 'bg-my-chat' : 'bg-chat-people');
        
        // Ajoute le nom d'utilisateur à la classe pour un style différent si nécessaire
        messageDiv.classList.add(isMyChat ? 'my-chat' : 'chat-people');
        
        const chatDateDiv = document.createElement('div');
        chatDateDiv.classList.add('chat-date');
        const timestamp = new Date(message.Timestamp);
        chatDateDiv.innerHTML = `<span>${formatTimestamp(timestamp)}</span>`;
        
        const chatTextDiv = document.createElement('div');
        chatTextDiv.classList.add('chat-text');
        const messageParagraph = document.createElement('p');
        
        // Ajoute le nom d'utilisateur au texte du message
        messageParagraph.textContent = `${message.username}: ${message.Message}`;
        chatTextDiv.appendChild(messageParagraph);
        
        const triangleDiv = document.createElement('div');
        triangleDiv.classList.add('triangle', isMyChat ? 'angle-right' : 'angle-left');
        
        messageDiv.appendChild(chatDateDiv);
        messageDiv.appendChild(chatTextDiv);
        messageDiv.appendChild(triangleDiv);
        
        messageContainer.appendChild(messageDiv);

        // Ajoute le séparateur
        const separatorDiv = document.createElement('div');
        separatorDiv.classList.add('separator-medium');
        messageContainer.appendChild(separatorDiv);
        
        return messageContainer;
    }
    
    function formatTimestamp(timestamp) {
        // Formate le timestamp comme nécessaire (à adapter selon vos besoins)
        const hours = timestamp.getHours().toString().padStart(2, '0');
        const minutes = timestamp.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    


document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.querySelector('.button-send'); // Remplacez par la classe réelle de votre bouton d'envoi
    const messageInput = document.querySelector('input[type="text"]');
    let lastMessageSentTime = 0;

    sendButton.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keydown', handleKeyDown);

    function handleSendMessage() {
        const messageContent = messageInput.value.trim();

        // Vérifier si l'utilisateur est connecté avant d'envoyer le message
        if (checkUserLoggedIn()) {
            if (messageContent !== '') {
                const currentTime = Date.now();
                const timeSinceLastMessage = currentTime - lastMessageSentTime;

                // Vérifier si le cooldown de 5 secondes est écoulé
                if (timeSinceLastMessage >= 5000) {
                    // Envoyer le message au serveur
                    sendMessageToServer(messageContent);
                    viderChampSaisie();

                    // Mettre à jour le moment du dernier envoi de message
                    lastMessageSentTime = currentTime;
                } else {
                    const remainingCooldown = Math.ceil((5000 - timeSinceLastMessage) / 1000);
                    afficherModalDanger("Erreur", `Veuillez patienter ${remainingCooldown} secondes avant d'envoyer un autre message.`);
                }
            } else {
                afficherModalDanger("Erreur", "Veuillez saisir un message.");
            }
        } else {
            afficheModalLogin();
        }
    }

    function handleKeyDown(event) {
        const messageContent = messageInput.value.trim();
    
        // Vérifier si la touche enfoncée est "Enter" (code de touche 13)
        if (event.keyCode === 13) {
            event.preventDefault(); // Empêcher le comportement par défaut de la touche "Enter" (qui serait de créer une nouvelle ligne)
    
            // Vérifier si l'utilisateur est connecté
            if (checkUserLoggedIn()) {
                if (messageContent !== '') {
                    const currentTime = Date.now();
                    const timeSinceLastMessage = currentTime - lastMessageSentTime;
    
                    // Vérifier si le cooldown de 5 secondes est écoulé
                    if (timeSinceLastMessage >= 5000) {
                        // Envoyer le message au serveur
                        sendMessageToServer(messageContent);
                        viderChampSaisie();
    
                        // Mettre à jour le moment du dernier envoi de message
                        lastMessageSentTime = currentTime;
                    } else {
                        const remainingCooldown = Math.ceil((5000 - timeSinceLastMessage) / 1000);
                        afficherModalDanger("Erreur", `Veuillez patienter ${remainingCooldown} secondes avant d'envoyer un autre message.`);
                    }
                } else {
                    afficherModalDanger("Erreur", "Veuillez saisir un message.");
                }
            } else {
                afficheModalLogin();
            }
        }
    }    
    

    function isMessageContainsLink(messageContent) {
        // Expression régulière pour détecter les liens HTTP/HTTPS
        const linkPattern = /(http[s]?:\/\/[^\s]+)/;
    
        // Vérifier si le message contient un lien en utilisant l'expression régulière
        return linkPattern.test(messageContent);
    }

// Variable pour stocker le dernier message envoyé par l'utilisateur
let dernierMessageEnvoye = '';

function sendMessageToServer(messageContent) {

  // Lire le contenu du fichier de blacklist.txt (remplacez le chemin par le chemin réel)
  fetch('./blacklist-words.txt')
    .then(response => response.text())
    .then(text => {

      const blacklistWords = text.split('\n').map(word => word.trim());

      // Convertir le message entré par l'utilisateur en minuscules
      const messageLowerCase = messageContent.toLowerCase();

      // Convertir la liste de mots interdits en minuscules
      const blacklistWordsLowerCase = blacklistWords.map(word => word.toLowerCase());

      // Vérifier si le message contient un mot interdit insensible à la casse
      const containsBlacklistedWord = blacklistWordsLowerCase.some(word => messageLowerCase.includes(word));

      if (containsBlacklistedWord) {
        afficherModalDanger("Erreur", "Le message contient un mot interdit. Veuillez réviser votre message.");
        return; // Ne pas envoyer le message au serveur
      }

      // Vérifier si le message est identique au dernier message envoyé
      if (messageContent === dernierMessageEnvoye) {
        afficherModalDanger("Erreur", "Vous ne pouvez pas envoyer le même message deux fois d'affilée.");
        return; // Ne pas envoyer le message au serveur
      }

      // Récupérer l'ID de l'utilisateur connecté en utilisant le nom d'utilisateur
      const loggedInUsername = getLoggedInUsername();

      // Vérifier si l'utilisateur est connecté
      if (loggedInUsername) {
        // Récupérer l'ID de l'utilisateur en utilisant le nom d'utilisateur
        getId(loggedInUsername)
          .then(userId => {
            // Créer un objet contenant les données à envoyer au serveur (contenu du message, nom d'utilisateur et ID)
            const data = {
              messageContent: messageContent,
              username: loggedInUsername,
              auteur_id: userId // Utiliser l'ID récupéré de la fonction getId()
            };

            // Envoyer une requête POST au serveur avec les données du message
            fetch("./php/save-message.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
              })
                .then(response => response.json())
                .then(result => {
                  if (result.success) {
                    // Effacer le champ de saisie après l'envoi réussi
                    const messageInput = document.getElementById('message-input');
              
                    // Vérifier si l'élément existe avant de définir sa valeur
                    if (messageInput) {
                      messageInput.value = '';
                    }
              
                    // Actualiser la liste des messages
                    loadChatMessages();
                    scrollToBottom();
              
                    // Mettre à jour le dernier message envoyé
                    dernierMessageEnvoye = messageContent;
                  } else {
                    afficherModalDanger("Erreur Interne", "Échec de l'envoi du message. Veuillez réessayer.");
                  }
                })
                .catch(error => {
                    afficherModalDanger("Erreur Interne", "Échec de l'envoi du message. Veuillez réessayer.");
                });
          })
          .catch(error => {
            afficherModalDanger("Erreur Interne", "Échec de l'envoi du message. Veuillez réessayer.");
          });
      }
    })
    .catch(error => {
        afficherModalDanger("Erreur Interne", "Échec de l'envoi du message. Veuillez réessayer.");
    });
}   

    function loadChatMessages() {
        // Appeler le script PHP pour supprimer les messages obsolètes
        fetch("./php/remove-old-message.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Continuer avec le chargement des messages
                fetch("./php/get-messages.php")
                    .then(response => response.json())
                    .then(messages => {
                        const chatMessages = document.querySelector('.container');
                        chatMessages.innerHTML = ''; // Effacer les messages actuels

                        // Inverser l'ordre des messages (du plus récent au plus ancien)
                        messages.reverse();

                        messages.forEach(message => {
                            const messageContainer = createMessageContainer(message, message.Pseudo);
                            chatMessages.appendChild(messageContainer);
                        });
                        scrollToBottom();
                    })
                    .catch(error => {

                    });
            } else {
                console.error("Échec de la suppression des messages obsolètes");
            }
        })
        .catch(error => console.error("Erreur lors de la suppression des messages obsolètes"));
    }

    
    // Charger les messages lors du chargement de la page
    loadChatMessages();
    
});

// Fonction pour rafraîchir la section du chat
function refreshChat() {
    // Envoyer une requête GET au serveur pour récupérer les messages
    fetch("./php/get-messages.php")
        .then(response => response.json())
        .then(messages => {
            const chatMessages = document.querySelector('.container');
            chatMessages.innerHTML = ''; // Effacer les messages actuels

            // Inverser l'ordre des messages (du plus récent au plus ancien)
            messages.reverse();

            messages.forEach(message => {
                // Créer le conteneur du message avec l'username récupéré
                const messageContainer = createMessageContainer(message, message.Pseudo);
                chatMessages.appendChild(messageContainer);
            });
            scrollToBottom();
        })
        .catch(error => {
            
        });
}

// Fonction pour vérifier l'état du chat en fonction du nombre de bars ouverts
function checkChatStatus() {

    if (checkUserLoggedIn()) {
        // Activer l'input
        messageInput.disabled = false;
        // Activer le bouton d'envoi
        sendButton.disabled = false;

        if(messageInput.placeholder === "Veuillez vous connecter") {
            messageInput.placeholder = 'Taper votre messag';
        }
        
    } else {        
        // Désactiver l'input
        messageInput.disabled = true;
        // Désactiver le bouton d'envoi
        sendButton.classList.add('disabled');
        messageInput.placeholder = 'Veuillez vous connecter';
    }
}


// Appeler la fonction checkChatStatus lors du chargement initial de la page
document.addEventListener('DOMContentLoaded', () => {
    checkChatStatus();

    // Vérifier l'état du chat à intervalles réguliers
    setInterval(checkChatStatus, 5000); // Vérifier toutes les minutes (60000 ms)
});



// Rafraîchir la section du chat toutes les 5 secondes (ou à la fréquence souhaitée)
setInterval(refreshChat, 1000); // Rafraîchir toutes les 5 secondes (5000 ms)