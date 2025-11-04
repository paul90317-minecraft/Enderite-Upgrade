import { datapack, ItemModel, ITEMS, Model, resourcepack, Texture } from '@paul90317/mcfn.ts'
import { tags } from '@paul90317/mcfn.ts/dist/core/tag'

export const upgradable_items = [
    'netherite_axe',
    'netherite_boots',
    'netherite_chestplate',
    'netherite_helmet',
    'netherite_hoe',
    'netherite_leggings',
    'netherite_pickaxe',
    'netherite_shovel',
    'netherite_sword',
    'elytra'
] as const

export const enderite_items = [
    'enderite_axe',
    'enderite_boots',
    'enderite_chestplate',
    'enderite_helmet',
    'enderite_hoe',
    'enderite_leggings',
    'enderite_pickaxe',
    'enderite_shovel',
    'enderite_sword',
    'enderite_ingot',
    'enderite_elytra',
    'enderite_armored_elytra'
] as const

export type NETHERITE_ITEMS = typeof upgradable_items[number]
export type ENDERITE_ITEMS = typeof enderite_items[number]

const textures: Record<string, Texture> = {}
enderite_items.forEach(item => {
    textures[item] = resourcepack.texture.item(`./res/item/${item}.png`)
})

const models: Record<string, Model> = {}
enderite_items.forEach(item => {
    models[item] = resourcepack.model({
        parent: 'minecraft:item/generated',
        textures: {
            layer0: textures[item]
        }
    })
})

const item_models: Record<string, ItemModel> = {}
enderite_items.forEach(item => {
    item_models[item] = resourcepack.item({
        model: {
            type: 'minecraft:model',
            model: models[item]
        }
    })
})

const equipments = {
    enderite: resourcepack.equipment({
        "layers": {
            "humanoid": [
                {
                    "texture": resourcepack.texture.equipment('humanoid', './res/equipment/humanoid.png')
                }
            ],
            "humanoid_leggings": [
                {
                    "texture": resourcepack.texture.equipment('humanoid_leggings', './res/equipment/humanoid_leggings.png')
                }
            ]
        }
    }),
    elytra: resourcepack.equipment({
        "layers": {
            "wings":  [
                {
                    "texture": resourcepack.texture.equipment('wings', './res/equipment/wings.png')
                }
            ]
        }
    }),
    armored_elytra: resourcepack.equipment({
        "layers": {
            "humanoid": [
                {
                    "texture": resourcepack.texture.equipment('humanoid', './res/equipment/humanoid.png')
                }
            ],
            "wings":  [
                {
                    "texture": resourcepack.texture.equipment('wings', './res/equipment/wings.png')
                }
            ]
        }
    }),
}

export const upgradable_tag = datapack.tags.item(upgradable_items)

export const assets = {
    item_models: item_models as Record<ENDERITE_ITEMS, ItemModel>,
    equipments
}