import React, { useState } from 'react'; // Import useState
import Header from '@/components/Header';
import styles from './contact.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const contactSchemaClient = yup.object().shape({ // Schéma Yup identique au serveur pour la validation client
    name: yup.string().required("Le nom est obligatoire"),
    email: yup.string().email("Format d’email invalide").required("L’email est obligatoire"),
    message: yup.string().min(10, "Le message doit contenir au moins 10 caractères").required("Le message est obligatoire"),
});

const ContactPage = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(contactSchemaClient), // Intégration de Yup pour la validation client
    });
    const [apiError, setApiError] = useState(null); // État pour les erreurs de l’API

    const onSubmit = async (data) => {
        setApiError(null); // Réinitialise l’erreur API au début de la soumission
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const res = await response.json();
            if (response.ok) {
                alert(res.message);
                reset(); // Réinitialise le formulaire seulement en cas de succès
            } else {
                // Erreur de l’API (validation serveur ou autre)
                setApiError(res.message || 'Une erreur inconnue est survenue.');
            }
        } catch (e) {
            console.error("Erreur lors de l’envoi du formulaire :", e);
            setApiError('Erreur de connexion au serveur.'); // Erreur de réseau ou autre
        }
    };

    return (
        <div>
            <Header/>
            <h1>Contactez-nous</h1>
            {apiError && <p className={styles.apiError}>{apiError}</p>} {/* Affichage de l’erreur API si présente */}
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <label htmlFor="name" className={styles.label}>Nom :</label>
                <input type="text" id="name" className={styles.input} {...register("name")} />
                {errors.name && <p className={styles.error}>{errors.name.message}</p>}

                <label htmlFor="email" className={styles.label}>Email :</label>
                <input type="email" id="email" className={styles.input} {...register("email")} />
                {errors.email && <p className={styles.error}>{errors.email.message}</p>}

                <label htmlFor="message" className={styles.label}>Message :</label>
                <textarea id="message" className={styles.textarea} {...register("message")} />
                {errors.message && <p className={styles.error}>{errors.message.message}</p>}

                <button type="submit" className={styles.button}>Envoyer</button>
            </form>
        </div>
    );
};

export default ContactPage;