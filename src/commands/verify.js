const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Lancer la vérification utilisateur'),
  async execute(interaction) {
    const verification = require('../modules/verification');
    await verification.startVerification(interaction.member, interaction.client, interaction);
  },
};
