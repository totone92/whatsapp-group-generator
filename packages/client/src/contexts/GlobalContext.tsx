import { ReactElement, createContext, useCallback, useReducer } from "react";
import { ActionMap, StateType, Types } from "../models/types";
import { IFavouriteMember, IKrossReservationUser } from "../models/models";

const initState: StateType = {
  favouriteUsers: [],
  isAuthenticatedWithWhatsapp: false,
  selectedGuest: undefined,
};

type GlobalPayload = {
  [Types.AddFavouriteUsers]: IFavouriteMember[];
  [Types.AddSelectedGuest]: IKrossReservationUser;
  [Types.IsAuthenticatedWithWhatsapp]: boolean;
};

type ReducerAction = ActionMap<GlobalPayload>[keyof ActionMap<GlobalPayload>];

const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case Types.IsAuthenticatedWithWhatsapp:
      return {
        ...state,
        isAuthenticatedWithWhatsapp: action.payload,
      };

    case Types.AddFavouriteUsers:
      return {
        ...state,
        favouriteUsers: action.payload,
      };

    case Types.AddSelectedGuest:
      return { ...state, selectedGuest: action.payload };

    default:
      throw new Error();
  }
};

const useGlobalContext = (initState: StateType) => {
  const [state, dispatch] = useReducer(reducer, initState);

  const onAddFavouriteUsers = useCallback(
    (usersList: IFavouriteMember[]) =>
      dispatch({
        type: Types.AddFavouriteUsers,
        payload: usersList,
      }),
    []
  );

  const onSelectedGuest = useCallback(
    (guest: IKrossReservationUser) =>
      dispatch({ type: Types.AddSelectedGuest, payload: guest }),
    []
  );

  const onSetWhatsappAuth = useCallback(
    (status: boolean) =>
      dispatch({ type: Types.IsAuthenticatedWithWhatsapp, payload: status }),
    []
  );

  return { state, onAddFavouriteUsers, onSelectedGuest, onSetWhatsappAuth };
};

type UseGlobalContextType = ReturnType<typeof useGlobalContext>;

const initContextState: UseGlobalContextType = {
  state: initState,
  onAddFavouriteUsers: () => {},
  onSelectedGuest: () => {},
  onSetWhatsappAuth: () => {},
};

export const GlobalContext =
  createContext<UseGlobalContextType>(initContextState);

type ChildrenType = {
  children?: ReactElement | ReactElement[] | undefined;
};

export const GlobalProvider = ({ children }: ChildrenType): ReactElement => {
  return (
    <GlobalContext.Provider value={useGlobalContext(initState)}>
      {children}
    </GlobalContext.Provider>
  );
};
