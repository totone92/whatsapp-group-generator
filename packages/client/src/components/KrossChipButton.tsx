import { TrashIcon } from "@heroicons/react/24/outline";
import { IKrossReservationUser } from "../models/models";

interface IChipButton {
  user: IKrossReservationUser;
  onUserSelected: () => void;
}

export default function KrossChipButton({ user, onUserSelected }: IChipButton) {
  function getUserInitials() {
    const _splittedUserName = user.label.split(" ");
    if (_splittedUserName.length === 1) {
      return `${_splittedUserName[0].substring(0, 1).toUpperCase()}`;
    } else {
      return `${_splittedUserName[0]
        .substring(0, 1)
        .toUpperCase()}${_splittedUserName[1].substring(0, 1).toUpperCase()}`;
    }
  }

  return (
    <div
      onClick={onUserSelected}
      className={`${
        user.is_selected ? "bg-indigo-600" : "bg-gray-100"
      } cursor-pointer flex items-center rounded-md space-x-2 w-fit p-2`}
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-500">
        <span className="text-[10px] font-medium leading-none text-white">
          {getUserInitials()}
        </span>
      </span>
      <div
        className={`flex flex-col leading-none ${
          user.is_selected ? "text-white" : "text-black"
        }`}
      >
        <div className="flex gap-x-1">
          {user.label.split(" ").map((name, index) => (
            <span className="text-sm capitalize" key={index}>
              {name}
            </span>
          ))}
        </div>
        <span className="text-[10px] font-medium truncate">
          {user.date_reservation}
        </span>
      </div>
    </div>
  );
}
