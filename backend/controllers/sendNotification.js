const admin = require('firebase-admin');
const User = require('../models/User'); // Adjust path as needed

// Initialize Firebase Admin SDK (assumes setup in firebaseConfig.js)
const { initializeFirebase } = require('../config/firebaseConfig');
initializeFirebase();

const sendNotification = async (notificationData) => {
  try {
    // Validate required fields
    if (!notificationData.to) {
      return {
        success: false,
        error: 'Device token (to) is missing',
        code: 'missing-token'
      };
    }

    const response = await admin.messaging().send({
      data: notificationData.data, // Pass the data object directly
      token: notificationData.to // Use 'to' field as the FCM token
    });
    return { success: true, response };
  } catch (error) {
    console.error('Firebase messaging error:', error);

    if (error.code === 'messaging/registration-token-not-registered' || 
        error.code === 'messaging/invalid-registration-token') {
      
      console.log('Invalid FCM token detected, cleaning up...');
      
      // Remove invalid token from database
      if (notificationData.userId) {
        await removeInvalidTokenFromUser(notificationData.userId, notificationData.to);
      }
      
      return { 
        success: false, 
        error: 'Invalid FCM token removed from database',
        code: error.code 
      };
    }

    // For other errors, return error info without throwing
    return { 
      success: false, 
      error: error.message,
      code: error.code 
    };
  }
};

const removeInvalidTokenFromUser = async (userId, invalidToken) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { deviceTokens: invalidToken } },
      { new: true }
    );
    console.log(`Removed invalid token ${invalidToken} from user ${userId}`);
  } catch (error) {
    console.error('Error removing invalid token:', error);
  }
};

// Send notification to multiple tokens with validation
const sendNotificationToMultipleTokens = async (notificationData, tokens, userId) => {
  const results = [];
  
  for (const token of tokens) {
    const result = await sendNotification({
      to: token, // Map token to 'to' field
      data: notificationData.data, // Pass the data object
      userId // Include userId for token invalidation
    });
    results.push({ token, ...result });
  }
  
  return results;
};

module.exports = { 
  sendNotification, 
  removeInvalidTokenFromUser,
  sendNotificationToMultipleTokens 
};