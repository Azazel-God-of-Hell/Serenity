const Command = require('../../classes/Command');
const { getWelcomeMessage } = require('../../mongo/welcomeMessages');

module.exports = new Command(async ({ client, interaction, guildSettings, args, emojis }) => {
  // Fetching welcomeSettings from the database
  const welcomeSettings = await getWelcomeMessage(interaction.guild.id);
  // Assigning our new value
  const action = args[0].name;
  const newValue = args[0].options[0].value;
  switch (action) {
    case 'message': {
      // Apply the new value to the welcomeSettings
      welcomeSettings.welcomeMessage = `${newValue}`;
      // wait for the settings to save
      await welcomeSettings.save();
      // Reply with a response
      return interaction.reply({
        content: `${emojis.response.success} ${interaction.member.toString()}, successfully updated welcome message to:\n\`\`\`${newValue}\`\`\`\n\nDid you know, using {{user}} will ping the user when they join.`
      });
    }
    // Checks on channel
    default: {
      // Fetch the channel from the received arguments/args (line 4)
      const newChannel = interaction.guild.channels.cache.get(newValue);
      // Checking to see if the channel has the proper type, just GUILD_TEXT channels will validate
      if (newChannel.type !== 'GUILD_TEXT') {
        return interaction.reply({
          content: `${emojis.response.error} ${interaction.member.toString()}, please provide a TEXT channel!`,
          ephemeral: true
        });
      }
      // Apply the new value to the settings
      welcomeSettings.channelId = newChannel.id;
      // Wait for the settings to save
      await welcomeSettings.save();
      // Reply with a response
      interaction.reply({
        content: `${emojis.response.success} ${interaction.member.toString()}, successfully updated welcome channel to **#${newChannel.name}**!`
      });
      // break basically means finished, its the end of what should execute
      break;
    }
  }

}, {
  // Defining it as a global command
  globalCommand: true,
  // Setting the permission level
  permLevel: 'Administrator',
  // Data from -> https://discord.js.org/#/docs/main/stable/typedef/ApplicationCommandOptionData
  data: {
    description: 'Edit welcome messages.',
    options: [
      {
        name: 'message',
        type: 'SUB_COMMAND',
        description: 'Edit the welcome message to send, use {{user}} for a tag',
        required: true,
        options: [
          {
            name: 'text',
            description: 'The new welcome message to send, use {{user}} for a tag',
            required: true,
            type: 'STRING',
          }
        ]
      },
      {
        name: 'channel',
        type: 'SUB_COMMAND',
        description: 'Edit the channel to send welcome messages to.',
        required: true,
        options: [
          {
            name: 'channel',
            description: 'The new channel ID',
            type: 'CHANNEL',
            required: true
          }
        ]
      }
    ]
  }
});