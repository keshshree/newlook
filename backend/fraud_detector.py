def detect_fraud(amount, location):
    # Simple rule-based fraud detection
    # In a real-world scenario, this would be a machine learning model

    if amount > 10000:  # Large transaction amount
        return True
    if location.lower() in ['nigeria', 'russia', 'china'] and amount > 500:  # High-risk locations
        return True
    
    return False
