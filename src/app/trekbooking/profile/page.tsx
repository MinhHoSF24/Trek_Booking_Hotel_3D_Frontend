/* eslint-disable @next/next/no-img-element */
"use client";
import UpdateProfile from "@/app/components/Profile/UpdateProfile";
import userService from "@/app/services/userService";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "../../../../node_modules/next/link";
import { Oval } from "react-loader-spinner"; // Import spinner

const Profile = () => {
  const [userName, setUserName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [showUserUpdate, setShowUserUpdate] = useState<boolean>(false);
  const [User, setUser] = useState<IUser | null>(null);

  const { data: user, error } = useSWR("profile", () =>
    userService.getUserById()
  );

  useEffect(() => {
    if (user) {
      setUserName(user.userName);
      setAvatar(user.avatar);
      setEmail(user.email);
      setPhone(user.phone);
      setAddress(user.address);
      setUser(user);
    } else if (error) {
      console.error("Failed to fetch user:", error);
    }
  }, [user, error]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Oval
          height={80}
          width={80}
          color="#305A61"
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#4f9a94"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  return (
    <>
      <div className="container pt-44">
        <p className="text-center font-bold text-4xl">Manage Profile</p>
        <div
          className="flex w-3/4 m-auto pt-10"
          style={{ borderBottom: "2px solid #D2D2D2" }}
        >
          <div className="flex items-start pr-10">
            <img src="/image/user.png" alt="User" />
            <Link
              href="/trekbooking/profile"
              className="text-hv font-semibold no-underline text-xl pl-2"
              style={{ color: "#305A61" }}
            >
              Account information
            </Link>
          </div>
          <div className="flex items-start">
          <img style={{ width: "24px", height: "24px" }} src="/image/lock.png" alt="Lock" />
            <Link
              href="/trekbooking/password"
              className="text-hv no-underline font-semibold text-black text-xl pl-2"
            >
              Change password
            </Link>
          </div>
        </div>

        <div className="my-10">
          <div
            className="w-3/4 border m-auto pt-9 max-[432px]:w-full"
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
                className="mb-3 row"
                style={{
                  display: "flex",
                  marginTop: "20px",
                }}
              >
                <div className="col-lg-3 col-5">
                  <label className="font-bold text-xl">User Name</label>
                </div>
                <div className="flex-1 col-7">
                  <label className="font-bold text-xl text-gray-400">
                    {userName}
                  </label>
                </div>
              </div>
              <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>

              <div
                className="mb-3 row"
                style={{ display: "flex", marginTop: "20px" }}
              >
                <div className="col-lg-3 col-5">
                  <label className="font-bold text-xl">Phone</label>
                </div>
                <div className="flex-1 col-7">
                  <label className="font-bold text-xl text-gray-400">
                    {phone}
                  </label>
                </div>
              </div>
              <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>

              <div
                className="mb-3 row"
                style={{ display: "flex", marginTop: "20px" }}
              >
                <div className="col-lg-3 col-3">
                  <label className="font-bold text-xl">Email</label>
                </div>
                <div className="flex-1 col-9">
                  <label className="font-bold text-xl text-gray-400">
                    {email}
                  </label>
                </div>
              </div>
              <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>

              <div
                className="mb-3 row"
                style={{ display: "flex", marginTop: "20px" }}
              >
                <div className="col-lg-3 col-5">
                  <label className="font-bold text-xl">Address</label>
                </div>
                <div className="flex-1 col-7">
                  <label className="font-bold text-xl text-gray-400">
                    {address}
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
                    setShowUserUpdate(true);
                  }}
                >
                  Update
</button>
              </div>
            </div>
            <UpdateProfile
              showUserUpdate={showUserUpdate}
              setShowUserUpdate={setShowUserUpdate}
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

export default Profile;