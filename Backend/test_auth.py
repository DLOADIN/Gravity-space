#!/usr/bin/env python3
"""
Test script to verify authentication endpoints
"""

import requests
import json

BASE_URL = 'https://ruwaga1231.pythonanywhere.com'

def test_health():
    """Test the health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f'{BASE_URL}/health')
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_login():
    """Test login endpoint"""
    print("Testing login endpoint...")
    login_data = {
        'email': 'grantcordone@gmail.com',
        'password': 'your_password_here'  # Replace with actual password
    }
    
    response = requests.post(f'{BASE_URL}/login', json=login_data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Login successful: {data}")
        return data.get('token')
    else:
        print(f"Login failed: {response.json()}")
        return None

def test_protected_endpoint(token):
    """Test a protected endpoint with JWT token"""
    if not token:
        print("No token available, skipping protected endpoint test")
        return
    
    print("Testing protected endpoint with JWT token...")
    headers = {'Authorization': f'Bearer {token}'}
    
    response = requests.get(f'{BASE_URL}/dashboard/stats', headers=headers)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("Protected endpoint access successful!")
        data = response.json()
        print(f"Dashboard stats: {json.dumps(data, indent=2)}")
    else:
        print(f"Protected endpoint access failed: {response.json()}")

def test_debug_endpoints():
    """Test debug endpoints"""
    print("Testing debug endpoints...")
    
    # Test session debug
    response = requests.get(f'{BASE_URL}/debug/session')
    print(f"Session debug status: {response.status_code}")
    print(f"Session debug response: {response.json()}")
    print()
    
    # Test auth debug
    response = requests.get(f'{BASE_URL}/debug/auth')
    print(f"Auth debug status: {response.status_code}")
    print(f"Auth debug response: {response.json()}")

if __name__ == '__main__':
    print("=== Authentication Test Script ===\n")
    
    # Test health endpoint
    test_health()
    
    # Test debug endpoints
    test_debug_endpoints()
    
    # Test login (you'll need to provide the correct password)
    print("Note: Update the password in the script to test login")
    # token = test_login()
    # if token:
    #     test_protected_endpoint(token)
    
    print("=== Test Complete ===") 