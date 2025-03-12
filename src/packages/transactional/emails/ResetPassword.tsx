import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordProps {
  username?: string;
  resetLink?: string;
}

export const PasswordReset = ({ username, resetLink }: ResetPasswordProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black font-bold text-[24px] text-center p-0 my-[30px] mx-0">
              Altere sua senha
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Olá {username},
            </Text>

            <Text>
              Recentemente recebemos a solicitação de alteração de senha no
              nosso sistema.
            </Text>
            <Text className="text-center text-lg">
              Clique no botão abaixo para alterar sua senha
            </Text>
            <Section className="text-center mt-5 mb-5">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={resetLink}
              >
                Clique para confirmar
              </Button>
            </Section>
            <Text className="text-center">
              ou copie e cole o link no seu navegador:{" "}
            </Text>
            <Text className="text-black text-[14px] leading-[24px] text-center">
              <Link href={resetLink} className="text-blue-600 no-underline">
                {resetLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Esse e-mail foi enviado para{" "}
              <span className="text-black">{username}</span> caso não tenha
              solicitado a alteração, por favor ignore esse email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
export default PasswordReset;
