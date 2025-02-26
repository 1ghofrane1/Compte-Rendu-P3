import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import cn from 'classnames';
import { useForm } from 'react-hook-form';

const Header = ({ className }) => {
  // recuperation du nom de l'app depuis les variables d'environnement
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  // definition des elements de navigation dans le menu 
  const navItems = [
    { href: '/', label: 'Accueil' }, // lien vers la page d'acceuil
    { href: '/contact', label: 'Contact' } // lien vers la page de contact 
  ];

  // etat pour stocker la liste des auteurs recuperés depuis l'API
  const [authors, setAuthors] = useState([]);
  // gestion du formulaire avec react-hook-form (useForm)
  const { register, handleSubmit, reset } = useForm();

  //etat pour stocker les erreurs lors de l'ajout d'un auteur
  const [addAuthorError, setAddAuthorError] = useState(null);

  // on utilise useEffect pour la recuperation des auteurs une seule fois au chargement du composant
  useEffect(() => {
    async function fetchAuthors() {
      try {
        const response = await fetch('/api/authors');// appel à l'API Next.js pour recuperer les auteurs 
        const data = await response.json();
        setAuthors(data); // update l'etat avec la liste des auteurs récupérés
      } catch (e) {
        console.error('Erreur lors de la récupération des auteurs', e);
      }
    }
    fetchAuthors();
  }, []);

  // handleAddAuthor: pour la gestion d'un nouvel auteur via le formulaire 
  const handleAddAuthor = async (data) => {
    setAddAuthorError(null); // Réinitialisation de l'erreur avant la soumission 
    try {
      const response = await fetch('/api/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Envoie { name: authorName } ( sous format JSON )
      });

      if (response.ok) {
        const newAuthor = await response.json();
        setAuthors((prevAuthors) => [...prevAuthors, newAuthor]); // Ajout du nouvel auteur à la liste affichée
        reset(); // Réinitialise l'input apres un ajout réussi
      } else {
        const errorData = await response.json();
        setAddAuthorError(errorData.message || 'Erreur lors de l’ajout de l’auteur.');
      }
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’auteur :', error);
      setAddAuthorError('Erreur de connexion au serveur.');
    }
  };

  return (
    <header className={cn(styles.header, className)}>
      <nav className={styles.nav}>
        {/*affichage du nom de l'app*/}
        {appName}

        {/* Boucle sur les éléments de navigation pour les afficher dynamiquement */}
        {navItems.map((item) => (
          <Link href={item.href} key={item.href} className={styles.link}>
            {item.label}
          </Link>
        ))}

        {authors.length > 0 && (
          <div className={styles.authors}>
            Auteurs :{' '}
            {authors.map((author) => (
              <span key={author.id} className={styles.author}>
                {author.name}
              </span>
            ))}
          </div>
        )}

        {/* Formulaire pour ajouter un nouvel auteur */}
        <form onSubmit={handleSubmit(handleAddAuthor)} className={styles.addAuthorForm}>
          <input
            type="text"
            {...register('name')}
            placeholder="Nom de l’auteur"
            className={styles.authorInput}
          />
          <button type="submit" className={styles.addAuthorButton}>
            Ajouter Auteur
          </button>
        </form>

        {/* Affichage des erreurs en cas d'échec de l'ajout d'un auteur */}
        {addAuthorError && <p className={styles.addAuthorError}>{addAuthorError}</p>}
      </nav>
    </header>
  );
};

export default Header;
