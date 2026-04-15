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

interface CommitmentCompletedProps {
  title: string;
  amountDollars: string;
  streak: number;
  dashboardUrl: string;
}

export default function CommitmentCompleted({
  title = "Your commitment",
  amountDollars = "$10.00",
  streak = 1,
  dashboardUrl = "https://staked.bootstrapquant.com/dashboard",
}: CommitmentCompletedProps) {
  return (
    <Html>
      <Head />
      <Preview>You did it! Commitment complete</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>&#127881; You Did It!</Heading>
          <Text style={text}>
            You completed{" "}
            <strong>&ldquo;{title}&rdquo;</strong>.
          </Text>
          <Text style={text}>
            <strong>{amountDollars}</strong> stays in your pocket.
          </Text>
          {streak > 1 && (
            <Text style={streakText}>
              &#128293; You&apos;re on a {streak}-commitment streak!
            </Text>
          )}
          <Section style={buttonContainer}>
            <Link style={button} href={dashboardUrl}>
              Set a New Commitment
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

const streakText = {
  color: "#f59e0b",
  fontSize: "18px",
  fontWeight: "600" as const,
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
