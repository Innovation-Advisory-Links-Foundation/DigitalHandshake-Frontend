import { Form, Modal, message } from "antd";
import React from "react";
import ContractualTermsForm from "../../../ContractualTermsForm";

type Props = {
  visible: boolean;
  proposeButtonLoader: boolean;
  onNegotiate: (
    id: number,
    contractualTerms: string,
    price: string,
    deadline: number
  ) => void;
  onCancel: () => void;
  id: number;
};

// Interactive form that allows the user to input the data for the negotiation and sending the tx.
function NegotiateContractualTermsForm({
  visible,
  proposeButtonLoader,
  onNegotiate,
  onCancel,
  id,
}: Props) {
  const [form] = Form.useForm(); // Retrieve form object.

  return (
    <Modal
      visible={visible}
      title="Propose New Contractual Terms"
      okText="Propose"
      cancelText="Cancel"
      centered
      confirmLoading={proposeButtonLoader}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={async () => {
        message.info("Waiting confirmation...");
        const values = await form.validateFields();
        onNegotiate(id, values.contractualTerms, values.price, values.deadline);
        form.resetFields();
      }}
    >
      <ContractualTermsForm needSummary={false} form={form} />
    </Modal>
  );
}

export default NegotiateContractualTermsForm;
