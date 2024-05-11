from django.db import models

class Expense(models.Model):

    CATEGORY_CHOICES = (
        ('Wages', 'Wages'),
        ('Other Income', 'Other Income'),
        ('Rent/Mortgage', 'Rent/Mortgage'),
        ('Groceries', 'Groceries'),
        ('Restaurants', 'Restaurants'),
        ('Insurance', 'Insurance'),
        ('Utilities', 'Utilities'),
        ('Gas', 'Gas'),
        ('Entertainment', 'Entertainment'),
        ('Loans', 'Loans'),
    )

    month = models.CharField(max_length=20)
    savings_goals = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    start_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    end_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True)
    summary = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    expected = models.DecimalField(max_digits=10, decimal_places=2)
    actual = models.DecimalField(max_digits=10, decimal_places=2)
    difference = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    notes = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if self.expected is not None and self.actual is not None:
            self.difference = self.expected - self.actual
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.month} - {self.category}"


class User(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    confirm_password = models.CharField(max_length=100)
    email = models.EmailField()

    def __str__(self):
        return self.username