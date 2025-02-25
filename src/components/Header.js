import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import cn from 'classnames';
import { useForm } from 'react-hook-form';

const Header = ({ className }) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/contact', label: 'Contact' }
  ];

  const [authors, setAuthors] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [addAuthorError, setAddAuthorError] = useState(null);

  useEffect(() => {
    async function fetchAuthors() {
      try {
        const response = await fetch('/api/authors');
        const data = await response.json();
        setAuthors(data);
      } catch (e) {
        console.error('Erreur lors de la récupération des auteurs', e);
      }
    }
    fetchAuthors();
  }, []);

  const handleAddAuthor = async (data) => {
    setAddAuthorError(null);
    try {
      const response = await fetch('/api/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Envoie { name: authorName }
      });

      if (response.ok) {
        const newAuthor = await response.json();
        setAuthors((prevAuthors) => [...prevAuthors, newAuthor]); // Met à jour la liste des auteurs
        reset(); // Réinitialise l'input
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
        {appName}

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

        {addAuthorError && <p className={styles.addAuthorError}>{addAuthorError}</p>}
      </nav>
    </header>
  );
};

export default Header;
