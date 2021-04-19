import {
  BankOutlined,
  CarryOutOutlined,
  CheckOutlined,
  FormOutlined,
  FrownFilled,
  FrownOutlined,
  InteractionOutlined,
  LockOutlined,
  PaperClipOutlined,
  SafetyCertificateOutlined,
  SmileOutlined,
  TrophyOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import {
  Col,
  Popover,
  Row,
  Tag,
  Typography,
  Button,
  Popconfirm,
  message,
  Modal,
} from "antd";
import Table, { ColumnsType, ColumnType } from "antd/es/table";
import React, { useState } from "react";
import {
  DigitalHandshake,
  Dispute,
  MongoProposal,
  Negotiation,
  ReduxUser,
} from "../../../../../../const";
import MotivateDisputeForm from "../MotivateDisputeForm";
import NegotiateContractualTermsForm from "../NegotiateContractualTermsForm";

type Props = {
  user: ReduxUser;
  handshakes: Array<DigitalHandshake>;
  handshakesContractualTerms: Map<string, MongoProposal>;
  negotiations: Map<string, Negotiation>;
  disputes: Map<string, Dispute>;
  negotiateModalVisible: boolean;
  motivateModalVisible: boolean;
  buttonLoader: boolean;
  onNegotiate: (
    id: number,
    contractualTerms: string,
    price: string,
    deadline: number
  ) => void;
  onMotivate: (id: string, motivation: string) => void;
  onAcceptTerms: (handshakeId: number) => void;
  onEndJob: (handshakeId: number) => void;
  onAcceptJob: (handshakeId: number) => void;
  onOpenDispute: (handshakeId: number) => void;
  onExpired: (handshakeId: number) => void;
  onLockTokens: (handshakeId: number, quantity: number) => void;
  onSetNegotiateModalVisible: (value: boolean) => void;
  onSetMotivateModalVisible: (value: boolean) => void;
  onHandleUpdateRequestContractualTerms: (requestId: string) => void;
};

// Interactive table that allows the user to view the handshakes where it participates as bidder or dealer.
function HandshakesTable({
  user,
  handshakes,
  handshakesContractualTerms,
  negotiations,
  disputes,
  negotiateModalVisible,
  motivateModalVisible,
  buttonLoader,
  onNegotiate,
  onMotivate,
  onAcceptTerms,
  onEndJob,
  onExpired,
  onAcceptJob,
  onOpenDispute,
  onLockTokens,
  onSetNegotiateModalVisible,
  onSetMotivateModalVisible,
  onHandleUpdateRequestContractualTerms,
}: Props) {
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);

  // Modals.
  const [lockTokensModalVisible, setLockTokensModalVisible] = useState<boolean>(
    false
  );

  /**
   * Wrapper method for updating state preparing the execution of a specific action.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const handleProposeNewContractualTerms = (id: number) => {
    onSetNegotiateModalVisible(true);
    setId(id);
  };

  /**
   * Wrapper method for updating state preparing the execution of a specific action.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const handleMotivateDispute = (id: number) => {
    onSetMotivateModalVisible(true);
    setId(id);
  };

  /**
   * Wrapper method for updating state preparing the execution of a specific action.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const handleLockTokensModal = (id: number) => {
    setLockTokensModalVisible(true);
    setId(id);
  };

  /**
   * Wrapper method for calling the tx send for the specific action.
   */
  const handleEndJob = () => {
    message.info("Waiting confirmation...");

    // Sends the tx.
    onEndJob(id);
  };

  /**
   * Wrapper method for calling the tx send for the specific action.
   */
  const handleExpired = () => {
    message.info("Waiting confirmation...");

    // Sends the tx.
    onExpired(id);
  };

  /**
   * Wrapper method for calling the tx send for the specific action.
   */
  const handleOpenDispute = () => {
    message.info("Waiting confirmation...");

    // Sends the tx.
    onOpenDispute(id);
  };

  /**
   * Wrapper method for calling the tx send for the specific action.
   */
  const handleAcceptJob = () => {
    message.info("Waiting confirmation...");

    // Sends the tx.
    onAcceptJob(id);
  };

  /**
   * Wrapper method for calling the tx send for the specific action.
   */
  const handleConfirmation = () => {
    message.info("Waiting confirmation...");

    // Sends the tx.
    onAcceptTerms(id);

    // Update last proposal for request.
    onHandleUpdateRequestContractualTerms(id.toString());
  };

  /**
   * Wrapper method for calling the tx send for the specific action.
   * @param {string} quantity The amount of tokens to lock.
   */
  const handleLock = (quantity: number) => {
    message.info("Waiting confirmation...");

    setTimeout(() => {
      // Sends the tx.
      onLockTokens(id, quantity);

      // Update component state.
      setButtonLoading(false);
      setLockTokensModalVisible(false);
    }, 2000);
  };

  /** Table Columns */

  const dealerColumn: ColumnType<DigitalHandshake> = {
    key: "dealer",
    dataIndex: "dealer",
    title: (
      <Typography>
        <b>Dealer</b>
      </Typography>
    ),
    width: 150,
  };

  const bidderColumn: ColumnType<DigitalHandshake> = {
    key: "bidder",
    dataIndex: "bidder",
    title: (
      <Typography>
        <b>Bidder</b>
      </Typography>
    ),
    width: 150,
  };

  const contractualTermsColumn: ColumnType<DigitalHandshake> = {
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
    render: (_, handshake: DigitalHandshake) => {
      const contractualTerms = handshakesContractualTerms.get(
        handshake.request_id.toString()
      )?.contractualTerms;
      const contractualTermsHash = handshakesContractualTerms.get(
        handshake.request_id.toString()
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
                      {`${contractualTerms.slice(0, 40)}...`}
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
                  {
                    <SafetyCertificateOutlined
                      style={{ fontSize: "20px", color: "green" }}
                    />
                  }
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

  const priceColumn: ColumnType<DigitalHandshake> = {
    key: "price",
    dataIndex: "price",
    title: (
      <Typography>
        <b>Price (DHS Token)</b>
      </Typography>
    ),
    width: 200,
    sorter: (a, b) =>
      parseInt(a.price.slice(0, a.price.length - 4)) -
      parseInt(b.price.slice(0, b.price.length - 4)),
    // eslint-disable-next-line react/display-name
    render: (_, handshake: DigitalHandshake) => {
      const proposedPrices = negotiations.get(handshake.request_id.toString())
        ?.proposed_prices;
      return (
        <Typography>
          {proposedPrices && proposedPrices?.length > 0
            ? proposedPrices[proposedPrices.length - 1]
                .slice(0, proposedPrices.length - 10)
                .concat(" DHS")
            : "Not negotiated..."}
        </Typography>
      );
    },
  };

  const deadlineColumn: ColumnType<DigitalHandshake> = {
    key: "deadline",
    dataIndex: "deadline",
    title: (
      <Typography style={{ textAlign: "center" }}>
        <b>Deadline</b>
      </Typography>
    ),
    defaultSortOrder: "ascend",
    width: 150,
    sorter: (a, b) => a.deadline - b.deadline,
    // eslint-disable-next-line react/display-name
    render: (_, handshake: DigitalHandshake) => {
      const proposedDeadlines = negotiations.get(
        handshake.request_id.toString()
      )?.proposed_deadlines;

      return (
        <Typography>
          {proposedDeadlines && proposedDeadlines?.length > 0 ? (
            <>
              {new Date(
                proposedDeadlines[proposedDeadlines.length - 1] * 1000
              ).toDateString()}
            </>
          ) : (
            "Not negotiated..."
          )}
        </Typography>
      );
    },
  };

  const statusColumn: ColumnType<DigitalHandshake> = {
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
        text: "Negotiation",
        value: 0,
      },
      {
        text: "Lock",
        value: 1,
      },
      {
        text: "Execution",
        value: 2,
      },
      {
        text: "Confirmation",
        value: 3,
      },
      {
        text: "Dispute",
        value: 4,
      },
      {
        text: "Voting",
        value: 5,
      },
      {
        text: "Accepted",
        value: 6,
      },
      {
        text: "Resolved",
        value: 7,
      },
      {
        text: "Expired",
        value: 8,
      },
    ],
    filterMultiple: false,
    onFilter: (value, record) => record.status === value,
    // eslint-disable-next-line react/display-name
    render: (_, handshake: DigitalHandshake) => {
      const currentStatus = handshake.status;
      const currentStatusTag = [
        "NEGOTIATION",
        "LOCK",
        "EXECUTION",
        "CONFIRMATION",
        "DISPUTE",
        "VOTING",
        "ACCEPTED",
        "RESOLVED",
        "EXPIRED",
      ];
      const currentStatusColors = [
        "#EAB464",
        "#9A031E",
        "#E7B536",
        "#E0C200",
        "#2978A0",
        "#53CADF",
        "#4DAA57",
        "#172815",
        "#58355E",
      ];

      return (
        <>
          <Tag
            color={currentStatusColors[handshake.status]}
            key={currentStatus}
          >
            {currentStatusTag[handshake.status]}
          </Tag>
        </>
      );
    },
  };

  const actionsColumn: ColumnType<DigitalHandshake> = {
    key: "actions",
    dataIndex: "action",
    width: 100,
    // eslint-disable-next-line react/display-name
    render: (_, handshake: DigitalHandshake) => {
      // Expiration.
      const isExpired =
        handshake.deadline <= Math.floor(Date.now().valueOf() / 1000);
      const unlockedByDealer =
        handshake &&
        handshake.dealer.toString() === user.accountName &&
        handshake.unlock_for_expiration_by_dealer == true;
      const unlockedByBidder =
        handshake &&
        handshake.bidder.toString() === user.accountName &&
        handshake.unlock_for_expiration_by_bidder == true;

      // Negotiation.
      const handshakeNegotiation = negotiations.get(
        handshake.request_id.toString()
      );
      const isBidderTurn =
        handshakeNegotiation &&
        handshake.bidder.toString() === user.accountName &&
        handshakeNegotiation?.proposed_prices.length % 2 === 1;
      const isDealerTurn =
        handshakeNegotiation &&
        handshake.dealer.toString() === user.accountName &&
        handshakeNegotiation?.proposed_prices.length % 2 === 0;
      const lastProposedPrice =
        handshakeNegotiation?.proposed_prices[
          handshakeNegotiation.proposed_prices.length - 1
        ] || "0.0000 DHS";

      // Dispute.
      const handshakeDispute = disputes.get(handshake.request_id.toString());
      let votesLeft = 0;
      let votesForUser = 0;
      votesLeft +=
        handshakeDispute && handshakeDispute.vote1.length == 0 ? 1 : 0;
      votesLeft +=
        handshakeDispute && handshakeDispute.vote2.length == 0 ? 1 : 0;
      votesLeft +=
        handshakeDispute && handshakeDispute.vote3.length == 0 ? 1 : 0;
      votesForUser +=
        handshakeDispute &&
        handshakeDispute.vote1.toString() === user.accountName
          ? 1
          : 0;
      votesForUser +=
        handshakeDispute &&
        handshakeDispute.vote2.toString() === user.accountName
          ? 1
          : 0;
      votesForUser +=
        handshakeDispute &&
        handshakeDispute.vote3.toString() === user.accountName
          ? 1
          : 0;
      const negotiation = negotiations.get(id.toString());
      return (
        <>
          {handshake.status === 0 && (
            <Row style={{ textAlign: "center" }}>
              <>
                <Col span={12}>
                  <Button
                    type="link"
                    htmlType="submit"
                    shape="round"
                    icon={<InteractionOutlined style={{ fontSize: "24px" }} />}
                    onClick={() =>
                      handleProposeNewContractualTerms(handshake.request_id)
                    }
                    disabled={
                      (isBidderTurn || isDealerTurn) &&
                      handshakeNegotiation &&
                      handshakeNegotiation?.accepted_by_bidder == false &&
                      handshakeNegotiation?.accepted_by_dealer == false
                        ? false
                        : true
                    }
                  />
                  <NegotiateContractualTermsForm
                    visible={negotiateModalVisible}
                    proposeButtonLoader={buttonLoader}
                    onNegotiate={onNegotiate}
                    onCancel={() => onSetNegotiateModalVisible(false)}
                    id={id}
                  />
                </Col>
                <Col span={12}>
                  <Popconfirm
                    title="Are you sure you accept?"
                    onConfirm={() => handleConfirmation()}
                    okText="Yes"
                    cancelText="No"
                    placement="left"
                    disabled={
                      ((isBidderTurn ||
                        (handshakeNegotiation &&
                          handshakeNegotiation.accepted_by_dealer == true)) &&
                        handshakeNegotiation &&
                        handshakeNegotiation?.accepted_by_bidder == false &&
                        handshake.bidder.toString() == user.accountName) ||
                      ((isDealerTurn ||
                        (handshakeNegotiation &&
                          handshakeNegotiation.accepted_by_bidder == true)) &&
                        handshakeNegotiation &&
                        handshakeNegotiation?.accepted_by_dealer == false &&
                        handshake.dealer.toString() == user.accountName)
                        ? false
                        : true
                    }
                  >
                    <Button
                      type="link"
                      htmlType="submit"
                      shape="round"
                      icon={<CheckOutlined style={{ fontSize: "24px" }} />}
                      disabled={
                        ((isBidderTurn ||
                          (handshakeNegotiation &&
                            handshakeNegotiation.accepted_by_dealer == true)) &&
                          handshakeNegotiation &&
                          handshakeNegotiation?.accepted_by_bidder == false &&
                          handshake.bidder.toString() == user.accountName) ||
                        ((isDealerTurn ||
                          (handshakeNegotiation &&
                            handshakeNegotiation.accepted_by_bidder == true)) &&
                          handshakeNegotiation &&
                          handshakeNegotiation?.accepted_by_dealer == false &&
                          handshake.dealer.toString() == user.accountName)
                          ? false
                          : true
                      }
                      onClick={() => setId(handshake.request_id)}
                    />
                  </Popconfirm>
                </Col>
              </>
            </Row>
          )}
          {handshake.status === 1 && (
            <>
              <Row style={{ textAlign: "center" }}>
                <Col span={24}>
                  <Button
                    type="link"
                    htmlType="submit"
                    shape="round"
                    onClick={() => handleLockTokensModal(handshake.request_id)}
                    icon={<LockOutlined style={{ fontSize: "24px" }} />}
                    disabled={
                      (handshake.dealer.toString() == user.accountName &&
                        handshakeNegotiation &&
                        handshakeNegotiation.lock_by_dealer == true) ||
                      (handshake.bidder.toString() == user.accountName &&
                        handshakeNegotiation &&
                        handshakeNegotiation.lock_by_bidder == true)
                        ? true
                        : false
                    }
                  />
                  <Modal
                    title="Are you sure you want to lock the tokens?"
                    okText="Accept"
                    cancelText="Cancel"
                    onOk={async () => {
                      setButtonLoading(true);
                      handleLock(
                        handshake.dealer.toString() == user.accountName
                          ? parseInt(
                              (
                                negotiation?.proposed_prices[
                                  negotiation.proposed_prices.length - 1
                                ] || "0.0000 DHS"
                              ).slice(
                                0,
                                (
                                  negotiation?.proposed_prices[
                                    negotiation.proposed_prices.length - 1
                                  ] || "0.0000 DHS"
                                ).length - 4
                              )
                            ) + 30
                          : 30
                      );
                    }}
                    onCancel={() => setLockTokensModalVisible(false)}
                    visible={lockTokensModalVisible}
                    okButtonProps={{
                      loading: buttonLoading,
                    }}
                    centered
                  >
                    {handshake.dealer.toString() == user.accountName ? (
                      <Typography.Text>
                        This operation will block{" "}
                        <b>
                          {parseInt(
                            (
                              negotiation?.proposed_prices[
                                negotiation.proposed_prices.length - 1
                              ] || ""
                            ).slice(
                              0,
                              (negotiation?.proposed_prices[
                                negotiation.proposed_prices.length - 1
                              ].length || 4) - 4
                            )
                          ) + 30}{" "}
                          DHS tokens
                        </b>{" "}
                        from your balance for service payments (
                        <b>
                          {parseInt(
                            (
                              negotiation?.proposed_prices[
                                negotiation.proposed_prices.length - 1
                              ] || ""
                            ).slice(
                              0,
                              (negotiation?.proposed_prices[
                                negotiation.proposed_prices.length - 1
                              ].length || 4) - 4
                            )
                          )}{" "}
                          DHS tokens
                        </b>{" "}
                        handshake price and <b>{30} DHS</b> fixed stake price)
                      </Typography.Text>
                    ) : (
                      <Typography.Text>
                        This operation will block <b>{30} DHS tokens</b> from
                        your balance for the fixed stake price payment.
                      </Typography.Text>
                    )}
                  </Modal>
                </Col>
              </Row>
            </>
          )}
          {handshake.status === 2 && (
            <>
              {!isExpired && handshake.bidder.toString() === user.accountName && (
                <Row style={{ textAlign: "center" }}>
                  <Col span={24}>
                    <Popconfirm
                      title="Are you sure you have finished the job?"
                      onConfirm={() => handleEndJob()}
                      okText="Yes"
                      cancelText="No"
                      placement="left"
                    >
                      <Button
                        type="link"
                        htmlType="submit"
                        shape="round"
                        icon={<CarryOutOutlined style={{ fontSize: "24px" }} />}
                        onClick={() => setId(handshake.request_id)}
                      />
                    </Popconfirm>
                  </Col>
                </Row>
              )}
              {isExpired && (
                <>
                  <Row style={{ textAlign: "center" }}>
                    <Col span={24}>
                      <Popconfirm
                        title="Confirm to retrieve your locked tokens!"
                        onConfirm={() => handleExpired()}
                        okText="Confirm"
                        cancelText="Cancel"
                        placement="left"
                      >
                        <Button
                          type="link"
                          htmlType="submit"
                          shape="round"
                          icon={<UnlockOutlined style={{ fontSize: "24px" }} />}
                          onClick={() => setId(handshake.request_id)}
                          disabled={
                            unlockedByDealer || unlockedByBidder ? true : false
                          }
                        >
                          {" "}
                          UNLOCK{" "}
                        </Button>
                      </Popconfirm>
                    </Col>
                  </Row>
                </>
              )}
            </>
          )}
          {handshake.status === 3 &&
            handshake.dealer.toString() === user.accountName && (
              <>
                <Row style={{ textAlign: "center" }}>
                  <Col span={12}>
                    <Popconfirm
                      title="Continue to open a dispute"
                      onConfirm={() => handleOpenDispute()}
                      okText="Continue"
                      cancelText="No"
                      placement="left"
                    >
                      <Button
                        type="link"
                        htmlType="submit"
                        shape="round"
                        icon={<BankOutlined style={{ fontSize: "24px" }} />}
                        onClick={() => setId(handshake.request_id)}
                      />
                    </Popconfirm>
                  </Col>
                  <Col span={12}>
                    <Popconfirm
                      title="Confirm to accept the job"
                      onConfirm={() => handleAcceptJob()}
                      okText="Confirm"
                      cancelText="No"
                      placement="left"
                    >
                      <Button
                        type="link"
                        htmlType="submit"
                        shape="round"
                        icon={<TrophyOutlined style={{ fontSize: "24px" }} />}
                        onClick={() => setId(handshake.request_id)}
                      />
                    </Popconfirm>
                  </Col>
                </Row>
              </>
            )}
          {handshake.status === 4 && (
            <>
              <Row style={{ textAlign: "center" }}>
                <Col span={24}>
                  <Button
                    type="link"
                    htmlType="submit"
                    shape="round"
                    icon={<PaperClipOutlined style={{ fontSize: "24px" }} />}
                    onClick={() => handleMotivateDispute(handshake.request_id)}
                    disabled={
                      (handshake.dealer.toString() == user.accountName &&
                        handshakeDispute &&
                        handshakeDispute.dealer_motivation_hash.length === 0) ||
                      (handshake.bidder.toString() == user.accountName &&
                        handshakeDispute &&
                        handshakeDispute.bidder_motivation_hash.length === 0)
                        ? false
                        : true
                    }
                  />
                  <MotivateDisputeForm
                    visible={motivateModalVisible}
                    buttonLoader={buttonLoader}
                    onMotivate={onMotivate}
                    onCancel={() => onSetMotivateModalVisible(false)}
                    id={id}
                  />
                </Col>
              </Row>
            </>
          )}
          {handshake.status === 5 && (
            <>
              <Row style={{ textAlign: "center" }}>
                <Col span={24}>
                  <Typography.Text>
                    {" "}
                    <i>
                      <b>{votesLeft}</b> votes left
                    </i>
                  </Typography.Text>
                </Col>
              </Row>
            </>
          )}
          {handshake.status === 7 && (
            <>
              <Row style={{ textAlign: "center" }}>
                <Col span={24}>
                  <Typography.Text>
                    {votesForUser >= 2 ? (
                      <Typography>
                        You Won <SmileOutlined style={{ fontSize: "16px" }} />
                      </Typography>
                    ) : (
                      <Typography>
                        You Lost <FrownOutlined style={{ fontSize: "16px" }} />
                      </Typography>
                    )}
                  </Typography.Text>
                </Col>
              </Row>
            </>
          )}
        </>
      );
    },
  };

  const columns: ColumnsType<DigitalHandshake> = [
    dealerColumn,
    bidderColumn,
    contractualTermsColumn,
    priceColumn,
    deadlineColumn,
    statusColumn,
    actionsColumn,
  ];

  return (
    <Table<DigitalHandshake>
      columns={columns}
      dataSource={handshakes}
      size="middle"
      style={{ padding: "12px", height: "77vh" }}
      bordered
    />
  );
}

export default HandshakesTable;
