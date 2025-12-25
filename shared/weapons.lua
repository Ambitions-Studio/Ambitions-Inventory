-- ============================================================================
-- MELEE WEAPONS
-- ============================================================================

Weapons = {

    ['weapon_knife'] = {
        -- [REQUIRED] GTA weapon hash (must match the table key in uppercase with WEAPON_ prefix)
        name = 'WEAPON_KNIFE',

        -- [REQUIRED] Display name in inventory
        label = 'Knife',

        -- [REQUIRED] Weight in grams (minimum: 0)
        weight = 200,

        -- [OPTIONAL] Image filename (must exist in images folder) | Default: no image
        image = 'weapon_knife.png',

        -- [OPTIONAL] Description displayed in inventory | Default: empty
        description = 'A combat knife',

        -- [OPTIONAL] Ammo type reference (key from Ammo table) | Default: none (for melee weapons)
        -- ammoType = 'ammo_pistol',

        -- [OPTIONAL] Stack limit per slot (only for throwables) | Default: 1 (weapons cannot stack)
        -- stackLimits = 10
    },

    ['weapon_dagger'] = {
        name = 'WEAPON_DAGGER',
        label = 'Dagger',
        weight = 250,
        image = 'weapon_dagger.png',
        description = 'A sharp dagger'
    },

    ['weapon_switchblade'] = {
        name = 'WEAPON_SWITCHBLADE',
        label = 'Switchblade',
        weight = 150,
        image = 'weapon_switchblade.png',
        description = 'A switchblade knife'
    },

    ['weapon_bottle'] = {
        name = 'WEAPON_BOTTLE',
        label = 'Broken Bottle',
        weight = 300,
        image = 'weapon_bottle.png',
        description = 'A broken bottle'
    },

    ['weapon_knuckle'] = {
        name = 'WEAPON_KNUCKLE',
        label = 'Brass Knuckles',
        weight = 300,
        image = 'weapon_knuckle.png',
        description = 'Metal brass knuckles'
    },

    ['weapon_nightstick'] = {
        name = 'WEAPON_NIGHTSTICK',
        label = 'Nightstick',
        weight = 500,
        image = 'weapon_nightstick.png',
        description = 'A police nightstick'
    },

    ['weapon_flashlight'] = {
        name = 'WEAPON_FLASHLIGHT',
        label = 'Flashlight',
        weight = 400,
        image = 'weapon_flashlight.png',
        description = 'A heavy duty flashlight'
    },

    ['weapon_hammer'] = {
        name = 'WEAPON_HAMMER',
        label = 'Hammer',
        weight = 600,
        image = 'weapon_hammer.png',
        description = 'A construction hammer'
    },

    ['weapon_crowbar'] = {
        name = 'WEAPON_CROWBAR',
        label = 'Crowbar',
        weight = 800,
        image = 'weapon_crowbar.png',
        description = 'A steel crowbar'
    },

    ['weapon_wrench'] = {
        name = 'WEAPON_WRENCH',
        label = 'Wrench',
        weight = 700,
        image = 'weapon_wrench.png',
        description = 'A large pipe wrench'
    },

    ['weapon_bat'] = {
        name = 'WEAPON_BAT',
        label = 'Baseball Bat',
        weight = 900,
        image = 'weapon_bat.png',
        description = 'A wooden baseball bat'
    },

    ['weapon_golfclub'] = {
        name = 'WEAPON_GOLFCLUB',
        label = 'Golf Club',
        weight = 500,
        image = 'weapon_golfclub.png',
        description = 'A golf club'
    },

    ['weapon_poolcue'] = {
        name = 'WEAPON_POOLCUE',
        label = 'Pool Cue',
        weight = 400,
        image = 'weapon_poolcue.png',
        description = 'A pool cue stick'
    },

    ['weapon_hatchet'] = {
        name = 'WEAPON_HATCHET',
        label = 'Hatchet',
        weight = 700,
        image = 'weapon_hatchet.png',
        description = 'A sharp hatchet'
    },

    ['weapon_machete'] = {
        name = 'WEAPON_MACHETE',
        label = 'Machete',
        weight = 600,
        image = 'weapon_machete.png',
        description = 'A sharp machete'
    },

    ['weapon_battleaxe'] = {
        name = 'WEAPON_BATTLEAXE',
        label = 'Battle Axe',
        weight = 1500,
        image = 'weapon_battleaxe.png',
        description = 'A medieval battle axe'
    },

    ['weapon_stone_hatchet'] = {
        name = 'WEAPON_STONE_HATCHET',
        label = 'Stone Hatchet',
        weight = 800,
        image = 'weapon_stone_hatchet.png',
        description = 'A primitive stone hatchet'
    },


    -- ============================================================================
    -- PISTOLS
    -- ============================================================================

    ['weapon_pistol'] = {
        name = 'WEAPON_PISTOL',
        label = 'Pistol',
        weight = 1000,
        image = 'weapon_pistol.png',
        description = 'A 9mm semi-automatic pistol',
        ammoType = 'ammo_pistol'
    },

    ['weapon_pistol_mk2'] = {
        name = 'WEAPON_PISTOL_MK2',
        label = 'Pistol MK2',
        weight = 1100,
        image = 'weapon_pistol_mk2.png',
        description = 'Upgraded version of the standard pistol',
        ammoType = 'ammo_pistol'
    },

    ['weapon_combatpistol'] = {
        name = 'WEAPON_COMBATPISTOL',
        label = 'Combat Pistol',
        weight = 1100,
        image = 'weapon_combatpistol.png',
        description = 'A compact combat pistol',
        ammoType = 'ammo_pistol'
    },

    ['weapon_appistol'] = {
        name = 'WEAPON_APPISTOL',
        label = 'AP Pistol',
        weight = 1200,
        image = 'weapon_appistol.png',
        description = 'A high fire rate automatic pistol',
        ammoType = 'ammo_pistol'
    },

    ['weapon_pistol50'] = {
        name = 'WEAPON_PISTOL50',
        label = 'Pistol .50',
        weight = 1500,
        image = 'weapon_pistol50.png',
        description = 'A powerful .50 caliber pistol',
        ammoType = 'ammo_pistol'
    },

    ['weapon_snspistol'] = {
        name = 'WEAPON_SNSPISTOL',
        label = 'SNS Pistol',
        weight = 600,
        image = 'weapon_snspistol.png',
        description = 'A small pocket pistol',
        ammoType = 'ammo_pistol'
    },

    ['weapon_snspistol_mk2'] = {
        name = 'WEAPON_SNSPISTOL_MK2',
        label = 'SNS Pistol MK2',
        weight = 650,
        image = 'weapon_snspistol_mk2.png',
        description = 'Upgraded version of the SNS Pistol',
        ammoType = 'ammo_pistol'
    },

    ['weapon_heavypistol'] = {
        name = 'WEAPON_HEAVYPISTOL',
        label = 'Heavy Pistol',
        weight = 1400,
        image = 'weapon_heavypistol.png',
        description = 'A heavy and powerful pistol',
        ammoType = 'ammo_pistol'
    },

    ['weapon_vintagepistol'] = {
        name = 'WEAPON_VINTAGEPISTOL',
        label = 'Vintage Pistol',
        weight = 900,
        image = 'weapon_vintagepistol.png',
        description = 'A vintage era pistol',
        ammoType = 'ammo_pistol'
    },

    ['weapon_ceramicpistol'] = {
        name = 'WEAPON_CERAMICPISTOL',
        label = 'Ceramic Pistol',
        weight = 700,
        image = 'weapon_ceramicpistol.png',
        description = 'An undetectable ceramic pistol',
        ammoType = 'ammo_pistol'
    },

    ['weapon_gadgetpistol'] = {
        name = 'WEAPON_GADGETPISTOL',
        label = 'Perico Pistol',
        weight = 800,
        image = 'weapon_gadgetpistol.png',
        description = 'A pistol disguised as a gadget',
        ammoType = 'ammo_pistol'
    },

    ['weapon_marksmanpistol'] = {
        name = 'WEAPON_MARKSMANPISTOL',
        label = 'Marksman Pistol',
        weight = 900,
        image = 'weapon_marksmanpistol.png',
        description = 'A single-shot precision pistol',
        ammoType = 'ammo_pistol'
    },

    ['weapon_revolver'] = {
        name = 'WEAPON_REVOLVER',
        label = 'Heavy Revolver',
        weight = 1300,
        image = 'weapon_revolver.png',
        description = 'A powerful revolver',
        ammoType = 'ammo_pistol'
    },

    ['weapon_revolver_mk2'] = {
        name = 'WEAPON_REVOLVER_MK2',
        label = 'Heavy Revolver MK2',
        weight = 1400,
        image = 'weapon_revolver_mk2.png',
        description = 'Upgraded version of the Heavy Revolver',
        ammoType = 'ammo_pistol'
    },

    ['weapon_doubleaction'] = {
        name = 'WEAPON_DOUBLEACTION',
        label = 'Double Action Revolver',
        weight = 1200,
        image = 'weapon_doubleaction.png',
        description = 'A classic double action revolver',
        ammoType = 'ammo_pistol'
    },

    ['weapon_navyrevolver'] = {
        name = 'WEAPON_NAVYREVOLVER',
        label = 'Navy Revolver',
        weight = 1100,
        image = 'weapon_navyrevolver.png',
        description = 'An antique Navy revolver',
        ammoType = 'ammo_pistol'
    },

    ['weapon_stungun'] = {
        name = 'WEAPON_STUNGUN',
        label = 'Stun Gun',
        weight = 500,
        image = 'weapon_stungun.png',
        description = 'An electric stun gun'
    },

    ['weapon_flaregun'] = {
        name = 'WEAPON_FLAREGUN',
        label = 'Flare Gun',
        weight = 400,
        image = 'weapon_flaregun.png',
        description = 'A signal flare gun',
        ammoType = 'ammo_flare'
    },

    ['weapon_raypistol'] = {
        name = 'WEAPON_RAYPISTOL',
        label = 'Up-n-Atomizer',
        weight = 800,
        image = 'weapon_raypistol.png',
        description = 'An alien ray gun'
    },


    -- ============================================================================
    -- SMG
    -- ============================================================================

    ['weapon_microsmg'] = {
        name = 'WEAPON_MICROSMG',
        label = 'Micro SMG',
        weight = 1500,
        image = 'weapon_microsmg.png',
        description = 'A compact submachine gun',
        ammoType = 'ammo_smg'
    },

    ['weapon_smg'] = {
        name = 'WEAPON_SMG',
        label = 'SMG',
        weight = 2000,
        image = 'weapon_smg.png',
        description = 'A standard submachine gun',
        ammoType = 'ammo_smg'
    },

    ['weapon_smg_mk2'] = {
        name = 'WEAPON_SMG_MK2',
        label = 'SMG MK2',
        weight = 2100,
        image = 'weapon_smg_mk2.png',
        description = 'Upgraded version of the SMG',
        ammoType = 'ammo_smg'
    },

    ['weapon_assaultsmg'] = {
        name = 'WEAPON_ASSAULTSMG',
        label = 'Assault SMG',
        weight = 2200,
        image = 'weapon_assaultsmg.png',
        description = 'A powerful assault SMG',
        ammoType = 'ammo_smg'
    },

    ['weapon_combatpdw'] = {
        name = 'WEAPON_COMBATPDW',
        label = 'Combat PDW',
        weight = 2300,
        image = 'weapon_combatpdw.png',
        description = 'A personal defense weapon',
        ammoType = 'ammo_smg'
    },

    ['weapon_machinepistol'] = {
        name = 'WEAPON_MACHINEPISTOL',
        label = 'Machine Pistol',
        weight = 1800,
        image = 'weapon_machinepistol.png',
        description = 'A compact machine pistol',
        ammoType = 'ammo_smg'
    },

    ['weapon_minismg'] = {
        name = 'WEAPON_MINISMG',
        label = 'Mini SMG',
        weight = 1600,
        image = 'weapon_minismg.png',
        description = 'An ultra compact SMG',
        ammoType = 'ammo_smg'
    },

    ['weapon_raycarbine'] = {
        name = 'WEAPON_RAYCARBINE',
        label = 'Unholy Hellbringer',
        weight = 2500,
        image = 'weapon_raycarbine.png',
        description = 'An alien machine gun'
    },


    -- ============================================================================
    -- SHOTGUNS
    -- ============================================================================

    ['weapon_pumpshotgun'] = {
        name = 'WEAPON_PUMPSHOTGUN',
        label = 'Pump Shotgun',
        weight = 3000,
        image = 'weapon_pumpshotgun.png',
        description = 'A classic pump action shotgun',
        ammoType = 'ammo_shotgun'
    },

    ['weapon_pumpshotgun_mk2'] = {
        name = 'WEAPON_PUMPSHOTGUN_MK2',
        label = 'Pump Shotgun MK2',
        weight = 3100,
        image = 'weapon_pumpshotgun_mk2.png',
        description = 'Upgraded version of the Pump Shotgun',
        ammoType = 'ammo_shotgun'
    },

    ['weapon_sawnoffshotgun'] = {
        name = 'WEAPON_SAWNOFFSHOTGUN',
        label = 'Sawed-Off Shotgun',
        weight = 2500,
        image = 'weapon_sawnoffshotgun.png',
        description = 'A compact sawed-off shotgun',
        ammoType = 'ammo_shotgun'
    },

    ['weapon_assaultshotgun'] = {
        name = 'WEAPON_ASSAULTSHOTGUN',
        label = 'Assault Shotgun',
        weight = 3500,
        image = 'weapon_assaultshotgun.png',
        description = 'An automatic assault shotgun',
        ammoType = 'ammo_shotgun'
    },

    ['weapon_bullpupshotgun'] = {
        name = 'WEAPON_BULLPUPSHOTGUN',
        label = 'Bullpup Shotgun',
        weight = 3200,
        image = 'weapon_bullpupshotgun.png',
        description = 'A bullpup configuration shotgun',
        ammoType = 'ammo_shotgun'
    },

    ['weapon_heavyshotgun'] = {
        name = 'WEAPON_HEAVYSHOTGUN',
        label = 'Heavy Shotgun',
        weight = 3800,
        image = 'weapon_heavyshotgun.png',
        description = 'A heavy and powerful shotgun',
        ammoType = 'ammo_shotgun'
    },

    ['weapon_dbshotgun'] = {
        name = 'WEAPON_DBSHOTGUN',
        label = 'Double Barrel Shotgun',
        weight = 2800,
        image = 'weapon_dbshotgun.png',
        description = 'A double barrel shotgun',
        ammoType = 'ammo_shotgun'
    },

    ['weapon_autoshotgun'] = {
        name = 'WEAPON_AUTOSHOTGUN',
        label = 'Sweeper Shotgun',
        weight = 3300,
        image = 'weapon_autoshotgun.png',
        description = 'A compact semi-automatic shotgun',
        ammoType = 'ammo_shotgun'
    },

    ['weapon_combatshotgun'] = {
        name = 'WEAPON_COMBATSHOTGUN',
        label = 'Combat Shotgun',
        weight = 3600,
        image = 'weapon_combatshotgun.png',
        description = 'A semi-automatic combat shotgun',
        ammoType = 'ammo_shotgun'
    },

    ['weapon_musket'] = {
        name = 'WEAPON_MUSKET',
        label = 'Musket',
        weight = 4000,
        image = 'weapon_musket.png',
        description = 'An antique musket',
        ammoType = 'ammo_shotgun'
    },


    -- ============================================================================
    -- ASSAULT RIFLES
    -- ============================================================================

    ['weapon_assaultrifle'] = {
        name = 'WEAPON_ASSAULTRIFLE',
        label = 'Assault Rifle',
        weight = 3500,
        image = 'weapon_assaultrifle.png',
        description = 'A standard AK assault rifle',
        ammoType = 'ammo_rifle'
    },

    ['weapon_assaultrifle_mk2'] = {
        name = 'WEAPON_ASSAULTRIFLE_MK2',
        label = 'Assault Rifle MK2',
        weight = 3600,
        image = 'weapon_assaultrifle_mk2.png',
        description = 'Upgraded version of the Assault Rifle',
        ammoType = 'ammo_rifle'
    },

    ['weapon_carbinerifle'] = {
        name = 'WEAPON_CARBINERIFLE',
        label = 'Carbine Rifle',
        weight = 3300,
        image = 'weapon_carbinerifle.png',
        description = 'A versatile M4 carbine',
        ammoType = 'ammo_rifle'
    },

    ['weapon_carbinerifle_mk2'] = {
        name = 'WEAPON_CARBINERIFLE_MK2',
        label = 'Carbine Rifle MK2',
        weight = 3400,
        image = 'weapon_carbinerifle_mk2.png',
        description = 'Upgraded version of the Carbine Rifle',
        ammoType = 'ammo_rifle'
    },

    ['weapon_advancedrifle'] = {
        name = 'WEAPON_ADVANCEDRIFLE',
        label = 'Advanced Rifle',
        weight = 3200,
        image = 'weapon_advancedrifle.png',
        description = 'A modern assault rifle',
        ammoType = 'ammo_rifle'
    },

    ['weapon_specialcarbine'] = {
        name = 'WEAPON_SPECIALCARBINE',
        label = 'Special Carbine',
        weight = 3400,
        image = 'weapon_specialcarbine.png',
        description = 'A G36 special carbine',
        ammoType = 'ammo_rifle'
    },

    ['weapon_specialcarbine_mk2'] = {
        name = 'WEAPON_SPECIALCARBINE_MK2',
        label = 'Special Carbine MK2',
        weight = 3500,
        image = 'weapon_specialcarbine_mk2.png',
        description = 'Upgraded version of the Special Carbine',
        ammoType = 'ammo_rifle'
    },

    ['weapon_bullpuprifle'] = {
        name = 'WEAPON_BULLPUPRIFLE',
        label = 'Bullpup Rifle',
        weight = 3100,
        image = 'weapon_bullpuprifle.png',
        description = 'A bullpup configuration rifle',
        ammoType = 'ammo_rifle'
    },

    ['weapon_bullpuprifle_mk2'] = {
        name = 'WEAPON_BULLPUPRIFLE_MK2',
        label = 'Bullpup Rifle MK2',
        weight = 3200,
        image = 'weapon_bullpuprifle_mk2.png',
        description = 'Upgraded version of the Bullpup Rifle',
        ammoType = 'ammo_rifle'
    },

    ['weapon_compactrifle'] = {
        name = 'WEAPON_COMPACTRIFLE',
        label = 'Compact Rifle',
        weight = 2800,
        image = 'weapon_compactrifle.png',
        description = 'A compact assault rifle',
        ammoType = 'ammo_rifle'
    },

    ['weapon_militaryrifle'] = {
        name = 'WEAPON_MILITARYRIFLE',
        label = 'Military Rifle',
        weight = 3700,
        image = 'weapon_militaryrifle.png',
        description = 'A FAMAS military rifle',
        ammoType = 'ammo_rifle'
    },

    ['weapon_heavyrifle'] = {
        name = 'WEAPON_HEAVYRIFLE',
        label = 'Heavy Rifle',
        weight = 4000,
        image = 'weapon_heavyrifle.png',
        description = 'A SCAR heavy rifle',
        ammoType = 'ammo_rifle'
    },

    ['weapon_tacticalrifle'] = {
        name = 'WEAPON_TACTICALRIFLE',
        label = 'Tactical Rifle',
        weight = 3600,
        image = 'weapon_tacticalrifle.png',
        description = 'A modern tactical rifle',
        ammoType = 'ammo_rifle'
    },


    -- ============================================================================
    -- MACHINE GUNS
    -- ============================================================================

    ['weapon_mg'] = {
        name = 'WEAPON_MG',
        label = 'MG',
        weight = 5000,
        image = 'weapon_mg.png',
        description = 'A heavy machine gun',
        ammoType = 'ammo_mg'
    },

    ['weapon_combatmg'] = {
        name = 'WEAPON_COMBATMG',
        label = 'Combat MG',
        weight = 5500,
        image = 'weapon_combatmg.png',
        description = 'A M249 combat machine gun',
        ammoType = 'ammo_mg'
    },

    ['weapon_combatmg_mk2'] = {
        name = 'WEAPON_COMBATMG_MK2',
        label = 'Combat MG MK2',
        weight = 5600,
        image = 'weapon_combatmg_mk2.png',
        description = 'Upgraded version of the Combat MG',
        ammoType = 'ammo_mg'
    },

    ['weapon_gusenberg'] = {
        name = 'WEAPON_GUSENBERG',
        label = 'Gusenberg Sweeper',
        weight = 4500,
        image = 'weapon_gusenberg.png',
        description = 'A classic Thompson submachine gun',
        ammoType = 'ammo_mg'
    },


    -- ============================================================================
    -- SNIPER RIFLES
    -- ============================================================================

    ['weapon_sniperrifle'] = {
        name = 'WEAPON_SNIPERRIFLE',
        label = 'Sniper Rifle',
        weight = 4500,
        image = 'weapon_sniperrifle.png',
        description = 'A standard sniper rifle',
        ammoType = 'ammo_sniper'
    },

    ['weapon_heavysniper'] = {
        name = 'WEAPON_HEAVYSNIPER',
        label = 'Heavy Sniper',
        weight = 6000,
        image = 'weapon_heavysniper.png',
        description = 'An anti-materiel sniper rifle',
        ammoType = 'ammo_sniper'
    },

    ['weapon_heavysniper_mk2'] = {
        name = 'WEAPON_HEAVYSNIPER_MK2',
        label = 'Heavy Sniper MK2',
        weight = 6200,
        image = 'weapon_heavysniper_mk2.png',
        description = 'Upgraded version of the Heavy Sniper',
        ammoType = 'ammo_sniper'
    },

    ['weapon_marksmanrifle'] = {
        name = 'WEAPON_MARKSMANRIFLE',
        label = 'Marksman Rifle',
        weight = 4000,
        image = 'weapon_marksmanrifle.png',
        description = 'A semi-automatic marksman rifle',
        ammoType = 'ammo_sniper'
    },

    ['weapon_marksmanrifle_mk2'] = {
        name = 'WEAPON_MARKSMANRIFLE_MK2',
        label = 'Marksman Rifle MK2',
        weight = 4100,
        image = 'weapon_marksmanrifle_mk2.png',
        description = 'Upgraded version of the Marksman Rifle',
        ammoType = 'ammo_sniper'
    },

    ['weapon_precisionrifle'] = {
        name = 'WEAPON_PRECISIONRIFLE',
        label = 'Precision Rifle',
        weight = 4300,
        image = 'weapon_precisionrifle.png',
        description = 'A high precision rifle',
        ammoType = 'ammo_sniper'
    },


    -- ============================================================================
    -- HEAVY WEAPONS
    -- ============================================================================

    ['weapon_rpg'] = {
        name = 'WEAPON_RPG',
        label = 'RPG',
        weight = 7000,
        image = 'weapon_rpg.png',
        description = 'An RPG-7 rocket launcher',
        ammoType = 'ammo_rpg'
    },

    ['weapon_grenadelauncher'] = {
        name = 'WEAPON_GRENADELAUNCHER',
        label = 'Grenade Launcher',
        weight = 5000,
        image = 'weapon_grenadelauncher.png',
        description = 'An M32 grenade launcher',
        ammoType = 'ammo_grenadelauncher'
    },

    ['weapon_grenadelauncher_smoke'] = {
        name = 'WEAPON_GRENADELAUNCHER_SMOKE',
        label = 'Smoke Grenade Launcher',
        weight = 5000,
        image = 'weapon_grenadelauncher_smoke.png',
        description = 'A smoke grenade launcher',
        ammoType = 'ammo_grenadelauncher_smoke'
    },

    ['weapon_minigun'] = {
        name = 'WEAPON_MINIGUN',
        label = 'Minigun',
        weight = 15000,
        image = 'weapon_minigun.png',
        description = 'A rotary minigun',
        ammoType = 'ammo_minigun'
    },

    ['weapon_firework'] = {
        name = 'WEAPON_FIREWORK',
        label = 'Firework Launcher',
        weight = 3000,
        image = 'weapon_firework.png',
        description = 'A firework launcher',
        ammoType = 'ammo_firework'
    },

    ['weapon_railgun'] = {
        name = 'WEAPON_RAILGUN',
        label = 'Railgun',
        weight = 8000,
        image = 'weapon_railgun.png',
        description = 'An electromagnetic railgun',
        ammoType = 'ammo_railgun'
    },

    ['weapon_hominglauncher'] = {
        name = 'WEAPON_HOMINGLAUNCHER',
        label = 'Homing Launcher',
        weight = 9000,
        image = 'weapon_hominglauncher.png',
        description = 'A homing missile launcher',
        ammoType = 'ammo_homing'
    },

    ['weapon_compactlauncher'] = {
        name = 'WEAPON_COMPACTLAUNCHER',
        label = 'Compact Launcher',
        weight = 4000,
        image = 'weapon_compactlauncher.png',
        description = 'A compact grenade launcher',
        ammoType = 'ammo_grenadelauncher'
    },

    ['weapon_rayminigun'] = {
        name = 'WEAPON_RAYMINIGUN',
        label = 'Widowmaker',
        weight = 10000,
        image = 'weapon_rayminigun.png',
        description = 'An alien rotary gun'
    },

    ['weapon_emplauncher'] = {
        name = 'WEAPON_EMPLAUNCHER',
        label = 'EMP Launcher',
        weight = 5000,
        image = 'weapon_emplauncher.png',
        description = 'An electromagnetic pulse launcher',
        ammoType = 'ammo_emp'
    },


    -- ============================================================================
    -- THROWABLES
    -- ============================================================================

    ['weapon_grenade'] = {
        name = 'WEAPON_GRENADE',
        label = 'Grenade',
        weight = 300,
        image = 'weapon_grenade.png',
        description = 'An explosive grenade',
        stackLimits = 10
    },

    ['weapon_bzgas'] = {
        name = 'WEAPON_BZGAS',
        label = 'BZ Gas',
        weight = 300,
        image = 'weapon_bzgas.png',
        description = 'An incapacitating gas grenade',
        stackLimits = 10
    },

    ['weapon_smokegrenade'] = {
        name = 'WEAPON_SMOKEGRENADE',
        label = 'Smoke Grenade',
        weight = 300,
        image = 'weapon_smokegrenade.png',
        description = 'A smoke grenade',
        stackLimits = 10
    },

    ['weapon_flare'] = {
        name = 'WEAPON_FLARE',
        label = 'Flare',
        weight = 200,
        image = 'weapon_flare.png',
        description = 'A signal flare',
        stackLimits = 10
    },

    ['weapon_molotov'] = {
        name = 'WEAPON_MOLOTOV',
        label = 'Molotov Cocktail',
        weight = 400,
        image = 'weapon_molotov.png',
        description = 'An incendiary Molotov cocktail',
        stackLimits = 10
    },

    ['weapon_stickybomb'] = {
        name = 'WEAPON_STICKYBOMB',
        label = 'Sticky Bomb',
        weight = 400,
        image = 'weapon_stickybomb.png',
        description = 'A remote detonated sticky bomb',
        stackLimits = 10
    },

    ['weapon_proxmine'] = {
        name = 'WEAPON_PROXMINE',
        label = 'Proximity Mine',
        weight = 500,
        image = 'weapon_proxmine.png',
        description = 'A proximity triggered mine',
        stackLimits = 5
    },

    ['weapon_pipebomb'] = {
        name = 'WEAPON_PIPEBOMB',
        label = 'Pipe Bomb',
        weight = 400,
        image = 'weapon_pipebomb.png',
        description = 'A homemade pipe bomb',
        stackLimits = 10
    },

    ['weapon_ball'] = {
        name = 'WEAPON_BALL',
        label = 'Ball',
        weight = 100,
        image = 'weapon_ball.png',
        description = 'A baseball',
        stackLimits = 20
    },

    ['weapon_snowball'] = {
        name = 'WEAPON_SNOWBALL',
        label = 'Snowball',
        weight = 50,
        image = 'weapon_snowball.png',
        description = 'A snowball',
        stackLimits = 20
    },
}


