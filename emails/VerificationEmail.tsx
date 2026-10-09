import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text
} from 'react-email';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return(
        <Html lang="en" dir='ltr'>
            <Head>
                <title>Verification code</title>
                <Font fontFamily="Roboto" fallbackFontFamily="Verdana" webFont={{
                    url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
                    format: "woff2"
                }}
                fontWeight={400}
                fontStyle='normal' />
            </Head>
            <Preview>Here is your verification code: {otp}</Preview>
            <Section>
                <Row>
                    <Heading as='h2'>Hello {username}</Heading>
                </Row>
                <Row>
                    <Text>
                        Thank you for your registration. Please use the following verification code to complete your registration.
                    </Text>
                </Row>
                <Row>
                    <Text>
                        {otp}
                    </Text>
                </Row>
                <Row>
                    <Text>
                        If you did not create an account with us, please ignore this email.
                    </Text>
                </Row>
            </Section>
        </Html>
    )
}