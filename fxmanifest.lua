fx_version 'cerulean'

game 'gta5'

use_experimental_fxv2_oal 'yes'

author 'Ambitions Studio'

description 'Ambitions Inventory — A complete inventory management system with drag & drop, equipment, hotbar, and ground items. Built for the Ambitions framework.'

version '0.1.0'

name 'Ambitions Inventory'

lua54 'yes'

shared_scripts {
    '@Ambitions/init.lua',

    'config/*.lua',

    'shared/*.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
}

client_scripts {
    'client/modules/*.lua'
}

ui_page 'web/dist/index.html'

files {
    'web/dist/index.html',
    'web/dist/assets/*.css',
    'web/dist/assets/*.js',
    'web/dist/images/**/*.png',
    'web/dist/images/**/*.webp'
}

dependencies {
    'oxmysql',
    'Ambitions'
}
