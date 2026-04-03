/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ScrollzkEVM } from '../nodes/Scroll zkEVM/Scroll zkEVM.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('ScrollzkEVM Node', () => {
  let node: ScrollzkEVM;

  beforeAll(() => {
    node = new ScrollzkEVM();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Scroll zkEVM');
      expect(node.description.name).toBe('scrollzkevm');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 8 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(8);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(8);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('getBalance', () => {
    it('should get ETH balance for address', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBalance')
        .mockReturnValueOnce('0x1234567890123456789012345678901234567890');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: '1', result: '1000000000000000000' });

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api?module=account&action=balance&address=0x1234567890123456789012345678901234567890&tag=latest&apikey=test-key',
        json: true,
      });
      expect(result).toHaveLength(1);
    });

    it('should handle errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBalance')
        .mockReturnValueOnce('invalid-address');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getMultipleBalances', () => {
    it('should get balances for multiple addresses', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getMultipleBalances')
        .mockReturnValueOnce('0x1234,0x5678');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: '1', result: [] });

      await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api?module=account&action=balancemulti&address=0x1234,0x5678&tag=latest&apikey=test-key',
        json: true,
      });
    });
  });

  describe('getTransactions', () => {
    it('should get normal transactions', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransactions')
        .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(99999999)
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(10)
        .mockReturnValueOnce('asc');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: '1', result: [] });

      await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api?module=account&action=txlist&address=0x1234567890123456789012345678901234567890&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=test-key',
        json: true,
      });
    });
  });

  describe('getTokenTransfers', () => {
    it('should get token transfers with contract address', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenTransfers')
        .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
        .mockReturnValueOnce('0xcontract')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(99999999)
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(10)
        .mockReturnValueOnce('asc');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: '1', result: [] });

      await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api?module=account&action=tokentx&address=0x1234567890123456789012345678901234567890&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=test-key&contractaddress=0xcontract',
        json: true,
      });
    });
  });
});

describe('Transaction Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key', baseUrl: 'https://api.scrollscan.com/api' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('getTransaction', () => {
    it('should get transaction details successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransaction').mockReturnValueOnce('0x123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ result: { hash: '0x123' } });

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ result: { hash: '0x123' } });
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api',
        qs: { module: 'proxy', action: 'eth_getTransactionByHash', txhash: '0x123', apikey: 'test-key' },
        json: true,
      });
    });

    it('should handle errors gracefully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransaction').mockReturnValueOnce('0x123');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getTransactionReceipt', () => {
    it('should get transaction receipt successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransactionReceipt').mockReturnValueOnce('0x123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ result: { transactionHash: '0x123' } });

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ result: { transactionHash: '0x123' } });
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api',
        qs: { module: 'proxy', action: 'eth_getTransactionReceipt', txhash: '0x123', apikey: 'test-key' },
        json: true,
      });
    });
  });

  describe('getTransactionStatus', () => {
    it('should get transaction status successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransactionStatus').mockReturnValueOnce('0x123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ result: { isError: '0' } });

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ result: { isError: '0' } });
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api',
        qs: { module: 'transaction', action: 'getstatus', txhash: '0x123', apikey: 'test-key' },
        json: true,
      });
    });
  });

  describe('getTransactionReceiptStatus', () => {
    it('should get transaction receipt status successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransactionReceiptStatus').mockReturnValueOnce('0x123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ result: { status: '1' } });

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ result: { status: '1' } });
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api',
        qs: { module: 'transaction', action: 'gettxreceiptstatus', txhash: '0x123', apikey: 'test-key' },
        json: true,
      });
    });
  });
});

describe('Block Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn() }
    };
  });

  it('should get latest block successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getLatestBlock');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ result: '0x123456' });

    const items = [{ json: {} }];
    const result = await executeBlockOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ result: '0x123456' });
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.scrollscan.com/api?module=proxy&action=eth_blockNumber&apikey=test-key',
      json: true
    });
  });

  it('should get block by number successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBlockByNumber')
      .mockReturnValueOnce('latest')
      .mockReturnValueOnce(true);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ result: { number: '0x123456' } });

    const items = [{ json: {} }];
    const result = await executeBlockOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ result: { number: '0x123456' } });
  });

  it('should get block reward successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBlockReward')
      .mockReturnValueOnce('123456');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ result: { blockReward: '5000000000000000000' } });

    const items = [{ json: {} }];
    const result = await executeBlockOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ result: { blockReward: '5000000000000000000' } });
  });

  it('should get block by timestamp successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBlockByTimestamp')
      .mockReturnValueOnce('1634567890')
      .mockReturnValueOnce('before');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ result: '123456' });

    const items = [{ json: {} }];
    const result = await executeBlockOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ result: '123456' });
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getLatestBlock');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const items = [{ json: {} }];
    const result = await executeBlockOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getLatestBlock');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);

    const items = [{ json: {} }];
    await expect(executeBlockOperations.call(mockExecuteFunctions, items)).rejects.toThrow('API Error');
  });
});

