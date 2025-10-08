import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicTranslatePipe } from '../../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTranslatePipe],
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.css'
})
export class DeleteConfirmationComponent implements OnInit, OnChanges {
  @Input() itemName: string = '';
  @Input() itemType: string = 'item'; // 'character', 'skill', etc.

  @Output() confirmationValidChange = new EventEmitter<boolean>();

  confirmationInput: string = '';
  isValid: boolean = false;

  ngOnInit(): void {
    this.resetValidation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemName']) {
      this.resetValidation();
    }
  }

  private resetValidation(): void {
    this.confirmationInput = '';
    this.isValid = false;
    // Emit only once during reset
    this.confirmationValidChange.emit(false);
  }

  onInputChange(): void {
    const newIsValid = this.confirmationInput.trim().toLowerCase() === this.itemName.trim().toLowerCase();
    // Only emit if the validation state actually changed
    if (this.isValid !== newIsValid) {
      this.isValid = newIsValid;
      this.confirmationValidChange.emit(this.isValid);
    }
  }
}
