import { Injectable } from '@angular/core';

/**
 * Service to manage drag and drop state across different components
 * Tracks which item is being dragged in each drag-drop group
 */
@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  private draggingIndexMap: Map<string, number | null> = new Map();

  setDraggingIndex(index: number, group: string = 'default'): void {
    this.draggingIndexMap.set(group, index);
  }

  getDraggingIndex(group: string = 'default'): number | null {
    return this.draggingIndexMap.get(group) ?? null;
  }

  clearDraggingIndex(group: string = 'default'): void {
    this.draggingIndexMap.set(group, null);
  }

  clearAll(): void {
    this.draggingIndexMap.clear();
  }
}
