// Calculate PnL for a position
const calculatePnL = (entryPrice, exitPrice, shares) => {
  return (exitPrice - entryPrice) * shares;
};

// Calculate portfolio value after trade
const calculateEquity = (cash, position) => {
  let equity = cash;
  if (position) {
    equity += position.shares * position.currentPrice;
  }
  return equity;
};

// Process a trade action
const processTrade = (action, currentPrice, cash, position, shares = 100) => {
  const result = {
    cash,
    position,
    pnl: 0,
  };

  if (action === 'BUY') {
    const cost = currentPrice * shares;
    if (cash >= cost) {
      result.cash = cash - cost;
      result.position = {
        entryPrice: currentPrice,
        shares,
        currentPrice,
      };
    }
  } else if (action === 'SELL' && position) {
    const proceeds = currentPrice * position.shares;
    result.pnl = calculatePnL(position.entryPrice, currentPrice, position.shares);
    result.cash = cash + proceeds;
    result.position = null;
  }

  return result;
};

module.exports = {
  calculatePnL,
  calculateEquity,
  processTrade,
};
