import * as yup from 'yup';

const contactSchema = yup.object().shape({
    name: yup.string().required("Le nom est obligatoire"),
    email: yup.string().email("Format d’email invalide").required("L’email est obligatoire"),
    message: yup.string().min(10, "Le message doit contenir au moins 10 caractères").required("Le message est obligatoire"),
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await contactSchema.validate(req.body); // Valide le corps de la requête avec le schéma Yup
            const { name, email, message } = req.body;
            console.log('Formulaire de contact reçu et validé:', { name, email, message });
            res.status(200).json({ message: 'Formulaire envoyé avec succès!' });
        } catch (error) {
            // Erreurs de validation Yup
            console.error('Erreur de validation:', error);
            res.status(400).json({ message: error.message }); // Envoie le message d’erreur de Yup au client
        }
    } else {
        res.status(405).json({ message: 'Méthode non autorisée' });
    }
}
