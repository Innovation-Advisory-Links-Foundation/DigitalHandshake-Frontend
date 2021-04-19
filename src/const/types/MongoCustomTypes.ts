type MongoProposal = {
  __v: number;
  _id: string;
  handshakeId: string;
  contractualTerms: string;
  contractualTermsHash: string;
};

type MongoMotivation = {
  __v: number;
  _id: string;
  handshakeId: string;
  motivation: string;
  motivationHash: string;
};

type MongoDispute = {
  __v: number;
  _id: string;
  handshakeId: string;
  motivation: string;
  motivationHash: string;
};

export type { MongoProposal, MongoMotivation, MongoDispute };
