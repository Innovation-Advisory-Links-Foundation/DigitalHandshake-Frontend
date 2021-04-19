import { ReduxActionTypes } from "../const";

// Handles Redux actions.
export default function (
  state = {
    accountName: "",
    role: "",
    rating: 0,
    balance: { current: 0, locked: 0 },
  },
  action: any
) {
  // Switch for action type.
  switch (action.type) {
    case ReduxActionTypes.SET_USER: {
      return Object.assign({}, state, {
        accountName:
          typeof action.accountName === "undefined"
            ? state.accountName
            : action.accountName,
        role: action.role,
        rating: action.rating,
      });
    }

    case ReduxActionTypes.SET_BALANCE: {
      return Object.assign({}, state, {
        balance: {
          current: action.current,
          locked: action.locked,
        },
      });
    }

    default:
      return state;
  }
}
