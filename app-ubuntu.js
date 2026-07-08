require('dotenv').config();

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Groq } = require('groq-sdk');
const { GoogleGenAI } = require('@google/genai');

// Create a new client instance - Ubuntu VPS version
// Puppeteer akan otomatis download dan pakai Chromium
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox'
        ],
        headless: true
    }
});

// Counter untuk quotes
let jml = 0;

// ===== COMMAND METHODS =====

const commands = {
    // Basic Commands
    ping: async (message) => {
        message.reply('pong');
    },

    help: async (message) => {
        message.reply(`====================
bot by mudydev
====================
        
--list command--
!help   = menampilkan bantuan dari bot
!date   = waktu dan tanggal
!ping   = bot merespon "pong"
!p      = bot merespong "hai"
!echo (text) = menampilkan text
!typing = bot pura2 mengetik
!recording = bot pura2 record suara
!clearstate = hapus pura2
!quoteinfo = info pesan pada quote
!reqquotes (req anda) = permintaan anda akan ditampung disini
!saran (saran anda) = kirimkan saran anda disini
!timer (angka) = angka akan dieksekusi dalam hitungan detik

--list command spesial--
!sendto (nomor) (dari) (pesan) = !sendto 62xxx anonymous jadi mancing gak?
!spam (jumlah spam) (text) = max 15 spam
!sticker = kirim gambar + caption "sticker", maka secara otomatis
bot akan mengeksekusi menjadi stiker
!waifu = mengirim karakter perempuan

--list command khusus grub--
!desc (deskripsi) = merubah deskripsi
!groupinfo = menampilkan informasi
!subject (nama) = merubah subject
!mediainfo = sertakan media pada pesan anda
!delete = quote chat bot yg ingin dihapus

--list command gabut--
!jokes  = lelucon
!quotes = kata-kata motivasi
!sarkas = psatir handal wkwk


copyright@2024
`);
    },

    date: async (message) => {
        var today = new Date;
        var wt_jam = today.getHours();
        var wt_menit = today.getMinutes();
        var wt_detik = today.getSeconds();
        var wt_tanggal = today.getDate();
        var wt_bulan = today.getMonth() + 1;
        var wt_tahun = today.getFullYear();
        message.reply(`bot mendapati informasi waktu sebagai berikut (WIB):

pukul > ${wt_jam}
menit > ${wt_menit}
detik > ${wt_detik}

tanggal ${wt_tanggal}/${wt_bulan}/${wt_tahun}`);
    },

    p: async (message) => {
        message.reply('hai');
    },

    echo: async (message, args) => {
        message.reply(args);
    },

    aigemini: async (message, args) => {
        try {
            // const aiClient = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || 'YOUR_API_KEY' });
            const aiClient = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
            
            // Mengambil pertanyaan setelah kata '!ai '
            let question = args.trim();
            
            if (!question) {
                message.reply('Minta pertanyaan atau perintah apa nih? Contoh: !ai siapa nama presiden Indonesia?');
                return;
            }
            
            // Beri tanda ke user kalau bot sedang mengetik/berpikir
            const chat = await message.getChat();
            await chat.sendStateTyping();

            // Panggil API Gemini (menggunakan model terbaru yang stabil dan gratis)
            const response = await aiClient.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: question,
            });
            
            const reply = response.candidates[0]?.content?.parts[0]?.text || 'Maaf, AI tidak bisa menjawab pertanyaan itu';
            message.reply(reply);
        } catch (err) {
            console.error('Error in AI command:', err);
            message.reply('Oops, AI sedang error. Coba lagi nanti');
        }
    },

    ai: async (message, args) => {
        try {
            const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
            let question = args.trim();
            
            if (!question) {
                message.reply('Minta pertanyaan atau perintah apa nih? Contoh: !ai siapa nama presiden Indonesia?');
                return;
            }
            
            const chat = await message.getChat();
            await chat.sendStateTyping();
            
            const response = await groqClient.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: question,
                    },
                ],
                model: "openai/gpt-oss-20b",
            });
            
            const reply = response.choices[0]?.message?.content || 'Maaf, AI tidak bisa menjawab pertanyaan itu';
            message.reply(reply);
        }
        catch (err) {
            console.error('Error in Groq AI command:', err);
            message.reply('Oops, Groq AI sedang error. Coba lagi nanti');
        }
    },

    typing: async (message) => {
        let chat = await message.getChat();
        chat.sendStateTyping();
        setTimeout(() => {
            message.reply('sudah selesai ngetik');
        }, 2000);
    },

    recording: async (message) => {
        let chat = await message.getChat();
        chat.sendStateRecording();
        setTimeout(() => {
            message.reply('sudah selesai record');
        }, 2000);
    },

    clearstate: async (message) => {
        let chat = await message.getChat();
        chat.clearState();
        message.reply('state cleared');
    },

    saran: async (message, args) => {
        message.reply(`terima kasih atas saran anda:\n"${args}"\n\n-bot`);
    },

    reqquotes: async (message, args) => {
        message.reply(`permintaan quote anda:\n"${args}"\n\nthanks sudah request\n-bot`);
        // log for future reference
        console.log(`Quote request from ${message.from}: ${args}`);
    },

    jokes: async (message) => {
        const jokes = [
            'Kenapa ayam menyeberang jalan? Karena di seberang ada KFC 😂',
            'Apa bedanya semut dengan gajah? Kalau semut bisa masuk ke rumah, gajah tidak 😅',
            'Siapa nama superhero yang paling santai? Superman karena dia super man (santai) 🦸',
            'Apa bedanya kucing dengan tiger? Tiger punya 5 huruf, kucing punya 5 huruf juga 😸'
        ];
        let randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        message.reply(randomJoke);
    },

    sarkas: async (message) => {
        const sarkas = [
            'Wah, kamu tanya aku? Sepertinya otak kamu sedang liburan 🤣',
            'Pertanyaan bagus! Sayang otak aku lagi dipakai untuk hal yang lebih penting 🧠',
            'Tentu! Tapi aku warning, jawaban aku mungkin terlalu canggih untuk otak manusia 😎',
            'Haha, lucu! Tapi aku saranin kamu tanya yang lebih pintar dari aku 🤓'
        ];
        let randomSarkas = sarkas[Math.floor(Math.random() * sarkas.length)];
        message.reply(randomSarkas);
    },

    sendto: async (message, args) => {
        let parts = args.split(' ');
        let number = parts[0];
        let namadari = parts[1];
        let pesan = parts.slice(2).join(' ');
        
        number = number.includes('@c.us') ? number : `${number}@c.us`;

//         try {
//             message.reply('pesan kamu telah diteruskan ke nomor yang dituju');
//             client.sendMessage(number, `--- secret message ---
            
// from : ${namadari}
// pesan:
// ${pesan}

// - bot by mudydev`);
//         } catch (err) {
//             message.reply('Gagal mengirim pesan');
//         }
        
        message.reply('maaf fitur ini sedang dalam perbaikan, coba lagi nanti');
    },

    spam: async (message, args) => {
        let parts = args.split(' ');
        let jumlah = parseInt(parts[0]);
        let text = parts.slice(1).join(' ');
        
        if (isNaN(jumlah) || jumlah > 15) {
            message.reply('Jumlah spam maksimal 15 kali');
            return;
        }

        for (let i = 0; i < jumlah; i++) {
            setTimeout(() => {
                message.reply(text);
            }, i * 500);
        }
    },

    waifu: async (message) => {
        message.reply('fitur waifu butuh API, untuk sekarang bisa cek galeri sendiri 😉');
    },

    sticker: async (message) => {
        if (!message.hasMedia) {
            message.reply('kirim gambar dulu!');
            return;
        }

        message.reply('tunggu dulu, bot sedang memproses :)');
        
        try{    
            const attchment = await message.downloadMedia();
            if (attchment.mimetype == "image/jpeg" || attchment.mimetype == "image/png") {
                client.sendMessage(message.from, attchment, {sendMediaAsSticker: true});
                console.log('someone make sticker => success');
            } else {
                message.reply('format media yang dimasukkan salah / belum support');
            }
        } catch(err){
            console.log("error make sticker:", err);
            message.reply("pembuatan stiker gagal, coba lagi");
        }
    },

    quotes: async (message) => {
        fs.readFile('res/quotes.json', 'utf-8', (err, jsonString) => {
            if (err) {
                console.error('Error reading quotes file:', err);
                message.reply('Gagal membaca file quotes');
                return;
            }
            try {
                var obj = JSON.parse(jsonString);
                if (jml >= (obj.length)){
                    jml = 0;
                }
                message.reply(obj[jml]);
                jml++;
            } catch (e) {
                console.error('Error parsing quotes JSON:', e);
                message.reply('Error parsing quotes');
            }
        });
    },

    timer: async (message, args) => {
        let masukanangka = parseInt(args);
        
        if (Number.isNaN(masukanangka)){
            message.reply(`kesalahan format, ketik !help apabila anda kurang mengerti\n-bot`);
            return;
        }

        message.reply(`pengingat waktu anda akan dimulai dalam ${masukanangka} detik`);
        let pewaktu = masukanangka * 1000;
        
        setTimeout(() => {
            for (let i = 0; i < 3; i++) {
                message.reply(`pengingat waktu\n-bot`);
            }
        }, pewaktu);
    },

    // Group Commands
    desc: async (message, args) => {
        let chat = await message.getChat();
        if (chat.isGroup) {
            chat.setDescription(args);
            message.reply('deskripsi group telah diubah');
        } else {
            message.reply('perintah ini hanya dapat dilakukan di dalam group!');
        }
    },

    groupinfo: async (message) => {
        let chat = await message.getChat();
        if (chat.isGroup) {
            message.reply(`
📊 Informasi Group:
Nama: ${chat.name}
Member: ${chat.participants.length}
Dibuat: ${chat.createdAt}
            `);
        } else {
            message.reply('perintah ini hanya dapat dilakukan di dalam group!');
        }
    },

    subject: async (message, args) => {
        let chat = await message.getChat();
        if (chat.isGroup) {
            await chat.setSubject(args);
            message.reply('nama group telah diubah');
        } else {
            message.reply('perintah ini hanya dapat dilakukan di dalam group!');
        }
    },

    mediainfo: async (message) => {
        if (!message.hasMedia) {
            message.reply('kirim media dulu!');
            return;
        }

        let media = await message.downloadMedia();
        message.reply(`
📁 Info Media:
Tipe: ${media.mimetype}
Ukuran: ${media.data.length} bytes
        `);
    },

    quoteinfo: async (message) => {
        if (message.hasQuotedMsg) {
            let quotedMsg = await message.getQuotedMessage();
            message.reply(`
📝 Info Pesan:
Dari: ${quotedMsg.from}
Isi: ${quotedMsg.body}
Waktu: ${quotedMsg.timestamp}
            `);
        } else {
            message.reply('quote dulu pesan yang ingin diinfo');
        }
    },

    delete: async (message) => {
        if (message.hasQuotedMsg) {
            let quotedMsg = await message.getQuotedMessage();
            if (quotedMsg.fromMe) {
                await quotedMsg.delete(true);
                message.reply('pesan telah dihapus');
            } else {
                message.reply('hanya bisa hapus pesan dari bot');
            }
        } else {
            message.reply('quote pesan bot yang ingin dihapus');
        }
    }
};

