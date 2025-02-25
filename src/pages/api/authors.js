import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(),'', 'authors.json');

async function readAuthorsData() {
  const data = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(data);
}

async function writeAuthorsData(authors) {
  await fs.writeFile(dataFilePath, JSON.stringify(authors, null, 2));
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const authors = await readAuthorsData();
    res.status(200).json(authors);
  } else if (req.method === 'POST') {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Le nom de l\'auteur est obligatoire.' });
    }

    try {
      const authors = await readAuthorsData();
      const newAuthor = { id: Date.now(), name }; // Simple ID generation
      authors.push(newAuthor);
      await writeAuthorsData(authors);
      res.status(201).json(newAuthor); // Réponse 201 Created avec le nouvel auteur
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'auteur :', error);
      res.status(500).json({ message: 'Erreur serveur lors de l\'ajout de l\'auteur.' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}