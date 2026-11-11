
import { useCallback, useEffect, useState, type FormEvent, type CSSProperties } from "react";
import { supabase } from "./lib/supabase";

type Page =
  | "Accueil"
  | "Nos services"
  | "Créer un compte"
  | "Connexion"
  | "Espace client"
  | "Demander un service"
  | "Suivi des demandes";

type ServiceRequest = {
  id: string;
  service_type: string;
  description: string;
  address: string;
  status: string;
  created_at: string;
};

const services = [
  "Nettoyage professionnel",
  "Buanderie et repassage",
  "Nettoyage après chantier",
  "Entretien des bâtiments",
  "Gestion des déchets",
  "Maintenance technique",
  "Électricité et plomberie",
  "Climatisation",
  "Supervision et contrôle",
];

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f3f6fb",
    color: "#172b4d",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    background: "#073b75",
    color: "white",
    padding: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  main: {
    maxWidth: "1000px",
    margin: "30px auto",
    padding: "20px",
  },
  card: {
    background: "white",
    padding: "22px",
    borderRadius: "12px",
    marginBottom: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  button: {
    background: "#0878c9",
    color: "white",
    border: "none",
    padding: "11px 16px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  secondaryButton: {
    background: "transparent",
    color: "white",
    border: "1px solid white",
    padding: "9px 13px",
    borderRadius: "7px",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginTop: "7px",
    marginBottom: "15px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px",
  },
  label: {
    display: "block",
    fontWeight: "bold",
  },
  message: {
    background: "#e7f2ff",
    color: "#073b75",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "15px",
  },
};

