local function GetPlayerInventory(sessionId)
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

    return {
        inventoryId = inventoryManager.getInventoryId(),
        characterId = inventoryManager.characterId,
        maxSlots = inventoryManager.getMaxSlots(),
        maxWeight = inventoryManager.getMaxWeight(),
        items = inventoryManager.getItems()
    }
end

exports('GetPlayerInventory', GetPlayerInventory)
