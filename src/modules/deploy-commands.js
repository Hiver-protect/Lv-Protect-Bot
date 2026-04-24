const { REST, Routes } = require('discord.js');

module.exports = {
    name: 'deploy-commands',
    description: 'Déploiement SLASH COMMANDS GLOBAL + GUILD (PRO)',

    async execute(client) {

        // =========================
        // 📦 COLLECT COMMANDS SAFE
        // =========================
        const commands = [];

        client.commands.forEach(cmd => {
            if (cmd?.data?.toJSON) {
                try {
                    commands.push(cmd.data.toJSON());
                } catch (e) {
                    console.log(`⚠️ Commande ignorée (erreur JSON)`);
                }
            }
        });

        if (commands.length === 0) {
            console.log("❌ Aucune commande à déployer");
            return;
        }

        // =========================
        // 🔐 CLIENT ID SAFE
        // =========================
        const CLIENT_ID =
            process.env.CLIENT_ID ||
            client.application?.id;

        if (!CLIENT_ID) {
            console.error("❌ CLIENT_ID introuvable");
            return;
        }

        const rest = new REST({ version: '10' })
            .setToken(process.env.DISCORD_TOKEN);

        console.log(`🔄 Déploiement de ${commands.length} commandes...`);

        // =========================
        // ⚡ MODE PRIORITAIRE (GUILD DEV)
        // =========================
        const guildId = process.env.GUILD_ID;

        try {

            if (guildId) {

                console.log("⚡ MODE GUILD (instantané)");

                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, guildId),
                    { body: commands }
                );

                console.log("✅ Commandes GUILD synchronisées (instant)");
                console.log("ℹ️ Utilisé pour TEST DEV");

            } else {

                console.log("🌍 MODE GLOBAL (tous serveurs)");

                await rest.put(
                    Routes.applicationCommands(CLIENT_ID),
                    { body: commands }
                );

                console.log("✅ Commandes GLOBAL déployées");
                console.log("⏳ Propagation Discord: 5 min à 1h");

            }

        } catch (error) {

            console.error("❌ Erreur deploy commands :", error);

            // =========================
            // 🔁 AUTO RETRY SAFE
            // =========================
            console.log("🔁 Retry dans 5 secondes...");

            setTimeout(async () => {
                try {
                    await rest.put(
                        guildId
                            ? Routes.applicationGuildCommands(CLIENT_ID, guildId)
                            : Routes.applicationCommands(CLIENT_ID),
                        { body: commands }
                    );

                    console.log("✅ Retry réussi !");
                } catch (err) {
                    console.error("❌ Retry échoué :", err);
                }
            }, 5000);
        }
    }
};