import React from "react";
import { Menu, Popconfirm, Typography } from "antd";
import { Link } from "react-router-dom";
import "./Navbar.less";
import { ReduxUser } from "../../../../../../const";
import DHSLogo from "../../../../../../assets/logow.png";

type Props = {
  user: ReduxUser;
  onHandleLogout: () => void;
};

// Bar for navigation in the different pages of the application.
function Navbar({ user, onHandleLogout }: Props) {
  return (
    <nav className="menuBar">
      <div className="logo">
        <Typography>
          <img
            src={DHSLogo}
            alt="DHS Logo"
            style={{ width: "256px", padding: "8px" }}
          />
        </Typography>
      </div>
      <div className="menuCon">
        <div className="rightMenu">
          <Menu mode={"horizontal"} theme={"dark"}>
            {user.role === "user" ? (
              <>
                <Menu.Item key="explore">
                  <Link to="explore">Explore</Link>
                </Menu.Item>
                <Menu.Item key="requests">
                  <Link to="requests">Your Requests</Link>
                </Menu.Item>
                <Menu.Item key="handshakes">
                  <Link to="handshakes">Your Handshakes</Link>
                </Menu.Item>
              </>
            ) : (
              <Menu.Item key="disputes">
                <Link to="explore">Your Disputes</Link>
              </Menu.Item>
            )}
            <Menu.Item key="logout">
              <Popconfirm
                placement="topRight"
                title="Are you sure?"
                onConfirm={onHandleLogout}
                okText="Yes"
                cancelText="No"
              >
                <Link to=""> Logout </Link>
              </Popconfirm>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
