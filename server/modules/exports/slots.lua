--- Returns the default maximum slots from config
---@return number maxSlots The default maximum slots
local function GetDefaultMaxSlots()
    return InventoryConfig.playerInventory.slotsNumber
end

--- Gets the maximum slots for a player's inventory
---@param sessionId number The player's session ID
---@return number? maxSlots The player's max slots or nil if not found
local function GetPlayerMaxSlots(sessionId)
    if not sessionId then
        return nil
    end

    local player = amb.cache.getPlayer(sessionId)
    if not player then
        return nil
    end

    local character = player.getCurrentCharacter()
    if not character then
        return nil
    end

    local inventoryManager = character.getInventoryManager()
    if not inventoryManager then
        return nil
    end

    return inventoryManager.getMaxSlots()
end

--- Sets the maximum slots for a player's inventory
---@param sessionId number The player's session ID
---@param slots number The new maximum slots value
---@return boolean success Whether the operation succeeded
---@return string? reason Error message if failed
local function SetMaxSlots(sessionId, slots)
    if not sessionId or not slots then
        return false, 'Invalid parameters'
    end

    local player = amb.cache.getPlayer(sessionId)
    if not player then
        return false, 'Player not found'
    end

    local character = player.getCurrentCharacter()
    if not character then
        return false, 'Character not found'
    end

    local inventoryManager = character.getInventoryManager()
    if not inventoryManager then
        return false, 'Inventory not found'
    end

    local currentSlots = inventoryManager.getMaxSlots()

    if slots < currentSlots then
        local items = inventoryManager.getItems()
        for i = slots + 1, currentSlots do
            if items[i] then
                return false, 'Cannot reduce slots: some slots contain items'
            end
        end
    end

    inventoryManager.setMaxSlots(slots)

    TriggerClientEvent('ambitions-inventory:updateMaxSlots', sessionId, slots)

    return true
end

exports('GetDefaultMaxSlots', GetDefaultMaxSlots)
exports('GetPlayerMaxSlots', GetPlayerMaxSlots)
exports('SetMaxSlots', SetMaxSlots)
