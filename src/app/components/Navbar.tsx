'use client'
import React, { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import authenticateService from "../services/authenticateService";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import useSWR from "swr";
import userService from "../services/userService";
import { useCart } from "./CartContext";


interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();
  const { totalItems, fetchTotalItems } = useCart();

  const fetchUser = async () => {
    const token = Cookies.get("tokenUser");
    if (token) {
      const user = await userService.getUserById();
      if (user && user.userName) {
        return user;
      }
    }
    return null;
  };

  const { data: user, error } = useSWR("user", fetchUser);

  useEffect(() => {
    const cookieUserName = Cookies.get("userName");
    if (cookieUserName) {
      setUserName(cookieUserName.substring(0, 7));
    } else {
      if (user && user.userName) {
        setUserName(user.userName.substring(0, 7));
      }
    }
  }, [user]);

  const handleLogout = async () => {
    await authenticateService.logOutClient();
   // toast.success("Logout Success..");
    router.push("/login_client");
  };

  const [showSubMenu, setShowSubMenu] = useState(false);
  const handleClick = () => {
    setShowSubMenu(!showSubMenu);
  };

  const pathname = usePathname();
  let currentTitle = title;
  if (pathname === "/trekbooking") {
    currentTitle = "Hotel";
  } else if (pathname === "/supplier/tour") {
    currentTitle = "Tour";
  }

  return (
    <header className="bg-background fixed w-100 z-50 top-0 ">
      <div className="container pt-4 ">
        <div className="nav row ">
          <div className="col-5 text-center h-0 ">
            <Link
              href="/"
              className="text-blackish no-underline text-2xl lg:mr-44 font-bold flex justify-center image-fix-link max-[1024px]:hidden"
            >
              <img className="fix-logo" src="/image/logo.png" alt="" />
            </Link>
          </div>
          <div className="col-7 hidden lg:block">
            <ul className="flex no-underline justify-around mb-0">
              <li className="flex items-center hover-bold cursor-pointer">
                <img
                  style={{ width: "40px" }}
                  src="/image/gifglobal.gif"
                  alt=""
                  className="pr-2"
                />
                <a className="no-underline text-accent font-bold" href="">
                  EN/VI
                </a>
              </li>
              {userName ? (
                <li className="flex hover-bold cursor-pointer">
                  <Link
                    className="flex items-center text-decoration-none"
                    href="/trekbooking/booking_cart"
                  >
                    <img
                      style={{ width: "40px" }}
                      src="/image/gifcart.gif"
                      alt=""
                      className="pr-2"
                    />
                    <span className="no-underline text-accent font-bold">
                      Cart({totalItems})
                    </span>
                  </Link>
                </li>
              ) : (
                <li className="flex hover-bold cursor-pointer">
                  <Link
                    className="flex items-center text-decoration-none"
                    href="/login_client"
                  >
                    <img
                      style={{ width: "40px" }}
                      src="/image/gifcart.gif"
                      alt=""
                      className="pr-2"
                    />
                    <span className="no-underline text-accent font-bold">
                      Cart(0)
                    </span>
                  </Link>
                </li>
              )}
              <li className="flex hover-bold cursor-pointer items-center">
                <img
                  style={{ width: "40px" }}
                  src="/image/graffiti.gif"
                  alt=""
                  className="pr-2"
                />
                <Link
                  className="no-underline text-accent font-bold"
                  href="/confirmregister"
                >
                  Post your hotel
                </Link>
              </li>
              <li className="flex hover-bold cursor-pointer dropdown relative z-10">
                <div className="flex relative z-2 color-mess">
                  {user ? (
                    <div className="flex">
                      <div className="flex relative z-2 color-mess hleft-12">
                        <img
                          src={
                            user && user.avatar
                              ? user.avatar
                              : "/image/usersupplier.png"
                          }
                          alt=""
                          className="rounded-full w-7 h-6 mr-2"
                        />
                        <Link
                          className="no-underline text-accent font-bold"
                          href="#"
                        >
                          {user.userName}
                        </Link>
                      </div>
                      <div className="backgourd-li text-center">
                        <Link
                          className="no-underline text-accent font-bold block mt-3 mb-3 hover-nav-sub"
                          href="/trekbooking/profile"
                        >
                          Manager profile
                        </Link>
                        <Link
                          className="no-underline text-accent font-bold block mb-3 hover-nav-sub"
                          href="/trekbooking/voucher"
                        >
                          Voucher Wallet
                        </Link>
                        <Link
                          className="no-underline text-accent font-bold block mb-3 hover-nav-sub"
                          href="/trekbooking/payment_wallet"
                        >
                          Payment Wallet
                        </Link>
                        <Link
                          className="no-underline text-accent font-bold block mb-3 hover-nav-sub"
                          href="/trekbooking/booking_history"
                        >
                          History
                        </Link>
                        <Link
                          className="no-underline text-accent font-bold block mb-3 hover-nav-sub"
                          href="signup_client"
                          onClick={handleLogout}
                        >
                          Logout
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <img
                        style={{ width: "40px" }}
                        src="/image/join.gif"
                        alt=""
                        className="pr-2 w-7 h-6"
                      />
                      <Link
                        className="no-underline text-accent font-bold"
                        href="/login_client"
                      >
                        Log In
                      </Link>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>
          <div className="col-7 lg:hidden cursor-pointer" onClick={handleClick}>
            <CiMenuBurger style={{ float: "right", fontSize: "22px" }} />
          </div>
          {showSubMenu && (
            <div className="sub-menu-mobi flex justify-center pt-4">
              <ul className="lg:hidden">
              {user ? (
                <li className="flex items-center pb-4 hover-bold">
                  <img
                    style={{ width: "40px" }}
                    src="/image/gifcart.gif"
                    alt=""
                    className="pr-2"
                  />
                  <a
                    href="/trekbooking/booking_cart"
                    className="font-bold text-decoration-none text-accent"
                  >
                    Cart
                  </a>
                </li>
                 ) : (
                  <li className="flex items-center pb-4 hover-bold">
                  <img
                    style={{ width: "40px" }}
                    src="/image/gifcart.gif"
                    alt=""
                    className="pr-2"
                  />
                  <a
                    href="/login_client"
                    className="font-bold text-decoration-none text-accent"
                  >
                    Cart
                  </a>
                </li>
                )}
                <li className="flex items-center pb-4 hover-bold">
                  <img
                    style={{ width: "40px" }}
                    src="/image/graffiti.gif"
                    alt=""
                    className="pr-2"
                  />
                  <a
                    href="/confirmregister"
                    className="font-bold text-decoration-none text-accent"
                  >
                    Post your hotel
                  </a>
                </li>
                <li className="flex pb-4 hover-bold">
                  {user ? (
                    <div className="flex dropdown">
                      <div className="flex relative z-2 color-mess">
                        <img
                          src={
                            user && user.avatar
                              ? user.avatar
                              : "/image/usersupplier.png"
                          }
                          alt=""
                          className="rounded-full w-7 h-6 mr-2"
                        />
                        <Link
                          className="no-underline text-accent font-bold"
                          href="#"
                        >
                          {user.userName}
                        </Link>
                      </div>
                      <div className="backgourd-li1 text-center">
                        <Link
                          className="no-underline text-accent font-bold block mt-3 mb-3 hover-nav-sub"
                          href="/trekbooking/profile"
                        >
                          Manager profile
                        </Link>
                        <Link
                          className="no-underline text-accent font-bold block mb-3 hover-nav-sub"
                          href="/trekbooking/voucher"
                        >
                          Voucher Wallet
                        </Link>
                        <Link
                          className="no-underline text-accent font-bold block mb-3 hover-nav-sub"
                          href="/trekbooking/payment_wallet"
                        >
                          Payment Wallet
                        </Link>
                        <Link
                          className="no-underline text-accent font-bold block mb-3 hover-nav-sub"
                          href="/trekbooking/booking_history"
                        >
                          History
                        </Link>
                        <Link
                          className="no-underline text-accent font-bold block mb-3 hover-nav-sub"
                          href="signup_client"
                          onClick={handleLogout}
                        >
                          Logout
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <img
                        style={{ width: "40px" }}
                        src="/image/join.gif"
                        alt=""
                        className="pr-2 w-7 h-6"
                      />
                      <Link
                        className="no-underline text-accent font-bold"
                        href="/login_client"
                      >
                        Log In
                      </Link>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>

        <nav className="to-white ">
          <ul className="flex ul-menu max-[400px]:pl-0">
            <li className="li-menu hover-bold">
              <Link
                href="/"
                className={`flex items-end font-bold text-decoration-none link-text ${
                  pathname === "/trekbooking" ? "link-style" : ""
                }`}
              >
                <img
                  src="/image/gifhouse.gif"
                  alt=""
                  className="max-[400px]:w-8"
                  style={{ width: "40px" }}
                />
                <span className="ml-1 ">Home</span>
              </Link>
            </li>
            <li className="li-menu hover-bold">
              <Link
                href="/trekbooking/list_hotel"
                className={`font-bold items-end  text-decoration-none link-text flex ${
                  pathname === "/trekbooking/list_hotel" ||
                  pathname === "/trekbooking/search"
                    ? "link-style"
                    : ""
                }`}
              >
                <img
                  src="/image/gifhotel.gif"
                  alt=""
                  className="max-[400px]:w-8"
                  style={{ width: "40px" }}
                />
                <span className="ml-1 ">Hotel</span>
              </Link>
            </li>
            <li className="li-menu hover-bold">
              <Link
                href="/trekbooking/tour"
                className={` flex items-end  font-bold text-decoration-none link-text ${
                  pathname === "/trekbooking/tour" ? "link-style" : ""
                }`}
              >
                <img
                  src="/image/giftour.gif"
                  alt=""
                  className="max-[400px]:w-8"
                  style={{ width: "40px" }}
                />
                <span className="ml-1 ">Attractions</span>
              </Link>
            </li>
            {/* <li className="li-menu hover-bold none-t">
              <Link
                href="/"
                className={`flex font-bold text-decoration-none link-text ${
                  pathname === "/trekbooking/voucher" ? "link-style" : ""
                }`}
              >
                 <img src="/image/iconvoucher.png" alt="" className=""   style={{ width: "30px", height: "25px" }} />
                <span className="ml-1">Gift Voucher</span>
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
