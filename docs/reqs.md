>"discord.db" sqlite database (can be empty file) created in root
>"ormconfig.ts" file to configure database
>Run migrations to populate db with data
>.env file according to .env.example
For the db name, just use the name, not the extension .db


>Pay attention to sapphire framework version (curr using v3.0.0 unstable)



# INSTALL

>create "discord.db" sqlite in root
>create "ormconfig.ts"
>setup the ".env"
>npm run build
>npm run start (buildup the tables)
>run migrations (typeorm-and-migrations.md)
>npm run start 



## Good to know

When no guildId, it might come from a DM channel