-- ============================================================================
-- AMMO
-- ============================================================================

Ammo = {

    ['ammo_pistol'] = {
        -- [REQUIRED] GTA ammo hash (must match the table key in uppercase with AMMO_ prefix)
        name = 'AMMO_PISTOL',

        -- [REQUIRED] Display name in inventory
        label = 'Pistol Ammo',

        -- [REQUIRED] Weight in grams (minimum: 0)
        weight = 5,

        -- [OPTIONAL] Image filename (must exist in images folder) | Default: no image
        image = 'ammo_pistol.png',

        -- [OPTIONAL] Description displayed in inventory | Default: empty
        description = '9mm caliber ammunition for pistols',

        -- [REQUIRED] Stack limit per slot (ammo can always stack)
        stackLimits = 20
    },

    ['ammo_smg'] = {
        name = 'AMMO_SMG',
        label = 'SMG Ammo',
        weight = 5,
        image = 'ammo_smg.png',
        description = 'Ammunition for submachine guns',
        stackLimits = 20
    },

    ['ammo_shotgun'] = {
        name = 'AMMO_SHOTGUN',
        label = 'Shotgun Shells',
        weight = 15,
        image = 'ammo_shotgun.png',
        description = 'Shells for shotguns',
        stackLimits = 10
    },

    ['ammo_rifle'] = {
        name = 'AMMO_RIFLE',
        label = 'Rifle Ammo',
        weight = 10,
        image = 'ammo_rifle.png',
        description = '5.56 caliber ammunition for assault rifles',
        stackLimits = 15
    },

    ['ammo_mg'] = {
        name = 'AMMO_MG',
        label = 'MG Ammo',
        weight = 15,
        image = 'ammo_mg.png',
        description = 'Ammunition for machine guns',
        stackLimits = 10
    },

    ['ammo_sniper'] = {
        name = 'AMMO_SNIPER',
        label = 'Sniper Ammo',
        weight = 20,
        image = 'ammo_sniper.png',
        description = '.50 caliber ammunition for sniper rifles',
        stackLimits = 10
    },

    ['ammo_rpg'] = {
        name = 'AMMO_RPG',
        label = 'RPG Rockets',
        weight = 500,
        image = 'ammo_rpg.png',
        description = 'Rockets for RPG launcher',
        stackLimits = 5
    },

    ['ammo_grenadelauncher'] = {
        name = 'AMMO_GRENADELAUNCHER',
        label = '40mm Grenades',
        weight = 200,
        image = 'ammo_grenadelauncher.png',
        description = '40mm explosive grenades',
        stackLimits = 10
    },

    ['ammo_grenadelauncher_smoke'] = {
        name = 'AMMO_GRENADELAUNCHER_SMOKE',
        label = '40mm Smoke Grenades',
        weight = 150,
        image = 'ammo_grenadelauncher_smoke.png',
        description = '40mm smoke grenades',
        stackLimits = 10
    },

    ['ammo_minigun'] = {
        name = 'AMMO_MINIGUN',
        label = 'Minigun Ammo',
        weight = 5,
        image = 'ammo_minigun.png',
        description = 'Ammunition for minigun',
        stackLimits = 10
    },

    ['ammo_firework'] = {
        name = 'AMMO_FIREWORK',
        label = 'Fireworks',
        weight = 100,
        image = 'ammo_firework.png',
        description = 'Fireworks for launcher',
        stackLimits = 10
    },

    ['ammo_railgun'] = {
        name = 'AMMO_RAILGUN',
        label = 'Railgun Charges',
        weight = 300,
        image = 'ammo_railgun.png',
        description = 'Charges for railgun',
        stackLimits = 5
    },

    ['ammo_homing'] = {
        name = 'AMMO_HOMING_LAUNCHER',
        label = 'Homing Missiles',
        weight = 600,
        image = 'ammo_homing.png',
        description = 'Heat-seeking missiles',
        stackLimits = 5
    },

    ['ammo_emp'] = {
        name = 'AMMO_EMPLAUNCHER',
        label = 'EMP Charges',
        weight = 200,
        image = 'ammo_emp.png',
        description = 'Electromagnetic charges',
        stackLimits = 5
    },

    ['ammo_flare'] = {
        name = 'AMMO_FLARE',
        label = 'Flare Rounds',
        weight = 50,
        image = 'ammo_flare.png',
        description = 'Flares for flare gun',
        stackLimits = 10
    },
}
