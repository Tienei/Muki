const path = require('path');
const { MessageEmbed, Message, User } = require('discord.js');

const avatarEmbed = (user = new User()) =>
    new MessageEmbed()
    .setTitle(`Avatar de ${user.username}`)
    .setImage(user.avatarURL({ size: 512, dynamic: true }))
    .setColor('#add8e6')

function noArgument(args) {
    if (args == undefined) return true;
}

function getAuthorAvatar(message = new Message()) {
    return avatarEmbed(message.author)
}

async function findUserByID(message = new Message(), id) {
    return avatarEmbed(await message.client.users.fetch(id, true))
}

function findUserByMention(message = new Message()) {
    return avatarEmbed(message.mentions.users.first())
}

function findUserByName(message = new Message(), name) {
    let membersList = message.guild.members.cache.array()
    for (let i = 0; i < membersList.length; i++) {
        let memberName = membersList[i].nickname || membersList[i].user.username
        if (memberName.toUpperCase().indexOf(name.toUpperCase()) > -1) {
            return avatarEmbed(membersList[i].user)
        }
    }
}

module.exports = {
    name: "avatar",
    guildOnly: false,
    filename: path.basename(__filename),
    description: "Envía el avatar de un usuario",
    usage: "avatar (@Mención de usuario | ID | nombre de usuario)",
    nsfw: false,
    enabled: true,
    aliases: [],
    permissions: [],

    async execute(message = new Message(), args = new Array()) {
        const { guild, channel, mentions } = message;
        const user = args.join(" ")
        let embed; 
        if (noArgument(user)) {
            embed = getAuthorAvatar(message)
        } else {
            if (isNaN(user)) {
                // A String input
                if (mentions.users.array().length > 0) {
                    // Mentioned
                    embed = findUserByMention(message)
                } else {
                    // Find user by name
                    if (guild) embed = findUserByName(message, user);
                }
            } else {
                // A number input (or Discord ID)
                embed = await findUserByID(message, user)
            }
        }
        return channel.send(embed)
    }
}
