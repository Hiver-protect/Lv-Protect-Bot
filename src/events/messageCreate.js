const { Events } = require('discord.js');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot) return;
    // Anti-spam simple : flood de messages identiques
    const recent = client.recentMessages || new Map();
    const now = Date.now();
    const key = `${message.guildId}-${message.author.id}`;
    if (!recent.has(key)) recent.set(key, []);
    recent.get(key).push(now);
    // Garder les 5 derniers messages sur 10s
    recent.set(key, recent.get(key).filter(ts => now - ts < 10000));
    if (recent.get(key).length > 5) {
      await message.member.timeout(60 * 1000, 'Spam détecté');
      const { getConfig } = require('../modules/guildConfig');
      const config = getConfig(message.guild.id);
      const logChannel = client.channels.cache.get(config.logChannel);
      if (logChannel) logChannel.send(`⛔ Spam détecté : ${message.author.tag}`);
    }
    client.recentMessages = recent;
  },
};
