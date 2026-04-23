const { AttachmentBuilder } = require('discord.js');
const { Captcha } = require('captcha-canvas');

module.exports = {
  async startVerification(member, client, interaction = null) {
    // Générer un captcha
    const captcha = new Captcha();
    captcha.async = false;
    captcha.addDecoy();
    captcha.drawTrace();
    captcha.drawCaptcha();
    const buffer = await captcha.png;

    // Envoyer le captcha en DM
    try {
      const dm = await member.send({
        content: 'Merci de compléter ce captcha pour accéder au serveur.',
        files: [new AttachmentBuilder(buffer, { name: 'captcha.png' })],
      });
      // Attendre la réponse
      const filter = m => m.author.id === member.id;
      const collected = await dm.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
      const response = collected.first().content;
      if (response === captcha.text) {
        await member.send('Vérification réussie !');
        const { getConfig } = require('./guildConfig');
        const config = getConfig(member.guild.id);
        const role = member.guild.roles.cache.get(config.verifiedRole);
        if (role) await member.roles.add(role);
        if (interaction) await interaction.reply({ content: 'Vérification réussie !', ephemeral: true });
      } else {
        await member.send('Captcha incorrect.');
        if (interaction) await interaction.reply({ content: 'Captcha incorrect.', ephemeral: true });
      }
    } catch (err) {
      if (interaction) await interaction.reply({ content: 'Erreur lors de la vérification.', ephemeral: true });
    }
  },
};
