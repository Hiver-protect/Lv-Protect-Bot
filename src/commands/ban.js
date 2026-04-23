const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre')
    .addUserOption(opt => opt.setName('membre').setDescription('Membre à bannir').setRequired(true))
    .addStringOption(opt => opt.setName('raison').setDescription('Raison du ban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison') || 'Aucune raison';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Membre introuvable.', ephemeral: true });
    await member.ban({ reason });
    await interaction.reply({ content: `${user.tag} banni.`, ephemeral: true });
  },
};
