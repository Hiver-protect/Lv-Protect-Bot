const { REST, Routes } = require('discord.js');

module.exports = {
  name: 'deploy-commands',
  description: 'Déployer les commandes slash globalement',
  async execute(client) {
    const commands = [];
    client.commands.forEach(cmd => commands.push(cmd.data.toJSON()));
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
      );
      console.log('Commandes globales déployées.');
    } catch (error) {
      console.error(error);
    }
  },
};
