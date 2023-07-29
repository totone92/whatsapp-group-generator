import { useContext, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Socket } from "socket.io-client";
import { MyDefaultEventsMap } from "../models/models";
import { GlobalContext } from "../contexts/GlobalContext";
import { Player } from "@lottiefiles/react-lottie-player";
import GeneralLoading from "../assets/lotties/loading.json";

interface IStep1 {
  socket: Socket<MyDefaultEventsMap, MyDefaultEventsMap>;
}

export default function Step1({ socket }: IStep1) {
  const [qrCode, setQrCode] = useState("");
  const [authStatus, setAuthStatus] = useState<
    "waiting_db" | "waiting_wa" | "user_authenticated" | "user_disconnected"
  >("waiting_db");

  const { onSetWhatsappAuth } = useContext(GlobalContext);

  useEffect(() => {
    function onMongoDbReady() {
      console.log("mongodb_ready event recieved");
      socket.emit("connected");
      setAuthStatus("waiting_wa");
    }

    function onWaReady(data: any) {
      console.log("whatsapp client is ready", data);
    }

    function onWaQrCode(data: { qr: string }) {
      console.log("whatsapp qrcode", data);
      setQrCode(data.qr);
    }

    function onWaAuthenticationStatus(data: { status: boolean }) {
      console.log("user authentication status", data);
      setAuthStatus(data.status ? "user_authenticated" : "user_disconnected");
      onSetWhatsappAuth(data.status);
      setQrCode("");
    }

    socket.on("wa_ready", onWaReady);
    socket.on("wa_qrcode", onWaQrCode);
    socket.on("mongodb_ready", onMongoDbReady);
    socket.on("wa_authentication_status", onWaAuthenticationStatus);

    return () => {
      socket.off("wa_ready", onWaReady);
      socket.off("wa_qrcode", onWaQrCode);
      socket.off("mongodb_ready", onMongoDbReady);
      socket.off("wa_authentication_status", onWaAuthenticationStatus);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Connessione a Whatsapp
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Qui potrai loggarti con il tuo account Whatsapp. Una volta autenticato
          la tua connessione sarà permanente.
        </p>
      </div>

      <form className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          {qrCode.length ? (
            <div
              style={{
                height: "auto",
                margin: "0 auto",
                maxWidth: 256,
                width: "100%",
              }}
            >
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={qrCode}
                viewBox={`0 0 256 256`}
              />
            </div>
          ) : authStatus === "waiting_db" ? (
            <div className="flex justify-center items-center">
              <Player
                autoplay
                loop
                src={GeneralLoading}
                className="w-20 h-20"
              ></Player>
            </div>
          ) : authStatus === "waiting_wa" ? (
            <div className="flex justify-center">
              <span>Creando l'istanza di Whatsapp...</span>
            </div>
          ) : authStatus === "user_authenticated" ? (
            <div className="flex justify-center">
              <span>Utente autenticato correttamente 🎉</span>
            </div>
          ) : authStatus === "user_disconnected" ? (
            <div className="flex justify-center">
              <span>Utente disconnesso</span>
            </div>
          ) : undefined}
        </div>
      </form>
    </div>
  );
}
