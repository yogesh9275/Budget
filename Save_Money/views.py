from django.shortcuts import render
from django.http import JsonResponse
import time
from .models import Expense, User
from .forms import ExpenseForm, UserForm
import json
import logging
from django.utils import timezone
from django.contrib.auth.hashers import check_password, make_password
import time

logger = logging.getLogger(__name__)

def home(request):
    timestamp = int(timezone.now().timestamp())
    version = int(time.time())
    context = {
            'timestamp': timestamp,
            'version': version
        }
    return render(request, 'home.html', context)

def login(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))  # Parse JSON data from request body
        username = data.get('username')
        logger.info(f"Username: {username}")
        password = data.get('password')
        logger.info(f"Password: {password}")
        user = User.objects.get(username=username)
        logger.info(f"Username from User Databse:{user}")
        
        if check_password(password, user.password):
            # Authentication successful
            logger.info(f"Login Successfully")
            return JsonResponse({'message': 'Login successful'})
        else:
            # Authentication failed
            logger.info(f"Login Failed")
            return JsonResponse({'message': 'Incorrect password'}, status=400)
    else:
        # Handle GET request to render the form
        form = UserForm()
        timestamp = int(timezone.now().timestamp())
        version = int(time.time())
        context = {
            'timestamp': timestamp,
            'version': version,
            'form': form
        }
        return render(request, 'login.html', context)



def Register(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))  # Parse JSON data from request body
        user_data = data.get('user')
        logger.info(user_data)
        
        # Hash the password before saving
        user_data['password'] = make_password(user_data['password'])

        form = UserForm(user_data)
        if form.is_valid():
            form.save()
            logger.info("User registration successful")
            return JsonResponse({'message': 'User registered successfully'})
        else:
            # Return error response if form is not valid
            logger.error('User registration failed')
            return JsonResponse({'error': 'Invalid form data'}, status=400)
    else:
        # Handle GET request to render the form
        form = UserForm()
        timestamp = int(timezone.now().timestamp())
        version = int(time.time())
        context = {
            'timestamp': timestamp,
            'version': version,
            'form': form
        }
        return render(request, 'Register.html', context)
    

def create_expense(month,expense_data_list,category):
    errors = []
    for expense_data in expense_data_list:
        if not Expense.objects.filter(category=category, month=month).exists():
            # Create a new expense record if no record exists for the given month and category
            form = ExpenseForm(expense_data)
            if form.is_valid():
                form.save()
                logger.info("Saved expense")
            else:
                logger.error("Error saving expense")
                errors.append(form.errors)
        else:
            logger.info("Expense already exists for category and month:", category, month)
    return True

def update_expense(expense_data_list):
    errors = []
    updated_expenses = []
    
    for expense_data in expense_data_list:
        month = expense_data.get('month')
        category = expense_data.get('category')
        logger.info(f"Month:{month}")
        logger.info(f"Category:{category}")
        
        try:
            # Retrieve the existing expense records
            expenses = Expense.objects.filter(month=month, category=category)
            
            if expenses.exists():
                # Update existing expense records
                for expense in expenses:
                    logger.info("Expense in Expenses Loop.")
                    for key in expense_data:
                        logger.info("Key in Expense_Data Loop.")
                        value = expense_data[key]
                        if getattr(expense, key) != value:
                            # If there is a difference, update the record
                            logger.info("Updated expense record.")
                            setattr(expense, key, value)
                            expense.save()
                            updated_expenses.append({'month': month, 'category': category})
                            break  # Exit the loop after updating one record
            else:
                # Call insert function if record is not present
                create_expense(month,[expense_data],category)
                updated_expenses.append({'month': month, 'category': category})
        except Exception as e:
            logger.error(f"An error occurred: {str(e)}")
            errors.append(str(e))
    
    if errors:
        return False, errors
    else:
        return True, updated_expenses

def check_month_exist(month,category):
    # Check if there is any expense entry for the given month
    if Expense.objects.filter(month=month,category=category).exists():
        return 'Insert'  # If entries exist, return 'Insert'
    else:
        return 'Update'  # If no entries exist, return 'Update'


def manage_expenses(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))  # Parse JSON data from request body
        expenses_data = data.get('expense')
        logger.info(expenses_data)
        logger.info('Received request to update expenses.')
        if expenses_data:
            if update_expense(expenses_data):
                logger.info("Updated expenses")
                return JsonResponse({'success': True})
            else:
                logger.info("Invalid request")
                return JsonResponse({'error': 'Invalid expenses data.'})
    else:
        timestamp = int(timezone.now().timestamp())
        version = int(time.time())
        context = {
            'timestamp': timestamp,
            'version': version,
        }
        return render(request, 'manage_expenses.html', context)


def get_expenses_by_month(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))  # Parse JSON data from request body
        month = data.get('month')
        logger.info(data)
        if month:
            try:
                # Query the database to get all expenses for the specified month
                expenses = Expense.objects.filter(month=month)
                # Serialize the expenses data
                serialized_expenses = []
                for expense in expenses:
                    serialized_expense = {
                        'savings_goals':expense.savings_goals,
                        'start_balance':expense.start_balance, 
                        'end_balance':expense.end_balance,
                        'summary':expense.summary,
                        'month': expense.month,
                        'category': expense.category,
                        'expected': expense.expected,
                        'actual': expense.actual,
                        'difference': expense.difference,
                        'notes': expense.notes
                    }
                    serialized_expenses.append(serialized_expense)
                # Return the serialized expenses data as JSON response
                logger.info(serialized_expenses)
                return JsonResponse({'success': True, 'expenses': serialized_expenses})
            except Exception as e:
                return JsonResponse({'success': False, 'error': str(e)})
        else:
            return JsonResponse({'success': False, 'error': 'Invalid month provided.'})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method.'})


def delete_expense(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8')) 
        month = data.get('month')
        logger.info(f"Month: {month}")
        category = data.get('category')
        logger.info(f"Category: {category}")

        try:
            # Get the expense record to delete
            expense = Expense.objects.get(month=month, category=category)
            # Delete the expense record
            expense.delete()
            logger.info('Deleted expense record')
            return JsonResponse({'success': True})  # Return success response
        except Expense.DoesNotExist:
            # If the expense record does not exist
            logger.info("Record doesn't exists.")
            return JsonResponse({'success': False, 'error': 'Expense record not found.'})
        except Exception as e:
            # If any other error occurs
            print(f"An error occurred: {e}")
            return JsonResponse({'success': False, 'error': str(e)})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method.'})