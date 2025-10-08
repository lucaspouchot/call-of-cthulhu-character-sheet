import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { DragDropService } from '../services/drag-drop.service';

export interface DragDropEvent {
  fromIndex: number;
  toIndex: number;
}

@Directive({
  selector: '[appDragDrop]',
  standalone: true
})
export class DragDropDirective implements OnInit, OnDestroy, OnChanges {
  @Input() dragDropIndex!: number;
  @Input() dragDropGroup: string = 'default';
  @Input() dragDropDisabled: boolean = false;
  @Output() dragDropReorder = new EventEmitter<DragDropEvent>();

  private isDragging = false;
  private touchStartY = 0;
  private dragThreshold = 10; // pixels to move before considering it a drag
  private hasMoved = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private dragDropService: DragDropService
  ) { }

  ngOnInit() {
    this.updateDraggableState();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dragDropDisabled']) {
      this.updateDraggableState();
    }
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private updateDraggableState() {
    if (this.dragDropDisabled) {
      this.renderer.setAttribute(this.el.nativeElement, 'draggable', 'false');
      this.renderer.removeClass(this.el.nativeElement, 'drag-drop-item');
    } else {
      this.renderer.setAttribute(this.el.nativeElement, 'draggable', 'true');
      this.renderer.addClass(this.el.nativeElement, 'drag-drop-item');
    }
  }

  // Desktop drag events
  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    if (this.dragDropDisabled) {
      event.preventDefault();
      return;
    }

    this.isDragging = true;
    this.dragDropService.setDraggingIndex(this.dragDropIndex, this.dragDropGroup);

    this.renderer.addClass(this.el.nativeElement, 'dragging');

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', this.el.nativeElement.innerHTML);
    }
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    if (this.dragDropDisabled) return;

    this.cleanup();
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    if (this.dragDropDisabled) return;

    if (event.preventDefault) {
      event.preventDefault();
    }

    const draggingIndex = this.dragDropService.getDraggingIndex(this.dragDropGroup);
    if (draggingIndex !== null && draggingIndex !== this.dragDropIndex) {
      this.renderer.addClass(this.el.nativeElement, 'drag-over');
    }

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }

    return false;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    if (this.dragDropDisabled) return;
    this.renderer.removeClass(this.el.nativeElement, 'drag-over');
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    if (this.dragDropDisabled) return;

    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (event.preventDefault) {
      event.preventDefault();
    }

    const draggingIndex = this.dragDropService.getDraggingIndex(this.dragDropGroup);

    if (draggingIndex !== null && draggingIndex !== this.dragDropIndex) {
      this.dragDropReorder.emit({
        fromIndex: draggingIndex,
        toIndex: this.dragDropIndex
      });
    }

    this.renderer.removeClass(this.el.nativeElement, 'drag-over');
    return false;
  }

  // Mobile touch events
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (this.dragDropDisabled) return;

    this.touchStartY = event.touches[0].clientY;
    this.hasMoved = false;

    // Add a small delay to distinguish between tap and drag
    setTimeout(() => {
      if (!this.hasMoved && !this.dragDropDisabled) {
        this.isDragging = true;
        this.dragDropService.setDraggingIndex(this.dragDropIndex, this.dragDropGroup);
        this.renderer.addClass(this.el.nativeElement, 'dragging');
        this.renderer.addClass(this.el.nativeElement, 'touch-dragging');
      }
    }, 200);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.dragDropDisabled) return;

    const currentY = event.touches[0].clientY;
    const deltaY = Math.abs(currentY - this.touchStartY);

    if (deltaY > this.dragThreshold) {
      this.hasMoved = true;
    }

    if (this.isDragging) {
      event.preventDefault(); // Prevent scrolling while dragging

      const touch = event.touches[0];
      const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);

      if (elementAtPoint && elementAtPoint !== this.el.nativeElement) {
        const dropTarget = this.findDragDropParent(elementAtPoint);
        if (dropTarget) {
          const allItems = Array.from(document.querySelectorAll(`[data-drag-group="${this.dragDropGroup}"]`));
          allItems.forEach(item => this.renderer.removeClass(item, 'drag-over'));
          this.renderer.addClass(dropTarget, 'drag-over');
        }
      }
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    if (this.dragDropDisabled) return;

    if (this.isDragging && this.hasMoved) {
      const touch = event.changedTouches[0];
      const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);

      if (elementAtPoint) {
        const dropTarget = this.findDragDropParent(elementAtPoint);
        if (dropTarget) {
          const toIndexStr = dropTarget.getAttribute('data-drag-index');
          if (toIndexStr) {
            const toIndex = parseInt(toIndexStr, 10);
            const draggingIndex = this.dragDropService.getDraggingIndex(this.dragDropGroup);

            if (draggingIndex !== null && draggingIndex !== toIndex) {
              this.dragDropReorder.emit({
                fromIndex: draggingIndex,
                toIndex: toIndex
              });
            }
          }
        }
      }
    }

    this.cleanup();
  }

  @HostListener('touchcancel', ['$event'])
  onTouchCancel(event: TouchEvent) {
    if (this.dragDropDisabled) return;
    this.cleanup();
  }

  private findDragDropParent(element: Element): Element | null {
    let current: Element | null = element;
    while (current && current !== document.body) {
      if (current.hasAttribute('data-drag-group') &&
        current.getAttribute('data-drag-group') === this.dragDropGroup) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }

  private cleanup() {
    this.isDragging = false;
    this.hasMoved = false;
    this.dragDropService.clearDraggingIndex(this.dragDropGroup);

    this.renderer.removeClass(this.el.nativeElement, 'dragging');
    this.renderer.removeClass(this.el.nativeElement, 'drag-over');
    this.renderer.removeClass(this.el.nativeElement, 'touch-dragging');

    // Clean up all drag-over states
    const allItems = document.querySelectorAll(`[data-drag-group="${this.dragDropGroup}"]`);
    allItems.forEach(item => {
      this.renderer.removeClass(item, 'drag-over');
    });
  }
}
