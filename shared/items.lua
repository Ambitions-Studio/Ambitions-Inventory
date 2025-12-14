Items = {
    ['cash'] = {
        -- [OBLIGATOIRE] Identifiant unique de l'item (doit correspondre à la clé de la table)
        name = 'cash',

        -- [OBLIGATOIRE] Nom affiché dans l'inventaire
        label = 'Argent',

        -- [OBLIGATOIRE] Poids de l'item (minimum: 0)
        weight = 0,

        -- [OPTIONNEL] Nom du fichier image (doit exister dans le dossier images) | Défaut: aucune image
        image = 'placeholder.png',

        -- [OBLIGATOIRE] Type de l'item: 'item' ou 'weapon'
        type = 'item',

        -- [OPTIONNEL] Si true, l'item ne peut pas être stacké (1 seul par slot) | Défaut: false
        isUnique = false,

        -- [OPTIONNEL] Limite de stack par slot (nombre ou false pour illimité) | Défaut: false
        stackLimits = 20,

        -- [OPTIONNEL] Si true, l'item peut être utilisé | Défaut: false
        isUseable = false,

        -- [OPTIONNEL] Si true, ferme l'inventaire après utilisation | Défaut: false
        closeInventory = false,

        -- [OPTIONNEL] Description affichée dans l'inventaire | Défaut: vide
        description = "De l'argent liquide",

        -- [OPTIONNEL] Restriction par job (table de noms de jobs ou false) | Défaut: false (aucune restriction)
        job = {'police', 'sheriff'}
    },

    ['bread'] = {
        name = 'bread',
        label = 'Pain',
        weight = 100,
        image = 'bread.png',
        type = 'item',
        isUnique = false,
        stackLimits = 10,
        isUseable = true,
        closeInventory = true,
        description = 'Un bon pain frais'
    },

    ['water'] = {
        name = 'water',
        label = 'Bouteille d\'eau',
        weight = 500,
        image = 'water.png',
        type = 'item',
        isUnique = false,
        stackLimits = 5,
        isUseable = true,
        closeInventory = true,
        description = 'Une bouteille d\'eau fraîche'
    },

    ['cola'] = {
        name = 'cola',
        label = 'Cola',
        weight = 350,
        image = 'cola.png',
        type = 'item',
        isUnique = false,
        stackLimits = 10,
        isUseable = true,
        closeInventory = true,
        description = 'Une canette de cola bien fraîche'
    },

    ['burger'] = {
        name = 'burger',
        label = 'Burger',
        weight = 300,
        image = 'burger.png',
        type = 'item',
        isUnique = false,
        stackLimits = 5,
        isUseable = true,
        closeInventory = true,
        description = 'Un délicieux burger'
    },

    ['pizza'] = {
        name = 'pizza',
        label = 'Pizza',
        weight = 400,
        image = 'pizza.png',
        type = 'item',
        isUnique = false,
        stackLimits = 3,
        isUseable = true,
        closeInventory = true,
        description = 'Une part de pizza'
    },

    ['donut'] = {
        name = 'donut',
        label = 'Donut',
        weight = 100,
        image = 'donut.png',
        type = 'item',
        isUnique = false,
        stackLimits = 12,
        isUseable = true,
        closeInventory = true,
        description = 'Un donut glacé'
    },

    ['coffee'] = {
        name = 'coffee',
        label = 'Café',
        weight = 250,
        image = 'coffee.png',
        type = 'item',
        isUnique = false,
        stackLimits = 5,
        isUseable = true,
        closeInventory = true,
        description = 'Un café chaud'
    },

    ['sandwich'] = {
        name = 'sandwich',
        label = 'Sandwich',
        weight = 250,
        image = 'sandwich.png',
        type = 'item',
        isUnique = false,
        stackLimits = 5,
        isUseable = true,
        closeInventory = true,
        description = 'Un sandwich jambon-beurre'
    },

    ['apple'] = {
        name = 'apple',
        label = 'Pomme',
        weight = 150,
        image = 'apple.png',
        type = 'item',
        isUnique = false,
        stackLimits = 20,
        isUseable = true,
        closeInventory = false,
        description = 'Une pomme croquante'
    },

    ['orange_juice'] = {
        name = 'orange_juice',
        label = 'Jus d\'orange',
        weight = 300,
        image = 'orange_juice.png',
        type = 'item',
        isUnique = false,
        stackLimits = 5,
        isUseable = true,
        closeInventory = true,
        description = 'Un jus d\'orange pressé'
    },

    ['energy_drink'] = {
        name = 'energy_drink',
        label = 'Boisson énergisante',
        weight = 250,
        image = 'energy_drink.png',
        type = 'item',
        isUnique = false,
        stackLimits = 10,
        isUseable = true,
        closeInventory = true,
        description = 'Booste ton énergie!'
    },

    ['bandage'] = {
        name = 'bandage',
        label = 'Bandage',
        weight = 50,
        image = 'bandage.png',
        type = 'item',
        isUnique = false,
        stackLimits = 20,
        isUseable = true,
        closeInventory = true,
        description = 'Un bandage pour soigner les petites blessures'
    },

    ['medikit'] = {
        name = 'medikit',
        label = 'Kit médical',
        weight = 500,
        image = 'medikit.png',
        type = 'item',
        isUnique = false,
        stackLimits = 3,
        isUseable = true,
        closeInventory = true,
        description = 'Un kit médical complet'
    },

    ['painkiller'] = {
        name = 'painkiller',
        label = 'Antidouleur',
        weight = 20,
        image = 'painkiller.png',
        type = 'item',
        isUnique = false,
        stackLimits = 30,
        isUseable = true,
        closeInventory = false,
        description = 'Des cachets antidouleur'
    },

    ['phone'] = {
        name = 'phone',
        label = 'Téléphone',
        weight = 200,
        image = 'phone.png',
        type = 'item',
        isUnique = true,
        isUseable = true,
        closeInventory = true,
        description = 'Un smartphone'
    },

    ['radio'] = {
        name = 'radio',
        label = 'Radio',
        weight = 300,
        image = 'radio.png',
        type = 'item',
        isUnique = true,
        isUseable = true,
        closeInventory = false,
        description = 'Une radio portative'
    },

    ['lockpick'] = {
        name = 'lockpick',
        label = 'Crochet',
        weight = 50,
        image = 'lockpick.png',
        type = 'item',
        isUnique = false,
        stackLimits = 10,
        isUseable = true,
        closeInventory = true,
        description = 'Un crochet pour ouvrir les serrures'
    },

    ['flashlight'] = {
        name = 'flashlight',
        label = 'Lampe torche',
        weight = 200,
        image = 'flashlight.png',
        type = 'item',
        isUnique = true,
        isUseable = true,
        closeInventory = false,
        description = 'Une lampe torche puissante'
    },

    ['rope'] = {
        name = 'rope',
        label = 'Corde',
        weight = 500,
        image = 'rope.png',
        type = 'item',
        isUnique = false,
        stackLimits = 5,
        isUseable = false,
        description = 'Une corde solide'
    },

    ['duct_tape'] = {
        name = 'duct_tape',
        label = 'Ruban adhésif',
        weight = 100,
        image = 'duct_tape.png',
        type = 'item',
        isUnique = false,
        stackLimits = 10,
        isUseable = false,
        description = 'Du ruban adhésif résistant'
    },

    ['screwdriver'] = {
        name = 'screwdriver',
        label = 'Tournevis',
        weight = 150,
        image = 'screwdriver.png',
        type = 'item',
        isUnique = false,
        stackLimits = 5,
        isUseable = false,
        description = 'Un tournevis multifonction'
    },

    ['wrench'] = {
        name = 'wrench',
        label = 'Clé à molette',
        weight = 300,
        image = 'wrench.png',
        type = 'item',
        isUnique = false,
        stackLimits = 3,
        isUseable = false,
        description = 'Une clé à molette'
    },

    ['steel'] = {
        name = 'steel',
        label = 'Acier',
        weight = 1000,
        image = 'steel.png',
        type = 'item',
        isUnique = false,
        stackLimits = 50,
        isUseable = false,
        description = 'Un lingot d\'acier'
    },

    ['plastic'] = {
        name = 'plastic',
        label = 'Plastique',
        weight = 200,
        image = 'plastic.png',
        type = 'item',
        isUnique = false,
        stackLimits = 100,
        isUseable = false,
        description = 'Du plastique recyclable'
    },

    ['glass'] = {
        name = 'glass',
        label = 'Verre',
        weight = 300,
        image = 'glass.png',
        type = 'item',
        isUnique = false,
        stackLimits = 50,
        isUseable = false,
        description = 'Du verre'
    },

    ['electronic_parts'] = {
        name = 'electronic_parts',
        label = 'Composants électroniques',
        weight = 100,
        image = 'electronic_parts.png',
        type = 'item',
        isUnique = false,
        stackLimits = 30,
        isUseable = false,
        description = 'Des composants électroniques divers'
    },

    ['id_card'] = {
        name = 'id_card',
        label = 'Carte d\'identité',
        weight = 10,
        image = 'id_card.png',
        type = 'item',
        isUnique = true,
        isUseable = true,
        closeInventory = false,
        description = 'Votre carte d\'identité'
    },

    ['driver_license'] = {
        name = 'driver_license',
        label = 'Permis de conduire',
        weight = 10,
        image = 'driver_license.png',
        type = 'item',
        isUnique = true,
        isUseable = true,
        closeInventory = false,
        description = 'Votre permis de conduire'
    },

    ['weapon_license'] = {
        name = 'weapon_license',
        label = 'Permis de port d\'arme',
        weight = 10,
        image = 'weapon_license.png',
        type = 'item',
        isUnique = true,
        isUseable = true,
        closeInventory = false,
        description = 'Votre permis de port d\'arme'
    },

    ['pistol'] = {
        name = 'pistol',
        label = 'Pistolet',
        weight = 1000,
        image = 'pistol.png',
        type = 'weapon',
        isUnique = true,
        isUseable = true,
        closeInventory = true,
        description = 'Un pistolet semi-automatique'
    },

    ['pistol_ammo'] = {
        name = 'pistol_ammo',
        label = 'Munitions pistolet',
        weight = 50,
        image = 'pistol_ammo.png',
        type = 'item',
        isUnique = false,
        stackLimits = 250,
        isUseable = false,
        description = 'Des munitions pour pistolet'
    },

    ['taser'] = {
        name = 'taser',
        label = 'Taser',
        weight = 500,
        image = 'taser.png',
        type = 'weapon',
        isUnique = true,
        isUseable = true,
        closeInventory = true,
        description = 'Un taser',
        job = { 'police' }
    },

    ['handcuffs'] = {
        name = 'handcuffs',
        label = 'Menottes',
        weight = 200,
        image = 'handcuffs.png',
        type = 'item',
        isUnique = false,
        stackLimits = 5,
        isUseable = true,
        closeInventory = true,
        description = 'Des menottes',
        job = { 'police' }
    }
}