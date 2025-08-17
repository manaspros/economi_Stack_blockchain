# 🏆 Economic Counter

## A Blockchain-Powered Counter Game with Economic Incentives
<img width="2879" height="1622" alt="image" src="https://github.com/user-attachments/assets/4f24b51e-6e97-4c3a-9657-03846bc7f676" />

## Contract Details:
ST29BB7SQJC7AYVCDYG94KXFYR3HW0ADDKPTNTSC.economiccounter


## 📋 Project Description

Economic Counter is an innovative Web3 application built on the Stacks blockchain that transforms a simple counter into an engaging economic experiment. Players pay STX tokens to increment their personal counters, with costs escalating exponentially based on the formula: `1 STX + (current_value)² STX`.

The game features:

- **Personal Counter Creation**: Each player can create multiple counters starting at zero
- **Exponential Pricing Model**: Costs increase dramatically with each increment
- **Milestone Reward System**: Automatic STX rewards at 10, 50, 100, 500, and 1000 increments
- **Counter Marketplace**: Buy and sell counter values between players
- **Transparent Blockchain Gaming**: All mechanics enforced through Clarity smart contracts

This project demonstrates advanced smart contract development, economic game theory, and modern Web3 integration.

## 🔮 Project Vision

Our vision is to create a new paradigm of blockchain-based economic gaming that:

### 🌟 Core Vision Elements

- **Democratizes Investment Gaming**: Makes complex economic concepts accessible through intuitive gameplay
- **Rewards Strategic Thinking**: Players balance immediate costs with long-term milestone rewards
- **Creates Digital Asset Value**: Counters become tradeable assets with real economic worth
- **Builds Community Wealth**: Marketplace dynamics enable strategic profit generation
- **Demonstrates Blockchain Utility**: Showcases practical smart contract applications beyond basic DeFi

### 🎯 Educational Goals

- Teach exponential cost models and investment strategies
- Provide hands-on experience with blockchain transactions
- Demonstrate market dynamics and asset valuation
- Create understanding of economic incentive structures

## 🚀 Future Scope

### Phase 1: Enhanced Features

- [ ] Advanced counter analytics and statistics dashboard
- [ ] Player leaderboards and achievement systems
- [ ] Social features (counter sharing, player following)
- [ ] Marketplace filters and advanced search
- [ ] Counter history and transaction logs

### Phase 2: Advanced Economics

- [ ] Dynamic pricing based on global market demand
- [ ] Staking mechanisms for passive STX rewards
- [ ] Counter insurance and protection systems
- [ ] Automated trading bots and strategies
- [ ] Multi-tier milestone systems with rare rewards

### Phase 3: Platform Evolution

- [ ] DAO governance for rule changes and updates
- [ ] Cross-chain bridge support (Bitcoin, Ethereum)
- [ ] Mobile application development
- [ ] Counter NFT integration and artwork
- [ ] Tournament modes and competitive events

### Phase 4: Ecosystem Expansion

- [ ] Integration with other Stacks DeFi protocols
- [ ] Educational content and strategy guides
- [ ] API for third-party developers
- [ ] Counter derivatives and financial products
- [ ] Enterprise gaming solutions

## 📍 Contract Address

### Testnet Deployment

```
Contract Address: [TO_BE_DEPLOYED]
Network: Stacks Testnet
Contract Name: economiccounter
```

### Mainnet Deployment

```
Contract Address: [TO_BE_DEPLOYED]
Network: Stacks Mainnet
Contract Name: economiccounter
Status: Pending
```

**Note**: Update these addresses after deployment using `clarinet deployments apply`

## 💻 User Commands

### Smart Contract Interaction Commands

```bash
# 1. Create a new counter
clarinet console
(contract-call? .economiccounter create-counter)

# 2. Increment your counter (replace u1 with your counter-id)
(contract-call? .economiccounter increment-counter u1)

# 3. List counter for sale (counter-id u1, price 5 STX)
(contract-call? .economiccounter list-counter-for-sale u1 u5000000)

# 4. Remove counter from sale
(contract-call? .economiccounter unlist-counter u1)

# 5. Buy a counter from marketplace
(contract-call? .economiccounter buy-counter u1)

# 6. Get counter details
(contract-call? .economiccounter get-counter u1)

# 7. Get your counters list
(contract-call? .economiccounter get-user-counters tx-sender)

# 8. Calculate increment cost for current value
(contract-call? .economiccounter calculate-increment-cost u5)

# 9. Get next milestone for a value
(contract-call? .economiccounter get-next-milestone u25)

# 10. Check if milestone was claimed
(contract-call? .economiccounter milestone-claimed? u1 u10)
```

### Development Commands

```bash
# Install dependencies
npm install
cd frontend && npm install

# Run smart contract tests
npm test

# Start local blockchain console
clarinet console

# Deploy to testnet
clarinet deployments apply --testnet

# Start frontend development server
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build

# Check contract syntax
clarinet check

# Generate deployment plan
clarinet deployments generate --testnet
```

### Testing Commands

```bash
# Run all contract tests
clarinet test

# Run specific test file
clarinet test tests/economiccounter.test.ts

# Run tests with coverage
clarinet test --coverage

# Validate contract without deploying
clarinet check contracts/economiccounter.clar
```

## ✨ Key Features

### 🎮 Core Gameplay

- **Counter Creation**: Players can create multiple personal counters
- **Exponential Pricing**: Cost formula: `1 STX + (current_value)² STX`
- **Milestone Rewards**: Automatic STX rewards at 10, 50, 100, 500, and 1000 increments
- **Progress Tracking**: Real-time display of total spent and next milestone

