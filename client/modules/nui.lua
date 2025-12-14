
RegisterNUICallback('getInventoryConfig', function(_, cb)
    cb({
        slotsNumber = inventoryConfig.playerInventory.slotsNumber
    })
end)
