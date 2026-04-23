// Gestion de la configuration par serveur (stockée en JSON, à remplacer par une base de données pour la prod)
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../data/config.json');

function getConfig(guildId) {
  if (!fs.existsSync(configPath)) return {};
  const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return data[guildId] || {};
}

function setConfig(guildId, config) {
  let data = {};
  if (fs.existsSync(configPath)) data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  data[guildId] = config;
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
}

module.exports = { getConfig, setConfig };
