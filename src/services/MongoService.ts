import axios from "axios";

class MongoService {
  /**
   * Retrieve encrypted info for a specific user from the MongoDB instance.
   * @param {string} accountName The EOSIO account name of the user.
   * @returns {Promise<any>} An object containing the user info.
   */
  static async getUserInfoByAccountName(accountName: string): Promise<any> {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_MONGODB_EXPRESS_NODE_SERVER_ENDPOINT}/${process.env.REACT_APP_USER_API}/${accountName}` ||
          `http://localhost:8080/api/v1/users/${accountName}`
      );

      if (response.status === 200 && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Retrieve proposals info for a specific handshake from the MongoDB instance.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @returns {Promise<any>} An object containing the proposals array.
   */
  static async getAllProposalsForHandshake(id: string): Promise<any> {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_MONGODB_EXPRESS_NODE_SERVER_ENDPOINT}/${process.env.REACT_APP_NEGOTIATIONS_API}/${id}` ||
          `http://localhost:8080/api/v1/negotiations/${id}`
      );

      if (response.status === 200 && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Retrieve the last proposal info for a specific handshake from the MongoDB instance.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @returns {Promise<any>} An object containing the proposals array.
   */
  static async getLastContractualTermsProposal(id: string): Promise<any> {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_MONGODB_EXPRESS_NODE_SERVER_ENDPOINT}/${process.env.REACT_APP_NEGOTIATIONS_API}/last/${id}` ||
          `http://localhost:8080/api/v1/negotiations/last/${id}`
      );

      if (response.status === 200 && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Create a proposal for a specific handshake.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @param {string} contractualTerms The contractual terms.
   * @param {string} contractualTermsHash The contractual terms hash.
   * @returns {Promise<any>} todo.
   */
  static async createProposal(
    id: string,
    contractualTerms: string,
    contractualTermsHash: string
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_MONGODB_EXPRESS_NODE_SERVER_ENDPOINT}/${process.env.REACT_APP_NEGOTIATIONS_API}/` ||
          `http://localhost:8080/api/v1/negotiations/`,
        {
          handshakeId: id,
          contractualTerms,
          contractualTermsHash,
        }
      );

      if (response.status === 201 && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Create a motivation for a specific handshake dispute.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @param {string} contractualTerms The motivation.
   * @param {string} contractualTermsHash The motivation hash.
   * @returns {Promise<any>} todo.
   */
  static async createMotivation(
    id: string,
    motivation: string,
    motivationHash: string
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_MONGODB_EXPRESS_NODE_SERVER_ENDPOINT}/${process.env.REACT_APP_MOTIVATIONS_API}/` ||
          `http://localhost:8080/api/v1/motivations/`,
        {
          handshakeId: id,
          motivation,
          motivationHash,
        }
      );

      if (response.status === 201 && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Retrieve the motivations info for a specific handshake from the MongoDB instance.
   * @param {string} id The unique identifier (the same id relates the request, handshake and, eventually, dispute).
   * @returns {Promise<any>} An object containing the motivations array.
   */
  static async getDisputeMotivations(id: string): Promise<any> {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_MONGODB_EXPRESS_NODE_SERVER_ENDPOINT}/${process.env.REACT_APP_MOTIVATIONS_API}/${id}` ||
          `http://localhost:8080/api/v1/motivations/${id}`
      );

      if (response.status === 200 && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default MongoService;
