const { Message, MessageEmbed, GuildMember } = require('discord.js');
const path = require('path');

const infoEmbed = (author, guild, reason) =>
  new MessageEmbed()
    .setThumbnail(author.displayAvatarURL({ size: 256 }))
    .setColor("RED")
    .setTitle(`${author.tag} te ha silenciado en ${guild.name}!`)
    .setDescription(`**Motivo:** ${reason || "Sin motivo."}\nHablale para que te desmutee!`)
    .setTimestamp();

const noTarget = (author) =>
  new MessageEmbed()
    .setTitle(`❌ ${author.username} no has mencionado a ningún miembro.`)
    .setColor("RED");

module.exports = {
  name: "mmute",
  guildOnly: true,
  filename: path.basename(__filename),
  description: "Silencia / De-silencia el micrófono de un miembro que esté en un canal de voz.",
  usage: "mmute [@Mención de miembro]",
  nsfw: false,
  enabled: false,
  aliases: [],
  permissions: ["MUTE_MEMBERS"],

  async execute(message = new Message(), args = new Array()) {
    const { channel, guild, mentions, author } = message;
    try {
      if (guild.me.hasPermission('MUTE_MEMBERS', { checkAdmin: true })) {

        const target = mentions.members.first();
        if (!target) return channel.send(noTarget(author));

        const reason = args.splice(1).join(" ");
        if (!target.voice.channel) return message.reply(`El miembro ${target.displayName} no está en ningún canal de voz.`);
        if (target.voice.serverMute) return target.voice.setMute(false, reason)
          .then(gm => message.channel.send(`He desmuteado a **<@${gm.id}>!**`));

        const mutedMember = await target.voice.setMute(true, reason);
        await channel.send(`He silenciado exitosamente a ${mutedMember.displayName}\n\nNo olvides desmutearlo mas tarde!`);

        return mutedMember.send(infoEmbed(author, guild, reason));
      } else return message.reply("necesito el permiso '**SILENCIAR MIEMBROS**' para ejecutar este comando.");
    }
    catch (error) {
      console.log(error);
    }
  }
}