export default function App() {
  const [page, setPage] = useState<Page>("Accueil");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [service, setService] = useState(services[0]);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const client = supabase;

    if (!client) {
      setMessage("Connexion à Supabase impossible. Vérifiez la configuration.");
      return;
    }

    client.auth.getSession().then(({ data, error }) => {
      if (error) {
        setMessage(error.message);
        return;
      }
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadRequests = useCallback(async () => {
    const client = supabase;

    if (!client || !user) return;

    const { data, error } = await client
      .from("service_requests")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Erreur lors du chargement des demandes : " + error.message);
      return;
    }

    setRequests((data ?? []) as ServiceRequest[]);
  }, [user]);

  useEffect(() => {
    if (user) {
      void loadRequests();
    } else {
      setRequests([]);
    }
  }, [user, loadRequests]);

  async function authenticate(register: boolean) {
    const client = supabase;

    setMessage("");

    if (!client) {
      setMessage("Supabase n'est pas correctement configuré.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setMessage("Veuillez saisir votre adresse e-mail et votre mot de passe.");
      return;
    }

    if (password.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      if (register) {
        const { data, error } = await client.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          setMessage("Erreur de création du compte : " + error.message);
        } else if (data.session) {
          setUser(data.session.user);
          setMessage("Votre compte a été créé avec succès.");
          setPage("Espace client");
        } else {
          setMessage(
            "Votre inscription est enregistrée. Vérifiez votre boîte e-mail pour confirmer votre compte."
          );
        }
      } else {
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setMessage("Erreur de connexion : " + error.message);
        } else {
          setUser(data.user);
          setMessage("Connexion réussie.");
          setPage("Espace client");
        }
      }
    } catch (error) {
      setMessage("Erreur technique : " + String(error));
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    const client = supabase;

    if (!client) return;

    const { error } = await client.auth.signOut();

    if (error) {
      setMessage("Erreur de déconnexion : " + error.message);
      return;
    }

    setUser(null);
    setPage("Accueil");
    setMessage("Vous êtes déconnecté.");
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const client = supabase;

    if (!client || !user) {
      setMessage("Vous devez être connecté pour envoyer une demande.");
      return;
    }

    if (!description.trim() || !address.trim()) {
      setMessage("Veuillez remplir la description et l'adresse.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await client.from("service_requests").insert({
      client_id: user.id,
      service_type: service,
      description: description.trim(),
      address: address.trim(),
      status: "En attente",
    });

    setLoading(false);

    if (error) {
      setMessage("Impossible d'envoyer la demande : " + error.message);
      return;
    }

    setDescription("");
    setAddress("");
    setMessage("Votre demande a été envoyée avec succès.");
    setPage("Suivi des demandes");
    await loadRequests();
  }

  function goTo(nextPage: Page) {
    setMessage("");
    setPage(nextPage);
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>ÉCLAT SMART SERVICE</h2>
          <small>Nettoyage professionnel – Buanderie – Services techniques</small>
        </div>

        <nav style={styles.nav}>
          <button style={styles.secondaryButton} onClick={() => goTo("Accueil")}>
            Accueil
          </button>
          <button style={styles.secondaryButton} onClick={() => goTo("Nos services")}>
            Nos services
          </button>

          {user ? (
            <>
              <button style={styles.secondaryButton} onClick={() => goTo("Espace client")}>
                Mon espace
              </button>
              <button style={styles.secondaryButton} onClick={() => void logout()}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button style={styles.secondaryButton} onClick={() => goTo("Connexion")}>
                Connexion
              </button>
              <button style={styles.secondaryButton} onClick={() => goTo("Créer un compte")}>
                Créer un compte
              </button>
            </>
          )}
        </nav>
      </header>

      <main style={styles.main}>
        {message && <div style={styles.message}>{message}</div>}

        {page === "Accueil" && (
          <section style={styles.card}>
            <h1>Bienvenue chez ÉCLAT SMART SERVICE</h1>
            <p>
              Une plateforme pour accéder à des services professionnels de
              nettoyage, de buanderie, de maintenance et de gestion des déchets.
            </p>
            <button style={styles.button} onClick={() => goTo("Nos services")}>
              Découvrir nos services
            </button>
          </section>
        )}

        {page === "Nos services" && (
          <section>
            <h1>Nos services</h1>
            {services.map((item) => (
              <div key={item} style={styles.card}>
                <h3>{item}</h3>
                <button
                  style={styles.button}
                  onClick={() => {
                    setService(item);
                    goTo(user ? "Demander un service" : "Connexion");
                  }}
                >
                  Demander ce service
                </button>
              </div>
            ))}
          </section>
        )}

        {(page === "Créer un compte" || page === "Connexion") && (
          <section style={styles.card}>
            <h1>{page}</h1>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void authenticate(page === "Créer un compte");
              }}
            >
              <label style={styles.label}>Adresse e-mail</label>
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Votre adresse e-mail"
                required
              />

              <label style={styles.label}>Mot de passe</label>
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Au moins 6 caractères"
                minLength={6}
                required
              />

              <button style={styles.button} type="submit" disabled={loading}>
                {loading
                  ? "Veuillez patienter..."
                  : page === "Créer un compte"
                    ? "Créer mon compte"
                    : "Me connecter"}
              </button>
            </form>

            <p>
              {page === "Créer un compte" ? "Vous avez déjà un compte ?" : "Vous n'avez pas encore de compte ?"}
            </p>

            <button
              style={styles.button}
              onClick={() =>
                goTo(page === "Créer un compte" ? "Connexion" : "Créer un compte")
              }
            >
              {page === "Créer un compte" ? "Se connecter" : "Créer un compte"}
            </button>
          </section>
        )}

        {page === "Espace client" && (
          <section style={styles.card}>
            <h1>Espace client</h1>
            {user ? (
              <>
                <p>Vous êtes connecté avec : {user.email}</p>
                <button
                  style={styles.button}
                  onClick={() => goTo("Demander un service")}
                >
                  Faire une demande
                </button>
                <button
                  style={{ ...styles.button, marginLeft: "8px" }}
                  onClick={() => goTo("Suivi des demandes")}
                >
                  Suivre mes demandes
                </button>
              </>
            ) : (
              <>
                <p>Connectez-vous pour accéder à votre espace client.</p>
                <button style={styles.button} onClick={() => goTo("Connexion")}>
                  Se connecter
                </button>
              </>
            )}
          </section>
        )}

        {page === "Demander un service" && (
          <section style={styles.card}>
            <h1>Demander un service</h1>

            {!user ? (
              <>
                <p>Vous devez vous connecter avant de faire une demande.</p>
                <button style={styles.button} onClick={() => goTo("Connexion")}>
                  Se connecter
                </button>
              </>
            ) : (
              <form onSubmit={submitRequest}>
                <label style={styles.label}>Service souhaité</label>
                <select
                  style={styles.input}
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                >
                  {services.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <label style={styles.label}>Adresse d'intervention</label>
                <input
                  style={styles.input}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Commune, quartier, avenue..."
                  required
                />

                <label style={styles.label}>Description de votre besoin</label>
                <textarea
                  style={{ ...styles.input, minHeight: "110px" }}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Décrivez le service dont vous avez besoin..."
                  required
                />

                <button style={styles.button} type="submit" disabled={loading}>
                  {loading ? "Envoi en cours..." : "Envoyer ma demande"}
                </button>
              </form>
            )}
          </section>
        )}

        {page === "Suivi des demandes" && (
          <section>
            <h1>Suivi de mes demandes</h1>

            {!user ? (
              <div style={styles.card}>
                <p>Connectez-vous pour consulter vos demandes.</p>
                <button style={styles.button} onClick={() => goTo("Connexion")}>
                  Se connecter
                </button>
              </div>
            ) : requests.length === 0 ? (
              <div style={styles.card}>
                <p>Vous n'avez pas encore de demande enregistrée.</p>
                <button
                  style={styles.button}
                  onClick={() => goTo("Demander un service")}
                >
                  Faire une demande
                </button>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} style={styles.card}>
                  <h3>{request.service_type}</h3>
                  <p><strong>Description :</strong> {request.description}</p>
                  <p><strong>Adresse :</strong> {request.address}</p>
                  <p><strong>Statut :</strong> {request.status}</p>
                  <small>
                    {request.created_at
                      ? new Date(request.created_at).toLocaleString("fr-FR")
                      : ""}
                  </small>
                </div>
              ))
            )}
          </section>
        )}
      </main>

      <footer
        style={{
          background: "#073b75",
          color: "white",
          textAlign: "center",
          padding: "20px",
        }}
      >
        © {new Date().getFullYear()} ÉCLAT SMART SERVICE — Tous droits réservés.
      </footer>
    </div>
  );
}
