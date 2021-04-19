import { Form, Modal, message } from "antd";
import React from "react";
import ContractualTermsForm from "../../../ContractualTermsForm";

type Props = {
  visible: boolean;
  postButtonLoader: boolean;
  onPost: (
    summary: string,
    contractualTerms: string,
    price: number,
    deadline: number
  ) => void;
  onCancel: () => void;
};

// Interactive form that allows the user to input the data for the request and sending the tx.
function PostRequestForm({
  visible,
  postButtonLoader,
  onPost,
  onCancel,
}: Props) {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Post a New Request"
      okText="Post"
      cancelText="Cancel"
      centered
      confirmLoading={postButtonLoader}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={async () => {
        message.info("Waiting confirmation...");
        const values = await form.validateFields();
        onPost(
          values.summary,
          values.contractualTerms,
          values.price,
          values.deadline
        );
        setTimeout(() => {
          form.resetFields();
        }, 2000);
      }}
    >
      <ContractualTermsForm needSummary={true} form={form} />
    </Modal>
  );
}

export default PostRequestForm;
