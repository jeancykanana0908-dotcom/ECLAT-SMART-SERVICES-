import { useState } from 'react';

export default function App() {
  const [page, setPage] = useState('Accueil');

  const services = [
    'Nettoyage professionnel',
    'Buanderie et repassage',
    'Nettoyage après chantier',
    'Entretien des bâtiments',
    'Électricité et plomberie',
    'Climatisation',
    'Gestion des déchets'
  ];

  return (
    <div>
      <header>
        <h1>ÉCLAT SMART SERVICE</h1>
        <p>Votre partenaire en services professionnels</p>
        <nav>
          <button onClick={() => setPage('Accueil')}>Accueil</button>
          <button onClick={() => setPage('Services')}>Services</button>
          <button onClick={() => setPage('Contact')}>Contact</button>
        </nav>
      </header>

      <main>
        {page === 'Accueil' && (
          <>
            <h2>Bienvenue chez ÉCLAT SMART SERVICE</h2>
            <p>
              Une plateforme numérique pour simplifier la gestion
              des services de nettoyage, buanderie et maintenance technique.
            </p>
            <button onClick={() => setPage('Services')}>
              Découvrir nos services
            </button>
          </>
        )}

        {page === 'Services' && (
          <>
            <h2>Nos services</h2>
            {services.map((service) => (
              <p key={service}>✓ {service}</p>
            ))}
          </>
        )}

        {page === 'Contact' && (
          <>
            <h2>Contactez ÉCLAT</h2>
            <p>Téléphone : +243 82 63 76 860</p>
            <p>Email : Infoeclatproservice@gmail.com</p>
            <p>Zone d'intervention : Kinshasa</p>
          </>
        )}
      </main>

      <footer>
        <p>© 2026 ÉCLAT SMART SERVICE</p>
      </footer>
    </div>
  );
}
