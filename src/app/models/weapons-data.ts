import { Weapon } from './character.model';

/**
 * Predefined weapons list based on Call of Cthulhu rules
 * Source: https://roll20.net/compendium/coc/Ammunition%20&%20Weapons#content
 */

// Default unarmed combat weapon - always available
export const UNARMED_WEAPON: Weapon = {
  id: 'unarmed',
  skillUsed: 'fightingBrawl',
  damage: '1D3+DB', // DB = Damage Bonus from build
  range: '-',
  rate: '1',
  capacity: '-',
  malfunction: '-',
  cost: '-'
};

// Hand-to-Hand / Melee Weapons
export const MELEE_WEAPONS: Weapon[] = [
  {
    id: 'bowAndArrows',
    skillUsed: 'firearmsBowCrossbow',
    damage: '1D6+half DB',
    range: '30 yards',
    rate: '1',
    capacity: '1',
    malfunction: '97',
    cost: '$7'
  },
  {
    id: 'brassKnuckles',
    skillUsed: 'fightingBrawl',
    damage: '1D3+1+DB',
    range: '-',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '$1'
  },
  {
    id: 'bullwhip',
    skillUsed: 'fightingWhip',
    damage: '1D3+half DB',
    range: '10 feet',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '$5'
  },
  {
    id: 'burningTorch',
    skillUsed: 'fightingBrawl',
    damage: '1D6+burn',
    range: '-',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '$0.05'
  },
  {
    id: 'blackjack',
    skillUsed: 'fightingBrawl',
    damage: '1D8+DB',
    range: '-',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '$2'
  },
  {
    id: 'clubLarge',
    skillUsed: 'fightingBrawl',
    damage: '1D8+DB',
    range: '-',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '$3'
  },
  {
    id: 'clubSmall',
    skillUsed: 'fightingBrawl',
    damage: '1D6+DB',
    range: '-',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '$3'
  },
  {
    id: 'crossbow',
    skillUsed: 'firearmsBowCrossbow',
    damage: '1D8+2',
    range: '50 yards',
    rate: '1/2',
    capacity: '1',
    malfunction: '96',
    cost: '$10'
  },
  {
    id: 'garrote',
    skillUsed: 'fightingGarrote',
    damage: '1D6+DB',
    range: '-',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '$0.50'
  },
  {
    id: 'hatchet',
    skillUsed: 'fightingAxe',
    damage: '1D6+1+DB',
    range: '-',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '$3'
  },
  {
    id: 'knifeLarge',
    skillUsed: 'fightingBrawl',
    damage: '1D8+DB',
    range: '-',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '$4'
  },
  {
    id: 'knifeMedium',
    skillUsed: 'fightingBrawl',
    damage: '1D4+2+DB',
    range: '-',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '$2'
  },
  {
    id: 'knifeSmall',
    skillUsed: 'fightingBrawl',
    damage: '1D4+DB',
    range: '-',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '$2'
  },
  {
    id: 'nunchaku',
    skillUsed: 'fightingFlail',
    damage: '1D8+DB',
    range: '-',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '$1'
  },
  {
    id: 'rockThrown',
    skillUsed: 'throw',
    damage: '1D4+half DB',
    range: 'STR/5 yards',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '-'
  },
  {
    id: 'shuriken',
    skillUsed: 'throw',
    damage: '1D3+half DB',
    range: 'STR/5 yards',
    rate: '2',
    capacity: 'One Use',
    malfunction: '100',
    cost: '$0.50'
  },
  {
    id: 'spearLance',
    skillUsed: 'fightingSpear',
    damage: '1D8+1+DB',
    range: '-',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '$25'
  },
  {
    id: 'spearThrown',
    skillUsed: 'throw',
    damage: '1D8+half DB',
    range: 'STR/5 yards',
    rate: '1',
    capacity: '-',
    malfunction: '-',
    cost: '$1'
  }
];