### 🛒 Marketplace Economy

- **List for Sale**: Set any price for your counter
- **Buy/Sell**: Transfer ownership with automatic payment processing
- **Market Discovery**: Browse all counters available for purchase
- **Value Assessment**: See total investment and current counter values

### 🔐 Blockchain Security

- **Smart Contract Logic**: All rules enforced on-chain
- **STX Payment Processing**: Native Stacks token integration
- **Ownership Verification**: Cryptographic proof of counter ownership
- **Transparent Transactions**: All actions recorded on blockchain

## 💰 Economic Model

### Pricing Structure

```
Increment 0→1:   1 STX
Increment 1→2:   2 STX
Increment 2→3:   5 STX
Increment 3→4:   10 STX
Increment 4→5:   17 STX
...
Increment n→n+1: (1 + n²) STX
```

### Milestone Rewards

```
10 increments:   0.5 STX   (Break-even point)
50 increments:   2.5 STX   (Significant bonus)
100 increments: 10 STX     (Major milestone)
500 increments: 75 STX     (Elite achievement)
1000 increments: 200 STX   (Legendary status)
```

### Investment Analysis

- **Early increments** are affordable for experimentation
- **Middle ranges** require strategic investment decisions
- **High values** become extremely expensive, creating natural scarcity
- **Milestones** provide ROI incentives for dedicated players

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Clarinet CLI for smart contract development
- Stacks wallet (Hiro Wallet recommended)
- STX tokens for gameplay (get testnet tokens from faucet)

### Installation

1. **Clone and setup**

   ```bash
   git clone <repository-url>
   cd economic-counter
   npm install
   cd frontend && npm install
   ```

2. **Test smart contracts**

   ```bash
   npm test
   ```

3. **Deploy to testnet**

   ```bash
   clarinet deployments apply --testnet
   ```

4. **Update frontend with contract address**

   ```bash
   # Copy deployed address and update frontend/src/App.tsx
   ```

5. **Start application**
   ```bash
   cd frontend && npm run dev
   ```

## 🧪 Testing

### Smart Contract Tests

```bash
npm test
```

- 8 comprehensive test suites
- Counter creation and increment functionality
- Milestone reward distribution
- Marketplace buy/sell operations
- Error handling and edge cases

### Frontend Testing

```bash
cd frontend
npm run build  # Verify production build
```

## 🌐 Deployment

### Testnet Deployment

1. **Get testnet STX**

   - Visit https://explorer.stacks.co/sandbox/faucet?chain=testnet
   - Request tokens for your wallet

2. **Deploy contract**

   ```bash
   clarinet deployments apply --testnet
   ```

3. **Update frontend**
   - Copy deployed contract address
   - Update `contractAddress` in `frontend/src/App.tsx`

### Production Deployment

```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting provider
```

## 📋 Project Structure

```
economic-counter/
├── contracts/
│   └── economiccounter.clar      # Smart contract code
├── tests/
│   └── economiccounter.test.ts   # Contract test suite
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main React component
│   │   └── App.css              # Styling and layout
│   └── package.json             # Frontend dependencies
├── deployments/                 # Deployment configurations
├── Clarinet.toml               # Project configuration
└── README.md                   # This file
```

## 🎮 Gameplay Strategy

### For New Players

1. **Start Small**: Create your first counter and increment it a few times
2. **Learn Costs**: Understand how pricing escalates
3. **Target Milestones**: Aim for the 10-increment reward first
4. **Market Research**: Browse marketplace to understand counter values

### For Advanced Players

1. **Multiple Counters**: Diversify with several counters at different stages
2. **Milestone Timing**: Calculate ROI for reaching next milestones
3. **Market Trading**: Buy undervalued counters, sell at profit
4. **Long-term Strategy**: Consider 1000-increment legendary status

## 🔧 Contributing

### Development Setup

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open Pull Request

### Code Standards

- **Smart Contracts**: Follow Clarity best practices
- **Frontend**: Use TypeScript for type safety
- **Testing**: Maintain 100% test coverage for contracts
- **Documentation**: Update README for significant changes

## 📈 Roadmap

### Phase 1: Core Features ✅

- [x] Basic counter functionality
- [x] Exponential pricing model
- [x] Milestone reward system
- [x] Marketplace implementation

### Phase 2: Enhanced Features

- [ ] Counter statistics and analytics
- [ ] Leaderboards and achievements
- [ ] Social features (sharing, following)
- [ ] Advanced marketplace filters

### Phase 3: Advanced Economics

- [ ] Dynamic pricing based on market demand
- [ ] Staking mechanisms for passive rewards
- [ ] DAO governance for rule changes
- [ ] Cross-chain bridge support

## 🤝 Community

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Share strategies and ask questions
- **Discord**: Join our community server (link coming soon)
- **Twitter**: Follow @EconomicCounter for updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stacks Foundation** for the blockchain infrastructure
- **Hiro Systems** for development tools and documentation
- **Clarity Language** for secure smart contract development
- **React Community** for the amazing frontend ecosystem

---

## 🎯 Quick Start Summary

1. **Install**: `npm install && cd frontend && npm install`
2. **Test**: `npm test`
3. **Deploy**: `clarinet deployments apply --testnet`
4. **Update Address**: Copy contract address to frontend
5. **Run**: `cd frontend && npm run dev`
6. **Play**: Connect wallet and start your economic journey!

**Ready to play? Connect your wallet and start incrementing!** 🚀
