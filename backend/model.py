import numpy as np
from sklearn.linear_model import LinearRegression
import yfinance as yf

def get_history(ticker):
    # Fetch the last 8 years of stock data
    data = yf.download(ticker, period='8y', interval='1d')
    data.reset_index(inplace=True)
    return data[['Date', 'Close']]

def train_model(ticker):
    # Fetch the last 8 years of stock data
    data = yf.download(ticker, period='8y', interval='1d')
    X = np.array(range(len(data))).reshape(-1, 1)
    y = data['Close'].values
    model = LinearRegression()
    model.fit(X, y)
    return model

def predict(model):
    # Predict the next day's closing price
    return model.predict(np.array([[len(model.coef_)]]))
