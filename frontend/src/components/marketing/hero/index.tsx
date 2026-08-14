import { Header } from "./header"; // @efferd/header-3
import { HeroSection } from "./hero";
import { LogosSection } from "./logos-section";

export default function page() {
	return (
		<>
			<Header />
			<main className="grow">
				<HeroSection />
				<LogosSection />
			</main>
		</>
	);
}
