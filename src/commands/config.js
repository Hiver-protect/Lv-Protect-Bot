const { SlashCommandBuilder } = require('discord.js');
const { getConfig, setConfig } = require('../modules/guildConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configurer le bot pour ce serveur')
    .addStringOption(opt => opt.setName('log_channel').setDescription('ID du salon logs'))
    .addStringOption(opt => opt.setName('ticket_category').setDescription('ID de la catégorie tickets'))
    .addStringOption(opt => opt.setName('verified_role').setDescription('ID du rôle vérifié')),
  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: 'Permission administrateur requise.', ephemeral: true });
    }
    const guildId = interaction.guild.id;
    const config = getConfig(guildId);
    if (interaction.options.getString('log_channel')) config.logChannel = interaction.options.getString('log_channel');
    if (interaction.options.getString('ticket_category')) config.ticketCategory = interaction.options.getString('ticket_category');
    if (interaction.options.getString('verified_role')) config.verifiedRole = interaction.options.getString('verified_role');
    setConfig(guildId, config);
    await interaction.reply({ content: 'Configuration enregistrée.', ephemeral: true });
  },
};
