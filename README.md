TodoList IA - Backend Proxy
🎯 Rôle du Projet
Ce serveur Node.js agit comme un proxy sécurisé entre l'application front-end TodoList IA et l'API d'OpenAI.

Son rôle principal est de protéger la clé API d'OpenAI, qui ne doit jamais être exposée côté client. Il centralise également la logique de construction des prompts envoyés à l'IA.

✨ Responsabilités Principales
Sécurisation de la Clé API : La clé API d'OpenAI est stockée de manière sécurisée dans les variables d'environnement du serveur.

Gestion des CORS : Autorise les requêtes provenant uniquement du domaine de l'application front-end.

Proxy d'API : Reçoit les demandes du front-end, construit la requête appropriée pour l'API d'OpenAI, et relaie la réponse.

Logique des Prompts : Contient la logique pour formater les prompts envoyés à l'IA pour différentes tâches (génération de sous-tâches, catégorisation).

🔌 API Endpoint
Le serveur expose un unique endpoint pour toutes les interactions avec l'IA.

POST /api/openai
Cet endpoint accepte une requête avec un corps JSON pour interagir avec l'API OpenAI.

Corps de la requête (Request Body) :

{
  "type": "generateSubtasks" | "categorizeTask",
  "prompt": "Le texte de la tâche à analyser",
  "model": "gpt-4o-mini",
  "max_tokens": 150,
  "temperature": 0.7
}

type (requis) : Le type d'action à effectuer.

prompt (requis) : Le contenu textuel de la tâche.

model, max_tokens, temperature : Paramètres optionnels pour contrôler le comportement de l'IA.

Réponse (Response) :

En cas de succès, le serveur renvoie directement la réponse JSON de l'API d'OpenAI.

En cas d'erreur (clé API manquante, erreur de l'API OpenAI, etc.), il renvoie un objet JSON avec une clé error et potentiellement details.

⚙️ Installation et Lancement Local
Clonez le dépôt :

git clone https://github.com/Aurelien-D/ToDoList-IA-BackEnd.git

Naviguez dans le dossier du projet :

cd ToDoList-IA-BackEnd

Installez les dépendances :

npm install

Configuration de l'environnement :
Créez un fichier .env à la racine du projet et ajoutez votre clé API OpenAI :

OPENAI_API_KEY=sk-VotreCleApiIci

Lancez le serveur :

npm start

Le serveur sera alors accessible à l'adresse http://localhost:3001.

🛠️ Dépendances
Express.js : Framework web pour Node.js.

node-fetch : Permet de faire des requêtes fetch côté serveur.

cors : Middleware pour gérer les requêtes Cross-Origin Resource Sharing.

👨‍💻 Auteur
Aurélien DUJEUX - Aurelien-D sur GitHub