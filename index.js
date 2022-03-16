// 필수 discord,js 클래스 가져오기
const { Client, Intents } = require('discord.js')
const dotenv = require('dotenv/config') // dotenv 설정 가져오기

// client 인스턴스 만들기
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
/**
 * Intents.FLAGS.______: 클라이언트가 올바르게 동작하기 위해 필요
 * https://discord.js.org/#/docs/discord.js/stable/class/Intents?scrollTo=s-FLAGS
 * ex1) 길드 정보: GUILDS
 * ex2) 멤버 정보: GUILD_MEMBERS
 * ex3) 채널 정보: GUILD_CHANNELS
 * 배열이니까 계속 쓸려면 콤마로!
 */

// client 준비 -> 실행 (한 번만)
client.once('ready', () => {
    console.log('Ready!')
})

client.login(process.env.TOKEN) // 봇 로그인