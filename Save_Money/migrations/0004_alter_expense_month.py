# Generated by Django 5.0.4 on 2024-05-03 11:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Save_Money', '0003_alter_expense_end_balance'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expense',
            name='month',
            field=models.DateField(),
        ),
    ]
