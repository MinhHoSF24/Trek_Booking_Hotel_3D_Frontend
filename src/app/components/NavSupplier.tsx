/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import Link from "../../../node_modules/next/link";
import { usePathname, useRouter } from "next/navigation";
import authenticateService from "../services/authenticateService";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const NavSupplier = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  useEffect(() => {
    const roleName = Cookies.get("roleName") || ""; // Thêm giá trị mặc định là chuỗi rỗng nếu roleName là undefined
    setRole(roleName);
  }, []);

  const handleLogoutSupplier = async () => {
    await authenticateService.logOutSupplier();
    toast.success("Logout Success..");
    router.push("/login_supplier");
  };
  const handleLogoutStaff = async () => {
    await authenticateService.logOutStaff();
    toast.success("Logout Success..");
    router.push("/login_supplier_staff");
  };
  return (
    <div>
      <header className="nav-supllier">
        <div className="logo">
          <p className="text-white text-center font-bold text-2xl pt-4">
            Trek Booking
          </p>
        </div>
        <div className="list-choose pt-10 px-4 pb-6">
          <ul className="pl-0">
            <div className="py-2">
           
              <li className="flex items-center pb-4 ">
              <Link className={`flex no-underline  nav-i-hover py-2 pl-3 pr-32 ${pathname === "/supplier/dashboard" ? "active-link" : ""} `} href="/supplier/dashboard">
                <img className="w-7 h-7 " src="/image/darhboard.png" alt="" />
                <span className="text-white ml-2 text-xl font-semibold">
                  Dashboard
                </span>
                </Link>
              </li>
            </div>

            <div className="menu-container">
              {role === "supplier" && (
                <>
                  {/* <li className="flex items-center pb-10 hotel-room">
                    <Link
                      className={`flex no-underline  nav-i-hover py-2 pl-3 pr-32 ${
                        pathname === "/supplier/hotel" ? "active-link" : ""
                      } `}
                      href="/supplier/hotel"
                    >
                      <img className="w-7 h-7 " src="/image/home.png" alt="" />
                      <span className="text-white ml-2 text-xl font-semibold">
                        Hotel
                      </span>
                    </Link>
                  </li> */}
                  <li className="flex items-center pb-10 ">
                    <Link
                      className={`flex no-underline  nav-i-hover py-2 pl-3 pr-32 ${
                        pathname === "/supplier/staff" ? "active-link" : ""
                      } `}
                      href="/supplier/staff"
                    >
                      <img className="w-7 h-7 " src="/image/staff.png" alt="" />
                      <span className="text-white ml-2 text-xl font-semibold">
                        Staff
                      </span>
                    </Link>
                  </li>
                </>
              )}
            </div>
            <li className="flex items-center pb-10 hotel-room">
                    <Link
                      className={`flex no-underline  nav-i-hover py-2 pl-3 pr-32 ${
                        pathname === "/supplier/hotel" ? "active-link" : ""
                      } `}
                      href="/supplier/hotel"
                    >
                      <img className="w-7 h-7 " src="/image/home.png" alt="" />
                      <span className="text-white ml-2 text-xl font-semibold">
                        Hotel
                      </span>
                    </Link>
                  </li>
            <li className="flex items-center pb-10">
              <Link
                className={`flex no-underline nav-i-hover py-2 pl-3 pr-32 ${
                  pathname === "/supplier/tour" ? "active-link" : ""
                }`}
                href="/supplier/tour"
              >
                <img className="w-7 h-7" src="/image/suitcase.png" alt="" />
                <span className="text-white ml-2 text-xl font-semibold">
                  Tour
                </span>
              </Link>
            </li>
            <li className="flex items-center pb-10 ">
              <Link
                className={`flex no-underline  nav-i-hover py-2 pl-3 pr-16 ${
                  pathname === "/supplier/roombooking" ? "active-link" : ""
                } `}
                href="/supplier/roombooking"
              >
                <img className="w-7 h-7 " src="/image/chart.png" alt="" />
                <span className="text-white ml-2 text-xl font-semibold">
                  Room booking
                </span>
              </Link>
            </li>

            <li className="flex items-center pb-10 ">
              <Link
                className={`flex no-underline  nav-i-hover py-2 pl-3 pr-20 ${
                  pathname === "/supplier/tourbooking" ? "active-link" : ""
                } `}
                href="/supplier/tourbooking"
              >
                <img className="w-7 h-7 " src="/image/dock.png" alt="" />
                <span className="text-white ml-2 text-xl font-semibold">
                  Tour booking
                </span>
              </Link>
            </li>
          </ul>
        </div>
    
      </header>
    </div>
  );
};

export default NavSupplier;