/* eslint-disable @next/next/no-img-element */
"use client";

import ChangePasswordUser from "@/app/components/User/ChangePasswordUser";
import userService from "@/app/services/userService";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

const ChangePassword = () => {
  const [userName, setUserName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [User, setUser] = useState<IUser | null>(null);

  const { data: user, error } = useSWR("profile", () =>
    userService.getUserById()
  );

  useEffect(() => {
    if (user) {
      setUserName(user.userName);
      setAvatar(user.avatar);
      setPassword(user.password);
      setUser(user);
    } else if (error) {
      console.error("Failed to fetch user:", error);
    }
  }, [user, error]);

  if (!user) {
    return <div>User ID not found</div>;
  }

  const maskPassword = (password: string) => {
    return "*".repeat(password.length);
  };

  return (
    <>
      <div className="container pt-44">
        <p className="text-center font-bold text-4xl">Manage Profile</p>
        <div
          className="flex w-3/4 m-auto pt-10"
          style={{ borderBottom: "2px solid #D2D2D2" }}
        >
          <div className="flex items-start pr-10">
            <img className="w-7" src="/image/user.png" alt="User" />
            <Link
              href="/trekbooking/profile"
              className="text-hv font-semibold no-underline text-black text-xl pl-2"
            >
              Account information
            </Link>
          </div>
          <div className="flex items-start">
            <img className="w-7" src="/image/lock.png" alt="Lock" />
            <Link
              href="/trekbooking/password"
              className="text-hv no-underline font-semibold text-xl pl-2"
              style={{ color: "#305A61" }}
            >
              Change password
            </Link>
          </div>
        </div>

        <div className="my-10">
          <div
            className="w-3/4 border m-auto pt-9"
            style={{
              borderRadius: "20px",
              boxShadow: "1px 1px 8px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="w-4/5 m-auto">
              <span className="text-xl font-semibold">Account information</span>
              <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>
              <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                <div className="flex justify-center flex-wrap">
                  <img
                    className="w-[150px] h-[150px] cursor-pointer m-2 rounded-full object-cover"
                    src={avatar ? avatar : "/image/usersupplier.png"}
                    alt="Avatar"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
target.onerror = null;
                      target.src = "/image/usersupplier.png";
                    }}
                  />
                </div>
              </div>
              <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>

              <div
                className="mb-3 col-6"
                style={{
                  display: "flex",
                  marginTop: "20px",
                }}
              >
                <div className="col-md-5">
                  <label className="font-bold text-xl">User Name</label>
                </div>
                <div className="flex-1">
                  <label className="font-bold text-xl text-gray-400">
                    {userName}
                  </label>
                </div>
              </div>
              <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>

              <div
                className="mb-3 col-6"
                style={{ display: "flex", marginTop: "20px" }}
              >
                <div className="col-md-5">
                  <label className="font-bold text-xl">Password</label>
                </div>
                <div className="flex-1">
                  <label className="font-bold text-xl text-gray-400">
                   ********
                  </label>
                </div>
              </div>
              <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>
              <div
                className="flex justify-end pt-5 pb-4"
                style={{ marginTop: "-20px" }}
              >
                <button
                  className="text-white font-medium py-2 px-6 text-lg border"
                  style={{ backgroundColor: "#305A61", borderRadius: "20px" }}
                  onClick={() => {
                    setShowChangePassword(true);
                  }}
                >
                  Change
                </button>
              </div>
            </div>
            <ChangePasswordUser
              showChangePassword={showChangePassword}
              setShowChangePassword={setShowChangePassword}
              user={User}
              userId={Number(user.userId)}
              setUser={setUser}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;