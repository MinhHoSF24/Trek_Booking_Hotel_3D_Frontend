/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import authenticateService from "../services/authenticateService"; // Adjust the path as needed
import "../../../public/css/authen.css"; // Adjust the path as needed

export default function LoginSupplierStaff() {
  const router = useRouter();

  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [isPassword, setIsPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  const togglePasswordVisibility = () => {
    setIsPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await authenticateService.loginSupplierStaff(
        staffEmail,
        staffPassword
      );

      if (result.success) {
        setSuccessMessage("Login successful! Redirecting...");
        setErrorMessage(""); // Clear any previous error message
        router.push("/supplier");
      } else {
        setErrorMessage(result.errorMessage || "Account or password is incorrect.");
      }
    } catch (error) {
      setSuccessMessage(""); // Clear any previous success message
      setErrorMessage("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="image-bk">
      <div className="login">
        <div className="text-login">
          <h3 className="text-center font-bold text-xl color-black">
            Log In As a Supplier Staff
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="text-input relative">
            <p className="color-black m-0 pt-2 pb-1">Enter your email</p>
            <input
              className="input-text"
              type="text"
              placeholder="Email/ Phone number"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              required
            />
            <p className="m-0 pt-4 pb-1">Enter your password</p>
            <input
              className="input-text"
              type={isPassword ? "password" : "text"}
              placeholder="Password"
              value={staffPassword}
              onChange={(e) => setStaffPassword(e.target.value)}
              required
            />
            {/* <img
              src="/image/hide.png"
              className="inout-hide cursor-pointer"
              onClick={togglePasswordVisibility}
              alt="Toggle Password Visibility"
            /> */}
           {errorMessage && <p className="my-2 ml-2" style={{ color: "red" }}>{errorMessage}</p>}
           {successMessage && <p className="my-2 ml-2" style={{ color: "green" }}>{successMessage}</p>} {/* Display success message */}
            <div className="flex justify-center">
              <button
                className="w-4/5 text-xl text-white button-text mt-4"
                style={{ backgroundColor: "#305A61", borderRadius: "20px" }}
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
