// Fonction pour rafraîchir la section du chat
function refreshChat() {
    // Envoyer une requête GET au serveur pour récupérer les messages
    fetch("./php/load-messages.php")
        .then(response => response.json())
        .then(messages => {
            const chatMessages = document.querySelector('.chat-messages');
            chatMessages.innerHTML = ''; // Effacer les messages actuels

            messages.forEach(message => {
                const messageContainer = createMessageContainer(message);
                chatMessages.appendChild(messageContainer);
            });
        })
        .catch(error => console.error("Erreur lors du chargement des messages : " + error));
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
    

// Charger les messages lors du chargement de la page
function loadChatMessages() {
    // Envoyer une requête GET au serveur pour récupérer les messages
    fetch("./php/load-messages.php")
        .then(response => response.json())
        .then(messages => {
            const chatMessages = document.querySelector('.chat-messages');
            chatMessages.innerHTML = ''; // Effacer les messages actuels

            messages.forEach(message => {
                const messageContainer = createMessageContainer(message);
                chatMessages.appendChild(messageContainer);
            });
        })
        .catch(error => console.error("Erreur lors du chargement des messages : " + error));
}

// Charger les messages lors du chargement de la page
loadChatMessages();

// Rafraîchir la section du chat toutes les 5 secondes (ou à la fréquence souhaitée)
setInterval(refreshChat, 5000); // Rafraîchir toutes les 5 secondes (5000 ms)
