import { useState, useEffect } from 'react';
import { AppConfig, UserSession, showConnect, openContractCall } from '@stacks/connect';
import { uintCV } from '@stacks/transactions';
import { Plus, ShoppingCart, Trophy, Wallet, RefreshCw } from 'lucide-react';
import './App.css';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

// For local development with Clarinet, we use 'testnet' as network type
const network = 'testnet' as const;
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'economiccounter';

interface Counter {
  id: number;
  owner: string;
  value: number;
  totalSpent: number;
  milestonesReached: number[];
  forSale: boolean;
  salePrice: number;
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [userCounters, setUserCounters] = useState<Counter[]>([]);
  const [marketplaceCounters, setMarketplaceCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(false);
  const [contractBalance, setContractBalance] = useState<number>(0);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(() => {
        setIsConnected(true);
        const userData = userSession.loadUserData();
        setUserAddress(userData.profile.stxAddress.testnet);
      });
    } else if (userSession.isUserSignedIn()) {
      setIsConnected(true);
      const userData = userSession.loadUserData();
      setUserAddress(userData.profile.stxAddress.testnet);
    }
  }, []);

  useEffect(() => {
    if (isConnected && userAddress) {
      loadUserCounters();
      loadMarketplaceCounters();
      loadContractBalance();
    }
  }, [isConnected, userAddress]);

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'Economic Counter',
        icon: window.location.origin + '/logo.svg',
      },
      redirectTo: '/',
      onFinish: () => {
        setIsConnected(true);
        const userData = userSession.loadUserData();
        setUserAddress(userData.profile.stxAddress.testnet);
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setIsConnected(false);
    setUserAddress('');
    setUserCounters([]);
  };

  const createCounter = async () => {
    if (!isConnected) return;
    
    setLoading(true);
    try {
      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-counter',
        functionArgs: [],
        network,
        onFinish: (data) => {
          console.log('Counter created:', data);
          // Wait a bit for transaction to be processed, then reload
          setTimeout(() => {
            loadUserCounters();
            loadContractBalance();
          }, 2000);
        },
        onCancel: () => {
          console.log('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error creating counter:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementCounter = async (counterId: number) => {
    if (!isConnected) return;
    
    setLoading(true);
    try {
      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'increment-counter',
        functionArgs: [uintCV(counterId)],
        network,
        onFinish: (data) => {
          console.log('Counter incremented:', data);
          // Wait a bit for transaction to be processed, then reload
          setTimeout(() => {
            loadUserCounters();
            loadContractBalance();
          }, 2000);
        },
        onCancel: () => {
          console.log('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error incrementing counter:', error);
    } finally {
      setLoading(false);
    }
  };

  const listCounterForSale = async (counterId: number, price: number) => {
    if (!isConnected) return;
    
    setLoading(true);
    try {
      await openContractCall({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Replace with your contract address
        contractName: 'economiccounter',
        functionName: 'list-counter-for-sale',
        functionArgs: [uintCV(counterId), uintCV(price * 1000000)], // Convert STX to microSTX
        network,
        onFinish: (data) => {
          console.log('Counter listed for sale:', data);
          loadUserCounters();
          loadMarketplaceCounters();
        },
        onCancel: () => {
          console.log('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error listing counter for sale:', error);
    } finally {
      setLoading(false);
    }
  };

  const buyCounter = async (counterId: number) => {
    if (!isConnected) return;
    
    setLoading(true);
    try {
      await openContractCall({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Replace with your contract address
        contractName: 'economiccounter',
        functionName: 'buy-counter',
        functionArgs: [uintCV(counterId)],
        network,
        onFinish: (data) => {
          console.log('Counter purchased:', data);
          loadUserCounters();
          loadMarketplaceCounters();
        },
        onCancel: () => {
          console.log('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error buying counter:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserCounters = async () => {
    if (!isConnected) return;
    
    try {
      // Since we don't have devnet running, let's show a demo counter that represents
      // what would be loaded from the contract
      console.log('Loading user counters for:', userAddress);
      
      // Simulate having created a counter
      setUserCounters([
        {
          id: 1,
          owner: userAddress,
          value: 0,
          totalSpent: 0,
          milestonesReached: [],
          forSale: false,
          salePrice: 0,
        },
      ]);
      
      console.log('Demo counter loaded - click Create Counter to interact with real contract');
    } catch (error) {
      console.error('Error loading user counters:', error);
      setUserCounters([]);
    }
  };

  const loadMarketplaceCounters = async () => {
    // In a real implementation, you'd need to track all counters for sale
    // This could be done through events or by maintaining a separate list
    const mockMarketplace: Counter[] = [
      {
        id: 2,
        owner: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
        value: 15,
        totalSpent: 50000000, // 50 STX
        milestonesReached: [10],
        forSale: true,
        salePrice: 25000000, // 25 STX
      },
    ];
    
    setMarketplaceCounters(mockMarketplace);
    console.log('Marketplace counters loaded (mock data)');
  };

  const loadContractBalance = async () => {
    try {
      // Since devnet isn't running, simulate the balance
      // In console you can check: (contract-call? .economiccounter get-contract-balance)
      setContractBalance(0); // Shows 0 STX as per your console test
      console.log('Contract balance loaded: 0 STX (demo mode)');
    } catch (error) {
      console.error('Error loading contract balance:', error);
    }
  };

  const calculateIncrementCost = (currentValue: number): number => {
    // Base cost + (base cost * current value squared)
    return (1 + currentValue * currentValue);
  };

  const getNextMilestone = (value: number): number => {
    if (value < 10) return 10;
    if (value < 50) return 50;
    if (value < 100) return 100;
    if (value < 500) return 500;
    if (value < 1000) return 1000;
    return 0;
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>🏆 Economic Counter</h1>
          {isConnected && (
            <div className="contract-info">
              <span>Contract Balance: {(contractBalance / 1000000).toFixed(2)} STX</span>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '2px' }}>
                📍 Demo Mode - Start devnet for full functionality
              </div>
            </div>
          )}
        </div>
        <div className="wallet-section">
          {isConnected ? (
            <div className="connected">
              <button 
                onClick={() => {
                  loadUserCounters();
                  loadMarketplaceCounters();
                  loadContractBalance();
                }} 
                className="refresh-btn"
                title="Refresh data"
              >
                <RefreshCw size={16} />
              </button>
              <span className="address">{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
              <button onClick={disconnectWallet} className="disconnect-btn">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={connectWallet} className="connect-btn">
              <Wallet size={20} />
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      {isConnected ? (
        <main className="main">
          <section className="user-section">
            <div className="section-header">
              <h2>My Counters</h2>
              <button 
                onClick={createCounter} 
                disabled={loading}
                className="create-btn"
              >
                <Plus size={20} />
                Create Counter
              </button>
            </div>
            
            <div className="counters-grid">
              {userCounters.length === 0 ? (
                <div className="empty-state">
                  <p>No counters yet. Create your first counter!</p>
                </div>
              ) : (
                userCounters.map((counter) => (
                  <div key={counter.id} className="counter-card">
                    <div className="counter-header">
                      <h3>Counter #{counter.id}</h3>
                      <div className="counter-value">{counter.value}</div>
                    </div>
                    
                    <div className="counter-stats">
                      <div className="stat">
                        <span>Total Spent:</span>
                        <span>{(counter.totalSpent / 1000000).toFixed(2)} STX</span>
                      </div>
                      <div className="stat">
                        <span>Next Cost:</span>
                        <span>{calculateIncrementCost(counter.value)} STX</span>
                      </div>
                      <div className="stat">
                        <span>Next Milestone:</span>
                        <span>{getNextMilestone(counter.value) || 'Max reached!'}</span>
                      </div>
                    </div>

                    {counter.milestonesReached.length > 0 && (
                      <div className="milestones">
                        <Trophy size={16} />
                        <span>Milestones: {counter.milestonesReached.join(', ')}</span>
                      </div>
                    )}
                    
                    <div className="counter-actions">
                      <button 
                        onClick={() => incrementCounter(counter.id)}
                        disabled={loading}
                        className="increment-btn"
                      >
                        <Plus size={16} />
                        Increment ({calculateIncrementCost(counter.value)} STX)
                      </button>
                      
                      {!counter.forSale && (
                        <button 
                          onClick={() => {
                            const price = prompt('Enter sale price in STX:');
                            if (price) listCounterForSale(counter.id, parseFloat(price));
                          }}
                          disabled={loading}
                          className="sell-btn"
                        >
                          <ShoppingCart size={16} />
                          List for Sale
                        </button>
                      )}
                      
                      {counter.forSale && (
                        <div className="for-sale-badge">
                          For Sale: {(counter.salePrice / 1000000).toFixed(2)} STX
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="marketplace-section">
            <div className="section-header">
              <h2>🛒 Marketplace</h2>
              <button onClick={loadMarketplaceCounters} className="refresh-btn">
                Refresh
              </button>
            </div>
            
            <div className="counters-grid">
              {marketplaceCounters.length === 0 ? (
                <div className="empty-state">
                  <p>No counters for sale currently.</p>
                </div>
              ) : (
                marketplaceCounters.map((counter) => (
                  <div key={counter.id} className="counter-card marketplace-card">
                    <div className="counter-header">
                      <h3>Counter #{counter.id}</h3>
                      <div className="counter-value">{counter.value}</div>
                    </div>
                    
                    <div className="counter-stats">
                      <div className="stat">
                        <span>Owner:</span>
                        <span>{counter.owner.slice(0, 6)}...{counter.owner.slice(-4)}</span>
                      </div>
                      <div className="stat">
                        <span>Total Spent:</span>
                        <span>{(counter.totalSpent / 1000000).toFixed(2)} STX</span>
                      </div>
                      <div className="stat">
                        <span>Price:</span>
                        <span className="price">{(counter.salePrice / 1000000).toFixed(2)} STX</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => buyCounter(counter.id)}
                      disabled={loading || counter.owner === userAddress}
                      className="buy-btn"
                    >
                      Buy for {(counter.salePrice / 1000000).toFixed(2)} STX
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      ) : (
        <div className="welcome">
          <h2>Welcome to Economic Counter</h2>
          <p>Connect your Stacks wallet to start playing!</p>
          <ul>
            <li>🎯 Create counters and increment them with STX</li>
            <li>💰 Costs increase exponentially with each increment</li>
            <li>🏆 Earn milestone rewards at 10, 50, 100, 500, and 1000</li>
            <li>🛒 Buy and sell counters in the marketplace</li>
          </ul>
          
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: '#fef3c7', 
            borderRadius: '0.5rem',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0' }}>🚀 To Enable Full Backend:</h3>
            <ol style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
              <li>Install Docker Desktop</li>
              <li>Run: <code>clarinet devnet start</code></li>
              <li>The app will connect to your local blockchain</li>
            </ol>
            <p style={{ fontSize: '0.75rem', margin: '0.5rem 0 0 0', fontStyle: 'italic' }}>
              Currently in demo mode - wallet interactions will show transaction popups but won't persist data.
            </p>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
}

export default App;