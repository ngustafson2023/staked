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

export default function Welcome() {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Staked — here's how to make your first commitment</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome to Staked</Heading>
          <Text style={text}>
            You just took the first step toward actually hitting your deadlines.
            Here&apos;s how it works:
          </Text>

          <Text style={stepText}>
            <strong>1. Create a commitment</strong> — Write down exactly what
            you&apos;ll deliver.
          </Text>
          <Text style={stepText}>
            <strong>2. Set a deadline</strong> — Pick a realistic date. No
            extensions.
          </Text>
          <Text style={stepText}>
            <strong>3. Stake real money</strong> — $25 is a good start. Enough
            to feel it.
          </Text>
          <Text style={stepText}>
            <strong>4. Prove completion</strong> — Submit proof before your
            deadline hits.
          </Text>

          <Text style={text}>
            If you complete on time, your money stays safe. If you miss your
            deadline, your stake goes to an anti-charity — an organization you
            disagree with. That&apos;s the motivation.
          </Text>

          <Section style={buttonContainer}>
            <Link
              style={button}
              href="https://staked.bootstrapquant.com/commitments/new"
            >
              Create Your First Commitment
            </Link>
          </Section>

          <Text style={footer}>
            Staked &middot; support@bootstrapquant.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#111",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 24px",
  maxWidth: "480px",
};

const heading = {
  color: "#dc2626",
  fontSize: "24px",
  fontWeight: "700" as const,
  marginBottom: "24px",
};

const text = {
  color: "#d4d4d4",
  fontSize: "16px",
  lineHeight: "26px",
};

const stepText = {
  color: "#d4d4d4",
  fontSize: "16px",
  lineHeight: "26px",
  marginTop: "4px",
  marginBottom: "4px",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#dc2626",
  color: "#fff",
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
