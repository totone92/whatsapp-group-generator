import { IFavouriteMember, IKrossReservationUser } from "./models";

/* Types for GlobalContext */
export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  AddFavouriteUsers = "ADD_FAVOURITE_USERS",
  AddSelectedGuest = "ADD_SELECTED_GUEST",
  IsAuthenticatedWithWhatsapp = "IS_AUTHENTICATED_WITH_WHATSAPP",
}

export type StateType = {
  favouriteUsers: IFavouriteMember[];
  isAuthenticatedWithWhatsapp: boolean;
  selectedGuest?: IKrossReservationUser;
};
/**************************/

export enum ELocalStoragekeys {
  GET_FAVOURITE_MEMBERS = "GET_FAVOURITE_MEMBERS",
  SET_FAVOURITE_MEMBERS = "GET_FAVOURITE_MEMBERS",
}
