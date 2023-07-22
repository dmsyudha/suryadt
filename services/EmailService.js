// EmailService.js
const axios = require("axios");

const API_BASE_URL = "https://email-service.digitalenvision.com.au";

class EmailService {
  static async sendEmail(email, subject, message) {
    try {
      const response = await axios.post(`${API_BASE_URL}/send-email`, {
        email,
        subject,
        message,
      });
      return response.status;
    } catch (err) {
      if (err.response) {
        console.log("Error Response: ", err);
        return err.response.status;
      } else {
        return null;
      }
    }
  }

  static async sendMessage(user, subject, messageTemplate) {
    const { firstName, lastName, email } = user;
    const message = messageTemplate
      .replace("{firstName}", firstName)
      .replace("{lastName}", lastName);
    const status = await this.sendEmail(email, subject, message);
    return status;
  }
}

module.exports = EmailService;
