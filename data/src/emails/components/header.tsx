import { Container, Section } from "@react-email/components";
import { Logo } from "./logo";

export function Header() {
	return (
		<Container>
			<Section className="mb-8">
				<Logo />
			</Section>
		</Container>
	);
}
