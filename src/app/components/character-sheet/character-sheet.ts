import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { DiceRollingService } from '../../services/dice-rolling.service';
import { EntityTranslationService } from '../../services/entity-translation.service';
import { TranslationService } from '../../services/translation.service';
import { CharacterSheet as CharacterModel, Sex, Skill, TemporaryModifier } from '../../models/character.model';
import { DiceRoll } from '../../models/dice.model';
import { OCCUPATIONS } from '../../models/skills.model';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher';
import { DynamicTranslatePipe } from '../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-character-sheet',
  imports: [CommonModule, FormsModule, LanguageSwitcherComponent, DynamicTranslatePipe],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.css'
})
export class CharacterSheetComponent implements OnInit {
  character: CharacterModel | null = null;
  rollHistory: DiceRoll[] = [];
  showDiceHistory = false;

  // Make Sex enum available in template
  sexValues = Sex;

  // Make occupations available in template
  occupations = OCCUPATIONS;

  // Editing modes
  editMode = {
    basicInfo: false,
    attributes: false,
    skills: false,
    skillPoints: false,
    combat: false,
    personal: false,
    health: false,
    finance: false,
    financeEntries: false
  };

  // Modifier management
  showModifiers = {
    hitPoints: false,
    sanity: false,
    magicPoints: false,
    luck: false
  };

  newModifier = {
    hitPoints: { name: '', value: 0, description: '' },
    sanity: { name: '', value: 0, description: '' },
    magicPoints: { name: '', value: 0, description: '' },
    luck: { name: '', value: 0, description: '' }
  };

  // Skill modifier management
  showSkillModifiers: { [skillId: string]: boolean } = {};
  newSkillModifier: { [skillId: string]: { name: string, value: number } } = {};

  // Finance management
  newFinanceEntry = {
    description: '',
    amount: 0,
    type: 'expense' as 'expense' | 'income',
    target: 'cash' as 'cash' | 'assets'
  };

  showFinanceHistory = true;

  // Store original values for cancel functionality
  originalCharacter: CharacterModel | null = null;

  // Show recalculation notification
  showRecalculationNotice = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService,
    private diceService: DiceRollingService,
    private entityTranslationService: EntityTranslationService,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    const characterId = this.route.snapshot.paramMap.get('id');
    if (characterId) {
      this.loadCharacter(characterId);
    }

