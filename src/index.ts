import { coord, Data, data, datapack, execute, ITEM, item, ITEMS, kill, minecraft, nbt, raw, ret, say, sel, summon } from '@paul90317/mcfn.ts'
import './recipes'
import { custom_data } from './custom_data'
import { assets, ENDERITE_ITEMS, upgradable_items, NETHERITE_ITEMS, upgradable_tag } from './assets'
import { modifiers } from './item_modifiers'

const nbts = {
    enderite_ingot: nbt.compound({
        Item: nbt.compound({
            id: nbt.string("minecraft:shulker_shell"),
            components: nbt.compound({
                'minecraft:custom_data': custom_data.enderite_upgrade
            })
        })
    }),
    is_enderite:  nbt.compound({
        Item: nbt.compound({
            components: nbt.compound({
                'minecraft:custom_data': custom_data.enderite_upgrade
            })
        })
    }),
    is_armored_elytra :nbt.compound({
        Item: nbt.compound({
            components: nbt.compound({
                'minecraft:custom_data': custom_data.enderite_armored_elytra
            })
        })
    }),
    is_chestplate: nbt.compound({
        Item: nbt.compound({
            id: nbt.string('minecraft:netherite_chestplate'),
            components: nbt.compound({
                'minecraft:custom_data': custom_data.enderite_upgrade
            })
        })
    }),
    is_elytra: nbt.compound({
        Item: nbt.compound({
            id: nbt.string('minecraft:elytra'),
            components: nbt.compound({
                'minecraft:custom_data': custom_data.enderite_upgrade
            })
        })
    }),
}

minecraft.tick(()=>{
    const item_nearest = sel('@e', {
        excl_nbt: nbts.is_enderite,
        type: 'item',
        sort: 'nearest',
        limit: 1,
        distance: {upper: 1}
    })

    execute.as(sel('@e', {
        type: 'item',
        nbt: nbts.enderite_ingot
    })).at(sel('@s'))
    .if(item.slot(item_nearest, 'container.0')
        .matches(item(upgradable_tag))).run(()=>{
        execute.as(item_nearest).at(sel('@s')).run(() => {
            raw('particle minecraft:end_rod ~ ~ ~ 0.2 0.2 0.2 1 300')
            raw('playsound minecraft:block.smithing_table.use block @s ~ ~ ~')

            const item_nearest = sel('@s')
            upgradable_items.forEach(i => {
                const slot_to_update = item.slot(item_nearest, 'container.0')
                execute.if(slot_to_update.matches(item(i))).run(()=>ret(()=>{
                    slot_to_update.modify(modifiers[i])
                }, true), true)
            })
        })
        item.slot(sel('@s'), 'container.0').modify(modifiers.consume_one)
    })

    //
    const elytra_nearest = sel('@e', {
        nbt: nbts.is_elytra,
        excl_nbt: nbts.is_armored_elytra,
        type: 'item',
        sort: 'nearest',
        limit: 1,
        distance: {upper: 1}
    })
    execute.as(sel('@e', {
        type: 'item',
        nbt: nbts.is_chestplate,
        excl_nbt: nbts.is_armored_elytra
    })).at(sel('@s'))
    .if(elytra_nearest)
    .run(() => {
        raw('particle minecraft:end_rod ~ ~ ~ 0.2 0.2 0.2 1 300')
        raw('playsound minecraft:block.smithing_table.use block @s ~ ~ ~')
        const chestplate = sel('@s')
        item.slot(chestplate, 'container.0').modify(modifiers.enderite_armored_elytra)

        function get_enchantments (d: Data) {
            return d.at('Item').at('components').at('minecraft:enchantments')
        }
        get_enchantments(data.entity(chestplate))
            .merge(get_enchantments(data.entity(elytra_nearest)));

        kill(elytra_nearest);
    })

    execute.as(sel('@a')).if(item.slot(sel('@s'), 'armor.chest').matches(item('netherite_chestplate', {
        'custom_data': custom_data.enderite_armored_elytra
    }))).run(()=>item.slot(sel('@s'), 'armor.chest').modify(modifiers.switch_to.elytra), true)
    execute.as(sel('@a')).if(item.slot(sel('@s'), 'player.cursor').matches(item('elytra', {
        'custom_data': custom_data.enderite_armored_elytra
    }))).run(()=>item.slot(sel('@s'), 'player.cursor').modify(modifiers.switch_to.chestplate), true)

})