import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WitnessInviteProps {
  committerName: string;
  title: string;
  stakeDollars: string;
  witnessUrl: string;
}

export default function WitnessInvite({
  committerName = "Someone",
  title = "Their commitment",
  stakeDollars = "$10.00",
  witnessUrl = "https://staked.bootstrapquant.com/witness/abc123",
}: WitnessInviteProps) {
  return (
    <Html>
      <Head />
      <Preview>{committerName} needs you to verify their commitment</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>&#128065; Witness Request</Heading>
          <Text style={text}>
            <strong>{committerName}</strong> has committed to:{" "}
            <strong>&ldquo;{title}&rdquo;</strong>.
          </Text>
          <Text style={text}>
            They have staked <strong>{stakeDollars}</strong>. You have been
            invited to verify their proof when they submit it.
          </Text>
          <Section style={buttonContainer}>
            <Link style={button} href={witnessUrl}>
              View Commitment
            </Link>
          </Section>
          <Text style={footer}>
            &mdash; Staked
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#111",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 24px",
  maxWidth: "480px",
};

const heading = {
  color: "#f59e0b",
  fontSize: "24px",
  fontWeight: "700" as const,
  marginBottom: "24px",
};

const text = {
  color: "#d4d4d4",
  fontSize: "16px",
  lineHeight: "26px",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#f59e0b",
  color: "#000",
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "600" as const,
  textDecoration: "none",
};

const footer = {
  color: "#737373",
  fontSize: "14px",
  marginTop: "32px",
};
