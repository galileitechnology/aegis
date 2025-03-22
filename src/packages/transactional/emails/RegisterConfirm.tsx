import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface RegisterConfirmProps {
  username?: string;
  email?: string;
  confirmCode?: string;
}

export const RegisterEmailConfirm = ({
  username,
  email,
  confirmCode,
}: RegisterConfirmProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black font-bold text-[24px] text-center p-0 my-[30px] mx-0">
              Complete seu cadastro
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Olá {username},
            </Text>

            <Text>
              Recentemente recebemos a solicitação de registro do e-mail{" "}
              <strong>{email}</strong> no nosso sistema.
            </Text>
            <Text className="text-center text-lg">
              Esse é o seu código de confirmação
            </Text>
            <Text className="text-center text-2xl font-bold">
              {confirmCode}
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
              Esse e-mail foi enviado para{" "}
              <span className="text-black">{username}</span> caso não tenha
              solicitado cadastro, por favor ignore esse email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default RegisterEmailConfirm;
