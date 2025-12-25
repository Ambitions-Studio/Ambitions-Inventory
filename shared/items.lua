Items = {

    ['money'] = {
        -- [REQUIRED] Unique identifier (must match the table key)
        name = 'money',

        -- [REQUIRED] Display name in inventory
        label = 'Money',

        -- [REQUIRED] Weight in grams (minimum: 0)
        weight = 0,

        -- [OPTIONAL] Image filename (must exist in images folder) | Default: no image
        image = 'money.png',

        -- [REQUIRED] Item type: 'item' or 'weapon'
        type = 'item',

        -- [OPTIONAL] If true, player can only have ONE of this item in the entire inventory | Default: false
        isUnique = false,

        -- [OPTIONAL] Stack limit per slot (only applies if isUnique is false) | Default: false (unlimited)
        stackLimits = false,

        -- [OPTIONAL] If true, item can be used | Default: false
        isUseable = false,

        -- [OPTIONAL] If true, closes inventory after use | Default: false
        closeInventory = false,

        -- [OPTIONAL] Description displayed in inventory | Default: empty
        description = 'Cash money'
    },

    ['black_money'] = {
        name = 'black_money',
        label = 'Dirty Money',
        weight = 0,
        image = 'black_money.png',
        type = 'item',
        stackLimits = false,
        description = 'Dirty money from illegal activities'
    },


    -- ============================================================================
    -- FOOD
    -- ============================================================================

    ['bread'] = {
        name = 'bread',
        label = 'Bread',
        weight = 100,
        image = 'bread.png',
        type = 'item',
        stackLimits = 10,
        isUseable = true,
        closeInventory = true,
        description = 'Fresh bread'
    },

    ['burger'] = {
        name = 'burger',
        label = 'Burger',
        weight = 300,
        image = 'burger.png',
        type = 'item',
        stackLimits = 5,
        isUseable = true,
        closeInventory = true,
        description = 'A delicious burger'
    },

    ['chocolate'] = {
        name = 'chocolate',
        label = 'Chocolate Bar',
        weight = 50,
        image = 'chocolate.png',
        type = 'item',
        stackLimits = 20,
        isUseable = true,
        closeInventory = false,
        description = 'A tasty chocolate bar'
    },


    -- ============================================================================
    -- DRINKS
    -- ============================================================================

    ['water'] = {
        name = 'water',
        label = 'Water Bottle',
        weight = 500,
        image = 'water.png',
        type = 'item',
        stackLimits = 5,
        isUseable = true,
        closeInventory = true,
        description = 'Fresh water bottle'
    },

    ['cola'] = {
        name = 'cola',
        label = 'Cola',
        weight = 350,
        image = 'cola.png',
        type = 'item',
        stackLimits = 10,
        isUseable = true,
        closeInventory = true,
        description = 'A refreshing cola'
    },

    ['orange_juice'] = {
        name = 'orange_juice',
        label = 'Orange Juice',
        weight = 300,
        image = 'orange_juice.png',
        type = 'item',
        stackLimits = 5,
        isUseable = true,
        closeInventory = true,
        description = 'Fresh squeezed orange juice'
    },


    -- ============================================================================
    -- UTILITIES
    -- ============================================================================

    ['phone'] = {
        name = 'phone',
        label = 'Phone',
        weight = 200,
        image = 'phone.png',
        type = 'item',
        isUnique = true,
        isUseable = true,
        closeInventory = true,
        description = 'A smartphone'
    },

    ['radio'] = {
        name = 'radio',
        label = 'Radio',
        weight = 300,
        image = 'radio.png',
        type = 'item',
        isUnique = true,
        isUseable = true,
        closeInventory = false,
        description = 'A portable radio'
    },

    ['lockpick'] = {
        name = 'lockpick',
        label = 'Lockpick',
        weight = 50,
        image = 'lockpick.png',
        type = 'item',
        stackLimits = 10,
        isUseable = true,
        closeInventory = true,
        description = 'A lockpick to open locks'
    },

    ['bandage'] = {
        name = 'bandage',
        label = 'Bandage',
        weight = 50,
        image = 'bandage.png',
        type = 'item',
        stackLimits = 20,
        isUseable = true,
        closeInventory = true,
        description = 'A bandage to heal minor wounds'
    },
}
