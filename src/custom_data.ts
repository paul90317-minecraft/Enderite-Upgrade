import { nbt, config } from "mcfn.ts";


export const custom_data = {
    enderite_upgrade: nbt.compound({
        type: nbt.string(config.namespace),
    }),
    enderite_armored_elytra: nbt.compound({
        type: nbt.string(config.namespace),
        armored_elytra: nbt.byte(true)
    })
}
