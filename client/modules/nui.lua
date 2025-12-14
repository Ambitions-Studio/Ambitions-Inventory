RegisterNUICallback('getInventoryConfig', function(_, cb)
    cb({
        slotsNumber = InventoryConfig.playerInventory.slotsNumber
    })
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
