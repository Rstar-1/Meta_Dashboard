import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import Icon from "../common/Icon";
import Dropdown from "../common/Dropdown";
import Modal from "../common/Modal";
import FormBuilder from "../common/FormBuilder";
import Steps from "../common/Steps";
import Button from "../common/Button";
import { logout } from "../../feature/authSlice";
import { useLogin } from "../../hook/useLogin";
import { useRegister } from "../../hook/useRegister";
import { useVerifyOtp } from "../../hook/useVerifyOtp";
import { forgotPassword, verifyForgotOtp, resetPassword } from "../../api/authApi";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn, user } = useSelector((state) => state.auth) || {};

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const verifyOtpMutation = useVerifyOtp();
  const [registerStep, setRegisterStep] = useState("form");
  const [formStep, setFormStep] = useState(1);
  const [registerFormData, setRegisterFormData] = useState({});
  const [tempRegisterData, setTempRegisterData] = useState(null);

  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordFormData, setForgotPasswordFormData] = useState({});

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword
  });

  const verifyForgotOtpMutation = useMutation({
    mutationFn: verifyForgotOtp
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/dashboard");
  };

  const userMenuItems = [
    { label: "My Profile", icon: "Users", path: "/profile", show: true },
    { label: "Logout", icon: "Logout", action: handleLogout, show: true, className: "text-danger" }
  ];

  // Map current pathname to display title dynamically
  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/analytics":
        return "Web Analytics";
      case "/management/product":
        return "Products";
      case "/management/cms":
        return "Content Management";
      case "/management/orders":
        return "Orders";
      case "/management/leads":
        return "Leads";
      case "/builder/meta":
        return "SEO Metadata";
      case "/builder/json":
        return "JSON Config";
      case "/management/ai":
        return "AI Integrations";
      case "/users":
        return "System Users";
      case "/customers":
        return "Clients";
      default:
        return "Products";
    }
  };

  return (
    <>
      <div className="w-full bg-white bordb">
        <div className="flex items-center justify-between p-12">
          <div className="flex items-center gap-12">
            {/* Back Button */}
            <div
              onClick={() => navigate(-1)}
              className="border-tertiary rounded-5 icon-lg cursor-pointer"
            >
              <Icon name="ChevronLeft" width="20" height="20" stroke="var(--gray)" strokeWidth="2" />
            </div>

            {/* Page Title */}
            <h2 className="mid-text text-secondary font-500">
              {getTitle()}
            </h2>
          </div>

          {/* Right Side: Health Score & Action Buttons */}
          <div className="flex items-center gap-6">
            <div className="border-tertiary rounded-5 bg-forth px-12 py-3 flex items-center gap-8">
              <p className="mini-text text-gray uppercase font-600 tracking-wider">
                Profile Score
              </p>
              {/* Green Dot */}
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--success)", display: "flex", flexShrink: 0 }} />
              <p className="small-text text-success font-700">
                98.6%
              </p>
            </div>

            {/* Help Button */}
            <div className="border-tertiary rounded-5 bg-white p-8 flex items-center justify-center cursor-pointer text-gray hover-text-dark">
              <Icon name="Help" width="14" height="14" strokeWidth="2.5" />
            </div>

            {/* Dark Mode Button */}
            <div className="border-tertiary rounded-5 bg-white p-8 flex items-center justify-center cursor-pointer text-gray hover-text-dark">
              <Icon name="Moon" width="14" height="14" strokeWidth="2.5" />
            </div>

            <div style={{ width: 1, height: 14, backgroundColor: '#e2e8f0', margin: '0 6px' }} />

            {/* User Account / Login Button */}
            <div
              className="relative"
              onMouseEnter={() => setIsUserDropdownOpen(true)}
              onMouseLeave={() => setIsUserDropdownOpen(false)}
            >
              <div className="border-tertiary rounded-5 bg-white p-8 flex items-center justify-center cursor-pointer text-gray hover-text-dark">
                {isLoggedIn ? (
                  <Icon name="Users" width="14" height="14" stroke="#f25c2b" strokeWidth="2.5" />
                ) : (
                  <Icon name="Users" width="14" height="14" strokeWidth="2.5" />
                )}
              </div>

              {isUserDropdownOpen && (
                <Dropdown isOpen={isUserDropdownOpen} align="right" minWidth="200px">
                  <div className="p-12 bordb flex items-center gap-12">
                    {isLoggedIn ? (
                      <>
                        <div className="rounded-full bg-light-primary text-primary flex items-center justify-center font-600" style={{ width: 32, height: 32, backgroundColor: '#eff6ff' }}>
                          {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <h4 className="font-600 text-dark headmini-text capitalize">{user?.fullname || "User"}</h4>
                          <p className="text-gray mini-text">{user?.role || "Customer"}</p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <h4 className="font-600 text-dark headmini-text capitalize">Welcome Guest</h4>
                        <p className="text-gray mini-text">Manage your account</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {isLoggedIn ? (
                      userMenuItems.map((item, idx) => (
                        <p
                          key={idx}
                          className={`drop-item rounded-5 mini-text cursor-pointer p-10 flex items-center gap-8 ${item.className || ""}`}
                          style={{ margin: 0, padding: "8px 10px", fontSize: "12px" }}
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            item.action ? item.action() : navigate(item.path);
                          }}
                        >
                          {item.icon && <Icon name={item.icon} width="14" height="14" stroke="currentColor" />}
                          <span>{item.label}</span>
                        </p>
                      ))
                    ) : (
                      <>
                        <p
                          className="drop-item rounded-5 mini-text cursor-pointer p-10 flex items-center gap-8"
                          style={{ margin: 0, padding: "8px 10px", fontSize: "12px" }}
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setIsLoginModalOpen(true);
                          }}
                        >
                          <Icon name="Users" width="14" height="14" stroke="currentColor" />
                          <span>Login</span>
                        </p>
                        <p
                          className="drop-item rounded-5 mini-text cursor-pointer p-10 flex items-center gap-8"
                          style={{ margin: 0, padding: "8px 10px", fontSize: "12px" }}
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setIsRegisterModalOpen(true);
                          }}
                        >
                          <Icon name="Users" width="14" height="14" stroke="currentColor" />
                          <span>Register</span>
                        </p>
                      </>
                    )}
                  </div>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LOGIN MODAL */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setLoginError("");
        }}
        title="Welcome Back"
        size="sm"
        footer={null}
      >
        <div className="py-10">
          {loginError && (
            <div className="p-12 mb-16 rounded-5 bg-light-danger">
              <p className="mini-text font-500 text-danger">{loginError}</p>
            </div>
          )}

          <FormBuilder
            key={isLoginModalOpen ? "open" : "closed"}
            fields={[
              {
                name: "mobile",
                type: "tel",
                label: "Mobile Number",
                placeholder: "Enter mobile number",
                validation: { required: true, mobile: true }
              },
              {
                name: "password",
                type: "password",
                label: "Password",
                placeholder: "Enter password",
                validation: { required: true }
              }
            ]}
            submitType="json"
            onSubmit={(formData) => {
              setLoginError("");
              loginMutation.mutate(formData, {
                onSuccess: () => {
                  setIsLoginModalOpen(false);
                },
                onError: (err) => {
                  setLoginError(err.response?.data?.message || err.message || "Invalid mobile or password.");
                }
              });
            }}
            buttonClassName="hidden"
          >
            <div className="flex justify-end mt-4">
              <span 
                className="mini-text text-primary cursor-pointer font-500"
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setIsForgotPasswordModalOpen(true);
                }}
              >
                Forgot Password?
              </span>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              bg="primary"
              color="white"
              version="v2"
              className="mt-20 w-full"
            >
              {loginMutation.isPending ? (
                "Logging in..."
              ) : (
                "Login"
              )}
            </Button>

            <div className="text-center mt-20">
              <p className="mini-text text-gray">
                Don't have an account?{" "}
                <span
                  className="text-primary font-600 cursor-pointer ml-4"
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setIsRegisterModalOpen(true);
                  }}
                >
                  Register here
                </span>
              </p>
            </div>
          </FormBuilder>
        </div>
      </Modal>

      {/* FORGOT PASSWORD MODAL */}
      <Modal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => {
          setIsForgotPasswordModalOpen(false);
          setForgotPasswordError("");
          setForgotPasswordStep(1);
          setForgotPasswordFormData({});
        }}
        title={
          forgotPasswordStep === 1
            ? "Forgot Password"
            : forgotPasswordStep === 2
            ? "Verify OTP"
            : "Reset Password"
        }
        size="sm"
        footer={null}
      >
        <div className="py-10">
          {forgotPasswordError && (
            <div className="p-12 mb-16 rounded-5 bg-light-danger">
              <p className="mini-text font-500 text-danger">{forgotPasswordError}</p>
            </div>
          )}

          {forgotPasswordStep === 1 ? (
            <FormBuilder
              key="forgot-password-step-1"
              fields={[
                {
                  name: "mobile",
                  type: "tel",
                  label: "Mobile Number",
                  placeholder: "Enter mobile number",
                  validation: { required: true, mobile: true }
                }
              ]}
              submitType="json"
              onSubmit={(formData) => {
                setForgotPasswordError("");
                forgotPasswordMutation.mutate(
                  { mobile: formData.mobile },
                  {
                    onSuccess: () => {
                      setForgotPasswordFormData({ mobile: formData.mobile });
                      setForgotPasswordStep(2);
                    },
                    onError: (err) => {
                      setForgotPasswordError(
                        err.response?.data?.message || err.message || "Failed to send OTP. Try again."
                      );
                    }
                  }
                );
              }}
              buttonClassName="hidden"
            >
              <div className="text-center mt-16">
                <div className="rounded-full bg-light-primary text-primary mx-auto flex items-center justify-center" style={{ height: '54px', width: '54px' }}>
                  <Icon name="Lock" width="23" height="23" stroke="currentColor" />
                </div>
                <h3 className="font-500 text-dark mid-text pt-8">Reset Password</h3>
                <p className="text-gray mini-text">Enter your mobile number to request an OTP code</p>
              </div>

              <Button
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                bg="primary"
                color="white"
                version="v2"
                className="mt-20 w-full"
              >
                {forgotPasswordMutation.isPending ? "Sending OTP..." : "Send OTP"}
              </Button>

              <div className="text-center mt-20">
                <span
                  className="text-primary font-600 cursor-pointer ml-4 mini-text"
                  onClick={() => {
                    setIsForgotPasswordModalOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                >
                  &larr; Back to Login
                </span>
              </div>
            </FormBuilder>
          ) : forgotPasswordStep === 2 ? (
            <FormBuilder
              key="forgot-password-step-2"
              fields={[
                {
                  name: "otp",
                  type: "text",
                  label: "OTP Code",
                  placeholder: "Enter verification OTP",
                  validation: { required: true }
                }
              ]}
              submitType="json"
              onSubmit={(formData) => {
                setForgotPasswordError("");
                verifyForgotOtpMutation.mutate(
                  {
                    mobile: forgotPasswordFormData.mobile,
                    otp: formData.otp
                  },
                  {
                    onSuccess: () => {
                      setForgotPasswordFormData(prev => ({ ...prev, otp: formData.otp }));
                      setForgotPasswordStep(3);
                    },
                    onError: (err) => {
                      setForgotPasswordError(
                        err.response?.data?.message || err.message || "Invalid OTP code."
                      );
                    }
                  }
                );
              }}
              buttonClassName="hidden"
            >
              <div className="text-center mt-16">
                <div className="rounded-full bg-light-primary text-primary mx-auto flex items-center justify-center" style={{ height: '54px', width: '54px' }}>
                  <Icon name="Mail" width="23" height="23" stroke="currentColor" />
                </div>
                <h3 className="font-500 text-dark mid-text pt-8">Verify OTP</h3>
                <p className="text-gray mini-text">Enter the OTP sent to {forgotPasswordFormData.mobile}</p>
              </div>

              <Button
                type="submit"
                disabled={verifyForgotOtpMutation.isPending}
                bg="primary"
                color="white"
                version="v2"
                className="mt-20 w-full"
              >
                {verifyForgotOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="text-center mt-20">
                <span
                  className="text-gray cursor-pointer mini-text"
                  onClick={() => setForgotPasswordStep(1)}
                >
                  &larr; Change Mobile Number
                </span>
              </div>
            </FormBuilder>
          ) : (
            <FormBuilder
              key="forgot-password-step-3"
              fields={[
                {
                  name: "password",
                  type: "password",
                  label: "New Password",
                  placeholder: "Enter new password",
                  validation: { required: true }
                },
                {
                  name: "confirmPassword",
                  type: "password",
                  label: "Confirm Password",
                  placeholder: "Confirm new password",
                  validation: { required: true }
                }
              ]}
              submitType="json"
              onSubmit={(formData) => {
                setForgotPasswordError("");
                if (formData.password !== formData.confirmPassword) {
                  setForgotPasswordError("Passwords do not match.");
                  return;
                }
                resetPasswordMutation.mutate(
                  {
                    mobile: forgotPasswordFormData.mobile,
                    password: formData.password
                  },
                  {
                    onSuccess: () => {
                      alert("Password reset successfully! Please login with your new password.");
                      setIsForgotPasswordModalOpen(false);
                      setIsLoginModalOpen(true);
                      setForgotPasswordStep(1);
                      setForgotPasswordFormData({});
                    },
                    onError: (err) => {
                      setForgotPasswordError(
                        err.response?.data?.message || err.message || "Failed to reset password."
                      );
                    }
                  }
                );
              }}
              buttonClassName="hidden"
            >
              <div className="text-center mt-16">
                <div className="rounded-full bg-light-primary text-primary mx-auto flex items-center justify-center" style={{ height: '54px', width: '54px' }}>
                  <Icon name="Lock" width="23" height="23" stroke="currentColor" />
                </div>
                <h3 className="font-500 text-dark mid-text pt-8">Create New Password</h3>
                <p className="text-gray mini-text">Ensure your new password is secure</p>
              </div>

              <Button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                bg="primary"
                color="white"
                version="v2"
                className="mt-20 w-full"
              >
                {resetPasswordMutation.isPending ? "Resetting Password..." : "Reset Password"}
              </Button>
            </FormBuilder>
          )}
        </div>
      </Modal>

      {/* REGISTER MODAL */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => {
          setIsRegisterModalOpen(false);
          setRegisterError("");
          setRegisterStep("form");
          setFormStep(1);
          setRegisterFormData({});
          setTempRegisterData(null);
        }}
        title={registerStep === "otp" ? "Verify OTP" : "Create an Account"}
        size="sm"
        footer={null}
      >
        <div className="py-10">
          {registerStep !== "otp" && (
            <Steps
              currentStep={formStep}
              steps={["Personal", "Contact", "Security", "Complete"]}
            />
          )}

          {registerError && (
            <div className="p-12 mb-16 rounded-5 bg-light-danger">
              <p className="mini-text font-500 text-danger">{registerError}</p>
            </div>
          )}

          {registerStep === "form" ? (
            formStep === 1 ? (
              <FormBuilder
                key="register-step-1"
                fields={[
                  {
                    name: "fullname",
                    type: "text",
                    label: "Full Name",
                    placeholder: "Enter your full name",
                    defaultValue: registerFormData.fullname || "",
                    validation: { required: true }
                  }
                ]}
                submitType="json"
                onSubmit={(formData) => {
                  setRegisterError("");
                  setRegisterFormData(formData);
                  setFormStep(2);
                }}
                buttonClassName="hidden"
              >
                <div className="text-center mt-16">
                  <div className="rounded-full bg-light-primary text-primary mx-auto flex items-center justify-center" style={{ height: '54px', width: '54px' }}>
                    <Icon name="Users" width="23" height="23" stroke="currentColor" />
                  </div>
                  <h3 className="font-500 text-dark mid-text pt-8">Let's start with your name</h3>
                  <p className="text-gray mini-text">Enter your full name to continue</p>
                </div>
                <div className="flex justify-end mt-20">
                  <Button
                    type="submit"
                    bg="primary"
                    color="white"
                    version="v2"
                  >
                    Next &rarr;
                  </Button>
                </div>
              </FormBuilder>
            ) : formStep === 2 ? (
              <FormBuilder
                key="register-step-2"
                fields={[
                  {
                    name: "email",
                    type: "email",
                    label: "Email Address",
                    placeholder: "Enter your email address",
                    defaultValue: registerFormData.email || "",
                    validation: { required: true, email: true }
                  },
                  {
                    name: "mobile",
                    type: "tel",
                    label: "Mobile Number",
                    placeholder: "Enter mobile number",
                    defaultValue: registerFormData.mobile || "",
                    validation: { required: true, mobile: true }
                  }
                ]}
                submitType="json"
                onSubmit={(formData) => {
                  setRegisterError("");
                  setRegisterFormData(prev => ({
                    ...prev,
                    email: formData.email,
                    mobile: formData.mobile
                  }));
                  setFormStep(3);
                }}
                buttonClassName="hidden"
              >
                <div className="flex items-center justify-between mt-20">
                  <Button
                    type="button"
                    onClick={() => setFormStep(1)}
                    bg="forth"
                    color="dark"
                    version="v2"
                  >
                    &larr; Back
                  </Button>
                  <Button
                    type="submit"
                    bg="primary"
                    color="white"
                    version="v2"
                  >
                    Next &rarr;
                  </Button>
                </div>
              </FormBuilder>
            ) : formStep === 3 ? (
              <FormBuilder
                key="register-step-3"
                fields={[
                  {
                    name: "password",
                    type: "password",
                    label: "Password",
                    placeholder: "Create password",
                    validation: { required: true }
                  },
                  {
                    name: "confirmPassword",
                    type: "password",
                    label: "Confirm Password",
                    placeholder: "Confirm password",
                    validation: { required: true }
                  }
                ]}
                submitType="json"
                onSubmit={(formData) => {
                  setRegisterError("");
                  if (formData.password !== formData.confirmPassword) {
                    setRegisterError("Passwords do not match.");
                    return;
                  }
                  setRegisterFormData(prev => ({
                    ...prev,
                    password: formData.password
                  }));
                  setFormStep(4);
                }}
                buttonClassName="hidden"
              >
                {/* Requirements list */}
                <div className="mt-12 mb-20 text-gray mini-text flex flex-column gap-6" style={{ paddingLeft: "4px" }}>
                  <div className="flex items-center gap-6">
                    <Icon name="Check" width="14" height="14" stroke="#10b981" strokeWidth="2.5" />
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <Icon name="Check" width="14" height="14" stroke="#10b981" strokeWidth="2.5" />
                    <span>Include a number or symbol</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <Icon name="Check" width="14" height="14" stroke="#10b981" strokeWidth="2.5" />
                    <span>Mix of uppercase and lowercase</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-20">
                  <Button
                    type="button"
                    onClick={() => setFormStep(2)}
                    bg="forth"
                    color="dark"
                    version="v2"
                  >
                    &larr; Back
                  </Button>
                  <Button
                    type="submit"
                    bg="primary"
                    color="white"
                    version="v2"
                  >
                    Next &rarr;
                  </Button>
                </div>
              </FormBuilder>
            ) : (
              <FormBuilder
                key="register-step-4"
                fields={[]}
                submitType="json"
                onSubmit={() => {
                  setRegisterError("");
                  registerMutation.mutate(registerFormData, {
                    onSuccess: () => {
                      setTempRegisterData(registerFormData);
                      setRegisterStep("otp");
                    },
                    onError: (err) => {
                      setRegisterError(err.response?.data?.message || err.message || "Registration failed. Try again.");
                    }
                  });
                }}
                buttonClassName="hidden"
              >
                <div className="flex flex-column items-center mb-24 text-center">
                  <div className="rounded-full flex items-center justify-center" style={{ width: "56px", height: "56px", backgroundColor: "#ffedd5", color: "#ea580c" }}>
                    <Icon name="Check" width="24" height="24" stroke="currentColor" />
                  </div>
                  <h3 className="font-600 text-dark mid-text pt-4">Review & Confirm</h3>
                  <p className="text-gray mini-text">Please review your details before creating your account</p>
                </div>

                <div className="grid-cols-1 gap-5">
                  <div className="flex items-center justify-between pb-8 border-b" style={{ borderColor: "#ececec" }}>
                    <p className="text-gray mini-text">Full Name</p>
                    <p className="text-dark font-600 headmini-text capitalize">{registerFormData.fullname}</p>
                  </div>
                  <div className="flex items-center justify-between pb-8 border-b" style={{ borderColor: "#ececec" }}>
                    <p className="text-gray mini-text">Email Address</p>
                    <p className="text-dark font-600 headmini-text">{registerFormData.email}</p>
                  </div>
                  <div className="flex items-center justify-between pb-8 border-b" style={{ borderColor: "#ececec" }}>
                    <p className="text-gray mini-text">Mobile Number</p>
                    <p className="text-dark font-600 headmini-text">{registerFormData.mobile}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-10">
                  <Button
                    type="button"
                    onClick={() => setFormStep(3)}
                    bg="forth"
                    color="dark"
                    version="v2"
                  >
                    &larr; Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    bg="primary"
                    color="white"
                    version="v2"
                  >
                    {registerMutation.isPending ? "Registering..." : "Register"}
                  </Button>
                </div>
              </FormBuilder>
            )
          ) : (
            <FormBuilder
              key="otp-verification-form"
              fields={[
                {
                  name: "otp",
                  type: "text",
                  label: "OTP Code",
                  placeholder: "Enter the OTP sent to your phone",
                  validation: { required: true }
                }
              ]}
              submitType="json"
              onSubmit={(otpData) => {
                setRegisterError("");
                verifyOtpMutation.mutate(
                  {
                    mobile: tempRegisterData?.mobile,
                    otp: otpData.otp
                  },
                  {
                    onSuccess: () => {
                      // Automatically login the user once OTP is verified
                      loginMutation.mutate(
                        {
                          mobile: tempRegisterData?.mobile,
                          password: tempRegisterData?.password
                        },
                        {
                          onSuccess: () => {
                            setIsRegisterModalOpen(false);
                            setRegisterStep("form");
                            setFormStep(1);
                            setRegisterFormData({});
                            setTempRegisterData(null);
                          },
                          onError: (err) => {
                            setRegisterError(err.response?.data?.message || err.message || "OTP verified, but automatic login failed. Please login manually.");
                          }
                        }
                      );
                    },
                    onError: (err) => {
                      setRegisterError(err.response?.data?.message || err.message || "Invalid OTP code.");
                    }
                  }
                );
              }}
              buttonClassName="hidden"
            >
              <Button
                type="submit"
                disabled={verifyOtpMutation.isPending || loginMutation.isPending}
                bg="primary"
                color="white"
                version="v3"
                className="mt-12 w-full flex items-center justify-center gap-6"
              >
                {verifyOtpMutation.isPending ? (
                  <span className="flex items-center gap-4 justify-center">
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      style={{ animation: "spin 1s linear infinite" }}
                    >
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" />
                    </svg>
                    Verifying...
                  </span>
                ) : loginMutation.isPending ? (
                  "Logging in..."
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </FormBuilder>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Header;