def luhn_check(card_number):
    digits = [int(d) for d in card_number if d.isdigit()]

    if not digits:
        return False

    total = 0
    num_digits = len(digits)
    parity = num_digits % 2

    for i, digit in enumerate(digits):
        if i % 2 == parity:
            digit *= 2
            if digit > 9:
                digit -= 9
        total += digit

    return total % 10 == 0
