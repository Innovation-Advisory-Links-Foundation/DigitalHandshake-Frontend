type Request = {
  id: number;
  dealer: string;
  summary: string;
  contractual_terms_hash: string;
  price: string;
  deadline: number;
  status: number;
  bidders: Array<string>;
  bidder: string;
};

type DigitalHandshake = {
  request_id: number;
  dealer: string;
  bidder: string;
  contractual_terms_hash: string;
  price: string;
  deadline: number;
  status: number;
  unlock_for_expiration_by_dealer: boolean;
  unlock_for_expiration_by_bidder: boolean;
};

type Negotiation = {
  handshake_id: number;
  proposed_contractual_terms_hashes: Array<string>;
  proposed_prices: Array<string>;
  proposed_deadlines: Array<number>;
  accepted_by_dealer: boolean;
  accepted_by_bidder: boolean;
  lock_by_dealer: boolean;
  lock_by_bidder: boolean;
};

type Dispute = {
  dhs_id: number;
  dealer: string;
  bidder: string;
  juror1: string;
  juror2: string;
  juror3: string;
  vote1: string;
  vote2: string;
  vote3: string;
  dealer_motivation_hash: string;
  bidder_motivation_hash: string;
};

export type { Request, DigitalHandshake, Negotiation, Dispute };
