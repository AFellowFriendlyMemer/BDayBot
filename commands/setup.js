const mongo = require('../mongo');
const data = require('../data');
const DiscordJS = require('discord.js');

module.exports = {
    commands: ['setup'],
    permissions: ['ADMINISTRATOR'],
    callback: async (message, arguments, text) => {
        const { author } = message;
        const { id } = author;

        await mongo().then(async (mongoose) => {
            
            let res = await data.findOne({
                _id: message.guild.id
            });

            if (res) {
                message.reply(`I've been setup already by an admin. I'm afraid changing the config is not supported yet. Please contact my creator to change any settings`);
            } else {
                

                let questions = [
                    'Would you like me to ping in this channel? (y/n)'
                ];

                let counter = 0;

                message.channel.send(questions[counter]);
                

                const filter = m => m.author.id === author.id;

                const collector = new DiscordJS.MessageCollector(message.channel, filter, {
                    max: 1
                });

                collector.on('end', async (collected) => {

                    let res;
                    collected.forEach((value) => {
                        res = value.content;
                    });
                    console.log(collected);

                    if (res == 'y' || res == 'n') {
                        if (res == 'y') {
                            await new data({
                                _id: message.guild.id,
                                channel: message.channel.id
                            }, {
                                upsert: true
                            }).save();
                            message.reply('Alright! I have been setup. If you would like to change anything, contact my creator');
                        } else {
                            message.reply(`Ok, run this again in a different channel if you wish`);
                        }
                        
                    } else {
                        message.reply('Please enter y or n. Setup abandoned');
                    }
                })
            }

        })

    }
}