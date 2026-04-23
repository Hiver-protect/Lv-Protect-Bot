const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const warns = new Map(); // À remplacer par une base de données pour la prod

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avertir un membre')
    .addUserOption(opt => opt.setName('membre').setDescription('Membre à avertir').setRequired(true))
    .addStringOption(opt => opt.setName('raison').setDescription('Raison de l\'avertissement'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison') || 'Aucune raison';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Membre introuvable.', ephemeral: true });
    if (!warns.has(user.id)) warns.set(user.id, []);
    warns.get(user.id).push({ reason, date: new Date(), mod: interaction.user.id });
    await interaction.reply({ content: `${user.tag} averti.`, ephemeral: true });
  },
};
