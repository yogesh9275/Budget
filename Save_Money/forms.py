from django import forms
from .models import Expense, User

class ExpenseForm(forms.ModelForm):
    class Meta:
        model = Expense
        fields = ['month', 'savings_goals', 'start_balance', 
                  'end_balance','summary', 'category', 'expected', 'actual', 'difference', 'notes']
                
class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'password', 'confirm_password', 'email']

