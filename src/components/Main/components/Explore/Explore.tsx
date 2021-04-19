import React, { useEffect, useState } from "react";
import { Col, message, Spin } from "antd";
import { Footer } from "../../..";
import { MongoProposal, ReduxUser, Request } from "../../../../const";
import { EosioService } from "../../../../services";
import EmptyPage from "../EmptyPage";
import ExploreTable from "./components/ExploreTable/ExploreTable";

type Props = {
  user: ReduxUser;
  requests: Array<Request>;
  biddersRatings: Map<string, number>;
  requestsContractualTerms: Map<string, MongoProposal>;
  onHandleSetOthersRequests: (requests: Array<Request>) => void;
  onHandleUpdateBidderRating: (bidderAccountName: string) => void;
  onHandleUpdateRequestContractualTerms: (requestId: string) => void;
};

// This component displays an interactive table of requests made by users on the platform.
function Explore({
  user,
  requests,
  biddersRatings,
  requestsContractualTerms,
  onHandleSetOthersRequests,
  onHandleUpdateBidderRating,
  onHandleUpdateRequestContractualTerms,
}: Props) {
  const [pageLoading, setPageLoading] = useState<boolean>(true); // Set page spinner loader visibility.

  /**
   * Handles the proposal action as a bidder.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const handlePropose = async (id: number) => {
    try {
      // Sends the tx.
      const result = await EosioService.propose(user.accountName, id);

      if (result) {
        message.error(result.toString().slice(6));
        return;
      }

      // Read the blockchain to reflect the transaction changes (waits 4 blocks).
      setTimeout(async () => {
        // Update component state.
        onHandleSetOthersRequests(
          await EosioService.getOtherUsersRequests(user.accountName)
        );
        onHandleUpdateBidderRating(user.accountName);
        onHandleUpdateRequestContractualTerms(id.toString());

        // Display a message to the user.
        message.success(
          "You have successfully proposed as a bidder for the request."
        );
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
              <EmptyPage isRequestPage={false} />
            ) : (
              <ExploreTable
                accountName={user.accountName}
                requests={requests}
                biddersRatings={biddersRatings}
                requestsContractualTerms={requestsContractualTerms}
                onHandlePropose={handlePropose}
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
          <></>
        )}
      </Col>
      <Footer />
    </>
  );
}

export default Explore;
