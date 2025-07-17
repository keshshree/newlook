'''
Stock Trading Profit Maximization

Given a list of stock prices of particular stock. Want to maximize profit by buying and selling the stock
at the right time. On each day, we can either buy the stock, sell the stock, or do nothing.

We can only hold at most one share of the stock at any time. However, we can buy it then immediately sell
it on the same day.

This function takes in a list of stock prices and returns the maximum profit we can acheive.

If no profit can be made, return 0.

The function should take in a list of stock prices as input and return the maximum profit.

'''

def max_profit(prices):
    if not prices:
        return 0

    n = len(prices)
    dp = [[0] * 2 for _ in range(n)]
    dp[0][0] = 0          # Profit on day 0 if we don't have a stock
    dp[0][1] = -prices[0] # Profit on day 0 if we have a stock

    for i in range(1, n):
        dp[i][0] = max(dp[i-1][0], dp[i-1][1] + prices[i]) # Max profit if we don't have a stock on day i
        dp[i][1] = max(dp[i-1][1], dp[i-1][0] - prices[i]) # Max profit if we have a stock on day i

    return dp[n-1][0]

# Example usage:


