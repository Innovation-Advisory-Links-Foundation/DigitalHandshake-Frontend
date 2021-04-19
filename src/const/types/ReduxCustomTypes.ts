type Balance = {
  current: number;
  locked: number;
};

type ReduxUser = {
  accountName: string;
  role: string;
  rating: number;
  balance: Balance;
};

export type { ReduxUser };
