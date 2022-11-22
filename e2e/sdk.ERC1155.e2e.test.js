import { config as loadEnv } from 'dotenv';
import { wait } from './utils/utils.js';
import { SDK, Auth, TEMPLATES } from '../index.js';
import { errorLogger, ERROR_LOG } from '../src/lib/error/handler.js';

loadEnv();
const ownerAddress = process.env.WALLET_PUBLIC_ADDRESS;
const authInfo = {
  privateKey: process.env.WALLET_PRIVATE_KEY,
  projectId: process.env.INFURA_PROJECT_ID,
  secretId: process.env.INFURA_PROJECT_SECRET,
  rpcUrl: process.env.EVM_RPC_URL,
  chainId: 5,
};
const contractInfo = {
  template: TEMPLATES.ERC1155Mintable,
  params: {
    baseURI: 'https://test.io',
    contractURI: 'https://test.io',
    ids: [],
  },
};
describe('SDK - ERC1155 - contract interaction (deploy, load and mint)', () => {
  jest.setTimeout(60 * 1000 * 10);
  it('Deploy - Get all nfts by owner address', async () => {
    const acc = new Auth(authInfo);
    const sdk = new SDK(acc);
    const response = await sdk.getNFTs({ publicAddress: ownerAddress, includeMetadata: false });
    expect(response.type).toEqual('NFT');

    const newContract = await sdk.deploy(contractInfo);
    const mintHash = await newContract.mint({
      to: ownerAddress,
      id: 0,
      quantity: 3,
    });
    const receipt = await mintHash.wait();
    expect(receipt.status).toEqual(1);

    await wait(
      async () => {
        const resp = await sdk.getNFTs({ publicAddress: ownerAddress, includeMetadata: false });
        return resp.total > response.total;
      },
      120000,
      1000,
      'Waiting for new nft to be available',
    );
    const response2 = await sdk.getNFTs({ publicAddress: ownerAddress, includeMetadata: false });
    expect(response2.total).toBeGreaterThan(response.total);
    expect(response2.assets[0].metadata).toEqual(undefined);
    const response3 = await sdk.getNFTs({ publicAddress: ownerAddress, includeMetadata: true });
    const createdToken = await response3.assets.filter(
      asset => asset.contract.toLowerCase() === newContract.contractAddress.toLowerCase(),
    );
    expect(createdToken.metadata).not.toBeNull();
  });
  it('Deploy - Get all nfts from a collection', async () => {
    const acc = new Auth(authInfo);
    const sdk = new SDK(acc);
    const contract = await sdk.deploy(contractInfo);
    const mintHash1 = await contract.mint({
      to: ownerAddress,
      id: 0,
      quantity: 3,
    });
    const receipt1 = await mintHash1.wait();
    expect(receipt1.status).toEqual(1);

    const mintHash2 = await contract.mint({
      to: ownerAddress,
      id: 2,
      quantity: 3,
    });
    const receipt2 = await mintHash2.wait();
    expect(receipt2.status).toEqual(1);
    const mintHash3 = await contract.mint({
      to: ownerAddress,
      id: 3,
      quantity: 3,
    });
    const receipt3 = await mintHash3.wait();
    expect(receipt3.status).toEqual(1);

    let response;
    await wait(
      async () => {
        response = await sdk.getNFTsForCollection({ contractAddress: contract.contractAddress });
        return response.total === 3;
      },
      600000,
      1000,
      'Waiting for NFT collection to be available from api',
    );
    response.assets.forEach(asset => {
      expect(asset.contract.toLowerCase()).toEqual(contract.contractAddress.toLowerCase());
      expect(asset.type).toEqual('ERC1155');
      expect(asset.supply).toEqual('3');
    });
  });

  it('Deploy - Get all collection metadata', async () => {
    const acc = new Auth(authInfo);
    const sdk = new SDK(acc);
    const contract = await sdk.deploy(contractInfo);

    const mintHash1 = await contract.mint({
      to: ownerAddress,
      id: 0,
      quantity: 3,
    });
    const receipt1 = await mintHash1.wait();
    expect(receipt1.status).toEqual(1);
    let response;
    await wait(
      async () => {
        response = await sdk.getContractMetadata({ contractAddress: contract.contractAddress });
        return response !== null;
      },
      120000,
      1000,
      // eslint-disable-next-line sonarjs/no-duplicate-string
      'Waiting for NFT collection to be available',
    );
    response = await await sdk.getContractMetadata({ contractAddress: contract.contractAddress });
    expect(response.name).toEqual(null);
    expect(response.symbol).toEqual(null);
    expect(response.tokenType).toEqual('ERC1155');
  }, 240000);
  it('Mint batch', async () => {
    const acc = new Auth(authInfo);
    const sdk = new SDK(acc);
    const newContract = await sdk.deploy(contractInfo);

    const mintHash1 = await newContract.mintBatch({
      to: ownerAddress,
      ids: [0, 1, 2],
      quantities: [1, 2, 3],
    });
    const receipt1 = await mintHash1.wait();
    expect(receipt1.status).toEqual(1);
    await wait(
      async () => {
        const response = await sdk.getNFTsForCollection({
          contractAddress: newContract.contractAddress,
        });
        return response.total === 3 && response.assets.length === 3;
      },
      90000,
      1000,
      'Waiting for NFT collection to be available',
    );

    const response = await sdk.getNFTsForCollection({
      contractAddress: newContract.contractAddress,
    });
    expect(response.assets.length).toEqual(3);
    const token0 = response.assets.filter(ele => ele.tokenId === '0')[0];
    expect(token0.contract.toLowerCase()).toEqual(newContract.contractAddress.toLowerCase());
    expect(token0.tokenId).toEqual('0');
    expect(token0.supply).toEqual('1');
    expect(token0.type).toEqual('ERC1155');
    const token1 = response.assets.filter(ele => ele.tokenId === '1')[0];
    expect(token1.contract.toLowerCase()).toEqual(newContract.contractAddress.toLowerCase());
    expect(token1.tokenId).toEqual('1');
    expect(token1.supply).toEqual('2');
    expect(token1.type).toEqual('ERC1155');
    const token2 = response.assets.filter(ele => ele.tokenId === '2')[0];
    expect(token2.contract.toLowerCase()).toEqual(newContract.contractAddress.toLowerCase());
    expect(token2.tokenId).toEqual('2');
    expect(token2.supply).toEqual('3');
    expect(token2.type).toEqual('ERC1155');
  }, 240000);
  it('Load existing contract', async () => {
    const acc = new Auth(authInfo);
    const sdk = new SDK(acc);
    const newContract = await sdk.deploy(contractInfo);
    const loadedContract = await sdk.loadContract({
      template: TEMPLATES.ERC1155Mintable,
      contractAddress: newContract.contractAddress,
    });
    expect(loadedContract.contractAddress).toEqual(newContract.contractAddress);
  });
  it('Load unexisting contract', async () => {
    const acc = new Auth(authInfo);
    const sdk = new SDK(acc);
    const cont = {
      template: TEMPLATES.ERC1155Mintable,
      contractAddress: '',
    };
    const contract = async () => {
      await sdk.loadContract(cont);
    };
    expect(contract).rejects.toThrow(
      errorLogger({
        location: ERROR_LOG.location.SDK_loadContract,
        message: ERROR_LOG.message.no_address_supplied,
      }),
    );
  });
  it('Load old contract', async () => {
    const acc = new Auth(authInfo);
    const sdk = new SDK(acc);
    const cont = {
      template: TEMPLATES.ERC1155Mintable,
      contractAddress: '0x9F2001302362c94DEaE3a08295a6a957f271F470',
    };
    const contract = await sdk.loadContract(cont);
    expect(contract.contractAddress).toEqual(cont.contractAddress);
  });
  it('Load new contract and get Metadata', async () => {
    const acc = new Auth(authInfo);
    const sdk = new SDK(acc);
    const newContract = await sdk.deploy(contractInfo);
    const mintHash1 = await newContract.mint({
      to: ownerAddress,
      id: 0,
      quantity: 1,
    });
    const receipt1 = await mintHash1.wait();
    expect(receipt1.status).toEqual(1);
    await wait(
      async () => {
        const response = await sdk.getContractMetadata({
          contractAddress: newContract.contractAddress,
        });

        return response !== null;
      },
      300000,
      1000,
      'Waiting for NFT metadata to be available',
    );
    const meta = await sdk.getContractMetadata({ contractAddress: newContract.contractAddress });
    expect(meta.tokenType).toEqual('ERC1155');
  });

  it('deploy a contract and addIds', async () => {
    const acc = new Auth(authInfo);
    const sdk = new SDK(acc);
    const newContract = await sdk.deploy(contractInfo);
    const hash = await newContract.addIds({ ids: [0] });
    const receipt1 = await hash.wait();
    expect(receipt1.status).toEqual(1);
    const mintHash = await newContract.mint({
      to: ownerAddress,
      id: 0,
      quantity: 1,
    });
    await mintHash.wait();
    await wait(
      async () => {
        const response = await sdk.getNFTsForCollection({
          contractAddress: newContract.contractAddress,
        });
        return response.total === 1;
      },
      90000,
      1000,
      'Waiting for NFT collection to be available',
    );
    const collection = await sdk.getNFTsForCollection({
      contractAddress: newContract.contractAddress,
    });
    expect(collection.total).toEqual(1);
  });
});
