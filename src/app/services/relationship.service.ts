import { Injectable } from '@angular/core';
import {
  RelationshipNode,
  RelationshipEdge,
  RelationshipGraph,
  RelationshipType,
  CharacterNodeType
} from '../models/relationship.model';

/**
 * Service pour gérer les relations entre personnages
 */
@Injectable({
  providedIn: 'root'
})
export class RelationshipService {

  /**
   * Crée un nouveau nœud de relation
   */
  createNode(
    id: string,
    label: string,
    type: CharacterNodeType,
    options?: Partial<RelationshipNode>
  ): RelationshipNode {
    return {
      id,
      label,
      type,
      ...options
    };
  }

  /**
   * Crée une nouvelle relation entre deux personnages
   */
  createEdge(
    id: string,
    source: string,
    target: string,
    type: RelationshipType,
    options?: Partial<RelationshipEdge>
  ): RelationshipEdge {
    return {
      id,
      source,
      target,
      type,
      isDirected: false,
      strength: 5,
      ...options
    };
  }

  /**
   * Ajoute un nœud au graphe
   */
  addNode(graph: RelationshipGraph, node: RelationshipNode): RelationshipGraph {
    // Vérifier si le nœud existe déjà
    if (graph.nodes.find(n => n.id === node.id)) {
      console.warn(`Node with id ${node.id} already exists`);
      return graph;
    }

    return {
      ...graph,
      nodes: [...graph.nodes, node]
    };
  }

  /**
   * Supprime un nœud du graphe (et toutes ses relations)
   */
  removeNode(graph: RelationshipGraph, nodeId: string): RelationshipGraph {
    return {
      nodes: graph.nodes.filter(n => n.id !== nodeId),
      edges: graph.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
    };
  }

  /**
   * Met à jour un nœud existant
   */
  updateNode(graph: RelationshipGraph, nodeId: string, updates: Partial<RelationshipNode>): RelationshipGraph {
    return {
      ...graph,
      nodes: graph.nodes.map(n =>
        n.id === nodeId ? { ...n, ...updates } : n
      )
    };
  }

  /**
   * Ajoute une relation au graphe
   */
  addEdge(graph: RelationshipGraph, edge: RelationshipEdge): RelationshipGraph {
    // Vérifier que les nœuds source et target existent
    const sourceExists = graph.nodes.find(n => n.id === edge.source);
    const targetExists = graph.nodes.find(n => n.id === edge.target);

    if (!sourceExists || !targetExists) {
      console.error('Cannot add edge: source or target node does not exist');
      return graph;
    }

    // Vérifier si la relation existe déjà
    if (graph.edges.find(e => e.id === edge.id)) {
      console.warn(`Edge with id ${edge.id} already exists`);
      return graph;
    }

    return {
      ...graph,
      edges: [...graph.edges, edge]
    };
  }

  /**
   * Supprime une relation du graphe
   */
  removeEdge(graph: RelationshipGraph, edgeId: string): RelationshipGraph {
    return {
      ...graph,
      edges: graph.edges.filter(e => e.id !== edgeId)
    };
  }

  /**
   * Met à jour une relation existante
   */
  updateEdge(graph: RelationshipGraph, edgeId: string, updates: Partial<RelationshipEdge>): RelationshipGraph {
    return {
      ...graph,
      edges: graph.edges.map(e =>
        e.id === edgeId ? { ...e, ...updates } : e
      )
    };
  }

  /**
   * Récupère toutes les relations d'un nœud spécifique
   */
  getNodeRelationships(graph: RelationshipGraph, nodeId: string): RelationshipEdge[] {
    return graph.edges.filter(e => e.source === nodeId || e.target === nodeId);
  }

  /**
   * Récupère tous les nœuds connectés à un nœud spécifique
   */
  getConnectedNodes(graph: RelationshipGraph, nodeId: string): RelationshipNode[] {
    const edges = this.getNodeRelationships(graph, nodeId);
    const connectedNodeIds = new Set<string>();

    edges.forEach(edge => {
      if (edge.source === nodeId) {
        connectedNodeIds.add(edge.target);
      }
      if (edge.target === nodeId) {
        connectedNodeIds.add(edge.source);
      }
    });

    return graph.nodes.filter(n => connectedNodeIds.has(n.id));
  }

  /**
   * Crée un graphe vide
   */
  createEmptyGraph(): RelationshipGraph {
    return {
      nodes: [],
      edges: []
    };
  }

