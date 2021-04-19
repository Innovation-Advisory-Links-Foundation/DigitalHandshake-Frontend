import { SelectOutlined } from "@ant-design/icons";
import { Typography, Select, Popconfirm, Button, message } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import React, { ReactElement, useState } from "react";
import { MongoProposal, Request } from "../../../../../../const";
import SharedRequestsTable from "../../../SharedRequestsTable";
const { Option } = Select;

type Props = {
  requests: Array<Request>;
  biddersRatings: Map<string, number>;
  requestsContractualTerms: Map<string, MongoProposal>;
  onHandleSelectBidder: (requestId: number, bidderAccountName?: string) => void;
  onHandleUpdateBidderRating: (userAccountName: string) => void;
  onHandleUpdateRequestContractualTerms: (requestId: string) => void;
};

// Interactive table that allows the user to view their requests and to interact with them to select a bidder for the requested task/job.
function RequestsTable({
  requests,
  biddersRatings,
  requestsContractualTerms,
  onHandleSelectBidder,
  onHandleUpdateBidderRating,
  onHandleUpdateRequestContractualTerms,
}: Props) {
  const [selectedBidder, setSelectedBidder] = useState<string>(""); // Selected bidder for a particular request.
  const [id, setId] = useState<number>(0);

  /**
   * Wrapper method for calling the tx send for the specific action.
   * @param {string} bidderAccountName The eosio account name of the bidder.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const handleSelectBidder = (bidderAccountName: string, id: number) => {
    setSelectedBidder(bidderAccountName);
    setId(id);
  };

  /**
   * Wrapper method for calling the tx send for the specific action.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const handleConfirmation = (id: number) => {
    message.info("Waiting confirmation...");

    // Send the tx.
    onHandleSelectBidder(id, selectedBidder);

    // Update user rating.
    onHandleUpdateBidderRating(selectedBidder);

    // Update last proposal for request.
    onHandleUpdateRequestContractualTerms(id.toString());
  };

  /** Custom Table Columns */

  const selectColumn: ColumnType<Request> = {
    key: "select",
    dataIndex: "select",
    title: (
      <Typography style={{ textAlign: "center" }}>
        <b>Your Bidder</b>
      </Typography>
    ),
    width: 150,
    // eslint-disable-next-line react/display-name
    render: (_, request: Request) => {
      const bidders: Array<ReactElement> = [];

      return (
        <div style={{ textAlign: "center" }}>
          {request.bidders.length > 0 &&
            request.bidders.forEach((bidder: string) => {
              bidders.push(<Option value={bidder}>{bidder}</Option>);
            })}
          {!request.bidder ? (
            <Select
              allowClear
              placeholder="Select a bidder"
              disabled={request.bidders.length <= 0 ? true : false}
              bordered={false}
              onChange={(bidder: string) =>
                handleSelectBidder(bidder, request.id)
              }
              style={{ padding: "4px" }}
            >
              {bidders}
            </Select>
          ) : (
            <Typography>{request.bidder}</Typography>
          )}
        </div>
      );
    },
  };

  const confirmSelectionColumn: ColumnType<Request> = {
    key: "confirm",
    dataIndex: "confirm",
    width: 100,
    // eslint-disable-next-line react/display-name
    render: (_, request: Request) => {
      const isDisabled =
        request.id != id ||
        request.bidder ||
        request.bidders.length <= 0 ||
        !selectedBidder;

      return (
        <div style={{ textAlign: "center" }}>
          {!request.bidder ? (
            <>
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => handleConfirmation(request.id)}
                okText="Yes"
                cancelText="No"
                disabled={isDisabled ? true : false}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  shape="round"
                  icon={<SelectOutlined />}
                  disabled={isDisabled ? true : false}
                />
              </Popconfirm>
            </>
          ) : (
            <></>
          )}
        </div>
      );
    },
  };

  const requestTableColumns: ColumnsType<Request> = [
    selectColumn,
    confirmSelectionColumn,
  ];

  return (
    <SharedRequestsTable
      specificColumns={requestTableColumns}
      requests={requests}
      needFrom={false}
      biddersRatings={biddersRatings}
      requestsContractualTerms={requestsContractualTerms}
    />
  );
}

export default RequestsTable;
