"use client";
import React, { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import Link from "next/link";
import { FaRegTimesCircle } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import authenticateService from "../services/authenticateService";
import { toast } from "react-toastify";

import useSWR from "swr";
import supplierService from "../services/supplierService";
import { useRouter } from "../../../node_modules/next/navigation";
interface HeaderSupplierProps {
  title: string;
}

const HeaderSupplier: React.FC<HeaderSupplierProps> = ({ title }) => {
  const [supplierName, setSupplierName] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");
  const [isDivVisible, setDivVisible] = useState(false);
  const pathname = usePathname();
  const handleMenuClick = () => {
    setDivVisible(!isDivVisible);
  };
  const { data: supplier, error } = useSWR("supplier", () =>
    supplierService.getSupplierById()
  );
  let currentTitle = title;
  if (pathname === "/supplier/hotel") {
    currentTitle = "HOTEL";
  } else if (pathname === "/supplier/tour") {
    currentTitle = "TOUR";
  } else if (pathname === "/supplier/dashboard") {
    currentTitle = "DASHBOARD";
  } else if (pathname === "/supplier/staff") {
    currentTitle = "STAFF";
  } else if (pathname === "/supplier/profile") {
    currentTitle = "PROFILE";
  } else if (pathname.match(/^\/supplier\/hotel\/voucher\/\d+$/)) {
    currentTitle = "VOUCHER";
  } else if (pathname === "/supplier/roombooking") {
    currentTitle = "ROOM BOOKING";
  } else if (pathname === "/supplier/tourbooking") {
    currentTitle = "TOUR BOOKING";
  } else if (pathname === "/supplier/roomservice" || pathname.startsWith("/supplier/hotel/room/") && pathname.includes("/serviceOfRoom/")) {
    currentTitle = "ROOM SERVICE";
  }
  else if (pathname === "/supplier/hotel" || pathname.startsWith("/supplier/hotel/rate/") && pathname.includes("/rate/")) {
    currentTitle = "RATE";
  }
  else if (pathname === "/supplier/hotel" || pathname.startsWith("/supplier/hotel/comment/") && pathname.includes("/comment/")) {
    currentTitle = "COMMENT";
  } else if (pathname.match(/^\/supplier\/hotel\/room\/\d+$/)) {
    currentTitle = "ROOM";
  } else if (pathname.match(/^\/supplier\/tour\/tourImage\/\d+$/)) {
    currentTitle = "TOUR IMAGE";
  } else if (pathname.match(/^\/supplier\/hotel\/room\/\d+\/roomImage\/\d+$/)) {
    currentTitle = "ROOM IMAGE";
  } else if (
    pathname.match(/^\/supplier\/hotel\/room\/\d+\/room3DImage\/\d+$/)
  ) {
    currentTitle = "ROOM 3D IMAGE";
  }
  const handleCloseMenuClick = () => {
    setDivVisible(false);
  };

  useEffect(() => {
    const cookieSupplierName = Cookies.get("supplierName");
    setSupplierName(cookieSupplierName ?? null);
  }, []);
  useEffect(() => {
    const roleName = Cookies.get("roleName") || ""; // Thêm giá trị mặc định là chuỗi rỗng nếu roleName là undefined
    setRole(roleName);
  }, []);
  const router = useRouter();
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
    <div className="fix-border flex justify-between ml-72 p-8 pr-11 items-center">
      <div
        className={`overlay ${isDivVisible ? "show" : ""}`}
        onClick={handleMenuClick}
      ></div>
      <CiMenuBurger
        className="cursor-pointer mobi-supplier"
        style={{ float: "right", fontSize: "22px" }}
        onClick={handleMenuClick}
      />
      <span className="ml-4 color-black font-semibold text-2xl fix-title-400">
        {currentTitle}
      </span>

      <div className="icon-user flex items-center">
        <img
          className="h-5 w-5 mr-3 cursor-pointer"
          src="/image/bell.png"
          alt="Bell Icon"
        />
        <li className="flex hover-bold cursor-pointer dropdown relative z-1">
          <div className="flex relative z-2 color-mess">
            {supplier && (
              <div className="flex">
                <div className="flex items-center relative z-2 color-mess">
                  <img
                    src={supplier.avatar ? supplier.avatar : "/image/usersupplier.png"}
                    alt=""
                    className="h-7 w-7 rounded-full cursor-pointer m-2 object-cover"
                  />
                  <Link className="no-underline text-accent font-bold" href="#">
                    {supplier.supplierName.length > 8
                      ? `${supplier.supplierName.slice(0, 8)}`
                      : supplier.supplierName}
                  </Link>
                </div>
                <div className="backgourd-li2 text-center space-y-1">
                  <Link
                    className="no-underline text-accent font-bold block mt-3 hover-nav-sub"
                    href="/supplier/profile"
                  >
                    Manager profile
                  </Link>
                  {role === "supplier" ? (
                    <Link
                      href="/login_supplier"
                      className="no-underline text-accent font-bold block hover-nav-sub"
                      onClick={handleLogoutSupplier}
                    >
                      Log out
                    </Link>
                  ) : (
                    <Link
                      href="/login_supplier_staff"
                      className="no-underline text-accent font-bold block hover-nav-sub"
                      onClick={handleLogoutStaff}
                    >
                      Log out
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </li>
      </div>
      {isDivVisible && (
        <div className="pc-none">
          <header className="nav-supllier-mobi">
            <FaRegTimesCircle
              className="times-close"
              onClick={handleCloseMenuClick}
            />
            <div className="logo">
              <p className="text-white text-center font-bold text-2xl pt-4">
                Trek Booking
              </p>
            </div>
            <div className="list-choose pt-10 px-4 pb-14">
              <ul className="pl-0">
                <div className="py-2">
                  <li className="flex items-center pb-3">
                    <Link className={`flex no-underline  nav-i-hover py-2 pl-3 pr-32 ${pathname === "/supplier/dashboard" ? "active-link" : ""} `} href="/supplier/dashboard">
                      <img
                        className="w-7 h-7"
                        src="/image/darhboard.png"
                        alt="Dashboard"
                      />
                      <span className="text-white ml-2 text-xl font-semibold">
                        Dashboard
                      </span>
                    </Link>
                  </li>
                </div>
                <li className="flex items-center pb-6">
                  <Link
                    className="flex no-underline nav-i-hover py-2 pl-3 pr-40"
                    href="/supplier/hotel"
                  >
                    <img
                      className="w-7 h-7"
                      src="/image/home.png"
                      alt="Hotel"
                    />
                    <span className="text-white ml-2 text-xl font-semibold">
                      Hotel
                    </span>
                  </Link>
                </li>

                <li className="flex items-center pb-6">
                  <Link
                    className="flex no-underline nav-i-hover py-2 pl-3 pr-40"
                    href="/supplier/tour"
                  >
                    <img
                      className="w-7 h-7"
                      src="/image/suitcase.png"
                      alt="Tour"
                    />
                    <span className="text-white ml-2 text-xl font-semibold">
                      Tour
                    </span>
                  </Link>
                </li>
                <li className="flex items-center pb-6">
                  <Link
                    className="flex no-underline nav-i-hover py-2 pl-3 pr-40"
                    href="/supplier/staff"
                  >
                    <img
                      className="w-7 h-7"
                      src="/image/staff.png"
                      alt="Staff"
                    />
                    <span className="text-white ml-2 text-xl font-semibold">
                      Staff
                    </span>
                  </Link>
                </li>

                <li className="flex items-center pb-6">
                  <Link
                    className="flex no-underline nav-i-hover py-2 pl-3 pr-40"
                    href="/supplier/roombooking"
                  >
                    <img
                      className="w-7 h-7"
                      src="/image/chart.png"
                      alt="Room booking"
                    />
                    <span className="text-white ml-2 text-xl font-semibold">
                      Room booking
                    </span>
                  </Link>
                </li>
                <li className="flex items-center pb-6">
                  <Link
                    className="flex no-underline nav-i-hover py-2 pl-3 pr-40"
                    href="/supplier/tourbooking"
                  >
                    <img
                      className="w-7 h-7"
                      src="/image/dock.png"
                      alt="Tour booking"
                    />
                    <span className="text-white ml-2 text-xl font-semibold">
                      Tour booking
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </header>
        </div>
      )}
    </div>
  );
};

export default HeaderSupplier;
