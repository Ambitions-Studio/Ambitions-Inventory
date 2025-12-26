CreateUsableItem('bread', function(sessionId, item)
    local player = amb.cache.getPlayer(sessionId)
    if not player then
        return amb.print.error('Failed to use bread: Player not found for session ' .. tostring(sessionId))
    end

    local character = player.getCurrentCharacter()
    if not character then
        return amb.print.error('Failed to use bread: No active character for session ' .. tostring(sessionId))
    end

    local success = RemoveItem(sessionId, item.name, 1, item.slot)
    if not success then
        return amb.print.error('Failed to use bread: Could not remove item from inventory for session ' .. tostring(sessionId))
    end

    TriggerEvent('ambitions:server:updateNeeds', sessionId, 'hunger', 15)
end)