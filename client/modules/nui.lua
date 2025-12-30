RegisterNetEvent('ambitions-inventory:client:loadInventory', function(data)
    SendNUIMessage({
        action = 'loadInventory',
        maxSlots = data.maxSlots,
        maxWeight = data.maxWeight,
        items = data.items
    })
end)

RegisterNUICallback('getInventoryConfig', function(_, cb)
    cb({
        slotsNumber = InventoryConfig.playerInventory.slotsNumber,
        maxWeight = InventoryConfig.playerInventory.maxWeight
    })
end)

RegisterNetEvent('ambitions-inventory:client:updateMaxSlots', function(slots)
    SendNUIMessage({
        action = 'updateMaxSlots',
        slots = slots
    })
end)

RegisterNetEvent('ambitions-inventory:client:updateMaxWeight', function(weight)
    SendNUIMessage({
        action = 'updateMaxWeight',
        weight = weight
    })
end)

RegisterNetEvent('ambitions-inventory:client:addItem', function(slot, itemData)
    SendNUIMessage({
        action = 'addItem',
        slot = slot,
        item = itemData
    })
end)

RegisterNetEvent('ambitions-inventory:client:updateItem', function(slot, itemData)
    SendNUIMessage({
        action = 'updateItem',
        slot = slot,
        item = itemData
    })
end)

RegisterNetEvent('ambitions-inventory:client:removeItem', function(slot)
    SendNUIMessage({
        action = 'removeItem',
        slot = slot
    })
end)

RegisterNUICallback('slotReductionBlocked', function(_, cb)
    amb.ShowNotification('Inventory', 'Cannot reduce slots: some slots contain items', 'error', 5000, 'top-right')
    cb('ok')
end)

RegisterNUICallback('weightReductionBlocked', function(_, cb)
    amb.ShowNotification('Inventory', 'Cannot reduce max weight: current items exceed new limit', 'error', 5000, 'top-right')
    cb('ok')
end)

RegisterNUICallback('inventorySwapSlots', function(data, cb)
    TriggerServerEvent('ambitions:server:swapSlots', data.fromSlot, data.toSlot)
    cb('ok')
end)

RegisterNUICallback('inventoryMergeItems', function(data, cb)
    TriggerServerEvent('ambitions:server:mergeItems', data.fromSlot, data.toSlot)
    cb('ok')
end)

RegisterNUICallback('useItem', function(data, cb)
    local success, err = amb.callback.await('inventory:useItem', false, data.slotIndex)
    if not success then
        amb.ShowNotification('Inventory', err, 'error', 3000, 'top-right')
    end
    cb('ok')
end)

RegisterNUICallback('getItemDefinitions', function(_, cb)
    local itemCount = 0
    for _ in pairs(Items) do
        itemCount = itemCount + 1
    end

    print('^2[Ambitions-Inventory]^0 Loading ' .. itemCount .. ' item definitions...')

    for name, item in pairs(Items) do
        print('^3[Item]^0 ' .. name .. ' -> ' .. item.label .. ' (weight: ' .. item.weight .. ', type: ' .. item.type .. ')')
    end

    print('^2[Ambitions-Inventory]^0 Successfully loaded ' .. itemCount .. ' items!')

    cb(Items)
end)