// ===== PRIVATE COMMANDS (fromMe) =====
const privateCommands = {
    // Basic commands
    ping: async (message) => commands.ping(message),
    help: async (message) => commands.help(message),
    date: async (message) => commands.date(message),
    p: async (message) => commands.p(message),
    aigemini: async (message, args) => commands.ai(message, args),
    ai: async (message, args) => commands.groqai(message, args),
    echo: async (message, args) => commands.echo(message, args),
    typing: async (message) => commands.typing(message),
    recording: async (message) => commands.recording(message),
    clearstate: async (message) => commands.clearstate(message),
    saran: async (message, args) => commands.saran(message, args),
    reqquotes: async (message, args) => commands.reqquotes(message, args),
    jokes: async (message) => commands.jokes(message),
    sarkas: async (message) => commands.sarkas(message),
    sendto: async (message, args) => commands.sendto(message, args),
    spam: async (message, args) => commands.spam(message, args),
    waifu: async (message) => commands.waifu(message),
    sticker: async (message) => commands.sticker(message),
    quotes: async (message) => commands.quotes(message),
    timer: async (message, args) => commands.timer(message, args),

    // Group commands
    desc: async (message, args) => commands.desc(message, args),
    groupinfo: async (message) => commands.groupinfo(message),
    subject: async (message, args) => commands.subject(message, args),
    mediainfo: async (message) => commands.mediainfo(message),
    quoteinfo: async (message) => commands.quoteinfo(message),
    delete: async (message) => commands.delete(message),

    // Special private command
    tes: async (message) => {
        message.reply('oke');
    }
};

// ===== CLIENT EVENTS =====

client.once('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.initialize();

// ===== MESSAGE HANDLER =====

client.on('message_create', async message => {
    try {
        const body = message.body.trim();
        
        // Parse command dan arguments
        let cmd, args;
        
        if (body.startsWith('!me-')) {
            // Private commands
            cmd = body.slice(4).split(' ')[0];
            args = body.slice(4 + cmd.length).trim();
            
            if (privateCommands[cmd]) {
                await privateCommands[cmd](message, args);
            }
        } else if (body.startsWith('!')) {
            // Public commands
            cmd = body.slice(1).split(' ')[0];
            args = body.slice(1 + cmd.length).trim();
            
            if (commands[cmd]) {
                await commands[cmd](message, args);
            }
        }
    } catch (err) {
        console.error('Error in message handler:', err);
        try {
            message.reply('terjadi kesalahan bot, coba lagi');
        } catch (e) {
            console.error('Cannot send error message:', e);
        }
    }
});
