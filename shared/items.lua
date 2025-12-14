items = {
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
    }
}