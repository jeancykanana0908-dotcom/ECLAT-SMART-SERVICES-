
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

type Page =
  | "Accueil"
  | "Nos services"
  | "Demander un service"
  | "Suivi des demandes"
  | "Espace client"
  | "Administration";

const services = [
  "Nettoyage professionnel",
  "Buanderie et repassage",
  "Nettoyage après chantier",
  "Entretien des bâtiments",
  "Électricité et plomberie",
  "Climatisation",
  "Gestion des déchets",
  "Supervision et contrôle",
  "Maintenance technique",
];

type Request = {
  id: string;
  service: string;
  customer_type: string;
  address: string;
  requested_date: string | null;
  description: string | null;
  status: string;
};

export default function App() {
  const [page, setPage] = useState<Page>("Accueil");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [service, setService] = useState(services[0]);
  const [customerType, setCustomerType] = useState("Particulier");
  const [address, setAddress] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signUp() {
    if (!email || !password) {
      setMessage("Veuillez remplir votre adresse e-mail et votre mot de passe.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Inscription effectuée. Vérifiez votre e-mail si une confirmation est demandée."
      );
    }
  }

  async function signIn() {
    if (!email || !password) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Connexion réussie.");
      setPage("Espace client");
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(error.message);
    } else {
      setUser(null);
      setRequests([]);
      setPage("Accueil");
      setMessage("Vous êtes déconnecté.");
    }
  }

  async function submitRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      setMessage("Connectez-vous avant d'envoyer une demande.");
      setPage("Espace client");
      return;
    }

    if (!address.trim()) {
      setMessage("Veuillez renseigner votre adresse.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("service_requests").insert({
      client_id: user.id,
      service,
      customer_type: customerType,
      address,
      requested_date: requestedDate || null,
      description,
      status: "En attente",
    });

    setLoading(false);

    if (error) {
      setMessage("Erreur lors de l'envoi : " + error.message);
    } else {
      setMessage("Votre demande a été envoyée avec succès.");
      setAddress("");
      setRequestedDate("");
      setDescription("");
      setPage("Suivi des demandes");
      loadRequests();
    }
  }

  async function loadRequests() {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("service_requests")
      .select("*")
      .eq("client_id", user.id)
      .order("requested_date", { ascending: false });

    setLoading(false);

    if (error) {
      setMessage("Impossible de charger les demandes : " + error.message);
    } else {
      setRequests((data || []) as Request[]);
    }
  }

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const buttonStyle: React.CSSProperties = {
    padding: "12px 18px",
    background: "#07569b",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    margin: "5px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    margin: "8px 0 15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#263445" }}>
      <header
        style={{
          background: "#07569b",
          color: "white",
          padding: "30px 15px",
          textAlign: "center",
        }}
      >
        <h1>ÉCLAT SMART SERVICE</h1>
        <p>Nettoyage professionnel, buanderie et services divers</p>
        <p>Qualité - Rapidité - Fiabilité - Satisfaction client</p>
      </header>

      <nav
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "12px",
          background: "#eaf1f8",
        }}
      >
        {(
          [
            "Accueil",
            "Nos services",
            "Demander un service",
            "Suivi des demandes",
            "Espace client",
            "Administration",
          ] as Page[]
        ).map((item) => (
          <button
            key={item}
            style={buttonStyle}
            onClick={() => {
              setMessage("");
              setPage(item);
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: "1000px", margin: "auto", padding: "25px 18px" }}>
        {message && (
          <div
            style={{
              padding: "12px",
              marginBottom: "18px",
              background: "#eaf1f8",
              borderRadius: "6px",
            }}
          >
            {message}
          </div>
        )}

        {page === "Accueil" && (
          <section>
            <h2>Bienvenue chez ÉCLAT SMART SERVICE</h2>
            <p>
              Une solution intégrée pour le nettoyage professionnel,
              la buanderie, la maintenance technique et les services divers.
            </p>
            <p>
              Nous accompagnons les particuliers, les entreprises et
              les institutions à Kinshasa.
            </p>
            <button
              style={buttonStyle}
              onClick={() => setPage("Demander un service")}
            >
              Demander une intervention
            </button>
          </section>
        )}

        {page === "Nos services" && (
          <section>
            <h2>Nos services</h2>
            {services.map((item) => (
              <div
                key={item}
                style={{
                  padding: "15px",
                  margin: "10px 0",
                  background: "#f1f5f9",
                  borderRadius: "6px",
                }}
              >
                {item}
              </div>
            ))}
          </section>
        )}

        {page === "Demander un service" && (
          <section>
            <h2>Demander un service</h2>

            {!user ? (
              <p>
                Vous devez vous connecter dans votre espace client
                avant d'envoyer une demande.
              </p>
            ) : (
              <form onSubmit={submitRequest}>
                <label>Service demandé</label>
                <select
                  style={inputStyle}
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  {services.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <label>Type de client</label>
                <select
                  style={inputStyle}
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                >
                  <option>Particulier</option>
                  <option>Entreprise</option>
                  <option>Institution</option>
                </select>

                <label>Adresse de l'intervention</label>
                <input
                  style={inputStyle}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Votre adresse à Kinshasa"
                  required
                />

                <label>Date souhaitée</label>
                <input
                  style={inputStyle}
                  type="date"
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                />

                <label>Description de la demande</label>
                <textarea
                  style={inputStyle}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez le service souhaité..."
                  rows={5}
                />

                <button style={buttonStyle} disabled={loading}>
                  {loading ? "Envoi en cours..." : "Envoyer ma demande"}
                </button>
              </form>
            )}
          </section>
        )}

        {page === "Suivi des demandes" && (
          <section>
            <h2>Suivi de vos demandes</h2>

            {!user ? (
              <p>Connectez-vous pour consulter vos demandes.</p>
            ) : (
              <>
                <button style={buttonStyle} onClick={loadRequests}>
                  Actualiser
                </button>

                {requests.length === 0 ? (
                  <p>Aucune demande enregistrée pour le moment.</p>
                ) : (
                  requests.map((request) => (
                    <div
                      key={request.id}
                      style={{
                        padding: "15px",
                        margin: "12px 0",
                        border: "1px solid #ddd",
                        borderRadius: "7px",
                      }}
                    >
                      <h3>{request.service}</h3>
                      <p>Adresse : {request.address}</p>
                      <p>Client : {request.customer_type}</p>
                      <p>Date : {request.requested_date || "Non définie"}</p>
                      <p>Description : {request.description || "Aucune"}</p>
                      <strong>Statut : {request.status}</strong>
                    </div>
                  ))
                )}
              </>
            )}
          </section>
        )}

        {page === "Espace client" && (
          <section>
            <h2>Espace client</h2>

            {user ? (
              <>
                <p>Connecté avec : {user.email}</p>
                <button
                  style={buttonStyle}
                  onClick={() => setPage("Demander un service")}
                >
                  Nouvelle demande
                </button>
                <button
                  style={buttonStyle}
                  onClick={() => setPage("Suivi des demandes")}
                >
                  Mes demandes
                </button>
                <button style={buttonStyle} onClick={signOut}>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <h3>Connexion</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    signIn();
                  }}
                >
                  <label>Adresse e-mail</label>
                  <input
                    style={inputStyle}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <label>Mot de passe</label>
                  <input
                    style={inputStyle}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button style={buttonStyle} disabled={loading}>
                    Se connecter
                  </button>
                  <button
                    style={buttonStyle}
                    type="button"
                    onClick={signUp}
                    disabled={loading}
                  >
                    Créer un compte
                  </button>
                </form>
              </>
            )}
          </section>
        )}

        {page === "Administration" && (
          <section>
            <h2>Administration ÉCLAT SMART SERVICE</h2>

            {!user ? (
              <p>
                Connectez-vous avec un compte autorisé pour accéder
                à l'administration.
              </p>
            ) : (
              <p>
                Espace de préparation du tableau de bord administratif.
                Les fonctions de gestion des équipes, interventions,
                clients et paiements nécessitent encore leur configuration.
              </p>
            )}
          </section>
        )}
      </main>

      <footer
        style={{
          background: "#07569b",
          color: "white",
          padding: "25px",
          textAlign: "center",
        }}
      >
        <h3>ÉCLAT SMART SERVICE</h3>
        <p>Nettoyage professionnel & Buanderie</p>
        <p>Téléphone : +243 82 63 76 860</p>
        <p>Email : Infoeclatproservice@gmail.com</p>
        <p>Kinshasa - République démocratique du Congo</p>
        <p>© 2026 ÉCLAT SMART SERVICE</p>
      </footer>
    </div>
  );
}
