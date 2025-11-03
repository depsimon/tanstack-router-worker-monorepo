import {
	Body,
	Container,
	Head,
	Html,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import type { User } from "../models/user";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

interface EmailTemplateProps {
	user: User;
}

export default function Registration({ user }: EmailTemplateProps) {
	return (
		<Tailwind>
			<Html className="font-sans">
				<Head />
				<Body>
					<Preview>Welcome to ACME.com</Preview>
					<Header />
					<Container>
						<Section>
							<Row>
								<Text>Hi {user.name},</Text>
								<Text>
									Welcome to ACME.com, the monorepo that connects Tanstack
									Route, Cloudflare Worker, D1, KV, Queues, Resend and more!
								</Text>
							</Row>
						</Section>
					</Container>
					<Footer />
				</Body>
			</Html>
		</Tailwind>
	);
}

Registration.PreviewProps = {
	user: {
		id: "user-id",
		email: "john@example.com",
		name: "John Doe",
		banned: false,
		banReason: null,
		banExpires: null,
		image: null,
		role: null,
		emailVerified: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
} satisfies EmailTemplateProps;
