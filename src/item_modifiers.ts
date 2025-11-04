import { ATTRIBUTE_MODIFIER, COMPONENTS, config, datapack, ITEM_ATTRIBUTES, ITEM_SLOTS, nbt, NBTBase, TEXT } from "@paul90317/mcfn.ts"
import { assets, ENDERITE_ITEMS, upgradable_items, NETHERITE_ITEMS } from "./assets"
import { custom_data } from "./custom_data"

const random_uuid = {
  id: 0,
  gen(){
    return `${config.namespace}:_${this.id++}`;
  }
}

function upgrade(_id: NETHERITE_ITEMS, max_damage: number, attribute_modifiers?: ATTRIBUTE_MODIFIER[], equippable?: object) {
    const id = _id.replace('netherite', 'enderite')! as ENDERITE_ITEMS
    const item_name_text = id
    .match(/[a-z0-9]+/g)?.map(x => {
      return x[0]?.toUpperCase() + x.slice(1)
    }).join(' ')

    const components: Partial<Record<`minecraft:${COMPONENTS}`, any>> = {
        'minecraft:custom_data': custom_data.enderite_upgrade,
        'minecraft:item_model': assets.item_models[id],
        "minecraft:item_name": {
            text: item_name_text!,
            color: 'dark_purple',
            italic: false
        } as TEXT,
        'minecraft:attribute_modifiers': attribute_modifiers,
        "minecraft:equippable": equippable,
        'minecraft:max_damage': max_damage,
        "minecraft:damage_resistant": {
          "types": "#minecraft:is_fire"
        }
    }

    return datapack.item_modifier({
        function: 'minecraft:set_components',
        components
    })
}

function upgrade_armored_elytra() {
    const components: Partial<Record<`minecraft:${COMPONENTS}`, any>> = {
        'minecraft:custom_data': custom_data.enderite_armored_elytra,
        'minecraft:item_model': assets.item_models.enderite_armored_elytra,
        "minecraft:item_name": {
            text: "Enderite Armored Elytra",
            color: 'dark_purple',
            italic: false
        } as TEXT,
        'minecraft:attribute_modifiers': [
          ...equipment(8, 'chest'), ...elytra_attributes
        ],
        "minecraft:equippable": {
          slot: "chest",
          asset_id: assets.equipments.armored_elytra
      },
      'minecraft:max_damage': 1228,
      "minecraft:damage_resistant": {
        "types": "#minecraft:is_fire"
      }
    }

    return datapack.item_modifier({
        function: 'minecraft:set_components',
        components
    })
}

function equipment(armor: number, slot: 'chest' | 'head' | 'feet' | 'legs'): ATTRIBUTE_MODIFIER[] {
  return [
    {
      type: 'minecraft:armor',
      operation: 'add_value',
      amount: armor,
      id: random_uuid.gen(),
      slot: slot
    },
    {
      type: 'minecraft:armor_toughness',
      operation: 'add_value',
      amount: 6,
      id: random_uuid.gen(),
      slot: slot
    },
    {
      type: 'minecraft:knockback_resistance',
      operation: 'add_value',
      amount: 0.2,
      id: random_uuid.gen(),
      slot: slot
    },
    {
      type: 'minecraft:movement_speed',
      operation: 'add_value',
      amount: 0.01,
      id: random_uuid.gen(),
      slot: slot
    }
  ]
}

function weapon(damage: number, speed: number): ATTRIBUTE_MODIFIER[] {
  return [
    {
      type: 'minecraft:attack_damage',
      operation: 'add_value',
      amount: damage,
      id: random_uuid.gen(),
      slot: 'mainhand'
    },
    {
      type: 'minecraft:attack_speed',
      operation: 'add_value',
      amount: speed,
      id: random_uuid.gen(),
      slot: 'mainhand'
    },
    {
      type: 'minecraft:block_break_speed',
      operation: 'add_value',
      amount: 1,
      id: random_uuid.gen(),
      slot: 'mainhand'
    },
    {
      type: 'minecraft:entity_interaction_range',
      operation: 'add_value',
      amount: 1,
      id: random_uuid.gen(),
      slot: 'mainhand'
    },
  ]
}

const elytra_attributes = [
  {
    type: 'minecraft:fall_damage_multiplier',
    amount: -0.2,
    id: random_uuid.gen(),
    operation: 'add_value',
    slot: 'chest'
  },
  {
    type: 'minecraft:safe_fall_distance',
    amount: 3,
    id: random_uuid.gen(),
    operation: 'add_value',
    slot: 'chest'
  }
] as ATTRIBUTE_MODIFIER[]

export const modifiers = {
  consume_one: datapack.item_modifier({
    "function": "minecraft:set_count",
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
      function: "minecraft:set_item",
      item: "minecraft:elytra",
    }),
    chestplate: datapack.item_modifier({
      function: "minecraft:set_item",
      item: "minecraft:netherite_chestplate",
    })
  }
}