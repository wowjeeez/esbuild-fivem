-- FiveM supported server/game info, don't change unless you know what you're doing
fx_version 'cerulean'
game 'gta5'

-- Project name
name 'your-awesome-project'

--[[ 
    Load our server and client scripts, globbed by the dist folder 
    to allow all JS files to be loaded. You shouldn't have to change 
    this unless you're doing something custom.
 ]]--
server_script 'dist/server/**/*.js'
client_script 'dist/client/**/*.js'
