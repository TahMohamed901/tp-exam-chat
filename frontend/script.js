
const BACKEND_URL = 'http://localhost:3000';
const REFRESH_INTERVAL = 4000;

// Éléments du DOM
const pseudoInput = document.getElementById('pseudo');
const messagesDisplay = document.getElementById('messages-display');
const messageContentInput = document.getElementById('message-content');
const sendButton = document.getElementById('send-button');


function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/**
 * Affiche les messages reçus dans la zone d'affichage.
 * @param {Array<Object>} messages 
 */
function displayMessages(messages) {
    messagesDisplay.innerHTML = ''; // Vide l'affichage actuel
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        // Assurez-vous que le backend renvoie 'author' et 'content'
        const author = msg.author || 'Auteur Inconnu';
        const content = msg.content || '';
        const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('fr-FR') : getCurrentTime();

        messageDiv.innerHTML = `
            <span class="message-author">${author}</span>: ${content}
            <span class="message-meta">(${timestamp})</span>
        `;
        messagesDisplay.appendChild(messageDiv);
    });

    messagesDisplay.scrollTop = messagesDisplay.scrollHeight;
}

async function fetchMessages() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/messages`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const messages = await response.json();
        displayMessages(messages);
    } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error);
        messagesDisplay.innerHTML = `<p style="color: red;">Impossible de contacter le backend: ${error.message}. Vérifiez l'URL et le statut de Render.</p>`;
    }
}


async function sendMessage() {
    const author = pseudoInput.value.trim() || 'Anonyme';
    const content = messageContentInput.value.trim();

    if (!content) {
        alert("Le message ne peut pas être vide.");
        return;
    }

    const newMessage = {
        author: author,
        content: content
    };

    try {
        const response = await fetch(`${BACKEND_URL}/api/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMessage)
        });

        if (response.ok) {
            messageContentInput.value = ''; 
            await fetchMessages(); 
        } else {
            console.error("Erreur lors de l'envoi du message:", response.statusText);
            alert("Erreur lors de l'envoi du message.");
        }
    } catch (error) {
        console.error("Erreur réseau lors de l'envoi du message:", error);
        alert("Erreur réseau lors de l'envoi. Vérifiez la console.");
    }
}

// --- Écouteurs d'événements ---

// Envoi du message au clic sur le bouton
sendButton.addEventListener('click', sendMessage);

// Envoi du message à l'appui de la touche Entrée dans le champ de contenu
messageContentInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Récupération initiale des messages
fetchMessages();

// Configuration du rafraîchissement automatique
setInterval(fetchMessages, REFRESH_INTERVAL);