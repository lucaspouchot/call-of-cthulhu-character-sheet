/**
 * Types de relations possibles entre personnages
 */
export enum RelationshipType {
  Family = 'family',           // Famille
  Friend = 'friend',           // Ami
  Colleague = 'colleague',     // Collègue
  Rival = 'rival',            // Rival
  Enemy = 'enemy',            // Ennemi
  Love = 'love',              // Amour
  Mentor = 'mentor',          // Mentor/Protégé
  Acquaintance = 'acquaintance', // Connaissance
  Ally = 'ally',              // Allié
  Mysterious = 'mysterious',   // Relation mystérieuse
  Custom = 'custom'           // Personnalisé
}

/**
 * Type de personnage dans le graphe
 */
export enum CharacterNodeType {
  Player = 'player',     // Personnage joueur
  NPC = 'npc',          // PNJ
  Current = 'current'   // Le personnage actuel (centre du graphe)
}

/**
 * Interface pour un personnage dans le graphe de relations
 */
export interface RelationshipNode {
  id: string;                    // Identifiant unique
  label: string;                 // Nom du personnage
  type: CharacterNodeType;       // Type de personnage
  description?: string;          // Description optionnelle
  characterId?: string;          // ID du personnage si c'est un personnage joueur
  occupation?: string;           // Occupation/profession
  isAlive?: boolean;            // Statut vivant/mort
}

/**
 * Interface pour une relation entre deux personnages
 */
export interface RelationshipEdge {
  id: string;                    // Identifiant unique
  source: string;                // ID du nœud source
  target: string;                // ID du nœud cible
  label?: string;                // Label de la relation (ex: "Frère", "Ami d'enfance")
  type: RelationshipType;        // Type de relation
  description?: string;          // Description détaillée de la relation
  strength?: number;             // Force de la relation (1-10)
  isDirected?: boolean;          // Si true, la relation est unidirectionnelle
  customTypeName?: string;       // Nom personnalisé pour type "custom"
}

/**
 * Interface pour le graphe complet de relations d'un personnage
 */
export interface RelationshipGraph {
  nodes: RelationshipNode[];
  edges: RelationshipEdge[];
}

/**
 * Configuration pour l'affichage du graphe
 */
export interface GraphDisplayConfig {
  layout: 'dagreCluster' | 'dagre' | 'colaForceDirected' | 'd3ForceDirected';
  showLabels: boolean;
  animate: boolean;
  zoomEnabled: boolean;
  panEnabled: boolean;
  autoZoom: boolean;
  autoCenter: boolean;
}
