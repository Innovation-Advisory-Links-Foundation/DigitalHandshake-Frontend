import React, { useEffect, useState } from "react";
import { Col, message, Spin } from "antd";
import { Footer } from "../../..";
import { ReduxUser, Dispute, MongoDispute } from "../../../../const";
import EmptyPage from "../EmptyPage";
import DisputesTable from "./components/DisputesTable";
import { EosioService } from "../../../../services";

type Props = {
  user: ReduxUser;
  disputes: Array<Dispute>;
  onHandleUpdateJurorDisputes: () => void;
  disputesMotivations: Map<string, Array<MongoDispute>>;
  onHandleUpdateUserBalances: () => void;
};

// This component displays the digital handshakes where the juror has been selected for the voting process.
function Disputes({
  user,
  disputes,
  disputesMotivations,
  onHandleUpdateJurorDisputes,
  onHandleUpdateUserBalances,
}: Props) {
  const [pageLoading, setPageLoading] = useState<boolean>(true); // Set page spinner loader visibility.

  /**
   * Handles the vote action as a juror.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @param {string} preference The eosio account name of the dealer or bidder.
   */
  const vote = async (id: number, preference: string) => {
    try {
      // Sends the tx.
      const result = await EosioService.vote(user.accountName, id, preference);

      if (result) {
        message.error(result.toString().slice(6));
        return;
      }

      // Read the blockchain to reflect the transaction changes (waits 4 blocks).
      setTimeout(async () => {
        // Update component state.
        onHandleUpdateJurorDisputes();
        onHandleUpdateUserBalances();

        // Display a message to the user.
        message.success("You have correctly casted your vote.");
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
            {disputes.length <= 0 ? (
              <EmptyPage isRequestPage={false} />
            ) : (
              <DisputesTable
                user={user}
                disputes={disputes}
                disputesMotivations={disputesMotivations}
                onVote={vote}
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

export default Disputes;
