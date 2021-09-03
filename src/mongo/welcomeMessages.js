// Require Schema and model from the mongoose package
const { Schema, model } = require('mongoose');

// Define the WelcomeSchema
const welcomeSchema = Schema({
  _guildId: { type: String, required: true },
  // Default to null for easy checking if the setting is there
  channelId: { type: String, default: null },
  welcomeMessage: { type: String, default: null }
});

// Export the WelcomeModel so we can access it everywhere
const WelcomeModel = model('welcome', welcomeSchema);
module.exports.WelcomeModel = WelcomeModel;

// The main function from fetching from the database
module.exports.getWelcomeMessage = async (_guildId) => {
  let welcomeEntry;
  try {
    // Find _guildId in WelcomeModel
    welcomeEntry = await WelcomeModel.findOne({ _guildId });
    // Create a new entry if it isnt found
    if (!welcomeEntry) {
      const newData = new WelcomeModel({ _guildId });
      // Saving the data for fetching next time
      welcomeEntry = await newData.save();
    }
  } catch (err) {
    // Catching errors and console logging them
    return console.log(err);
  }
  // Returning welcomeEntry
  return welcomeEntry;
};
