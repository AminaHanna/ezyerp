import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: "admin",
    password: "1234",
    officecode: "WF01",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to home page after successful login
  useEffect(() => {
    if (isAuthenticated && !isLoading && isSubmitting) {
      setIsSubmitting(false);
      navigate("/");
    }
  }, [isAuthenticated, isLoading, isSubmitting, navigate]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    if (!formData.officecode.trim()) {
      errors.officecode = "Office code is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login(formData.username, formData.password, formData.officecode);
      // Navigation will be handled by useEffect when isAuthenticated becomes true
    } catch (err) {
      setIsSubmitting(false);
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
      setLocalError(errorMessage);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">EzyERP</h1>
          <p className="text-muted-foreground mt-2">Enterprise Resource Planning</p>
        </div>

        {/* Login Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {displayError && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{displayError}</AlertDescription>
                </Alert>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-foreground">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`h-11 ${validationErrors.username ? "border-red-500" : ""}`}
                  autoComplete="username"
                />
                {validationErrors.username && (
                  <p className="text-xs text-red-500">{validationErrors.username}</p>
                )}
              </div>

              {/* Office Code Field */}
              <div className="space-y-2">
                <label htmlFor="officecode" className="text-sm font-medium text-foreground">
                  Office Code
                </label>
                <Input
                  id="officecode"
                  name="officecode"
                  type="text"
                  placeholder="e.g., WF01"
                  value={formData.officecode}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`h-11 ${validationErrors.officecode ? "border-red-500" : ""}`}
                  autoComplete="off"
                />
                {validationErrors.officecode && (
                  <p className="text-xs text-red-500">{validationErrors.officecode}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`h-11 pr-10 ${validationErrors.password ? "border-red-500" : ""}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-xs text-red-500">{validationErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 text-base font-semibold mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Demo Credentials */}
              {/* <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-2">Demo Credentials:</p>
                <p className="text-xs text-blue-800">
                  <span className="font-medium">Username:</span> admin
                </p>
                <p className="text-xs text-blue-800">
                  <span className="font-medium">Password:</span> 1234
                </p>
                <p className="text-xs text-blue-800">
                  <span className="font-medium">Office Code:</span> WF01
                </p>
              </div> */}
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2025 EzyERP. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;

