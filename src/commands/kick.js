const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulser un membre')
    .addUserOption(opt => opt.setName('membre').setDescription('Membre à expulser').setRequired(true))
    .addStringOption(opt => opt.setName('raison').setDescription('Raison du kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison') || 'Aucune raison';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Membre introuvable.', ephemeral: true });
    await member.kick(reason);
    await interaction.reply({ content: `${user.tag} expulsé.`, ephemeral: true });
  },
};
