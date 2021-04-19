import React from "react";
import {
  LockOutlined,
  StarOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Avatar, Col, Popover, Row, Typography } from "antd";
import { ReduxUser } from "../../../../const";
const { Text } = Typography;

type Props = {
  user: ReduxUser;
};

// Bar that shows information about the user currently logged in to the application. The information dynamically updates based on user action.
function Userbar({ user }: Props) {
  return (
    <Row style={{ padding: "8px", height: "10vh", margin: "2px" }}>
      <Col span={24}>
        <Row align="top" justify="center" style={{}}>
          <Col span={18}>
            <Row align="top" justify="space-between">
              <Col span={24}>
                <Row align="middle" justify="start">
                  <Avatar
                    size={72}
                    style={{
                      backgroundColor: "#FFFFFF",
                      fontSize: "2.5rem",
                      verticalAlign: "middle",
                      border: "4px solid #192A51",
                    }}
                    icon={<UserOutlined style={{ color: "#192A51" }} />}
                  >
                    {user.accountName.substr(0, 1).toUpperCase()}
                  </Avatar>
                  <Row
                    align="middle"
                    justify="center"
                    style={{ padding: "12px" }}
                  >
                    <Col span={24}>
                      <Typography style={{ fontSize: "1.4rem" }}>
                        <Text strong>{user.accountName.toUpperCase()}</Text>
                      </Typography>
                      <Typography style={{ fontSize: "1.2rem" }}>
                        {user.role === "user" && (
                          <Text type="secondary">
                            <i>user</i>
                          </Text>
                        )}
                        {user.role.toString() === "juror" && (
                          <Text type="secondary">Juror</Text>
                        )}
                      </Typography>
                    </Col>
                  </Row>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row
              align="middle"
              justify={user.role === "user" ? "space-between" : "end"}
              style={{ height: "8vh", padding: "12px" }}
            >
              {user.role === "user" && (
                <Popover placement="bottom" key="star" content="Your Rating">
                  <Typography key="star" style={{ fontSize: "1.4rem" }}>
                    <StarOutlined key="star" style={{ padding: "4px" }} />{" "}
                    {user.rating}
                  </Typography>
                </Popover>
              )}
              <Popover
                placement="bottom"
                key="wallet"
                content="Your Available Balance"
              >
                <Typography key="wallet" style={{ fontSize: "1.4rem" }}>
                  <WalletOutlined key="wallet" style={{ padding: "4px" }} />{" "}
                  {parseInt(
                    user.balance.current.toString().slice(0, -4)
                  ).toString() + " DHS"}
                </Typography>
              </Popover>
              {user.role === "user" && (
                <Popover
                  placement="bottom"
                  key="lock"
                  content="Your Locked Balance"
                >
                  <Typography key="lock" style={{ fontSize: "1.4rem" }}>
                    <LockOutlined key="lock" style={{ padding: "4px" }} />
                    {parseInt(
                      user.balance.locked.toString().slice(0, -4)
                    ).toString() + " DHS"}
                  </Typography>
                </Popover>
              )}
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Userbar;
