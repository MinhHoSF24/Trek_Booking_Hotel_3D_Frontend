"use client";
import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import authenticateService from "../services/authenticateService"; // Adjust the path as needed
import "../../../public/css/authen.css"; // Adjust the path as needed
import { useSearchParams } from "next/navigation";

function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [isPassword, setIsPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const togglePasswordVisibility = () => {
    setIsPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = await authenticateService.loginClient(email, password);

    if (result.success) {
      setSuccessMessage("Login successful! Redirecting...");
      setErrorMessage(""); // Clear any previous error message
      const redirectUrl = searchParams.get("redirect") || "/trekbooking";
        router.push(decodeURIComponent(redirectUrl)); // Chuyển hướng đến URL đã lưu trữ hoặc trang chủ nếu không có URL
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
              <h3 className="text-center font-bold color-black">Log In</h3>
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
                <div className="flex justify-center mt-4">
                  <button
                    className="w-4/5 text-xl text-white button-text "
                    style={{ backgroundColor: "#305A61", borderRadius: "20px" }}
                  >
                    Continue
                  </button>
                </div>
                <div className="nav-sign flex justify-between pt-3 pb-4">
                  <Link
                    className="pt-2 text-right text-base cursor-pointer text-decoration"
                    href="signup_client"
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

export default function WrappedLoginClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginClient />
    </Suspense>
  );
}