    this.diceService.getHistory().subscribe(history => {
      this.rollHistory = history;
    });
  }

  loadCharacter(id: string) {
    const character = this.characterService.getCharacterById(id);
    this.character = character || null;
    if (!this.character) {
      this.router.navigate(['/']);
    }
  }

  toggleEditMode(section: keyof typeof this.editMode) {
    if (this.editMode[section]) {
      // Exit edit mode without saving
      this.editMode[section] = false;
      // Close all skill modifiers when exiting skills edit mode
      if (section === 'skills') {
        this.showSkillModifiers = {};
      }
      // Close all health modifiers when exiting health edit mode
      if (section === 'health') {
        this.showModifiers.hitPoints = false;
        this.showModifiers.sanity = false;
        this.showModifiers.magicPoints = false;
        this.showModifiers.luck = false;
      }
    } else {
      // Store original values before editing
      this.originalCharacter = this.character ? JSON.parse(JSON.stringify(this.character)) : null;
      this.editMode[section] = true;

      // Open all skill modifiers when entering skills edit mode
      if (section === 'skills' && this.character) {
        this.character.skills.forEach(skill => {
          this.showSkillModifiers[skill.id] = true;
          // Initialize new modifier for each skill
          if (!this.newSkillModifier[skill.id]) {
            this.newSkillModifier[skill.id] = { name: '', value: 0 };
          }
        });
      }

      // Open all health modifiers when entering health edit mode
      if (section === 'health') {
        this.showModifiers.hitPoints = true;
        this.showModifiers.sanity = true;
        this.showModifiers.magicPoints = true;
        this.showModifiers.luck = true;
      }
    }
  }

  cancelEdit(section: keyof typeof this.editMode) {
    if (this.originalCharacter && this.character) {
      // Restore original values
      this.character = JSON.parse(JSON.stringify(this.originalCharacter));
    }
    this.editMode[section] = false;

    // Close all skill modifiers when canceling skills edit mode
    if (section === 'skills') {
      this.showSkillModifiers = {};
    }
    // Close all health modifiers when canceling health edit mode
    if (section === 'health') {
      this.showModifiers.hitPoints = false;
      this.showModifiers.sanity = false;
      this.showModifiers.magicPoints = false;
      this.showModifiers.luck = false;
    }
    this.originalCharacter = null;
  }

  setAttributeValue(attrName: string, value: number) {
    if (!this.character) return;
    const attr = (this.character as any)[attrName];
    if (attr) {
      attr.value = value;
      attr.halfValue = Math.floor(value / 2);
      attr.fifthValue = Math.floor(value / 5);

      // Recalculate derived attributes immediately
      this.recalculateDerivedAttributes();

      // Show notification briefly
      this.showRecalculationNotice = true;
      setTimeout(() => {
        this.showRecalculationNotice = false;
      }, 2000);
    }
  }

  recalculateDerivedAttributes() {
    if (!this.character) return;

    // Calculate Hit Points (CON + SIZ) / 10
    const newHitPointsMax = Math.floor((this.character.constitution.value + this.character.size.value) / 10);
    const oldEffectiveHitPointsMax = this.getEffectiveMaximum('hitPoints');
    const currentHitPointsRatio = oldEffectiveHitPointsMax > 0 ? this.character.hitPoints.current / oldEffectiveHitPointsMax : 0;
    this.character.hitPoints.maximum = newHitPointsMax;
    // Maintain the same ratio based on effective maximum (with modifiers)
    const newEffectiveHitPointsMax = this.getEffectiveMaximum('hitPoints');
    this.character.hitPoints.current = Math.min(
      Math.floor(newEffectiveHitPointsMax * currentHitPointsRatio),
      newEffectiveHitPointsMax
    );

    // Calculate Sanity (POW)
    const newSanityMax = this.character.power.value;
    const oldEffectiveSanityMax = this.getEffectiveMaximum('sanity');
    const currentSanityRatio = oldEffectiveSanityMax > 0 ? this.character.sanity.current / oldEffectiveSanityMax : 0;
    this.character.sanity.maximum = newSanityMax;
    // Maintain the same ratio based on effective maximum (with modifiers)
    const newEffectiveSanityMax = this.getEffectiveMaximum('sanity');
    this.character.sanity.current = Math.min(
      Math.floor(newEffectiveSanityMax * currentSanityRatio),
      newEffectiveSanityMax
    );

    // Calculate Magic Points (POW / 5)
    const newMagicPointsMax = Math.floor(this.character.power.value / 5);
    const oldEffectiveMagicPointsMax = this.getEffectiveMaximum('magicPoints');
    const currentMagicPointsRatio = oldEffectiveMagicPointsMax > 0 ? this.character.magicPoints.current / oldEffectiveMagicPointsMax : 0;
    this.character.magicPoints.maximum = newMagicPointsMax;
    // Maintain the same ratio based on effective maximum (with modifiers)
    const newEffectiveMagicPointsMax = this.getEffectiveMaximum('magicPoints');
    this.character.magicPoints.current = Math.min(
      Math.floor(newEffectiveMagicPointsMax * currentMagicPointsRatio),
      newEffectiveMagicPointsMax
    );

    // Calculate Movement based on age and attributes
    const move = this.character.age < 40 ? 8 :
      this.character.age < 50 ? 7 :
        this.character.age < 60 ? 6 : 5;

    this.character.movement = {
      normal: move,
      running: move * 5,
      climbing: move / 2,
      swimming: move / 2
    };

    // Update skills that depend on attributes
    this.updateDerivedSkills();
  }

  updateDerivedSkills() {
    if (!this.character) return;

    this.character.skills = this.character.skills.map(skill => {
      let updatedSkill = { ...skill };

      // Update dodge skill (half DEX)
      if (skill.id === 'dodge') {
        updatedSkill.baseValue = this.character!.dexterity.halfValue;
        updatedSkill.totalValue = updatedSkill.baseValue + updatedSkill.personalValue + updatedSkill.occupationValue;
      }

      // Update Language (Own) skill (EDU)
      if (skill.id === 'languageOwn') {
        updatedSkill.baseValue = this.character!.education.value;
        updatedSkill.totalValue = updatedSkill.baseValue + updatedSkill.personalValue + updatedSkill.occupationValue;
      }

      return updatedSkill;
    });
  }

  getSkillTranslation(skill: Skill): string {
    return this.entityTranslationService.getSkillTranslation(skill);
  }

  getSexTranslation(sex: Sex): string {
    return this.entityTranslationService.getSexTranslation(sex);
  }

  getOccupationName(occupationId: string): string {
    return this.entityTranslationService.getOccupationName(occupationId);
  }

  saveCharacter() {
    if (this.character) {
      // Use the service's method to calculate derived attributes properly
      const derivedUpdates = this.characterService.calculateDerivedAttributes(this.character);
      Object.assign(this.character, derivedUpdates);

      this.characterService.updateCharacter(this.character.id, this.character);
      // Turn off all edit modes
      Object.keys(this.editMode).forEach(key => {
        this.editMode[key as keyof typeof this.editMode] = false;
      });
      // Close all skill modifiers
      this.showSkillModifiers = {};
      // Close all health modifiers
      this.showModifiers.hitPoints = false;
      this.showModifiers.sanity = false;
      this.showModifiers.magicPoints = false;
      this.showModifiers.luck = false;
      // Clear original character backup
      this.originalCharacter = null;
    }
  }

  // Method to handle age changes (called when age is modified in personal details)
  onAgeChange() {
    if (this.character) {
      this.recalculateDerivedAttributes();
    }
  }

  rollSkillCheck(skill: Skill) {
    const skillName = this.getSkillTranslation(skill);
    const roll = this.diceService.rollSkillCheck(skill.totalValue, skillName);
    this.showResultModal(roll);
  }

  rollCharacteristicCheck(attributeName: string, value: number) {
    const roll = this.diceService.rollCharacteristicCheck(value, attributeName);
    this.showResultModal(roll);
  }

  rollLuck() {
    if (this.character) {
      const roll = this.diceService.rollCharacteristicCheck(this.character.luck.current, 'Luck');
      this.showResultModal(roll);
    }
  }

  rollSanityCheck() {
    if (this.character) {
      const roll = this.diceService.rollCharacteristicCheck(this.character.sanity.current, 'Sanity');
      this.showResultModal(roll);
    }
  }

  private showResultModal(roll: DiceRoll) {
    // Use translation service for dynamic text
    const getTranslation = (key: string) => this.translationService.getTranslation(key) || key;

    // Simple alert for now - could be enhanced with a proper modal
    let message = `${roll.description}\n${getTranslation('character.sheet.rolled')}: ${roll.result}`;
    if (roll.target) {
      message += ` ${getTranslation('character.sheet.vs')} ${roll.target}%`;
      if (roll.criticalSuccess) {
        message += `\n🎯 ${getTranslation('character.sheet.critical')}`;
      } else if (roll.extremeSuccess) {
        message += `\n⭐ ${getTranslation('character.sheet.extreme')}`;
      } else if (roll.hardSuccess) {
        message += `\n💪 ${getTranslation('character.sheet.hard')}`;
      } else if (roll.regularSuccess) {
        message += `\n✅ ${getTranslation('character.sheet.regular')}`;
      } else if (roll.fumble) {
        message += `\n💀 ${getTranslation('character.sheet.fumble')}`;
      } else if (roll.failure) {
        message += `\n❌ ${getTranslation('character.sheet.failure')}`;
      }
    }
    alert(message);
  }

  adjustSanity(amount: number) {
    if (this.character) {
      const effectiveMax = this.getEffectiveMaximum('sanity');
      this.character.sanity.current = Math.max(0,
        Math.min(effectiveMax, this.character.sanity.current + amount)
      );
      this.saveCharacterState();
    }
  }

  adjustHitPoints(amount: number) {
    if (this.character) {
      const effectiveMax = this.getEffectiveMaximum('hitPoints');
      this.character.hitPoints.current = Math.max(0,
        Math.min(effectiveMax, this.character.hitPoints.current + amount)
      );
      this.saveCharacterState();
    }
  }

  adjustMagicPoints(amount: number) {
    if (this.character) {
      const effectiveMax = this.getEffectiveMaximum('magicPoints');
      this.character.magicPoints.current = Math.max(0,
        Math.min(effectiveMax, this.character.magicPoints.current + amount)
      );
      this.saveCharacterState();
    }
  }

  adjustLuck(amount: number) {
    if (this.character) {
      const effectiveMax = this.getEffectiveMaximum('luck');
      this.character.luck.current = Math.max(0,
        Math.min(effectiveMax, this.character.luck.current + amount)
      );
      this.saveCharacterState();
    }
  }

  // Save character state without recalculating derived attributes
  saveCharacterState() {
    if (this.character) {
      this.characterService.updateCharacter(this.character.id, this.character);
    }
  }

  getHealthPercentage(): number {
    if (!this.character) return 0;
    const effectiveMax = this.getEffectiveMaximum('hitPoints');
    return effectiveMax > 0 ? (this.character.hitPoints.current / effectiveMax) * 100 : 0;
  }

  getSanityPercentage(): number {
    if (!this.character) return 0;
    const effectiveMax = this.getEffectiveMaximum('sanity');
    return effectiveMax > 0 ? (this.character.sanity.current / effectiveMax) * 100 : 0;
  }

  getMagicPointsPercentage(): number {
    if (!this.character) return 0;
    const effectiveMax = this.getEffectiveMaximum('magicPoints');
    return effectiveMax > 0 ? (this.character.magicPoints.current / effectiveMax) * 100 : 0;
  }

  // Methods for managing temporary modifiers
  getEffectiveMaximum(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints'): number {
    if (!this.character) return 0;
    return this.characterService.getEffectiveMaximum(this.character, type);
  }

  toggleModifierView(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints') {
    this.showModifiers[type] = !this.showModifiers[type];
  }

  addModifier(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints') {
    if (!this.character || !this.newModifier[type].name.trim()) return;

    // Add modifier directly to character (don't save yet)
    const modifier: TemporaryModifier = {
      id: Date.now().toString(),
      name: this.newModifier[type].name.trim(),
      value: this.newModifier[type].value,
      description: this.newModifier[type].description.trim(),
      createdAt: new Date()
    };

    if (!this.character[type].modifiers) {
      this.character[type].modifiers = [];
    }
    this.character[type].modifiers.push(modifier);

    // Reset form
    this.newModifier[type] = { name: '', value: 0, description: '' };
  }

  removeModifier(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints', modifierId: string) {
    if (!this.character) return;

    // Remove modifier directly from character (don't save yet)
    if (this.character[type].modifiers) {
      this.character[type].modifiers = this.character[type].modifiers.filter(mod => mod.id !== modifierId);
    }
  }

  getModifiersSum(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints'): number {
    if (!this.character) return 0;
    return (this.character[type].modifiers || []).reduce((sum, mod) => sum + mod.value, 0);
  }

  // Skill modifier methods
  toggleSkillModifierView(skillId: string) {
    // Don't allow closing in skills edit mode
    if (this.editMode.skills) {
      return;
    }

    this.showSkillModifiers[skillId] = !this.showSkillModifiers[skillId];

    // Initialize the new modifier object for this skill if it doesn't exist
    if (!this.newSkillModifier[skillId]) {
      this.newSkillModifier[skillId] = { name: '', value: 0 };
    }
  } addSkillModifier(skillId: string) {
    if (!this.character || !this.newSkillModifier[skillId]?.name.trim()) return;

    const skill = this.character.skills.find(s => s.id === skillId);
    if (!skill) return;

    // Initialize modifiers array if it doesn't exist
    if (!skill.modifiers) {
      skill.modifiers = [];
    }

    // Add the new modifier
    skill.modifiers.push({
      id: Date.now().toString(),
      name: this.newSkillModifier[skillId].name.trim(),
      value: this.newSkillModifier[skillId].value,
      createdAt: new Date()
    });

    // Recalculate total value
    this.recalculateSkillTotal(skillId);

    // Reset form
    this.newSkillModifier[skillId] = { name: '', value: 0 };

    // Don't save automatically - changes are saved when user clicks Save button
  }

  removeSkillModifier(skillId: string, modifierIdentifier: string | 'occupation' | 'personal') {
    if (!this.character) return;

    const skill = this.character.skills.find(s => s.id === skillId);
    if (!skill) return;

    // Prevent removal of occupation and personal points
    if (modifierIdentifier === 'occupation' || modifierIdentifier === 'personal') {
      console.warn('Cannot remove occupation or personal skill points - they are permanent');
      return;
    }

    // Only remove temporary modifiers
    if (skill.modifiers) {
      skill.modifiers = skill.modifiers.filter(mod => mod.id !== modifierIdentifier);
    }

    // Recalculate total value
    this.recalculateSkillTotal(skillId);

    // Don't save automatically - changes are saved when user clicks Save button
  }

  getSkillModifiersSum(skillId: string): number {
    if (!this.character) return 0;

    const skill = this.character.skills.find(s => s.id === skillId);
    if (!skill) return 0;

    let sum = skill.occupationValue + skill.personalValue;
    if (skill.modifiers) {
      sum += skill.modifiers.reduce((total, mod) => total + mod.value, 0);
    }

    return sum;
  }

  private recalculateSkillTotal(skillId: string) {
    if (!this.character) return;

    const skill = this.character.skills.find(s => s.id === skillId);
    if (!skill) return;

    skill.totalValue = skill.baseValue + skill.occupationValue + skill.personalValue;
    if (skill.modifiers) {
      skill.totalValue += skill.modifiers.reduce((sum, mod) => sum + mod.value, 0);
    }
  }

  // Getter/Setter methods for new skill modifier form
  getNewSkillModifierName(skillId: string): string {
    if (!this.newSkillModifier[skillId]) {
      this.newSkillModifier[skillId] = { name: '', value: 0 };
    }
    return this.newSkillModifier[skillId].name;
  }

  setNewSkillModifierName(skillId: string, name: string) {
    if (!this.newSkillModifier[skillId]) {
      this.newSkillModifier[skillId] = { name: '', value: 0 };
    }
    this.newSkillModifier[skillId].name = name;
  }

  getNewSkillModifierValue(skillId: string): number {
    if (!this.newSkillModifier[skillId]) {
      this.newSkillModifier[skillId] = { name: '', value: 0 };
    }
    return this.newSkillModifier[skillId].value;
  }

  setNewSkillModifierValue(skillId: string, value: number) {
    if (!this.newSkillModifier[skillId]) {
      this.newSkillModifier[skillId] = { name: '', value: 0 };
    }
    this.newSkillModifier[skillId].value = value;
  }

  deleteCharacter() {
    if (this.character && confirm('Are you sure you want to delete this character?')) {
      this.characterService.deleteCharacter(this.character.id);
      this.router.navigate(['/']);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getAttributeValue(attrName: string): number {
    if (!this.character) return 0;
    const attr = (this.character as any)[attrName];
    return attr?.value || 0;
  }

  getAttributeHalfValue(attrName: string): number {
    if (!this.character) return 0;
    const attr = (this.character as any)[attrName];
    return attr?.halfValue || 0;
  }

  getAttributeFifthValue(attrName: string): number {
    if (!this.character) return 0;
    const attr = (this.character as any)[attrName];
    return attr?.fifthValue || 0;
  }

  getAttributeNames(): string[] {
    return ['strength', 'constitution', 'power', 'dexterity', 'appearance', 'size', 'intelligence', 'education'];
  }

  // Skills points management methods
  updateSkillValue(skillId: string, field: 'occupationValue' | 'personalValue', value: number) {
    if (!this.character) return;

    const skill = this.character.skills.find(s => s.id === skillId);
    if (!skill) return;

    const oldValue = skill[field];
    skill[field] = value;
    skill.totalValue = skill.baseValue + skill.occupationValue + skill.personalValue;

    // Update spent points counter
    if (field === 'occupationValue') {
      this.character.skillPoints.occupationPointsSpent += (value - oldValue);
    } else {
      this.character.skillPoints.personalPointsSpent += (value - oldValue);
    }

    this.saveCharacterState();
  }

  getRemainingSkillPoints(type: 'occupation' | 'personal'): number {
    if (!this.character) return 0;

    if (type === 'occupation') {
      return this.character.skillPoints.occupationPointsTotal - this.character.skillPoints.occupationPointsSpent;
    }
    return this.character.skillPoints.personalPointsTotal - this.character.skillPoints.personalPointsSpent;
  }

  canAssignSkillPoints(skillId: string, type: 'occupation' | 'personal'): boolean {
    if (!this.character) return false;

    if (type === 'occupation') {
      // Need to check if this skill is an occupation skill
      const occupation = OCCUPATIONS.find(occ => occ.id === this.character?.occupation);
      return occupation?.occupationSkills.includes(skillId) || false;
    }
    return true; // Personal points can be assigned to any skill
  }

  getSkillCurrentValue(skillId: string, type: 'occupation' | 'personal'): number {
    if (!this.character) return 0;

    const skill = this.character.skills.find(s => s.id === skillId);
    if (!skill) return 0;

    return type === 'occupation' ? skill.occupationValue : skill.personalValue;
  }

  getMaxSkillPointsForSkill(skillId: string, type: 'occupation' | 'personal'): number {
    if (!this.character) return 0;

    const currentValue = this.getSkillCurrentValue(skillId, type);
    const remainingPoints = this.getRemainingSkillPoints(type);

    return currentValue + remainingPoints;
  }

  // Finance management methods
  addFinanceEntry() {
    if (!this.character || !this.newFinanceEntry.description.trim()) return;

    // Initialize finance if it doesn't exist
    if (!this.character.finance) {
      this.character.finance = {
        creditRating: this.character.skillPoints?.creditRating || 0,
        spendingLevel: 0,
        cash: 0,
        assets: 0,
        expenseHistory: []
      };
    }

    const entry = {
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
    this.editMode.financeEntries = false;
  }

  removeFinanceEntry(entryId: string) {
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
  }

  toggleFinanceHistory() {
    this.showFinanceHistory = !this.showFinanceHistory;
  }

  getCreditRatingInfo(): any {
    if (!this.character?.finance) return null;

    const creditRating = this.character.finance.creditRating;

    if (creditRating >= 90) return { level: 'Magnifique', description: 'Richesse illimitée' };
    if (creditRating >= 80) return { level: 'Somptueux', description: 'Très riche' };
    if (creditRating >= 70) return { level: 'Luxueux', description: 'Riche' };
    if (creditRating >= 50) return { level: 'Confortable', description: 'Classe moyenne supérieure' };
    if (creditRating >= 30) return { level: 'Modeste', description: 'Classe moyenne' };
    if (creditRating >= 10) return { level: 'Pauvre', description: 'Classe ouvrière' };
    return { level: 'Misérable', description: 'Indigent' };
  }
}