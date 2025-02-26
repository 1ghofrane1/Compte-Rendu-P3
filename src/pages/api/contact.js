import * as yup from 'yup';

// Définition du schéma de validation avec Yup
const contactSchema = yup.object().shape({
    name: yup.string().required("Le nom est obligatoire"), // Le champ "name" doit être une chaîne et est requis
    email: yup.string().email("Format d’email invalide").required("L’email est obligatoire"), // L'email doit être valide et obligatoire
    message: yup.string().min(10, "Le message doit contenir au moins 10 caractères").required("Le message est obligatoire"), // Le message doit contenir au moins 10 caractères
});

export default async function handler(req, res) {
    if (req.method === 'POST') { // Vérifie si la méthode de la requête est POST
        try {
            await contactSchema.validate(req.body); // Valide les données envoyées ( req.body) avec le schéma Yup

            // Si la validation est réussie, on récupère les données du formulaire
            const { name, email, message } = req.body;
            console.log('Formulaire de contact reçu et validé:', { name, email, message });
            // Réponse positive au client
            res.status(200).json({ message: 'Formulaire envoyé avec succès!' });

        } catch (error) {
            // Gestion des erreurs de validation
            console.error('Erreur de validation:', error);
            res.status(400).json({ message: error.message }); // Retourne l'erreur au client
        }
    } else {
        // Gestion des méthodes HTTP non autorisées (!= POST)
        res.status(405).json({ message: 'Méthode non autorisée' });
    }
}
