import { SelectOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Typography } from "antd";
import { ColumnsType, ColumnType } from "antd/es/table";
import React, { useState } from "react";
import { MongoProposal, Request } from "../../../../../../const";
import SharedRequestsTable from "../../../SharedRequestsTable";

type Props = {
  accountName: string;
  requests: Array<Request>;
  biddersRatings: Map<string, number>;
  requestsContractualTerms: Map<string, MongoProposal>;
  onHandlePropose: (requestId: number) => void;
};

// Interactive table that allows the user to view the requests of others and to propose itself as a bidder.
function ExploreTable({
  accountName,
  requests,
  biddersRatings,
  requestsContractualTerms,
  onHandlePropose,
}: Props) {
  const [id, setId] = useState<number>(0);

  /**
   * Wrapper method for calling the tx send for the specific action.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const handleConfirmation = (id: number) => {
    message.info("Waiting confirmation...");
    setId(id);

    // Send the tx.
    onHandlePropose(id);

    setTimeout(() => {
      setId(0);
    }, 2000);
  };

  /** Custom Table Columns */

  const proposeActionColumn: ColumnType<Request> = {
    key: "propose",
    dataIndex: "propose",
    width: 200,
    // eslint-disable-next-line react/display-name
    render: (_, request: Request) => {
      return (
        <div style={{ textAlign: "center" }}>
          {request.status === 0 ? (
            <>
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => handleConfirmation(request.id)}
                okText="Yes"
                cancelText="No"
                disabled={
                  request.bidder ||
                  request.bidders.includes(accountName) ||
                  id === request.id
                    ? true
                    : false
                }
              >
                <Button
                  type="link"
                  htmlType="submit"
                  shape="round"
                  icon={<SelectOutlined style={{ fontSize: "24px" }} />}
                  disabled={
                    request.bidder ||
                    request.bidders.includes(accountName) ||
                    id === request.id
                      ? true
                      : false
                  }
                />
              </Popconfirm>
            </>
          ) : (
            <Typography>{request.bidder}</Typography>
          )}
        </div>
      );
    },
  };

  const exploreTableColumns: ColumnsType<Request> = [proposeActionColumn];

  return (
    <SharedRequestsTable
      specificColumns={exploreTableColumns}
      requests={requests}
      needFrom={true}
      biddersRatings={biddersRatings}
      requestsContractualTerms={requestsContractualTerms}
    />
  );
}

export default ExploreTable;
