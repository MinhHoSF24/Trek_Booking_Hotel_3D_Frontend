  "use client";
import React, { useEffect, useState } from "react";
import "../../../../public/css/voucher.css";
import { Oval } from "react-loader-spinner"; // Import spinner
import useSWR from "swr";
import voucherWalletService from "@/app/services/voucherWalletService";
const VoucherWallet = () => {
  const { data: voucherWalletList, error } = useSWR("voucherWalletList", () =>
    voucherWalletService.getVoucherUsageHistoryByUserId()
  );


  if (!voucherWalletList) {
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
  }
  return (
    <div className="pt-40">
      <div className="payment-wallet ">
        <h3>Voucher wallet</h3>
      </div>
      <div className="backgr-home ">
        <div className="voucher p-6">
          {voucherWalletList.length > 0 ? (
            voucherWalletList.map((item, index) => (
              <div className="flex justify-center pb-4" key={index}>
                   {item.voucher && (
                <div className="border-wallet flex justify-between font-semibold">
             
                  <div>
                <p className="text-red-500">Voucher Code: {item.orderHotelHeader.voucherCode ? item.orderHotelHeader.voucherCode : "Do not use vouchers"}</p>
                    <p className="mb-0">
                      Discount: {item.voucher?.discountPercent} %
                    </p>
                  </div>
                  <div>
                    <p className="">
                      Used Date:{" "}
                      {new Date(item?.voucher?.availableDate).toLocaleDateString()}{" "}
                    
                    </p>
                    <p className="mb-0">
                      Process: {item.orderHotelHeader.process}
                    </p>
                  </div>
                  
                </div>
                 )}
              </div>
            ))
          ) : (
            <div className="not-found-form flex justify-center items-center h-full">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">
                  No Vouchers Wallet Found
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoucherWallet;