describe('Contract Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-key', 
				baseUrl: 'https://api.scrollscan.com/api' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
		};
	});

	it('should get contract ABI successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getContractAbi');
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('0x1234567890abcdef');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			status: '1',
			result: '[{"inputs":[],"name":"test","outputs":[],"stateMutability":"view","type":"function"}]'
		});

		const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.scrollscan.com/api',
			qs: {
				module: 'contract',
				action: 'getabi',
				address: '0x1234567890abcdef',
				apikey: 'test-key'
			},
			json: true
		});
	});

	it('should get source code successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSourceCode');
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('0x1234567890abcdef');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			status: '1',
			result: [{ SourceCode: 'contract Test {}' }]
		});

		const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.scrollscan.com/api',
			qs: {
				module: 'contract',
				action: 'getsourcecode',
				address: '0x1234567890abcdef',
				apikey: 'test-key'
			},
			json: true
		});
	});

	it('should verify contract successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('verifyContract');
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('0x1234567890abcdef');
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('contract Test {}');
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('Test');
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('v0.8.19+commit.7dd6d404');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			status: '1',
			result: 'verification-guid-123'
		});

		const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.scrollscan.com/api',
			form: {
				module: 'contract',
				action: 'verifysourcecode',
				contractaddress: '0x1234567890abcdef',
				sourceCode: 'contract Test {}',
				contractname: 'Test',
				compilerversion: 'v0.8.19+commit.7dd6d404',
				apikey: 'test-key'
			},
			json: true
		});
	});

	it('should get verification status successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getVerificationStatus');
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('verification-guid-123');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			status: '1',
			result: 'Pass - Verified'
		});

		const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.scrollscan.com/api',
			qs: {
				module: 'contract',
				action: 'checkverifystatus',
				guid: 'verification-guid-123',
				apikey: 'test-key'
			},
			json: true
		});
	});

	it('should handle API errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getContractAbi');
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('0x1234567890abcdef');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});
});

describe('Token Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.scrollscan.com/api' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getTokenInfo operation', () => {
    it('should get token info successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenInfo')
        .mockReturnValueOnce('0x1234567890abcdef');
      
      const mockResponse = {
        status: '1',
        message: 'OK',
        result: {
          contractAddress: '0x1234567890abcdef',
          tokenName: 'Test Token',
          symbol: 'TEST',
          decimals: '18'
        }
      };
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api',
        qs: {
          module: 'token',
          action: 'tokeninfo',
          contractaddress: '0x1234567890abcdef',
          apikey: 'test-key',
        },
        json: true,
      });
    });

    it('should handle errors for getTokenInfo', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenInfo')
        .mockReturnValueOnce('0x1234567890abcdef');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      
      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTokenSupply operation', () => {
    it('should get token supply successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenSupply')
        .mockReturnValueOnce('0x1234567890abcdef');
      
      const mockResponse = {
        status: '1',
        message: 'OK',
        result: '1000000000000000000000000'
      };
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api',
        qs: {
          module: 'token',
          action: 'tokensupply',
          contractaddress: '0x1234567890abcdef',
          apikey: 'test-key',
        },
        json: true,
      });
    });
  });

  describe('getTokenBalance operation', () => {
    it('should get token balance successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenBalance')
        .mockReturnValueOnce('0x1234567890abcdef')
        .mockReturnValueOnce('0xabcdef1234567890')
        .mockReturnValueOnce('latest');
      
      const mockResponse = {
        status: '1',
        message: 'OK',
        result: '500000000000000000000'
      };
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api',
        qs: {
          module: 'account',
          action: 'tokenbalance',
          contractaddress: '0x1234567890abcdef',
          address: '0xabcdef1234567890',
          tag: 'latest',
          apikey: 'test-key',
        },
        json: true,
      });
    });

    it('should handle errors for getTokenBalance', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenBalance')
        .mockReturnValueOnce('0x1234567890abcdef')
        .mockReturnValueOnce('0xabcdef1234567890')
        .mockReturnValueOnce('latest');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address'));
      
      await expect(executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Invalid address');
    });
  });
});

