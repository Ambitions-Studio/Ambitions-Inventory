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

exports('GetItemList', GetItemList)
exports('GetItemLabel', GetItemLabel)
