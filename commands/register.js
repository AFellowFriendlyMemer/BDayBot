const mongo = require('../mongo');
const data = require('../data');
const DiscordJS = require('discord.js');


module.exports = {
    commands: ['register'],
    callback: async (message, arguments, text) => {
        const { author } = message;
        const { id } = author;
        
        let result;
            await mongo().then(async (mongoose) => {
                try {
                    try {

                        res = await data.findOne({
                            _id: message.guild.id
                        })
    
                    } finally {
                        
                        if (res) {
                            try {
                                console.log('running findOne()')
                                result = await data.findOne({
                                    _id: id,
                                    guildId: message.guild.id
                                });
                                console.log(result);
                            } finally {
                            if (result) {
                                message.channel.send('Already enrolled in this server. Looking to change your birthday? Run b:change instead.');
                                mongoose.connection.close();
                            } else {
                                    try {
            
                                        let questions = [
                                            'What is your birth month (M or MM)?',
                                            'What is your birth date (D or DD)?',
                                            'What time would you like to be pinged? (MILITARY TIME EST) (HH:MM)'
                                        ];
            
                                        let counter = 0;
            
                                        const filter = (m) => m.author.id == message.author.id;
            
                                        const collector = new DiscordJS.MessageCollector(message.channel, filter, {
                                            max: questions.length,
                                            time: 1000 * 20
                                        })
            
                                        message.channel.send(questions[counter++]);
                                        collector.on('collect', m => {
                                            if (counter < questions.length) {
                                                m.channel.send(questions[counter++]);
                                            }
                                        })
            
                                        let results = [];
            
                                        collector.on('end', async (collected) => {
                                            
                                            let counter = 0;
                                            collected.forEach((value) => {
                                                results.push(value.content);
                                                console.log(value.content)
                                            });
    
                                            let res2;
    
                                            res2 = results[2].split(':');
                                            console.log('results[0].length : ' + results[0].length);
                                            console.log('results[1].length : ' + results[1].length);
                                            console.log('res2[0].length : ' + res2[0].length);
                                            console.log('res2[1].length : ' + res2[1].length);
            
                                        if ((results[0].length < 3 && results[0].length > 0) && (results[1].length < 3 && results[1].length > 0) && (res2[0].length > 0 && res2[0].length < 3) && (res2[1].length > 0 && res2[1].length < 3)) {
                                            
                                            let month = parseInt(results[0]) - 1;
                                            let date = parseInt(results[1]);
                                            let hour = parseInt(res2[0]);
                                            let minute = parseInt(res2[1]);
    
                                            console.log(month, date, hour, minute);
                                            if ((!isNaN(month) && !isNaN(date)) && (!isNaN(hour) && !isNaN(minute))) {
    
                                                
                                                    await mongo().then(async (mongoose) => {
                                                        try {
                                                            await new data({
                                                                _id: id,
                                                                month,
                                                                date,
                                                                hour,
                                                                minute,
                                                                guildId: message.guild.id
                                                            }, {
                                                                upsert: true
                                                            }).save()
    
                                                            message.reply(`All done! You will be pinged on ${month + 1}/${date} at ${hour}:${minute}. Thank you!`);
                                                        } finally {
                                                            mongoose.connection.close()
                                                        }
                                                        
                                                    })
                                                 
                                                
                                            } else {
                                                message.reply('Please enter all values in the correct format');
                                            }
                                        } else {
                                            message.reply('Please enter the values in the correct format');
                                        }
                                        });
            
                    
            
                                        
                                        
                                    } finally {
                                        mongoose.connection.close();
                                    }
                                    };
                            }
                        } else {
                            message.reply(`An admin hasn't set me up yet. Please ask an admin to run b:setup`);
                        }
                
                
                

              


                
            };
        } finally {
            mongoose.connection.close();
        }
    })}}