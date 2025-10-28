# Quick Diagnostic Steps - Login Error

## 🚀 Quick Test

```bash
npm run dev
# Go to http://localhost:8081/login
# Enter: admin / 1234 / WF01
# Click "Sign In"
```

## 🔍 Diagnostic Steps (2 minutes)

### Step 1: Open DevTools
- Press **F12**
- Go to **Console** tab

### Step 2: Try Login
- Enter Username: `admin`
- Enter Password: `1234`
- Enter Office Code: `WF01`
- Click "Sign In"

### Step 3: Check Console Logs
Look for these logs:
```
AuthContext: Starting login attempt...
API Response [login.php]: { success: ?, message: "...", data: ? }
```

### Step 4: Check Network Tab
- Go to **Network** tab
- Look for `login.php` request
- Click on it
- Go to **Response** tab
- Copy the JSON

## 📊 What to Look For

### If You See This (Success)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userid": "1",
    "username": "admin",
    "token": "abc123..."
  }
}
```
✅ **Expected**: Should redirect to home page

### If You See This (Failure)
```json
{
  "success": false,
  "message": "Invalid credentials",
  "data": null
}
```
❌ **Expected**: Should show error message

## 🎯 Common Issues

| Issue | Check | Solution |
|-------|-------|----------|
| Wrong credentials | Console message | Verify: admin / 1234 / WF01 |
| API not responding | Network tab | Check internet, API server |
| Unexpected error | Console logs | Check API response structure |
| Still on login page | Check isAuthenticated | Verify API returned success: true |

## 📋 Checklist

- [ ] DevTools open (F12)
- [ ] Console tab visible
- [ ] Credentials entered correctly
- [ ] Network tab shows login.php
- [ ] Response shows success: true or false
- [ ] Error message matches API message

## 🔗 Related Files

- `LOGIN_ERROR_DIAGNOSTIC_GUIDE.md` - Detailed guide
- `src/services/api.ts` - API client with logging
- `src/contexts/AuthContext.tsx` - Auth logic with logging
- `src/pages/Login.tsx` - Login form

## ✅ Expected Behavior

### Successful Login
1. Enter credentials
2. Click "Sign In"
3. See loading spinner
4. Redirect to home page ✅

### Failed Login
1. Enter wrong credentials
2. Click "Sign In"
3. See error message ❌
4. Stay on login page

## 📞 Need Help?

1. Check console logs
2. Check network response
3. Verify credentials
4. Check API server status

---

**Last Updated**: 2025-10-23

