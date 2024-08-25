/* eslint-disable @next/next/no-img-element */
"use client";
import ChangePasswordSupplier from "@/app/components/Supplier/ChangePasswordSupplier";
import supplierService from "@/app/services/supplierService";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

const ChangePassword = () => {
  const [supplierName, setSupplierName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [Supplier, setSupplier] = useState<ISupplier | null>(null);

  const { data: supplier, error } = useSWR("profile", () =>
    supplierService.getSupplierById()
  );

  useEffect(() => {
    if (supplier) {
      setSupplierName(supplier.supplierName);
      setAvatar(supplier.avatar);
      setPassword(supplier.password);
      setSupplier(supplier);
    } else if (error) {
      console.error("Failed to fetch supplier:", error);
    }
  }, [supplier, error]);

  if (!supplier) {
    return <div>Supplier ID not found</div>;
  }

  const maskPassword = (password: string) => {
    return "*".repeat(password.length);
  };
  return (
    <div className="relative">
      <div className="table-profile">
        <div
          className="container mt-15"
          style={{ maxWidth: "100%", margin: "auto" }}
        >
          <div
            className="flex w-4/5 m-auto pt-5"
            style={{ borderBottom: "2px solid #D2D2D2" }}
          >
            <div className="flex items-start pr-10">
              <img className="w-7" src="/image/user.png" alt="User" />
              <Link
                href="/supplier/profile"
                className="text-hv font-semibold no-underline text-black text-xl pl-2"
              >
                Account information
              </Link>
            </div>
            <div className="flex items-start">
              <img className="w-7" src="/image/lock.png" alt="Lock" />
              <Link
                href="/supplier/password"
                className="text-hv no-underline font-semibold text-xl pl-2"
                style={{ color: "#305A61" }}
              >
                Change password
              </Link>
            </div>
          </div>

          <div className="my-10">
            <div
              className="w-3/4 border m-auto pt-3"
              style={{
                borderRadius: "20px",
                boxShadow: "1px 1px 8px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="w-4/5 m-auto">
                <span className="text-xl font-semibold">
                  Account information
                </span>
                <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>
                <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                  <div className="flex justify-center flex-wrap">
                    <img
className="w-[70px] h-[70px] cursor-pointer m-2 rounded-full object-cover"
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
                  <div className="col-4">
                    <label className="font-bold text-xl">Supplier Name</label>
                  </div>
                  <div className="col-8">
                    <label className="font-bold text-xl text-gray-400">
                      {supplierName}
                    </label>
                  </div>
                </div>
                <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>
                <div
                  className="mb-3 row"
                  style={{ display: "flex", marginTop: "20px" }}
                >
                  <div className="col-4">
                    <label className="font-bold text-xl">Password</label>
                  </div>
                  <div className="col-8">
                    <label className="font-bold text-xl text-gray-400 ">
                       ********
                    </label>
                  </div>
                </div>
                <div
                  className="flex justify-end pt-5 pb-4"
                  style={{ marginTop: "-20px" }}
                >
                  <button
                    className="text-white font-medium py-2 px-6 text-lg border"
                    style={{
                      backgroundColor: "#305A61",
                      borderRadius: "20px",
                    }}
                    onClick={() => {
                      setShowChangePassword(true);
                    }}
                  >
                    Change
                  </button>
                </div>
              </div>
              <ChangePasswordSupplier
                showChangePassword={showChangePassword}
                setShowChangePassword={setShowChangePassword}
                supplier={Supplier}
                supplierId={Number(supplier.supplierId)}
                setSupplier={setSupplier}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;