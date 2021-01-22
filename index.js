
const
{
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   GroupSettingChange,
   waChatKey,
   mentionedJid,
   processTime,
} = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal")
const moment = require("moment-timezone") 
const fs = require("fs")
const { color, bgcolor } = require('./lib/color')
const { help } = require('./lib/help')
const { donasi } = require('./lib/donasi')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
			// API KEY
			const apiKey = 'APIKEY' // get in https://mhankbarbar.tech/api
			const tobzkey = 'APIKEY'// GET IN https://tobz-api.herokuapp.com/api
			const vhtearkey = 'APIKEY'// GET IN https://api.vhtear.com/
			const zekskey = 'APIKEY' //GET IN https://api.zeks.xyz
			const techkey = 'APIKEY' //GET IN https://api.i-tech.id
			
const vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n'
            + 'FN:Ownerbot\n'
            + 'ORG:Creator SELF BOT;\n'
            + 'TEL;type=CELL;type=VOICE;waid=6285959375675:+62 877-7545-2636\n'
            + 'END:VCARD'
prefix = '!'
blocked = []            
const time = moment().tz('Asia/Jakarta').format("HH:mm:ss")
const arrayBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const bulan = arrayBulan[moment().format('MM') - 1]


function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)}H, ${pad(minutes)}Min, ${pad(seconds)}Sec `
}
        function monospace(string) {
            return '```' + string + '```'
        }




const { exec } = require("child_process")

const hafizh = new WAConnection()

hafizh.on('qr', qr => {
   qrcode.generate(qr, { small: true })
   console.log(`[ ${time} ] QR code is ready`)
})

hafizh.on('credentials-updated', () => {
   const authInfo = hafizh.base64EncodedAuthInfo()
   console.log(`credentials updated!`)

   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'))
})

fs.existsSync('./session.json') && hafizh.loadAuthInfo('./session.json')

hafizh.connect();

// hafizh.on('user-presence-update', json => console.log(json.id + ' presence is => ' + json.type)) || console.log(`${time}: Bot by ig:@kingg_squard028`)

hafizh.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await hafizh.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await hafizh.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `@${num.split('@')[0]}\nwelcome to group *${mdata.subject}* semoga betah`
				let buff = await getBuffer(ppimg)
				hafizh.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await hafizh.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `alhamdulillah, beban hilang 1 @${num.split('@')[0]} `
				let buff = await getBuffer(ppimg)
				hafizh.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	hafizh.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	hafizh.on('message-new', async (tod) => {
		try {
			if (!tod.message) return
			if (tod.key && tod.key.remoteJid == 'status@broadcast') return
			if (!tod.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(tod.message)
			const from = tod.key.remoteJid
			const type = Object.keys(tod.message)[0]
			
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && tod.message.conversation.startsWith(prefix)) ? tod.message.conversation : (type == 'imageMessage') && tod.message.imageMessage.caption.startsWith(prefix) ? tod.message.imageMessage.caption : (type == 'videoMessage') && tod.message.videoMessage.caption.startsWith(prefix) ? tod.message.videoMessage.caption : (type == 'extendedTextMessage') && tod.message.extendedTextMessage.text.startsWith(prefix) ? tod.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? tod.message.conversation : (type === 'extendedTextMessage') ? tod.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			mess = {
				wait: 'Loading...',
				success: '️success ✔ ',
				error: {
					stick: 'error gan',
					Iv: 'Link ga valid gan'
				},
				only: {
					group: 'only gc',
					ownerG: 'only owner gc',
					ownerB: 'only owner bot',
					admin: 'only admin gc',
					Badmin: 'jadikan ot admin udin'
				}
			}
			const botNumber = hafizh.user.jid
			const ownerNumber = ["6285959375675@s.whatsapp.net"] // ganti nomer lu
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? tod.participant : tod.key.remoteJid
			const groupMetadata = isGroup ? await hafizh.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				hafizh.sendMessage(from, teks, text, {quoted:tod})
			}
			const sendMess = (hehe, teks) => {
				hafizh.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? hafizh.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : hafizh.sendMessage(from, teks.trim(), extendedText, {quoted: tod, contextInfo: {"mentionedJid": memberr}})
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			switch(command) {
				case 'help': 
				case 'menu':
					hafizh.sendMessage(from, `${monospace(help(prefix))}`, text)
					break
				case 'donasi':
				case 'donate':
					hafizh.sendMessage(from, donasi(), text)
					break
				case 'info':
					me = hafizh.user
					uptime = process.uptime()
					teks = `𝗡𝗮𝗺𝗮 𝗯𝗼𝘁 : ${me.name}\n*𝗡𝗼𝗺𝗲𝗿 𝗯𝗼𝘁* : @${me.jid.split('@')[0]}\n*𝗣𝗿𝗲𝗳𝗶𝘅* : ${prefix}\n𝗧𝗼𝘁𝗮𝗹 𝗕𝗹𝗼𝗰𝗸 𝗖𝗼𝗻𝘁𝗮𝗰𝘁 : ${blocked.length}\n𝗧𝗵𝗲 𝗯𝗼𝘁 𝗶𝘀 𝗮𝗰𝘁𝗶𝘃𝗲 𝗼𝗻 : ${kyun(uptime)}`
					buffer = await getBuffer(me.imgUrl)
					hafizh.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
					break
					case 'runtime':
    						runtime = process.uptime()
						teks = `${monospace(`Runtime:\n◪ ${kyun(runtime)}`)}`
						hafizh.sendMessage(from, `${teks}`, MessageType.text, {quoted: tod})
    						break
			case 'xl':
				data = await fetchJson(`https://api.i-tech.id/tagihan/xl?key=${techkey}&no=${body.slice(4)}`)
				teks = `Nomor: ${data.nomor}\nNama: ${data.nama}\nTotal: ${data.total}\nStatus: ${data.status}\ntagihan: ${data.lembar_tagihan}`
				hafizh.sendMessage(from, `${teks}`, MessageType.text, {quoted: tod})
				break
			case 'halo':
				data = await fetchJson(`https://api.i-tech.id/tagihan/halo?key=${techkey}&no=${body.slice(6)}`)
				teks = `Nomor: ${data.nomor}\nNama: ${data.nama}\nTotal: ${data.total}\nStatus: ${data.status}\ntagihan: ${data.lembar_tagihan}`
				client.sendMessage(from, `${teks}`, MessageType.text, {quoted: tod})
				break
			case 'gas':
				data = await fetchJson(`https://api.i-tech.id/tagihan/gas?key=${techkey}&no=${body.slice(5)}`)
				teks = `Nomor: ${data.nomor}\nNama: ${data.nama}\nTotal: ${data.total}\nStatus: ${data.status}\ntagihan: ${data.lembar_tagihan}`
				hafizh.sendMessage(from, `${teks}`, MessageType.text, {quoted: tod})
				break
			case 'readall':
					if (!isOwner)return reply(mess.only.ownerB)
					var chats = await hafizh.chats.all()
                    chats.map( async ({ jid }) => {
                          await hafizh.chatRead(jid)
                    })
					teks = `\`\`\`Berhasil membaca ${chats.length} Chat !\`\`\``
					await hafizh.sendMessage(from, teks, MessageType.text, {quoted: tod})
					console.log(chats.length)
					break
			case 'setstatus':
				hafizh.setStatus(`${body.slice(11)}`)
   				.then(data => {
        			reply(JSON.stringify(data))
    				}).catch(err => console.log(err))
    				break
				case 'blocklist': 
					teks = 'BLOCK LIST  :\n'
					for (let block of blocked) {
						teks += `┣➢ @${block.split('@')[0]}\n`
					}
					teks += `𝗧𝗼𝘁𝗮𝗹 : ${blocked.length}`
					hafizh.sendMessage(from, teks.trim(), extendedText, {quoted: tod, contextInfo: {"mentionedJid": blocked}})
					break
           case 'fordward':
	   hafizh.sendMessage(from, `${body.slice(10)}`, MessageType.text, {contextInfo: { forwardingScore: 508, isForwarded: true }})
           break
            case 'fordward1':
           hafizh.sendMessage(from, `${body.slice(11)}`, MessageType.text, {contextInfo: { forwardingScore: 2, isForwarded: true }})
           break
		case 'moddroid':
			data = await fetchJson(`https://tobz-api.herokuapp.com/api/moddroid?q=${body.slice(10)}&apikey=${tobzkey}`)
			hepi = data.result[0] 
			teks = `*Nama*: ${data.result[0].title}\n*publisher*: ${hepi.publisher}\n*mod info:* ${hepi.mod_info}\n*size*: ${hepi.size}\n*latest version*: ${hepi.latest_version}\n*genre*: ${hepi.genre}\n*link:* ${hepi.link}\n*download*: ${hepi.download}`
			buff = await getBuffer(hepi.image)
			hafizh.sendMessage(from, buff, image, {quoted: tod, caption: `${teks}`})
			break
	    case 'film':
		data = await fetchJson(`https://api.zeks.xyz/api/film?q=${body.slice(6)}&apikey=${zekskey}`)
		teks = '\n'
		for (let i of data.result) {
		teks += `Judul: ${i.tile}\nLink: ${i.url}`
		buffs = await getBufer(data.result[0].thumb)
		hafizh.sendMessage(from, buffs, image, {quoted: tod, caption: teks}) 
		}
		break
	case 'toptt':
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(tod).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp3')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal mengkonversi audio ke ptt')
						topt = fs.readFileSync(ran)
						hafizh.sendMessage(from, topt, audio, {mimetype: 'audio/mp4', quoted: tod, ptt:true})
						})
						break
	case 'randomquran':
			data = await fetchJson(`https://api.zeks.xyz/api/randomquran`)
			teks = `Nama: ${data.result.nama}\nArti: ${data.result.arti}\nayat: ${data.result.ayat}\nAsma: ${data.result.asma}\nRukuk: ${data.result.rukuk}\nNomor: ${data.result.nomor}\nType: ${data.result.type}\nKeterangan: ${data.result.keterangan}`
			buffs = await getBuffer(data.result.audio)
			hafizh.sendMessage(from, `${teks}`, MessageType.text, {quoted: tod})
			hafizh.sendMessage(from, buffs, audio, {mimetype: 'audio/mp4', filename: `quran.mp3`, quoted: tod})
			break
		case 'speed':
					const timestamp = speed();
					const latensi = speed() - timestamp
					const pingnya = `${teks}\nSpeed: ${latensi.toFixed(4)} Second`
					hafizh.sendMessage(from, `Speed: ${latensi.toFixed(4)} Second\n\n`, MessageType.text, {quoted: tod})
					break
				case 'ocr': 
					if ((isMedia && !tod.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(tod).replace('quotedM','m')).message.extendedTextMessage.contextInfo : tod
						const media = await hafizh.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply(`𝗸𝗶𝗿𝗶𝗺 𝗳𝗼𝘁𝗼 𝗱𝗲𝗻𝗴𝗮𝗻 𝗰𝗮𝗽𝘁𝗶𝗼𝗻 ${prefix}𝗼𝗰𝗿`)
					}
					break
				case 'fml':
					data = await fetchJson(`https://api.zeks.xyz/api/fml`)
					teks  = `Fml: ${data.result}`
					hafizh.sendMessage(from, `${teks}`, MessageType.text, {quoted: tod})
					break
				case 'stiker': 
				case 'sticker':
				case 's':
					if ((isMedia && !tod.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(tod).replace('quotedM','m')).message.extendedTextMessage.contextInfo : tod
						const media = await hafizh.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								hafizh.sendMessage(from, buff, sticker, {quoted: tod})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && tod.message.videoMessage.seconds < 11 || isQuotedVideo && tod.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(tod).replace('quotedM','m')).message.extendedTextMessage.contextInfo : tod
						const media = await hafizh.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`𝗬𝗮𝗵 𝗴𝗮𝗴𝗮𝗹, 𝘂𝗹𝗮𝗻𝗴𝗶 𝗹𝗮𝗴𝗶 𝘆𝗮 𝘀𝗮𝘆𝗮𝗻𝗴`)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								hafizh.sendMessage(from, buff, sticker, {quoted: tod})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(tod).replace('quotedM','m')).message.extendedTextMessage.contextInfo : tod
						const media = await hafizh.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('𝗬𝗮𝗵 𝗴𝗮𝗴𝗮𝗹, 𝘂𝗹𝗮𝗻𝗴𝗶 𝗹𝗮𝗴𝗶 𝘆𝗮 𝘀𝗮𝘆𝗮𝗻𝗴')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.error.stick)
								buff = fs.readFileSync(ranw)
								hafizh.sendMessage(from, buff, sticker, {quoted: tod})
							})
						})					
					} else {
						reply(`𝗸𝗶𝗿𝗶𝗺 𝗴𝗮𝗺𝗯𝗮𝗿 𝗱𝗲𝗻𝗴𝗮𝗻 𝗰𝗮𝗽𝘁𝗶𝗼𝗻 ${prefix}𝘀𝘁𝗶𝗰𝗸𝗲𝗿 𝗮𝘁𝗮𝘂 𝗿𝗲𝗽𝗹𝘆/𝘁𝗮𝗴 𝗴𝗮𝗺𝗯𝗮𝗿`)
					}
					break
				case 'gtts':	
				case 'tts':
					if (args.length < 1) return hafizh.sendMessage(from, '𝗱𝗶𝗽𝗲𝗿𝗹𝘂𝗸𝗮𝗻 𝗸𝗼𝗱𝗲 𝗯𝗮𝗵𝗮𝘀𝗮!', text, {quoted: tod})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return hafizh.sendMessage(from, '𝗧𝗲𝗸𝘀 𝗺𝗮𝗻𝗮 𝘁𝗲𝗸𝘀?', text, {quoted: tod})
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 300
					? reply('𝘁𝗲𝗸𝘀𝗻𝘆𝗮 𝗷𝗮𝗻𝗴𝗮𝗻 𝗸𝗲𝗽𝗮𝗻𝗷𝗮𝗻𝗴𝗮𝗻')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							buff = fs.readFileSync(rano)
							if (err) return reply('𝗬𝗮𝗵 𝗴𝗮𝗴𝗮𝗹, 𝘂𝗹𝗮𝗻𝗴𝗶 𝗹𝗮𝗴𝗶 𝘆𝗮 𝘀𝗮𝘆𝗮𝗻𝗴')
							hafizh.sendMessage(from, buff, audio, {quoted: tod, ptt:true})
							fs.unlinkSync(rano)
						})
					})
					break
				case 'setprefix':
					if (args.length < 1) return
					prefix = args[0]
					reply(`𝗣𝗿𝗲𝗳𝗶𝘅 𝗯𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗱𝗶 𝘂𝗯𝗮𝗵 𝗺𝗲𝗻𝗷𝗮𝗱𝗶 : ${prefix}`)
					break 	
			       case 'pussy':
					ranp = getRandom('.gif')
					rano = getRandom('.webp')
					anu = await fetchJson('https://nekos.life/api/v2/img/pussy', {method: 'get'})
					if (anu.error) return reply(anu.error)

					exec(`wget ${anu.url} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						buffer = fs.readFileSync(rano)
						hafizh.sendMessage(from, buffer, sticker, {quoted: tod})
						fs.unlinkSync(rano)
					})
					break
            case 'nsfwgif':
					ranp = getRandom('.gif')
					rano = getRandom('.webp')
					anu = await fetchJson('https://nekos.life/api/v2/img/nsfw_neko_gif', {method: 'get'})
					if (anu.error) return reply(anu.error)

					exec(`wget ${anu.url} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						buffer = fs.readFileSync(rano)
						hafizh.sendMessage(from, buffer, sticker, {quoted: tod})
						fs.unlinkSync(rano)
					})
					break
            case 'tabok':
					ranp = getRandom('.gif')
					rano = getRandom('.webp')
					anu = await fetchJson('https://nekos.life/api/v2/img/spank', {method: 'get'})
					if (anu.error) return reply(anu.error)

					exec(`wget ${anu.url} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						buffer = fs.readFileSync(rano)
						hafizh.sendMessage(from, buffer, sticker, {quoted: tod})
						fs.unlinkSync(rano)
					})
					break
            case 'kiss':
					ranp = getRandom('.gif')
					rano = getRandom('.webp')
					anu = await fetchJson('https://nekos.life/api/v2/img/kiss', {method: 'get'})
					if (anu.error) return reply(anu.error)

					exec(`wget ${anu.url} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						buffer = fs.readFileSync(rano)
						hafizh.sendMessage(from, buffer, sticker, {quoted: tod})
						fs.unlinkSync(rano)
					})
					break	
				case 'meme': 
					meme = await kagApi.memes()
					buffer = await getBuffer(`https://imgur.com/${meme.hash}.jpg`)
					hafizh.sendMessage(from, buffer, image, {quoted: tod, caption: '.......'})
					break
				case 'memeindo': 
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://imgur.com/${memein.hash}.jpg`)
					hafizh.sendMessage(from, buffer, image, {quoted: tod, caption: '.......'})
					break
								                case 'ssphone':
                buff = await getBuffer(`https://api.vhtear.com/ssweb?link=${body.slice(9)}&type=phone&apikey=${vhtearkey}`)
                
				hafizh.sendMessage(from, buff, image, {quoted: tod})
				break   
				                case 'sspc':
                buff = await getBuffer(`https://api.vhtear.com/ssweb?link=${body.slice(6)}&type=pc&apikey=${vhtearkey}`)
                
				hafizh.sendMessage(from, buff, image, {quoted: tod})
				break     
			         case 'puisi':
                buff = await getBuffer(`https://api.vhtear.com/puisi_image&apikey=${vhtearkey}`)
				hafizh.sendMessage(from, buff, image, {quoted: tod})
				break
		case 'kapankah':
					const kapan1 = body.slice(1)
					const kapan2 = [
					'Hari ini',

					'Mungkin besok',

					'1 Minggu lagi',

					'Masih lama',

					'3 Bulan lagi',

					'7 Bulan lagi',

					'3 Tahun lagi',

					'4 Bulan lagi',

					'2 Bulan lagi',

					'1 Tahun lagi',

					'1 Bulan lagi',

					'Coba ulangi',

					]

					const kpnkh = kapan2[Math.floor(Math.random() * (kapan2.length))]

					const jawab1 = `Pertanyaan : *${kapan1}*\n\nJawaban: ${kpnkh}`

					hafizh.sendMessage(from, jawab1, text, {quoted: tod})

					break
			case 'apakah':
					const tanya = body.slice(1)
					const apa = [
					'Ya',

					'Mungkin',

					'Tidak',

					'Coba Ulangi',

					]

					const apkh = apa[Math.floor(Math.random() * (apa.length))]

					const jawab = `Pertanyaan : *${tanya}*\n\nJawaban: ${apkh}`

					hafizh.sendMessage(from, jawab, text, {quoted: tod})

					break
			    case 'darkjoke':
                                data = await fetchJson(`https://api.zeks.xyz/api/darkjokes?apikey=${zekskey}`)
                                dark = data.result
                                thumb = await getBuffer(dark)
                                hafizh.sendMessage(from, thumb, image, {quoted: tod})
                                break
                case 'harta':
                buff = await getBuffer(`https://api.vhtear.com/hartatahta?text=${body.slice(7)}&apikey=${vhtearkey}`)
				hafizh.sendMessage(from, buff, image, {quoted: tod})
				break
                case 'lovetext':
                buff = await getBuffer(`https://api.vhtear.com/lovemessagetext?text=${body.slice(10)}&apikey=${vhtearkey}`)
				hafizh.sendMessage(from, buff, image, {quoted: tod})
				break
				
			case 'loli': 
				    try {
						res = await fetchJson(`https://api.lolis.life/random`, {method: 'get'})
						buffer = await getBuffer(res.url)
						hafizh.sendMessage(from, buffer, image, {quoted: tod, caption: 'ingat! Cintai lolimu'})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('𝗘𝗥𝗥𝗢𝗥')
					}
					break
				case 'nsfwloli': 
				    try {
						if (!isNsfw) return reply('𝗠𝗮𝗮𝗳 𝗳𝗶𝘁𝘂𝗿 𝗶𝗻𝗶 𝗯𝗲𝗹𝘂𝗺 𝗱𝗶 𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻/𝗸𝗲𝘀𝗮𝗹𝗮𝗵𝗮𝗻 𝘀𝗲𝗿𝘃𝗲𝗿𝗻𝘆𝗮')
						res = await fetchJson(`https://api.lolis.life/random?nsfw=true`, {method: 'get'})
						buffer = await getBuffer(res.url)
						hafizh.sendMessage(from, buffer, image, {quoted: tod, caption: 'Jangan jadiin bahan buat comli'})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('𝗘𝗥𝗥𝗢𝗥')
					}
					break
				
				case 'holoh': 
					if (args.length < 1) return reply('𝗸𝗮𝘀𝗶𝗵 𝘁𝗲𝗸𝘀 𝗹𝗮𝗵!!!')
					anu = await fetchJson(`https://shirayuki-api.herokuapp.com/api/v1/holoh?kata=${body.slice(7)}`, {method: 'get'})
					reply(anu.result)
					break
				case 'hilih': 
					if (args.length < 1) return reply('𝗸𝗮𝘀𝗶𝗵 𝘁𝗲𝗸𝘀 𝗹𝗮𝗵!!!')
					anu = await fetchJson(`https://mhankbarbar.tech/api/hilih?teks=${body.slice(7)}`, {method: 'get'})
					reply(anu.result)
					break
				case 'yt': 
					if (args.length < 1) return reply('𝘂𝗿𝗹𝗻𝘆𝗮 𝗺𝗮𝗻𝗮?')
					if(!isUrl(args[0]) && !args[0].includes('youtube.com')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://mhankbarbar.tech/api/yta?url=${args[0]}&apiKey=${apikey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}\n*Filesize* : ${anu.filesize}`
					thumb = await getBuffer(anu.thumb)
					hafizh.sendMessage(from, thumb, image, {quoted: tod, caption: teks})
					buffer = await getBuffer(anu.result)
					hafizh.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: tod})
					break
				case 'ytsearch': 
					if (args.length < 1) return reply('𝗧𝗲𝗸𝘀𝗻𝘆𝗮 𝗺𝗮𝗻𝗮 𝘁𝗲𝗸𝘀?')
					anu = await fetchJson(`https://mhankbarbar.tech/api/ytsearch?q=${body.slice(10)}&apiKey=${apikey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = '=================\n'
					for (let i of anu.result) {
						teks += `*Title* : ${i.title}\n*Id* : ${i.id}\n*Published* : ${i.publishTime}\n*Duration* : ${i.duration}\n*Views* : ${h2k(i.views)}\n=================\n`
					}
					reply(teks.trim())
					break
				case 'yt2mp3':
					if (args.length < 1) return reply('Urlnya mana um?')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://mhankbarbar.tech/api/yta?url=${args[0]}&apiKey=${apikey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}\n*Filesize* : ${anu.filesize}`
					thumb = await getBuffer(anu.thumb)
					hafizh.sendMessage(from, thumb, image, {quoted: tod, caption: teks})
					buffer = await getBuffer(anu.result)
					hafizh.sendMessage(from, buffer, audio, ytmp3, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: tod})
					break
			case 'joox':
					data = await fetchJson(`https://tobz-api.herokuapp.com/api/joox?q=${body.slice(6)}&apikey=${tobzkey}`, {method: 'get'})
					teks = '=================\n'
					const joox = data.result
						teks += `*Judul:* ${joox.title}\n*Album:* ${joox.album}\n*dipublikasian pada*: ${joox.dipublikasi}\n*Download sendiri:* ${joox.mp3}\n=================\n`
					thumb = await getBuffer(joox.thumb)
					hafizh.sendMessage(from, thumb, image, {quoted: tod, caption: teks})
					buffer = await getBuffer(joox.mp3)
					hafizh.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${joox.title}.mp3`, quoted: tod})
					break
			case 'play':
					data = await fetchJson(`https://api.vhtear.com/ytmp3?query=${body.slice(6)}&apikey=${vhtearkey}`, {method: 'get'})
					teks = '=================\n'
					const play = data.result
						teks += `*Judul:* ${play.title}\n*Durasi:* ${play.duration}\n*size*: ${play.size}\n*Download sendiri:* ${play.mp3}\n=================\n`
					thumb = await getBuffer(play.image)
					hafizh.sendMessage(from, thumb, image, {quoted: tod, caption: teks})
					buffer = await getBuffer(play.mp3)
					hafizh.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${play.title}.mp3`, quoted: tod})
					break
				case 'tiktok': 
					if (args.length < 1) return reply('𝘂𝗿𝗹𝗻𝘆𝗮 𝗺𝗮𝗻𝗮?')
					if (!isUrl(args[0]) && !args[0].includes('tiktok.com')) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbar.tech/api/tiktok?url=${args[0]}&apiKey=${apikey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buffer = await getBuffer(anu.result)
					hafizh.sendMessage(from, buffer, video, {quoted: tod})
					break
				case 'nulis': 
				case 'tulis':
					if (args.length < 1) return reply('𝗧𝗲𝗸𝘀𝗻𝘆𝗮 𝗺𝗮𝗻𝗮 𝘁𝗲𝗸𝘀?')
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbar.tech/nulis?text=${teks}&apiKey=${apikey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					hafizh.sendMessage(from, buff, image, {quoted: tod, caption: mess.success})
					break
				case 'url2img': 
					tipelist = ['desktop','tablet','mobile']
					if (args.length < 1) return reply('𝗧𝗶𝗽𝗲𝗻𝘆𝗮 𝗮𝗽𝗮??')
					if (!tipelist.includes(args[0])) return reply('𝗧𝗶𝗽𝗲 𝗱𝗲𝘀𝗸𝘁𝗼𝗽|𝘁𝗮𝗯𝗹𝗲𝘁|𝗺𝗼𝗯𝗶𝗹𝗲')
					if (args.length < 2) return reply('𝘂𝗿𝗹𝗻𝘆𝗮 𝗺𝗮𝗻𝗮?')
					if (!isUrl(args[1])) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbar.tech/api/url2image?tipe=${args[0]}&url=${args[1]}&apiKey=${apikey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					hafizh.sendMessage(from, buff, image, {quoted: tod})
					break
				case 'carbon':
					if (args.length < 1)return reply('Sertakan teks nya')
					targed = mek.participant
					teks = body.slice(8)
					drc = await getBuffer(`https://carbonnowsh.herokuapp.com/?code=${teks}`)
					hafizh.sendMessage(from, drc, image, {quoted: tod})
					break
				case 'tstiker':
				case 'tsticker': 
					if (args.length < 1) return reply('𝗸𝗮𝘀𝗶𝗵 𝘁𝗲𝗸𝘀 𝗹𝗮𝗵!!!')
					ranp = getRandom('.png')
					rano = getRandom('.webp')
					teks = body.slice(9).trim()
					anu = await fetchJson(`https://mhankbarbar.tech/api/text2image?text=${teks}&apiKey=${apikey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						buffer = fs.readFileSync(rano)
						hafizh.sendMessage(from, buffer, sticker, {quoted: tod})
						fs.unlinkSync(rano)
					})
					break
				case 'fitnah':	
				case 'fake': // tuh costum reply
              costum('Ini', '6287775452636@s.whatsapp.com')
                  break	
				case 'tagall':
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						rchoice = Math.floor(Math.random() * list_emoji.length)
						teks += `┣➥ @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break
				case 'clearall':
					if (!isOwner) return reply('𝙡𝙪 𝙨𝙞𝙖𝙥𝙖?')
					anu = await hafizh.chats.all()
					hafizh.setMaxListeners(25)
					for (let _ of anu) {
						hafizh.deleteChat(_.jid)
					}
					reply('𝗰𝗹𝗲𝗮𝗿 𝗮𝗹𝗹 𝘀𝘂𝗸𝘀𝗲𝘀 𝘆𝗮𝗵 :)')
					break
			       case 'block':
					hafizh.blockUser (`${body.slice(7)}@c.us`, "add")
					hafizh.sendMessage(from, `𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵 𝗗𝗶𝘁𝗲𝗿𝗶𝗺𝗮, 𝗺𝗲𝗺𝗯𝗹𝗼𝗸𝗶𝗿 ${body.slice(7)}@c.us`, text)
					break
                    case 'unblock':
				    hafizh.blockUser (`${body.slice(9)}@c.us`, "remove")
					hafizh.sendMessage(from, `𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵 𝗗𝗶𝘁𝗲𝗿𝗶𝗺𝗮, 𝗺𝗲𝗺𝗯𝘂𝗸𝗮 ${body.slice(9)}@c.us`, text)
				break
				case 'leave': 
				if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
				await hafizh.hafizh.leaveGroup(from, '𝗕𝘆𝗲𝗲', groupId)
	
                    break
				case 'bc': 
					if (args.length < 1) return reply('.......')
					anu = await hafizh.chats.all()
					if (isMedia && !tod.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(tod).replace('quotedM','m')).message.extendedTextMessage.contextInfo : tod
						buff = await hafizh.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							hafizh.sendMessage(_.jid, buff, image, {caption: `❮ 𝘽𝙊𝙏 𝘽𝙍𝙊𝘼𝘿𝘾𝘼𝙎𝙏 ❯\n\n${body.slice(4)}`})
						}
						reply('𝙨𝙪𝙘𝙘𝙚𝙨𝙨 𝙗𝙧𝙤𝙖𝙙𝙘𝙖𝙨𝙩 ')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `❮ 𝘽𝙊𝙏 𝘽𝙍𝙊𝘼𝘿𝘾𝘼𝙎𝙏 ❯\n\n${body.slice(4)}`)
						}
						reply('𝙨𝙪𝙘𝙘𝙚𝙨𝙨 𝙗𝙧𝙤𝙖𝙙𝙘𝙖𝙨𝙩 ')
					}
					break
			       	case 'setpp': 
                       media = await hafizh.downloadAndSaveMediaMessage(tod)
                         await hafizh.updateProfilePicture (from, media)
                        reply('𝗦𝘂𝗸𝘀𝗲𝘀 𝗺𝗲𝗻𝗴𝗴𝗮𝗻𝘁𝗶 𝗶𝗰𝗼𝗻 𝗚𝗿𝘂𝗽')
                                        break						
				case 'add':
					if (args.length < 1) return reply('𝗽𝗮𝘀𝘁𝗶 𝘆𝗮𝗻𝗴 𝗺𝗮𝘂 𝗱𝗶 𝗮𝗱𝗱 𝗮𝗻𝗮𝗸 𝗽𝘂𝗻𝗴𝘂𝘁?')
					if (args[0].startsWith('08')) return reply('𝗚𝘂𝗻𝗮𝗸𝗮𝗻 𝗸𝗼𝗱𝗲 𝗻𝗲𝗴𝗮𝗿𝗮')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						hafizh.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('𝗴𝗮𝗴𝗮𝗹 𝗺𝗲𝗻𝗮𝗺𝗯𝗮𝗵𝗸𝗮𝗻, 𝗺𝘂𝗻𝗴𝗸𝗶𝗻 𝗸𝗮𝗿𝗲𝗻𝗮 𝗱𝗶 𝗽𝗿𝗶𝘃𝗮𝘁𝗲')
					}
					break
					case 'grup':
					case 'group':
					if (args[0] === 'buka') {
					    reply(`𝗕𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗠𝗲𝗺𝗯𝘂𝗸𝗮 𝗚𝗿𝗼𝘂𝗽`)
						hafizh.groupSettingChange(from, GroupSettingChange.messageSend, false)
					} else if (args[0] === 'tutup') {
						reply(`𝗕𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗠𝗲𝗻𝘂𝘁𝘂𝗽 𝗚𝗿𝗼𝘂𝗽`)
						hafizh.groupSettingChange(from, GroupSettingChange.messageSend, true)
					}
					break
                    
            case 'admin':
            case 'owner':
            case 'creator':
                  hafizh.sendMessage(from, {displayname: "Jeff", vcard: vcard}, MessageType.contact, { quoted: tod})
       hafizh.sendMessage(from, 'wa.me/+6287775452636',MessageType.text, { quoted: tod} )
           break    
           case 'demote':
					if (tod.message.extendedTextMessage === undefined || tod.message.extendedTextMessage === null) return reply('𝗧𝗮𝗴 𝘁𝗮𝗿𝗴𝗲𝘁 𝘆𝗮𝗻𝗴 𝗶𝗻𝗴𝗶𝗻 𝗱𝗶 𝘁𝗲𝗻𝗱𝗮𝗻𝗴!')
					mentioned = tod.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `𝘆𝗮𝗵𝗵 𝗷𝗮𝗯𝗮𝘁𝗮𝗻 𝗮𝗱𝗺𝗶𝗻 𝗸𝗮𝗺𝘂 𝘀𝘂𝗱𝗮𝗵 𝗱𝗶 𝗰𝗼𝗽𝗼𝘁 :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						hafizh.groupDemoteAdmin(from, mentioned)
					} else {
						mentions(`𝘆𝗮𝗵𝗵 @${mentioned[0].split('@')[0]} 𝗷𝗮𝗯𝗮𝘁𝗮𝗻 𝗮𝗱𝗺𝗶𝗻 𝗸𝗮𝗺𝘂 𝘀𝘂𝗱𝗮𝗵 𝗱𝗶 𝗰𝗼𝗽𝗼𝘁`, mentioned, true)
						hafizh.groupDemoteAdmin(from, mentioned)
					}
					break
				case 'promote':
					if (tod.message.extendedTextMessage === undefined || tod.message.extendedTextMessage === null) return reply('𝗧𝗮𝗴 𝘁𝗮𝗿𝗴𝗲𝘁 𝘆𝗮𝗻𝗴 𝗶𝗻𝗴𝗶𝗻 𝗱𝗶 𝘁𝗲𝗻𝗱𝗮𝗻𝗴!')
					mentioned = tod.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `DONE :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						hafizh.groupMakeAdmin(from, mentioned)
					} else {
						mentions(`DONE @${mentioned[0].split('@')[0]}`, mentioned, true)
						hafizh.groupMakeAdmin(from, mentioned)
					}
					break	
			     	case 'kick':
					if (tod.message.extendedTextMessage === undefined || tod.message.extendedTextMessage === null) return reply('𝗧𝗮𝗴 𝘁𝗮𝗿𝗴𝗲𝘁 𝘆𝗮𝗻𝗴 𝗶𝗻𝗴𝗶𝗻 𝗱𝗶 𝘁𝗲𝗻𝗱𝗮𝗻𝗴!')
					mentioned = tod.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `Otw.... :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						hafizh.groupRemove(from, mentioned)
					} else {
						mentions(`Otw... @${mentioned[0].split('@')[0]} 𝘀𝗮𝘆𝗮𝗻𝗴`, mentioned, true)
						hafizh.groupRemove(from, mentioned)
					}
					break
				case 'listadmin':
					teks = `𝗟𝗶𝘀𝘁 𝗮𝗱𝗺𝗶𝗻 𝗼𝗳 𝗴𝗿𝗼𝘂𝗽 *${groupMetadata.subject}*\n𝗧𝗼𝘁𝗮𝗹 : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
				case 'toimg':
					if (!isQuotedSticker) return reply('𝗥𝗲𝗽𝗹𝘆/𝘁𝗮𝗴 𝘀𝘁𝗶𝗰𝗸𝗲𝗿!')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(tod).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await hafizh.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('𝗬𝗮𝗵 𝗴𝗮𝗴𝗮𝗹, 𝘂𝗹𝗮𝗻𝗴𝗶 𝗹𝗮𝗴𝗶 𝘀𝗮𝘆𝗮𝗻𝗴')
						buffer = fs.readFileSync(ran)
						hafizh.sendMessage(from, buffer, image, {quoted: tod, caption: '𝗡𝗶𝗵 𝗦𝗮𝘆𝗮𝗻𝗴'})
						fs.unlinkSync(ran)
					})
					break
					
				case 'simi':
					if (args.length < 1) return reply('𝗸𝗮𝘀𝗶𝗵 𝘁𝗲𝗸𝘀 𝗹𝗮𝗵!!!')
					teks = body.slice(5)
					anu = await simih(teks) //fetchJson(`https://mhankbarbar.tech/api/samisami?text=${teks}`, {method: 'get'})
					//if (anu.error) return reply('Simi ga tau kak')
					reply(anu)
					break
				case 'simih':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('𝗜𝘆𝗮 𝘀𝗮𝘆𝗮𝗻𝗴')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('𝘀𝘂𝗱𝗮𝗵 𝗮𝗸𝘁𝗶𝗳!!!')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('❬ 𝗦𝗨𝗞𝗦𝗘𝗦 ❭ 𝗠𝗲𝗻𝗴𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻 𝗳𝗶𝘁𝘂𝗿 𝘀𝗶𝗺𝗶 𝗱𝗶 𝗴𝗿𝗼𝘂𝗽 𝗶𝗻𝗶️')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('❬ 𝗦𝗨𝗞𝗦𝗘𝗦 ❭ 𝗠𝗲𝗻𝗼𝗻𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻 𝗳𝗶𝘁𝘂𝗿 𝘀𝗶𝗺𝗶 𝗱𝗶 𝗴𝗿𝗼𝘂𝗽 𝗶𝗻𝗶️️')
					} else {
						reply('𝗸𝗲𝘁𝗶𝗸 𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵 𝟭 𝘂𝗻𝘁𝘂𝗸 𝗺𝗲𝗻𝗴𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻, 𝟬 𝘂𝗻𝘁𝘂𝗸 𝗺𝗲𝗻𝗼𝗻𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻\n𝗰𝗼𝗻𝘁𝗼𝗵: 𝘀𝗶𝗺𝗶𝗵 𝟭')
					}
					break
				case 'nsfw':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('𝗜𝘆𝗮 𝘀𝗮𝘆𝗮𝗻𝗴')
					if (Number(args[0]) === 1) {
						if (isNsfw) return reply('𝘀𝘂𝗱𝗮𝗵 𝗮𝗸𝘁𝗶𝗳!!!')
						nsfw.push(from)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('❬ 𝗦𝗨𝗞𝗦𝗘𝗦 ❭ 𝗠𝗲𝗻𝗴𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻 𝗳𝗶𝘁𝘂𝗿 𝗻𝘀𝗳𝘄 𝗱𝗶 𝗴𝗿𝗼𝘂𝗽 𝗶𝗻𝗶')
					} else if (Number(args[0]) === 0) {
						nsfw.splice(from, 1)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('❬ 𝗦𝗨𝗞𝗦𝗘𝗦 ❭ 𝗠𝗲𝗻𝗼𝗻𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻 𝗳𝗶𝘁𝘂𝗿 𝗻𝘀𝗳𝘄 𝗱𝗶 𝗴𝗿𝗼𝘂𝗽 𝗶𝗻𝗶️')
					} else {
						reply('𝗸𝗲𝘁𝗶𝗸 𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵 𝟭 𝘂𝗻𝘁𝘂𝗸 𝗺𝗲𝗻𝗴𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻, 𝟬 𝘂𝗻𝘁𝘂𝗸 𝗺𝗲𝗻𝗼𝗻𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻\n𝗰𝗼𝗻𝘁𝗼𝗵: 𝗻𝘀𝗳𝘄 𝟭')
					}
					break
				case 'welcome':
					if (args.length < 1) return reply('𝗜𝘆𝗮 𝘀𝗮𝘆𝗮𝗻𝗴')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('𝘀𝘂𝗱𝗮𝗵 𝗮𝗸𝘁𝗶𝗳!!!')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('❬ 𝗦𝗨𝗞𝗦𝗘𝗦 ❭ 𝗠𝗲𝗻𝗴𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻 𝗳𝗶𝘁𝘂𝗿 𝘄𝗲𝗹𝗰𝗼𝗺𝗲/𝗹𝗲𝗳𝘁 𝗱𝗶 𝗴𝗿𝗼𝘂𝗽 𝗶𝗻𝗶️')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('❬ 𝗦𝗨𝗞𝗦𝗘𝗦 ❭ 𝗠𝗲𝗻𝗼𝗻𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻 𝗳𝗶𝘁𝘂𝗿 𝘄𝗲𝗹𝗰𝗼𝗺𝗲/𝗹𝗲𝗳𝘁 𝗱𝗶 𝗴𝗿𝗼𝘂𝗽 𝗶𝗻𝗶️')
					} else {
						reply('𝗸𝗲𝘁𝗶𝗸 𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵 𝟭 𝘂𝗻𝘁𝘂𝗸 𝗺𝗲𝗻𝗴𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻, 𝟬 𝘂𝗻𝘁𝘂𝗸 𝗺𝗲𝗻𝗼𝗻𝗮𝗸𝘁𝗶𝗳𝗸𝗮𝗻\n𝗰𝗼𝗻𝘁𝗼𝗵: ${prefix}𝘄𝗲𝗹𝗰𝗼𝗺𝗲 𝟭')
					}
					break
			case 'tagall2':
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `╠➥ @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					reply(teks)
					break
                 case 'tagall3':
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `╠➥ https://wa.me/${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					hafizh.sendMessage(from, teks, text, {detectLinks: false, quoted: tod})
					break
				case 'clone':
					if (args.length < 1) return reply('𝘁𝗮𝗴 𝘁𝗮𝗿𝗴𝗲𝘁 𝘆𝗮𝗻𝗴 𝗺𝗮𝘂 𝗱𝗶 𝗰𝗹𝗼𝗻𝗲!!!')
					if (tod.message.extendedTextMessage === undefined || tod.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = tod.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await hafizh.getProfilePicture(id)
						buffer = await getBuffer(pp)
						hafizh.updateProfilePicture(botNumber, buffer)
						mentions(`Foto profile Berhasil di perbarui menggunakan foto profile @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply('𝗬𝗮𝗵 𝗴𝗮𝗴𝗮𝗹, 𝘂𝗹𝗮𝗻𝗴𝗶 𝗹𝗮𝗴𝗶 𝘀𝗮𝘆𝗮𝗻𝗴')
					}
					break
				case 'wait':
					if ((isMedia && !tod.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(tod).replace('quotedM','m')).message.extendedTextMessage.contextInfo : tod
						media = await hafizh.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							hafizh.sendMessage(from, res.video, video, {quoted: tod, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply('𝗸𝗶𝗿𝗶𝗺 𝗳𝗼𝘁𝗼 𝗱𝗲𝗻𝗴𝗮𝗻 𝗰𝗮𝗽𝘁𝗶𝗼𝗻 𝗼𝗰𝗿')
					}
					break
				default:
			if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
					}
					}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})

                   

