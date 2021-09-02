const DiscordJS = require('discord.js');
const client = new DiscordJS.Client();
const fs = require('fs');

require("dotenv").config()

const mongo = require('./mongo');
const path = require('path');
const { findOne } = require('./data');
const data = require('./data');

const _dirname = path.resolve(path.dirname(''));

client.login(process.env.BOT_TOKEN);
console.log(process.env.MONGOPATH);
client.on('ready', async () => {
    console.log('The client is active');
    const date = new Date();
    console.log(date.getDate());
    console.log(date.getMonth() + 1);

    const baseFile = 'command-base.js';
    const commandBase = require(`./commands/${baseFile}`)

    

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(_dirname, dir));
        for (const file of files) {
            const stat = fs.lstatSync(path.join(_dirname, dir, file));
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file));
            } else if (file !== baseFile) {
                const option = require(path.join(_dirname, dir, file));;
                commandBase(client, option);
            }
        }
    }


    


    readCommands('commands');

    await mongo().then(mongoose => {
        try {
            console.log('Connected to mongo!');
        } finally {
            mongoose.connection.close();
        }
    })

    let currentTime = async () => {
        let now = new Date();
        let mon = now.getMonth();
        let date = now.getDate();
        let hr = now.getHours();
        let min = now.getMinutes();
        console.log(hr, min);

        await mongo().then(async (mongoose) => {
            try {
                await mongo().then(async (mongoose) => {
                    let bday = await data.findOne({
                        month: mon,
                        date,
                        hour: hr,
                        minute: min
                        
                    });
        
                    if (bday) {
                        let guildId = await data.findOne({
                            _id: bday.guildId
                        });
                        
                        console.log(client.guilds);
                        let botGuild = client.guilds.cache.get(guildId._id);
                        console.log(botGuild)
                        let channel = botGuild.channels.cache.get(guildId.channel);
    
    
    
                        channel.send(`Happy birthday <@${bday._id}>!`);
                
                    } 
                }) 
             
        } finally {

        }
        
        setTimeout(currentTime, 60000);

        
    })

    

    
    };

    currentTime();

})