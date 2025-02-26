import Header from '@/components/Header';
import styles from '../styles/Home.module.css';

export default function HomePage() {
  return (
    <div>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>
          Bienvenue à la Séance sur les API Routes et les Formulaires!
        </h1>
        <p className={styles.description}>
          Cette séance pratique vous guidera à travers la création d'API Routes avec Next.js et la gestion de formulaires complexes en React.
        </p>
      </main>
    </div>
  );
}
