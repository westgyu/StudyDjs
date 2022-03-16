require('dotenv/config')

const { Client, Intents } = require('discord.js')

const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
})

client.once('ready', async () => {
    console.log('Ready!')

    const commands = [{
        name: "ping",
        description: "pong!"
    }]

    await client.application.commands.set(commands, process.env.GI)
    console.log('Command Registed!')
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isApplicationCommand()) return

    if (interaction.commandName === "ping") {
        /**
         * while 문은 보통 잘 안써
         * 함수 하나를 만들어서 재귀를 하는것이 보통 개발자들이 하는 방법
         * 
         * 재귀함수: 자기 자시을 호출하는 함수(ex. 파보나치 수열, 펙토리얼 계산)
         */
        while (true) {
            /*
             * Message Component: 버튼, 드롭박스 ...
             * 설명: https://discord.com/developers/docs/interactions/message-components#what-is-a-component
             * EX]
             * 최상위 필드
             * | 버튼 | 버튼 | 버튼 | < Action Row (한 줄)
             * | 버튼 | 버튼 | 버튼 | < Action Row
             */

            // 만약 이미 대답한 인터렉션이라면? 수정만 하기, 아니면 새로 대답하기
            interaction[interaction.replied ? 'editReply' : 'reply']({ // 삼항연산자 - 조건문 ? 참 : 거짓
                content: `pong!! ${client.ws.ping}ms`,
                components: [{ // 최상위 필드
                    type: 'ACTION_ROW', // 액션 로우
                    components: [{
                        type: 'BUTTON',
                        label: '다시 측정하기!',
                        customId: 'retry_ping_' + interaction.id, // 내부에서 구분하기 위한 id 
                        /**
                         * 같은 id로 만들면 이미 완료되어서 ACK 신호가 날아간 버튼으로 ACK 신호를 날려서 오류가 발생함
                         * interaction.id : 디스코드 자체에서 DB 관리를 위해 만든 ID (API/Discord.js X)
                         */
                        style: 'SUCCESS'
                    }]
                }]
            })

            try {
                /**
                 * awaitMessageComponent()
                 * 인터렉션이 발생할때까지 기다리기
                 * 
                 * 필터:
                 * componentType이 버튼인것
                 * custom_id를 확인해 전에 만들었던 버튼인지 확인
                 * 
                 * (보통 다른 봇들은 명령어를 쳤던 사람만 이 버튼을 누를수 있도록 사용자를 확인하는 필터를 더 추가함) << 이건 어떻게 해??
                 * 
                 * 타임 제한 10초
                 * 
                 * 제한 초과시 에러 발생 ==> catch 문으로 이동
                 */

                while (true) {
                    const i = await interaction.channel.awaitMessageComponent({
                        componentType: 'BUTTON',
                        filter: (i) =>
                            i.customId === 'retry_ping_' + interaction.id, // 전에 만들었던 버튼인지 확인
                        time: 10 * 1000 // (단위: ms) == 10초
                    })

                    if (i.user.id === interaction.user.id) { // 전에 만들었던 버튼의 사용자인지 확인
                        i.reply('다시 측정했어요!')
                        break
                    }
                    i.reply('잘못된 사용자입니다.')
                }
            } catch (_) {
                /**
                 * 여기로 올 수 있는 경우
                 * 1. 타임아웃 -> 에러
                 * 2. 10초 뒤 사용자가 버튼을 눌렀을 때
                 * ==> catch()로 잡음
                 */

                interaction.editReply({
                    components: [] // 컴포넌트 삭제
                })
                break
            }
        }
    }
})

client.login(process.env.TOKEN)