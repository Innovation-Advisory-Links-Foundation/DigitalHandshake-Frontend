import { PlusOutlined } from "@ant-design/icons";
import { message, Col, Spin, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import { Footer } from "../../..";
import {
  DigitalHandshake,
  MongoProposal,
  ReduxUser,
  Request,
} from "../../../../const";
import { EosioService, MongoService } from "../../../../services";
import EmptyPage from "../EmptyPage";
import PostNewRequestForm from "./components/PostNewRequestForm";
import RequestsTable from "./components/RequestsTable";

type Props = {
  user: ReduxUser;
  requests: Array<Request>;
  biddersRatings: Map<string, number>;
  requestsContractualTerms: Map<string, MongoProposal>;
  onHandleSetCurrentDealerRequests: (requests: Array<Request>) => void;
  onHandleUpdateBidderRating: (bidderAccountName: string) => void;
  onHandleUpdateRequestContractualTerms: (requestId: string) => void;
  onHandleSetDigitalHandshakes: (
    digitalHandshakes: Array<DigitalHandshake>
  ) => void;
  onHandleUpdateHandshakesNegotiations: (requestId: number) => void;
};

// This component displays an interactive table of requests made by the user.
function Requests({
  user,
  requests,
  biddersRatings,
  requestsContractualTerms,
  onHandleSetCurrentDealerRequests,
  onHandleUpdateBidderRating,
  onHandleUpdateRequestContractualTerms,
  onHandleSetDigitalHandshakes,
  onHandleUpdateHandshakesNegotiations,
}: Props) {
  const [pageLoading, setPageLoading] = useState<boolean>(true); // Set page spinner loader visibility.

  // Modal.
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Set modal window visibility.
  const [postButtonLoader, setPostButtonLoader] = useState<boolean>(false); // Set button loader.

  /**
   * Handles the forwarding of the request by the user.
   * @param {string} summary The summary of the request.
   * @param {string} contractualTerms The contractual terms of the request.
   * @param {number} price The price of the request.
   * @param {number} deadline The deadline of the request.
   */
  const postRequest = async (
    summary: string,
    contractualTerms: string,
    price: number,
    deadline: number
  ) => {
    try {
      setPostButtonLoader(true);

      // Sends the tx.
      const result = await EosioService.postNewRequest(
        user.accountName,
        summary,
        contractualTerms,
        price,
        deadline
      );

      if (result) {
        message.error(result.toString().slice(6));
        setPostButtonLoader(false);
        return;
      }

      // Read the blockchain to reflect the transaction changes (waits 4 blocks).
      setTimeout(async () => {
        // Retrieve the updated data.
        const dealerRequests = await EosioService.getDealerRequests(
          user.accountName
        );
        const lastRequest = dealerRequests[dealerRequests.length - 1];

        // Post on MongoDB
        await MongoService.createProposal(
          lastRequest.id.toString(),
          contractualTerms,
          lastRequest.contractual_terms_hash
        );

        // Update component state.
        onHandleUpdateRequestContractualTerms(lastRequest.id.toString());
        onHandleSetCurrentDealerRequests(dealerRequests);

        setPostButtonLoader(false);
        setModalVisible(false);

        // Display a message to the user.
        message.success("Your request has been posted correctly.");
      }, 2000);
    } catch (error) {
      console.error(error);
      message.error(error);
      throw error;
    }
  };

  /**
   * Handles the bidder selection to offer a particular service for a request.
   * @param {number} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @param {string} bidderAccountName The eosio account name of the bidder.
   */
  const selectBidder = async (id: number, bidderAccountName?: string) => {
    try {
      // Sends the tx.
      const result = await EosioService.selectBidder(
        user.accountName,
        bidderAccountName || "",
        id
      );

      if (result) {
        message.error(result.toString().slice(6));
        return;
      }

      // Read the blockchain to reflect the transaction changes (waits 4 blocks).
      setTimeout(async () => {
        onHandleSetCurrentDealerRequests(
          await EosioService.getDealerRequests(user.accountName)
        );
        onHandleSetDigitalHandshakes(
          await EosioService.getUserDigitalHandshakes(user.accountName)
        );
        onHandleUpdateHandshakesNegotiations(id);

        // Display a message to the user.
        message.success("Your choice has been recorded correctly.");
      }, 2000);
    } catch (error) {
      console.error(error);
      message.error(error);
      throw error;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 2000);
  });

  return (
    <>
      <Col span={24}>
        {!pageLoading && (
          <>
            {requests.length <= 0 ? (
              <EmptyPage isRequestPage={true} />
            ) : (
              <RequestsTable
                requests={requests}
                biddersRatings={biddersRatings}
                requestsContractualTerms={requestsContractualTerms}
                onHandleSelectBidder={selectBidder}
                onHandleUpdateBidderRating={onHandleUpdateBidderRating}
                onHandleUpdateRequestContractualTerms={
                  onHandleUpdateRequestContractualTerms
                }
              />
            )}
          </>
        )}
        {pageLoading ? (
          <Spin
            size="large"
            tip={"Loading..."}
            spinning={pageLoading}
            style={{
              marginLeft: "45vw",
              padding: "16px 50px",
              textAlign: "center",
              height: "56vh",
              marginTop: "20vh",
            }}
          />
        ) : (
          <Row justify="end" align="middle">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              shape="circle"
              icon={<PlusOutlined />}
              style={{
                marginRight: "16px",
                width: "64px",
                height: "64px",
              }}
              onClick={() => setModalVisible(true)}
            />
            <PostNewRequestForm
              visible={modalVisible}
              postButtonLoader={postButtonLoader}
              onPost={postRequest}
              onCancel={() => setModalVisible(false)}
            />
          </Row>
        )}
      </Col>
      <Footer />
    </>
  );
}

export default Requests;
