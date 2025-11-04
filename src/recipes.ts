import { datapack, TEXT } from '@paul90317/mcfn.ts'
import { custom_data } from './custom_data'
import { assets } from './assets'

datapack.recipe({
    "type": "minecraft:crafting_shaped",
    "category": "misc",
    "group": "enderite_ingot",
    "key": {
        "a": "minecraft:end_crystal",
        "b": "minecraft:shulker_shell",
        "c": "minecraft:respawn_anchor"
    },
    "pattern": [
        "bbb",
        "bca",
        "aaa"
    ],
    "result": {
        "components": {
            "minecraft:custom_data": custom_data.enderite_upgrade,
            "minecraft:item_name": {
                text: "Enderite Ingot",
                color: 'dark_purple',
                italic: false
            } as TEXT,
            "minecraft:item_model": assets.item_models.enderite_ingot,
            "minecraft:damage_resistant": {
                types: "#minecraft:is_fire"
            }
        },
        "count": 1,
        "id": "minecraft:shulker_shell"
    }
})
