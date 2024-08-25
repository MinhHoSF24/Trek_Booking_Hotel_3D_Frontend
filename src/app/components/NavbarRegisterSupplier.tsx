/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import Button from "../../../node_modules/react-bootstrap/esm/Button";
import Image from "next/image";
import { CiMenuBurger } from "react-icons/ci";
import Link from "../../../node_modules/next/link";
const NavbarRegisterSupplier = () => {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const handleClick = () => {
    // Đảo ngược trạng thái của submenu
    setShowSubMenu(!showSubMenu);
  };

  return (
    <header className="bg-background">
      <div className="container pt-4 ">
        <div className="nav row pb-3">
        <div className="col-5 text-center h-0">
            <Link
              href="/"
              className="text-blackish no-underline text-2xl lg:mr-44 font-bold flex justify-center image-fix-link"
            >
              <img className="fix-logo" src="/image/logo.png" alt="" />
            </Link>
          </div>
          <div className="col-7 hidden lg:block ">
            <ul className="flex no-underline justify-around">
              <li className="flex items-center hover-bold">
              <img
                  style={{ width: "40px",  }}
                  src="/image/gifglobal.gif"
                  alt=""
                  className="pr-2"
                />
                <a className="no-underline text-accent font-bold" href="">
                  EN/VI
                </a>
              </li>
              <li className="flex items-center hover-bold">
              <img
                    style={{ width: "40px"}}
                    src="/image/gifcart.gif"
                    alt=""
                    className="pr-2"
                  />
                <Link
                  href="/trekbooking/booking_cart"
                  className="no-underline text-accent font-bold"
                >
                  Cart(1)
                </Link>
              </li>
              <li className="flex items-center hover-bold">
              <img
                  style={{ width: "40px" }}
                  src="/image/graffiti.gif"
                  alt=""
                  className="pr-2"
                />
                <Link className="no-underline text-accent font-bold" href="/login_supplier_staff">
                  Login With Staff
                </Link>
              </li>
              <li className="flex items-center hover-bold">
              <img
                        style={{ width: "40px" }}
                        src="/image/join.gif"
                        alt=""
                        className="pr-2 w-7 h-6"
                      />
                <Link
                  className="no-underline text-accent font-bold"
                  href="login_supplier"
                >
                     Log In
                </Link>
              </li>
            </ul>
          </div>
          <div
            className="col-7  lg:hidden cursor-pointer"
            onClick={handleClick}
          >
            <CiMenuBurger style={{ float: "right", fontSize: "22px" }} />
          </div>
          {showSubMenu && (
            <div className="sub-menu-mobi flex justify-center pt-4">
              <ul className="lg:hidden">
                <li className="flex items-center pb-4 hover-bold">
                <img
                    style={{ width: "40px"}}
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
                <li className="flex items-center pb-4 hover-bold">
                <img
                  style={{ width: "40px" }}
                  src="/image/graffiti.gif"
                  alt=""
                  className="pr-2"
                />
                  <a
                    href="/login_supplier_staff"
                    className="font-bold text-decoration-none text-accent"
                  >
                     Login With Staff
                  </a>
                </li>
                <li className="flex items-center pb-4 hover-bold">
                <img
                        style={{ width: "40px" }}
                        src="/image/join.gif"
                        alt=""
                        className="pr-2 w-7 h-6"
                      />
                  <Link
                    href="login_supplier"
                    className="font-bold text-decoration-none text-accent"
                  >
                    Log In
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavbarRegisterSupplier;
