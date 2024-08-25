/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, FormEvent } from "react";
import "../../../public/css/authen.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import authenticateService from "../services/authenticateService";
import { toast } from "react-toastify";

const SignUpClient = () => {
  const [isPassword, setIsPassword] = useState(true);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [roleId, setRoleId] = useState(2);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error state variables
  const [emailError, setEmailError] = useState("");
  const [supplierNameError, setSupplierNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const togglePasswordVisibility = () => {
    setIsPassword((prevState) => !prevState);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]{1,28}@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;
    return passwordRegex.test(password);
  };

  const validateSupplierName = (supplierName: string) => {
    return supplierName.length >= 2 && supplierName.length <= 20;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Reset error messages
    setEmailError("");
    setSupplierNameError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Email must be 10-30 characters, start with a letter, and follow a valid format!");
      isValid = false;
    }

    if (!validateSupplierName(supplierName)) {
      setSupplierNameError("Supplier name must be between 2 and 20 characters!");
      isValid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be 6-20 characters long, include uppercase, lowercase letters, and a number!");
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match!");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      await authenticateService.signUpSupplier({
        email,
        supplierName,
        password,
        roleId,
      });
      toast.success("Sign up successfully!");
      setTimeout(() => {
        router.push("/login_supplier");
      }, 2000);
    } catch (error) {
      toast.error("Sign up unsuccessful!");
    }
  };

  return (
    <div>
      <div className="image-bk">
        <div className="login">
          <div className="text-login">
            <h3 className="text-center font-bold color-black text-xl">Sign up to be a Supplier</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="text-input relative">
              <p className="color-black m-0 pt-2 pb-1">Enter your email</p>
              <input
                className="input-text"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && <p className="error-text py-2 ml-2" style={{ color: "red" }}>{emailError}</p>}

              <p className="color-black m-0 pt-2 pb-1">Enter your supplier name</p>
              <input
                className="input-text"
                type="text"
                placeholder="Supplier Name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
              />
              {supplierNameError && <p className="error-text py-2 ml-2" style={{ color: "red" }}>{supplierNameError}</p>}

             <div className="relative">
             <p className="m-0 pt-2 pb-1">Enter your password</p>
              <input
                className="input-text"
                type={isPassword ? "password" : "text"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && <p className="error-text py-2 ml-2" style={{ color: "red" }}>{passwordError}</p>}
              <img
                src="/image/hide.png"
                className="inout-hide cursor-pointer"
                onClick={togglePasswordVisibility}
                alt=""
              />

             </div>
             <div className="relative">
             <p className="m-0 pt-2 pb-1">Enter your confirm password</p>
              <input
                className="input-text"
                type={isPassword ? "password" : "text"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {confirmPasswordError && <p className="error-text py-2 ml-2" style={{ color: "red" }}>{confirmPasswordError}</p>}
              <img
                src="/image/hide.png"
                className="input-hide cursor-pointer"
                onClick={togglePasswordVisibility}
                alt=""
              />
             </div>
              <div className="flex justify-center">
                <button
                  className="w-4/5 text-xl text-white button-text mt-4"
                  style={{ backgroundColor: "#305A61", borderRadius: "20px" }}
                >
                  Continue
                </button>
              </div>
              <div className="nav-sign flex justify-between">
                <Link
                  className="pt-2 text-right text-base cursor-pointer text-decoration"
                  href="login_supplier"
                >
                  You have an account?
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpClient;
