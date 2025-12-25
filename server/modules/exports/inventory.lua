local function getInventoryManagerFromSession(sessionId)
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

    amb.print.debug('[getInventoryManagerFromSession] sessionId: ' .. tostring(sessionId))
    amb.print.debug('[getInventoryManagerFromSession] player address: ' .. tostring(player))
    amb.print.debug('[getInventoryManagerFromSession] character address: ' .. tostring(character))
    amb.print.debug('[getInventoryManagerFromSession] character uniqueId: ' .. tostring(character.getUniqueId()))

    return character.getInventoryManager()
end

local function getTotalWeight(inventoryManager)
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

local function hasItem(inventoryManager, itemName)
    local items = inventoryManager.getItems()
    for _, itemData in pairs(items) do
        if itemData and itemData.name == itemName then
            return true
        end
    end
    return false
end

local function getFirstAvailableSlot(inventoryManager)
    local items = inventoryManager.getItems()
    local maxSlots = inventoryManager.getMaxSlots()

    for i = 1, maxSlots do
        if not items[i] then
            return i
        end
    end

    return nil
end

local function isEmptyTable(t)
    if t == nil then return true end
    if type(t) ~= 'table' then return false end
    return next(t) == nil
end

local function areMetadataEqual(meta1, meta2)
    local empty1 = isEmptyTable(meta1)
    local empty2 = isEmptyTable(meta2)

    if empty1 and empty2 then
        return true
    end

    if empty1 or empty2 then
        return false
    end

    if type(meta1) ~= 'table' or type(meta2) ~= 'table' then
        return meta1 == meta2
    end

    for key, value in pairs(meta1) do
        if meta2[key] ~= value then
            return false
        end
    end

    for key, value in pairs(meta2) do
        if meta1[key] ~= value then
            return false
        end
    end

    return true
end

local function AddItem(sessionId, itemName, count, slot, metadata)
    if not sessionId or not itemName then
        return false, 'Invalid parameters'
    end

    local itemDef = Items[itemName]
    if not itemDef then
        return false, 'Item does not exist'
    end

    count = count or 1
    if count <= 0 then
        return false, 'Invalid count'
    end

    local inventoryManager = getInventoryManagerFromSession(sessionId)
    if not inventoryManager then
        return false, 'Player not found'
    end

    local items = inventoryManager.getItems()
    local maxSlots = inventoryManager.getMaxSlots()

    amb.print.debug('[AddItem DEBUG] Items table address: ' .. tostring(items))

    local itemWeight = itemDef.weight * count
    local currentWeight = getTotalWeight(inventoryManager)
    local maxWeight = inventoryManager.getMaxWeight()

    if currentWeight + itemWeight > maxWeight then
        return false, 'Inventory too heavy'
    end

    if itemDef.isUnique then
        if hasItem(inventoryManager, itemName) then
            return false, 'Unique item already exists'
        end

        local targetSlot = slot
        if targetSlot then
            if items[targetSlot] then
                return false, 'Slot already occupied'
            end
        else
            targetSlot = getFirstAvailableSlot(inventoryManager)
            if not targetSlot then
                return false, 'Inventory full'
            end
        end

        local itemData = {
            name = itemName,
            count = 1,
            metadata = metadata or {}
        }

        items[targetSlot] = itemData
        TriggerClientEvent('ambitions-inventory:addItem', sessionId, targetSlot, itemData)

        return true, targetSlot
    end

    if slot then
        if items[slot] then
            return false, 'Slot already occupied'
        end

        local stackLimit = itemDef.stackLimits or false
        local toAdd = count
        if stackLimit and count > stackLimit then
            toAdd = stackLimit
        end

        local itemData = {
            name = itemName,
            count = toAdd,
            metadata = metadata or {}
        }

        items[slot] = itemData
        TriggerClientEvent('ambitions-inventory:addItem', sessionId, slot, itemData)

        local remaining = count - toAdd
        if remaining > 0 then
            return AddItem(sessionId, itemName, remaining, nil, metadata)
        end

        return true, slot
    end

    local remaining = count
    local stackLimit = itemDef.stackLimits or false
    local slotsUsed = {}

    local newMeta = metadata or {}

    for i = 1, maxSlots do
        if remaining <= 0 then break end

        local slotData = items[i]
        if slotData and slotData.name == itemName and areMetadataEqual(slotData.metadata, newMeta) then
            local currentCount = slotData.count
            local canAdd = 0

            if stackLimit then
                canAdd = stackLimit - currentCount
            else
                canAdd = remaining
            end

            if canAdd > 0 then
                local toAdd = math.min(canAdd, remaining)
                slotData.count = currentCount + toAdd
                remaining = remaining - toAdd
                table.insert(slotsUsed, i)
                TriggerClientEvent('ambitions-inventory:updateSlot', sessionId, i, slotData)
            end
        end
    end

    while remaining > 0 do
        local emptySlot = getFirstAvailableSlot(inventoryManager)
        if not emptySlot then
            break
        end

        local toAdd = remaining
        if stackLimit and remaining > stackLimit then
            toAdd = stackLimit
        end

        local itemData = {
            name = itemName,
            count = toAdd,
            metadata = metadata or {}
        }

        items[emptySlot] = itemData
        remaining = remaining - toAdd
        table.insert(slotsUsed, emptySlot)
        TriggerClientEvent('ambitions-inventory:addItem', sessionId, emptySlot, itemData)
    end

    if remaining > 0 then
        return false, 'Inventory full (partial add: ' .. (count - remaining) .. '/' .. count .. ')'
    end

    return true, slotsUsed