  /**
   * Crée un graphe d'exemple pour démonstration
   */
  createSampleGraph(currentCharacterId: string, currentCharacterName: string): RelationshipGraph {
    const graph: RelationshipGraph = {
      nodes: [
        // Le personnage actuel au centre
        this.createNode(currentCharacterId, currentCharacterName, CharacterNodeType.Current, {
          description: 'Votre personnage'
        }),
        // Autres personnages joueurs
        this.createNode('player-1', 'John Watson', CharacterNodeType.Player, {
          occupation: 'Médecin',
          isAlive: true
        }),
        this.createNode('player-2', 'Sarah Blake', CharacterNodeType.Player, {
          occupation: 'Journaliste',
          isAlive: true
        }),
        // PNJs
        this.createNode('npc-1', 'Professeur Armitage', CharacterNodeType.NPC, {
          occupation: 'Bibliothécaire',
          description: 'Professeur à l\'Université Miskatonic',
          isAlive: true
        }),
        this.createNode('npc-2', 'Marcus Sterling', CharacterNodeType.NPC, {
          occupation: 'Antiquaire',
          description: 'Propriétaire d\'une boutique étrange',
          isAlive: true
        }),
        this.createNode('npc-3', 'Emma Carter', CharacterNodeType.NPC, {
          occupation: 'Inconnue',
          description: 'Femme mystérieuse aperçue plusieurs fois',
          isAlive: true
        })
      ],
      edges: [
        // Relations avec le personnage actuel
        this.createEdge('edge-1', currentCharacterId, 'player-1', RelationshipType.Friend, {
          label: 'Meilleur ami',
          description: 'Amis depuis l\'université',
          strength: 9
        }),
        this.createEdge('edge-2', currentCharacterId, 'player-2', RelationshipType.Colleague, {
          label: 'Collègue',
          description: 'Collaborent sur des enquêtes',
          strength: 7
        }),
        this.createEdge('edge-3', currentCharacterId, 'npc-1', RelationshipType.Mentor, {
          label: 'Mentor',
          description: 'Le professeur a guidé vos recherches',
          strength: 8,
          isDirected: true
        }),
        this.createEdge('edge-4', currentCharacterId, 'npc-2', RelationshipType.Acquaintance, {
          label: 'Contact',
          description: 'Source d\'objets rares',
          strength: 5
        }),
        this.createEdge('edge-5', currentCharacterId, 'npc-3', RelationshipType.Mysterious, {
          label: '???',
          description: 'Nature de la relation inconnue',
          strength: 3
        }),
        // Relations entre autres personnages
        this.createEdge('edge-6', 'player-1', 'npc-1', RelationshipType.Friend, {
          label: 'Ami',
          strength: 6
        }),
        this.createEdge('edge-7', 'player-2', 'npc-2', RelationshipType.Rival, {
          label: 'Rivale',
          description: 'En compétition pour une découverte',
          strength: 4
        })
      ]
    };

    return graph;
  }

  /**
   * Génère un ID unique pour un nouveau nœud
   */
  generateNodeId(): string {
    return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Génère un ID unique pour une nouvelle relation
   */
  generateEdgeId(): string {
    return `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Valide qu'un graphe est cohérent
   */
  validateGraph(graph: RelationshipGraph): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Vérifier que tous les edges pointent vers des nœuds existants
    const nodeIds = new Set(graph.nodes.map(n => n.id));

    graph.edges.forEach(edge => {
      if (!nodeIds.has(edge.source)) {
        errors.push(`Edge ${edge.id} references non-existent source node: ${edge.source}`);
      }
      if (!nodeIds.has(edge.target)) {
        errors.push(`Edge ${edge.id} references non-existent target node: ${edge.target}`);
      }
    });

    // Vérifier qu'il n'y a pas de doublons d'IDs
    const allNodeIds = graph.nodes.map(n => n.id);
    const uniqueNodeIds = new Set(allNodeIds);
    if (allNodeIds.length !== uniqueNodeIds.size) {
      errors.push('Duplicate node IDs detected');
    }

    const allEdgeIds = graph.edges.map(e => e.id);
    const uniqueEdgeIds = new Set(allEdgeIds);
    if (allEdgeIds.length !== uniqueEdgeIds.size) {
      errors.push('Duplicate edge IDs detected');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
