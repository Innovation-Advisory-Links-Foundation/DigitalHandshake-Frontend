import {
  AuditOutlined,
  LikeOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import {
  Typography,
  Popconfirm,
  Button,
  message,
  Col,
  Popover,
  Row,
} from "antd";
import Table, { ColumnsType, ColumnType } from "antd/lib/table";
import React, { useState } from "react";
import { Dispute, MongoDispute, ReduxUser } from "../../../../../../const";

type Props = {
  user: ReduxUser;
  disputes: Array<Dispute>;
  disputesMotivations: Map<string, Array<MongoDispute>>;
  onVote: (handshakeId: number, preference: string) => void;
};

// Interactive table that allows the juror to view the handshakes and to express a voting preference.
function DisputesTable({ user, disputes, disputesMotivations, onVote }: Props) {
  const [id, setId] = useState<number>(0);

  /**
   * Wrapper method for calling the tx send for the specific action.
   * @param {string} preference The eosio account name of the dealer or bidder.
   */
  const handleVote = (preference: string) => {
    message.info("Waiting confirmation...");

    // Sends the tx.
    onVote(id, preference);
  };

  /** Table Columns */

  const dealerMotivationColumn: ColumnType<Dispute> = {
    key: "dealer_motivation_hash",
    dataIndex: "dealer_motivation_hash",
    title: (
      <Typography>
        <b>Dealer Motivation</b>
      </Typography>
    ),
    ellipsis: true,
    width: 300,
    // eslint-disable-next-line react/display-name
    render: (_, dispute: Dispute) => {
      const handshakeDisputeMotivations = disputesMotivations.get(
        dispute.dhs_id.toString()
      );
      const dealerMotivationHash = dispute.dealer_motivation_hash;

      const dealerMotivation = handshakeDisputeMotivations?.filter(
        (motivation: MongoDispute) =>
          motivation.motivationHash === dealerMotivationHash
      );
      return (
        <>
          {dealerMotivation && dealerMotivationHash ? (
            <Row gutter={16}>
              <Col className="gutter-row" span={20}>
                <Popover
                  title="Dealer Motivation"
                  trigger="clickable"
                  content={
                    <div style={{ maxWidth: "50vw" }}>
                      <Typography.Text copyable>
                        {dealerMotivation
                          ? dealerMotivation[0].motivation
                          : "Loading..."}
                      </Typography.Text>
                    </div>
                  }
                >
                  {
                    <Typography.Text>
                      {`${dealerMotivation[0].motivation.slice(0, 40)}...`}
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
                      {dealerMotivationHash
                        ? dealerMotivationHash
                        : "Loading..."}
                    </Typography.Text>
                  }
                >
                  {<SafetyCertificateOutlined style={{ color: "green" }} />}
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

  const bidderMotivationColumn: ColumnType<Dispute> = {
    key: "bidder_motivation_hash",
    dataIndex: "bidder_motivation_hash",
    title: (
      <Typography>
        <b>Bidder Motivation</b>
      </Typography>
    ),
    ellipsis: true,
    width: 300,
    // eslint-disable-next-line react/display-name
    render: (_, dispute: Dispute) => {
      const handshakeDisputeMotivations = disputesMotivations.get(
        dispute.dhs_id.toString()
      );
      const bidderMotivationHash = dispute.bidder_motivation_hash;

      const dealerMotivation = handshakeDisputeMotivations?.filter(
        (motivation: MongoDispute) =>
          motivation.motivationHash === bidderMotivationHash
      );
      return (
        <>
          {dealerMotivation && bidderMotivationHash ? (
            <Row gutter={16}>
              <Col className="gutter-row" span={20}>
                <Popover
                  title="Bidder Motivation"
                  trigger="clickable"
                  content={
                    <div style={{ maxWidth: "50vw" }}>
                      <Typography.Text copyable>
                        {dealerMotivation
                          ? dealerMotivation[0].motivation
                          : "Loading..."}
                      </Typography.Text>
                    </div>
                  }
                >
                  {
                    <Typography.Text>
                      {`${dealerMotivation[0].motivation.slice(0, 40)}...`}
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
                      {bidderMotivationHash
                        ? bidderMotivationHash
                        : "Loading..."}
                    </Typography.Text>
                  }
                >
                  {<SafetyCertificateOutlined style={{ color: "green" }} />}
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

  const winnerColumn: ColumnType<Dispute> = {
    key: "winner",
    dataIndex: "winner",
    title: (
      <Typography style={{ textAlign: "center" }}>
        <b>Winner</b>
      </Typography>
    ),
    width: 200,

    // eslint-disable-next-line react/display-name
    render: (_, dispute: Dispute) => {
      let votesForDealer = 0;
      let votesForBidder = 0;
      let votesLeft = 0;

      votesForDealer += dispute.vote1.toString() == dispute.dealer ? 1 : 0;
      votesForDealer += dispute.vote2.toString() == dispute.dealer ? 1 : 0;
      votesForDealer += dispute.vote3.toString() == dispute.dealer ? 1 : 0;
      votesForBidder += dispute.vote1.toString() == dispute.bidder ? 1 : 0;
      votesForBidder += dispute.vote2.toString() == dispute.bidder ? 1 : 0;
      votesForBidder += dispute.vote3.toString() == dispute.bidder ? 1 : 0;
      votesLeft += dispute.vote1.length == 0 ? 1 : 0;
      votesLeft += dispute.vote2.length == 0 ? 1 : 0;
      votesLeft += dispute.vote3.length == 0 ? 1 : 0;

      return (
        <>
          <Row>
            <Col span={24}>
              {votesLeft > 0 ? (
                <Typography style={{ textAlign: "center" }}>
                  {" "}
                  <i>
                    <b>{votesLeft}</b> votes left
                  </i>
                </Typography>
              ) : (
                <Typography style={{ textAlign: "center" }}>
                  {" "}
                  {votesForDealer > votesForBidder ? "DEALER" : "BIDDER"}
                </Typography>
              )}
            </Col>
          </Row>
        </>
      );
    },
  };

  const actionsColumn: ColumnType<Dispute> = {
    key: "actions",
    title: (
      <Typography style={{ textAlign: "center" }}>
        <b>Your Vote</b>
      </Typography>
    ),
    dataIndex: "action",
    width: 200,
    // eslint-disable-next-line react/display-name
    render: (_, dispute: Dispute) => {
      const canVote =
        (dispute.juror1.toString() == user.accountName &&
          dispute.vote1.length > 0) ||
        (dispute.juror2.toString() == user.accountName &&
          dispute.vote2.length > 0) ||
        (dispute.juror3.toString() == user.accountName &&
          dispute.vote3.length > 0) ||
        dispute.bidder_motivation_hash.length == 0 ||
        dispute.dealer_motivation_hash.length == 0;

      const displayVoteJuror1 =
        dispute.juror1.toString() == user.accountName &&
        dispute.vote1.length > 0;
      const displayVoteJuror2 =
        dispute.juror2.toString() == user.accountName &&
        dispute.vote2.length > 0;
      const displayVoteJuror3 =
        dispute.juror3.toString() == user.accountName &&
        dispute.vote3.length > 0;

      return (
        <>
          <Row style={{ textAlign: "center" }}>
            {canVote ? (
              <Col span={24}>
                <Typography.Text style={{ textAlign: "center" }}>
                  {(displayVoteJuror1 && dispute.vote1 == dispute.dealer) ||
                  (displayVoteJuror2 && dispute.vote2 == dispute.dealer) ||
                  (displayVoteJuror3 && dispute.vote3 == dispute.dealer) ? (
                    <i>{"Dealer"}</i>
                  ) : (
                    <i>{"Bidder"}</i>
                  )}
                </Typography.Text>
              </Col>
            ) : (
              <>
                <Col span={12}>
                  <Popconfirm
                    title="Are you sure?"
                    onConfirm={() => handleVote(dispute.dealer)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="link"
                      htmlType="submit"
                      shape="round"
                      icon={<AuditOutlined style={{ fontSize: "24px" }} />}
                      onClick={() => setId(dispute.dhs_id)}
                      disabled={canVote ? true : false}
                    >
                      Dealer
                    </Button>
                  </Popconfirm>
                </Col>
                <Col span={12}>
                  <Popconfirm
                    title="Are you sure?"
                    onConfirm={() => handleVote(dispute.bidder)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="link"
                      htmlType="submit"
                      shape="round"
                      icon={<AuditOutlined style={{ fontSize: "24px" }} />}
                      onClick={() => setId(dispute.dhs_id)}
                      disabled={canVote ? true : false}
                    >
                      Bidder
                    </Button>
                  </Popconfirm>
                </Col>
              </>
            )}
          </Row>
        </>
      );
    },
  };

  // TODO Continue with other columns

  const columns: ColumnsType<Dispute> = [
    dealerMotivationColumn,
    bidderMotivationColumn,
    winnerColumn,
    actionsColumn,
  ];

  return (
    <Table<Dispute>
      columns={columns}
      dataSource={disputes}
      size="middle"
      style={{ padding: "12px", height: "77vh" }}
      bordered
    />
  );
}

export default DisputesTable;
