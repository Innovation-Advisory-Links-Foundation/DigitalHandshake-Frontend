import React, { useEffect, useState } from "react";
import { EosioService } from "../../services";
import { Typography, Row, Col, message } from "antd";
import LoginCarousel from "./components/LoginCarousel";
import LoginForm from "./components/LoginForm";
import DHSLogo from "../../assets/logob.png";

const { Text } = Typography;

type Props = {
  onHandleLogin: (accountName: string) => void;
};

// Handles the login form.
function Login({ onHandleLogin }: Props) {
  // Form fields.
  const [accountNameInput, setAccountNameInput] = useState<string>(""); // The input field for the EOSIO account name.
  const [privateKeyInput, setPrivateKeyInput] = useState<string>(""); // The input field for the user private key.
  const [passwordInput, setPasswordInput] = useState<string>(""); // The input field for the user password.
  const [onlyPassword, setOnlyPassword] = useState<boolean>(false); // A flag for checking if the user has already logged in.

  // Handle form inputs changes.
  const handleFormChanges = (event: any) => {
    // Get input field name and value.
    const { name, value } = event.target;

    switch (name) {
      case "accountName":
        setAccountNameInput(value);
        break;
      case "privateKey":
        setPrivateKeyInput(value);
        break;
      case "password":
        setPasswordInput(value);
        break;
    }
  };

  // Handle form submission callback.
  const handleFormSubmit = async () => {
    try {
      // Checks if the user/juror is doing the login for the first time or not.
      if (
        !localStorage.getItem("user_eosio_account_name") &&
        !localStorage.getItem("user_password_hash") &&
        !localStorage.getItem("user_encrypted_private_key")
      ) {
        // First time login.
        await EosioService.login(
          passwordInput,
          accountNameInput,
          privateKeyInput
        );
      } else {
        // The user was already logged in.
        await EosioService.login(passwordInput);
      }

      // Retrieve account name (necessary for user "re-login").
      const userAccountName = !accountNameInput
        ? localStorage.getItem("user_eosio_account_name") || ""
        : accountNameInput;

      // Call handle login callback.
      onHandleLogin(userAccountName);

      message.success("You have successfully logged in.");

      setTimeout(() => {
        setOnlyPassword(true);
      }, 1000);
    } catch (error) {
      console.error(error);
      message.error(error);
      throw error;
    }
  };

  // Handle logout.
  const handleLogout = () => {
    // Clean up storage.
    localStorage.removeItem("user_eosio_account_name");
    localStorage.removeItem("user_password_hash");
    localStorage.removeItem("user_encrypted_private_key");

    message.success("You have successfully disconnected from the application.");

    setOnlyPassword(false);
  };

  useEffect(() => {
    // Read the storage for checking if the user/juror has already logged in or not.
    if (
      localStorage.getItem("user_eosio_account_name") &&
      localStorage.getItem("user_password_hash") &&
      localStorage.getItem("user_encrypted_private_key")
    )
      setOnlyPassword(true);
  }, []);

  return (
    <Row style={{ padding: "12px" }}>
      <Col span={12}>
        <LoginCarousel />
      </Col>
      <Col span={12}>
        <Row align="middle" justify="center" style={{ height: "96vh" }}>
          <Col span={24}>
            <Typography style={{ textAlign: "center", padding: "12px" }}>
              <Typography style={{ marginBottom: "16px" }}>
                <img src={DHSLogo} alt="DHS Logo" style={{ width: "512px" }} />
              </Typography>
              <Text style={{ fontSize: "1.1rem" }}>
                {" "}
                🤝 A platform for making digital handshakes guaranteeing
                transparency on identity, code and payments 🤝{" "}
              </Text>
            </Typography>
          </Col>
          <Col span={12}>
            {!onlyPassword ? (
              <LoginForm
                accountName={accountNameInput}
                privateKey={privateKeyInput}
                password={passwordInput}
                onHandleFormSubmit={handleFormSubmit}
                onHandleFormChanges={handleFormChanges}
                onlyPassword={onlyPassword}
              />
            ) : (
              <LoginForm
                accountName={
                  localStorage.getItem("user_eosio_account_name") || ""
                }
                privateKey={privateKeyInput}
                password={passwordInput}
                onHandleFormSubmit={handleFormSubmit}
                onHandleFormChanges={handleFormChanges}
                onHandleLogout={handleLogout}
                onlyPassword={onlyPassword}
              />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Login;
