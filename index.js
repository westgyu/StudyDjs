// 봇 초대시 bot, application.commands 2개 체크!
require('dotenv/config') // 선언 X 불러오기만! O

const { Client, Intents } = require('discord.js')

const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
})

client.once('ready', async () => {
/**
 * async -> 비동기
 * 1. 모듈이 비동기로 만들어져 있음
 * 2. 동기로 처리하면 동시에 명령어가 하나만 처리 가능
 * 3. Node.js 구조가 io 관련(http, file...)등이 기본값으로 비동기로 처리하게 되어있음
 */
    console.log(await client.application.commands.fetch()) // await: 비동기 작업이 완료될때까지 기다리기 = 동기로 작업 -> 반환값(Promise)을 풀어주기 위해서 await 써야 됨
 
    // Discord.js 의 거의 모든 함수들은 전부 API 호출
    // client.application.commands.fetch() << 클라이언트가 사용하는 에플리케이션의 명령어들을 조회

    /**
     * 동기: 순서대로
     * 비동기: 동시에 처리
     * ex.) A(동기) -> B(비동기) -> C(동기): A -> B실행하면서 C
     * await: 비동기가 다 끝나야 다음으로 넘어감
     * 이때, 비동기의 반환값은 Promise<...> 타입
    */

    /**
     * overload: 같은 이름의 함수이지만, 받는 인수가 다름 (자바, 타입스크립트 ...)
     * ---
     * EX] set(commands, guildID) << 2번째로 실행
     * public set(commands): Promise<Collection<Snowflake, ApplicationCommandScope>>;  // 전역 명령어 만들기
     * public set(commands, guildId): Promise<Collection<Snowflake, ApplicationCommand>>; // 길드 명령어 만들기
     * ---
     * https://discord.com/developers/docs/interactions/application-commands#registering-a-command
     * Global commands are available on all your app's guilds. Global commands are cached for *1 hour*. // 모든 길드에서 가능하지만 적용까지 1시간 소요 << 실제로 배포할 때
     * Guild commands are available only within the guild specified on creation. Guild commands update *instantly* // 선택한 길드에서 가능하지만 바로 적용 << 개발할 때
     */
    
    /**
     * https://discord.js.org/#/docs/discord.js/stable/class/ApplicationCommandManager?scrollTo=set
     * 타입: Array <ApplicationCommandData> or Array <APIApplicationCommand> << 1번째: 빌더 X / 2번째: 빌더 O (보통 Data 붙어있는건 직접하겠다는 의미)
     * Array <ApplicationCommandData> 클릭 > 타입: 오브젝트 - {} > 
     */
    const commands = [
        { 
          name: "ping",
          /**
           * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-naming
           * command names must match the following regex ^[\w-]{1,32}$ with the unicode flag set. : 유니코드, 알파벳, 1-32자 
           */
          description: "테스트"
        }
    ]

    const h = client.application.commands.set(commands, process.env.GI)
    console.log('Ready!')

    await h
    console.log('Command Registed!')
})

/**
 * 문서 안보고 빠르게 쓰기: ctrl + 클릭
 * public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>): this;
 * public on<S extends string | symbol>(
 *   event: Exclude<S, keyof ClientEvents>,
 *   listener: (...args: any[]) => Awaitable<void>,
 * ): this;
 * --
 * 문자열로 했으니까 2번를 보면
 * event에 'keyof ClientEvents'가 적혀있으니까 ClientEvents를 알아야 됨 > ctrl + 클릭
 * 'keyof'라고 되어 있으니까 key를 봐야 됨 -> key: value 구조
 */

client.on('interactionCreate', (interaction) => {
  /**
   * interactionCreate: [interaction: Interaction];
   * 해석
   * key: interactionCreate
   * value: interaction (type: Interaction)
   * --
   * interaction의 종류: https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
   */

    if (!interaction.isCommand()) return

    if (interaction.commandName === "ping") {
        interaction.reply('pong!!')
        /**
         * reply에 ctrl + 클릭 > options: string | MessagePayload | InteractionReplyOptions
         * 해석: 문자열 또는 MessagePayload 또는 InteractionReplyOptions 를 쓸 수 있음
         */
    }
})

client.login(process.env.TOKEN)