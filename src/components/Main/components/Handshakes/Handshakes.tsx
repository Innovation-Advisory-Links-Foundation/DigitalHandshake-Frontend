import React, { useEffect, useState } from "react";
import { Col, message, Spin } from "antd";
import { Footer } from "../../..";
import {
  DigitalHandshake,
  MongoProposal,
  ReduxUser,
  Negotiation,
  Dispute,
} from "../../../../const";
import { EosioService, MongoService } from "../../../../services";
import EmptyPage from "../EmptyPage";
import HandshakesTable from "./components/HandshakesTable/HandshakesTable";
import { SHA256 } from "crypto-js";

type Props = {
  user: ReduxUser;
  handshakesContractualTerms: Map<string, MongoProposal>;
  digitalHandshakes: Array<DigitalHandshake>;
  negotiations: Map<string, Negotiation>;
  disputes: Map<string, Dispute>;
  onHandleSetDigitalHandshakes: (
    digitalHandshakes: Array<DigitalHandshake>
  ) => void;
  onHandleUpdateRequestContractualTerms: (requestId: string) => void;
  onHandleUpdateHandshakesNegotiations: (handshakeId: number) => void;
  onHandleUpdateHandshakeDispute: (handshakeId: number) => void;
  onHandleUpdateUserBalances: () => void;
  onHandleUpdateUserRating: () => void;
};

