import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Login } from "../../components";
import { UserAction } from "../../actions";
import { EosioService } from "../../services";
import { Spin } from "antd";
import Main from "../Main";

interface RootState {
  user: {
    accountName: string;
  };
}

// Pass the Redux state as props.
const mapStateToProps = (state: RootState) => state;

// Pass the Redux actions as props.
const mapDispatchToProps = {
  setUser: UserAction.setUser,
  setBalance: UserAction.setBalance,
};

// Export a Redux connected component.
const connector = connect(mapStateToProps, mapDispatchToProps);

// Get props from Redux.
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

// Handles user access to the dApp.
function App({ user, setUser, setBalance }: Props) {
  const [loading, setLoading] = useState<boolean>(true); // Spin page loader.

  // Handles the login (both for users and jurors).
  const handleLogin = async (accountName: string) => {
    // Read blockchain for checking if the account name belongs to a user or a juror.
    const userInfo = await EosioService.getUserInfoByAccountName(accountName);
    const jurorInfo = await EosioService.getJurorInfoByAccountName(accountName);
    const userBalance = await EosioService.getCurrentBalance(accountName);
    const userLockedBalance = await EosioService.getCurrentLockedBalance(
      accountName
    );

    // User
    if (userInfo.length > 0) setUser(accountName, "user", userInfo[0].rating);

    // Juror
    if (jurorInfo.length > 0) setUser(accountName, "juror");

    setBalance(
      userBalance ? userBalance.balance : "0.0000 DHS",
      userLockedBalance.length > 0 ? userLockedBalance[0].funds : "0.0000 DHS"
    );
  };

  // Retrieve the user account name from the local storage and dispatches a redux SET_USER action.
  useEffect(() => {
    (async () => {
      if (!sessionStorage.getItem("private_key")) {
        setLoading(false);
        return;
      }

      // Verify account name.
      const accountName = localStorage.getItem("user_eosio_account_name") || "";

      if (!accountName)
        throw "Missing information in the local memory of the device";

      // Read blockchain for checking if the account name belongs to a user or a juror.
      const userInfo = await EosioService.getUserInfoByAccountName(accountName);
      const jurorInfo = await EosioService.getJurorInfoByAccountName(
        accountName
      );

      // Retrieve user balance from blockchain.
      const userBalance = await EosioService.getCurrentBalance(accountName);

      // Retrieve user locked balance from blockchain.
      const userLockedBalance = await EosioService.getCurrentLockedBalance(
        accountName
      );

      // Dispatch actions.
      if (userInfo.length > 0) setUser(accountName, "user", userInfo[0].rating);

      if (jurorInfo.length > 0) setUser(accountName, "juror");

      setBalance(
        userBalance ? userBalance.balance : "0.0000 DHS",
        userLockedBalance.length > 0 ? userLockedBalance[0].funds : "0.0000 DHS"
      );

      setTimeout(() => {
        setLoading(false);
      }, 2000);
    })();
  }, []);

  return (
    <>
      {loading && (
        <Spin
          size="large"
          tip={"Loading..."}
          style={{
            marginLeft: "45vw",
            padding: "16px 50px",
            textAlign: "center",
          }}
        />
      )}
      {!loading && user.accountName && <Main />}
      {!loading && !user.accountName && <Login onHandleLogin={handleLogin} />}
    </>
  );
}

export default connector(App);
