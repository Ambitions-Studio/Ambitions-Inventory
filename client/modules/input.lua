local isInventoryOpen = false

local function ToggleInventory()
    isInventoryOpen = not isInventoryOpen
    SetNuiFocus(isInventoryOpen, isInventoryOpen)
    SendNUIMessage({
        action = 'toggleInventory',
        isOpen = isInventoryOpen
    })
end

local function CloseInventory()
    if not isInventoryOpen then return end
    isInventoryOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'toggleInventory',
        isOpen = false
    })
end

RegisterCommand('inventory', ToggleInventory, false)
RegisterKeyMapping('inventory', 'Ouvrir l\'inventaire', 'keyboard', InventoryConfig.openInventoryKey)

RegisterNUICallback('closeInventory', function(_, cb)
    CloseInventory()
    cb('ok')
end)
