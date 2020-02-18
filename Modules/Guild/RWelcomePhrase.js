//This command will remove phrases from the database, in this case, JOIN phrases.

const { MessageEmbed, Message } = require('discord.js');
const database = require('../LoadDatabase').guildConfigs;

const noPhrase = (author, prefix) => {
  return new MessageEmbed()
    .setColor("RED")
    .setTitle(`❌ ¡No has ingresado la frase!`)
    .setDescription(`${author.username} debes ingresar la frase que quieres quitar.\n\nPara ver la lista de frases escribe \`${prefix}wfrases.\``)
}

const notFound = (author) => {
  return new MessageEmbed()
    .setTitle(`🔎 ERROR: 404`)
    .setDescription(`No he encontrado la frase que ingresaste.\nPor favor ${author.username} comprueba que la hayas escrito correctamente.`)
    .setColor("YELLOW");
}

const succeed = new MessageEmbed()
  .setTitle("¡Yay!")
  .setDescription("¡La frase ha sido quitada exitosamente!")
  .setColor("GREEN");

module.exports = async (message = new Message(), phrase) => {
  const { member, channel, guild, author } = message;

  if (!member.hasPermission('ADMINISTRATOR', { checkOwner: true })) return undefined;

  const config = database.get(guild.id);
  if (!config) return console.log(`Por alguna razón, la guild ${guild.name} no tiene entrada de configuración.`);

  if (!phrase) return await channel.send(noPhrase(author, config.prefix));

  const { joinPhrases } = config.welcome;

  if (!joinPhrases.includes(phrase)) return await channel.send(notFound(author));
  else {
    const updatedPhrases = joinPhrases.filter(ph => ph !== phrase);

    database.set(guild.id, updatedPhrases, "welcome.joinPhrases");
    return await channel.send(succeed);
  }
} 