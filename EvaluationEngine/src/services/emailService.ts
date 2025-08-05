import nodemailer from 'nodemailer';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Change as needed
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEvaluationRequest(email: string, skill: string) {
    // Email sending bypassed for local/test use
    return Promise.resolve('Email sending bypassed.');
  }
}
