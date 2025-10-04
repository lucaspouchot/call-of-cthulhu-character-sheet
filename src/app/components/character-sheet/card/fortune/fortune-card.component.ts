import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCardComponent } from '../base-card.component';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { TranslationService } from '../../../../services/translation.service';

interface FinanceEntry {
  id: string;
  description: string;
  amount: number;
  type: 'expense' | 'income';
  target: 'cash' | 'assets';
  date: Date;
}

@Component({
  selector: 'app-fortune-card',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTranslatePipe],
  templateUrl: './fortune-card.component.html',
  styleUrl: './fortune-card.component.css'
})
export class FortuneCardComponent extends BaseCardComponent {
  showFinanceHistory = true;
  showFinanceEntries = false;

  newFinanceEntry = {
    description: '',
    amount: 0,
    type: 'expense' as 'expense' | 'income',
    target: 'cash' as 'cash' | 'assets'
  };

  constructor(private translationService: TranslationService) {
    super();
  }

  protected getSectionName(): string {
    return 'finance';
  }

  protected saveOriginalData(): void {
    if (this.character) {
      this.originalData = {
        finance: this.character.finance ? {
          ...this.character.finance,
          expenseHistory: [...(this.character.finance.expenseHistory || [])]
        } : null
      };
    }
  }

  protected restoreOriginalData(): void {
    if (this.character && this.originalData) {
      this.character.finance = this.originalData.finance ? { ...this.originalData.finance } : null;
    }
  }

  getCreditRatingInfo(): any {
    const creditRating = this.getCreditRating();

    if (!creditRating) return null;

    if (creditRating >= 99) return { level: this.translationService.getTranslation("creditRating.levels.superRich.name"), description: this.translationService.getTranslation("creditRating.levels.superRich.description") };
    if (creditRating >= 90) return { level: this.translationService.getTranslation("creditRating.levels.rich.name"), description: this.translationService.getTranslation("creditRating.levels.rich.description") };
    if (creditRating >= 50) return { level: this.translationService.getTranslation("creditRating.levels.wealthy.name"), description: this.translationService.getTranslation("creditRating.levels.wealthy.description") };
    if (creditRating >= 10) return { level: this.translationService.getTranslation("creditRating.levels.average.name"), description: this.translationService.getTranslation("creditRating.levels.average.description") };
    if (creditRating >= 1) return { level: this.translationService.getTranslation("creditRating.levels.poor.name"), description: this.translationService.getTranslation("creditRating.levels.poor.description") };
    return { level: this.translationService.getTranslation("creditRating.levels.peniless.name"), description: this.translationService.getTranslation("creditRating.levels.peniless.description") };
  }

  getCreditRating(): number {
    if (this.character?.finance?.creditRating) {
      return this.character.finance.creditRating;
    }

    // Fallback to skillPoints if finance is not set
    if (this.character && (this.character as any).skillPoints?.creditRating) {
      return (this.character as any).skillPoints.creditRating;
    }

    return 0;
  }

  getSpendingLevel(): number {
    return this.character?.finance?.spendingLevel || 0;
  }

  getCash(): number {
    return this.character?.finance?.cash || 0;
  }

  getAssets(): number {
    return this.character?.finance?.assets || 0;
  }

  ensureFinanceExists(): void {
    if (!this.character?.finance) {
      if (this.character) {
        this.character.finance = {
          creditRating: (this.character as any).skillPoints?.creditRating || 0,
          spendingLevel: 0,
          cash: 0,
          assets: 0,
          expenseHistory: []
        };
      }
    }
  }

  override toggleEditMode(): void {
    this.ensureFinanceExists();
    super.toggleEditMode();
  }

  toggleFinanceHistory(): void {
    this.showFinanceHistory = !this.showFinanceHistory;
  }

  toggleFinanceEntries(): void {
    this.showFinanceEntries = !this.showFinanceEntries;
  }

  addFinanceEntry(): void {
    if (!this.character || !this.newFinanceEntry.description.trim()) return;

    // Initialize finance if it doesn't exist
    if (!this.character.finance) {
      this.character.finance = {
        creditRating: (this.character as any).skillPoints?.creditRating || 0,
        spendingLevel: 0,
        cash: 0,
        assets: 0,
        expenseHistory: []
      };
    }

    const entry: FinanceEntry = {
      id: Date.now().toString(),
      description: this.newFinanceEntry.description.trim(),
      amount: this.newFinanceEntry.amount,
      type: this.newFinanceEntry.type,
      target: this.newFinanceEntry.target,
      date: new Date()
    };

    this.character.finance.expenseHistory.push(entry);

    // Update current financial status based on target
    if (entry.type === 'expense') {
      if (this.newFinanceEntry.target === 'cash') {
        this.character.finance.cash = Math.max(0, this.character.finance.cash - entry.amount);
      } else {
        this.character.finance.assets = Math.max(0, this.character.finance.assets - entry.amount);
      }
    } else {
      if (this.newFinanceEntry.target === 'cash') {
        this.character.finance.cash += entry.amount;
      } else {
        this.character.finance.assets += entry.amount;
      }
    }

    // Reset form
    this.newFinanceEntry = {
      description: '',
      amount: 0,
      type: 'expense',
      target: 'cash'
    };

    // Close the finance entries mode after adding
    this.showFinanceEntries = false;

    this.characterChange.emit(this.character);
  }

  removeFinanceEntry(entryId: string): void {
    if (!this.character?.finance) return;

    const entry = this.character.finance.expenseHistory.find(e => e.id === entryId);
    if (!entry) return;

    // Reverse the financial impact using the stored target
    if (entry.type === 'expense') {
      // For expenses, add back the money to the original target
      if (entry.target === 'cash') {
        this.character.finance.cash += entry.amount;
      } else {
        this.character.finance.assets += entry.amount;
      }
    } else {
      // For income, remove the money from the original target
      if (entry.target === 'cash') {
        this.character.finance.cash = Math.max(0, this.character.finance.cash - entry.amount);
      } else {
        this.character.finance.assets = Math.max(0, this.character.finance.assets - entry.amount);
      }
    }

    // Remove the entry
    this.character.finance.expenseHistory = this.character.finance.expenseHistory.filter(e => e.id !== entryId);

    this.characterChange.emit(this.character);
  }
}