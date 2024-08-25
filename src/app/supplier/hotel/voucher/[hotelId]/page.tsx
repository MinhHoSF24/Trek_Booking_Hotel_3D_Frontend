/* eslint-disable @next/next/no-img-element */
// pages/voucher/[hotelId].tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import hotelService from "@/app/services/hotelService";
import voucherService from "@/app/services/voucherService";
import CreateVoucher from "@/app/components/Voucher/CreateVoucher";
import UpdateVoucher from "@/app/components/Voucher/UpdateVoucher";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import "../../../../../../public/css/voucher.css";
import "../../../../../../public/css/room.css";
const ListVoucher = ({ params }: { params: { hotelId: string } }) => {
  const [showVoucherCreate, setShowVoucherCreate] = useState<boolean>(false);
  const [showVoucherUpdate, setShowVoucherUpdate] = useState<boolean>(false);
  const [VoucherId, setVoucherId] = useState(0);

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null);
  const [loading, setLoading] = useState(false);

  const [Voucher, setVoucher] = useState<IVoucher | null>(null);
  const [hotel, setHotel] = useState<IHotel | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [voucherPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: listVoucher = [], error } = useSWR("listVoucher", () =>
    voucherService.getVouchersByHotelId(Number(params.hotelId))
  );
  const [filteredVoucherList, setFilteredVoucherList] =
    useState<IVoucher[]>(listVoucher);
  const handleImageClick = (voucher: IVoucher) => {
    setSelectedVoucher(voucher);
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedVoucher(null);
  };

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const hotelData = await hotelService.getHotelById(
          Number(params.hotelId)
        );
        setHotel(hotelData);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };

    fetchHotel();
  }, [params.hotelId]);

  const handleLockVoucher = async (
    voucherId: number,
    voucherStatus: boolean
  ) => {
    setLoading(true);
    try {
      let response;
      if (voucherStatus) {
        response = await voucherService.deleteVoucher(voucherId);
      }
      if (response) {
        setShowPopup(false);
        await mutate(
          "listVoucher",
          voucherService.getVouchersByHotelId(Number(params.hotelId)),
          true
        );
        toast.success("Voucher locked successfully");
      } else {
        throw new Error(`Failed to lock voucher`);
      }
    } catch (error) {
      console.error(`Error lock voucher:`, error);
      toast.error(`Failed to lock voucher`);
    } finally {
      setLoading(false);
    }
  };

  const checkAndUpdateVoucherStatus = async () => {
const currentDate = new Date();

    if (listVoucher) {
      for (let voucher of listVoucher) {
        const expireDateObj = new Date(voucher.expireDate);

        if (expireDateObj < currentDate && voucher.voucherStatus) {
          voucher.voucherStatus = false;
          await voucherService.updateVoucher(voucher);
          mutate("listVoucher");
        }
      }
    }
  };

  useEffect(() => {
    if (listVoucher && listVoucher.length > 0) {
      checkAndUpdateVoucherStatus();
    }
  }, [listVoucher]);
  useEffect(() => {
    if (listVoucher) {
      const filteredVouchers = listVoucher.filter((voucher: IVoucher) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          voucher.voucherCode?.toLowerCase().includes(lowerCaseQuery) ||
          voucher.voucherId?.toString().toLowerCase().includes(lowerCaseQuery)
        );
      });
      setFilteredVoucherList(filteredVouchers);
      setCurrentPage(1);
    }
  }, [searchQuery, listVoucher]);
  if (!listVoucher) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading vouchers</div>;
  }

  // Sort vouchers: first by voucherStatus (true first), then by voucherId (newest first)
  const sortedVouchers = listVoucher.sort((a:any, b:any) => {
    if (a.voucherStatus === b.voucherStatus) {
      return b.voucherId - a.voucherId;
    }
    return a.voucherStatus ? -1 : 1;
  });

  const indexOfLastVC = currentPage * voucherPerPage;
  const indexOfFirstVC = indexOfLastVC - voucherPerPage;
  const currentVoucher = filteredVoucherList.slice(indexOfFirstVC, indexOfLastVC);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredVoucherList.length / voucherPerPage);
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="relative">
      <div className="search-add">
        <div className="search-hotel flex">
          {hotel && (
            <div className="fix-name">
              <Link
                href="/supplier/hotel"
                style={{ color: "black", fontSize: "18px" }}
              >
                Hotel
              </Link>
              <span
                style={{
                  color: "black",
                  fontSize: "18px",
                  marginLeft: "5px",
                  marginRight: "5px",
                }}
              >
                {" > "}
              </span>
              <Link
                href={`/supplier/hotel/room/${params.hotelId}`}
                style={{ color: "#4c7cab", fontSize: "18px" }}
              >
                {hotel.hotelName}
              </Link>
            </div>
          )}
          <input
            type="text"
            placeholder="Search........."
            className="input-hotel pl-3"
