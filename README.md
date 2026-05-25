# MMOTORS Front

# MMotors — Frontend

Application frontend de **MMotors**, une solution digitale permettant de consulter des véhicules (vente/location), créer un compte client et déposer un dossier.

## Stack technique

- **React** + **TypeScript**
- **Vite** (bundler / serveur de dev)
- **Tailwind CSS** (style)
- **shadcn/ui** (composants UI)
- **Zustand** (gestion d’état + persistance via Local Storage)
- **Motion** (animations)

## Fonctionnalités principales (MVP)

- Consultation du catalogue de véhicules (visiteur)
- Filtrage vente vs location (visiteur)
- Consultation du détail d’un véhicule (visiteur)
- Création de compte & connexion (client)
- Création d’un dossier, upload de documents, suivi de statut
- Espace admin/staff (flux MVP principalement porté côté back)

## Structure du projet (dossiers importants)

src/

components/         (composants UI partagés)

helpers/            (fonctions partagés)

routes/             (pages / composants spécifiques / layouts / stores)

type/               (types utilisés dans l'app)




## Démarrage rapide

### Prérequis
- Node.js
- Une API backend fonctionnelle (voir README backend)

### Installation

```
npm install
```


### Lancer en dev
```

npm run dev

```

### Build production
```

npm run build

```

### Prévisualiser le build
```

npm run preview

```

## Variables d’environnement

Créer un fichier `.env` à la racine :



# URL de base de l’API (exemple)
```

VITE_API_BASE_URL=http://localhost:****

```

## Déploiement (AWS) — Vue d’ensemble

Le frontend est déployé en **SPA statique** :

- Fichiers build dans un **bucket S3 privé**
- Exposition via **CloudFront**
- Behavior CloudFront `/*` → S3 Front bucket
- CloudFront Function pour rediriger les routes vers `index.html` (routing SPA)

## Authentification

L’authentification est gérée par le backend via **JWT**.
Côté frontend :
- Ajouter le header : `Authorization: Bearer <token>`

## Workflow Git

Flux Git “classique” :

- `main` → production
- `dev` → intégration / test
- `feature/<nom>` → branches de feature
- `fix/<nom>` → maintenance / correctif

Flux typique :
1. créer la branche depuis `dev`
2. développer
3. commit + push
4. PR vers `dev`

## Liens

- Application (UAT) : https://www.mmotors-uat.click/

