
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "./lib/supabase";

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

type ServiceRequest = {
  id: string;
  service: string;
  customer_type: string;
  address: string;
  requested_date: string | null;
  description: string | null;
  status: string;
};

export default function App() {
  const [page, setPage] = useState("Accueil");
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [service, setService] = useState(services[0]);
  const [customerType, setCustomerType] = useState("Particulier");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setMessage("Configuration Supabase manquante.");
      return;
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setMessage(error.message);
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);


async function authenticate(register: boolean) {
  if (!supabase) {
    setMessage("Erreur : Supabase n'est pas connecté.");
    return;
  }

  if (!email || !password) {
    setMessage("Veuillez remplir l'e-mail et le mot de passe.");
    return;
  }

  setLoading(true);
  setMessage("Connexion en cours...");

  try {
    const result = register
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setMessage("Erreur Supabase : " + result.error.message);
    } else if (register) {
      setMessage("Inscription effectuée. Vérifiez votre e-mail si nécessaire.");
    } else {
      setUser(result.data.user);
      setMessage("Connexion réussie !");
      setPage("Espace client");
    }
  } catch (error) {
    setMessage("Erreur technique : " + String(error));
  } finally {
    setLoading(false);
  }
}

    if (!supabase) return;

    if (!email || !password) {
      setMessage("Veuillez remplir l'e-mail et le mot de passe.");
      return;
    }

    setLoading(true);
    setMessage("");

    const result = register
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
    } else if (register) {
      setMessage("Inscription effectuée. Vérifiez votre e-mail si nécessaire.");
    } else {
      setMessage("Connexion réussie.");
      setPage("Espace client");
    }
  }

  async function logout() {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(error.message);
    } else {
      setUser(null);
      setRequests([]);
      setPage("Accueil");
      setMessage("Déconnexion réussie.");
    }
  }

  async function loadRequests() {
    if (!supabase || !user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("service_requests")
      .select("id, service, customer_type, address, requested_date, description, status")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      setMessage("Erreur de chargement : " + error.message);
    } else {
      setRequests(data || []);
    }
  }

  useEffect(() => {
    if (user) loadRequests();
  }, [user]);

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !user) {
      setMessage("Connectez-vous avant de demander un service.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("service_requests").insert({
      client_id: user.id,
      service,
      customer_type: customerType,
      address,
      requested_date: date || null,
      description,
      status: "En attente",
    });

    setLoading(false);

    if (error) {
      setMessage("Erreur : " + error.message);
    } else {
      setMessage("Votre demande a été enregistrée.");
      setAddress("");
      setDate("");
      setDescription("");
      setPage("Suivi des demandes");
      await loadRequests();
    }
  }

  const button = {
    background: "#07569b",
    color: "white",
    padding: "12px 18px",
    border: "none",
    borderRadius: "6px",
    margin: "5px",
    cursor: "pointer",
  } as const;

  const field = {
    width: "100%",
    padding: "12px",
    margin: "8px 0 16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  } as const;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#263445" }}>
      <header style={{ background: "#07569b", color: "white", padding: "30px 15px", textAlign: "center" }}>
        <h1>ÉCLAT SMART SERVICE</h1>
        <p>Nettoyage professionnel & Buanderie</p>
        <p>Qualité - Rapidité - Fiabilité - Satisfaction client</p>
      </header>

      <nav style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", padding: "12px", background: "#eaf1f8" }}>
        {["Accueil", "Nos services", "Demander un service", "Suivi des demandes", "Espace client"].map(item => (
          <button key={item} style={button} onClick={() => { setMessage(""); setPage(item); }}>
            {item}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: "950px", margin: "auto", padding: "25px 18px", minHeight: "400px" }}>
        {message && (
          <div style={{ padding: "12px", marginBottom: "15px", background: "#eaf1f8", borderRadius: "6px" }}>
            {message}
          </div>
        )}

        {page === "Accueil" && (
          <section>
            <h2>Bienvenue chez ÉCLAT SMART SERVICE</h2>
            <p>Votre partenaire pour le nettoyage professionnel, la buanderie et les services techniques.</p>
            <p>Nous accompagnons les particuliers, entreprises et institutions à Kinshasa.</p>
            <button style={button} onClick={() => setPage("Nos services")}>Découvrir nos services</button>
            <button style={button} onClick={() => setPage("Demander un service")}>Demander une intervention</button>
          </section>
        )}

        {page === "Nos services" && (
          <section>
            <h2>Nos services</h2>
            {services.map(item => (
              <div key={item} style={{ padding: "14px", margin: "10px 0", background: "#f1f5f9", borderRadius: "6px" }}>
                {item}
              </div>
            ))}
          </section>
        )}

        {page === "Espace client" && (
          <section>
            <h2>Espace client</h2>
            {user ? (
              <>
                <p>Connecté avec : {user.email}</p>
                <button style={button} onClick={() => setPage("Demander un service")}>Nouvelle demande</button>
                <button style={button} onClick={() => setPage("Suivi des demandes")}>Mes demandes</button>
                <button style={button} onClick={logout}>Déconnexion</button>
              </>
            ) : (
              <form onSubmit={event => { event.preventDefault(); authenticate(false); }}>
                <label>Adresse e-mail</label>
                <input style={field} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <label>Mot de passe</label>
                <input style={field} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button style={button} disabled={loading}>Se connecter</button>
                <button type="button" style={button} disabled={loading} onClick={() => authenticate(true)}>Créer un compte</button>
              </form>
            )}
          </section>
        )}

        {page === "Demander un service" && (
          <section>
            <h2>Demander un service</h2>
            {!user ? (
              <p>Connectez-vous dans votre espace client pour envoyer une demande.</p>
            ) : (
              <form onSubmit={submitRequest}>
                <label>Service demandé</label>
                <select style={field} value={service} onChange={e => setService(e.target.value)}>
                  {services.map(item => <option key={item}>{item}</option>)}
                </select>
                <label>Type de client</label>
                <select style={field} value={customerType} onChange={e => setCustomerType(e.target.value)}>
                  <option>Particulier</option>
                  <option>Entreprise</option>
                  <option>Institution</option>
                </select>
                <label>Adresse de l'intervention</label>
                <input style={field} value={address} onChange={e => setAddress(e.target.value)} required placeholder="Adresse à Kinshasa" />
                <label>Date souhaitée</label>
                <input style={field} type="date" value={date} onChange={e => setDate(e.target.value)} />
                <label>Description</label>
                <textarea style={field} rows={4} value={description} onChange={e => setDescription(e.target.value)} />
                <button style={button} disabled={loading}>Envoyer ma demande</button>
              </form>
            )}
          </section>
        )}

        {page === "Suivi des demandes" && (
          <section>
            <h2>Suivi de mes demandes</h2>
            {!user ? (
              <p>Connectez-vous pour consulter vos demandes.</p>
            ) : (
              <>
                <button style={button} onClick={loadRequests} disabled={loading}>Actualiser</button>
                {requests.length === 0 ? (
                  <p>Aucune demande enregistrée.</p>
                ) : requests.map(request => (
                  <article key={request.id} style={{ padding: "15px", margin: "12px 0", border: "1px solid #ddd", borderRadius: "7px" }}>
                    <h3>{request.service}</h3>
                    <p>Adresse : {request.address}</p>
                    <p>Client : {request.customer_type}</p>
                    <p>Date : {request.requested_date || "Non définie"}</p>
                    <p>Description : {request.description || "Aucune"}</p>
                    <strong>Statut : {request.status}</strong>
                  </article>
                ))}
              </>
            )}
          </section>
        )}
      </main>

      <footer style={{ background: "#12334f", color: "white", padding: "25px", textAlign: "center" }}>
        <h3>ÉCLAT SMART SERVICE</h3>
        <p>Nettoyage professionnel & Buanderie</p>
        <p>Kinshasa - République démocratique du Congo</p>
        <p>© 2026 ÉCLAT SMART SERVICE</p>
      </footer>
    </div>
  );
}
