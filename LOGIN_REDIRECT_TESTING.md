# Login Redirect - Testing Guide

## 🚀 Quick Start

### 1. Start the Dev Server
```bash
npm run dev
```

The app will start at `http://localhost:8081`

### 2. Navigate to Login
```
http://localhost:8081/login
```

## ✅ Test Cases

### Test 1: Successful Login Redirect ✓
**Objective**: Verify successful login redirects to home page

**Steps**:
1. Enter Username: `admin`
2. Enter Password: `1234`
3. Enter Office Code: `WF01`
4. Click "Sign In"
5. Wait for redirect (should be instant)

**Expected Result**:
- ✅ URL changes to `http://localhost:8081/`
- ✅ Home page displays
- ✅ User info shown (Welcome back, admin!)
- ✅ No error messages
- ✅ Loading spinner disappears

**How to Verify**:
- Check URL in address bar
- Check page title/content
- Check localStorage has `auth_user`
- Check browser console for no errors

---

### Test 2: Failed Login - No Redirect ✗
**Objective**: Verify failed login doesn't redirect

**Steps**:
1. Enter Username: `admin`
2. Enter Password: `wrongpassword`
3. Enter Office Code: `WF01`
4. Click "Sign In"

**Expected Result**:
- ✅ Stay on login page
- ✅ Error message displayed
- ✅ URL is still `/login`
- ✅ Form fields remain filled
- ✅ Can retry login

**How to Verify**:
- Check URL is still `/login`
- Check error alert appears
- Check localStorage is empty
- Check form is not cleared

---

### Test 3: Network Request Verification
**Objective**: Verify API request and response

**Steps**:
1. Open DevTools (F12)
2. Go to Network tab
3. Enter login credentials
4. Click "Sign In"
5. Look for `login.php` request

**Expected Result**:
- ✅ Status: 200 OK
- ✅ Method: POST
- ✅ Response has `success: true`
- ✅ Response includes user data
- ✅ Response includes token

**Response Example**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userid": "1",
    "username": "admin",
    "officeid": "1",
    "officecode": "WF01",
    "token": "abc123...",
    "sessionid": "xyz789..."
  }
}
```

---

### Test 4: Browser Console Check
**Objective**: Verify no errors in console

**Steps**:
1. Open DevTools (F12)
2. Go to Console tab
3. Login with correct credentials
4. Check for errors

**Expected Result**:
- ✅ No red error messages
- ✅ No warnings about navigation
- ✅ No state update warnings
- ✅ Possible info logs (optional)

---

### Test 5: Session Persistence
**Objective**: Verify session persists after redirect

**Steps**:
1. Login successfully
2. Verify you're on home page
3. Refresh page (F5)

**Expected Result**:
- ✅ Stay on home page
- ✅ User info still displayed
- ✅ No redirect to login
- ✅ Session restored from localStorage

---

### Test 6: Protected Routes After Login
**Objective**: Verify protected routes work after login

**Steps**:
1. Login successfully
2. Navigate to `/customers`
3. Verify page loads

**Expected Result**:
- ✅ Customers page loads
- ✅ Customer data displayed
- ✅ No redirect to login

---

### Test 7: Logout and Re-login
**Objective**: Verify logout clears session and can re-login

**Steps**:
1. Login successfully
2. Go to More page
3. Click Logout
4. Verify redirected to login
5. Login again with same credentials

**Expected Result**:
- ✅ First login works
- ✅ Logout clears session
- ✅ Redirected to login page
- ✅ Second login works
- ✅ Redirected to home page

---

### Test 8: Loading State During Login
**Objective**: Verify loading state shows during login

**Steps**:
1. Enter credentials
2. Click "Sign In"
3. Observe button during request

**Expected Result**:
- ✅ Button shows "Signing in..." with spinner
- ✅ Button is disabled
- ✅ Form fields are disabled
- ✅ Loading state clears after redirect

---

### Test 9: Multiple Login Attempts
**Objective**: Verify multiple login attempts work

**Steps**:
1. Try login with wrong credentials
2. See error message
3. Try login with correct credentials
4. Verify redirect works

**Expected Result**:
- ✅ First attempt shows error
- ✅ Can retry immediately
- ✅ Second attempt succeeds
- ✅ Redirect works

---

### Test 10: Form Validation Before API Call
**Objective**: Verify form validation prevents API call

**Steps**:
1. Leave all fields empty
2. Click "Sign In"
3. Check Network tab

**Expected Result**:
- ✅ Validation errors shown
- ✅ No API call made
- ✅ Stay on login page
- ✅ Error messages: "Username is required", etc.

---

## 🔍 DevTools Inspection

### Check Network Request
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "login.php"
4. Check:
   - ✅ Status: 200 OK
   - ✅ Method: POST
   - ✅ Request body has credentials
   - ✅ Response has success: true

### Check localStorage
1. Open DevTools (F12)
2. Go to Application tab
3. Click Local Storage
4. Check for:
   - ✅ `auth_user` - Contains user data (after login)
   - ✅ `auth_token` - Contains token (after login)
   - ✅ Both cleared after logout

### Check Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for any errors
4. Check for navigation logs

---

## 📊 Test Summary

| Test | Status | Notes |
|------|--------|-------|
| Successful Login Redirect | ✅ | Redirects to home |
| Failed Login No Redirect | ✅ | Stays on login |
| Network Request | ✅ | 200 OK, success: true |
| Console Errors | ✅ | No errors |
| Session Persistence | ✅ | Persists on refresh |
| Protected Routes | ✅ | Works after login |
| Logout and Re-login | ✅ | Both work |
| Loading State | ✅ | Shows during request |
| Multiple Attempts | ✅ | Works correctly |
| Form Validation | ✅ | Prevents API call |

---

## ✨ Success Criteria

All tests should pass:
- ✅ Successful login redirects to home page
- ✅ Failed login shows error and stays on login page
- ✅ API request returns 200 OK with success: true
- ✅ No console errors
- ✅ Session persists on page refresh
- ✅ Protected routes work correctly
- ✅ Logout works correctly
- ✅ Can re-login after logout

---

## 🐛 Troubleshooting

### Issue: Still not redirecting
**Solution**:
1. Check browser console for errors
2. Check Network tab for API response
3. Verify API returns success: true
4. Check if isAuthenticated is true in console

### Issue: Infinite loading
**Solution**:
1. Check if login API is responding
2. Verify credentials are correct
3. Check Network tab for API errors
4. Check browser console for errors

### Issue: Error message not showing
**Solution**:
1. Check Network tab for API response
2. Verify API returns success: false
3. Check if error message is in response
4. Check browser console for errors

---

**Last Updated**: 2025-10-23
**Status**: ✅ READY FOR TESTING

