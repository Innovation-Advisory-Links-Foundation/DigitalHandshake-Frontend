import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import { SHA256, AES, enc } from "crypto-js";
import { ServiceContractActions, TokenContractActions } from "../const";

// Initialize JsonRpc client for RPC to eosio node.
const rpc = new JsonRpc(
  process.env.REACT_APP_EOS_HTTP_ENDPOINT || "http://localhost:8888"
);

/**
 * Helper configurable method for calling a smart contract action.
 * @param { string } contractName The name of the contract to be call.
 * @param { string } actionName The name of the action to be call.
 * @param { Record<string, string | number> } parameterValues The required parameter values for action call.
 */
async function takeAction(
  contractName: string,
  actionName: string,
  parameterValues: Record<string, string | number | null>
) {
  // Get decrypted private key from the session storage.
  const privateKey = sessionStorage.getItem("private_key");

  if (!privateKey) throw "Private key not found.";

  // Create a new JsSignatureProvider for signing txs.
  const signatureProvider = new JsSignatureProvider([privateKey]);

  // Initialize Api client for sending txs to eosio node.
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  });
  const result = await api.transact(
    {
      actions: [
        {
          account: contractName,
          name: actionName,
          authorization: [
            {
              actor: localStorage.getItem("user_eosio_account_name"),
              permission: "active",
            },
          ],
          data: parameterValues,
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  );
  return result;
}

class EosioService {
  /**
   * Retrieve user/juror info from blockchain and store the information on the local and session device storage.
   * @param {string} password The password used for encrypt/decrypt the private key.
   * @param {string} username The EOSIO account name of the user.
   * @param {string} privateKey The private key associated to the user account for signing transactions.
   */
  static async login(
    password: string,
    accountName?: string,
    privateKey?: string
  ) {
    if (!accountName && !privateKey) {
      // The user was already logged in (needs only the password to login).
      if (
        !localStorage.getItem("user_eosio_account_name") &&
        !localStorage.getItem("user_password_hash") &&
        !localStorage.getItem("user_encrypted_private_key")
      )
        throw "The information for the user is not completely available  in the local storage.";

      // Retrieve information from the local storage (persistent).
      const passwordHash = localStorage.getItem("user_password_hash");
      const encryptedPrivateKey = localStorage.getItem(
        "user_encrypted_private_key"
      );

      // Check if the hash of the given password matches with the one stored.
      if (SHA256(password).toString() !== passwordHash) throw "Wrong password.";

      // Decrypt and store the private key in the session storage.
      sessionStorage.setItem(
        "private_key",
        AES.decrypt(encryptedPrivateKey || "", password).toString(enc.Utf8)
      );
    } else {
      if (!accountName) throw "Account name is missing";

      // Retrieve user/juror info from blockchain.
      const userInfo = await EosioService.getUserInfoByAccountName(accountName);
      const jurorInfo = await EosioService.getJurorInfoByAccountName(
        accountName
      );

      // Throw an error if the user is not registered either as user or juror.
      if (userInfo.length < 1 && jurorInfo.length < 1) {
        console.error("The user is not registered on the blockchain.");
        throw "The user is not registered on the blockchain.";
      }

      // Store user information in the local storage (persistent).
      localStorage.setItem("user_eosio_account_name", accountName);
      localStorage.setItem("user_password_hash", SHA256(password).toString());

      if (!privateKey) throw "Private key is missing";

      localStorage.setItem(
        "user_encrypted_private_key",
        AES.encrypt(privateKey, password).toString()
      );

      // Store user decrypted private key in the session storage (w/ session expiration mechanism).
      sessionStorage.setItem("private_key", privateKey);
    }
  }

  /**
   * Retrieve info from 'dhsservice' contract for a specific user.
   * @param {string} accountName The EOSIO account name of the user.
   * @returns {Promise<any>} The table row containing the information.
   */
  static async getUserInfoByAccountName(accountName: string): Promise<any> {
    try {
      // Retrieve the row associated with the user account name (if not, return null).
      const result = await rpc.get_table_rows({
        json: true,
        code: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT, // Contract who owns the table.
        scope: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT, // Scope of the table.
        table: "users", // Name of the table as specified by the contract ABI.
      });
      // Return an array containing the user info.
      return result.rows.filter(
        (user: any) => user.info.username === accountName
      );
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Retrieve info from 'dhsservice' contract for a specific juror.
   * @param {string} accountName The EOSIO account name of the juror.
   * @returns {Promise<any>} The table row containing the information.
   */
  static async getJurorInfoByAccountName(accountName: string): Promise<any> {
    try {
      // Retrieve the row associated with the user account name (if not, return null).
      const result = await rpc.get_table_rows({
        json: true,
        code: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT, // Contract who owns the table.
        scope: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT, // Scope of the table.
        table: "jurors", // Name of the table as specified by the contract ABI.
      });
      // Return an array containing the juror info.
      return result.rows.filter(
        (juror: any) => juror.info.username === accountName
      );
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Retrieve balance from 'dhstoken' contract for a specific user or juror.
   * @param {string} accountName The EOSIO account name of the user or juror.
   * @returns {Promise<any>} The table row containing the current user or juror balance.
   */
  static async getCurrentBalance(accountName: string): Promise<any> {
    try {
      const result = await rpc.get_table_rows({
        json: true,
        code: process.env.REACT_APP_EOS_DHS_TOKEN_CONTRACT,
        scope: accountName,
        table: "accounts",
      });

      return result.rows[0];
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Retrieve all requests from 'dhsservice' contract and returns those made by the given user account name.
   * @param {string} dealerAccountName The EOSIO account name of the dealer.
   * @returns {Promise<any>} The table rows containing the requests made by the dealer.
   */
  static async getDealerRequests(dealerAccountName: string): Promise<any> {
    try {
      const result = await rpc.get_table_rows({
        json: true,
        code: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT,
        scope: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT,
        table: "requests",
        limit: 1000, // TODO: handle limit param dinamically.
      });
      return result.rows.filter(
        (request: any) => request.dealer === dealerAccountName
      );
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Retrieve all requests from 'dhsservice' contract and returns those users who has an account name different from the one provided.
   * @param {string} userAccountName The EOSIO account name of the user.
   * @returns {Promise<any>} The table rows containing the requests made by the user.
   */
  static async getOtherUsersRequests(userAccountName: string): Promise<any> {
    try {
      const result = await rpc.get_table_rows({
        json: true,
        code: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT,
        scope: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT,
        table: "requests",
        limit: 1000, // TODO: handle limit param dinamically.
      });
      return result.rows.filter(
        (request: any) => request.dealer !== userAccountName
      );
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Retrieve all digital handshakes from 'dhsservice' contract and returns those where the user is dealer or bidder.
   * @param {string} userAccountName The EOSIO account name of the user.
   * @returns {Promise<any>} The table rows containing the digital handshakes made by the user.
   */
  static async getUserDigitalHandshakes(userAccountName: string): Promise<any> {
    try {
      const result = await rpc.get_table_rows({
        json: true,
        code: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT,
        scope: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT,
        table: "handshakes",
        limit: 1000, // TODO: handle limit param dinamically.
      });
      return result.rows.filter(
        (digitalHandshake: any) =>
          digitalHandshake.dealer === userAccountName ||
          digitalHandshake.bidder === userAccountName
      );
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Retrieve digital handshake contractual terms negotiation from 'dhsservice' contract.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @returns {Promise<any>} The table row containing the contractual terms negotiation.
   */
  static async getHandshakeContractualTermsNegotiation(
    id: number
  ): Promise<any> {
    try {
      const result = await rpc.get_table_rows({
        json: true,
        code: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT,
        scope: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT,
        table: "negotiations",
        limit: 1000, // TODO: handle limit param dinamically.
      });

      return result.rows.filter(
        (negotiation: any) => negotiation.dhs_id === id
      );
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Retrieve balance from 'dhsescrow' contract for a specific user.
   * @param {string} accountName The EOSIO account name of the user.
   * @returns {Promise<any>} The table row containing the current user locked balance.
   */
  static async getCurrentLockedBalance(accountName: string): Promise<any> {
    try {
      const result = await rpc.get_table_rows({
        json: true,
        code: process.env.REACT_APP_EOS_DHS_ESCROW_CONTRACT,
        scope: process.env.REACT_APP_EOS_DHS_ESCROW_CONTRACT,
        table: "locked",
      });

      if (result.rows.length > 0)
        return result.rows.filter(
          (balance: any) => balance.user === accountName
        );
      else result.rows.push({ funds: "0.0000 DHS" });

      return result.rows;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Retrieve digital handshake dispute from 'dhsservice' contract.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @returns {Promise<any>} The table row containing the dispute.
   */
  static async getHandshakeDispute(id: number): Promise<any> {
    try {
      const result = await rpc.get_table_rows({
        json: true,
        code: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT,
        scope: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT,
        table: "disputes",
        limit: 1000, // TODO: handle limit param dinamically.
      });

      return result.rows.filter((dispute: any) => dispute.dhs_id === id);
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Retrieve digital handshake dispute from 'dhsservice' contract querying by secondary index.
   * @param {string} jurorAccountName The juror account name.
   * @param {number} indexPosition The index to be used for the query.
   * @returns {Promise<any>} The table row containing the dispute.
   */
  static async getJurorDisputes(
    jurorAccountName: string,
    indexPosition: number
  ): Promise<any> {
    try {
      const result = await rpc.get_table_rows({
        json: true,
        code: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT,
        scope: process.env.REACT_APP_EOS_DHS_SERVICE_CONTRACT,
        table: "disputes",
        key_type: "i64",
        index_position: indexPosition,
        lower_bound: jurorAccountName,
        limit: 1000, // TODO: handle limit param dinamically.
      });

      if (indexPosition === 2) {
        return result.rows.filter(
          (dispute: any) => dispute.juror1 === jurorAccountName
        );
      }

      if (indexPosition === 3) {
        return result.rows.filter(
          (dispute: any) => dispute.juror2 === jurorAccountName
        );
      }

      if (indexPosition === 4) {
        return result.rows.filter(
          (dispute: any) => dispute.juror3 === jurorAccountName
        );
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Send a new transaction to 'dhsservice' and calls the 'postrequest' smart contract action.
   * @param {string} dealerAccountName The EOSIO account name of the dealer.
   * @param {string} summary The summary of the request.
   * @param {string} contractualTerms The contractual terms of the request.
   * @param {string} price The price of the request.
   * @param {string} deadline The deadline of the request.
   */
  static async postNewRequest(
    dealerAccountName: string,
    summary: string,
    contractualTerms: string,
    price: number,
    deadline: number
  ) {
    try {
      // Formatting input parameters for sending the tx.
      const priceInDHSTokens = `${price.toString()}.0000 DHS`;
      const deadlineInMillis = Math.floor(deadline.valueOf() / 1000);
      const contractualTermsHash = SHA256(contractualTerms).toString();

      // Send the tx.
      await takeAction("dhsservice", ServiceContractActions.POST_REQUEST, {
        dealer: dealerAccountName,
        summary,
        contractual_terms_hash: contractualTermsHash,
        price: priceInDHSTokens,
        deadline: deadlineInMillis,
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Send a new transaction to 'dhsservice' and calls the 'propose' smart contract action.
   * @param {string} bidderAccountName The EOSIO account name of the bidder.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  static async propose(bidderAccountName: string, id: number) {
    try {
      // Send the tx.
      await takeAction("dhsservice", ServiceContractActions.PROPOSE, {
        bidder: bidderAccountName,
        request_id: id,
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Send a new transaction to 'dhsservice' and calls the 'selectbidder' smart contract action.
   * @param {string} dealer The EOSIO account name of the dealer.
   * @param {string} bidder The EOSIO account name of the selected bidder.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @param {number} contractualTermsHash The SHA256 hash of the new contractual terms.
   */
  static async selectBidder(dealer: string, bidder: string, id: number) {
    try {
      // Send the tx.
      await takeAction("dhsservice", ServiceContractActions.SELECT_BIDDER, {
        dealer,
        bidder,
        request_id: id,
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Send a new transaction to 'dhsservice' and calls the 'negotiate' smart contract action.
   * @param {string} userAccountName The EOSIO account name of the user.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @param {string} contractualTerms The contractual terms of the request.
   * @param {string} price The price of the request.
   * @param {string} deadline The deadline of the request.
   */
  static async negotiate(
    userAccountName: string,
    id: number,
    contractualTerms: string,
    price: number,
    deadline: number
  ) {
    try {
      // Formatting input parameters for sending the tx.
      const priceInDHSTokens = `${price.toString()}.0000 DHS`;
      const deadlineInMillis = Math.floor(deadline.valueOf() / 1000);
      const contractualTermsHash = SHA256(contractualTerms).toString();

      // Send the tx.
      await takeAction("dhsservice", ServiceContractActions.NEGOTIATE, {
        user: userAccountName,
        dhs_id: id,
        contractual_terms_hash: contractualTermsHash,
        price: priceInDHSTokens,
        deadline: deadlineInMillis,
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Send a new transaction to 'dhsservice' and calls the 'acceptterms' smart contract action.
   * @param {string} user The EOSIO account name of the user.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  static async acceptTerms(user: string, id: number) {
    try {
      // Send the tx.
      await takeAction("dhsservice", ServiceContractActions.ACCEPT_TERMS, {
        user,
        dhs_id: id,
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Send a new transaction to 'dhsservice' and calls the 'expired' smart contract action.
   * @param {string} user The EOSIO account name of the user.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  static async expired(user: string, id: number) {
    try {
      // Send the tx.
      await takeAction("dhsservice", ServiceContractActions.EXPIRED, {
        user,
        dhs_id: id,
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Send a new transaction to 'dhstoken' and calls the 'transfer' smart contract action indicating the 'dhsservice' as receiver (to).
   * @param {string} from The EOSIO account name of the sender.
   * @param {number} quantity The amount of tokens to send.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  static async transferForHandshakeTokensLock(
    from: string,
    quantity: number,
    id: number
  ) {
    try {
      // Formatting input parameters for sending the tx.
      const quantityInDHSTokens = `${quantity.toString()}.0000 DHS`;

      // Send the tx.
      await takeAction("dhstoken", TokenContractActions.TRANSFER, {
        from,
        to: "dhsservice",
        quantity: quantityInDHSTokens,
        memo: id.toString(),
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Send a new transaction to 'dhsservice' and calls the 'endjob' smart contract action.
   * @param {string} bidderAccountName The EOSIO account name of the bidder.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  static async endJob(bidderAccountName: string, id: number) {
    try {
      // Send the tx.
      await takeAction("dhsservice", ServiceContractActions.END_JOB, {
        bidder: bidderAccountName,
        dhs_id: id,
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Send a new transaction to 'dhsservice' and calls the 'acceptjob' smart contract action.
   * @param {string} dealerAccountName The EOSIO account name of the dealer.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  static async acceptJob(dealerAccountName: string, id: number) {
    try {
      // Send the tx.
      await takeAction("dhsservice", ServiceContractActions.ACCEPT_JOB, {
        dealer: dealerAccountName,
        dhs_id: id,
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Send a new transaction to 'dhsservice' and calls the 'opendispute' smart contract action.
   * @param {string} dealerAccountName The EOSIO account name of the dealer.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   */
  static async openDispute(dealerAccountName: string, id: number) {
    try {
      // Send the tx.
      await takeAction("dhsservice", ServiceContractActions.OPEN_DISPUTE, {
        dealer: dealerAccountName,
        dhs_id: id,
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Send a new transaction to 'dhsservice' and calls the 'motivate' smart contract action.
   * @param {string} userAccountName The EOSIO account name of the user.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @param {string} motivation The motivation for the handshake dispute.
   */
  static async motivate(
    userAccountName: string,
    id: number,
    motivation: string
  ) {
    try {
      // Formatting input parameters for sending the tx.
      const motivationHash = SHA256(motivation).toString();

      // Send the tx.
      await takeAction("dhsservice", ServiceContractActions.MOTIVATE, {
        user: userAccountName,
        dhs_id: id,
        motivation_hash: motivationHash,
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Send a new transaction to 'dhsservice' and calls the 'vote' smart contract action.
   * @param {string} jurorAccountName The EOSIO account name of the user.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @param {string} preference The vote preference (dealer/bidder).
   */
  static async vote(jurorAccountName: string, id: number, preference: string) {
    try {
      // Send the tx.
      await takeAction("dhsservice", ServiceContractActions.VOTE, {
        juror: jurorAccountName,
        dhs_id: id,
        preference,
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   * Retrieve the last value of the rating for a given bidder.
   * @param {string} bidderAccountName The EOSIO account name of the bidder.
   */
  static async getLastBidderRating(bidderAccountName: string) {
    return (await EosioService.getUserInfoByAccountName(bidderAccountName))[0]
      .rating;
  }
}

export default EosioService;
