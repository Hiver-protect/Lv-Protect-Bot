const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute un membre (retire le timeout)')
    .addUserOption(opt => opt.setName('membre').setDescription('Membre à unmute').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('membre');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Membre introuvable.', ephemeral: true });
    await member.timeout(null);
    await interaction.reply({ content: `${user.tag} unmute.`, ephemeral: true });
  },
};
