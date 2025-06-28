# Fulll - Test technique - Frontend Intermediate

#### Enzo AVAGLIANO - 26-06-2025

---

## Description

Application **React + TypeScript** permettant de rechercher des utilisateurs GitHub en **requêtes instantanées**, avec affichage de résultats paginés et gestion d’actions locales (**duplication, suppression, sélection**).


## Technologies utilisées

- ReactJS
- TypeScript
- Vite
- CSS modules


## Contraintes techniques

- **Pas de librairies externes** (sauf lib de tests)
- Gestion des erreurs API GitHub
- Respect des bonnes pratiques React et TypeScript
- **Action bar client-side** (duplication/suppression)


## Installation

1. Cloner le repo :
```bash
git clone https://github.com/EloxFire/fulll-hiring-algo.git
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer l'application :
```bash
npm run dev
```

4. Ouvrir dans le navigateur :
```
http://localhost:5173
```

## Fonctionnalités
- Recherche instantanée des utilisateurs GitHub via un input contrôlé.
- Debounce de 500 ms pour éviter de saturer l’API.
- Affichage des 100 premiers résultats, avec bouton "Voir plus" pour charger la suite manuellement.
- Checkbox de sélection sur chaque carte utilisateur.
- Duplication locale des utilisateurs sélectionnés avec ID local unique.
- Suppression locale des utilisateurs sélectionnés.
- Réinitialisation de la sélection et des duplications/suppressions lors d’une nouvelle recherche.
- Responsive mobile et desktop.

## Architecture détaillée
- useSearch
  - Rôle : Effectuer les requêtes https://api.github.com/search/users?q={query}. 
  - Gérer le debounce (500 ms) pour limiter les requêtes.
  - Gérer la pagination via le header `Link` de l'API GitHub.
  - Mettre à disposition :
    - users : liste des utilisateurs récupérés.
    - loading : état de chargement.
    - error : état d’erreur ou limite d’API atteinte.
    - hasMore : indique si d'autres pages existent.
    - loadMore() : pour charger la page suivante via bouton "Voir plus".
    - setUsers() : permet au contexte de dupliquer ou supprimer des éléments.

Le bouton "Voir plus" permet de charger les résultats suivants en utilisant la fonction `loadMore()`.
IL est aussi présent afin d'éviter un `scroll infini` et donc de saturer la limite GitHub.

- searchContext
  - Rôle : Permet une gestion globale et propre des éléments suivants :
    - La recherche (query et setQuery).
    - L'affichage des utilisateurs (users, setUsers).
    - La sélection via selectedUserIds (Set<number>).
    - Les actions :
      - toggleUserSelection()
      - selectAllUsers()
      - clearSelection()
      - duplicateSelectedUsers() : duplique les utilisateurs sélectionnés avec de nouveaux ID locaux.
      - deleteSelectedUsers() : supprime localement les utilisateurs sélectionnés.

Le contexte réinitialise automatiquement les suppressions et duplications lors d'une nouvelle recherche.
