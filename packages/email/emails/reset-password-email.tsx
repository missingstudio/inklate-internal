import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Tailwind,
  Text
} from "@react-email/components";

interface Props {
  url: string;
  name: string;
}

export default function ResetPasswordEmail({ url, name }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Inklate password. Clicking the link bellow.</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-10 max-w-[465px] rounded-md border border-solid border-[#eaeaea] px-5 py-3">
            <Heading className="my-5 text-center text-[24px] font-normal">
              Reset your <strong>Inklate</strong> password
            </Heading>
            <Text>
              Hello <strong>{name}</strong>,
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              We received a request to reset your password for your Inklate account. If you didn't
              make this request, you can safely ignore this email.
            </Text>

            <Button
              className="block rounded-md bg-blue-800 px-5 py-3 text-center text-[13px] text-white"
              href={url}
            >
              Reset Password
            </Button>
            <Text>
              Or, you can copy and paste the link below into your browser:
              <br />
              <Link href={url} className="break-all text-blue-700 no-underline">
                {url}
              </Link>
            </Text>
            <Text>
              Cheers,
              <br />
              Praveen from Inklate
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ResetPasswordEmail.PreviewProps = {
  url: "http://localhost:3000/auth/verify-email?token=1234567890&callbackURL=/",
  name: "John Doe"
} as Props;
