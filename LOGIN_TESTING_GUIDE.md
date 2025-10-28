# Login Testing Guide - Quick Reference

## 🚀 Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

The app will start at `http://localhost:8081`

### 2. Navigate to Login
```
http://localhost:8081/login
```

## ✅ Test Cases

### Test 1: Successful Login ✓
**Objective**: Verify successful login redirects to home page

**Steps**:
1. Enter Username: `admin`
2. Enter Password: `1234`
3. Enter Office Code: `WF01`
4. Click "Sign In"

**Expected Result**:
- ✅ Redirect to home page
- ✅ User info displayed (Welcome back, admin!)
- ✅ Office code shown (WF01)
- ✅ No error messages

**How to Verify**:
- Check URL changed to `http://localhost:8081/`
- Check home page displays user info
- Check localStorage has `auth_user` and `auth_token`

---

### Test 2: Failed Login - Wrong Password ✗
**Objective**: Verify error message for wrong password

**Steps**:
1. Enter Username: `admin`
2. Enter Password: `wrongpassword`
3. Enter Office Code: `WF01`
4. Click "Sign In"

**Expected Result**:
- ✅ Stay on login page
- ✅ Error message displayed
- ✅ Error message from API shown
- ✅ Form fields remain filled

**How to Verify**:
- Check error alert appears
- Check error message is meaningful
- Check URL is still `/login`
- Check localStorage is empty

---

### Test 3: Failed Login - Wrong Username ✗
**Objective**: Verify error message for wrong username

**Steps**:
1. Enter Username: `invaliduser`
2. Enter Password: `1234`
3. Enter Office Code: `WF01`
4. Click "Sign In"

**Expected Result**:
- ✅ Stay on login page
- ✅ Error message displayed
- ✅ Error message from API shown
- ✅ Form fields remain filled

**How to Verify**:
- Check error alert appears
- Check error message is meaningful
- Check URL is still `/login`
- Check localStorage is empty

---

### Test 4: Failed Login - Wrong Office Code ✗
**Objective**: Verify error message for wrong office code

**Steps**:
1. Enter Username: `admin`
2. Enter Password: `1234`
3. Enter Office Code: `INVALID`
4. Click "Sign In"

**Expected Result**:
- ✅ Stay on login page
- ✅ Error message displayed
- ✅ Error message from API shown
- ✅ Form fields remain filled

**How to Verify**:
- Check error alert appears
- Check error message is meaningful
- Check URL is still `/login`
- Check localStorage is empty

---

### Test 5: Form Validation - Empty Fields
**Objective**: Verify form validation for empty fields

**Steps**:
1. Leave all fields empty
2. Click "Sign In"

**Expected Result**:
- ✅ Stay on login page
- ✅ Validation errors shown below each field
- ✅ No API call made
- ✅ Error messages: "Username is required", "Password is required", "Office code is required"

**How to Verify**:
- Check red error text appears below fields
- Check Network tab shows no POST request
- Check form is not submitted

---

### Test 6: Form Validation - Partial Fields
**Objective**: Verify form validation for partially filled fields

**Steps**:
1. Enter Username: `admin`
2. Leave Password empty
3. Enter Office Code: `WF01`
4. Click "Sign In"

**Expected Result**:
- ✅ Stay on login page
- ✅ Validation error shown for Password field
- ✅ No API call made

**How to Verify**:
- Check red error text appears below Password field
- Check Network tab shows no POST request

---

### Test 7: Protected Routes - Unauthenticated Access
**Objective**: Verify unauthenticated users are redirected to login

**Steps**:
1. Clear localStorage (DevTools → Application → Local Storage → Clear All)
2. Navigate to `http://localhost:8081/customers`

**Expected Result**:
- ✅ Redirect to login page
- ✅ URL changes to `/login`
- ✅ Login form displayed

**How to Verify**:
- Check URL is `/login`
- Check login form is visible
- Check no customer data is shown

---

### Test 8: Protected Routes - Authenticated Access
**Objective**: Verify authenticated users can access protected routes

**Steps**:
1. Login with demo credentials
2. Navigate to `http://localhost:8081/customers`

**Expected Result**:
- ✅ Customers page loads
- ✅ Customer data displayed
- ✅ No redirect to login

