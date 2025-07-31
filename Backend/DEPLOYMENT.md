# Deployment Guide - Authentication Fix

## Issues Fixed

The main issue was that session-based authentication doesn't work well across different domains (your frontend on Vercel and backend on PythonAnywhere). This has been resolved by implementing a hybrid authentication system that supports both:

1. **Session-based authentication** (for same-domain requests)
2. **JWT-based authentication** (for cross-domain requests)

## Changes Made

### Backend (Flask)

1. **Updated CORS configuration** to allow your frontend domain
2. **Added JWT support** with PyJWT library
3. **Created hybrid authentication decorator** (`@require_auth`)
4. **Updated login endpoint** to return JWT tokens
5. **Added debug endpoints** for troubleshooting

### Frontend (React)

1. **Updated AuthContext** to handle JWT tokens
2. **Modified api-client** to automatically include JWT tokens in requests
3. **Added token storage** in localStorage

## Deployment Steps

### 1. Update PythonAnywhere Backend

1. **Install PyJWT**:
   ```bash
   pip install PyJWT
   ```

2. **Set environment variables** in PythonAnywhere:
   - Go to your PythonAnywhere dashboard
   - Navigate to "Web" → Your app → "Environment variables"
   - Add:
     - `SECRET_KEY`: A strong secret key
     - `JWT_SECRET`: A different strong secret key for JWT

3. **Update your CORS origins** in `server.py`:
   Replace `'https://art-space-frontend.vercel.app'` with your actual frontend domain.

4. **Reload your web app** in PythonAnywhere.

### 2. Update Frontend

1. **Deploy the updated frontend** to Vercel
2. **Update the API base URL** in `src/config/api.ts` if needed

### 3. Test the Setup

1. **Test the health endpoint**:
   ```
   GET https://ruwaga1231.pythonanywhere.com/health
   ```

2. **Test login** and verify you get a JWT token in the response

3. **Test protected endpoints** with the JWT token

## Debugging

### Debug Endpoints

Use these endpoints to troubleshoot:

- `GET /debug/session` - Check session state
- `GET /debug/auth` - Check authentication status
- `GET /health` - Basic health check

### Common Issues

1. **CORS errors**: Make sure your frontend domain is in the CORS origins list
2. **JWT errors**: Check that JWT_SECRET is set correctly
3. **Session errors**: The system will fall back to JWT if sessions don't work

### Test Script

Run the test script to verify everything works:

```bash
cd Backend
python test_auth.py
```

## Security Notes

1. **Change the default secret keys** in production
2. **Use HTTPS** for all requests
3. **Set appropriate token expiration** (currently 7 days)
4. **Consider implementing token refresh** for better UX

## How It Works

1. **Login**: User logs in and receives both a session cookie and JWT token
2. **Requests**: Frontend automatically includes JWT token in Authorization header
3. **Backend**: Checks session first, then JWT token if session is not available
4. **Fallback**: If neither works, returns 401 Unauthorized

This hybrid approach ensures compatibility with both same-domain and cross-domain deployments. 