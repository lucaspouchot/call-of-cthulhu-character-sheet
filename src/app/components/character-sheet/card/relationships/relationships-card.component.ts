import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { BaseCardComponent } from '../base-card.component';
import { RelationshipService } from '../../../../services/relationship.service';
import {
  RelationshipGraph,
  RelationshipNode,
  RelationshipEdge,
  RelationshipType,
  CharacterNodeType,
  GraphDisplayConfig
} from '../../../../models/relationship.model';
import { Node, Edge } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-relationships-card',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxGraphModule],
  templateUrl: './relationships-card.component.html',
  styleUrl: './relationships-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelationshipsCardComponent extends BaseCardComponent implements OnInit {
  // Graphe de relations
  relationshipGraph: RelationshipGraph = { nodes: [], edges: [] };

  // Configuration du graphe
  graphConfig: GraphDisplayConfig = {
    layout: 'colaForceDirected',
    showLabels: true,
    animate: true,
    zoomEnabled: true,
    panEnabled: true,
    autoZoom: false,
    autoCenter: true
  };

  // Pour ngx-graph
  nodes: Node[] = [];
  links: Edge[] = [];

  // UI State
  showAddNodeForm = false;
  showAddEdgeForm = false;
  showEditNodeForm = false;
  showEditEdgeForm = false;
  selectedNode: RelationshipNode | null = null;
  selectedEdge: RelationshipEdge | null = null;

  // Formulaires
  newNode: Partial<RelationshipNode> = {};
  newEdge: Partial<RelationshipEdge> = {};

  // Enum exposés pour le template
  RelationshipType = RelationshipType;
  CharacterNodeType = CharacterNodeType;
  relationshipTypes = Object.values(RelationshipType);
  characterNodeTypes = Object.values(CharacterNodeType).filter(t => t !== CharacterNodeType.Current);

  constructor(
    private relationshipService: RelationshipService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    // Le service a déjà initialisé les relations si nécessaire
    // On convertit simplement les données pour l'affichage
    if (this.character.relationships) {
      this.relationshipGraph = this.convertToRelationshipGraph(this.character.relationships);
    } else {
      // Fallback si jamais les données ne sont pas initialisées
      this.relationshipGraph = this.createInitialGraph();
    }
    this.updateGraphDisplay();
  }

  /**
   * Crée le graphe initial avec seulement le nœud du personnage actuel
   */
  private createInitialGraph(): RelationshipGraph {
    const currentPlayerNode: RelationshipNode = {
      id: this.character.id,
      label: this.character.name,
      type: CharacterNodeType.Current,
      description: 'Votre personnage',
      characterId: this.character.id,
      occupation: this.character.occupation,
      isAlive: true
    };

    return {
      nodes: [currentPlayerNode],
      edges: []
    };
  }

  protected getSectionName(): string {
    return 'relationships';
  }

  protected saveOriginalData(): void {
    if (this.character && this.character.relationships) {
      this.originalData = JSON.parse(JSON.stringify(this.character.relationships));
    } else {
      this.originalData = null;
    }
  }

  protected restoreOriginalData(): void {
    if (this.originalData) {
      const restored = JSON.parse(JSON.stringify(this.originalData));
      this.character.relationships = restored;
      this.relationshipGraph = this.convertToRelationshipGraph(restored);
      this.updateGraphDisplay();
    }
  }

  /**
   * Convertit les données du personnage en RelationshipGraph avec les bons types
   */
  private convertToRelationshipGraph(data: any): RelationshipGraph {
    return {
      nodes: (data.nodes || []).map((n: any) => ({
        ...n,
        type: n.type as CharacterNodeType
      })),
      edges: (data.edges || []).map((e: any) => ({
        ...e,
        type: e.type as RelationshipType
      }))
    };
  }

  /**
   * Convertit le graphe de relations pour ngx-graph
   */
  updateGraphDisplay(): void {
    // Convertir les nœuds avec couleurs précalculées
    this.nodes = this.relationshipGraph.nodes.map(node => {
      const color = this.calculateNodeColor(node.type);
      return {
        id: node.id,
        label: node.label,
        data: {
          ...node,
          color: color
        }
      };
    });

    // Convertir les edges avec couleurs précalculées
    this.links = this.relationshipGraph.edges.map(edge => {
      const color = this.calculateEdgeColor(edge.type);
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label || this.getRelationshipTypeLabel(edge.type),
        data: {
          ...edge,
          color: color
        }
      };
    });
  }

  /**
   * Calcule la couleur d'un nœud selon son type (appelé une seule fois)
   */
  private calculateNodeColor(type: CharacterNodeType): string {
    switch (type) {
      case CharacterNodeType.Current:
        return '#3b82f6'; // Bleu
      case CharacterNodeType.Player:
        return '#10b981'; // Vert
      case CharacterNodeType.NPC:
        return '#6b7280'; // Gris
      default:
        return '#9ca3af';
    }
  }

  /**
   * Calcule la couleur d'une relation selon son type (appelé une seule fois)
   */
  private calculateEdgeColor(type: RelationshipType): string {
    switch (type) {
      case RelationshipType.Friend:
      case RelationshipType.Love:
      case RelationshipType.Ally:
        return '#10b981'; // Vert
      case RelationshipType.Enemy:
      case RelationshipType.Rival:
        return '#ef4444'; // Rouge
      case RelationshipType.Family:
        return '#8b5cf6'; // Violet
      case RelationshipType.Mentor:
        return '#f59e0b'; // Orange
      case RelationshipType.Mysterious:
        return '#64748b'; // Gris foncé
      default:
        return '#6b7280'; // Gris
    }
  }

  /**
   * Obtenir le label d'un type de relation
   */
  getRelationshipTypeLabel(type: RelationshipType): string {
    const labels: Record<RelationshipType, string> = {
      [RelationshipType.Family]: 'Famille',
      [RelationshipType.Friend]: 'Ami',
      [RelationshipType.Colleague]: 'Collègue',
      [RelationshipType.Rival]: 'Rival',
      [RelationshipType.Enemy]: 'Ennemi',
      [RelationshipType.Love]: 'Amour',
      [RelationshipType.Mentor]: 'Mentor',
      [RelationshipType.Acquaintance]: 'Connaissance',
      [RelationshipType.Ally]: 'Allié',
      [RelationshipType.Mysterious]: 'Mystérieux',
      [RelationshipType.Custom]: 'Personnalisé'
    };
    return labels[type] || type;
  }

  /**
   * Ouvrir le formulaire d'ajout de nœud
   */
  openAddNodeForm(): void {
    this.newNode = {
      type: CharacterNodeType.NPC,
      isAlive: true
    };
    this.showAddNodeForm = true;
  }

  /**
   * Annuler l'ajout de nœud
   */
  cancelAddNode(): void {
    this.newNode = {};
    this.showAddNodeForm = false;
  }

  /**
   * Ajouter un nouveau nœud
   */
  addNode(): void {
    if (!this.newNode.label || !this.newNode.type) {
      return;
    }

    const node: RelationshipNode = {
      id: this.relationshipService.generateNodeId(),
      label: this.newNode.label,
      type: this.newNode.type,
      description: this.newNode.description,
      occupation: this.newNode.occupation,
      isAlive: this.newNode.isAlive ?? true
    };

    this.relationshipGraph = this.relationshipService.addNode(this.relationshipGraph, node);
    this.updateCharacterAndDisplay();
    this.cancelAddNode();
  }

  /**
   * Ouvrir le formulaire d'ajout de relation
   */
  openAddEdgeForm(): void {
    if (this.relationshipGraph.nodes.length < 2) {
      alert('Vous devez avoir au moins 2 personnages pour créer une relation');
      return;
    }

    this.newEdge = {
      type: RelationshipType.Friend,
      strength: 5,
      isDirected: false
    };
    this.showAddEdgeForm = true;
  }

  /**
   * Annuler l'ajout de relation
   */
  cancelAddEdge(): void {
    this.newEdge = {};
    this.showAddEdgeForm = false;
  }

  /**
   * Ajouter une nouvelle relation
   */
  addEdge(): void {
    if (!this.newEdge.source || !this.newEdge.target || !this.newEdge.type) {
      return;
    }

    const edge: RelationshipEdge = {
      id: this.relationshipService.generateEdgeId(),
      source: this.newEdge.source,
      target: this.newEdge.target,
      type: this.newEdge.type,
      label: this.newEdge.label,
      description: this.newEdge.description,
      strength: this.newEdge.strength ?? 5,
      isDirected: this.newEdge.isDirected ?? false,
      customTypeName: this.newEdge.customTypeName
    };

    this.relationshipGraph = this.relationshipService.addEdge(this.relationshipGraph, edge);
    this.updateCharacterAndDisplay();
    this.cancelAddEdge();
  }

  /**
   * Sélectionner un nœud pour l'éditer
   */
  onNodeSelect(event: Node): void {
    this.selectedNode = event.data as RelationshipNode;
    this.showEditNodeForm = true;
  }

  /**
   * Sélectionner une relation pour l'éditer
   */
  onEdgeSelect(event: Edge): void {
    this.selectedEdge = event.data as RelationshipEdge;
    this.showEditEdgeForm = true;
  }

  /**
   * Mettre à jour un nœud
   */
  updateNode(): void {
    if (!this.selectedNode) return;

    this.relationshipGraph = this.relationshipService.updateNode(
      this.relationshipGraph,
      this.selectedNode.id,
      this.selectedNode
    );
    this.updateCharacterAndDisplay();
    this.closeEditNodeForm();
  }

  /**
   * Supprimer un nœud
   */
  deleteNode(): void {
    if (!this.selectedNode) return;

    if (this.selectedNode.type === CharacterNodeType.Current) {
      alert('Vous ne pouvez pas supprimer votre propre personnage');
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer ${this.selectedNode.label} et toutes ses relations ?`)) {
      this.relationshipGraph = this.relationshipService.removeNode(
        this.relationshipGraph,
        this.selectedNode.id
      );
      this.updateCharacterAndDisplay();
      this.closeEditNodeForm();
    }
  }

  /**
   * Fermer le formulaire d'édition de nœud
   */
  closeEditNodeForm(): void {
    this.selectedNode = null;
    this.showEditNodeForm = false;
  }

  /**
   * Mettre à jour une relation
   */
  updateEdge(): void {
    if (!this.selectedEdge) return;

    this.relationshipGraph = this.relationshipService.updateEdge(
      this.relationshipGraph,
      this.selectedEdge.id,
      this.selectedEdge
    );
    this.updateCharacterAndDisplay();
    this.closeEditEdgeForm();
  }

  /**
   * Supprimer une relation
   */
  deleteEdge(): void {
    if (!this.selectedEdge) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette relation ?')) {
      this.relationshipGraph = this.relationshipService.removeEdge(
        this.relationshipGraph,
        this.selectedEdge.id
      );
      this.updateCharacterAndDisplay();
      this.closeEditEdgeForm();
    }
  }

  /**
   * Fermer le formulaire d'édition de relation
   */
  closeEditEdgeForm(): void {
    this.selectedEdge = null;
    this.showEditEdgeForm = false;
  }

  /**
   * Mettre à jour le personnage et l'affichage
   */
  updateCharacterAndDisplay(): void {
    this.character.relationships = this.relationshipGraph;
    this.characterChange.emit(this.character);
    this.updateGraphDisplay();
    this.cdr.markForCheck();
  }

  /**
   * Sauvegarder les modifications
   */
  saveChanges(): void {
    this.updateCharacterAndDisplay();
    this.saveCharacterData();
    this.cdr.markForCheck();
  }

  /**
   * Annuler les modifications
   */
  cancelChanges(): void {
    this.cancelEdit();
  }

  /**
   * Recentrer le graphe
   */
  centerGraph(): void {
    this.graphConfig = {
      ...this.graphConfig,
      autoCenter: true
    };
  }

  /**
   * Changer le layout du graphe
   */
  changeLayout(layout: string): void {
    this.graphConfig = {
      ...this.graphConfig,
      layout: layout as any
    };
  }
}
