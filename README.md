# n8n-nodes-scroll-zkevm

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Scroll zkEVM, a zero-knowledge Ethereum Virtual Machine scaling solution. It includes 8 resources covering accounts, transactions, blocks, contracts, tokens, statistics, logs, and gas operations, enabling developers to build powerful blockchain automation workflows with Scroll's Layer 2 infrastructure.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Scroll](https://img.shields.io/badge/Scroll-zkEVM-orange)
![Blockchain](https://img.shields.io/badge/Blockchain-Layer2-green)
![Ethereum](https://img.shields.io/badge/Ethereum-Compatible-purple)

## Features

- **Account Operations** - Retrieve account balances, transaction history, and smart contract interactions
- **Transaction Management** - Query, monitor, and analyze transaction data with detailed metadata
- **Block Explorer** - Access complete block information including transactions, gas usage, and timestamps
- **Smart Contract Integration** - Interact with deployed contracts, read state, and monitor events
- **Token Analytics** - Track token transfers, balances, and metadata across the Scroll network
- **Network Statistics** - Monitor network health, transaction volumes, and performance metrics
- **Event Logging** - Search and filter blockchain events with flexible query parameters
- **Gas Optimization** - Retrieve gas price data and estimate transaction costs for optimal efficiency

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-scroll-zkevm`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-scroll-zkevm
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-scroll-zkevm.git
cd n8n-nodes-scroll-zkevm
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-scroll-zkevm
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Scroll zkEVM API access key | Yes |
| Environment | Network environment (mainnet/testnet) | Yes |
| Base URL | Custom API endpoint (optional) | No |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve native token balance for an account |
| Get Transaction History | List all transactions for a specific account |
| Get Token Balances | Get all token balances held by an account |
| Get Contract Info | Retrieve contract details if account is a smart contract |

### 2. Transaction

| Operation | Description |
|-----------|-------------|
| Get Transaction | Retrieve detailed transaction information by hash |
| Get Receipt | Get transaction receipt with execution details |
| Get Traces | Access internal transaction traces and calls |
| Search Transactions | Find transactions with flexible filtering options |

### 3. Block

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve complete block information by number or hash |
| Get Latest Block | Get the most recent block on the network |
| Get Block Transactions | List all transactions within a specific block |
| Get Block Range | Retrieve multiple blocks within a specified range |

### 4. Contract

| Operation | Description |
|-----------|-------------|
| Read Contract | Execute read-only contract method calls |
| Get Contract Code | Retrieve deployed contract bytecode |
| Get ABI | Access contract Application Binary Interface |
| Get Events | Query contract event logs with filtering |

### 5. Token

| Operation | Description |
|-----------|-------------|
| Get Token Info | Retrieve token metadata and contract details |
| Get Token Transfers | List transfer events for a specific token |
| Get Holder Balances | Access token distribution and holder information |
| Search Tokens | Find tokens by name, symbol, or contract address |

### 6. Statistics

| Operation | Description |
|-----------|-------------|
| Get Network Stats | Retrieve overall network performance metrics |
| Get Transaction Volume | Access historical transaction volume data |
| Get Gas Statistics | Monitor gas usage patterns and price trends |
| Get TVL Data | Total Value Locked metrics across protocols |

### 7. Log

| Operation | Description |
|-----------|-------------|
| Get Logs | Search event logs with topic and address filtering |
| Get Block Logs | Retrieve all logs from a specific block |
| Get Contract Logs | Access logs for a particular smart contract |
| Stream Logs | Real-time log streaming for live monitoring |

### 8. Gas

| Operation | Description |
|-----------|-------------|
| Get Gas Price | Current and historical gas price information |
| Estimate Gas | Calculate gas requirements for transaction execution |
| Get Gas Tracker | Monitor gas price trends and recommendations |
| Get Fee History | Access historical fee data and network congestion metrics |

## Usage Examples

```javascript
// Get account balance and transaction history
{
  "account": "0x742d35Cc6634C0532925a3b8D34D2Dd8e0b2a4Be",
  "includeTokens": true,
  "limit": 100
}
```

```javascript
// Query recent transactions with gas analysis
{
  "fromBlock": "latest-100",
  "toBlock": "latest",
  "includeTraces": true,
  "gasAnalysis": true
}
```

```javascript
// Monitor token transfers for specific contract
{
  "contractAddress": "0x5300000000000000000000000000000000000004",
  "eventSignature": "Transfer(address,address,uint256)",
  "fromBlock": 1500000
}
```

```javascript
// Retrieve network statistics and gas metrics
{
  "period": "24h",
  "metrics": ["transactions", "gasUsed", "avgBlockTime"],
  "includeChart": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and has required permissions |
| Rate Limit Exceeded | Too many requests sent to the API | Implement request throttling or upgrade API plan |
| Block Not Found | Requested block number or hash does not exist | Check block identifier and ensure it exists on network |
| Invalid Address | Provided address format is incorrect | Validate address format and checksum |
| Network Timeout | Request timed out waiting for response | Retry request or check network connectivity |
| Insufficient Data | Requested data range is too large | Reduce query scope or use pagination |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-scroll-zkevm/issues)
- **Scroll Documentation**: [docs.scroll.io](https://docs.scroll.io)
- **Scroll Developer Portal**: [scroll.io/developers](https://scroll.io/developers)