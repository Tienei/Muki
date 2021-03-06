const { MessageEmbed, Message } = require('discord.js');
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const path = require('path');

const infoEmbed = (user, member, guild, memberinfo, userinfo) =>
  new MessageEmbed()
    .setTitle(`${user.tag}`)
    .setThumbnail(user.displayAvatarURL({ size: 512, dynamic: true }))
    .addFields(
      { name: 'User Info:', value: userinfo },
      { name: `Info como miembro de ${guild.name}:`, value: memberinfo }
    )
    .setColor(member.displayColor)
    .setTimestamp()

const memberinfo = (member, gSince) =>
  `**Roles:** ${member.roles.cache.size}
**Rol más alto:** <@&${member.roles.highest.id}>
**Miembro desde:** ${gSince.day} ${gSince.date} de ${gSince.month} del ${gSince.year}`;

const userinfo = (user, mSince) =>
  `**ID:** ${user.id}
**Discriminador:** ${user.discriminator}
**Creación de la Cuenta:** ${mSince.day} ${mSince.date} de ${mSince.month} del ${mSince.year}`;


module.exports = {
  name: "uinfo",
  guildOnly: true,
  filename: path.basename(__filename),
  description: "Tarjeta de información de un usuario.",
  usage: "uinfo (@Mención de usuario)",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],

  async execute(message = new Message(), args = new Array()) {
    const { guild, mentions, channel } = message;
    try {
      const user = mentions.users.first() || message.author;
      const member = mentions.members.first() || message.member;
      const dMemberSince = user.createdAt;
      const gMemberSince = member.joinedAt;

      const mSince = {
        day: dias[dMemberSince.getDay()],
        date: dMemberSince.getDate(),
        month: meses[dMemberSince.getMonth()],
        year: dMemberSince.getFullYear()
      }
      const gSince = {
        day: dias[gMemberSince.getDay()],
        date: gMemberSince.getDate(),
        month: meses[gMemberSince.getMonth()],
        year: gMemberSince.getFullYear()
      }

      const memberInfo = memberinfo(member, gSince);
      const userInfo = userinfo(user, mSince);

      return channel.send(infoEmbed(user, member, guild, memberInfo, userInfo));
    } catch (error) {
      console.log(error);
    }
  }
}