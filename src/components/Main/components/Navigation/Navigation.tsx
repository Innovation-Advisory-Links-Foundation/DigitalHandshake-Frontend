import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Explore from "../Explore";
import Handshakes from "../Handshakes";
import Requests from "../Requests";
import Userbar from "../Userbar";
import Navbar from "./components/Navbar";
import {
  DigitalHandshake,
  Dispute,
  MongoDispute,
  MongoProposal,
  Negotiation,
  ReduxUser,
  Request,
} from "../../../../const";
import Disputes from "../Disputes";

type Props = {
  user: ReduxUser;
  biddersRatings: Map<string, number>;
  currentDealerRequests: Array<Request>;
  othersRequests: Array<Request>;
  digitalHandshakes: Array<DigitalHandshake>;
  negotiations: Map<string, Negotiation>;
  disputes: Map<string, Dispute>;
  requestsContractualTerms: Map<string, MongoProposal>;
  jurorDisputes: Array<Dispute>;
  disputesMotivations: Map<string, Array<MongoDispute>>;
  onHandleLogout: () => void;
  onHandleSetCurrentDealerRequests: (requests: Array<Request>) => void;
  onHandleSetOthersRequests: (requests: Array<Request>) => void;
  onHandleSetDigitalHandshakes: (
    digitalHandshakes: Array<DigitalHandshake>
  ) => void;
  onHandleUpdateBidderRating: (bidderAccountName: string) => void;
  onHandleUpdateRequestContractualTerms: (id: string) => void;
  onHandleUpdateHandshakesNegotiations: (id: number) => void;
  onHandleUpdateHandshakeDispute: (handshakeId: number) => void;
  onHandleUpdateBalances: () => void;
  onHandleUpdateUserRating: () => void;
  onHandleUpdateJurorDisputes: () => void;
};

// This component directs the updated information of the Main component to the other components of the application.
function Navigation({
  user,
  currentDealerRequests,
  othersRequests,
  digitalHandshakes,
  negotiations,
  disputes,
  biddersRatings,
  requestsContractualTerms,
  jurorDisputes,
  disputesMotivations,
  onHandleLogout,
  onHandleSetCurrentDealerRequests,
  onHandleSetOthersRequests,
  onHandleSetDigitalHandshakes,
  onHandleUpdateBidderRating,
  onHandleUpdateRequestContractualTerms,
  onHandleUpdateHandshakesNegotiations,
  onHandleUpdateHandshakeDispute,
  onHandleUpdateBalances,
  onHandleUpdateUserRating,
  onHandleUpdateJurorDisputes,
}: Props) {
  return (
    <>
      <Router>
        <Navbar user={user} onHandleLogout={onHandleLogout} />
        <Userbar user={user} />
        <Switch>
          <Route
            path="/explore"
            exact
            render={() => (
              <Explore
                user={user}
                requests={othersRequests}
                biddersRatings={biddersRatings}
                requestsContractualTerms={requestsContractualTerms}
                onHandleSetOthersRequests={onHandleSetOthersRequests}
                onHandleUpdateBidderRating={onHandleUpdateBidderRating}
                onHandleUpdateRequestContractualTerms={
                  onHandleUpdateRequestContractualTerms
                }
              />
            )}
          />
          <Route
            path="/requests"
            exact
            render={() => (
              <Requests
                user={user}
                requests={currentDealerRequests}
                biddersRatings={biddersRatings}
                requestsContractualTerms={requestsContractualTerms}
                onHandleSetCurrentDealerRequests={
                  onHandleSetCurrentDealerRequests
                }
                onHandleUpdateBidderRating={onHandleUpdateBidderRating}
                onHandleUpdateRequestContractualTerms={
                  onHandleUpdateRequestContractualTerms
                }
                onHandleSetDigitalHandshakes={onHandleSetDigitalHandshakes}
                onHandleUpdateHandshakesNegotiations={
                  onHandleUpdateHandshakesNegotiations
                }
              />
            )}
          />
          <Route
            path="/handshakes"
            exact
            render={() => (
              <Handshakes
                user={user}
                handshakesContractualTerms={requestsContractualTerms}
                digitalHandshakes={digitalHandshakes}
                negotiations={negotiations}
                disputes={disputes}
                onHandleSetDigitalHandshakes={onHandleSetDigitalHandshakes}
                onHandleUpdateRequestContractualTerms={
                  onHandleUpdateRequestContractualTerms
                }
                onHandleUpdateHandshakesNegotiations={
                  onHandleUpdateHandshakesNegotiations
                }
                onHandleUpdateHandshakeDispute={onHandleUpdateHandshakeDispute}
                onHandleUpdateUserBalances={onHandleUpdateBalances}
                onHandleUpdateUserRating={onHandleUpdateUserRating}
              />
            )}
          />
          <Route
            path="/disputes"
            exact
            render={() => (
              <Disputes
                user={user}
                disputes={jurorDisputes}
                disputesMotivations={disputesMotivations}
                onHandleUpdateJurorDisputes={onHandleUpdateJurorDisputes}
                onHandleUpdateUserBalances={onHandleUpdateBalances}
              />
            )}
          />
        </Switch>
        {user.role === "user" ? (
          <Redirect to="/explore" />
        ) : (
          <Redirect to="/disputes" />
        )}
      </Router>
    </>
  );
}

export default Navigation;
