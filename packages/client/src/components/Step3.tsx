import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { IKrossReservationUser, Room } from "../models/models";
import KrossChipButton from "./KrossChipButton";
import { GlobalContext } from "../contexts/GlobalContext";
import Modal from "./Modal";
import RoomRadioListGroup from "./RoomRadioListGroup";

const BASE_URL = "http://localhost:8080";

export default function Step3() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() < 10 ? `0${now.getMonth()}` : now.getMonth();
  const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();

  const [guestsList, setGuestsList] = useState<IKrossReservationUser[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const { onSelectedGuest } = useContext(GlobalContext);

  const { isLoading } = useQuery("kross", () =>
    fetch(`${BASE_URL}/kross`)
      .then(async (res) => {
        if (res.status === 200) {
          const result = await res.json();
          console.log("[kross] success", result);
          setGuestsList(result.data);
        }
      })
      .catch((error) => console.log("[kross] error", error))
  );

  function onUserSelected(userIndex: number) {
    setGuestsList(
      guestsList.map((guest, index) => {
        if (userIndex === index) {
          guest.is_selected = true;
          onSelectedGuest(guest);
        } else {
          guest.is_selected = false;
        }
        return guest;
      })
    );

    if (guestsList[userIndex].rooms.length > 1) {
      setRooms(guestsList[userIndex].rooms);
    }
  }

  function onRoomSelected(room: Room) {
    const guestIndex = guestsList.findIndex((guest) => guest.is_selected);
    onSelectedGuest({ ...guestsList[guestIndex], rooms: [room] });
  }

  return (
    <>
      <Modal show={Boolean(rooms.length)}>
        <RoomRadioListGroup
          rooms={rooms}
          onRoomIndexSelected={onRoomSelected}
        />
      </Modal>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Informazioni Ospite
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Qui potrai selezionare un ospite, da inserire sul gruppo,
            semplicemente cliccando su di esso. Una volta fatto potrai passare
            alla fase di creazione gruppo Whatsapp.
          </p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div>
              <span className="block font-semibold leading-6 text-gray-900">
                Utenti confermati il {day}/{month}/{year}
              </span>
            </div>
            <div className="flex flex-wrap mt-1 gap-3">
              {isLoading ? (
                <span>Caricando...</span>
              ) : guestsList.length ? (
                guestsList.map((item, index) => (
                  <KrossChipButton
                    key={item.id_reservation}
                    user={item}
                    onUserSelected={() => onUserSelected(index)}
                  />
                ))
              ) : (
                <span>Al momento non ci sono prenotazioni</span>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
