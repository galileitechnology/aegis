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

interface RegisterConfirmProps {
  username?: string;
  email?: string;
  confirmLink?: string;
}

export const RegisterEmailConfirm = ({
  username,
  email,
  confirmLink,
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
              Clique no botão abaixo para completar seu cadastro
            </Text>
            <Section className="text-center mt-5 mb-5">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={confirmLink}
              >
                Clique para confirmar
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px] text-center">
              ou copie e cole o link no seu navegador:{" "}
              <Link href={confirmLink} className="text-blue-600 no-underline">
                {confirmLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
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

RegisterEmailConfirm.PreviewProps = {
  username: "rodrigotutz",
  email: "rodrigoantunestutz@gmail.com",
  confirmLink: "http://localhost:3000/confirmar",
} as RegisterConfirmProps;

export default RegisterEmailConfirm;