// Handguns
export const HANDGUNS: Weapon[] = [
  {
    id: 'handgun22Short',
    skillUsed: 'firearmsHandgun',
    damage: '1D6',
    range: '10 yards',
    rate: '1 (3)',
    capacity: '6',
    malfunction: '100',
    cost: '$25'
  },
  {
    id: 'handgun25Derringer',
    skillUsed: 'firearmsHandgun',
    damage: '1D6',
    range: '3 yards',
    rate: '1',
    capacity: '1',
    malfunction: '100',
    cost: '$12'
  },
  {
    id: 'handgun32Revolver',
    skillUsed: 'firearmsHandgun',
    damage: '1D8',
    range: '15 yards',
    rate: '1 (3)',
    capacity: '6',
    malfunction: '100',
    cost: '$15'
  },
  {
    id: 'handgun32Automatic',
    skillUsed: 'firearmsHandgun',
    damage: '1D8',
    range: '15 yards',
    rate: '1 (3)',
    capacity: '8',
    malfunction: '99',
    cost: '$20'
  },
  {
    id: 'handgunLuger',
    skillUsed: 'firearmsHandgun',
    damage: '1D10',
    range: '15 yards',
    rate: '1 (3)',
    capacity: '8',
    malfunction: '99',
    cost: '$75'
  },
  {
    id: 'handgun45Revolver',
    skillUsed: 'firearmsHandgun',
    damage: '1D10+2',
    range: '15 yards',
    rate: '1 (3)',
    capacity: '6',
    malfunction: '100',
    cost: '$30'
  },
  {
    id: 'handgun45Automatic',
    skillUsed: 'firearmsHandgun',
    damage: '1D10+2',
    range: '15 yards',
    rate: '1 (3)',
    capacity: '7',
    malfunction: '100',
    cost: '$40'
  }
];

// Rifles
export const RIFLES: Weapon[] = [
  {
    id: 'rifle22Bolt',
    skillUsed: 'firearmsRifle',
    damage: '1D6+1',
    range: '30 yards',
    rate: '1',
    capacity: '6',
    malfunction: '99',
    cost: '$13'
  },
  {
    id: 'rifle30LeverAction',
    skillUsed: 'firearmsRifle',
    damage: '2D6',
    range: '50 yards',
    rate: '1',
    capacity: '6',
    malfunction: '98',
    cost: '$19'
  },
  {
    id: 'rifle45MartiniHenry',
    skillUsed: 'firearmsRifle',
    damage: '1D8+1D6+3',
    range: '80 yards',
    rate: '1/3',
    capacity: '1',
    malfunction: '100',
    cost: '$20'
  },
  {
    id: 'rifleMoranAir',
    skillUsed: 'firearmsRifle',
    damage: '2D6+1',
    range: '20 yards',
    rate: '1/3',
    capacity: '1',
    malfunction: '88',
    cost: '$200'
  },
  {
    id: 'rifle303LeeEnfield',
    skillUsed: 'firearmsRifle',
    damage: '2D6+4',
    range: '110 yards',
    rate: '1',
    capacity: '10',
    malfunction: '100',
    cost: '$50'
  },
  {
    id: 'rifle3006Bolt',
    skillUsed: 'firearmsRifle',
    damage: '2D6+4',
    range: '110 yards',
    rate: '1',
    capacity: '5',
    malfunction: '100',
    cost: '$75'
  },
  {
    id: 'rifleElephantGun',
    skillUsed: 'firearmsRifle',
    damage: '3D6+4',
    range: '100 yards',
    rate: '1 or 2',
    capacity: '2',
    malfunction: '100',
    cost: '$400'
  }
];

