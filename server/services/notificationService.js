const notifySubscribers = async (business, message) => {
  try {
    business.subscribers.forEach((subscriberId) => {
      console.log(
        `Notification sent to subscriber ${subscriberId}: ${message}`
      );
    });
  } catch (error) {
    console.error("Error in notifySubscribers:", error);
    throw error;
  }
};

module.exports = { notifySubscribers };
