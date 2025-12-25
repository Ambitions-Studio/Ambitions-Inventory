-- ===================================================================
-- AMBITIONS INVENTORY - CONFIGURATION
-- ===================================================================
-- This configuration file defines all settings for the Ambitions
-- inventory system.
--
-- WEIGHT SYSTEM:
-- All weights are measured in grams for precision. The UI
-- automatically converts to kilograms for display purposes.
-- Example: 40000 grams = 40kg displayed in the interface.
-- ===================================================================

InventoryConfig = {

    -- ===================================================================
    -- PLAYER INVENTORY SETTINGS
    -- ===================================================================

    playerInventory = {

        --- Maximum number of inventory slots
        ---
        --- Defines how many item slots are available in the player's
        --- main inventory grid. Each slot can hold one item stack.
        ---
        --- CONSIDERATIONS:
        --- • Higher values increase storage but may impact UI performance
        --- • Must match the frontend grid configuration
        --- • Recommended range: 20-60 slots
        slotsNumber = 40,

        --- Maximum carry weight in grams
        ---
        --- Defines the total weight a player can carry in their inventory.
        --- When exceeded, players cannot pick up additional items.
        ---
        --- WEIGHT REFERENCE:
        --- • 1000 grams = 1 kilogram
        --- • 40000 grams = 40kg (default)
        ---
        --- GAMEPLAY BALANCE:
        --- • Lower values encourage inventory management decisions
        --- • Higher values allow more freedom but less realism
        --- • Consider your server's economy and gameplay style
        maxWeight = 40000

    },

    -- ===================================================================
    -- KEYBINDINGS
    -- ===================================================================

    --- Key to open/close the inventory interface
    ---
    --- Defines which key players press to toggle the inventory UI.
    --- Uses FiveM key mapping names.
    ---
    --- COMMON KEYS:
    --- • 'TAB' - Tab key (default)
    --- • 'F2' - Function key 2
    --- • 'I' - Letter I
    openInventoryKey = 'TAB'

}
