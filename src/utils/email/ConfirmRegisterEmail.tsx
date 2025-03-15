import { SendEmail } from "@/lib/SendEmail";
import { RegisterEmailConfirm } from "transactional/emails/RegisterConfirm";
import { getServerIp } from "@/utils/server/getServerIp";

export class ConfirmRegisterEmail {
  async execute(username: string, email: string, confirmToken?: string) {
    const sendEmail = new SendEmail();
    const serverIp = getServerIp();
    const confirmLink = `http://${serverIp}:3000/confirmar/${confirmToken}`;
    const html = await sendEmail.getHtml(
      RegisterEmailConfirm({
        username: username,
        email: email,
        confirmLink: confirmLink,
      })
    );
    await sendEmail.sendEmail(email, "Confirme seu email", html);
  }
}
