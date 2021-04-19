import { ExceptionOutlined } from "@ant-design/icons";
import { Result } from "antd";
import React from "react";

type Props = {
  isRequestPage: boolean;
};

// Show a message to the user when no data is present in the blockchain regarding the information managed by the current page.
function EmptyPage({ isRequestPage }: Props) {
  return (
    <Result
      title="No data found"
      subTitle="Sorry, it would seem that there is no data in the blockchain yet..."
      icon={<ExceptionOutlined style={{ fontSize: "6rem" }} />}
      style={{ height: isRequestPage ? "50vh" : "57vh", marginTop: "20vh" }}
    />
  );
}

export default EmptyPage;
