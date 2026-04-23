const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute un membre (timeout)')
    .addUserOption(opt => opt.setName('membre').setDescription('Membre à mute').setRequired(true))
    .addIntegerOption(opt => opt.setName('minutes').setDescription('Durée en minutes').setRequired(true))
    .addStringOption(opt => opt.setName('raison').setDescription('Raison du mute'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('membre');
    const minutes = interaction.options.getInteger('minutes');
    const reason = interaction.options.getString('raison') || 'Aucune raison';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Membre introuvable.', ephemeral: true });
    await member.timeout(minutes * 60 * 1000, reason);
    await interaction.reply({ content: `${user.tag} mute ${minutes} min.`, ephemeral: true });
  },
};
