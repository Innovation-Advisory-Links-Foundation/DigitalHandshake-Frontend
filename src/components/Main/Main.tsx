import { message } from "antd";
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { UserAction } from "../../actions";
import {
  DigitalHandshake,
  Dispute,
  MongoDispute,
  MongoProposal,
  Negotiation,
  ReduxUser,
  Request,
} from "../../const";
import { EosioService, MongoService } from "../../services";
import Navigation from "./components/Navigation";

interface RootState {
  user: ReduxUser;
}
// Pass the Redux state as props.
const mapStateToProps = (state: RootState) => state;

// Pass the Redux actions as props.
const mapDispatchToProps = {
  setUser: UserAction.setUser,
  setBalance: UserAction.setBalance,
};

// Export a Redux connected component.
const connector = connect(mapStateToProps, mapDispatchToProps);

// Get props from Redux.
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

// The main component for maintaining updated real-time sync with the blockchain and the external DB instance.
function Main(props: Props) {
  /** Blockchain */
  const [biddersRatings, setBiddersRatings] = useState<Map<string, number>>(
    new Map<string, number>()
  ); // Maintains an updated copy of the current rating value for the users who are acting as bidders for at least one request.
  const [currentDealerRequests, setCurrentDealerRequests] = useState<
    Array<Request>
  >([]); // Maintains an updated copy of the current requests posted by the dealer.
  const [othersRequests, setOthersRequests] = useState<Array<Request>>([]); // Maintains an updated copy of the current requests posted by other users (not the current logged in).
  const [digitalHandshakes, setDigitalHandshakes] = useState<
    Array<DigitalHandshake>
  >([]); // Maintains an updated copy of the digital handshakes where the user is either dealer or bidder.
  const [negotiations, setNegotiations] = useState<Map<string, Negotiation>>(
    new Map<string, Negotiation>()
  ); // The set of contractual terms negotiated for each handshake.
  const [disputes, setDispustes] = useState<Map<string, Dispute>>(
    new Map<string, Dispute>()
  ); // Maintains an updated copy of the disputes for each handshake.
  const [jurorDisputes, setJurorDisputes] = useState<Array<Dispute>>(
    new Array<Dispute>()
  ); // Maintains an updated copy of the disputes for each handshake where the juror is selected for the voting process.

  /** MongoDB */
  const [requestsContractualTerms, setRequestsContractualTerms] = useState<
    Map<string, MongoProposal>
  >(new Map<string, MongoProposal>()); // The contractual terms proposed for each request.
  const [disputesMotivations, setDisputesMotivations] = useState<
    Map<string, Array<MongoDispute>>
  >(new Map<string, Array<MongoDispute>>()); // The set of motivations used by dealers and bidders to motivate the dispute for the handshake.

  /** Blockchain */

  /**
   * Retrieve and store the last value of rating for a given bidder.
   * @param {string} bidderAccountName The EOSIO account name of the bidder.
   */
  const updateBidderRating = async (bidderAccountName: string) => {
    // Retrieve updated info from the blockchain.
    const lastBidderRating = await EosioService.getLastBidderRating(
      bidderAccountName
    );

    // State update.
    const update = biddersRatings.set(bidderAccountName, lastBidderRating);
    setBiddersRatings(new Map<string, number>(update));
  };

  /**
   * Retrieve and store the last negotiation object for a given handshake.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const updateHandshakesNegotiations = async (id: number) => {
    // Retrieve updated info from the blockchain.
    const lastNegotiation = (
      await EosioService.getHandshakeContractualTermsNegotiation(id)
    )[0];

    // State update.
    const update = negotiations.set(id.toString(), lastNegotiation);
    setNegotiations(new Map<string, Negotiation>(update));
  };

  /**
   * Retrieve and store the last dispute object for a given handshake.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const updateHandshakeDispute = async (id: number) => {
    // Retrieve updated info from the blockchain.
    const lastDispute = (await EosioService.getHandshakeDispute(id))[0];

    // State update.
    const update = disputes.set(id.toString(), lastDispute);
    setDispustes(new Map<string, Dispute>(update));
  };

  /**
   * Retrieve and store the last disputes objects where the juror has been selected for the voting process.
   */
  const updateJurorDisputes = async () => {
    // Search for disputes where the juror has been selected as first juror.
    const disputes1 = await EosioService.getJurorDisputes(
      props.user.accountName,
      2
    );

    // Search for disputes where the juror has been selected as second juror.
    const disputes2 = await EosioService.getJurorDisputes(
      props.user.accountName,
      3
    );

    // Search for disputes where the juror has been selected as third juror.
    const disputes3 = await EosioService.getJurorDisputes(
      props.user.accountName,
      4
    );

    // State update.
    setJurorDisputes([...disputes1, ...disputes2, ...disputes3]);
  };

  /**
   * Retrieve and store the last motivations objects for a given handshake.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  const updateDisputesMotivations = async (id: string) => {
    // Retrieve updated info from the database.
    const motivations = await MongoService.getDisputeMotivations(id);

    // State update.
    const update = disputesMotivations.set(id, motivations);
    setDisputesMotivations(new Map<string, Array<MongoDispute>>(update));
  };

  /**
   * Retrieve and dispatch a Redux action with the updated balance for the current logged in user/juror.
   */
  const updateBalances = async () => {
    // Read user balance from blockchain.
    const userBalance = await EosioService.getCurrentBalance(
      props.user.accountName
    );

    // Read user locked balance from blockchain.
    const userLockedBalance = await EosioService.getCurrentLockedBalance(
      props.user.accountName
    );

    // Dispatch action.
    props.setBalance(
      userBalance ? userBalance.balance : "0.0000 DHS",
      userLockedBalance.length > 0 ? userLockedBalance[0].funds : "0.0000 DHS"
    );
  };

  /**
   * Retrieve and dispatch a Redux action with the updated rating for the current logged in user.
   */
  const updateUserRating = async () => {
    // Read user info from blockchain.
    const userInfo = await EosioService.getUserInfoByAccountName(
      props.user.accountName
    );

    if (userInfo.length > 0)
      // Dispatch action
      props.setUser(props.user.accountName, "user", userInfo[0].rating);
  };

  /** MongoDB */

  /**
   * Retrieve and store the last contractual terms negotiated for a given request.
   * @param {string} bidderAccountName The EOSIO account name of the bidder.
   */
  const updateRequestContractualTerms = async (id: string) => {
    // Retrieve updated info from the blockchain.
    const lastContractualTermsProposal = await MongoService.getLastContractualTermsProposal(
      id
    );

    // State update.
    const update = requestsContractualTerms.set(
      id,
      lastContractualTermsProposal
    );
    setRequestsContractualTerms(new Map<string, MongoProposal>(update));
  };

  /*
   * Clean Redux state and terminate the session.
   */
  const handleLogout = () => {
    // Expire session.
    sessionStorage.removeItem("private_key");

    // Dispatch actions.
    props.setUser("", "", 0);
    props.setBalance(0, 0);
    message.success("You have successfully terminated the current session.");
  };

  useEffect(() => {
    (async () => {
      await updateBalances();

      if (props.user.role !== "juror") {
        setTimeout(async () => {
          // Read dealer requests from blockchain.
          const dealerRequests = await EosioService.getDealerRequests(
            props.user.accountName
          );

          // Read other users requests from blockchain.
          const othersRequests = await EosioService.getOtherUsersRequests(
            props.user.accountName
          );

          // Read handshakes from blockchain.
          const handshakes = await EosioService.getUserDigitalHandshakes(
            props.user.accountName
          );

          // Return if no information is present.
          if (!dealerRequests || !othersRequests || !handshakes) return;

          dealerRequests.forEach(async (request: Request) => {
            // Update bidders rating.
            if (request.bidders.length > 0)
              request.bidders.forEach(async (user: string) => {
                updateBidderRating(user);
              });

            // Update contractual terms.
            if (request.contractual_terms_hash.length > 0) {
              updateRequestContractualTerms(request.id.toString());
            }
          });

          othersRequests.forEach(async (request: Request) => {
            // Update ratings.
            if (request.bidders.length > 0)
              request.bidders.forEach(async (user: string) => {
                updateBidderRating(user);
              });

            // Update contractual terms.
            if (request.contractual_terms_hash.length > 0) {
              updateRequestContractualTerms(request.id.toString());
            }
          });

          handshakes.forEach(async (handshake: DigitalHandshake) => {
            // Update negotiations and disputes.
            updateHandshakesNegotiations(handshake.request_id);
            updateHandshakeDispute(handshake.request_id);
          });

          // State update.
          setCurrentDealerRequests(dealerRequests);
          setOthersRequests(othersRequests);
          setDigitalHandshakes(handshakes);
        }, 1000);
      } else {
        setTimeout(async () => {
          // Retrieve disputes where the juror is selected.
          const disputes1 = await EosioService.getJurorDisputes(
            props.user.accountName,
            2
          );
          const disputes2 = await EosioService.getJurorDisputes(
            props.user.accountName,
            3
          );
          const disputes3 = await EosioService.getJurorDisputes(
            props.user.accountName,
            4
          );

          const disputes = [...disputes1, ...disputes2, ...disputes3];

          // Return if no information is present.
          if (!disputes) return;

          disputes.forEach((dispute: Dispute) => {
            // Update motivations.
            updateDisputesMotivations(dispute.dhs_id.toString());
          });

          // State update.
          setJurorDisputes(disputes);
        }, 1000);
      }
    })();
  }, []);

  return (
    <>
      <Navigation
        user={props.user}
        biddersRatings={biddersRatings}
        currentDealerRequests={currentDealerRequests}
        othersRequests={othersRequests}
        digitalHandshakes={digitalHandshakes}
        negotiations={negotiations}
        disputes={disputes}
        jurorDisputes={jurorDisputes}
        requestsContractualTerms={requestsContractualTerms}
        disputesMotivations={disputesMotivations}
        onHandleLogout={handleLogout}
        onHandleSetCurrentDealerRequests={setCurrentDealerRequests}
        onHandleSetOthersRequests={setOthersRequests}
        onHandleSetDigitalHandshakes={setDigitalHandshakes}
        onHandleUpdateBidderRating={updateBidderRating}
        onHandleUpdateRequestContractualTerms={updateRequestContractualTerms}
        onHandleUpdateHandshakesNegotiations={updateHandshakesNegotiations}
        onHandleUpdateHandshakeDispute={updateHandshakeDispute}
        onHandleUpdateBalances={updateBalances}
        onHandleUpdateUserRating={updateUserRating}
        onHandleUpdateJurorDisputes={updateJurorDisputes}
      />
    </>
  );
}

export default connector(Main);
