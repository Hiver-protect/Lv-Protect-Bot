const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Supprimer des messages en masse')
    .addIntegerOption(opt => opt.setName('nombre').setDescription('Nombre de messages à supprimer (max 100)').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const nombre = interaction.options.getInteger('nombre');
    if (nombre < 1 || nombre > 100) return interaction.reply({ content: 'Entre 1 et 100.', ephemeral: true });
    const messages = await interaction.channel.bulkDelete(nombre, true);
    await interaction.reply({ content: `${messages.size} messages supprimés.`, ephemeral: true });
  },
};
