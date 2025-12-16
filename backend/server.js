const express = require('express');
const cors = require('cors');
const app = express();

// --- Configuration ---
const PORT = process.env.PORT || 3000;

// Stockage des messages en mémoire (pas de base de données) [cite: 28]
let messages = [
    { author: "Admin", content: "Bienvenue dans le Mini Chat DevOps!", timestamp: Date.now() },
    { author: "Correcteur", content: "Test de la persistance en mémoire...", timestamp: Date.now() + 1 }
];
//https://tp-exam-chat-2p060nek3-tahmohamed901s-projects.vercel.app/
//https://tp-exam-chat-d1h53r0jb-tahmohamed901s-projects.vercel.app

app.use(cors({
    origin: "https://tp-exam-chat-2p060nek3-tahmohamed901s-projects.vercel.app",
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders : [ 'Content-Type'],
}));

// Middleware pour parser le corps des requêtes JSON (pour POST) [cite: 27]
app.use(express.json());

// --- Routes API REST [cite: 24] ---

// 1. GET /api/messages : Retourne tous les messages [cite: 25]
app.get('/api/messages', (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/messages - Returned ${messages.length} messages.`);
    // Retourne les messages triés par timestamp (le plus récent en bas, mais ici on garde l'ordre d'insertion)
    res.json(messages);
});

// 2. POST /api/messages : Ajoute un message [cite: 27]
app.post('/api/messages', (req, res) => {
    // Le corps JSON doit contenir {author, content} [cite: 27]
    const { author, content } = req.body;

    if (!author || !content) {
        return res.status(400).json({ error: 'Author and content are required.' });
    }

    const newMessage = {
        author: author,
        content: content,
        timestamp: Date.now() 
    };

    messages.push(newMessage);
    console.log(`[${new Date().toISOString()}] POST /api/messages - Message received from ${author}. Total: ${messages.length}`);
    
    // Répondre avec 201 Created (ou 200 OK)
    res.status(201).json({ 
        message: 'Message added successfully',
        data: newMessage 
    });
});

// Route de base (optionnel, pour vérifier si le serveur est en ligne)
app.get('/', (req, res) => {
    res.send('Mini Chat Backend est opérationnel.');
});

// --- Démarrage du serveur ---
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`API documentation:`);
    console.log(`  GET /api/messages`);
    console.log(`  POST /api/messages (body: {author, content})`);
});