// Shotguns
export const SHOTGUNS: Weapon[] = [
  {
    id: 'shotgun20Gauge',
    skillUsed: 'firearmsShotgun',
    damage: '2D6/1D6/1D3',
    range: '10/20/50 yards',
    rate: '1 or 2',
    capacity: '2',
    malfunction: '100',
    cost: '$35'
  },
  {
    id: 'shotgun16Gauge',
    skillUsed: 'firearmsShotgun',
    damage: '2D6+2/1D6+1/1D4',
    range: '10/20/50 yards',
    rate: '1 or 2',
    capacity: '2',
    malfunction: '100',
    cost: '$40'
  },
  {
    id: 'shotgun12Gauge',
    skillUsed: 'firearmsShotgun',
    damage: '4D6/2D6/1D6',
    range: '10/20/50 yards',
    rate: '1 or 2',
    capacity: '2',
    malfunction: '100',
    cost: '$40'
  },
  {
    id: 'shotgun12GaugeSemiAuto',
    skillUsed: 'firearmsShotgun',
    damage: '4D6/2D6/1D6',
    range: '10/20/50 yards',
    rate: '1 (2)',
    capacity: '5',
    malfunction: '100',
    cost: '$45'
  },
  {
    id: 'shotgun12GaugeSawedOff',
    skillUsed: 'firearmsShotgun',
    damage: '4D6/1D6',
    range: '5/10 yards',
    rate: '1 or 2',
    capacity: '2',
    malfunction: '100',
    cost: 'N/A'
  }
];

// Submachine Guns
export const SUBMACHINE_GUNS: Weapon[] = [
  {
    id: 'smgBergmann',
    skillUsed: 'firearmsSubmachineGun',
    damage: '1D10',
    range: '20 yards',
    rate: '1 (2) or full auto',
    capacity: '20/30/32',
    malfunction: '96',
    cost: '$1,000'
  },
  {
    id: 'smgThompson',
    skillUsed: 'firearmsSubmachineGun',
    damage: '1D10+2',
    range: '20 yards',
    rate: '1 or full auto',
    capacity: '20/30/50',
    malfunction: '96',
    cost: '$200+'
  }
];

// Machine Guns
export const MACHINE_GUNS: Weapon[] = [
  {
    id: 'mgBrowningAuto',
    skillUsed: 'firearmsMachineGun',
    damage: '2D6+4',
    range: '90 yards',
    rate: '1 (2) or full auto',
    capacity: '20',
    malfunction: '100',
    cost: '$800'
  },
  {
    id: 'mgBrowning30',
    skillUsed: 'firearmsMachineGun',
    damage: '2D6+4',
    range: '150 yards',
    rate: 'Full auto',
    capacity: '250',
    malfunction: '96',
    cost: '$3,000'
  },
  {
    id: 'mgBrenGun',
    skillUsed: 'firearmsMachineGun',
    damage: '2D6+4',
    range: '110 yards',
    rate: '1 or full auto',
    capacity: '30/100',
    malfunction: '96',
    cost: '$3,000'
  },
  {
    id: 'mgLewisGun',
    skillUsed: 'firearmsMachineGun',
    damage: '2D6+4',
    range: '110 yards',
    rate: 'Full auto',
    capacity: '47/97',
    malfunction: '96',
    cost: '$3,000'
  },
  {
    id: 'mgVickers303',
    skillUsed: 'firearmsMachineGun',
    damage: '2D6+4',
    range: '110 yards',
    rate: 'Full auto',
    capacity: '250',
    malfunction: '96',
    cost: 'N/A'
  }
];

// All weapons combined for easy selection
export const ALL_WEAPONS: Weapon[] = [
  ...MELEE_WEAPONS,
  ...HANDGUNS,
  ...RIFLES,
  ...SHOTGUNS,
  ...SUBMACHINE_GUNS,
  ...MACHINE_GUNS
];

// Weapon categories for organized display
export const WEAPON_CATEGORIES = {
  melee: MELEE_WEAPONS,
  handgun: HANDGUNS,
  rifle: RIFLES,
  shotgun: SHOTGUNS,
  smg: SUBMACHINE_GUNS,
  mg: MACHINE_GUNS
};
