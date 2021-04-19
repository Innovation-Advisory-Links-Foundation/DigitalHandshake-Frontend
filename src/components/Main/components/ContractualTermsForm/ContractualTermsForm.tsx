import { InputNumber, DatePicker, Form, FormInstance } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import React from "react";

type Props = {
  needSummary: boolean;
  form: FormInstance<any>;
};

// This component shows the form containing multiple fields necessary for posting a new request or negotiating contractual terms.
function ContractualTermsForm({ needSummary, form }: Props) {
  return (
    <Form form={form} layout="vertical" name="form">
      {needSummary && (
        <Form.Item
          name="summary"
          label="Summary"
          rules={[
            {
              required: true,
              message: "Please write a short descriptive summary.",
            },
          ]}
        >
          <TextArea
            rows={4}
            showCount
            maxLength={300}
            placeholder="e.g. I need a website for my new startup related to smart food delivery using cryptocurrency payments."
          />
        </Form.Item>
      )}

      <Form.Item
        name="contractualTerms"
        label="Contractual Terms"
        rules={[
          {
            required: true,
            message: "Please write a detailed contractual terms.",
          },
        ]}
      >
        <TextArea
          rows={10}
          showCount
          maxLength={3000}
          placeholder={`e.g. The website must satisfy the following requirements: \n 
            - Cross-platform
            - Modern and Responsive
            - ...
            
            Other requirements
            - The theme must remember "feeling at home".

            External Resources
            - An example of external resource (https://www.overtheblock.io/).
            - ...
            `}
        />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price (DHS)"
        rules={[
          {
            required: true,
            message: "Please set a price (nb. every unit is a DHS Token)",
          },
        ]}
      >
        <InputNumber
          min="0.1"
          max="1000000"
          stringMode
          style={{ width: "100%" }}
        />
      </Form.Item>
      <Form.Item
        name="deadline"
        label="Deadline"
        rules={[
          {
            required: true,
            message: "Please indicate for which time your work must be done.",
          },
          () => ({
            validator(_, value) {
              if (moment() > value) {
                return Promise.reject(
                  new Error("Please pick a date in the future.")
                );
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <DatePicker />
      </Form.Item>
    </Form>
  );
}

export default ContractualTermsForm;
