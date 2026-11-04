'use strict';
const $ = id => document.getElementById(id);
const KEY = 'ciel-support-desk-v1';
const statuses = ['Nouveau', 'En cours', 'Résolu'];
const priorities = ['Normale', 'Haute', 'Basse'];
let tickets = [];
const valid = t => t && typeof t.id === 'string' && ['title','asset','category','description','notes','created'].every(k => typeof t[k] === 'string') && statuses.includes(t.status) && priorities.includes(t.priority);
try {
  const data = JSON.parse(localStorage.getItem(KEY) || '[]');
  if (!Array.isArray(data) || !data.every(valid)) throw new Error();
  tickets = data;
} catch { $('feedback').textContent = 'Stockage indisponible ou données invalides. Vous pouvez travailler dans cette session.'; }
function persist(next) {
  try { localStorage.setItem(KEY, JSON.stringify(next)); }
  catch { $('feedback').textContent = 'Enregistrement impossible : stockage plein ou bloqué. Exportez vos données avant de quitter.'; return false; }
  return true;
}
function cell(row, text) { const td = document.createElement('td'); td.textContent = text; row.append(td); return td; }
function render() {
  $('total').textContent = tickets.length;
  $('open').textContent = tickets.filter(t => t.status !== 'Résolu').length;
  $('urgent').textContent = tickets.filter(t => t.status !== 'Résolu' && t.priority === 'Haute').length;
  $('rate').textContent = (tickets.length ? Math.round(100*tickets.filter(t => t.status === 'Résolu').length/tickets.length) : 0) + '%';
  const query = $('search').value.toLocaleLowerCase('fr');
  const shown = tickets.filter(t => (!query || [t.title,t.asset,t.category].join(' ').toLocaleLowerCase('fr').includes(query)) && (!$('filter').value || t.status === $('filter').value) && (!$('priority-filter').value || t.priority === $('priority-filter').value));
  $('rows').replaceChildren();
  for (const t of shown) {
    const tr = document.createElement('tr'); const td = cell(tr,'');
    const title = document.createElement('strong'); title.textContent=t.title;
    const meta=document.createElement('small'); meta.textContent=t.category+' · '+new Date(t.created).toLocaleDateString('fr-FR'); td.append(title,meta);
    cell(tr,t.asset);
    const p=document.createElement('span'); p.className='badge'+(t.priority==='Haute'?' high':''); p.textContent=t.priority; cell(tr,'').append(p);
    const s=document.createElement('span'); s.className='badge'+(t.status==='Résolu'?' done':''); s.textContent=t.status; cell(tr,'').append(s);
    const edit=document.createElement('button'); edit.textContent='Ouvrir'; edit.setAttribute('aria-label','Ouvrir : '+t.title); edit.onclick=()=>openEditor(t); cell(tr,'').append(edit); $('rows').append(tr);
  }
  $('empty').hidden=shown.length>0;
  if(!shown.length) $('empty').textContent=tickets.length?'Aucune intervention ne correspond à vos filtres.':'Aucune intervention. Créez votre première demande ou chargez l’exemple.';
}
function openEditor(t) {
  $('ticket-form').reset(); $('ticket-id').value=t?.id||'';
  $('dialog-title').textContent=t?'Détail de l’intervention':'Nouvelle intervention';
  for(const field of ['title','asset','category','priority','status','description','notes']) if(t) $(field).value=t[field];
  $('editor').showModal(); $('title').focus();
}
$('new').onclick=()=>openEditor(); $('close').onclick=()=>$('editor').close();
$('ticket-form').onsubmit=e=>{
  e.preventDefault(); const title=$('title').value.trim(),asset=$('asset').value.trim();
  if(!title||!asset){$('title').setCustomValidity(!title?'Le titre est obligatoire.':'');$('asset').setCustomValidity(!asset?'L’équipement est obligatoire.':'');e.target.reportValidity();return;}
  const existing=tickets.find(t=>t.id===$('ticket-id').value);
  const ticket={id:existing?.id||crypto.randomUUID(),created:existing?.created||new Date().toISOString(),title,asset};
  for(const field of ['category','priority','status','description','notes']) ticket[field]=$(field).value;
  const next=existing?tickets.map(t=>t.id===ticket.id?ticket:t):[ticket,...tickets];
  const saved=persist(next);tickets=next;if(saved)$('feedback').textContent='Intervention enregistrée.';render();$('editor').close();
};
for(const field of ['title','asset']) $(field).oninput=()=>$(field).setCustomValidity('');
for(const field of ['search','filter','priority-filter']) $(field).addEventListener('input',render);
$('demo').onclick=()=>{
  const examples=[['Connexion réseau indisponible','PC-ACCUEIL-01','Réseau','Haute','Nouveau'],['Installation du logiciel bureautique','PC-SALLE-04','Logiciel','Normale','En cours'],['Remplacement du câble écran','PC-ATELIER-02','Matériel','Basse','Résolu']];
  const next=[...tickets];for(const [title,asset,category,priority,status] of examples){const id='demo-'+asset;if(!next.some(t=>t.id===id))next.push({id,title,asset,category,priority,status,description:'Exemple fictif pour découvrir le fonctionnement.',notes:status==='Résolu'?'Câble remplacé et affichage vérifié.':'',created:new Date().toISOString()});}
  const saved=persist(next);tickets=next;if(saved)$('feedback').textContent='Exemples ajoutés sans remplacer vos interventions.';render();
};
function csvValue(value){let v=String(value);if(/^[\s]*[=+@-]/.test(v))v="'"+v;return '"'+v.replaceAll('"','""')+'"';}
$('export').onclick=()=>{
  const columns=['id','title','asset','category','priority','status','description','notes','created'];
  const csv='\uFEFF'+[columns,...tickets.map(t=>columns.map(k=>t[k]))].map(row=>row.map(csvValue).join(';')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='interventions-ciel.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
render();

