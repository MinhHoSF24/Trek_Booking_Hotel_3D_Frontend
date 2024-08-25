/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, FormEvent, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import authenticateService from "../services/authenticateService"; // Adjust the path as needed
import "../../../public/css/authen.css"; // Adjust the path as needed

function LoginSupplier() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPassword, setIsPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "missingCredentials") {
      toast.error("Missing credentials. Please log in.");
    } else if (message === "notAuthorized") {
      toast.error("You are not authorized to access this page.");
    }
  }, [searchParams]);

  const togglePasswordVisibility = () => {
    setIsPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = await authenticateService.loginSupplier(email, password);

    if (result.success) {
      setSuccessMessage("Login successful! Redirecting...");
      setErrorMessage(""); // Clear any previous error message
        router.push("/supplier/dashboard");
    } else {
      setSuccessMessage(""); // Clear any previous success message
      setErrorMessage(result.errorMessage || "Account or password is incorrect.");
    }
  };

  return (
    <>
      <div>
        <div className="image-bk">
          <div className="login">
            <div className="text-login">
              <h3 className="text-center font-bold text-xl color-black">Log In As a Supplier</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="text-input relative">
                <p className="color-black m-0 pt-2 pb-1">Enter your email</p>
                <input
                  className="input-text"
                  type="text"
                  placeholder="Email/ Phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <p className="m-0 pt-4 pb-1">Enter your password</p>
                <input
                  className="input-text"
                  type={isPassword ? "password" : "text"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* <img
                  src="/image/hide.png"
                  className="inout-hide cursor-pointer"
                  onClick={togglePasswordVisibility}
                  alt=""
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
                <div className="nav-sign flex justify-between pt-3 pb-4">
                  <Link
                    className="pt-2 text-right text-base cursor-pointer text-decoration"
                    href="signup_supplier"
                  >
                    You dont have a account?
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function WrappedLoginSupplier() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginSupplier />
      </Suspense>
  );
}
