import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

type Page =
  | "Accueil"
  | "Nos services"
  | "Demander un service"
  | "Suivi des demandes"
  | "Espace client"
  | "Espace agent"
  | "Administration"
  | "Paiements"
  | "Rapports";

export default function App() {
  const [page, setPage] = useState<Page>("Accueil");
  const [menuOpen, setMenuOpen] = useState(false);
  const [requests, setRequests] = useState<string[]>([]);
  const [message, setMessage] = useState("");
const [user, setUser] = useState<any>(null);
const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
const [authEmail, setAuthEmail] = useState("");
const [authPassword, setAuthPassword] = useState("");
const [authName, setAuthName] = useState("");
const [authPhone, setAuthPhone] = useState("");
  useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setUser(data.session?.user ?? null);
    setAuthLoading(false);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "Nettoyage professionnel",
    address: "",
    details: ""
  });

  const menu: Page[] = [
    async function handleAuth(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setMessage("");

  if (authMode === "register") {
    const { error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
      options: {
        data: {
          full_name: authName,
          phone: authPhone
        }
      }
    });

    if (error) {
      setMessage("Erreur d'inscription : " + error.message);
      return;
    }

    setMessage("Inscription réussie. Vérifiez votre e-mail si une confirmation est demandée.");
  } else {
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword
    });

    if (error) {
      setMessage("Erreur de connexion : " + error.message);
      return;
    }

    setMessage("Connexion réussie.");
  }

  setAuthPassword("");
    }
    "Accueil",
    "Nos services",
    "Demander un service",
    "Suivi des demandes",
    "Espace client",
    "Espace agent",
    "Administration",
    "Paiements",
    "Rapports"
  ];

  const services = [
    {
      name: "Nettoyage professionnel",
      description: "Nettoyage de bureaux, maisons, immeubles et bâtiments."
    },
    {
      name: "Buanderie et repassage",
      description: "Lavage, séchage, repassage et entretien du linge."
    },
    {
      name: "Gestion des déchets",
      description: "Collecte et gestion responsable des déchets."
    },
    {
      name: "Maintenance technique",
      description: "Électricité, plomberie et climatisation."
    },
    {
      name: "Nettoyage après chantier",
      description: "Remise en état des locaux après travaux."
    },
    {
      name: "Supervision et contrôle",
      description: "Suivi de la qualité et contrôle des prestations."
    }
  ];

  function submitRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const reference = "ECLAT-" + Date.now().toString().slice(-6);

    setRequests([...requests, reference]);
    setMessage("Demande enregistrée sur cette session. Référence : " + reference);

    setForm({
      name: "",
      phone: "",
      service: "Nettoyage professionnel",
      address: "",
      details: ""
    });
  }

  function navigate(item: Page) {
    setPage(item);
    setMenuOpen(false);
    setMessage("");
  }

  return (
    <div className="app">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, sans-serif; background: #f3f6fa; color: #263445; }
        .app { min-height: 100vh; }
        header { background: #0b4f8a; color: white; padding: 22px 5%; }
        .top { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; }
        .brand h1 { margin: 0; font-size: 25px; }
        .brand p { margin: 6px 0 0; font-size: 13px; }
        .menu-button { display: none; background: white; color: #0b4f8a; border: 0; padding: 10px 15px; border-radius: 6px; font-weight: bold; }
        nav { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 22px; }
        nav button { background: transparent; color: white; border: 1px solid #ffffff66; padding: 10px 13px; border-radius: 5px; cursor: pointer; }
        nav button.active, nav button:hover { background: white; color: #0b4f8a; }
        main { max-width: 1150px; margin: auto; padding: 35px 20px; }
        .hero { background: white; border-radius: 12px; padding: 40px 25px; border-left: 5px solid #0b4f8a; }
        .hero h2 { font-size: 30px; color: #0b4f8a; margin-top: 0; }
        .hero p { line-height: 1.7; }
        .primary { background: #0b4f8a; color: white; border: 0; border-radius: 6px; padding: 13px 20px; cursor: pointer; font-weight: bold; }
        .secondary { background: white; color: #0b4f8a; border: 1px solid #0b4f8a; border-radius: 6px; padding: 12px 18px; cursor: pointer; }
        .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 18px; margin-top: 25px; }
        .card { background: white; padding: 22px; border-radius: 10px; box-shadow: 0 2px 9px #0000000c; }
        .card h3 { color: #0b4f8a; margin-top: 0; }
        .section-title { color: #0b4f8a; margin-bottom: 10px; }
        .form-box { background: white; padding: 25px; border-radius: 10px; max-width: 650px; }
        label { display: block; font-weight: bold; margin: 15px 0 7px; }
        input, select, textarea { width: 100%; padding: 12px; border: 1px solid #ccd5df; border-radius: 5px; font-size: 15px; }
        textarea { min-height: 90px; resize: vertical; }
        .notice { background: #e4f5e9; color: #176b35; padding: 14px; border-radius: 6px; margin: 15px 0; overflow-wrap: anywhere; }
        .number { font-size: 28px; color: #0b4f8a; font-weight: bold; }
        footer { background: #103b60; color: white; text-align: center; padding: 22px; margin-top: 35px; }
        .muted { color: #667789; line-height: 1.6; }
        @media(max-width: 700px) {
          .menu-button { display: block; }
          nav { display: none; flex-direction: column; }
          nav.open { display: flex; }
          nav button { text-align: left; }
          .hero { padding: 27px 18px; }
          .hero h2 { font-size: 24px; }
          main { padding: 22px 14px; }
        }
      `}</style>

      <header>
        <div className="top">
          <div className="brand">
            <h1>ÉCLAT SMART SERVICES</h1>
            <p>Nettoyage professionnel • Buanderie • Maintenance • Services divers</p>
          </div>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰ Menu
          </button>
        </div>

        <nav className={menuOpen ? "open" : ""}>
          {menu.map((item) => (
            <button
              key={item}
              className={page === item ? "active" : ""}
              onClick={() => navigate(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {message && <div className="notice">{message}</div>}

        {page === "Accueil" && (
          <>
            <section className="hero">
              <h2>Bienvenue chez ÉCLAT SMART SERVICES</h2>
              <p>
                Une plateforme numérique dédiée à la gestion des services
                professionnels, au suivi des prestations et à la satisfaction
                des clients.
              </p>
              <button
                className="primary"
                onClick={() => navigate("Demander un service")}
              >
                Demander une prestation
              </button>
            </section>

            <h2 className="section-title">Nos domaines d'intervention</h2>
            <div className="cards">
              {services.slice(0, 3).map((service) => (
                <div className="card" key={service.name}>
                  <h3>{service.name}</h3>
                  <p className="muted">{service.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {page === "Nos services" && (
          <>
            <h2 className="section-title">Nos services</h2>
            <p className="muted">
              Découvrez les prestations proposées par ÉCLAT SMART SERVICES.
            </p>
            <div className="cards">
              {services.map((service) => (
                <div className="card" key={service.name}>
                  <h3>{service.name}</h3>
                  <p className="muted">{service.description}</p>
                  <button
                    className="secondary"
                    onClick={() => {
                      setForm({ ...form, service: service.name });
                      navigate("Demander un service");
                    }}
                  >
                    Choisir ce service
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {page === "Demander un service" && (
          <>
            <h2 className="section-title">Demander une prestation</h2>
            <p className="muted">
              Remplissez les informations pour préparer votre demande.
            </p>

            <form className="form-box" onSubmit={submitRequest}>
              <label>Nom complet</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Votre nom"
              />

              <label>Numéro de téléphone</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+243..."
              />

              <label>Service souhaité</label>
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
              >
                {services.map((service) => (
                  <option key={service.name}>{service.name}</option>
                ))}
              </select>

              <label>Adresse de prestation</label>
              <input
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Commune, quartier, avenue..."
              />

              <label>Description de la demande</label>
              <textarea
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                placeholder="Décrivez votre besoin..."
              />

              <button className="primary" type="submit">
                Envoyer la demande
              </button>
            </form>
          </>
        )}

        {page === "Suivi des demandes" && (
          <>
            <h2 className="section-title">Suivi des demandes</h2>
            <div className="card">
              <h3>Mes demandes de cette session</h3>
              {requests.length === 0 ? (
                <p className="muted">Aucune demande enregistrée pour le moment.</p>
              ) : (
                requests.map((ref) => (
                  <p key={ref}>Référence : {ref} — En attente de traitement</p>
                ))
              )}
              <p className="muted">
                Le suivi permanent sera activé après connexion à Supabase.
              </p>
            </div>
          </>
        )}

        {page === "Espace client" && (
          <>
            <h2 className="section-title">Espace client</h2>
            <div className="card">
              <h3>Bienvenue dans votre espace client</h3>
              <p className="muted">
                Cet espace permettra aux clients de consulter leur profil,
                leurs demandes, leurs prestations et leur historique.
              </p>
              <button
                className="primary"
                onClick={() => navigate("Demander un service")}
              >
                Faire une demande
              </button>
            </div>
          </>
        )}

        {page === "Espace agent" && (
          <>
            <h2 className="section-title">Espace agent</h2>
            <div className="cards">
              <div className="card">
                <h3>Mes missions</h3>
                <p className="muted">Consultation des interventions attribuées.</p>
              </div>
              <div className="card">
                <h3>Mes interventions</h3>
                <p className="muted">Suivi des prestations en cours et terminées.</p>
              </div>
              <div className="card">
                <h3>Mes rapports</h3>
                <p className="muted">Transmission des comptes rendus de travail.</p>
              </div>
            </div>
          </>
        )}

        {page === "Administration" && (
          <>
            <h2 className="section-title">Administration</h2>
            <p className="muted">
              Tableau de bord de gestion de la plateforme.
            </p>
            <div className="cards">
              {[
                "Demandes clients",
                "Interventions",
                "Clients et agents",
                "Équipes"
              ].map((item) => (
                <div className="card" key={item}>
                  <h3>{item}</h3>
                  <p className="number">—</p>
                  <p className="muted">Données à connecter</p>
                </div>
              ))}
            </div>
          </>
        )}

        {page === "Paiements" && (
          <>
            <h2 className="section-title">Paiements</h2>
            <div className="card">
              <h3>Paiements Mobile Money</h3>
              <p className="muted">
                Espace prévu pour le suivi des paiements et l'intégration
                des solutions Mobile Money.
              </p>
              <p>Statut : intégration à effectuer.</p>
            </div>
          </>
        )}

        {page === "Rapports" && (
          <>
            <h2 className="section-title">Rapports et statistiques</h2>
            <div className="cards">
              <div className="card">
                <h3>Activités</h3>
                <p className="muted">Suivi des prestations réalisées.</p>
              </div>
              <div className="card">
                <h3>Performance</h3>
                <p className="muted">Contrôle de la qualité des services.</p>
              </div>
              <div className="card">
                <h3>Finances</h3>
                <p className="muted">Suivi des paiements et recettes.</p>
              </div>
            </div>
          </>
        )}
      </main>

      <footer>
        <strong>ÉCLAT SMART SERVICES</strong>
        <p>Qualité • Rapidité • Fiabilité • Satisfaction client</p>
        <small>© 2026 ÉCLAT SMART SERVICES</small>
      </footer>
    </div>
  );
}
