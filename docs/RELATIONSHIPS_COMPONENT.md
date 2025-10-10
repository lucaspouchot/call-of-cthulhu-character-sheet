# Composant de Relations entre Personnages

## Vue d'ensemble

Ce composant permet de visualiser et gérer les relations entre les personnages joueurs et les PNJ dans une feuille de personnage Call of Cthulhu sous forme de graphe interactif.

## Fonctionnalités

### Visualisation
- **Graphe interactif** : Affichage visuel des relations entre personnages avec ngx-graph
- **Différents types de nœuds** :
  - Personnage actuel (bleu, avec bordure dorée)
  - Personnages joueurs (vert)
  - PNJ (gris)
- **Relations colorées** selon leur type :
  - Ami, Amour, Allié : Vert
  - Ennemi, Rival : Rouge
  - Famille : Violet
  - Mentor : Orange
  - Mystérieux : Gris foncé

### Gestion des relations
- **Ajouter des personnages** : Créer des nœuds pour personnages joueurs ou PNJ
- **Ajouter des relations** : Créer des liens entre personnages avec différents types :
  - Famille
  - Ami
  - Collègue
  - Rival
  - Ennemi
  - Amour
  - Mentor/Protégé
  - Connaissance
  - Allié
  - Mystérieux
  - Personnalisé
- **Éditer** : Modifier les informations d'un personnage ou d'une relation
- **Supprimer** : Retirer des personnages ou des relations
- **Force de relation** : Échelle de 1 à 10 pour quantifier l'importance
- **Relations directionnelles** : Option pour des relations à sens unique (avec flèche)

### Options d'affichage
- **Layouts multiples** :
  - Force dirigée (Cola) - Par défaut
  - Force dirigée (D3)
  - Hiérarchique
  - Clusters
- **Zoom et panoramique** : Navigation fluide dans le graphe
- **Recentrage** : Bouton pour recentrer automatiquement le graphe

## Structure des fichiers

```
src/app/
├── models/
│   └── relationship.model.ts           # Interfaces pour les relations
├── services/
│   └── relationship.service.ts         # Service de gestion des relations
└── components/
    └── character-sheet/
        └── card/
            └── relationships/
                ├── relationships-card.component.ts    # Logique du composant
                ├── relationships-card.component.html  # Template
                └── relationships-card.component.css   # Styles
```

## Modèle de données

### RelationshipNode
```typescript
{
  id: string;              // Identifiant unique
  label: string;           // Nom du personnage
  type: CharacterNodeType; // 'current' | 'player' | 'npc'
  description?: string;    // Description
  occupation?: string;     // Profession
  isAlive?: boolean;      // Statut vivant/mort
}
```

### RelationshipEdge
```typescript
{
  id: string;              // Identifiant unique
  source: string;          // ID du nœud source
  target: string;          // ID du nœud cible
  label?: string;          // Label personnalisé
  type: RelationshipType;  // Type de relation
  description?: string;    // Description
  strength?: number;       // Force (1-10)
  isDirected?: boolean;   // Relation directionnelle
}
```

## Utilisation

### Dans une feuille de personnage

Le composant est automatiquement intégré dans la feuille de personnage :

```html
<app-relationships-card 
  [character]="character"
  (characterChange)="onCharacterChange($event)"
  (saveCharacter)="saveCharacter()">
</app-relationships-card>
```

### Interaction utilisateur

1. **Mode lecture** : Visualisation du graphe de relations
2. **Mode édition** : 
   - Cliquer sur le bouton ✏️ pour activer l'édition
   - Ajouter des personnages et des relations
   - Cliquer sur un nœud pour l'éditer
   - Modifier le layout si désiré
   - Sauvegarder ou annuler les modifications

### Exemple de données

Le service fournit un graphe d'exemple lors de la première utilisation :
- Le personnage actuel au centre
- 2 autres personnages joueurs
- 3 PNJ
- Diverses relations entre eux

## Dépendances

- **@swimlane/ngx-graph** : Bibliothèque de graphes pour Angular
- **d3** : Bibliothèque de visualisation de données (dépendance de ngx-graph)

## Installation

Les dépendances ont été installées avec :
```bash
npm install @swimlane/ngx-graph d3 --legacy-peer-deps
```

## Personnalisation

### Modifier les couleurs

Dans `relationships-card.component.ts`, les méthodes `getNodeColor()` et `getEdgeColor()` définissent les couleurs :

```typescript
getNodeColor(node: Node): string {
  const data = node.data as RelationshipNode;
  switch (data.type) {
    case CharacterNodeType.Current: return '#3b82f6'; // Bleu
    case CharacterNodeType.Player: return '#10b981';  // Vert
    case CharacterNodeType.NPC: return '#6b7280';     // Gris
  }
}
```

### Ajouter des types de relations

1. Ajouter le nouveau type dans `relationship.model.ts` :
```typescript
export enum RelationshipType {
  // ... types existants
  NewType = 'newType'
}
```

2. Ajouter le label dans `getRelationshipTypeLabel()` :
```typescript
[RelationshipType.NewType]: 'Nouveau Type'
```

3. Optionnellement, ajouter une couleur dans `getEdgeColor()`

## Inspiration

Ce composant s'inspire des cadres "Fellow Heroes" présents sur les feuilles de personnage papier de Call of Cthulhu, permettant de lister les investigateurs jouant ensemble. Il étend ce concept en :
- Permettant d'inclure aussi les PNJ
- Visualisant les relations de manière graphique
- Qualifiant les types et forces de relations
- Offrant une vue interactive et modifiable

## Améliorations futures possibles

- Export/import du graphe en JSON
- Filtrage par type de relation
- Recherche de personnages
- Annotations sur les relations (dates, événements)
- Timeline des évolutions de relations
- Groupes/factions de personnages
- Photos/avatars pour les nœuds
