import { Form, Modal, message } from "antd";
import React from "react";
import TextArea from "antd/lib/input/TextArea";

type Props = {
  visible: boolean;
  buttonLoader: boolean;
  onMotivate: (id: string, motivate: string) => void;
  onCancel: () => void;
  id: number;
};

// Interactive form that allows the user to input the data for the motivation and sending the tx.
function MotivateDisputeForm({
  visible,
  buttonLoader,
  onMotivate,
  onCancel,
  id,
}: Props) {
  const [form] = Form.useForm(); // Retrieve form object.

  return (
    <Modal
      visible={visible}
      title="Motivate Dispute"
      okText="Motivate"
      cancelText="Cancel"
      centered
      confirmLoading={buttonLoader}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={async () => {
        message.info("Waiting confirmation...");
        const values = await form.validateFields();
        onMotivate(id.toString(), values.motivation);
        form.resetFields();
      }}
    >
      <Form form={form} layout="vertical" name="form">
        <Form.Item
          name="motivation"
          label="Motivation"
          rules={[
            {
              required: true,
              message: "Please write a detailed motivation.",
            },
          ]}
        >
          <TextArea
            rows={10}
            showCount
            maxLength={3000}
            placeholder={`e.g. The website does not satisfy the following requirements: \n 
            - No Cross-platform.
            - No Responsive.
            - Antique design.

            External Resources
            - You can check the website made by the bidder here (https://www...io/).
            - ...
            `}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MotivateDisputeForm;
