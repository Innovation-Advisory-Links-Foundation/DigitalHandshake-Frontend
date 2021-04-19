import { SafetyCertificateOutlined } from "@ant-design/icons";
import { Col, List, Popover, Row, Tag, Typography } from "antd";
import Table, { ColumnsType, ColumnType } from "antd/es/table";
import React from "react";
import { MongoProposal, Request } from "../../../../const";

type Props = {
  specificColumns: ColumnsType<Request>;
  requests: Array<Request>;
  needFrom: boolean;
  biddersRatings: Map<string, number>;
  requestsContractualTerms: Map<string, MongoProposal>;
};

// Component that displays a table containing columns shared between the tables of the explore and requests page.
function SharedRequestsTable({
  specificColumns,
  requests,
  needFrom,
  biddersRatings,
  requestsContractualTerms,
}: Props) {
  // Prepare columns.
  const fromColumn: ColumnType<Request> = {
    key: "dealer",
    dataIndex: "dealer",
    title: (
      <Typography>
        <b>Dealer</b>
      </Typography>
    ),
    width: 200,
  };

  const summaryColumn: ColumnType<Request> = {
    key: "summary",
    dataIndex: "summary",
    title: (
      <Typography>
        <b>Summary</b>
      </Typography>
    ),
    ellipsis: true,
    width: 300,
  };

  const priceColumn: ColumnType<Request> = {
    key: "price",
    dataIndex: "price",
    title: (
      <Typography>
        <b>Price (DHS Token)</b>
      </Typography>
    ),
    width: 250,
    sorter: (a, b) =>
      parseInt(a.price.slice(0, a.price.length - 4)) -
      parseInt(b.price.slice(0, b.price.length - 4)),
    // eslint-disable-next-line react/display-name
    render: (price: string) => {
      return (
        <Typography>
          {" "}
          {price.slice(0, price.length - 9).concat(" DHS")}{" "}
        </Typography>
      );
    },
  };

  const deadlineColumn: ColumnType<Request> = {
    key: "deadline",
    dataIndex: "deadline",
    title: (
      <Typography style={{ textAlign: "center" }}>
        <b>Deadline</b>
      </Typography>
    ),
    defaultSortOrder: "ascend",
    width: 200,
    sorter: (a, b) => a.deadline - b.deadline,
    // eslint-disable-next-line react/display-name
    render: (deadline: number) => {
      return <>{new Date(deadline * 1000).toDateString()}</>;
    },
  };

  const statusColumn: ColumnType<Request> = {
    key: "status",
    dataIndex: "status",
    title: (
      <Typography>
        <b>Status</b>
      </Typography>
    ),
    width: 100,
    filters: [
      {
        text: "Open",
        value: 0,
      },
      {
        text: "Closed",
        value: 1,
      },
    ],
    filterMultiple: false,
    onFilter: (value, record) => record.status === value,
    // eslint-disable-next-line react/display-name
    render: (_, request: Request) => {
      return (
        <>
          <Tag
            color={request.status === 0 ? "#0EAD69" : "#9A031E"}
            key={request.status === 0 ? "open" : "closed"}
          >
            {request.status === 0 ? "OPEN" : "CLOSED"}
          </Tag>
        </>
      );
    },
  };

  const contractualTermsColumn: ColumnType<Request> = {
    key: "contractual_terms_hash",
    dataIndex: "contractual_terms_hash",
    title: (
      <Typography>
        <b>Contractual Terms</b>
      </Typography>
    ),
    ellipsis: true,
    width: 300,
    // eslint-disable-next-line react/display-name
    render: (_, request: Request) => {
      const contractualTerms = requestsContractualTerms.get(
        request.id.toString()
      )?.contractualTerms;
      const contractualTermsHash = requestsContractualTerms.get(
        request.id.toString()
      )?.contractualTermsHash;
      return (
        <>
          {contractualTerms && contractualTermsHash ? (
            <Row gutter={16}>
              <Col className="gutter-row" span={20}>
                <Popover
                  title="Contractual Terms"
                  trigger="hover"
                  content={
                    <Typography.Text copyable>
                      {contractualTerms ? contractualTerms : "Loading..."}
                    </Typography.Text>
                  }
                >
                  {
                    <Typography.Text style={{ color: "#192A51" }}>
                      {`${contractualTerms.slice(0, 20)}...`}
                    </Typography.Text>
                  }
                </Popover>
              </Col>
              <Col className="gutter-row" span={4}>
                <Popover
                  title="SHA256 HASH FINGERPRINT"
                  trigger="hover"
                  content={
                    <Typography.Text code copyable>
                      {contractualTermsHash
                        ? contractualTermsHash
                        : "Loading..."}
                    </Typography.Text>
                  }
                >
                  {<SafetyCertificateOutlined style={{ color: "#375849" }} />}
                </Popover>
              </Col>
            </Row>
          ) : (
            <Typography.Text>{"Loading..."}</Typography.Text>
          )}
        </>
      );
    },
  };

  const biddersColumn: ColumnType<Request> = {
    key: "bidders",
    dataIndex: "bidders",
    title: (
      <Typography style={{ textAlign: "center" }}>
        <b>Bidders</b>
      </Typography>
    ),
    width: 250,
    // eslint-disable-next-line react/display-name
    render: (_, request: Request) => {
      return (
        <div style={{ textAlign: "center" }}>
          {request.bidders.length <= 0 ? (
            <Typography>{`No one`}</Typography>
          ) : (
            <Popover
              content={
                <List
                  key={request.id}
                  size="small"
                  itemLayout="horizontal"
                  style={{ width: "8vw" }}
                  dataSource={request.bidders}
                  renderItem={(bidder) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <Typography
                            style={{ textAlign: "center", fontSize: "1rem" }}
                          >{`${bidder} / ${biddersRatings.get(
                            bidder
                          )} ⭐`}</Typography>
                        }
                      />
                    </List.Item>
                  )}
                />
              }
              trigger="hover"
              placement="bottom"
            >
              <Typography>
                {`Already proposed (${request.bidders.length})`}
              </Typography>
            </Popover>
          )}
        </div>
      );
    },
  };

  const sharedColumns: ColumnsType<Request> = [
    fromColumn,
    summaryColumn,
    priceColumn,
    deadlineColumn,
    statusColumn,
  ];

  const [, , ...columnsWithoutFromAndSummary] = sharedColumns;

  const columns = needFrom
    ? [
        fromColumn,
        summaryColumn,
        contractualTermsColumn,
        ...columnsWithoutFromAndSummary,
        biddersColumn,
        ...specificColumns,
      ]
    : [
        summaryColumn,
        contractualTermsColumn,
        ...columnsWithoutFromAndSummary,
        biddersColumn,
        ...specificColumns,
      ];

  return (
    <>
      <Table<Request>
        columns={columns}
        dataSource={requests}
        size="middle"
        style={{ padding: "12px", height: needFrom ? "77vh" : "70vh" }}
        bordered
      />
    </>
  );
}

export default SharedRequestsTable;
