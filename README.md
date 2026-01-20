# Forest App - TP Code Quality

Application de calcul d'absorption de CO2 par les forêts. Ce projet met en pratique les principes de "Clean Code", de testabilité et d'architecture hexagonale.

## Ce que j'ai fait

### Fonctionnalités de l'API

L'API REST permet de gérer des forêts et des arbres, et de calculer des métriques écologiques.
La documentation Swagger est disponible sur `http://localhost:3000/docs`.

#### Forêts
- `GET /forest` : Lister toutes les forêts.
- `POST /forest` : Créer une nouvelle forêt.
- `GET /forest/{id}` : Obtenir les détails d'une forêt.
- `PUT /forest/{id}` : Mettre à jour une forêt.
- `DELETE /forest/{id}` : Supprimer une forêt.
- `GET /forest/{id}/species` : Lister les espèces d'arbres présentes dans une forêt.
- `POST /absorption` : Calculer l'absorption totale de CO2 d'une forêt (Body: `{ "forestId": "uuid" }`).
- `POST /forest/{id}/surface-needed` : Calculer la surface forestière nécessaire pour absorber une quantité donnée de CO2 (Body: `{ "targetCO2": number }`).
- `POST /forest/{id}/tree/{treeId}` : Ajouter un arbre existant à une forêt.

#### Arbres
- `GET /tree` : Lister tous les arbres.
- `POST /tree` : Créer un nouvel arbre.
- `GET /tree/{id}` : Obtenir les détails d'un arbre.
- `PUT /tree/{id}` : Mettre à jour un arbre.
- `DELETE /tree/{id}` : Supprimer un arbre.

### Architecture

Le projet suit une **architecture hexagonale** (Ports & Adapters) pour isoler le métier des détails techniques :

- **domain** : Contient la logique métier pure (Modèles, Services) et les interfaces (Ports). Aucune dépendance externe.
- **application** : Orchestre l'application, configure le serveur Express et l'injection de dépendances.
- **infrastructure** : Implémente les interfaces du domaine (Adapters). Ici, un stockage en mémoire simple.
- **presentation** : Expose l'application au monde extérieur (Contrôleurs REST).
- **api** : Définition de l'API via OpenAPI (Swagger).


## Ma méthodologie

J'ai adopté une approche **TDD (Test-Driven Development)**, consistant à écrire les tests de chaque fonctionnalité avant son implémentation.

Après avoir analysé le sujet et les attendus, j'ai listé l'ensemble des points d'accès (endpoints) à intégrer. J'ai d'abord mis en place des tests de bout en bout (E2E) avec **Bruno** pour les opérations CRUD des arbres et des forêts. Cette démarche m'a permis de bien cerner les besoins techniques et les contraintes de l'application, facilitant ainsi la création des routes et la vérification de leur bon fonctionnement.

Enfin, j'ai implémenté des tests unitaires pour les services et les contrôleurs, ce qui m'a permis de valider et de fiabiliser les traitements de données.

## Installation

1.  Dézipper le fichier du projet ou cloner le dépôt.
2.  Ouvrir un terminal à la racine du projet.
3.  Installer les dépendances :

```bash
npm install
```

## Lancement de l'application

### Mode Développement

Pour lancer l'application avec un rechargement automatique (watcher) :

```bash
npm run dev
```
L'API sera accessible sur `http://localhost:3000`.

### Mode Production

Pour construire et lancer l'application optimisée :

1.  Compiler le code TypeScript :
    ```bash
    npm run build
    ```
2.  Démarrer le serveur :
    ```bash
    npm run start
    ```

## Tests

Lancer la suite de tests unitaires et vérifier la couverture de code :

```bash
npm test
```
