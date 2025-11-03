import { Container, Hr, Section, Text } from "@react-email/components";
import { Logo } from "./logo";

export function Footer() {
	return (
		<Container>
			<Section>
				<Hr />

				<Logo />
				<Text>
					<strong>ACME.com</strong>
				</Text>
			</Section>
		</Container>
	);
}
