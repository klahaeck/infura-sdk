import { ethers, utils } from 'ethers';
import { TEMPLATES } from '../NFT/constants.js';
import smartContractArtifact from './artifacts/ERC721UserMintable.js';
import { isBoolean, isDefined } from '../utils.js';
import { networkErrorHandler, errorLogger, ERROR_LOG } from '../error/handler.js';

export default class ERC721UserMintable {
  #gasLimit = 6000000;

  contractAddress;

  #contractDeployed;

  #signer;

  #template = TEMPLATES.ERC721UserMintable;

  constructor(signer) {
    this.#signer = signer;
  }

  getTemplate() {
    return this.#template;
  }

  /**
   * Deploy ERC721UserMintable Contract. Used by the SDK class
   * @param {string} name Name of the contract
   * @param {string} symbol Symbol of the contract
   * @param {string} baseURI baseURI for the contract
   * @param {string} maxSupply Maximum supply of tokens for the contract
   * @param {string} maxSupply Price to mint one token
   * (link to a JSON file describing the contract's metadata)
   * @returns void
   */
  async deploy({ name, symbol, baseURI, maxSupply, price }) {
    if (this.contractAddress || this.#contractDeployed) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_deploy,
          message: ERROR_LOG.message.contract_already_deployed,
        }),
      );
    }

    if (!this.#signer) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_deploy,
          message: ERROR_LOG.message.no_signer_instance_supplied,
        }),
      );
    }

    if (!name) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_deploy,
          message: ERROR_LOG.message.no_name_supplied,
        }),
      );
    }

    if (symbol === undefined) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_deploy,
          message: ERROR_LOG.message.no_symbol_supplied,
        }),
      );
    }

    if (baseURI === undefined) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_deploy,
          message: ERROR_LOG.message.no_contractURI_supplied,
        }),
      );
    }

    if (maxSupply === undefined) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_deploy,
          message: ERROR_LOG.message.invalid_max_supply,
        }),
      );
    }

    if (price === undefined) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_deploy,
          message: ERROR_LOG.message.invalid_price,
        }),
      );
    }

    try {
      const factory = new ethers.ContractFactory(
        smartContractArtifact.abi,
        smartContractArtifact.bytecode,
        this.#signer,
      );

      const priceInWei = utils.parseEther(price);

      // TODO remove rest parameter for destructuring (more secure)
      const contract = await factory.deploy(name, symbol, baseURI, maxSupply, priceInWei);

      this.#contractDeployed = await contract.deployed();

      this.contractAddress = contract.address;
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(`[${type}[ERC721UserMintable.deploy] An error occured: ${message}`);
    }
  }

  /**
   * Load an ERC721UserMintable contract from an existing contract address. Used by the SDK class
   * @param {string} contractAddress Address of the ERC721UserMintable contract to load
   * @returns void
   */
  async loadContract({ contractAddress }) {
    if (this.contractAddress || this.#contractDeployed) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_loadContract,
          message: ERROR_LOG.message.contract_already_loaded,
        }),
      );
    }

    if (!contractAddress || !ethers.utils.isAddress(contractAddress)) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_loadContract,
          message: ERROR_LOG.message.invalid_contract_address,
        }),
      );
    }

    try {
      this.#contractDeployed = new ethers.Contract(
        contractAddress,
        smartContractArtifact.abi,
        this.#signer,
      );

      this.contractAddress = contractAddress;
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(`[${type}[ERC721UserMintable.loadContract] An error occured: ${message}`);
    }
  }

  async mint({ quantity, cost }) {
    if (!this.#contractDeployed && !this.contractAddress) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_mint,
          message: ERROR_LOG.message.contract_not_deployed_or_loaded,
        }),
      );
    }

    // TODO: Review!!!
    if (!quantity || !Number.isInteger(quantity) || !(quantity > 0 && quantity <= 20)) {
      throw new Error(
        '[ERC721UserMintable.mint] Quantity as integer value between 1 and 20 is required',
      );
    }

    const parsedCost = ethers.utils.parseEther(cost);

    try {
      return await this.#contractDeployed.mint(quantity, {
        value: parsedCost,
        gasLimit: this.#gasLimit,
      });
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(`[${type}[ERC721UserMintable.mint] An error occured: ${message}`);
    }
  }

  /**
   * Returns the value of the mint per token (in Ether)
   * @returns {Number} value in Ether of the mint per token
   */
  async price() {
    try {
      const price = await this.#contractDeployed.price();
      return utils.formatEther(price);
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(`[${type}[ERC721UserMintable.price] An error occured: ${message}`);
    }
  }

  /**
   * Reserves (mints) an amount of tokens to the owner of the contract
   * @param quantity The quantity of tokens to mint to the owner (1-20)
   * @returns {Promise<ethers.providers.TransactionResponse>} Transaction
   */
  async reserve({ quantity }) {
    if (!this.#contractDeployed && !this.contractAddress) {
      throw new Error('[ERC721UserMintable.reserve] A contract should be deployed or loaded first');
    }

    if (!quantity || !Number.isInteger(quantity) || !(quantity > 0 && quantity <= 20)) {
      throw new Error(
        '[ERC721UserMintable.reserve] Quantity as integer value between 1 and 20 is required',
      );
    }

    try {
      return await this.#contractDeployed.reserve(quantity);
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(`[${type}[ERC721UserMintable.reserve] An error occured: ${message}`);
    }
  }

  /**
   * Sets the status of the contract to revealed and sets the baseURI
   * @param baseURI The baseURI of the contract
   * @returns {Promise<ethers.providers.TransactionResponse>} Transaction
   */
  async reveal({ baseURI }) {
    if (!this.#contractDeployed && !this.contractAddress) {
      throw new Error('[ERC721UserMintable.reveal] A contract should be deployed or loaded first!');
    }

    if (!baseURI) {
      throw new Error('[ERC721UserMintable.reveal] A valid base uri is required!');
    }

    try {
      return await this.#contractDeployed.reveal(baseURI);
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(`[${type}[ERC721UserMintable.reveal] An error occured: ${message}`);
    }
  }

  /**
   * Returns receiver address and royalty amount based on sell price
   * @param {number} - Token ID
   * @param {number} - Sell price
   * @returns {Promise<object>} - Returns receiver address and bigNumber
   * representing royalty amount based on sell price
   */
  async royaltyInfo({ tokenId, sellPrice }) {
    if (!this.#contractDeployed && !this.contractAddress) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_royaltyInfo,
          message: ERROR_LOG.message.contract_not_deployed,
        }),
      );
    }

    if (!isDefined(tokenId)) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_royaltyInfo,
          message: ERROR_LOG.message.no_tokenId_supplied,
        }),
      );
    }

    if (!sellPrice) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_royaltyInfo,
          message: ERROR_LOG.message.no_sell_price_supplied,
        }),
      );
    }

    try {
      return await this.#contractDeployed.royaltyInfo(tokenId, sellPrice);
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(`[${type}[ERC721UserMintable.royaltyInfo] An error occured: ${message}`);
    }
  }

  /**
   * setBaseURI function: Set the "baseURI" metadata for the specified contract
   * @param {string} baseURI baseURI for the contract
   * (URI to a JSON file describing the contract's metadata)
   * @returns {Promise<ethers.providers.TransactionResponse>} Transaction
   */
  async setBaseURI({ baseURI }) {
    if (!this.#contractDeployed && !this.contractAddress) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_setContractURI,
          message: ERROR_LOG.message.contract_not_deployed_or_loaded,
        }),
      );
    }

    if (!baseURI) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_setContractURI,
          message: ERROR_LOG.message.invalid_contractURI,
        }),
      );
    }

    try {
      return await this.#contractDeployed.setBaseURI(baseURI);
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(`[${type}[ERC721UserMintable.setBaseURI] An error occured: ${message}`);
    }
  }

  /**
   * Sets the price (in Ether) of the mint
   * @param price Price of the mint (per token) in Ether as a string
   * @returns {Promise<ethers.providers.TransactionResponse>} Transaction
   */
  async setPrice({ price }) {
    if (!this.#contractDeployed && !this.contractAddress) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_setPrice,
          message: ERROR_LOG.message.contract_not_deployed,
        }),
      );
    }

    if (price === undefined) {
      throw new Error('[ERC721UserMintable.setPrice] price cannot be undefined');
    }

    try {
      const priceInWei = utils.parseEther(price);
      return await this.#contractDeployed.setPrice(priceInWei);
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(`[${type}[ERC721UserMintable.setPrice] An error occured: ${message}`);
    }
  }

  /**
   * Set royalties information for the receiver address with the provided fee
   * @param {string} - address
   * @param {number} - fee
   * @returns {Promise<ethers.providers.TransactionResponse>} - Transaction
   */
  async setRoyalties({ publicAddress, fee }) {
    if (!this.#contractDeployed && !this.contractAddress) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_setRoyalties,
          message: ERROR_LOG.message.contract_not_deployed,
        }),
      );
    }

    if (!publicAddress || !utils.isAddress(publicAddress)) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_setRoyalties,
          message: ERROR_LOG.message.no_address_supplied,
        }),
      );
    }

    if (!fee || !Number.isInteger(fee) || !(fee > 0 && fee < 10000)) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_setRoyalties,
          message: ERROR_LOG.message.fee_must_be_between_0_and_10000,
        }),
      );
    }

    try {
      return await this.#contractDeployed.setRoyalties(publicAddress, fee, {
        gasLimit: this.#gasLimit,
      });
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(`[${type}[ERC721UserMintable.setRoyalties] An error occured: ${message}`);
    }
  }

  /**
   * Toggles the sale status of the contract
   * @returns {Promise<ethers.providers.TransactionResponse>} Transaction
   */
  async toggleSale() {
    if (!this.#contractDeployed && !this.contractAddress) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_toggleSale,
          message: ERROR_LOG.message.contract_not_deployed,
        }),
      );
    }

    try {
      return await this.#contractDeployed.toggleSale();
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(`[${type}[ERC721UserMintable.toggleSale] An error occured: ${message}`);
    }
  }

  /**
   * Transfer function: Transfer the token 'tokenId' between 'from' and 'to addresses.
   * @param {string} from Address who will transfer the token
   * @param {string} to Address that will receive the token
   * @param {number} tokenId ID of the token that will be transfered
   * @returns {Promise<ethers.providers.TransactionResponse>} Transaction
   */
  async transfer({ from, to, tokenId }) {
    if (!this.#contractDeployed && !this.contractAddress) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_transfer,
          message: ERROR_LOG.message.contract_not_deployed_or_loaded,
        }),
      );
    }

    if (!from || !ethers.utils.isAddress(from)) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_transfer,
          message: ERROR_LOG.message.invalid_from_address,
        }),
      );
    }

    if (!to || !ethers.utils.isAddress(to)) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_transfer,
          message: ERROR_LOG.message.invalid_to_address,
        }),
      );
    }

    if (!Number.isInteger(tokenId)) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_transfer,
          message: ERROR_LOG.message.tokenId_must_be_integer,
        }),
      );
    }

    try {
      return await this.#contractDeployed['safeTransferFrom(address,address,uint256)'](
        from,
        to,
        tokenId,
        {
          gasLimit: this.#gasLimit,
        },
      );
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(`[${type}[ERC721UserMintable.transfer] An error occured: ${message}`);
    }
  }

  /**
   * setApprovalForAll will give the full approval rights for a given address
   * @param {string} to Address which will receive the approval rights
   * @param {boolean} approvalStatus Boolean representing the approval to be given (true)
   *  or revoked (false)
   * @returns {Promise<ethers.providers.TransactionResponse>} Transaction
   */
  async setApprovalForAll({ to, approvalStatus }) {
    if (!this.#contractDeployed && !this.contractAddress) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_setApprovalForAll,
          message: ERROR_LOG.message.contract_not_deployed_or_loaded,
        }),
      );
    }

    if (!to || !ethers.utils.isAddress(to)) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_setApprovalForAll,
          message: ERROR_LOG.message.no_to_address,
        }),
      );
    }

    if (!isBoolean(approvalStatus)) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_setApprovalForAll,
          message: ERROR_LOG.message.approvalStatus_must_be_boolean,
        }),
      );
    }

    try {
      return await this.#contractDeployed.setApprovalForAll(to, approvalStatus);
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(
        `[${type}[ERC721UserMintable.setApprovalForAll] An error occured: ${message}`,
      );
    }
  }

  /**
   * Gives permission to to to transfer tokenId token to another address.
   * @param {string} to the address that will be approved to do the transfer.
   * @param {number} tokenId tokenId the nft id to transfer.
   * @returns {Promise<ethers.providers.TransactionResponse>} Transaction
   */
  async approveTransfer({ to, tokenId }) {
    if (!this.#contractDeployed && !this.contractAddress) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_approveTransfer,
          message: ERROR_LOG.message.contract_not_deployed_or_loaded,
        }),
      );
    }

    if (!to || !ethers.utils.isAddress(to)) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_approveTransfer,
          message: ERROR_LOG.message.invalid_to_address,
        }),
      );
    }

    if (!Number.isInteger(tokenId)) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_approveTransfer,
          message: ERROR_LOG.message.tokenId_must_be_integer,
        }),
      );
    }

    try {
      return await this.#contractDeployed.approve(to, tokenId);
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(`[${type}[ERC721UserMintable.approveTransfer] An error occured: ${message}`);
    }
  }

  /**
   * Renouncing ownership of the smart contract (will leave the contract without an owner).
   * @returns {Promise<ethers.providers.TransactionResponse>} Transaction
   */
  async renounceOwnership() {
    if (!this.contractAddress && !this.#contractDeployed) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_renounceOwnership,
          message: ERROR_LOG.message.contract_not_deployed,
        }),
      );
    }

    try {
      return await this.#contractDeployed.renounceOwnership();
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(
        `[${type}[ERC721UserMintable.renounceOwnership] An error occured: ${message}`,
      );
    }
  }

  /**
   * Withdraws ether balance to owner address
   * @returns {Promise<ethers.providers.TransactionResponse>} Transaction
   */
  async withdraw() {
    if (!this.contractAddress && !this.#contractDeployed) {
      throw new Error(
        errorLogger({
          location: ERROR_LOG.location.ERC721UserMintable_withdraw,
          message: ERROR_LOG.message.contract_not_deployed,
        }),
      );
    }

    try {
      return await this.#contractDeployed.withdraw();
    } catch (error) {
      const { message, type } = networkErrorHandler(error);
      throw new Error(`[${type}[ERC721UserMintable.withdraw] An error occured: ${message}`);
    }
  }
}
