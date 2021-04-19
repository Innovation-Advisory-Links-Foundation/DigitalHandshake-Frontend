import { ReduxActionTypes } from "../const/";

// Redux actions for handling user behaviour.
class UserAction {
  // Set user info.
  static setUser(accountName: string, role: string, rating?: number) {
    return {
      type: ReduxActionTypes.SET_USER,
      accountName,
      role,
      rating,
    };
  }

  // Set user current and locked (escrow) balance.
  static setBalance(current: number, locked?: number) {
    return {
      type: ReduxActionTypes.SET_BALANCE,
      current,
      locked,
    };
  }
}

export default UserAction;
