import React from "react";
import { Row, Col, Image, Typography } from "antd";

const { Title, Text } = Typography;

type Props = {
  iconURL?: string;
  title?: string;
  description?: string;
};

// Shows a carousel item with customizable icon and description.
function LoginCarouselItem(props: Props) {
  return (
    <Row align="middle" justify="center" style={{ height: "96vh" }}>
      <Image
        style={{ marginTop: "16vh", padding: "24px" }}
        width={256}
        src={props.iconURL}
        preview={false}
      />
      <Col span={24}>
        <Typography style={{ textAlign: "center", padding: "24px" }}>
          <Title style={{ color: "white" }}> {props.title} </Title>
          <Text style={{ color: "white", fontSize: "1.4rem" }}>
            {" "}
            {props.description}{" "}
          </Text>
        </Typography>
      </Col>
    </Row>
  );
}

export default LoginCarouselItem;
