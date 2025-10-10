import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterImportExportService, ValidationError } from '../../../services/character-import-export.service';
import { CharacterSheet } from '../../../models/character.model';
import { DynamicTranslatePipe } from '../../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-yaml-editor',
  imports: [CommonModule, FormsModule, DynamicTranslatePipe],
  templateUrl: './yaml-editor.component.html',
  styleUrl: './yaml-editor.component.css'
})
export class YamlEditorComponent implements OnChanges {
  @Input() character: CharacterSheet | null = null;
  @Input() readonly: boolean = false;
  @Output() characterChange = new EventEmitter<CharacterSheet>();
  @Output() validationChange = new EventEmitter<boolean>();

  yamlContent: string = '';
  validationErrors: ValidationError[] = [];
  isValid: boolean = true;

  constructor(private importExportService: CharacterImportExportService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['character'] && this.character) {
      this.yamlContent = this.importExportService.exportToYaml(this.character);
      this.validateContent();
    }
  }

  onContentChange(): void {
    if (this.readonly) {
      return;
    }
    this.validateContent();
  }

  private validateContent(): void {
    this.validationErrors = this.importExportService.validateYaml(this.yamlContent);
    this.isValid = this.validationErrors.length === 0;
    this.validationChange.emit(this.isValid);

    if (this.isValid) {
      const result = this.importExportService.importFromYaml(this.yamlContent);
      if (result.success && result.character) {
        this.characterChange.emit(result.character);
      }
    }
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.yamlContent).then(() => {
      // Could show a toast notification here
      console.log('YAML copied to clipboard');
    });
  }

  downloadYaml(): void {
    if (this.character) {
      this.importExportService.downloadCharacterYaml(this.character);
    }
  }
}