describe('Statistics Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key', baseUrl: 'https://api.scrollscan.com/api' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get ETH supply successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getEthSupply');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: '1', result: '21000000000000000000000000' });

    const result = await executeStatisticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { status: '1', result: '21000000000000000000000000' },
      pairedItem: { item: 0 }
    }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.scrollscan.com/api?module=stats&action=ethsupply&apikey=test-key',
      headers: { 'Content-Type': 'application/json' },
      json: true,
    });
  });

  it('should get ETH price successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getEthPrice');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: '1', result: { ethusd: '2500', ethbtc: '0.05' } });

    const result = await executeStatisticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { status: '1', result: { ethusd: '2500', ethbtc: '0.05' } },
      pairedItem: { item: 0 }
    }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.scrollscan.com/api?module=stats&action=ethprice&apikey=test-key',
      headers: { 'Content-Type': 'application/json' },
      json: true,
    });
  });

  it('should get chain size successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getChainSize');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: '1', result: '123456789' });

    const result = await executeStatisticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { status: '1', result: '123456789' },
      pairedItem: { item: 0 }
    }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.scrollscan.com/api?module=stats&action=chainsize&apikey=test-key',
      headers: { 'Content-Type': 'application/json' },
      json: true,
    });
  });

  it('should get node count successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getNodeCount');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: '1', result: '1000' });

    const result = await executeStatisticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { status: '1', result: '1000' },
      pairedItem: { item: 0 }
    }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.scrollscan.com/api?module=stats&action=nodecount&apikey=test-key',
      headers: { 'Content-Type': 'application/json' },
      json: true,
    });
  });

  it('should handle API errors with continueOnFail true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getEthSupply');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeStatisticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should throw error with continueOnFail false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getEthSupply');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);

    await expect(executeStatisticsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
  });
});

describe('Log Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.scrollscan.com/api' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getLogs operation', () => {
    it('should get logs successfully', async () => {
      const mockResponse = { status: '1', result: [{ address: '0x123', topics: [] }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLogs')
        .mockReturnValueOnce('1000000')
        .mockReturnValueOnce('latest')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      const result = await executeLogOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api',
        qs: {
          module: 'logs',
          action: 'getLogs',
          apikey: 'test-key',
          fromBlock: '1000000',
          toBlock: 'latest',
          address: '0x123',
        },
        json: true,
      });
    });

    it('should handle getLogs errors', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLogs')
        .mockReturnValue('');

      const result = await executeLogOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getLogsProxy operation', () => {
    it('should get logs via proxy successfully', async () => {
      const mockResponse = { result: [{ address: '0x123', topics: [] }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLogsProxy')
        .mockReturnValueOnce('1000000')
        .mockReturnValueOnce('latest')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]');

      const result = await executeLogOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api',
        qs: {
          module: 'proxy',
          action: 'eth_getLogs',
          tag: 'latest',
          apikey: 'test-key',
          fromBlock: '1000000',
          toBlock: 'latest',
          address: '0x123',
          topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
        },
        json: true,
      });
    });

    it('should handle getLogsProxy errors', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Proxy Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLogsProxy')
        .mockReturnValue('');

      const result = await executeLogOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Proxy Error');
    });
  });
});

describe('Gas Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.scrollscan.com/api'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('getGasEstimate', () => {
    it('should get gas estimate successfully', async () => {
      const mockResponse = { status: '1', message: 'OK', result: '21000' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getGasEstimate';
        if (paramName === 'gasprice') return '20000000000';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGasOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api?module=gastracker&action=gasestimate&gasprice=20000000000&apikey=test-key',
        json: true,
      });
    });

    it('should handle gas estimate error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getGasEstimate';
        if (paramName === 'gasprice') return '20000000000';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeGasOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getGasOracle', () => {
    it('should get gas oracle successfully', async () => {
      const mockResponse = { status: '1', message: 'OK', result: { SafeGasPrice: '20', ProposeGasPrice: '22', FastGasPrice: '24' } };
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getGasOracle';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGasOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getGasPrice', () => {
    it('should get gas price successfully', async () => {
      const mockResponse = { jsonrpc: '2.0', id: 1, result: '0x4a817c800' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getGasPrice';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGasOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('estimateGas', () => {
    it('should estimate gas successfully', async () => {
      const mockResponse = { jsonrpc: '2.0', id: 1, result: '0x5208' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'estimateGas';
        if (paramName === 'to') return '0x742d35cc6631c0532925a3b8d4023a0b39dd96d1';
        if (paramName === 'value') return '0x9184e72a';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGasOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.scrollscan.com/api?module=proxy&action=eth_estimateGas&to=0x742d35cc6631c0532925a3b8d4023a0b39dd96d1&apikey=test-key&value=0x9184e72a',
        json: true,
      });
    });

    it('should handle estimate gas error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'estimateGas';
        if (paramName === 'to') return '0x742d35cc6631c0532925a3b8d4023a0b39dd96d1';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeGasOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Invalid address' }, pairedItem: { item: 0 } }]);
    });
  });
});
});
