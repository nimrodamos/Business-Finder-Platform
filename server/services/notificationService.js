const Notification = require("../models/notificationModel");

const notifySubscribers = async (business, message) => {
  console.log(`Notification: ${message}`);

  const notifications = business.subscribers.map((subscriberId) => ({
    userId: subscriberId,
    message,
  }));

  try {
    await Notification.insertMany(notifications);
    console.log("Notifications saved to the database.");
  } catch (error) {
    console.error("Error saving notifications:", error);
  }
};

module.exports = { notifySubscribers };
