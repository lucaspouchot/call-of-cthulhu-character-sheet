/**
 * JSON Schema for CharacterSheet validation
 * This schema is used to validate imported YAML files
 */
export const CHARACTER_SCHEMA_VERSION = 1;

export const CHARACTER_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  required: [
    "version",
    "id",
    "name",
    "player",
    "occupation",
    "age",
    "sex",
    "residence",
    "birthplace",
    "strength",
    "constitution",
    "power",
    "dexterity",
    "appearance",
    "size",
    "intelligence",
    "education",
    "hitPoints",
    "sanity",
    "healthStatus",
    "luck",
    "magicPoints",
    "movement",
    "skills",
    "skillPoints",
    "weapons",
    "armor",
    "equipment",
    "notes",
    "finance",
    "createdAt",
    "updatedAt"
  ],
  properties: {
    version: {
      type: "number",
      description: "Schema version for migration management"
    },
    id: {
      type: "string",
      description: "Unique character identifier"
    },
    name: {
      type: "string",
      description: "Character name"
    },
    player: {
      type: "string",
      description: "Player name"
    },
    occupation: {
      type: "string",
      description: "Character occupation"
    },
    age: {
      type: "number",
      minimum: 15,
      maximum: 90,
      description: "Character age"
    },
    sex: {
      type: "string",
      enum: ["male", "female", "other", "undefined"],
      description: "Character sex"
    },
    residence: {
      type: "string",
      description: "Place of residence"
    },
    birthplace: {
      type: "string",
      description: "Place of birth"
    },
    strength: {
      $ref: "#/definitions/Attribute"
    },
    constitution: {
      $ref: "#/definitions/Attribute"
    },
    power: {
      $ref: "#/definitions/Attribute"
    },
    dexterity: {
      $ref: "#/definitions/Attribute"
    },
    appearance: {
      $ref: "#/definitions/Attribute"
    },
    size: {
      $ref: "#/definitions/Attribute"
    },
    intelligence: {
      $ref: "#/definitions/Attribute"
    },
    education: {
      $ref: "#/definitions/Attribute"
    },
    hitPoints: {
      type: "object",
      required: ["maximum", "current", "majorWound", "modifiers"],
      properties: {
        maximum: { type: "number" },
        current: { type: "number" },
        majorWound: { type: "boolean" },
        modifiers: {
          type: "array",
          items: { $ref: "#/definitions/TemporaryModifier" }
        }
      }
    },
    sanity: {
      type: "object",
      required: ["maximum", "current", "startingValue", "losses", "modifiers"],
      properties: {
        maximum: { type: "number" },
        current: { type: "number" },
        startingValue: { type: "number" },
        losses: {
          type: "array",
          items: {
            type: "object",
            required: ["encounter", "loss", "date"],
            properties: {
              encounter: { type: "string" },
              loss: { type: "number" },
              date: { type: "string", format: "date-time" },
              details: { type: "string" }
            }
          }
        },
        modifiers: {
          type: "array",
          items: { $ref: "#/definitions/TemporaryModifier" }
        }
      }
    },
    healthStatus: {
      type: "object",
      required: ["unconscious", "dying", "majorInjury", "temporaryInsanity", "indefiniteInsanity"],
      properties: {
        unconscious: { type: "boolean" },
        dying: { type: "boolean" },
        majorInjury: { type: "boolean" },
        temporaryInsanity: { type: "boolean" },
        indefiniteInsanity: { type: "boolean" }
      }
    },
    luck: {
      type: "object",
      required: ["starting", "current", "modifiers"],
      properties: {
        starting: { type: "number" },
        current: { type: "number" },
        modifiers: {
          type: "array",
          items: { $ref: "#/definitions/TemporaryModifier" }
        }
      }
    },
    magicPoints: {
      type: "object",
      required: ["maximum", "current", "modifiers"],
      properties: {
        maximum: { type: "number" },
        current: { type: "number" },
        modifiers: {
          type: "array",
          items: { $ref: "#/definitions/TemporaryModifier" }
        }
      }
    },
    movement: {
      type: "object",
      required: ["normal", "running", "climbing", "swimming"],
      properties: {
        normal: { type: "number" },
        running: { type: "number" },
        climbing: { type: "number" },
        swimming: { type: "number" }
      }
    },
    skills: {
      type: "array",
      items: { $ref: "#/definitions/Skill" }
    },
    skillPoints: {
      type: "object",
      required: ["occupationPointsTotal", "occupationPointsSpent", "personalPointsTotal", "personalPointsSpent", "creditRating"],
      properties: {
        occupationPointsTotal: { type: "number" },
        occupationPointsSpent: { type: "number" },
        personalPointsTotal: { type: "number" },
        personalPointsSpent: { type: "number" },
        creditRating: { type: "number" }
      }
    },
    weapons: {
      type: "array",
      items: { $ref: "#/definitions/Weapon" }
    },
    armor: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "protection"],
        properties: {
          name: { type: "string" },
          protection: { type: "number" },
          penalty: { type: "number" }
        }
      }
    },
    equipment: {
      type: "array",
      items: { $ref: "#/definitions/EquipmentItem" }
    },
    notes: {
      type: "array",
      items: { $ref: "#/definitions/NoteItem" }
    },
    finance: {
      type: "object",
      required: ["creditRating", "spendingLevel", "cash", "assets", "expenseHistory"],
      properties: {
        creditRating: { type: "number" },
        spendingLevel: { type: "number" },
        cash: { type: "number" },
        assets: { type: "number" },
        expenseHistory: {
          type: "array",
          items: {
            type: "object",
            required: ["id", "description", "amount", "type", "target", "date"],
            properties: {
              id: { type: "string" },
              description: { type: "string" },
              amount: { type: "number" },
              type: { type: "string", enum: ["expense", "income"] },
              target: { type: "string", enum: ["cash", "assets"] },
              date: { type: "string", format: "date-time" }
            }
          }
        }
      }
    },
    backstory: { type: "string" },
    traits: { type: "string" },
    ideologyBeliefs: { type: "string" },
    significantPeople: { type: "string" },
    meaningfulLocations: { type: "string" },
    treasuredPossessions: { type: "string" },
    scarsInjuries: { type: "string" },
    phobiasManias: { type: "string" },
    occultTomes: { type: "string" },
    entityEncounters: { type: "string" },
    createdAt: {
      type: "string",
      format: "date-time",
      description: "Creation date"
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      description: "Last update date"
    }
  },
  definitions: {
    Attribute: {
      type: "object",
      required: ["value", "halfValue", "fifthValue"],
      properties: {
        value: { type: "number", minimum: 0, maximum: 100 },
        halfValue: { type: "number" },
        fifthValue: { type: "number" }
      }
    },
    Skill: {
      type: "object",
      required: ["id", "baseValue", "personalValue", "occupationValue", "totalValue"],
      properties: {
        id: { type: "string" },
        baseValue: { type: "number" },
        personalValue: { type: "number" },
        occupationValue: { type: "number" },
        totalValue: { type: "number" },
        description: { type: "string" },
        modifiers: {
          type: "array",
          items: { $ref: "#/definitions/TemporaryModifier" }
        },
        parentSkillId: { type: "string" },
        customName: { type: "string" },
        isCustom: { type: "boolean" }
      }
    },
    Weapon: {
      type: "object",
      required: ["id", "skillUsed", "damage", "range", "rate", "capacity", "malfunction"],
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        skillUsed: { type: "string" },
        damage: { type: "string" },
        range: { type: "string" },
        rate: { type: "string" },
        capacity: { type: "string" },
        malfunction: { type: "string" },
        cost: { type: "string" },
        isCustom: { type: "boolean" }
      }
    },
    EquipmentItem: {
      type: "object",
      required: ["id", "name"],
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        note: { type: "string" }
      }
    },
    NoteItem: {
      type: "object",
      required: ["id", "title", "description"],
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        description: { type: "string" }
      }
    },
    TemporaryModifier: {
      type: "object",
      required: ["id", "name", "value", "createdAt"],
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        value: { type: "number" },
        description: { type: "string" },
        createdAt: { type: "string", format: "date-time" }
      }
    }
  }
};
