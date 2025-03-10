import { SendEmail } from "@/lib/SendEmail";
import { RegisterEmailConfirm } from "transactional/emails/RegisterConfirm";

export class ConfirmRegisterEmail {
  async execute(username: string, email: string, confirmToken?: string) {
    const sendEmail = new SendEmail();
    const html = await sendEmail.getHtml(
      RegisterEmailConfirm({
        username: username,
        email: email,
        confirmLink: `${process.env.APP_URL}/confirmar/${confirmToken}`,
      })
    );
    await sendEmail.sendEmail(
      "rodrigoantunestutz@gmail.com",
      "Confirme seu email",
      html
    );
  }
}