**How to Verify**:
- Check URL is `/customers`
- Check customer list is visible
- Check no login form is shown

---

### Test 9: Logout Functionality
**Objective**: Verify logout clears session and redirects to login

**Steps**:
1. Login with demo credentials
2. Navigate to More page
3. Click "Logout" button

**Expected Result**:
- ✅ Redirect to login page
- ✅ Session cleared
- ✅ localStorage cleared
- ✅ Can login again

**How to Verify**:
- Check URL is `/login`
- Check localStorage is empty
- Check login form is visible
- Try logging in again

---

### Test 10: Session Persistence
**Objective**: Verify session persists on page refresh

**Steps**:
1. Login with demo credentials
2. Verify you're on home page
3. Refresh page (F5)

**Expected Result**:
- ✅ Stay on home page
- ✅ User info still displayed
- ✅ No redirect to login
- ✅ Session restored from localStorage

**How to Verify**:
- Check URL is still `/`
- Check user info is displayed
- Check localStorage still has `auth_user`

---

### Test 11: Show/Hide Password
**Objective**: Verify password visibility toggle works

**Steps**:
1. Navigate to login page
2. Enter password: `1234`
3. Click eye icon to show password
4. Click eye icon again to hide password

**Expected Result**:
- ✅ Password visible when eye icon clicked
- ✅ Password hidden when eye icon clicked again
- ✅ Password value remains the same

**How to Verify**:
- Check input type changes from "password" to "text"
- Check password value is visible/hidden correctly

---

### Test 12: Loading State
**Objective**: Verify loading state during login

**Steps**:
1. Enter demo credentials
2. Click "Sign In"
3. Observe button during request

**Expected Result**:
- ✅ Button shows "Signing in..." with spinner
- ✅ Button is disabled
- ✅ Form fields are disabled
- ✅ Loading state clears after response

**How to Verify**:
- Check button text changes to "Signing in..."
- Check spinner animation appears
- Check button is disabled (can't click)
- Check state clears after login

---

## 🔍 Browser DevTools Inspection

### Check Network Request
1. Open DevTools (F12)
2. Go to Network tab
3. Login with demo credentials
4. Look for `login.php` request
5. Check:
   - ✅ Status: 200 OK
   - ✅ Method: POST
   - ✅ Request body has username, password, officecode
   - ✅ Response has success: true/false

### Check Response Payload
1. Click on `login.php` request
2. Go to Response tab
3. Check response structure:
   ```json
   {
     "success": true/false,
     "message": "...",
     "data": { ... }
   }
   ```

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
4. Check API error logs

---

## 📊 Test Summary

| Test | Status | Notes |
|------|--------|-------|
| Successful Login | ✅ | Redirects to home |
| Wrong Password | ✅ | Shows error message |
| Wrong Username | ✅ | Shows error message |
| Wrong Office Code | ✅ | Shows error message |
| Form Validation | ✅ | Validates empty fields |
| Protected Routes | ✅ | Redirects unauthenticated |
| Logout | ✅ | Clears session |
| Session Persistence | ✅ | Restores on refresh |
| Show/Hide Password | ✅ | Toggle works |
| Loading State | ✅ | Shows during request |

---

## 🐛 Debugging Tips

### If login fails with error message:
1. Check the error message - it's from the API
2. Verify credentials are correct
3. Check Network tab for API response
4. Check browser console for errors

### If login succeeds but no redirect:
1. Check browser console for errors
2. Check localStorage for auth_user
3. Check Network tab for any failed requests
4. Try refreshing the page

### If protected routes not working:
1. Check localStorage is cleared
2. Try accessing `/customers` without login
3. Should redirect to `/login`
4. Check browser console for errors

### If token not being used:
1. Check localStorage for auth_token
2. Check Network tab - look for Authorization header
3. Check API client is setting token
4. Try logging out and in again

---

## ✨ Success Criteria

All tests should pass:
- ✅ Successful login works
- ✅ Failed login shows error
- ✅ Form validation works
- ✅ Protected routes work
- ✅ Logout works
- ✅ Session persists
- ✅ No console errors
- ✅ Build successful

---

**Last Updated**: 2025-10-23
**Status**: ✅ READY FOR TESTING

