import { SendEmail } from "@/lib/SendEmail";
import { getServerIp } from "@/utils/server/getServerIp";
import PasswordReset from "@/packages/transactional/emails/ResetPassword";

export class ResetPassword {
  async execute(username: string, email: string, resetToken?: string) {
    const sendEmail = new SendEmail();
    const serverIp = getServerIp();
    const resetLink = `http://${serverIp}:3000/alterar/${resetToken}`;
    const html = await sendEmail.getHtml(
      PasswordReset({
        username: username,
        resetLink: resetLink,
      })
    );
    await sendEmail.sendEmail(email, "Altere sua senha", html);
  }
}
