from flask import Flask, jsonify, request
from flask_cors import CORS
from model import train_model, predict, get_history
from sentiment import analyze_sentiment
from recommendation import get_recommendations
from validator import luhn_check
from fraud_detector import detect_fraud
import yfinance as yf
from textblob import TextBlob

app = Flask(__name__)
CORS(app)

@app.route('/history', methods=['GET'])
def get_stock_history():
    ticker = request.args.get('ticker')
    history = get_history(ticker)
    return jsonify(history.to_dict('records'))

@app.route('/predict', methods=['GET'])
def get_prediction():
    ticker = request.args.get('ticker')
    model = train_model(ticker)
    prediction = predict(model)
    return jsonify({'prediction': prediction.tolist()})

@app.route('/sentiment', methods=['POST'])
def get_sentiment():
    text = request.json['text']
    sentiment = analyze_sentiment(text)
    return jsonify({'sentiment': sentiment})

@app.route('/recommend', methods=['POST'])
def get_recommendations_route():
    preference = request.json['preference']
    recommendations = get_recommendations(preference)
    return jsonify({'recommendations': recommendations})

@app.route('/validate_card', methods=['POST'])
def validate_card():
    card_number = request.json['card_number']
    is_valid = luhn_check(card_number)
    return jsonify({'is_valid': is_valid})

@app.route('/detect_fraud', methods=['POST'])
def detect_fraud_route():
    amount = request.json['amount']
    location = request.json['location']
    is_fraud = detect_fraud(amount, location)
    return jsonify({'is_fraud': is_fraud})

@app.route('/stock_info', methods=['GET'])
def get_stock_info():
    ticker_symbol = request.args.get('ticker', default='AAPL', type=str)
    try:
        stock = yf.Ticker(ticker_symbol)
        info = stock.info
        # Extract relevant information
        stock_data = {
            'symbol': info.get('symbol'),
            'longName': info.get('longName'),
            'currentPrice': info.get('currentPrice'),
            'previousClose': info.get('previousClose'),
            'open': info.get('open'),
            'dayHigh': info.get('dayHigh'),
            'dayLow': info.get('dayLow'),
            'volume': info.get('volume'),
            'marketCap': info.get('marketCap'),
            'currency': info.get('currency')
        }
        return jsonify(stock_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.json
    text = data.get('text', '')
    target_language = data.get('target_language', 'en')
    try:
        blob = TextBlob(text)
        translated_text = str(blob.translate(to=target_language))
        return jsonify({'translated_text': translated_text})
    except Exception as e:
        import traceback
        print("Error in /translate endpoint:")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
