/* eslint-disable @next/next/no-img-element */
"use client";
import UpdateProfileSupplier from "@/app/components/Supplier/UpdateProfileSupplier";
import supplierService from "@/app/services/supplierService";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "../../../../node_modules/next/link";

const Profile = () => {
  const [supplierName, setSupplierName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [bankAccount, setBankAccount] = useState<string>("");
  const [bankNumber, setBankNumber] = useState<string>("");

  const [showSupplierUpdate, setShowSupplierUpdate] = useState<boolean>(false);
  const [Supplier, setSupplier] = useState<ISupplier | null>(null);

  const { data: supplier, error } = useSWR("profile", () =>
    supplierService.getSupplierById()
  );

  useEffect(() => {
    if (supplier) {
      setSupplierName(supplier.supplierName);
      setAvatar(supplier.avatar);
      setEmail(supplier.email);
      setPhone(supplier.phone);
      setAddress(supplier.address);
      setBankAccount(supplier.bankAccount);
      setBankName(supplier.bankName);
      setBankNumber(supplier.bankNumber);
      setSupplier(supplier);
    } else if (error) {
      console.error("Failed to fetch supplier:", error);
    }
  }, [supplier, error]);

  if (!supplier) {
    return <div>Supplier ID not found</div>;
  }

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
              <img className='w-7' src="/image/user.png" alt="User" />
              <Link
                href="/supplier/profile"
                className="text-hv font-semibold no-underline text-xl pl-2"
                style={{ color: "#305A61" }}
              >
                Account information
              </Link>
            </div>
            <div className="flex items-start">
              <img className='w-7' src="/image/lock.png" alt="Lock" />
              <Link
                href="/supplier/password"
                className="text-hv no-underline font-semibold text-black text-xl pl-2"
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
<span className="text-xl  max-[500px]:text-xs font-semibold">
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

                <div className="flex">
                  <div className="w-1/2 pr-2">
                    <div
                      className="mb-3 row"
                      style={{ display: "flex", marginTop: "20px" }}
                    >
                      <div className="col-4 max-[500px]:w-full max-[500px]:pb-2">
                        <label className="font-bold text-base">
                          Supplier Name:
                        </label>
                      </div>
                      <div className="flex-1 col-8 max-[500px]:w-full">
                        <label className="font-bold text-base text-gray-400 max-[500px]:text-xs">
                          {supplierName}
                        </label>
                      </div>
                    </div>
                    <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>

                    <div
                      className="mb-3 row"
                      style={{ display: "flex", marginTop: "20px" }}
                    >
                      <div className="col-4 max-[500px]:w-full max-[500px]:pb-2">
                        <label className="font-bold text-base">Phone:</label>
                      </div>
                      <div className=" col-8 max-[500px]:w-full">
                        <label className="font-bold text-base text-gray-400 max-[500px]:text-xs">
                          {phone}
                        </label>
                      </div>
                    </div>
                    <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>

                    <div
                      className="mb-3 row"
                      style={{ display: "flex", marginTop: "20px" }}
                    >
                      <div className="col-4 max-[500px]:w-full max-[500px]:pb-2">
                        <label className="font-bold text-base">Email:</label>
                      </div>
                      <div className="col-8 max-[500px]:w-full">
<label className="font-bold text-base text-gray-400 max-[500px]:text-xs">
                          {email}
                        </label>
                      </div>
                    </div>
                    <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>

                    <div
                      className="mb-3 row"
                      style={{ display: "flex", marginTop: "20px" }}
                    >
                      <div className="col-4 max-[500px]:w-full max-[500px]:pb-2">
                        <label className="font-bold text-base">Address:</label>
                      </div>
                      <div className="col-8 max-[500px]:w-full">
                        <label className="font-bold text-base text-gray-400 max-[500px]:text-xs">
                          {address}
                        </label>
                      </div>
                    </div>
                    <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>
                  </div>

                  <div className="w-1/2 pl-2">
                    <div
                      className="mb-3 row"
                      style={{ display: "flex", marginTop: "20px" }}
                    >
                      <div className="col-4 max-[500px]:w-full max-[500px]:pb-2">
                        <label className="font-bold text-base">
                          Bank Account:
                        </label>
                      </div>
                      <div className="col-8 max-[500px]:w-full">
                        <label className="font-bold text-base text-gray-400 max-[500px]:text-xs">
                          {bankAccount}
                        </label>
                      </div>
                    </div>
                    <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>

                    <div
                      className="mb-3 row"
                      style={{ display: "flex", marginTop: "20px" }}
                    >
                      <div className="col-4 max-[500px]:w-full max-[500px]:pb-2">
                        <label className="font-bold text-base">Bank Name:</label>
                      </div>
                      <div className="col-8 max-[500px]:w-full">
                        <label className="font-bold text-base text-gray-400 max-[500px]:text-xs">
                          {bankName}
                        </label>
                      </div>
                    </div>
                    <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>

                    <div
                      className="mb-3 row"
                      style={{ display: "flex", marginTop: "20px" }}
                    >
                      <div className="col-4 max-[500px]:w-full max-[500px]:pb-2">
                        <label className="font-bold text-base">
                          Bank Number:
                        </label>
                      </div>
<div className="col-8 max-[500px]:w-full">
                        <label className="font-bold text-base text-gray-400 max-[500px]:text-xs">
                          {bankNumber}
                        </label>
                      </div>
                    </div>
                    <div style={{ borderBottom: "1px solid #D2D2D2" }}></div>
                  </div>
                </div>

                <div
                  className="flex justify-end pt-5 pb-4"
                  style={{ marginTop: "-20px" }}
                >
                  <button
                    className="text-white font-medium py-2 px-6 text-lg border max-[500px]:text-xs"
                    style={{ backgroundColor: "#305A61", borderRadius: "20px" }}
                    onClick={() => {
                      setShowSupplierUpdate(true);
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>
              <UpdateProfileSupplier
                showSupplierUpdate={showSupplierUpdate}
                setShowSupplierUpdate={setShowSupplierUpdate}
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

export default Profile;