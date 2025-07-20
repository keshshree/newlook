from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from dotenv import load_dotenv
import io

load_dotenv()

import validator

from model import train_model, predict, get_history
from sentiment import analyze_sentiment
from recommendation import get_recommendations
from validator import luhn_check
from fraud_detector import detect_fraud
from trading_maximization import max_profit
from resume import generate_resume_pdf
import yfinance as yf
import translators as ts
import pyotp
import base64
from gemini_ai import get_gemini_response
import requests
from bs4 import BeautifulSoup

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
    is_valid, error_message = validator.validate_email(email)
    if not is_valid:
        return jsonify({'error': error_message}), 400

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

    is_valid_email, email_error = validator.validate_email(email)
    is_valid_code, code_error = validator.validate_verification_code(code)

    if not is_valid_email:
        return jsonify({'error': email_error}), 400
    if not is_valid_code:
        return jsonify({'error': code_error}), 400

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
    is_valid, error_message = validator.validate_stock_ticker(ticker)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    history = get_history(ticker)
    return jsonify(history.to_dict('records'))

@app.route('/predict', methods=['GET'])
def get_prediction():
    ticker = request.args.get('ticker')
    is_valid, error_message = validator.validate_stock_ticker(ticker)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    model = train_model(ticker)
    prediction = predict(model)
    return jsonify({'prediction': prediction.tolist()})

@app.route('/sentiment', methods=['POST'])
def get_sentiment():
    text = request.json.get('text')
    is_valid, error_message = validator.validate_text(text)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    sentiment = analyze_sentiment(text)
    return jsonify({'sentiment': sentiment})

@app.route('/recommend', methods=['POST'])
def get_recommendations_route():
    preference = request.json.get('preference')
    is_valid, error_message = validator.validate_text(preference)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    recommendations = get_recommendations(preference)
    return jsonify({'recommendations': recommendations})

@app.route('/validate_card', methods=['POST'])
def validate_card():
    card_number = request.json.get('card_number')
    # Assuming card_number is a string of digits
    if not isinstance(card_number, str) or not card_number.isdigit():
        return jsonify({'error': 'Card number must be a string of digits.'}), 400
    is_valid = luhn_check(card_number)
    return jsonify({'is_valid': is_valid})

@app.route('/detect_fraud', methods=['POST'])
def detect_fraud_route():
    amount = request.json.get('amount')
    location = request.json.get('location')

    is_valid_amount, amount_error = validator.validate_amount(amount)
    is_valid_location, location_error = validator.validate_location(location)

    if not is_valid_amount:
        return jsonify({'error': amount_error}), 400
    if not is_valid_location:
        return jsonify({'error': location_error}), 400
    is_fraud = detect_fraud(amount, location)
    return jsonify({'is_fraud': is_fraud})

@app.route('/max_profit', methods=['POST'])
def get_max_profit():
    prices = request.json.get('prices')
    is_valid, error_message = validator.validate_prices_list(prices)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    try:
        profit = max_profit(prices)
        return jsonify({'max_profit': profit})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stock_info', methods=['GET'])
def get_stock_info():
    ticker_symbol = request.args.get('ticker', default='GOOGLE', type=str)
    is_valid, error_message = validator.validate_stock_ticker(ticker_symbol)
    if not is_valid:
        return jsonify({'error': error_message}), 400
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

    is_valid_text, text_error = validator.validate_text(text)
    is_valid_lang, lang_error = validator.validate_target_language(target_language)

    if not is_valid_text:
        return jsonify({'error': text_error}), 400
    if not is_valid_lang:
        return jsonify({'error': lang_error}), 400
    import traceback

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.json
    text = data.get('text', '')
    target_language = data.get('target_language', 'en')

    is_valid_text, text_error = validator.validate_text(text)
    is_valid_lang, lang_error = validator.validate_target_language(target_language)

    if not is_valid_text:
        return jsonify({'error': text_error}), 400
    if not is_valid_lang:
        return jsonify({'error': lang_error}), 400

    try:
        translated_text = ts.translate_text(text, to_language=target_language)
        return jsonify({'translated_text': translated_text})
    except Exception as e:
        print(f"Error during translation: {e}")
        traceback.print_exc()
        return jsonify({'error': 'An error occurred during translation. Please try again later.'}), 500

@app.route('/ask_ai', methods=['POST'])
def ask_ai():
    user_id = request.json.get('user_id') # This could be the user's email after MFA
    message = request.json.get('message')

    is_valid_user_id, user_id_error = validator.validate_user_id(user_id)
    is_valid_message, message_error = validator.validate_message(message)

    if not is_valid_user_id:
        return jsonify({'error': user_id_error}), 400
    if not is_valid_message:
        return jsonify({'error': message_error}), 400

    try:
        response_text = get_gemini_response(user_id, message)
        return jsonify({'response': response_text})
    except Exception as e:
        import traceback
        print("Error in /ask_ai endpoint:")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-resume', methods=['POST'])
def generate_resume():
    data = request.get_json()
    pdf_buffer = generate_resume_pdf(data)
    return send_file(pdf_buffer, as_attachment=True, download_name='resume.pdf', mimetype='application/pdf')

@app.route('/summarize', methods=['POST'])
def summarize_article():
    url = request.json.get('url')
    if not url:
        return jsonify({'error': 'URL is required.'}), 400
    try:
        # Fetch the article content
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        # Parse the HTML and extract the main text content
        soup = BeautifulSoup(response.text, 'html.parser')
        paragraphs = soup.find_all('p')
        article_text = '\n'.join([p.get_text() for p in paragraphs])
        # Use Gemini AI to summarize the article text
        summary = get_gemini_response('summarizer', f"Summarize the following article:\n\n{article_text}")
        return jsonify({'summary': summary})
    except Exception as e:
        import traceback
        print(f"Error in /summarize endpoint: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Failed to summarize the article.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
