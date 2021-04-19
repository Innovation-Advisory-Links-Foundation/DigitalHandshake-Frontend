import {
  TwitterOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
  MediumOutlined,
} from "@ant-design/icons";
import { Avatar, Row, Typography } from "antd";
import React from "react";
const { Text } = Typography;

// Shows the footer containing the social shortcuts for connecting with us.
function Footer() {
  return (
    <footer>
      <Row
        align="middle"
        justify="center"
        style={{ height: "4vh", padding: "8px" }}
      >
        <Typography style={{ fontSize: "1.2rem", marginRight: "8px" }}>
          <Text> © 2021</Text>
          <Text>
            {" "}
            <a
              href="http://linksfoundation.com/en/"
              target="_blank"
              rel="noreferrer"
            >
              LINKS Foundation
            </a>
          </Text>
        </Typography>
        <a
          href="https://twitter.com/LinksFoundation"
          target="_blank"
          rel="noreferrer"
        >
          <Avatar
            style={{ backgroundColor: "#55acee", marginLeft: "4px" }}
            icon={<TwitterOutlined />}
          />
        </a>
        <a
          href="https://www.youtube.com/channel/UCJyzeXESG4IbhYYIwoVWH9w"
          target="_blank"
          rel="noreferrer"
        >
          <Avatar
            style={{ backgroundColor: "#cd201f", marginLeft: "4px" }}
            icon={<YoutubeOutlined />}
          >
            Youtube
          </Avatar>
        </a>
        <a
          href="https://medium.com/overtheblock"
          target="_blank"
          rel="noreferrer"
        >
          <Avatar
            style={{ backgroundColor: "#3b5999", marginLeft: "4px" }}
            icon={<MediumOutlined />}
          >
            Medium
          </Avatar>
        </a>
        <a
          href="https://www.linkedin.com/company/linksfoundation/"
          target="_blank"
          rel="noreferrer"
        >
          <Avatar
            style={{ backgroundColor: "#0073b1", marginLeft: "4px" }}
            icon={<LinkedinOutlined />}
          >
            LinkedIn
          </Avatar>
        </a>
      </Row>
    </footer>
  );
}

export default Footer;
