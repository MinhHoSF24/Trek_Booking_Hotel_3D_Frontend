"use client";
import React, { useEffect, useState } from "react";
import "../../../../public/css/voucher.css";
import { Oval } from "react-loader-spinner"; // Import spinner
import useSWR from "swr";
import voucherWalletService from "@/app/services/voucherWalletService";
import paymentWalletService from "@/app/services/paymentWalletService";
const PaymentWallet = () => {
  const { data: paymentWalletList, error } = useSWR("paymentWalletList", () =>
    paymentWalletService.getPaymentInforByUserId()
  );

  if (!paymentWalletList) {
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

  if (error) {
    return <div>Error loading voucher wallet</div>;
  }
  return (
    <div className="pt-40">
      <div className="payment-wallet">
        <h3>Payment wallet</h3>
      </div>
      <div className="backgr-home ">
        <div className="voucher p-6">
          {paymentWalletList.length > 0 ? (
            paymentWalletList.map((item, index) => (
              <div className="flex justify-center pb-4" key={index}>
                <div className="border-wallet flex justify-between font-semibold">
                  <div>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      Payment Method: {item.paymentMethod}{" "}
                      <svg
                        style={{ width: "40px", marginLeft: "10px" }}
                        xmlns="http://www.w3.org/2000/svg"
                        enable-background="new 0 0 48 48"
                        viewBox="0 0 48 48"
                        id="visa"
                      >
                        <polygon
                          fill="#1565c0"
                          points="17.202 32.269 21.087 32.269 23.584 16.732 19.422 16.732"
                        ></polygon>
                        <path
                          fill="#1565c0"
                          d="M13.873 16.454l-3.607 11.098-.681-3.126c-1.942-4.717-5.272-6.659-5.272-6.659l3.456 14.224h4.162l5.827-15.538H13.873zM44.948 16.454h-4.162l-6.382 15.538h3.884l.832-2.22h4.994l.555 2.22H48L44.948 16.454zM39.954 26.997l2.22-5.826 1.11 5.826H39.954zM28.855 20.893c0-.832.555-1.665 2.497-1.665 1.387 0 2.775 1.11 2.775 1.11l.832-3.329c0 0-1.942-.832-3.607-.832-4.162 0-6.104 2.22-6.104 4.717 0 4.994 5.549 4.162 5.549 6.659 0 .555-.277 1.387-2.497 1.387s-3.884-.832-3.884-.832l-.555 3.329c0 0 1.387.832 4.162.832 2.497.277 6.382-1.942 6.382-5.272C34.405 23.113 28.855 22.836 28.855 20.893z"
                        ></path>
                        <path
                          fill="#ff9800"
                          d="M9.711,25.055l-1.387-6.936c0,0-0.555-1.387-2.22-1.387c-1.665,0-6.104,0-6.104,0
      S8.046,19.229,9.711,25.055z"
                        ></path>
                      </svg>
                    </p>

                    <p className="mb-0">Total Price: {item.totalPrice} $</p>
                  </div>
                  <div>
                    <p className="pb-repon">
                      Paid Date: {new Date(item.paidDate).toLocaleDateString()}{" "}
{new Date(item.paidDate).toLocaleTimeString()}
                    </p>
                    <p className="mb-0">Cart Number: {item.cartNumber}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="not-found-form flex justify-center items-center h-full">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">
                  No Payments Wallet Found
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentWallet;