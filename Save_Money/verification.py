from decimal import Decimal
from datetime import datetime

def validate_data(data_list):
    all_errors = []
    for index, data in enumerate(data_list, start=1):
        errors = []

        # Check if 'month' is in the correct format
        try:
            datetime.strptime(data['month'], '%B-%Y')
        except ValueError:
            errors.append("Invalid month format. It should be in the format 'Month-Year', e.g., 'May-2024'.")

        # Check if 'savings_goals', 'start_balance', 'end_balance', 'expected', 'actual', and 'difference' are valid Decimal values
        decimal_fields = ['savings_goals', 'start_balance', 'end_balance', 'expected', 'actual', 'difference']
        for field in decimal_fields:
            try:
                Decimal(data[field])
            except ValueError:
                errors.append(f"Invalid value for {field}. It should be a valid decimal number.")

        # Check if 'category' is a string
        if not isinstance(data['category'], str):
            errors.append("Invalid type for 'category'. It should be a string.")

        # Check if all required fields are present
        required_fields = ['month', 'savings_goals', 'start_balance', 'summary', 'category', 'expected', 'actual', 'notes']
        for field in required_fields:
            if field not in data:
                errors.append(f"Missing required field: {field}.")

        all_errors.append(errors)

    return all_errors

# Given data
data_list = [{'month': 'May-2024', 'savings_goals': 10, 'start_balance': 50, 'end_balance': 20, 'summary': 'Budget Tracket', 'category': 'Loans', 'expected': 400, 'actual': 500, 'difference': 100, 'notes': 'Loans'}]

# Validate the data
validation_errors = validate_data(data_list)

# Print validation errors if any
for index, errors in enumerate(validation_errors):
    if errors:
        print(f"Errors in data {index + 1}:")
        for error in errors:
            print(error)
    else:
        print(f"Data {index + 1} is valid according to the requirements.")
