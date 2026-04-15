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

interface CommitmentChargedProps {
  title: string;
  amountDollars: string;
  antiCharity: string;
  dashboardUrl: string;
}

export default function CommitmentCharged({
  title = "Your commitment",
  amountDollars = "$10.00",
  antiCharity = "an anti-charity",
  dashboardUrl = "https://staked.bootstrapquant.com/dashboard",
}: CommitmentChargedProps) {
  return (
    <Html>
      <Head />
      <Preview>You missed your deadline — {amountDollars} charged</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>&#128184; Stake Charged</Heading>
          <Text style={text}>
            You missed the deadline for{" "}
            <strong>&ldquo;{title}&rdquo;</strong>.
          </Text>
          <Text style={text}>
            <strong>{amountDollars}</strong> has been charged and will be
            donated to <strong>{antiCharity}</strong>.
          </Text>
          <Text style={text}>
            It happens. Set a new commitment and come back stronger.
          </Text>
          <Section style={buttonContainer}>
            <Link style={button} href={dashboardUrl}>
              Go to Dashboard
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