// This component displays an interactive table of digital handshakes where the user participate as dealer or bidder.
function Handshakes({
  user,
  handshakesContractualTerms,
  digitalHandshakes,
  negotiations,
  disputes,
  onHandleSetDigitalHandshakes,
  onHandleUpdateRequestContractualTerms,
  onHandleUpdateHandshakesNegotiations,
  onHandleUpdateHandshakeDispute,
  onHandleUpdateUserBalances,
  onHandleUpdateUserRating,
}: Props) {
  const [pageLoading, setPageLoading] = useState<boolean>(true); // Set page spinner loader visibility.

  // Modals.
  const [negotiateModalVisible, setNegotiateModalVisible] = useState<boolean>(
    false
  );
  const [motivateModalVisible, setMotivateModalVisible] = useState<boolean>(
    false
  );
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);

  /**
   * Handles the proposal negotiation in order to define the contractual terms, price and deadline for the digital handshake.
   * @param {number} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @param {string} contractualTerms The contractual terms of the request.
   * @param {number} price The price of the request.
   * @param {number} deadline The deadline of the request.
   */
  const negotiate = async (
    id: number,
    contractualTerms: string,
    price: string,
    deadline: number
  ) => {
    try {
      setButtonLoader(true);
      // Sends the tx.
      const result = await EosioService.negotiate(
        user.accountName,
        id,
        contractualTerms,
        parseInt(price),
        deadline
      );

      if (result) {
        message.error(result.toString().slice(6));
        setButtonLoader(false);
        return;
      }

      // Read the blockchain to reflect the transaction changes (waits 4 blocks).
      setTimeout(async () => {
        // Post on MongoDB
        await MongoService.createProposal(
          id.toString(),
          contractualTerms,
          SHA256(contractualTerms).toString()
        );

        // Update component state.
        onHandleUpdateRequestContractualTerms(id.toString());
        onHandleUpdateHandshakesNegotiations(id);
        setButtonLoader(false);
        setNegotiateModalVisible(false);

        // Display a message to the user.
        message.success("Your propose has been recorded correctly.");
      }, 2000);
    } catch (error) {
      console.error(error);
      message.error(error);
      throw error;
    }
  };

  /**
   * Handles the acceptance of the contractual terms.
   * @param {number} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const acceptTerms = async (id: number) => {
    try {
      // Sends the tx.
      const result = await EosioService.acceptTerms(user.accountName, id);

      if (result) {
        message.error(result.toString().slice(6));
        return;
      }

      // Read the blockchain to reflect the transaction changes (waits 4 blocks).
      setTimeout(async () => {
        // Update component state.
        onHandleSetDigitalHandshakes(
          await EosioService.getUserDigitalHandshakes(user.accountName)
        );
        onHandleUpdateHandshakesNegotiations(id);
        onHandleUpdateRequestContractualTerms(id.toString());
        onHandleUpdateUserBalances();

        // Display a message to the user.
        message.success("You have correctly accepted the contractual terms.");
      }, 2000);
    } catch (error) {
      console.error(error);
      message.error(error);
      throw error;
    }
  };

  /**
   * Handles the expiration of the handshake to retrieve the locked tokens.
   * @param {number} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const expired = async (id: number) => {
    try {
      // Sends the tx.
      const result = await EosioService.expired(user.accountName, id);

      if (result) {
        message.error(result.toString().slice(6));
        return;
      }

      // Read the blockchain to reflect the transaction changes (waits 4 blocks).

      setTimeout(async () => {
        // Update component state.
        onHandleSetDigitalHandshakes(
          await EosioService.getUserDigitalHandshakes(user.accountName)
        );
        onHandleUpdateUserBalances();

        // Display a message to the user.
        message.success("You have correctly unlocked the tokens.");
      }, 2000);
    } catch (error) {
      console.error(error);
      message.error(error);
      throw error;
    }
  };

  /**
   * Handles the tokens lock for starting a digital handshake.
   * @param {number} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @param {number} quantity The quantity of tokens to lock.
   */
  const lockTokens = async (handshakeId: number, quantity: number) => {
    try {
      // Sends the tx.
      let result = await EosioService.transferForHandshakeTokensLock(
        user.accountName,
        quantity,
        handshakeId
      );

      if (result) {
        console.error(result);
        message.error(result.toString().slice(6));
        return;
      }

      // Read the blockchain to reflect the transaction changes (waits 4 blocks).
      setTimeout(async () => {
        // Update component state.
        onHandleSetDigitalHandshakes(
          await EosioService.getUserDigitalHandshakes(user.accountName)
        );
        onHandleUpdateHandshakesNegotiations(handshakeId);
        onHandleUpdateRequestContractualTerms(handshakeId.toString());
        onHandleUpdateUserBalances();

        // Display a message to the user.
        message.success("You have correctly locked the tokens.");
      }, 2000);
    } catch (error) {
      console.error(error);
      message.error(error);
      throw error;
    }
  };

  /**
   * Handles the notification of job termination for a digital handshake.
   * @param {number} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const endJob = async (id: number) => {
    try {
      // Sends the tx.
      const result = await EosioService.endJob(user.accountName, id);

      if (result) {
        message.error(result.toString().slice(6));
        return;
      }

      // Read the blockchain to reflect the transaction changes (waits 4 blocks).
      setTimeout(async () => {
        // Update component state.
        onHandleSetDigitalHandshakes(
          await EosioService.getUserDigitalHandshakes(user.accountName)
        );

        // Display a message to the user.
        message.success("You have correctly notified the job termination.");
      }, 2000);
    } catch (error) {
      console.error(error);
      message.error(error);
      throw error;
    }
  };

  /**
   * Handles the dealer's acceptance of the bidder's work.
   * @param {number} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const acceptJob = async (id: number) => {
    try {
      // Sends the tx.
      const result = await EosioService.acceptJob(user.accountName, id);

      if (result) {
        message.error(result.toString().slice(6));
        return;
      }

      // Read the blockchain to reflect the transaction changes (waits 4 blocks).
      setTimeout(async () => {
        // Update component state.
        onHandleSetDigitalHandshakes(
          await EosioService.getUserDigitalHandshakes(user.accountName)
        );

        onHandleUpdateUserBalances();
        onHandleUpdateUserRating();

        // Display a message to the user.
        message.success("You have correctly accepted the job.");
      }, 2000);
    } catch (error) {
      console.error(error);
      message.error(error);
      throw error;
    }
  };

  /**
   * Handles the opening of the dispute for a handshake.
   * @param {number} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const openDispute = async (id: number) => {
    try {
      // Sends the tx.
      const result = await EosioService.openDispute(user.accountName, id);

      if (result) {
        message.error(result.toString().slice(6));
        return;
      }

      // Read the blockchain to reflect the transaction changes (waits 4 blocks).
      setTimeout(async () => {
        // Update component state.
        onHandleSetDigitalHandshakes(
          await EosioService.getUserDigitalHandshakes(user.accountName)
        );
        onHandleUpdateHandshakeDispute(id);

        // Display a message to the user.
        message.success("You have correctly opened the dispute.");
      }, 2000);
    } catch (error) {
      console.error(error);
      message.error(error);
      throw error;
    }
  };

  /**
   * Handles the sending of the motivations relating to the dispute opening.
   * @param {string} motivation The motivation of the user.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const motivate = async (id: string, motivation: string) => {
    try {
      setButtonLoader(true);

      // Sends the tx.
      const result = await EosioService.motivate(
        user.accountName,
        parseInt(id),
        motivation
      );

      if (result) {
        message.error(result.toString().slice(6));
        setButtonLoader(false);
        return;
      }

      // Read the blockchain to reflect the transaction changes (waits 4 blocks).
      setTimeout(async () => {
        // Post on MongoDB
        await MongoService.createMotivation(
          id.toString(),
          motivation,
          SHA256(motivation).toString()
        );

        // Update component state.
        onHandleSetDigitalHandshakes(
          await EosioService.getUserDigitalHandshakes(user.accountName)
        );
        onHandleUpdateHandshakeDispute(parseInt(id));
        setButtonLoader(false);
        setMotivateModalVisible(false);

        // Display a message to the user.
        message.success("Your have correctly sent your motivation.");
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
            {digitalHandshakes.length <= 0 ? (
              <EmptyPage isRequestPage={false} />
            ) : (
              <HandshakesTable
                user={user}
                handshakes={digitalHandshakes}
                handshakesContractualTerms={handshakesContractualTerms}
                negotiations={negotiations}
                disputes={disputes}
                negotiateModalVisible={negotiateModalVisible}
                motivateModalVisible={motivateModalVisible}
                buttonLoader={buttonLoader}
                onNegotiate={negotiate}
                onMotivate={motivate}
                onAcceptTerms={acceptTerms}
                onEndJob={endJob}
                onAcceptJob={acceptJob}
                onOpenDispute={openDispute}
                onLockTokens={lockTokens}
                onExpired={expired}
                onSetNegotiateModalVisible={setNegotiateModalVisible}
                onSetMotivateModalVisible={setMotivateModalVisible}
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
          <></>
        )}
      </Col>
      <Footer />
    </>
  );
}

export default Handshakes;
