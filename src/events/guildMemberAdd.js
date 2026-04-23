const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    // Détection de comptes suspects (ex: comptes récents)
    const accountAge = Date.now() - member.user.createdAt;
    const minAccountAge = 1000 * 60 * 60 * 24 * 7; // 7 jours
    if (accountAge < minAccountAge) {
      const { getConfig } = require('../modules/guildConfig');
      const config = getConfig(member.guild.id);
      const logChannel = client.channels.cache.get(config.logChannel);
      if (logChannel) {
        logChannel.send(`⚠️ Utilisateur suspect : ${member.user.tag} (créé il y a moins de 7 jours)`);
      }
      // Optionnel : kick ou mute automatique
    }
    // Lancer la vérification captcha
    const verification = require('../modules/verification');
    verification.startVerification(member, client);
  },
};
