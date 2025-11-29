"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useMemo,
	useRef,
} from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

import { useUser } from "./UserContext";
import {
	EVENTS,
	type InviteNotificationPayload,
	type AssignNotificationPayload,
} from "@repo/types";
import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";

type WebSocketContextType = {
	isConnected: boolean;
	socket: Socket | null;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").split("/api")[0];

export const WebSocketProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isConnected, setIsConnected] = useState(false);
	const [socket, setSocket] = useState<Socket | null>(null);

	const retryCountRef = useRef<number>(0);
	const reconnectTimeoutRef = useRef<number | null>(null);

	const connectionStabilityTimeoutRef = useRef<number | null>(null);

	const { user } = useUser();
	const router = useRouter();

	const t = useTranslations("webSocket");

	useEffect(() => {
		if (!user) {
			if (socket) {
				socket.disconnect();
				setSocket(null);
			}
			setIsConnected(false);
			return;
		}

		const newSocket: Socket = io(`${apiUrl}/notification`, {
			transports: ["websocket"],
			withCredentials: true,
			reconnection: false,
		});

		const scheduleReconnection = () => {
			if (reconnectTimeoutRef.current !== null) return;

			if (retryCountRef.current === 0) {
				reconnectTimeoutRef.current = window.setTimeout(() => {
					reconnectTimeoutRef.current = null;
					retryCountRef.current += 1;
					newSocket.connect();
				}, 1000);
			} else {
				toast.error(t("connectionLostToast"), {
					id: "ws-connection-lost",
					description: t("willRetryIn2MinutesToast"),
					duration: 7000,
				});

				reconnectTimeoutRef.current = window.setTimeout(() => {
					reconnectTimeoutRef.current = null;
					newSocket.connect();
				}, 120000);
			}
		};

		newSocket.on("connect", () => {
			setIsConnected(true);

			if (connectionStabilityTimeoutRef.current !== null) {
				window.clearTimeout(connectionStabilityTimeoutRef.current);
			}

			connectionStabilityTimeoutRef.current = window.setTimeout(() => {
				retryCountRef.current = 0;
				connectionStabilityTimeoutRef.current = null;
			}, 4000);

			if (reconnectTimeoutRef.current !== null) {
				window.clearTimeout(reconnectTimeoutRef.current);
				reconnectTimeoutRef.current = null;
			}
		});

		newSocket.on("disconnect", (reason) => {
			setIsConnected(false);

			if (connectionStabilityTimeoutRef.current !== null) {
				window.clearTimeout(connectionStabilityTimeoutRef.current);
				connectionStabilityTimeoutRef.current = null;
			}

			if (reason === "io client disconnect") return;

			scheduleReconnection();
		});

		newSocket.on("connect_error", (err) => {
			console.error("[WS] connect_error:", err.message);
			setIsConnected(false);
			scheduleReconnection();
		});

		newSocket.on(
			EVENTS.PROJECT_INVITED,
			({ projectName, inviterAlias }: InviteNotificationPayload) => {
				toast.info(t("newProjectInvitationToast"), {
					description: `${inviterAlias} ${t(
						"invitedYouToProjectToast",
						{
							projectName,
						}
					)}`,
					action: {
						label: <Eye />,
						onClick: () => router.push("/inbox"),
					},
				});
			}
		);

		newSocket.on(
			EVENTS.TASK_ASSIGNED,
			({
				taskName,
				assignerName,
				projectId,
			}: AssignNotificationPayload) => {
				toast.info(
					t("newTaskAssignedToast", {
						taskTitle: taskName,
					}),
					{
						description: `${assignerName} ${t(
							"assignedYouToTaskToast",
							{
								taskTitle: taskName,
							}
						)}`,
						action: {
							label: <Eye />,
							onClick: () =>
								router.push(
									`/dashboard/projectdetails/${projectId}`
								),
						},
					}
				);
			}
		);

		newSocket.on(EVENTS.AUTH_ERROR, (message: string) => {
			console.error("[WS] AUTH_ERROR:", message);
			toast.error(t("authErrorToast"), { id: "ws-auth-error" });
			newSocket.disconnect();
		});

		setSocket(newSocket);

		return () => {
			if (reconnectTimeoutRef.current)
				window.clearTimeout(reconnectTimeoutRef.current);
			if (connectionStabilityTimeoutRef.current)
				window.clearTimeout(connectionStabilityTimeoutRef.current);
			newSocket.disconnect();
		};
	}, [user, router, t]); // If we add socket here, it creates a loop of new connections DO NOT ADD IT.

	const value = useMemo(
		() => ({ isConnected, socket }),
		[isConnected, socket]
	);

	return (
		<WebSocketContext.Provider value={value}>
			{children}
		</WebSocketContext.Provider>
	);
};

export const useWebSocket = () => {
	const ctx = useContext(WebSocketContext);
	if (!ctx)
		throw new Error("useWebSocket must be used inside WebSocketProvider");
	return ctx;
};
