local function GetDefaultMaxWeight()
    return InventoryConfig.playerInventory.maxWeight
end

local function GetPlayerMaxWeight(sessionId)
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

local function SetMaxWeight(sessionId, weight)
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

    TriggerClientEvent('ambitions-inventory:updateMaxWeight', sessionId, weight)

    return true
end

exports('GetDefaultMaxWeight', GetDefaultMaxWeight)
exports('GetPlayerMaxWeight', GetPlayerMaxWeight)
exports('SetMaxWeight', SetMaxWeight)
