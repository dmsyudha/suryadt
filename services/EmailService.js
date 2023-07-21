// EmailService.js
const axios = require('axios');

const API_BASE_URL = 'https://email-service.digitalenvision.com.au';

class EmailService {
    static async sendEmail(email, message) {
        try {
            const response = await axios.post(API_BASE_URL+'/send-email', { email, message });
            console.log(response)
            return response.status;
        } catch (err) {
            if (err.response) {
                console.log(err.response)
                return err.response.status;
            } else {
                return null;
            }
        }
    }

    static async sendBirthdayEmail(user) {
        const { firstName, lastName, email } = user;
        const message = `Hey, ${firstName} ${lastName}, it's your birthday!`;

        const status = await this.sendEmail(email, message);
        return status;
    }
}

module.exports = EmailService;
