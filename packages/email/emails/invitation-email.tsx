import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Tailwind,
  Text
} from "@react-email/components";

interface Props {
  username?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  teamName?: string;
  inviteLink?: string;
}

export default function InvitationEmail({
  username,
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Inklate password. Clicking the link bellow.</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-10 max-w-[465px] rounded-md border border-solid border-[#eaeaea] px-5 py-3">
            <Heading className="my-5 text-center text-[24px] font-normal">
              Join <strong>{invitedByUsername}</strong> on <strong>Inklate</strong>
            </Heading>
            <Text>
              Hello <strong>{username}</strong>,
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{invitedByUsername}</strong> (
              <Link href={`mailto:${invitedByEmail}`} className="text-blue-600 no-underline">
                {invitedByEmail}
              </Link>
              ) has invited you to the <strong>{teamName}</strong> team on <strong>Inklate</strong>.
            </Text>

            <Button
              className="block rounded-md bg-blue-800 px-5 py-3 text-center text-[13px] text-white"
              href={inviteLink}
            >
              Join the team
            </Button>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invitation was intended for <span className="text-black">{username}</span>. If
              you were not expecting this invitation, you can ignore this email.
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

InvitationEmail.PreviewProps = {
  username: "Praveen",
  invitedByUsername: "John Doe",
  invitedByEmail: "john.doe@example.com",
  teamName: "Acme Inc.",
  inviteLink: "https://example.com/invite-link"
} as Props;
