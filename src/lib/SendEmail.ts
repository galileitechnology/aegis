import { createTransport } from "nodemailer";
import { render } from "@react-email/render";
import React from "react";

export class SendEmail {
  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string
  ): Promise<void> {
    const transporter = createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_FROM_ADDRESS,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const response = await transporter.sendMail({
      from: {
        address: process.env.EMAIL_SERVER_FROM_ADDRESS || "",
        name: process.env.EMAIL_SERVER_FROM_NAME || "",
      },
      to: to,
      subject: subject,
      html: html,
      text: text,
    });

    const failed = response.rejected.concat(response.pending).filter(Boolean);

    if (failed.length) {
      throw new Error(`Email (${failed.join(", ")}) não pode ser enviado`);
    }
  }

  async getHtml(element: React.ReactElement): Promise<string> {
    const html = await render(element);
    return html;
  }
}
