#!/usr/bin/env python3
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auth.settings')
django.setup()

from django.test import TestCase
from investments.models import RiskProfile, Investment, InvestmentRecommendation

print("Django setup successful!")
print("Testing model imports...")

try:
    # Test if models can be imported
    print(f"RiskProfile model: {RiskProfile}")
    print(f"Investment model: {Investment}")
    print(f"InvestmentRecommendation model: {InvestmentRecommendation}")
    print("All models imported successfully!")
except Exception as e:
    print(f"Error importing models: {e}")

print("Backend is ready to run!")