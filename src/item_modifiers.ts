import { AttributeModifierObject, DataComponentTypeID, config, datapack, AttributeID, ItemSlotID, nbt, NBTBase, TextObject } from "mcfn.ts"
import { assets, ENDERITE_ITEMS, upgradable_items, NETHERITE_ITEMS } from "./assets"
import { custom_data } from "./custom_data"

const random_uuid = {
  id: 0,
  gen(){
    return `${config.namespace}:_${this.id++}`;
  }
}

function upgrade(_id: NETHERITE_ITEMS, max_damage: number, attribute_modifiers?: AttributeModifierObject[], equippable?: object) {
    const id = _id.replace('netherite', 'enderite')! as ENDERITE_ITEMS
    const item_name_text = id
    .match(/[a-z0-9]+/g)?.map(x => {
      return x[0]?.toUpperCase() + x.slice(1)
    }).join(' ')

    const components: Partial<Record<DataComponentTypeID, any>> = {
        'custom_data': custom_data.enderite_upgrade,
        'item_model': assets.item_models[id],
        "item_name": {
            text: item_name_text!,
            color: 'dark_purple',
            italic: false
        } as TextObject,
        'attribute_modifiers': attribute_modifiers,
        "equippable": equippable,
        'max_damage': max_damage,
        "damage_resistant": {
          "types": "#is_fire"
        }
    }

    return datapack.item_modifier({
        function: 'set_components',
        components
    })
}

function upgrade_armored_elytra() {
    const components: Partial<Record<DataComponentTypeID, any>> = {
        'custom_data': custom_data.enderite_armored_elytra,
        'item_model': assets.item_models.enderite_armored_elytra,
        "item_name": {
            text: "Enderite Armored Elytra",
            color: 'dark_purple',
            italic: false
        } as TextObject,
        'attribute_modifiers': [
          ...equipment(8, 'chest'), ...elytra_attributes
        ],
        "equippable": {
          slot: "chest",
          asset_id: assets.equipments.armored_elytra
      },
      'max_damage': 1228,
      "damage_resistant": {
        "types": "#is_fire"
      }
    }

    return datapack.item_modifier({
        function: 'set_components',
        components
    })
}

function equipment(armor: number, slot: 'chest' | 'head' | 'feet' | 'legs'): AttributeModifierObject[] {
  return [
    {
      type: 'armor',
      operation: 'add_value',
      amount: armor,
      id: random_uuid.gen(),
      slot: slot
    },
    {
      type: 'armor_toughness',
      operation: 'add_value',
      amount: 6,
      id: random_uuid.gen(),
      slot: slot
    },
    {
      type: 'knockback_resistance',
      operation: 'add_value',
      amount: 0.2,
      id: random_uuid.gen(),
      slot: slot
    },
    {
      type: 'movement_speed',
      operation: 'add_multiplied_base',
      amount: 0.1,
      id: random_uuid.gen(),
      slot: slot
    }
  ]
}

function weapon(damage: number, speed: number): AttributeModifierObject[] {
  return [
    {
      type: 'attack_damage',
      operation: 'add_value',
      amount: damage,
      id: random_uuid.gen(),
      slot: 'mainhand'
    },
    {
      type: 'attack_speed',
      operation: 'add_value',
      amount: speed,
      id: random_uuid.gen(),
      slot: 'mainhand'
    },
    {
      type: 'block_break_speed',
      operation: 'add_multiplied_total',
      amount: 1,
      id: random_uuid.gen(),
      slot: 'mainhand'
    },
    {
      type: 'entity_interaction_range',
      operation: 'add_value',
      amount: 1,
      id: random_uuid.gen(),
      slot: 'mainhand'
    },
  ]
}

const elytra_attributes = [
  {
    type: 'fall_damage_multiplier',
    amount: -0.5,
    id: random_uuid.gen(),
    operation: 'add_multiplied_total',
    slot: 'chest'
  },
  {
    type: 'safe_fall_distance',
    amount: 1,
    id: random_uuid.gen(),
    operation: 'add_multiplied_total',
    slot: 'chest'
  }
] as AttributeModifierObject[]

export const modifiers = {
  consume_one: datapack.item_modifier({
    "function": "set_count",
    "count": -1,
    "add": true
  }),
  netherite_axe: upgrade('netherite_axe', 2843, weapon(11, -2.8)),
  netherite_hoe: upgrade('netherite_hoe', 2843, weapon(2, 0.2)),
  netherite_pickaxe: upgrade('netherite_pickaxe', 2843, weapon(7, -2.6)),
  netherite_shovel: upgrade('netherite_shovel', 2843, weapon(7.5, -2.8)),
  netherite_sword: upgrade('netherite_sword', 2843, weapon(9, -2.2)),

  netherite_boots: upgrade('netherite_boots', 577, equipment(3, 'feet'), {
      "slot": "feet",
      "asset_id": assets.equipments.enderite
  }),
  netherite_chestplate: upgrade('netherite_chestplate', 710, equipment(8, 'chest'), {
      "slot": "chest",
      "asset_id": assets.equipments.enderite
  }),
  netherite_helmet: upgrade('netherite_helmet', 488, equipment(3, 'head'),  {
      "slot": "head",
      "asset_id": assets.equipments.enderite
  }),
  netherite_leggings: upgrade('netherite_leggings', 666, equipment(6, 'legs'), {
      "slot": "legs",
      "asset_id": assets.equipments.enderite
  }),
  elytra: upgrade('netherite_elytra' as NETHERITE_ITEMS, 518, elytra_attributes, {
    "slot": "chest",
    "asset_id": assets.equipments.elytra
  }),
  enderite_armored_elytra: upgrade_armored_elytra(),
  switch_to: {
    elytra: datapack.item_modifier({
      function: "set_item",
      item: "elytra",
    }),
    chestplate: datapack.item_modifier({
      function: "set_item",
      item: "netherite_chestplate",
    })
  }
}