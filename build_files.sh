#!/bin/bash

# Install Python and pip if not already installed
if ! command -v python &> /dev/null; then
    echo "Python is not installed. Installing Python..."
    sudo apt-get update
    sudo apt-get install -y python
else
    echo "Python is already installed."
fi

if ! command -v pip &> /dev/null; then
    echo "pip is not installed. Installing pip..."
    sudo apt-get update
    sudo apt-get install -y python-pip
else
    echo "pip is already installed."
fi

# Install dependencies using pip
echo "Installing dependencies..."
pip install -r requirements.txt

# Run any Django management commands here if needed
# For example:
# python manage.py migrate
# python manage.py collectstatic

# Finally, start your Django server or any other tasks you need to perform
# For example:
# python manage.py runserver
