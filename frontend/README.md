# Economic Counter Frontend

A React.js frontend for the Economic Counter smart contract built with Vite and TypeScript.

## Features

- **Wallet Integration**: Connect your Stacks wallet (Hiro Wallet, Xverse, etc.)
- **Counter Management**: Create and increment counters with STX payments
- **Escalating Costs**: Each increment costs more (exponential pricing)
- **Milestone Rewards**: Earn STX rewards at milestones (10, 50, 100, 500, 1000)
- **Marketplace**: Buy and sell counters from other users
- **Real-time Updates**: See your counter values and rewards instantly

## Prerequisites

- Node.js 16+ and npm
- A Stacks wallet (Hiro Wallet recommended)
- STX tokens for transactions

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

## Configuration

Before using the app, you need to update the contract address in `src/App.tsx`:

```typescript
// Replace this with your deployed contract address
contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
```

## Usage

### 1. Connect Wallet
- Click "Connect Wallet" in the top right
- Approve the connection in your Stacks wallet

### 2. Create Counter
- Click "Create Counter" to create your first counter
- This requires a small transaction fee

### 3. Increment Counter
- Click "Increment" on any of your counters
- Pay the STX cost (increases exponentially)
- Watch your counter value grow!

### 4. Milestone Rewards
- Reach milestones (10, 50, 100, 500, 1000) to earn STX rewards
- Rewards are automatically sent to your wallet

### 5. Marketplace
- List your counters for sale by clicking "List for Sale"
- Browse and buy counters from other users
- Transfer ownership happens automatically

## Pricing Structure

- **Base Cost**: 1 STX for the first increment
- **Formula**: Cost = 1 + (current_value)²
- **Examples**:
  - Value 0 → 1: 1 STX
  - Value 1 → 2: 2 STX  
  - Value 2 → 3: 5 STX
  - Value 3 → 4: 10 STX

## Milestone Rewards

- **10 clicks**: 0.5 STX
- **50 clicks**: 2.5 STX
- **100 clicks**: 10 STX
- **500 clicks**: 75 STX
- **1000 clicks**: 200 STX