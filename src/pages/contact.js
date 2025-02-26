import React, { useState } from 'react'; // Import de useState pour gérer l'état du composant
import Header from '@/components/Header'; // Import du composant Header
import styles from './contact.module.css'; // Import du fichier CSS pour le style
import { useForm } from 'react-hook-form'; // Import de useForm pour la gestion des formulaires
import { yupResolver } from '@hookform/resolvers/yup'; // Import du resolver Yup pour la validation avec react-hook-form
import * as yup from 'yup'; // Import de Yup pour la validation des données

// 📌 Définition du schéma de validation Yup (côté client)
// Ce schéma impose des règles pour vérifier les données saisies par l'utilisateur avant de soumettre le formulaire
const contactSchemaClient = yup.object().shape({
    name: yup.string().required("Le nom est obligatoire"), // Le champ "name" est obligatoire
    email: yup.string().email("Format d’email invalide").required("L’email est obligatoire"), // L'email doit être valide et obligatoire
    message: yup.string().min(10, "Le message doit contenir au moins 10 caractères").required("Le message est obligatoire"), // Le message doit contenir au moins 10 caractères
});

// 📌 Définition du composant principal ContactPage
const ContactPage = () => {
    // Configuration du formulaire avec react-hook-form et intégration de Yup pour la validation
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(contactSchemaClient), // Utilisation du schéma Yup pour la validation
    });

    const [apiError, setApiError] = useState(null); // État pour stocker les erreurs renvoyées par l’API

    // 📌 Fonction exécutée lors de la soumission du formulaire
    const onSubmit = async (data) => {
        setApiError(null); // Réinitialisation de l’erreur API au début de la soumission

        try {
            // Envoi des données au serveur via une requête POST vers l'API Next.js
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // Conversion des données en JSON avant l'envoi
            });

            const res = await response.json(); // Extraction de la réponse sous forme de JSON

            if (response.ok) { // Si la requête est réussie
                alert(res.message); // Affiche une alerte avec le message de succès
                reset(); // Réinitialise le formulaire après une soumission réussie
            } else {
                // Si une erreur est renvoyée par l'API (exp: validation côté serveur)
                setApiError(res.message || 'Une erreur inconnue est survenue.');
            }
        } catch (e) {
            // Si une erreur réseau survient
            console.error("Erreur lors de l’envoi du formulaire :", e);
            setApiError('Erreur de connexion au serveur.'); // Affiche un message d'erreur réseau
        }
    };

    return (
        <div>
            <Header/> {/* Affichage du composant Header */}
            <h1>Contactez-nous</h1>

            {/* Affichage de l’erreur API si une erreur survient */}
            {apiError && <p className={styles.apiError}>{apiError}</p>}

            {/* 📌 Formulaire de contact */}
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                {/* Champ Nom */}
                <label htmlFor="name" className={styles.label}>Nom :</label>
                <input type="text" id="name" className={styles.input} {...register("name")} />
                {errors.name && <p className={styles.error}>{errors.name.message}</p>} {/* Affichage des erreurs de validation */}

                {/* Champ Email */}
                <label htmlFor="email" className={styles.label}>Email :</label>
                <input type="email" id="email" className={styles.input} {...register("email")} />
                {errors.email && <p className={styles.error}>{errors.email.message}</p>} {/* Affichage des erreurs de validation */}

                {/* Champ Message */}
                <label htmlFor="message" className={styles.label}>Message :</label>
                <textarea id="message" className={styles.textarea} {...register("message")} />
                {errors.message && <p className={styles.error}>{errors.message.message}</p>} {/* Affichage des erreurs de validation */}

                {/* Bouton de soumission */}
                <button type="submit" className={styles.button}>Envoyer</button>
            </form>
        </div>
    );
};

export default ContactPage;
