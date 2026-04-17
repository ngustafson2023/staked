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

export default function ProUpgrade() {
  return (
    <Html>
      <Head />
      <Preview>You're now on Staked Pro</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>You&apos;re now on Staked Pro 🎉</Heading>
          <Text style={text}>
            Thanks for upgrading. Here&apos;s what you&apos;ve unlocked:
          </Text>

          <Text style={featureText}>&#10003; Unlimited commitments</Text>
          <Text style={featureText}>&#10003; Up to $5,000 stake</Text>
          <Text style={featureText}>&#10003; Public accountability pages</Text>
          <Text style={featureText}>&#10003; Recurring commitments</Text>
          <Text style={featureText}>&#10003; Witness system</Text>

          <Section style={buttonContainer}>
            <Link
              style={button}
              href="https://staked.bootstrapquant.com/commitments/new"
            >
              Start a Pro Commitment
            </Link>
          </Section>

          <Text style={text}>
            Manage your subscription anytime from your{" "}
            <Link style={link} href="https://staked.bootstrapquant.com/billing">
              billing page
            </Link>
            .
          </Text>

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

const featureText = {
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

const link = {
  color: "#dc2626",
};

const footer = {
  color: "#737373",
  fontSize: "14px",
  marginTop: "32px",
};
