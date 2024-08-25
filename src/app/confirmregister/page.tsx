/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "../../../node_modules/next/link";
import "../../../public/css/authen.css";
const Page = () => {
  return (
    <div>
      <div className="confirm-register backgr-home">
        <div className="container pt-12 pb-12">
          <div className="row">
            <div className="col-lg-7 col-md-7 col-12 font-bold">
              <h2 className="font-bold">Post any accommodationon </h2>
              <h2 className="font-bold ">
                on <span className="color-primary">Trek Booking</span>
              </h2>
              <p className="text-2xl font-bold pt-3">
                Whether your accommodation business is a part-time job or a
                full-time job, dont forget to register your vacation home on
                Trek Booking to reach travelers around the world.
              </p>
            </div>
            <div className="col-lg-5 col-md-5 col-12 fix-repon-authen">
              <div className="border-start-register w-3/4">
                <p className="font-bold text-2xl pb-2">
                  Increase your income with a steady stream of orders
                </p>
                <div className="check-text flex items-baseline pb-3">
                  <img className="w-2 h-2" src="/image/check1.png" alt="" />
                  <p className="mb-0 ml-2 text-base line-height-16">
                    45% of partners receive their first order within 1 week
                  </p>
                </div>
                <div className="check-text flex items-baseline  pb-3">
                  <img className="w-2 h-2" src="/image/check1.png" alt="" />
                  <p className="mb-0 ml-2 text-base line-height-16">
                    More than 1.1 billion guests have stayed at vacation homes
                    since 2010
                  </p>
                </div>
                <div className="check-text flex items-baseline  pb-3">
                  <img className="w-2 h-2" src="/image/check1.png" alt="" />
                  <p className="mb-0 ml-2 text-base line-height-16">
                    Full control over your property and finances
                  </p>
                </div>
                <div className="check-text flex items-baseline  pb-3">
                  <img className="w-2 h-2" src="/image/check1.png" alt="" />
                  <p className="mb-0 ml-2 text-base line-height-16">
                    Signing up is free and only takes 15 minutes
                  </p>
                </div>

                <Link className="let-start pt-4" href="signup_supplier">
                  <button className="btn-start-register">Lets start</button>
                  <img className="right-but" src="/image/right.png" alt="" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="container image-authen overflow-x-hidden pb-8">
          <div className="row justify-around">
            <div className="col-6 image-intro-gis">
              <img src="/image/confirm1.png" className="w-full" style={{borderRadius: "10px", height: "400px"}} alt="" />
            </div>
            <div className="col-6 image-intro-gis">
              <img src="/image/confirm2.png" className="w-full" style={{borderRadius: "10px", height: "195px"}} alt="" />
              <img className="mt-2 w-full"   style={{borderRadius: "10px", height: "195px"}} src="/image/confirm3.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