end

local function HasItem(sessionId, itemName)
    if not sessionId or not itemName then
        return false
    end

    local inventoryManager = getInventoryManagerFromSession(sessionId)
    if not inventoryManager then
        return false
    end

    local items = inventoryManager.getItems()
    local occurrences = {}

    for slot, itemData in pairs(items) do
        if itemData and itemData.name == itemName then
            table.insert(occurrences, {
                slot = slot,
                count = itemData.count,
                metadata = itemData.metadata
            })
        end
    end

    if #occurrences == 0 then
        return false
    end

    return true, occurrences
end

local function RemoveItem(sessionId, itemName, count, slot, metadata)
    if not sessionId or not itemName then
        return false, 'Invalid parameters'
    end

    if count ~= nil and count <= 0 then
        return false, 'Invalid count'
    end

    local itemDef = Items[itemName]
    if not itemDef then
        return false, 'Item does not exist'
    end

    local inventoryManager = getInventoryManagerFromSession(sessionId)
    if not inventoryManager then
        return false, 'Player not found'
    end

    local items = inventoryManager.getItems()

    if not hasItem(inventoryManager, itemName) then
        return false, 'Player does not have this item'
    end

    if slot then
        local slotData = items[slot]
        if not slotData then
            return false, 'Slot is empty'
        end

        if slotData.name ~= itemName then
            return false, 'Item not found in this slot'
        end

        if metadata and not areMetadataEqual(slotData.metadata, metadata) then
            return false, 'Metadata does not match'
        end

        local removeCount = count or slotData.count

        if removeCount > slotData.count then
            return false, 'Not enough items in slot'
        end

        local newCount = slotData.count - removeCount
        if newCount <= 0 then
            items[slot] = nil
            TriggerClientEvent('ambitions-inventory:removeSlot', sessionId, slot)
        else
            slotData.count = newCount
            TriggerClientEvent('ambitions-inventory:updateSlot', sessionId, slot, slotData)
        end

        return true, removeCount
    end

    local matchingSlots = {}
    local totalAvailable = 0

    for slotIndex, slotData in pairs(items) do
        if slotData and slotData.name == itemName then
            if metadata then
                if areMetadataEqual(slotData.metadata, metadata) then
                    table.insert(matchingSlots, { slot = slotIndex, data = slotData })
                    totalAvailable = totalAvailable + slotData.count
                end
            else
                table.insert(matchingSlots, { slot = slotIndex, data = slotData })
                totalAvailable = totalAvailable + slotData.count
            end
        end
    end

    if #matchingSlots == 0 then
        if metadata then
            return false, 'Item not found with specified metadata'
        end
        return false, 'Item not found in inventory'
    end

    local removeCount = count or totalAvailable

    if removeCount > totalAvailable then
        return false, 'Not enough items (have: ' .. totalAvailable .. ', need: ' .. removeCount .. ')'
    end

    table.sort(matchingSlots, function(a, b) return a.slot < b.slot end)

    local remaining = removeCount
    local slotsAffected = {}

    for _, match in ipairs(matchingSlots) do
        if remaining <= 0 then break end

        local slotIndex = match.slot
        local slotData = match.data
        local toRemove = math.min(remaining, slotData.count)

        local newCount = slotData.count - toRemove
        if newCount <= 0 then
            items[slotIndex] = nil
            TriggerClientEvent('ambitions-inventory:removeSlot', sessionId, slotIndex)
        else
            slotData.count = newCount
            TriggerClientEvent('ambitions-inventory:updateSlot', sessionId, slotIndex, slotData)
        end

        remaining = remaining - toRemove
        table.insert(slotsAffected, slotIndex)
    end

    return true, removeCount, slotsAffected
end

exports('AddItem', AddItem)
exports('HasItem', HasItem)
exports('RemoveItem', RemoveItem)
