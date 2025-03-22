import { SendEmail } from "@/lib/SendEmail";
import { RegisterEmailConfirm } from "transactional/emails/RegisterConfirm";
import { getServerIp } from "@/utils/server/getServerIp";

export class ConfirmRegisterEmail {
  async execute(username: string, email: string, confirmCode?: string) {
    const sendEmail = new SendEmail();
    const html = await sendEmail.getHtml(
      RegisterEmailConfirm({
        username: username,
        email: email,
        confirmCode: confirmCode,
      })
    );
    await sendEmail.sendEmail(email, "Confirme seu email", html);
  }
}
