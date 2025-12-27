local UsableItems = {}

--- Returns the complete list of all item definitions
---@return table items All item definitions indexed by name
function GetItemList()
    return Items or {}
end

--- Gets the display label for an item
---@param itemName string The name of the item
---@return string? label The item's display label or nil if not found
function GetItemLabel(itemName)
    if not itemName then
        return nil
    end

    local item = Items[itemName]
    if not item then
        return nil
    end

    return item.label
end

--- Registers an item as usable with a callback function
---@param itemName string The name of the item to make usable
---@param callback function|table The callback executed when item is used (receives sessionId, item). Tables are accepted as FiveM converts functions to callable tables when passed via exports.
---@return boolean success Whether the item was registered
---@return string? reason Error message if registration failed
function CreateUsableItem(itemName, callback)
    if not itemName then
        return false, 'Invalid item name'
    end

    local callbackType = type(callback)
    local isCallable = callbackType == 'function' or callbackType == 'table'

    if not isCallable then
        return false, 'Invalid callback: must be a function or function reference'
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
        amb.print.error(('Error using item %s: %s'):format(slotData.name, tostring(err)))
        return false, 'Error using item'
    end

    return true
end)

exports('GetItemList', GetItemList)
exports('GetItemLabel', GetItemLabel)
exports('CreateUsableItem', CreateUsableItem)
