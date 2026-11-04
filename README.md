# CIEL Support Desk

**Un tableau de suivi des interventions informatiques, accessible dans un navigateur.**

Projet pédagogique de portfolio pour le Bac pro CIEL : transformer une demande de support en intervention documentée, avec priorité, statut et notes de résolution.

## Essayer

Téléchargez le dépôt et ouvrez `index.html` dans un navigateur récent. Aucun paquet à installer. Cliquez sur **Charger un exemple** pour découvrir trois interventions fictives. Vous pouvez aussi lancer `python -m http.server 8000` puis ouvrir `http://localhost:8000`.

## Fonctionnalités

- Création et modification d’interventions, avec équipement, catégorie et description.
- Cycle Nouveau → En cours → Résolu et notes de diagnostic.
- Recherche, filtres par statut et priorité, indicateurs calculés.
- Enregistrement local après chaque modification ; message explicite si le stockage échoue.
- Export CSV avec guillemets échappés et neutralisation des cellules de type formule.
- Interface responsive, navigation clavier et respect de la réduction des animations.

## Choix techniques

| Fichier | Rôle |
| --- | --- |
| `index.html` | Structure sémantique, tableau et formulaire dans une boîte de dialogue native |
| `style.css` | Mise en page adaptative et états de focus |
| `script.js` | Validation, rendu DOM, filtres, stockage et export |

JavaScript natif, sans framework. Les données utilisateur sont affichées via `textContent`. Le stockage utilise la clé versionnée `ciel-support-desk-v1`.

## Vérification manuelle

1. Ajouter un ticket ; recharger la page et vérifier sa présence.
2. Ouvrir le ticket, ajouter une solution, passer à Résolu ; vérifier les indicateurs.
3. Rechercher son équipement puis filtrer par priorité et statut.
4. Exporter le CSV et vérifier titres, notes et caractères accentués.
5. Vérifier le formulaire au clavier et la mise en page sur mobile.

Contrôle syntaxique : `node --check script.js`.

## Limites

Démonstration locale mono-utilisateur : pas de compte, de synchronisation, de serveur ni de sauvegarde distante. La suppression des données du navigateur efface les tickets. L’export est une copie CSV, sans fonction d’import. Ne pas y stocker de données confidentielles.

## Pistes d’évolution

- Import JSON validé et historique des modifications.
- API Python avec base SQLite pour un fonctionnement multi-utilisateur.
- Attribution à un technicien et pièces jointes.

## Présentation en entretien

Expliquer le chemin formulaire → validation → sauvegarde → rendu, calculer le taux de résolution et montrer pourquoi `textContent` protège l’affichage des textes saisis.

Projet préparé pour le portfolio de **Mehdi Hmaiss**, avec assistance IA pour le code, la documentation et la vérification. Il s’agit d’un projet d’apprentissage, pas d’une expérience en entreprise.

Licence MIT — voir [LICENSE](LICENSE).
