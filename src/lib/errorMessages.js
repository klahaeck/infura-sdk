/* eslint-disable */
export const ERROR_MESSAGE = {
  invalid_auth_instance: 'Invalid Auth instance.',

  no_parameters_supplied: 'No parameters supplied.',
  no_template_type_supplied: 'No template type supplied.',
  no_tokenId_supplied: 'No tokenId supplied.',
  no_tokenURI_supplied: 'No tokenURI supplied.',
  no_projectId_supplied: 'No project id supplied.',
  no_secretId_supplied: 'No secret id supplied.',
  no_chainId_supplied: 'No chain id supplied.',
  no_signer_instance_supplied: 'No signer instance supplied.',
  no_name_supplied: 'No name supplied.',
  no_symbol_supplied: 'No symbol supplied.',
  no_contractURI_supplied: 'No contractURI supplied.',
  no_baseURI_supplied: 'No baseURI supplied.',
  no_address_supplied: 'No address supplied.',
  no_sell_price_supplied: 'No sell price supplied.',
  no_to_address: 'No to address.',
  no_rpcURL: 'No rpcURL.',
  no_privateKey: 'No privateKey.',
  no_provider: 'No provider.',

  invalid_contract_address: 'Invalid contract address.',
  invalid_account_address: 'Invalid account address.',
  invalid_public_address: 'Invalid public address.',
  invalid_from_address: 'Invalid from address.',
  invalid_to_address: 'Invalid to address.',
  invalid_contractURI: 'Invalid contractURI.',
  invalid_baseURI: 'Invalid baseURI.',
  invalid_template: 'Invalid template.',
  invalid_transaction_hash: 'Invalid transaction hash.',
  invalid_max_supply: 'Invalid maximum supply.',
  invalid_max_token_request: 'Invalid maximum token request.',
  invalid_price: 'Invalid price',
  invalid_mint_quantity: 'Quantity as integer value greater than 0 required.',
  invalid_provider: 'Invalid provider.',
  invalid_gas_price_supplied: 'Invalid value for gas provided',
  invalid_source: 'Source should be a file or a valid URL',

  contract_already_deployed: 'Contract already deployed.',
  contract_already_loaded: 'Contract already loaded.',
  contract_not_deployed: 'Contract not deployed.',
  contract_not_deployed_or_loaded: 'Contract not deployed or loaded.',

  fee_must_be_between_0_and_10000: 'Fee must be between 0 and 10000.',

  tokenId_must_be_integer: 'TokenId must be integer.',
  approvalStatus_must_be_boolean: 'approvalStatus must be boolean.',
  only_privateKey_or_provider_required: 'Only privateKey or provider required.',
  chain_not_supported: 'Chain not supported.',
  an_error_occured: 'An error occured',
  an_error_occured_with_ipfs_api: 'An error occured with infura ipfs api',

  no_infura_projectID_supplied: 'No projectId supplied.',
  no_infura_projectSecret_supplied: 'No projectSecret supplied.',

  media_upload_failed: 'Image files not uploaded: ',
  metadata_upload_failed: 'Metadata file not uploaded: ',
  unsupported_input: 'Input is not supported (not JSON object or filepath): ',
  invalid_input: 'Input should be a valid JSON object or a filepath: ',
};

export const ERROR_LOCATION = {
  SDK_constructor: '[SDK.constructor]',
  SDK_deploy: '[SDK.deploy]',
  SDK_loadContract: '[SDK.loadContract]',
  SDK_getContractMetadata: '[SDK.getContractMetadata]',
  SDK_getNFTs: '[SDK.getNFTs]',
  SDK_getNFTsForCollection: '[SDK.getNFTsForCollection]',
  SDK_getTokenMetadata: '[SDK.getTokenMetadata]',
  SDK_getStatus: '[SDK.GetStatus]',
  Auth_constructor: '[Auth.constructor]',

  AccessControl_addMinter: '[AccessControl.addMinter]',
  AccessControl_renounceMinter: '[AccessControl.renounceMinter]',
  AccessControl_removeMinter: '[AccessControl.removeMinter]',
  AccessControl_isMinter: '[AccessControl.isMinter]',
  AccessControl_addAdmin: '[AccessControl.addAdmin]',
  AccessControl_removeAdmin: '[AccessControl.removeAdmin]',
  AccessControl_renounceAdmin: '[AccessControl.renounceAdmin]',
  AccessControl_isAdmin: '[AccessControl.isAdmin]',
  AccessControl_renounceOwnership: '[AccessControl.renounceOwnership]',

  BaseERC721_addGasPriceToOptions: '[BaseERC721.addGasPriceToOptions]',
  BaseERC721_approveTransfer: '[BaseERC721.approveTransfer]',
  BaseERC721_setApprovalForAll: '[BaseERC721.setApprovalForAll]',
  BaseERC721_transfer: '[BaseERC721.transfer]',

  Royalties_setRoyalties: '[Royalties.setRoyalties]',
  Royalties_royaltyInfo: '[Royalties.royaltyInfo]',

  ERC721Mintable_deploy: '[ERC721Mintable.deploy]',
  ERC721Mintable_mint: '[ERC721Mintable.mint]',
  ERC721Mintable_loadContract: '[ERC721Mintable.loadContract]',
  ERC721Mintable_setContractURI: '[ERC721Mintable.setContractURI]',

  ERC721UserMintable_deploy: '[ERC721UserMintable.deploy]',
  ERC721UserMintable_mint: '[ERC721UserMintable.mint]',
  ERC721UserMintable_loadContract: '[ERC721UserMintable.loadContract]',
  ERC721UserMintable_setBaseURI: '[ERC721UserMintable.setBaseURI]',
  ERC721UserMintable_reserve: '[ERC721UserMintable.reserve]',
  ERC721UserMintable_reveal: '[ERC721UserMintable.reveal]',
  ERC721UserMintable_price: '[ERC721UserMintable.price]',
  ERC721UserMintable_setPrice: '[ERC721UserMintable.setPrice]',
  ERC721UserMintable_toggleSale: '[ERC721UserMintable.toggleSale]',
  ERC721UserMintable_withdraw: '[ERC721UserMintable.withdraw]',

  ContractFactory_factory: '[ContractFactory.factory]',
  Provider_getProvider: '[Provider.getProvider]',
  Provider_getInjectedProvider: '[Provider.getInjectedProvider]',
  Signer_constructor: '[Signer.constructor]',

  Ipfs_constructor: '[IPFS.constructor]',
  Ipfs_uploadFile: '[IPFS.uploadFile]',
  Ipfs_uploadObject: '[IPFS.uploadObject]',
  Ipfs_uploadDirectory: '[IPFS.uploadDirectory]',
  Ipfs_unPinFile: '[IPFS.unPinFile]',

  Metadata_constructor: '[Metadata.constructor]',
  Metadata_upload: '[Metadata.upload]',
  Metadata_uploadFileAndGetLink: '[Metadata.uploadFileAndGetLink]',
  Metadata_parseInput: '[Metadata.parseInput]',
};
