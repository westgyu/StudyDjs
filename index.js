require('dotenv/config')

const { Client, Intents } = require('discord.js')

const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
})

client.once('ready', async () => {
    console.log('Ready!')

    // https://discord.js.org/#/docs/discord.js/stable/typedef/ApplicationCommandData
    const commands = [
        {
            name: "ping",
            description: "pong!"
        },
        {
            name: "calc",
            description: "계산기",
            // https://discord.js.org/#/docs/discord.js/stable/typedef/ApplicationCommandOptionData
            options: [ // 입력
                {
                    type: 'NUMBER',
                    name: 'a',
                    required: true,
                    description: '첫번째 숫자를 입력하세요'
                },
                {
                    type: 'STRING',
                    name: 'exr',
                    required: true,
                    description: '연산자를 선택하세요',
                    // https://discord.js.org/#/docs/discord.js/stable/typedef/ApplicationCommandOptionChoice
                    choices: [
                        {
                            name: '+',
                            value: 'add'
                        }, 
                        {
                            name: '-',
                            value: 'sub'
                        }, 
                        {
                            name: '*',
                            value: 'mult'
                        },
                        {
                            name: '/',
                            value: 'div'
                        }
                    ]
                },
                {
                    type: 'NUMBER',
                    name: 'b',
                    required: true,
                    description: '두번째 숫자를 입력하세요'
                }
            ]
        }
    ]

    await client.application.commands.set(commands, process.env.GI)
    console.log('Command Registed!')
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isApplicationCommand()) return

    if (interaction.commandName === "ping") {
        while (true) {
            interaction[interaction.replied ? 'editReply' : 'reply']({
                content: `pong!! ${client.ws.ping}ms`,
                components: [{
                    type: 'ACTION_ROW',
                    components: [{
                        type: 'BUTTON',
                        label: '다시 측정하기!',
                        customId: 'retry_ping_' + interaction.id,
                        style: 'SUCCESS'
                    }]
                }]
            })

            try {
                while (true) {
                    const i = await interaction.channel.awaitMessageComponent({
                        componentType: 'BUTTON',
                        filter: (i) =>
                            i.customId === 'retry_ping_' + interaction.id,
                        time: 10 * 1000
                    })

                    if (i.user.id === interaction.user.id) {
                        i.reply('다시 측정했어요!')
                        break
                    }
                    i.reply('잘못된 사용자입니다.')
                }
            } catch (_) {
                interaction.editReply({
                    components: []
                })
                break
            }
        }
    }

    if (interaction.commandName === 'calc') {
        const a = interaction.options.get('a').value // 값 가져오기
        const b = interaction.options.get('b').value
        const exr = interaction.options.get('exr').value
        
        let result = 0

        switch (exr) {
            case 'add': {
                result = a + b
                break
            }
            
            case 'sub': {
                result = a - b
                break
            }

            case 'mult': {
                result = a * b
                break
            }

            case 'div': {
                result = a / b
                break
            }

            default: {
                interaction.reply('그런 연산자는 없습니다')
                return
            }
        }

        interaction.reply('결과는... ' + result)
    }
})

client.login(process.env.TOKEN)