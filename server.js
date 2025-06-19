// server.js
const express = require('express');
const fetch = require('node-fetch'); // Pour faire des requêtes HTTP depuis Node.js
const cors = require('cors'); // Pour gérer les requêtes Cross-Origin

const app = express();
const PORT = process.env.PORT || 3001; // Render fournira la variable PORT

// Récupérer la clé API OpenAI depuis les variables d'environnement
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Middlewares
app.use(cors()); // Autoriser les requêtes depuis votre frontend (GitHub Pages)
app.use(express.json()); // Pour parser le corps des requêtes en JSON

// Endpoint unique pour gérer les appels à OpenAI
app.post('/api/openai', async (req, res) => {
    if (!OPENAI_API_KEY) {
        console.error('OpenAI API key is not set.');
        return res.status(500).json({ error: 'Configuration error: OpenAI API key missing on server.' });
    }

    const { type, prompt, taskTitle, model = 'gpt-4o-mini', max_tokens = 150, temperature = 0.7 } = req.body;

    if (!type || (!prompt && !taskTitle)) {
        return res.status(400).json({ error: 'Missing type or prompt/taskTitle in request body.' });
    }

    let openAIEndpoint = 'https://api.openai.com/v1/chat/completions';
    let messages;

    // Utiliser taskTitle si prompt n'est pas fourni, pour la rétrocompatibilité
    const currentPrompt = prompt || taskTitle;

    switch (type) {
        case 'generateSubtasks':
            messages = [{
                role: 'user',
                content: `Génère 3-5 sous-tâches spécifiques et actionnables pour cette tâche : "${currentPrompt}". Réponds uniquement avec une liste simple, une sous-tâche par ligne, sans numérotation ni tirets.`
            }];
            break;
        case 'categorizeTask':
            messages = [{
                role: 'user',
                content: `Catégorise cette tâche : "${currentPrompt}". Choisis parmi : Travail, Personnel, Urgent, Shopping, Santé, Projets. Réponds uniquement avec le nom de la catégorie.`
            }];
            break;
        default:
            return res.status(400).json({ error: 'Invalid AI action type.' });
    }

    try {
        const openaiResponse = await fetch(openAIEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                max_tokens: type === 'categorizeTask' ? 20 : max_tokens, // Moins de tokens pour la catégorisation
                temperature: temperature
            })
        });

        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.json();
            console.error('OpenAI API Error:', errorData);
            return res.status(openaiResponse.status).json({ 
                error: 'Failed to get response from OpenAI.', 
                details: errorData 
            });
        }

        const data = await openaiResponse.json();
        res.json(data);

    } catch (error) {
        console.error('Error proxying to OpenAI:', error);
        res.status(500).json({ error: 'Internal server error while contacting OpenAI.' });
    }
});

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('TodoList IA Core Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    if (!OPENAI_API_KEY) {
        console.warn('WARNING: OPENAI_API_KEY environment variable is not set. AI features will not work.');
    }
});
