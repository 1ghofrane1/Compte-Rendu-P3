// Import de fs.promises pour gérer les fichiers
import { promises as fs } from 'fs';
// Import de path pour définir un chemin correct
import path from 'path';

// Définition du chemin du fichier authors.json qui stocke les auteurs
const dataFilePath = path.join(process.cwd(), 'data', 'authors.json');

//readAuthorsData: lire les données du fichier authors.json
//@returns {Array} Liste des auteurs sous forme de tableau JSON
async function readAuthorsData() {
  const data = await fs.readFile(dataFilePath, 'utf8'); // Lecture du fichier
  return JSON.parse(data); // Conversion du JSON en objet JavaScript (string) 
}

/*
 * writeAuthorsData: écrire des données dans le fichier authors.json
 * @param {Array} authors - Tableau des auteurs mis à jour
 */
async function writeAuthorsData(authors) {
  await fs.writeFile(dataFilePath, JSON.stringify(authors, null, 2)); // Écriture des données formatées en JSON
}

/*
 * Gestionnaire API Next.js pour récupérer ou ajouter des auteurs
 * @param {Object} req - Objet de requête HTTP
 * @param {Object} res - Objet de réponse HTTP
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Si la requête = GET => on retourne la liste des auteurs
    const authors = await readAuthorsData();
    res.status(200).json(authors);

  } else if (req.method === 'POST') {
    // Si la requête = POST => on ajoute un nouvel auteur
    const { name } = req.body;

    // Validation des données envoyées (nom obligatoire)
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Le nom de l\'auteur est obligatoire.' });
    }

    try {
      // Lecture des auteurs existants
      const authors = await readAuthorsData();

      // Création d'un nouvel auteur avec un ID unique
      const newAuthor = { id: Date.now(), name };
      authors.push(newAuthor);

      // Sauvegarde de la nouvelle liste des auteurs
      await writeAuthorsData(authors);

      // Réponse avec le nouvel auteur ajouté (Code 201 : Created)
      res.status(201).json(newAuthor);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'auteur :', error);
      res.status(500).json({ message: 'Erreur serveur lors de l\'ajout de l\'auteur.' });
    }
  } else {
    // Toute autre méthode HTTP est refusée
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
