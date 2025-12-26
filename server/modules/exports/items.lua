local UsableItems = {}

local function GetItemList()
    return Items or {}
end

local function GetItemLabel(itemName)
    if not itemName then
        return nil
    end

    local item = Items[itemName]
    if not item then
        return nil
    end

    return item.label
end

local function CreateUsableItem(itemName, callback)
    if not itemName then
        return false, 'Invalid item name'
    end

    if type(callback) ~= 'function' then
        return false, 'Invalid callback'
    end

    if not Items[itemName] then
        return false, 'Item does not exist'
    end

    UsableItems[itemName] = callback
    return true
end

amb.callback.register('inventory:useItem', function(sessionId, slot)
    if not sessionId or not slot then
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

    local items = inventoryManager.getItems()
    local slotData = items[slot]
    if not slotData then
        return false, 'Slot is empty'
    end

    local callback = UsableItems[slotData.name]
    if not callback then
        return false, 'You cannot use this item'
    end

    local itemDef = Items[slotData.name]
    local item = {
        name = slotData.name,
        label = itemDef and itemDef.label or slotData.name,
        slot = slot,
        count = slotData.count,
        metadata = slotData.metadata or {}
    }

    local success, err = pcall(callback, sessionId, item)
    if not success then
        return false, 'Error using item'
    end

    return true
end)

exports('GetItemList', GetItemList)
exports('GetItemLabel', GetItemLabel)
exports('CreateUsableItem', CreateUsableItem)
