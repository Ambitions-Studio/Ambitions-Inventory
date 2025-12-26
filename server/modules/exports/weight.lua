--- Returns the default maximum weight from config
---@return number maxWeight The default maximum weight
function GetDefaultMaxWeight()
    return InventoryConfig.playerInventory.maxWeight
end

--- Gets the maximum weight for a player's inventory
---@param sessionId number The player's session ID
---@return number? maxWeight The player's max weight or nil if not found
function GetPlayerMaxWeight(sessionId)
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

    return inventoryManager.getMaxWeight()
end

--- Calculates the total weight of items in an inventory
---@param inventoryManager table The inventory manager instance
---@return number totalWeight The total weight of all items
local function GetTotalWeight(inventoryManager)
    local items = inventoryManager.getItems()
    local totalWeight = 0

    for _, itemData in pairs(items) do
        if itemData then
            local itemDef = Items[itemData.name]
            if itemDef then
                totalWeight = totalWeight + (itemDef.weight * itemData.count)
            end
        end
    end

    return totalWeight
end

--- Sets the maximum weight for a player's inventory
---@param sessionId number The player's session ID
---@param weight number The new maximum weight value
---@return boolean success Whether the operation succeeded
---@return string? reason Error message if failed
function SetMaxWeight(sessionId, weight)
    if not sessionId or not weight then
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

    local totalWeight = GetTotalWeight(inventoryManager)

    if weight < totalWeight then
        return false, 'Cannot reduce max weight: current items exceed new limit'
    end

    inventoryManager.setMaxWeight(weight)

    TriggerClientEvent('ambitions-inventory:client:updateMaxWeight', sessionId, weight)

    return true
end

exports('GetDefaultMaxWeight', GetDefaultMaxWeight)
exports('GetPlayerMaxWeight', GetPlayerMaxWeight)
exports('SetMaxWeight', SetMaxWeight)
