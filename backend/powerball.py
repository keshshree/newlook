import json
from datetime import datetime
import random
import csv

PREDICTION_FILE = 'backend/prediction_counts.json'
MAX_PREDICTIONS_PER_DAY = 3

def get_prediction_counts():
    try:
        with open(PREDICTION_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_prediction_counts(counts):
    with open(PREDICTION_FILE, 'w') as f:
        json.dump(counts, f, indent=2)

def get_past_winning_numbers():
    past_numbers = []
    with open('backend/powerball.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            winning_numbers_str = row['Winning Numbers']
            winning_numbers = [int(n) for n in winning_numbers_str.split()]
            past_numbers.append(winning_numbers)
    return past_numbers

def generate_single_prediction():
    white_balls = sorted(random.sample(range(1, 70), 5))
    powerball = random.randint(1, 27)
    return white_balls + [powerball]

def get_powerball_prediction(email):
    if not email or '@' not in email:
        return {"error": "A valid email is required."}, 400

    counts = get_prediction_counts()
    today = datetime.utcnow().strftime('%Y-%m-%d')

    user_data = counts.get(email, {})
    if user_data.get('date') == today and user_data.get('count', 0) >= MAX_PREDICTIONS_PER_DAY:
        return {"error": "You have reached the maximum of 3 predictions for today."}, 429

    past_winning_numbers = get_past_winning_numbers()
    
    while True:
        prediction_numbers = generate_single_prediction()
        if prediction_numbers[:5] not in [past_numbers[:5] for past_numbers in past_winning_numbers]:
            break

    prediction = {
        "white_balls": prediction_numbers[:5],
        "powerball": prediction_numbers[5]
    }

    if user_data.get('date') == today:
        user_data['count'] += 1
    else:
        user_data = {'date': today, 'count': 1}
    
    counts[email] = user_data
    save_prediction_counts(counts)

    return {"prediction": prediction}, 200