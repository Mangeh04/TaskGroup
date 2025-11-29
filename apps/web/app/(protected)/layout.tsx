import { UserProvider } from "@/context/UserContext";
import { WebSocketProvider } from "@/context/WebSocketContext";
import { getUserServer } from "@/lib/getUserServer";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getUserServer();

	return (
		<UserProvider initialUser={user}>
			<WebSocketProvider>{children}</WebSocketProvider>
		</UserProvider>
	);
}
