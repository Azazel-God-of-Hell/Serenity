// We initialize this listeners by adding a file in 
// src/listeners -> anywhere, structure doesn't matter
// the file name will be the event we listen to
// You can view all the events here
// https://discord.js.org/#/docs/main/stable/class/Client

const { getWelcomeMessage } = require('../../mongo/welcomeMessages');

module.exports = async (client, member) => {

  // Here we desctructure guild from the member
  const { guild } = member;
  // Return if the guild isnt available
  if (!guild.available) return;
  // Return (dont send anything) for bots
  if (member.user.bot) return;

  // Grabbing the settings from the database
  const welcomeSettings = await getWelcomeMessage(guild.id);
  // Defining the channel, grabbing it from the guild channels cache
  const channel = guild.channels.cache.get(welcomeSettings.channelId);
  // Return if we can't access the channel
  if (!channel) return;
  const welcomeMessage = welcomeSettings.welcomeMessage;
  if (!welcomeMessage) return;
  
  channel.send({
    // Replacing the {{user}} tag with the actual value
    content: welcomeMessage.replace(/{{user}}/g, member.toString())
  }).catch((err) => {
    // Catch errors and log them to the console if we encounter them
    // Log the full stack OR just the error
    console.log(err.stack || err);
  });

};
