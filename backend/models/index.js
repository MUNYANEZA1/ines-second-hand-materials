// models/index.js
const User = require('./User');
const Item = require('./Item');
const Message = require('./Message');
const Report = require('./Report');

// Define relationships
User.hasMany(Item, { foreignKey: 'user_id' });
Item.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Message, { foreignKey: 'sender_id', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'ReceivedMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'Receiver' });

User.hasMany(Report, { foreignKey: 'reporter_id', as: 'Reports' });
Report.belongsTo(User, { foreignKey: 'reporter_id', as: 'Reporter' });
Report.belongsTo(User, { foreignKey: 'target_user_id', as: 'TargetUser' });
Report.belongsTo(Item, { foreignKey: 'item_id', as: 'ReportedItem' });

module.exports = {
  User,
  Item,
  Message,
  Report
};