/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-scrollzkevm/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class ScrollzkEVM implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Scroll zkEVM',
    name: 'scrollzkevm',
    icon: 'file:scrollzkevm.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Scroll zkEVM API',
    defaults: {
      name: 'Scroll zkEVM',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'scrollzkevmApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'Block',
            value: 'block',
          },
          {
            name: 'Contract',
            value: 'contract',
          },
          {
            name: 'Token',
            value: 'token',
          },
          {
            name: 'Statistics',
            value: 'statistics',
          },
          {
            name: 'Log',
            value: 'log',
          },
          {
            name: 'Gas',
            value: 'gas',
          }
        ],
        default: 'account',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Get Balance', value: 'getBalance', description: 'Get ETH balance for address', action: 'Get ETH balance' },
    { name: 'Get Multiple Balances', value: 'getMultipleBalances', description: 'Get ETH balances for multiple addresses', action: 'Get multiple ETH balances' },
    { name: 'Get Transactions', value: 'getTransactions', description: 'Get list of normal transactions', action: 'Get normal transactions' },
    { name: 'Get Internal Transactions', value: 'getInternalTransactions', description: 'Get list of internal transactions', action: 'Get internal transactions' },
    { name: 'Get Token Transfers', value: 'getTokenTransfers', description: 'Get ERC20 token transfer events', action: 'Get ERC20 token transfers' },
    { name: 'Get NFT Transfers', value: 'getNftTransfers', description: 'Get ERC721 token transfer events', action: 'Get ERC721 token transfers' },
    { name: 'Get ERC1155 Transfers', value: 'getErc1155Transfers', description: 'Get ERC1155 token transfer events', action: 'Get ERC1155 token transfers' }
  ],
  default: 'getBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transaction'] } },
  options: [
    { name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction details by hash', action: 'Get transaction' },
    { name: 'Get Transaction Receipt', value: 'getTransactionReceipt', description: 'Get transaction receipt by hash', action: 'Get transaction receipt' },
    { name: 'Get Transaction Status', value: 'getTransactionStatus', description: 'Get transaction execution status', action: 'Get transaction status' },
    { name: 'Get Transaction Receipt Status', value: 'getTransactionReceiptStatus', description: 'Get transaction receipt status', action: 'Get transaction receipt status' }
  ],
  default: 'getTransaction',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['block'] } },
  options: [
    { name: 'Get Latest Block', value: 'getLatestBlock', description: 'Get latest block number', action: 'Get latest block number' },
    { name: 'Get Block By Number', value: 'getBlockByNumber', description: 'Get block details by number', action: 'Get block details by number' },
    { name: 'Get Block Reward', value: 'getBlockReward', description: 'Get block and uncle rewards', action: 'Get block and uncle rewards' },
    { name: 'Get Block By Timestamp', value: 'getBlockByTimestamp', description: 'Get block number by timestamp', action: 'Get block number by timestamp' }
  ],
  default: 'getLatestBlock',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['contract'] } },
	options: [
		{ name: 'Get Contract ABI', value: 'getContractAbi', description: 'Get contract ABI for verified contracts', action: 'Get contract ABI' },
		{ name: 'Get Source Code', value: 'getSourceCode', description: 'Get contract source code for verified contracts', action: 'Get source code' },
		{ name: 'Verify Contract', value: 'verifyContract', description: 'Submit contract source code for verification', action: 'Verify contract' },
		{ name: 'Get Verification Status', value: 'getVerificationStatus', description: 'Check contract verification status', action: 'Get verification status' },
	],
	default: 'getContractAbi',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['token'] } },
  options: [
    { name: 'Get Token Info', value: 'getTokenInfo', description: 'Get ERC20 token information', action: 'Get token information' },
    { name: 'Get Token Supply', value: 'getTokenSupply', description: 'Get ERC20 token total supply', action: 'Get token supply' },
    { name: 'Get Token Balance', value: 'getTokenBalance', description: 'Get ERC20 token account balance', action: 'Get token balance' }
  ],
  default: 'getTokenInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['statistics'] } },
  options: [
    { name: 'Get ETH Supply', value: 'getEthSupply', description: 'Get total ETH supply', action: 'Get ETH supply' },
    { name: 'Get ETH Price', value: 'getEthPrice', description: 'Get latest ETH price', action: 'Get ETH price' },
    { name: 'Get Chain Size', value: 'getChainSize', description: 'Get blockchain database size', action: 'Get chain size' },
    { name: 'Get Node Count', value: 'getNodeCount', description: 'Get total node count', action: 'Get node count' },
  ],
  default: 'getEthSupply',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['log'] } },
  options: [
    { name: 'Get Logs', value: 'getLogs', description: 'Get event logs by address and/or topics', action: 'Get logs' },
    { name: 'Get Logs Proxy', value: 'getLogsProxy', description: 'Get logs via proxy endpoint', action: 'Get logs via proxy' },
  ],
  default: 'getLogs',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['gas'] } },
  options: [
    { name: 'Get Gas Estimate', value: 'getGasEstimate', description: 'Get gas estimation for contract execution', action: 'Get gas estimate' },
    { name: 'Get Gas Oracle', value: 'getGasOracle', description: 'Get gas oracle information', action: 'Get gas oracle' },
    { name: 'Get Gas Price', value: 'getGasPrice', description: 'Get current gas price', action: 'Get gas price' },
    { name: 'Estimate Gas', value: 'estimateGas', description: 'Estimate gas for transaction', action: 'Estimate gas for transaction' }
  ],
  default: 'getGasEstimate',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getBalance', 'getTransactions', 'getInternalTransactions', 'getTokenTransfers', 'getNftTransfers', 'getErc1155Transfers'] } },
  default: '',
  description: 'The Ethereum address to query',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getMultipleBalances'] } },
  default: '',
  description: 'Comma-separated list of addresses to query (up to 20)',
},
{
  displayName: 'Start Block',
  name: 'startblock',
  type: 'number',
  displayOptions: { show: { resource: ['account'], operation: ['getTransactions', 'getInternalTransactions', 'getTokenTransfers', 'getNftTransfers', 'getErc1155Transfers'] } },
  default: 0,
  description: 'Starting block number',
},
{
  displayName: 'End Block',
  name: 'endblock',
  type: 'number',
  displayOptions: { show: { resource: ['account'], operation: ['getTransactions', 'getInternalTransactions', 'getTokenTransfers', 'getNftTransfers', 'getErc1155Transfers'] } },
  default: 99999999,
  description: 'Ending block number',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: { show: { resource: ['account'], operation: ['getTransactions', 'getInternalTransactions', 'getTokenTransfers', 'getNftTransfers', 'getErc1155Transfers'] } },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['account'], operation: ['getTransactions', 'getInternalTransactions', 'getTokenTransfers', 'getNftTransfers', 'getErc1155Transfers'] } },
  default: 10,
  description: 'Maximum number of records to return (max 10000)',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'options',
  displayOptions: { show: { resource: ['account'], operation: ['getTransactions', 'getInternalTransactions', 'getTokenTransfers', 'getNftTransfers', 'getErc1155Transfers'] } },
  options: [
    { name: 'Ascending', value: 'asc' },
    { name: 'Descending', value: 'desc' }
  ],
  default: 'asc',
  description: 'Sort order by block number',
},
{
  displayName: 'Contract Address',
  name: 'contractaddress',
  type: 'string',
  displayOptions: { show: { resource: ['account'], operation: ['getTokenTransfers', 'getNftTransfers', 'getErc1155Transfers'] } },
  default: '',
  description: 'The contract address to filter by (optional)',
},
{
  displayName: 'Transaction Hash',
  name: 'txhash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransaction'] } },
  default: '',
  description: 'The transaction hash to retrieve details for',
},
{
  displayName: 'Transaction Hash',
  name: 'txhash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransactionReceipt'] } },
  default: '',
  description: 'The transaction hash to retrieve receipt for',
},
{
  displayName: 'Transaction Hash',
  name: 'txhash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransactionStatus'] } },
  default: '',
  description: 'The transaction hash to check execution status for',
},
{
  displayName: 'Transaction Hash',
  name: 'txhash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransactionReceiptStatus'] } },
  default: '',
  description: 'The transaction hash to check receipt status for',
},
{
  displayName: 'Block Number/Tag',
  name: 'tag',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['block'], operation: ['getBlockByNumber'] } },
  default: 'latest',
  description: 'Block number in hex or "latest", "earliest", "pending"'
},
{
  displayName: 'Include Transactions',
  name: 'boolean',
  type: 'boolean',
  required: true,
  displayOptions: { show: { resource: ['block'], operation: ['getBlockByNumber'] } },
  default: false,
  description: 'Whether to include full transaction details'
},
{
  displayName: 'Block Number',
  name: 'blockno',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['block'], operation: ['getBlockReward'] } },
  default: '',
  description: 'Block number to get rewards for'
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['block'], operation: ['getBlockByTimestamp'] } },
  default: '',
  description: 'Unix timestamp'
},
{
  displayName: 'Closest',
  name: 'closest',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['block'], operation: ['getBlockByTimestamp'] } },
  options: [
    { name: 'Before', value: 'before' },
    { name: 'After', value: 'after' }
  ],
  default: 'before',
  description: 'Find the closest block before or after the timestamp'
},
{
	displayName: 'Contract Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['contract'], operation: ['getContractAbi'] } },
	default: '',
	description: 'The contract address to get ABI for',
},
{
	displayName: 'Contract Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['contract'], operation: ['getSourceCode'] } },
	default: '',
	description: 'The contract address to get source code for',
},
{
	displayName: 'Contract Address',
	name: 'contractaddress',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['contract'], operation: ['verifyContract'] } },
	default: '',
	description: 'The contract address to verify',
},
{
	displayName: 'Source Code',
	name: 'sourceCode',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['contract'], operation: ['verifyContract'] } },
	default: '',
	description: 'The contract source code',
},
{
	displayName: 'Contract Name',
	name: 'contractname',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['contract'], operation: ['verifyContract'] } },
	default: '',
	description: 'The name of the contract',
},
{
	displayName: 'Compiler Version',
	name: 'compilerversion',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['contract'], operation: ['verifyContract'] } },
	default: '',
	description: 'The Solidity compiler version used',
},
{
	displayName: 'GUID',
	name: 'guid',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['contract'], operation: ['getVerificationStatus'] } },
	default: '',
	description: 'The verification GUID returned from contract verification',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['token'], operation: ['getTokenInfo', 'getTokenSupply', 'getTokenBalance'] } },
  default: '',
  description: 'The contract address of the ERC20 token',
  placeholder: '0x...',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['token'], operation: ['getTokenBalance'] } },
  default: '',
  description: 'The address to check the token balance for',
  placeholder: '0x...',
},
{
  displayName: 'Tag',
  name: 'tag',
  type: 'options',
  displayOptions: { show: { resource: ['token'], operation: ['getTokenBalance'] } },
  options: [
    { name: 'Latest', value: 'latest' },
    { name: 'Earliest', value: 'earliest' },
    { name: 'Pending', value: 'pending' },
  ],
  default: 'latest',
  description: 'The block tag to use for the balance check',
},
// No additional parameters needed for statistics operations,
{
  displayName: 'From Block',
  name: 'fromBlock',
  type: 'string',
  default: '',
  description: 'The block number to start searching from (integer or "latest", "earliest", "pending")',
  displayOptions: {
    show: {
      resource: ['log'],
      operation: ['getLogs', 'getLogsProxy'],
    },
  },
},
{
  displayName: 'To Block',
  name: 'toBlock',
  type: 'string',
  default: '',
  description: 'The block number to stop searching at (integer or "latest", "earliest", "pending")',
  displayOptions: {
    show: {
      resource: ['log'],
      operation: ['getLogs', 'getLogsProxy'],
    },
  },
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  default: '',
  description: 'Contract address or a list of addresses from which logs should originate',
  displayOptions: {
    show: {
      resource: ['log'],
      operation: ['getLogs', 'getLogsProxy'],
    },
  },
},
{
  displayName: 'Topic 0',
  name: 'topic0',
  type: 'string',
  default: '',
  description: 'Topic[0] to filter logs by',
  displayOptions: {
    show: {
      resource: ['log'],
      operation: ['getLogs'],
    },
  },
},
{
  displayName: 'Topic 1',
  name: 'topic1',
  type: 'string',
  default: '',
  description: 'Topic[1] to filter logs by',
  displayOptions: {
    show: {
      resource: ['log'],
      operation: ['getLogs'],
    },
  },
},
{
  displayName: 'Topic 2',
  name: 'topic2',
  type: 'string',
  default: '',
  description: 'Topic[2] to filter logs by',
  displayOptions: {
    show: {
      resource: ['log'],
      operation: ['getLogs'],
    },
  },
},
{
  displayName: 'Topic 3',
  name: 'topic3',
  type: 'string',
  default: '',
  description: 'Topic[3] to filter logs by',
  displayOptions: {
    show: {
      resource: ['log'],
      operation: ['getLogs'],
    },
  },
},
{
  displayName: 'Topics',
  name: 'topics',
  type: 'json',
  default: '[]',
  description: 'Array of 32 bytes DATA topics. Topics are order-dependent.',
  displayOptions: {
    show: {
      resource: ['log'],
      operation: ['getLogsProxy'],
    },
  },
},
{
  displayName: 'Gas Price',
  name: 'gasprice',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['gas'], operation: ['getGasEstimate'] } },
  default: '',
  description: 'Gas price in wei',
},
{
  displayName: 'To Address',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['gas'], operation: ['estimateGas'] } },
  default: '',
  description: 'The address the transaction is directed to',
},
{
  displayName: 'Value',
  name: 'value',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['gas'], operation: ['estimateGas'] } },
  default: '',
  description: 'Value sent with this transaction',
},
{
  displayName: 'Gas Price',
  name: 'gasPrice',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['gas'], operation: ['estimateGas'] } },
  default: '',
  description: 'Gas price used for each paid gas',
},
{
  displayName: 'Gas',
  name: 'gas',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['gas'], operation: ['estimateGas'] } },
  default: '',
  description: 'Gas provided for the transaction execution',
},
{
  displayName: 'Data',
  name: 'data',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['gas'], operation: ['estimateGas'] } },
  default: '',
  description: 'The data sent along with the transaction',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'block':
        return [await executeBlockOperations.call(this, items)];
      case 'contract':
        return [await executeContractOperations.call(this, items)];
      case 'token':
        return [await executeTokenOperations.call(this, items)];
      case 'statistics':
        return [await executeStatisticsOperations.call(this, items)];
      case 'log':
        return [await executeLogOperations.call(this, items)];
      case 'gas':
        return [await executeGasOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('scrollzkevmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = 'https://api.scrollscan.com/api';

      switch (operation) {
        case 'getBalance': {
          const address = this.getNodeParameter('address', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${credentials.apiKey}`,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getMultipleBalances': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}?module=account&action=balancemulti&address=${addresses}&tag=latest&apikey=${credentials.apiKey}`,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getTransactions': {
          const address = this.getNodeParameter('address', i) as string;
          const startblock = this.getNodeParameter('startblock', i) as number;
          const endblock = this.getNodeParameter('endblock', i) as number;
          const page = this.getNodeParameter('page', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const sort = this.getNodeParameter('sort', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}?module=account&action=txlist&address=${address}&startblock=${startblock}&endblock=${endblock}&page=${page}&offset=${offset}&sort=${sort}&apikey=${credentials.apiKey}`,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getInternalTransactions': {
          const address = this.getNodeParameter('address', i) as string;
          const startblock = this.getNodeParameter('startblock', i) as number;
          const endblock = this.getNodeParameter('endblock', i) as number;
          const page = this.getNodeParameter('page', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const sort = this.getNodeParameter('sort', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}?module=account&action=txlistinternal&address=${address}&startblock=${startblock}&endblock=${endblock}&page=${page}&offset=${offset}&sort=${sort}&apikey=${credentials.apiKey}`,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getTokenTransfers': {
          const address = this.getNodeParameter('address', i) as string;
          const contractaddress = this.getNodeParameter('contractaddress', i) as string;
          const startblock = this.getNodeParameter('startblock', i) as number;
          const endblock = this.getNodeParameter('endblock', i) as number;
          const page = this.getNodeParameter('page', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const sort = this.getNodeParameter('sort', i) as string;
          let url = `${baseUrl}?module=account&action=tokentx&address=${address}&startblock=${startblock}&endblock=${endblock}&page=${page}&offset=${offset}&sort=${sort}&apikey=${credentials.apiKey}`;
          if (contractaddress) {
            url += `&contractaddress=${contractaddress}`;
          }
          const options: any = {
            method: 'GET',
            url: url,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getNftTransfers': {
          const address = this.getNodeParameter('address', i) as string;
          const contractaddress = this.getNodeParameter('contractaddress', i) as string;
          const startblock = this.getNodeParameter('startblock', i) as number;
          const endblock = this.getNodeParameter('endblock', i) as number;
          const page = this.getNodeParameter('page', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const sort = this.getNodeParameter('sort', i) as string;
          let url = `${baseUrl}?module=account&action=tokennfttx&address=${address}&startblock=${startblock}&endblock=${endblock}&page=${page}&offset=${offset}&sort=${sort}&apikey=${credentials.apiKey}`;
          if (contractaddress) {
            url += `&contractaddress=${contractaddress}`;
          }
          const options: any = {
            method: 'GET',
            url: url,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getErc1155Transfers': {
          const address = this.getNodeParameter('address', i) as string;
          const contractaddress = this.getNodeParameter('contractaddress', i) as string;
          const startblock = this.getNodeParameter('startblock', i) as number;
          const endblock = this.getNodeParameter('endblock', i) as number;
          const page = this.getNodeParameter('page', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const sort = this.getNodeParameter('sort', i) as string;
          let url = `${baseUrl}?module=account&action=token1155tx&address=${address}&startblock=${startblock}&endblock=${endblock}&page=${page}&offset=${offset}&sort=${sort}&apikey=${credentials.apiKey}`;
          if (contractaddress) {
            url += `&contractaddress=${contractaddress}`;
          }
          const options: any = {
            method: 'GET',
            url: url,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTransactionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('scrollzkevmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const txhash = this.getNodeParameter('txhash', i) as string;

      switch (operation) {
        case 'getTransaction': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}`,
            qs: {
              module: 'proxy',
              action: 'eth_getTransactionByHash',
              txhash,
              apikey: credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getTransactionReceipt': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}`,
            qs: {
              module: 'proxy',
              action: 'eth_getTransactionReceipt',
              txhash,
              apikey: credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getTransactionStatus': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}`,
            qs: {
              module: 'transaction',
              action: 'getstatus',
              txhash,
              apikey: credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getTransactionReceiptStatus': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}`,
            qs: {
              module: 'transaction',
              action: 'gettxreceiptstatus',
              txhash,
              apikey: credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), 'Unknown operation: ' + operation);
      }
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  return returnData;
}

async function executeBlockOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('scrollzkevmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = 'https://api.scrollscan.com/api';

      switch (operation) {
        case 'getLatestBlock': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}?module=proxy&action=eth_blockNumber&apikey=${credentials.apiKey}`,
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getBlockByNumber': {
          const tag = this.getNodeParameter('tag', i) as string;
          const includeTransactions = this.getNodeParameter('boolean', i) as boolean;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}?module=proxy&action=eth_getBlockByNumber&tag=${tag}&boolean=${includeTransactions}&apikey=${credentials.apiKey}`,
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getBlockReward': {
          const blockno = this.getNodeParameter('blockno', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}?module=block&action=getblockreward&blockno=${blockno}&apikey=${credentials.apiKey}`,
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getBlockByTimestamp': {
          const timestamp = this.getNodeParameter('timestamp', i) as string;
          const closest = this.getNodeParameter('closest', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=${closest}&apikey=${credentials.apiKey}`,
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeContractOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('scrollzkevmApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getContractAbi': {
					const address = this.getNodeParameter('address', i) as string;
					const options: any = {
						method: 'GET',
						url: credentials.baseUrl,
						qs: {
							module: 'contract',
							action: 'getabi',
							address,
							apikey: credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getSourceCode': {
					const address = this.getNodeParameter('address', i) as string;
					const options: any = {
						method: 'GET',
						url: credentials.baseUrl,
						qs: {
							module: 'contract',
							action: 'getsourcecode',
							address,
							apikey: credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'verifyContract': {
					const contractaddress = this.getNodeParameter('contractaddress', i) as string;
					const sourceCode = this.getNodeParameter('sourceCode', i) as string;
					const contractname = this.getNodeParameter('contractname', i) as string;
					const compilerversion = this.getNodeParameter('compilerversion', i) as string;
					const options: any = {
						method: 'POST',
						url: credentials.baseUrl,
						form: {
							module: 'contract',
							action: 'verifysourcecode',
							contractaddress,
							sourceCode,
							contractname,
							compilerversion,
							apikey: credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getVerificationStatus': {
					const guid = this.getNodeParameter('guid', i) as string;
					const options: any = {
						method: 'GET',
						url: credentials.baseUrl,
						qs: {
							module: 'contract',
							action: 'checkverifystatus',
							guid,
							apikey: credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeTokenOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('scrollzkevmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const contractAddress = this.getNodeParameter('contractAddress', i) as string;

      switch (operation) {
        case 'getTokenInfo': {
          const options: any = {
            method: 'GET',
            url: credentials.baseUrl,
            qs: {
              module: 'token',
              action: 'tokeninfo',
              contractaddress: contractAddress,
              apikey: credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getTokenSupply': {
          const options: any = {
            method: 'GET',
            url: credentials.baseUrl,
            qs: {
              module: 'token',
              action: 'tokensupply',
              contractaddress: contractAddress,
              apikey: credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getTokenBalance': {
          const address = this.getNodeParameter('address', i) as string;
          const tag = this.getNodeParameter('tag', i) as string;
          
          const options: any = {
            method: 'GET',
            url: credentials.baseUrl,
            qs: {
              module: 'account',
              action: 'tokenbalance',
              contractaddress: contractAddress,
              address: address,
              tag: tag,
              apikey: credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), 'Unknown operation: ' + operation);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeStatisticsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('scrollzkevmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getEthSupply': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.scrollscan.com/api'}?module=stats&action=ethsupply&apikey=${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getEthPrice': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.scrollscan.com/api'}?module=stats&action=ethprice&apikey=${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getChainSize': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.scrollscan.com/api'}?module=stats&action=chainsize&apikey=${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getNodeCount': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.scrollscan.com/api'}?module=stats&action=nodecount&apikey=${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeLogOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('scrollzkevmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getLogs': {
          const fromBlock = this.getNodeParameter('fromBlock', i) as string;
          const toBlock = this.getNodeParameter('toBlock', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const topic0 = this.getNodeParameter('topic0', i) as string;
          const topic1 = this.getNodeParameter('topic1', i) as string;
          const topic2 = this.getNodeParameter('topic2', i) as string;
          const topic3 = this.getNodeParameter('topic3', i) as string;

          const queryParams: any = {
            module: 'logs',
            action: 'getLogs',
            apikey: credentials.apiKey,
          };

          if (fromBlock) queryParams.fromBlock = fromBlock;
          if (toBlock) queryParams.toBlock = toBlock;
          if (address) queryParams.address = address;
          if (topic0) queryParams.topic0 = topic0;
          if (topic1) queryParams.topic1 = topic1;
          if (topic2) queryParams.topic2 = topic2;
          if (topic3) queryParams.topic3 = topic3;

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl || 'https://api.scrollscan.com/api',
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getLogsProxy': {
          const fromBlock = this.getNodeParameter('fromBlock', i) as string;
          const toBlock = this.getNodeParameter('toBlock', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const topics = this.getNodeParameter('topics', i) as string;

          const logFilter: any = {};
          if (fromBlock) logFilter.fromBlock = fromBlock;
          if (toBlock) logFilter.toBlock = toBlock;
          if (address) logFilter.address = address;
          if (topics) logFilter.topics = JSON.parse(topics);

          const queryParams: any = {
            module: 'proxy',
            action: 'eth_getLogs',
            tag: 'latest',
            apikey: credentials.apiKey,
          };

          Object.keys(logFilter).forEach(key => {
            queryParams[key] = logFilter[key];
          });

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl || 'https://api.scrollscan.com/api',
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeGasOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('scrollzkevmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getGasEstimate': {
          const gasprice = this.getNodeParameter('gasprice', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}?module=gastracker&action=gasestimate&gasprice=${gasprice}&apikey=${credentials.apiKey}`,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getGasOracle': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}?module=gastracker&action=gasoracle&apikey=${credentials.apiKey}`,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getGasPrice': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}?module=proxy&action=eth_gasPrice&apikey=${credentials.apiKey}`,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'estimateGas': {
          const to = this.getNodeParameter('to', i) as string;
          const value = this.getNodeParameter('value', i) as string;
          const gasPrice = this.getNodeParameter('gasPrice', i) as string;
          const gas = this.getNodeParameter('gas', i) as string;
          const data = this.getNodeParameter('data', i) as string;

          let url = `${credentials.baseUrl}?module=proxy&action=eth_estimateGas&to=${to}&apikey=${credentials.apiKey}`;
          
          if (value) url += `&value=${value}`;
          if (gasPrice) url += `&gasPrice=${gasPrice}`;
          if (gas) url += `&gas=${gas}`;
          if (data) url += `&data=${data}`;

          const options: any = {
            method: 'GET',
            url,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
