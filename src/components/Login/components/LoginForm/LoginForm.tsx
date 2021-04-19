import React, { useEffect, useState } from "react";
import { Form, Button, Input, Popconfirm, Typography } from "antd";
import {
  UserOutlined,
  KeyOutlined,
  LockOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Footer } from "../../..";

type Props = {
  accountName: string;
  privateKey: string;
  password: string;
  onHandleFormSubmit: () => void;
  onHandleFormChanges: (event: any) => void;
  onHandleLogout?: () => void;
  onlyPassword: boolean;
};

// Columns layout dimensions.
const colDims = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

// Input fields for handling and capturing the user login.
function LoginForm(props: Props) {
  const [form] = Form.useForm(); // Form element.

  const [buttonLoading, setButtonLoading] = useState<boolean>(false); // Button loader.

  useEffect(() => {
    setTimeout(() => {
      setButtonLoading(false);
    }, 2000);
  }, [buttonLoading == true]);

  // Manages the reset of fields when the user/juror wants to restore the forgotten password.
  const onReset = () => {
    form.resetFields();

    if (props.onHandleLogout) props.onHandleLogout();
  };

  // Handles the form submission.
  const onSubmit = () => {
    setButtonLoading(true);
    setTimeout(() => {
      props.onHandleFormSubmit();
    }, 2000);
  };

  return (
    <>
      <Form
        form={form}
        name="form"
        onFinish={onSubmit}
        initialValues={{ remember: true }}
        layout="vertical"
        {...colDims}
      >
        {!props.onlyPassword ? (
          <>
            <Form.Item
              label="EOSIO Account Name"
              name="accountName"
              rules={[
                {
                  required: true,
                  message: "Please input your EOSIO account name.",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                value={props.accountName}
                name="accountName"
                onChange={props.onHandleFormChanges}
                placeholder="e.g. eosio / user123"
                pattern="[\.a-z1-5]{2,12}"
              />
            </Form.Item>
            <Form.Item
              label="Private Key"
              name="privateKey"
              rules={[
                { required: true, message: "Please input your private key." },
              ]}
            >
              <Input.Password
                prefix={<KeyOutlined className="site-form-item-icon" />}
                name="privateKey"
                value={props.privateKey}
                onChange={props.onHandleFormChanges}
                pattern="[\.a-zA-Z1-9]{51}"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password." },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                name="password"
                value={props.password}
                onChange={props.onHandleFormChanges}
                minLength={6}
              />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password." },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                name="password"
                value={props.password}
                onChange={props.onHandleFormChanges}
                minLength={6}
              />
            </Form.Item>
            <Form.Item style={{ alignContent: "right" }}>
              <Popconfirm
                placement="topRight"
                title={
                  "This operation involves re-entering your username and key"
                }
                onConfirm={onReset}
                okText="Continue"
                cancelText="Cancel"
              >
                <Typography
                  style={{
                    textAlign: "right",
                    padding: "4px",
                    color: "#0E182F",
                  }}
                >
                  <i>Forgot Password?</i>
                </Typography>
              </Popconfirm>
            </Form.Item>
          </>
        )}
        <Form.Item style={{ alignContent: "center", padding: "16px" }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            shape="round"
            icon={<LoginOutlined />}
            loading={buttonLoading}
          >
            LOGIN
          </Button>
        </Form.Item>
      </Form>
      <Footer />
    </>
  );
}

export default LoginForm;
