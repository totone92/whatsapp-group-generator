import { useContext, useEffect, useState } from "react";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import { GlobalContext } from "./contexts/GlobalContext";
import { toast } from "react-hot-toast";
import { ELocalStoragekeys } from "./models/types";
import { Player } from "@lottiefiles/react-lottie-player";
import Modal from "./components/Modal";
import GeneralLoading from "./assets/lotties/loading.json";
import { socket } from "./utils/socket";

function App() {
  const {
    state: { favouriteUsers, isAuthenticatedWithWhatsapp, selectedGuest },
    onAddFavouriteUsers,
  } = useContext(GlobalContext);

  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    function onConnect() {
      setIsSocketConnected(true);
    }

    function onDisconnect() {
      setIsSocketConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    const _members = localStorage.getItem(
      ELocalStoragekeys.GET_FAVOURITE_MEMBERS
    );

    if (_members) {
      onAddFavouriteUsers(JSON.parse(_members));
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (isSocketConnected) {
      toast.success("Socket connected!");
    } else {
      //toast.error("Socket disconnected");
    }
  }, [isSocketConnected]);

  function onCreateGroup(groupName: string) {
    if (
      !groupName.length &&
      !favouriteUsers.length &&
      !isAuthenticatedWithWhatsapp &&
      !selectedGuest
    ) {
      toast.error("Prima devi completare tutti gli step richiesti!");
      return;
    }

    if (!groupName.length) {
      toast.error("Inserisci un nome di un gruppo valido!");
      return;
    }

    if (!favouriteUsers.length) {
      toast.error(
        "Devi inserire almeno un utente facente parte della tua organizzazione!"
      );
      return;
    }

    if (!isAuthenticatedWithWhatsapp) {
      toast.error(
        "Devi prima autenticarti con WhatsApp scannerizzando il QRCode mostrato in cima!"
      );
      return;
    }

    if (!selectedGuest) {
      toast.error("Seleziona un ospite per poter creare un gruppo con lui");
      return;
    }

    setShowLoading(true);

    socket.emit("create-wa-group", {
      groupName,
      adminList: favouriteUsers,
      guestInfo: selectedGuest,
      /* guestInfo: {
        ...selectedGuest,
        phone: "+393403743354",
        label: "Marco Dolciami",
      }, */
    });

    socket.on("wa_group", (res) => {
      console.log("whatsapp group status", res);

      setShowLoading(false);

      if (res.created) {
        toast.success("Gruppo WhatsApp creato correttamente!");
      } else {
        toast.error("Errore durante la creazione del gruppo.");
      }
    });
  }

  return (
    <>
      <Modal show={showLoading} backdropDismiss={false}>
        <div className="flex flex-col items-center text-center">
          <div>
            <span className="font-bold text-lg">
              Creando il gruppo WhatsApp...
            </span>
          </div>
          <Player autoplay loop src={GeneralLoading}></Player>
        </div>
      </Modal>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-10 divide-y divide-gray-900/10">
          <Step1 socket={socket} />
          <Step2 />
          <Step3 />
          <Step4 onCreateGroup={onCreateGroup} />
        </div>
      </div>
    </>
  );
}

export default App;
