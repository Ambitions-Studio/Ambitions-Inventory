local function getInventoryDataFromSession(sessionId)
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
        items = inventoryManager.getItems(),
        maxSlots = inventoryManager.getMaxSlots(),
        maxWeight = inventoryManager.getMaxWeight()
    }
end

local function getTotalWeight(items)
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

local function hasItemInTable(items, itemName)
    for _, itemData in pairs(items) do
        if itemData and itemData.name == itemName then
            return true
        end
    end
    return false
end

local function getFirstAvailableSlot(items, maxSlots, slotsAlreadyUsed)
    for i = 1, maxSlots do
        local alreadyUsed = false
        if slotsAlreadyUsed then
            for _, usedSlot in ipairs(slotsAlreadyUsed) do
                if usedSlot == i then
                    alreadyUsed = true
                    break
                end
            end
        end
        if not items[i] and not alreadyUsed then
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

    local inventoryData = getInventoryDataFromSession(sessionId)
    if not inventoryData then
        return false, 'Player not found'
    end

    local items = inventoryData.items
    local maxSlots = inventoryData.maxSlots
    local maxWeight = inventoryData.maxWeight

    local itemWeight = itemDef.weight * count
    local currentWeight = getTotalWeight(items)

    if currentWeight + itemWeight > maxWeight then
        return false, 'Inventory too heavy'
    end

    local changes = {}
    local slotsUsed = {}
    local remaining = count
    local stackLimit = itemDef.stackLimits or false
    local newMeta = metadata or {}

    if itemDef.isUnique then
        if hasItemInTable(items, itemName) then
            return false, 'Unique item already exists'
        end

        local targetSlot = slot or getFirstAvailableSlot(items, maxSlots)
        if not targetSlot then
            return false, 'Inventory full'
        end

        if items[targetSlot] then
            return false, 'Slot already occupied'
        end

        table.insert(changes, {
            action = 'set',
            slot = targetSlot,
            data = {
                name = itemName,
                count = 1,
                metadata = newMeta
            }
        })

        TriggerEvent('Ambitions:inventory:applyChanges', sessionId, changes)
        return true, targetSlot, changes
    end

    if slot then
        if items[slot] then
            return false, 'Slot already occupied'
        end

        local toAdd = remaining
        if stackLimit and remaining > stackLimit then
            toAdd = stackLimit
        end

        table.insert(changes, {
            action = 'set',
            slot = slot,
            data = {
                name = itemName,
                count = toAdd,
                metadata = newMeta
            }
        })

        table.insert(slotsUsed, slot)
        remaining = remaining - toAdd
    end

    for i = 1, maxSlots do
        if remaining <= 0 then break end

        local slotData = items[i]
        if slotData and slotData.name == itemName and areMetadataEqual(slotData.metadata, newMeta) then
            local currentCount = slotData.count
            local canAdd = remaining

            if stackLimit then
                canAdd = math.min(remaining, stackLimit - currentCount)
            end

            if canAdd > 0 then
                table.insert(changes, {
                    action = 'update',
                    slot = i,
                    data = {
                        name = itemName,
                        count = currentCount + canAdd,
                        metadata = slotData.metadata
                    }
                })

                remaining = remaining - canAdd
                table.insert(slotsUsed, i)
            end
        end
    end

    while remaining > 0 do
        local emptySlot = getFirstAvailableSlot(items, maxSlots, slotsUsed)
        if not emptySlot then
            break
        end

        local toAdd = remaining
        if stackLimit and remaining > stackLimit then
            toAdd = stackLimit
        end

        table.insert(changes, {
            action = 'set',
            slot = emptySlot,
            data = {
                name = itemName,
                count = toAdd,
                metadata = newMeta
            }
        })

        remaining = remaining - toAdd
        table.insert(slotsUsed, emptySlot)
    end

    if remaining > 0 then
        return false, 'Inventory full (partial add: ' .. (count - remaining) .. '/' .. count .. ')'
    end

    TriggerEvent('Ambitions:inventory:applyChanges', sessionId, changes)
    return true, slotsUsed, changes
end

local function HasItem(sessionId, itemName)
    if not sessionId or not itemName then
        return false
    end

    local inventoryData = getInventoryDataFromSession(sessionId)
    if not inventoryData then
        return false
    end

    local items = inventoryData.items
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

    local inventoryData = getInventoryDataFromSession(sessionId)
    if not inventoryData then
        return false, 'Player not found'
    end

    local items = inventoryData.items

    if not hasItemInTable(items, itemName) then
        return false, 'Player does not have this item'
    end

    local changes = {}

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
            table.insert(changes, {
                action = 'remove',
                slot = slot
            })
        else
            table.insert(changes, {
                action = 'update',
                slot = slot,
                data = {
                    name = itemName,
                    count = newCount,
                    metadata = slotData.metadata
                }
            })
        end

        TriggerEvent('Ambitions:inventory:applyChanges', sessionId, changes)
        return true, removeCount, changes
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
            table.insert(changes, {
                action = 'remove',
                slot = slotIndex
            })
        else
            table.insert(changes, {
                action = 'update',
                slot = slotIndex,
                data = {
                    name = itemName,
                    count = newCount,
                    metadata = slotData.metadata
                }
            })
        end

        remaining = remaining - toRemove
        table.insert(slotsAffected, slotIndex)
    end

    TriggerEvent('Ambitions:inventory:applyChanges', sessionId, changes)
    return true, removeCount, slotsAffected, changes
end

exports('AddItem', AddItem)
exports('HasItem', HasItem)
exports('RemoveItem', RemoveItem)
