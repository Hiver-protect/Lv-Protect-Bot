require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    ActivityType
} = require('discord.js');

const fs = require('fs');
const path = require('path');

// =========================
// 🔐 ENV CHECK
// =========================
if (!process.env.DISCORD_TOKEN) {
    console.error("❌ DISCORD_TOKEN manquant");
    process.exit(1);
}

// =========================
// 🤖 CLIENT INIT
// =========================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});

client.commands = new Collection();

// =========================
// 📊 LOGGER PRO
// =========================
const log = {
    ok: (m) => console.log(`✔ ${m}`),
    warn: (m) => console.log(`⚠ ${m}`),
    err: (m) => console.log(`✖ ${m}`),
    info: (m) => console.log(`ℹ ${m}`)
};

// =========================
// 📂 LOAD COMMANDS SAFE
// =========================
function loadCommands() {
    const dir = path.join(__dirname, 'commands');

    if (!fs.existsSync(dir)) return log.err("commands/ introuvable");

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

    let count = 0;

    for (const file of files) {
        try {
            const cmd = require(path.join(dir, file));

            if (!cmd?.data?.name || !cmd?.execute) {
                log.warn(`Commande invalide: ${file}`);
                continue;
            }

            client.commands.set(cmd.data.name, cmd);
            log.ok(`Commande: ${cmd.data.name}`);
            count++;

        } catch (e) {
            log.err(`Erreur commande ${file}`);
            console.error(e);
        }
    }

    log.info(`${count} commandes chargées`);
}

// =========================
// ⚡ LOAD EVENTS SAFE
// =========================
function loadEvents() {
    const dir = path.join(__dirname, 'events');

    if (!fs.existsSync(dir)) return log.err("events/ introuvable");

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

    let count = 0;

    for (const file of files) {
        try {
            const event = require(path.join(dir, file));

            if (!event.name || !event.execute) {
                log.warn(`Event invalide: ${file}`);
                continue;
            }

            const handler = (...args) => event.execute(...args, client);

            event.once
                ? client.once(event.name, handler)
                : client.on(event.name, handler);

            log.ok(`Event: ${event.name}`);
            count++;

        } catch (e) {
            log.err(`Erreur event ${file}`);
            console.error(e);
        }
    }

    log.info(`${count} events chargés`);
}

// =========================
// 🎮 STATUS SAFE
// =========================
function setStatus() {
    if (!client.user) return;

    client.user.setPresence({
        activities: [{
            name: "🛡️ En Developement",
            type: ActivityType.Playing
        }],
        status: "online"
    });
}

// =========================
// 🚀 AUTO DEPLOY FIX (IMPORTANT)
// =========================
async function deployCommands() {
    try {
        const deploy = require('./deploy-commands');

        if (!deploy?.execute) {
            log.warn("deploy-commands manquant ou invalide");
            return;
        }

        await deploy.execute(client);

        log.ok("Slash commands synchronisées");

    } catch (e) {
        log.warn("Sync commands ignoré");
        console.error(e);
    }
}

// =========================
// 🧠 READY (FIXED V14)
// =========================
client.once('ready', async () => {
    log.ok(`Connecté en tant que ${client.user.tag}`);

    setStatus();

    loadCommands();
    loadEvents();

    await deployCommands();
});

// =========================
// 🚀 LOGIN SAFE
// =========================
(async () => {
    try {
        await client.login(process.env.DISCORD_TOKEN);
    } catch (err) {
        log.err("Erreur login bot");
        console.error(err);
        process.exit(1);
    }
})();

// =========================
// 🧠 ERROR HANDLING
// =========================
process.on('unhandledRejection', (err) => {
    log.err('Unhandled Rejection');
    console.error(err);
});

process.on('uncaughtException', (err) => {
    log.err('Uncaught Exception');
    console.error(err);
});