value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img src="/image/search.png" alt="" />
        </div>
        <button
          className="ml-8 button-add relative z-10"
          onClick={() => setShowVoucherCreate(true)}
        >
          + Add voucher
        </button>
      </div>

      <div className="table-hotel pt-8">
        <div className="flex flex-col overflow-x-auto">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-start text-sm font-light text-surface dark:text-white border-solid">
                  <thead className="border-b border-neutral-200 font-medium dark:border-white/10 bk-top-table">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-center">
                        VoucherId
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Voucher Code
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Available Date
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Expire Date
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Voucher Quantity
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Discount Percent
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Voucher Status
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentVoucher.length > 0 ? (
                      currentVoucher.map((item: IVoucher, index) => {
                        const availableDate = new Date(item.availableDate);
                        const formattedAvailableDate =
                          availableDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });

                        const expireDate = new Date(item.expireDate);
                        const formattedExpireDate =
                          expireDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });

                        return (
                          <tr
                            key={index}
className="border-b border-neutral-200 dark:border-white/10 text-center"
                          >
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-black">
                              {item.voucherId}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold text-black">
                              {item.voucherCode}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold text-black">
                              {formattedAvailableDate}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold text-black">
                              {formattedExpireDate}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold text-black">
                              {item.voucherQuantity}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold text-black">
                              {item.discountPercent}
                            </td>
                            <td
                              className={`whitespace-nowrap px-6 py-4 ${
                                item.voucherStatus
                                  ? "color-active"
                                  : "color-stop"
                              }`}
                            >
                              {item.voucherStatus ? "Active" : "Stopped"}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 flex">
                              {item.voucherStatus && (
                                <>
                                  <Link href="#">
                                    <img
                                      className="w-5 h-5 cursor-pointer"
                                      src="/image/pen.png"
                                      alt="Edit"
                                      onClick={() => {
                                        setVoucherId(item.voucherId);
                                        setVoucher(item);
                                        setShowVoucherUpdate(true);
                                      }}
                                    />
                                  </Link>
                                  <img
                                    className="w-5 h-5 cursor-pointer ml-3"
                                    src="/image/lock.png"
                                    alt="Delete"
                                    onClick={() => handleImageClick(item)}
                                  />
                                </>
                              )}

                              {showPopup &&
                                selectedVoucher?.voucherId ===
item.voucherId && (
                                  <div className="fixed inset-0 z-10 flex items-center justify-center">
                                    <div
                                      className="fixed inset-0 bg-black opacity-50"
                                      onClick={handleClosePopup}
                                    ></div>
                                    <div className="relative bg-white p-8 rounded-lg">
                                      <p className="color-black font-bold text-2xl">
                                        Do you want to lock this{" "}
                                        {item.voucherCode}?
                                      </p>
                                      <div className="button-kichhoat pt-4">
                                        <Button
                                          className="button-exit mr-2"
                                          onClick={handleClosePopup}
                                          style={{
                                            background: "white",
                                            color: "black",
                                            border: "1px solid #ccc",
                                          }}
                                        >
                                          Exit
                                        </Button>
                                        <Button
                                          className="button-yes"
                                          onClick={() =>
                                            handleLockVoucher(
                                              item.voucherId,
                                              item.voucherStatus
                                            )
                                          }
                                          style={{
                                            background: "#305A61",
                                            border: "1px solid #ccc",
                                          }}
                                        >
                                          Yes
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-4 text-red-600 font-bold"
                        >
                          No vouchers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="pagination mt-4 flex justify-between items-center font-semibold">
<div>
                    <span className="ml-8">
                      {currentPage} of {totalPages}
                    </span>
                  </div>
                  <div className="flex items-center mr-8">
                    <img
                      className="w-3 h-3 cursor-pointer"
                      src="/image/left.png"
                      alt="Previous"
                      onClick={handlePrevPage}
                    />
                    {Array.from({ length: totalPages }, (_, index) => (
                      <p
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`mb-0 mx-2 cursor-pointer ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                      >
                        {index + 1}
                      </p>
                    ))}
                    <img
                      className="w-3 h-3 cursor-pointer"
                      src="/image/right2.png"
                      alt="Next"
                      onClick={handleNextPage}
                    />
                  </div>
                </div>
                <CreateVoucher
                  showVoucherCreate={showVoucherCreate}
                  setShowVoucherCreate={setShowVoucherCreate}
                  hotelId={params.hotelId}
                />

                <UpdateVoucher
                  showVoucherUpdate={showVoucherUpdate}
                  setShowVoucherUpdate={setShowVoucherUpdate}
                  hotelId={params.hotelId}
                  voucher={Voucher}
                  setVoucher={setVoucher}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListVoucher;