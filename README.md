
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ÉCLAT SMART SERVICE</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,sans-serif;background:#f2f5fa;color:#172b4d}
header{background:#073b78;color:white;padding:22px}
header h2{margin:0}
header p{margin:7px 0 0;color:#d5e6ff}
nav{display:flex;overflow-x:auto;background:#fff;padding:12px;gap:8px}
nav button{border:0;background:#eaf1fa;color:#073b78;padding:11px 14px;border-radius:7px;white-space:nowrap}
nav button.active{background:#073b78;color:white}
main{padding:18px;max-width:1100px;margin:auto}
h2{color:#073b78}
.cards{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.card{background:white;padding:18px;border-radius:10px;box-shadow:0 2px 8px #0000000c}
.number{font-size:27px;font-weight:bold;color:#0874cf;margin-top:12px}
.small{color:#68778b;font-size:13px}
section{display:none}
section.active{display:block}
.notice{background:#e8f2ff;padding:14px;border-radius:8px;margin-top:18px;color:#164a7d}
footer{text-align:center;color:#718096;padding:25px;font-size:12px}
@media(min-width:700px){.cards{grid-template-columns:repeat(4,1fr)}}
</style>
</head>
<body>
<header>
<h2>ÉCLAT SMART SERVICE</h2>
<p>Espace Administrateur | Kinshasa</p>
</header>

<nav>
<button class="active" onclick="showPage('dashboard',this)">Tableau de bord</button>
<button onclick="showPage('demandes',this)">Demandes</button>
<button onclick="showPage('interventions',this)">Interventions</button>
<button onclick="showPage('personnel',this)">Clients & agents</button>
<button onclick="showPage('equipes',this)">Équipes</button>
<button onclick="showPage('paiements',this)">Paiements</button>
<button onclick="showPage('rapports',this)">Rapports</button>
</nav>

<main>
<section id="dashboard" class="active">
<h2>Tableau de bord</h2>
<p>Vue générale des activités d'ÉCLAT.</p>
<div class="cards">
<div class="card">Utilisateurs<div class="number">—</div><div class="small">À connecter</div></div>
<div class="card">Équipes<div class="number">5</div><div class="small">Équipes créées</div></div>
<div class="card">Demandes<div class="number">0</div><div class="small">Demandes enregistrées</div></div>
<div class="card">Interventions<div class="number">0</div><div class="small">Missions enregistrées</div></div>
<div class="card">En cours<div class="number">0</div><div class="small">Interventions</div></div>
<div class="card">Terminées<div class="number">0</div><div class="small">Interventions</div></div>
<div class="card">Paiements<div class="number">0</div><div class="small">Transactions enregistrées</div></div>
</div>
<div class="notice">Interface en préparation. Les données seront connectées à Supabase après configuration de l'authentification.</div>
</section>

<section id="demandes"><h2>Demandes clients</h2><p>Les demandes reçues apparaîtront ici.</p></section>
<section id="interventions"><h2>Interventions</h2><p>Planification et suivi des missions.</p></section>
<section id="personnel"><h2>Clients et agents</h2><p>Gestion des comptes et des affectations.</p></section>
<section id="equipes"><h2>Gestion des équipes</h2><p>Les cinq équipes ÉCLAT seront affichées ici.</p></section>
<section id="paiements"><h2>Paiements</h2><p>Suivi des transactions Mobile Money et autres paiements.</p></section>
<section id="rapports"><h2>Rapports</h2><p>Statistiques et rapports des interventions.</p></section>
</main>

<footer>ÉCLAT SMART SERVICE — Plateforme numérique intégrée</footer>

<script>
function showPage(id,button){
document.querySelectorAll('main section').forEach(s=>s.classList.remove('active'));
document.getElementById(id).classList.add('active');
document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
button.classList.add('active');
}
</script>
</body>
</html>
