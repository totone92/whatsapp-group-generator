import { io } from "socket.io-client";

const BASE_URL = "http://localhost:8080";

export const socket = io(BASE_URL, { autoConnect: false });

socket.connect();
