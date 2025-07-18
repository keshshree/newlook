from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from model import train_model, predict, get_history
from sentiment import analyze_sentiment
from recommendation import get_recommendations
from validator import luhn_check
from fraud_detector import detect_fraud
from trading_maximization import max_profit
import yfinance as yf
from textblob import TextBlob
import pyotp
import base64
from gemini_ai import get_gemini_response

app = Flask(__name__)
CORS(app)

# In a real application, store secrets securely in a database associated with the user
mfa_secrets = {}

def is_valid_email_domain(email):
    allowed_domains = ['@gmail.com', '@yahoo.com']
    return any(email.endswith(domain) for domain in allowed_domains)

@app.route('/mfa/setup', methods=['POST'])
def mfa_setup():
    email = request.json.get('email')
    if not email or not is_valid_email_domain(email):
        return jsonify({'error': 'Invalid or unsupported email domain.'}), 400

    # Generate a random secret key
    secret = pyotp.random_base32()
    mfa_secrets[email] = secret

    # Generate a provisioning URI for the QR code
    # The issuer_name is what shows up in the authenticator app
    provisioning_uri = pyotp.totp.TOTP(secret).provisioning_uri(
        name=email, issuer_name="NewlookApp"
    )

    return jsonify({'secret': secret, 'provisioning_uri': provisioning_uri})

@app.route('/mfa/verify', methods=['POST'])
def mfa_verify():
    email = request.json.get('email')
    code = request.json.get('code')

    if not email or not code:
        return jsonify({'error': 'Email and code are required.'}), 400

    secret = mfa_secrets.get(email)
    if not secret:
        return jsonify({'error': 'MFA not set up for this email.'}), 400

    totp = pyotp.TOTP(secret)
    if totp.verify(code):
        # MFA successful, clear the secret for security (optional, depending on flow)
        # In a real app, you'd mark the user as verified in your database
        # del mfa_secrets[email] # Uncomment if you want single-use secrets
        return jsonify({'verified': True})
    else:
        return jsonify({'verified': False, 'error': 'Invalid code.'}), 401

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

@app.route('/max_profit', methods=['POST'])
def get_max_profit():
    prices = request.json.get('prices')
    if not isinstance(prices, list):
        return jsonify({'error': 'Prices must be a list.'}), 400
    try:
        profit = max_profit(prices)
        return jsonify({'max_profit': profit})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

@app.route('/ask_ai', methods=['POST'])
def ask_ai():
    user_id = request.json.get('user_id') # This could be the user's email after MFA
    message = request.json.get('message')

    if not user_id or not message:
        return jsonify({'error': 'User ID and message are required.'}), 400

    try:
        response_text = get_gemini_response(user_id, message)
        return jsonify({'response': response_text})
    except Exception as e:
        import traceback
        print("Error in /ask_ai endpoint:")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
