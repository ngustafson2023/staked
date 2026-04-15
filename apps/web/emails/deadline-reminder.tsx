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

interface DeadlineReminderProps {
  title: string;
  hoursLeft: number;
  stakeDollars: string;
  commitmentUrl: string;
}

export default function DeadlineReminder({
  title = "Your commitment",
  hoursLeft = 24,
  stakeDollars = "$10.00",
  commitmentUrl = "https://staked.bootstrapquant.com/dashboard",
}: DeadlineReminderProps) {
  return (
    <Html>
      <Head />
      <Preview>Your deadline is coming up: {title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>&#9200; Deadline Approaching</Heading>
          <Text style={text}>
            Your commitment <strong>&ldquo;{title}&rdquo;</strong> is due in{" "}
            <strong>{hoursLeft} hours</strong>.
          </Text>
          <Text style={text}>
            You have <strong>{stakeDollars}</strong> on the line. Don&apos;t let
            it slip.
          </Text>
          <Section style={buttonContainer}>
            <Link style={button} href={commitmentUrl}>
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
