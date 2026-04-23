const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Créer un ticket de support'),
  async execute(interaction) {
    // Crée un ticket (salon privé)
    const { getConfig } = require('../modules/guildConfig');
    const config = getConfig(interaction.guild.id);
    const category = interaction.guild.channels.cache.get(config.ticketCategory);
    if (!category) return interaction.reply({ content: 'Catégorie tickets introuvable.', ephemeral: true });
    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: 0, // GUILD_TEXT
      parent: category.id,
      permissionOverwrites: [
        { id: interaction.guild.id, deny: ['ViewChannel'] },
        { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] },
      ],
    });
    await channel.send(`Ticket ouvert par <@${interaction.user.id}>. Un membre du staff va vous répondre.`);
    await interaction.reply({ content: `Ticket créé : ${channel}`, ephemeral: true });
  },
};
