local function SaveInventoryData(inventoryId, maxSlots, maxWeight)
    if not inventoryId then
        return false
    end

    local success = MySQL.update.await(
        'UPDATE inventories SET max_slots = ?, max_weight = ?, updated_at = NOW() WHERE id = ?',
        { maxSlots, maxWeight, inventoryId }
    )

    return success > 0
end

local function SaveInventoryItems(inventoryId, items)
    if not inventoryId then
        return false
    end

    MySQL.query.await('DELETE FROM inventory_items WHERE inventory_id = ?', { inventoryId })

    if not items or next(items) == nil then
        return true
    end

    local insertValues = {}
    local params = {}

    for slot, itemData in pairs(items) do
        if itemData and itemData.name then
            table.insert(insertValues, '(?, ?, ?, ?, ?)')
            table.insert(params, inventoryId)
            table.insert(params, slot)
            table.insert(params, itemData.name)
            table.insert(params, itemData.count or 1)
            table.insert(params, itemData.metadata and json.encode(itemData.metadata) or nil)
        end
    end

    if #insertValues == 0 then
        return true
    end

    local query = 'INSERT INTO inventory_items (inventory_id, slot, item, count, meta) VALUES ' .. table.concat(insertValues, ', ')

    local success = MySQL.query.await(query, params)

    return success ~= nil
end

local function SavePlayerInventory(sessionId)
    local inventoryData = exports['Ambitions-Inventory']:GetPlayerInventory(sessionId)

    if not inventoryData then
        amb.print.error('Failed to get inventory data for session ' .. tostring(sessionId))
        return false
    end

    local inventoryId = inventoryData.inventoryId

    if not inventoryId then
        amb.print.error('No inventory ID found for session ' .. tostring(sessionId))
        return false
    end

    local inventorySaved = SaveInventoryData(inventoryId, inventoryData.maxSlots, inventoryData.maxWeight)
    local itemsSaved = SaveInventoryItems(inventoryId, inventoryData.items)

    if not inventorySaved then
        amb.print.error('Failed to save inventory data for session ' .. tostring(sessionId))
    end

    if not itemsSaved then
        amb.print.error('Failed to save inventory items for session ' .. tostring(sessionId))
    end

    return inventorySaved and itemsSaved
end

AddEventHandler('playerDropped', function()
    local sessionId = source

    local success = SavePlayerInventory(sessionId)

    if success then
        amb.print.debug('Inventory saved for session ' .. tostring(sessionId))
    end
end)

exports('SavePlayerInventory', SavePlayerInventory)
