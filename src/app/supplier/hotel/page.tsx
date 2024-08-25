/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import hotelService from "@/app/services/hotelService";
import Link from "next/link";
import CreateHotel from "@/app/components/Hotel/CreateHotel";
import { Button } from "react-bootstrap";
import UpdateHotel from "@/app/components/Hotel/UpdateHotel";
import DetailHotel from "@/app/components/Hotel/DetailHotel";
import { toast } from "react-toastify";
import HotelAvatar from "@/app/components/Hotel/HotelAvatar";
import { ref, deleteObject } from "firebase/storage";
import { analytics } from "../../../../public/firebase/firebase-config";
import Cookies from "js-cookie";

const HotelListOfSupplier = () => {
  const [role, setRole] = useState<string>("");
  useEffect(() => {
    const roleName = Cookies.get("roleName") || ""; // Thêm giá trị mặc định là chuỗi rỗng nếu roleName là undefined
    setRole(roleName);
  }, []);
  const [hotelList, setHotelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredHotelList, setFilteredHotelList] = useState([]);
  const [showHotelCreate, setShowHotelCreate] = useState<boolean>(false);
  const [showHotelUpdate, setShowHotelUpdate] = useState<boolean>(false);
  const [showHotelDetail, setShowHotelDetail] = useState<boolean>(false);
  const [showHotelAvatar, setShowHotelAvatar] = useState<boolean>(false);
  const [showNoti, setShowNoti] = useState<boolean>(false);
  const [HotelId, setHotelId] = useState(0);
  const [Hotel, setHotel] = useState<IHotel | null>(null);
  const [oldAvatarUrl, setOldAvatarUrl] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelPerPage] = useState(5);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedHotel, setSelectedHotel] = useState<IHotel | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<{
    [key: number]: boolean;
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);

  const handleImageError = (hotelId: number) => {
    setImageLoadErrors((prevErrors) => ({ ...prevErrors, [hotelId]: true }));
  };
  const handleImageClick = (hotel: IHotel) => {
    setSelectedHotel(hotel);
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedHotel(null);
  };

  const handleLockUnlockHotel = async (hotelId: number, lock: boolean) => {
    setLoadingPage(true);
    try {
      let response;
      if (!lock) {
        response = await hotelService.deleteHotel(hotelId);
      } else {
        response = await hotelService.recoverHotelDeleted(hotelId);
      }
      if (response) {
        setShowPopup(false);
        await hotelService.getHotelsBySuppierId().then((data: any) => {
          setHotelList(data);
          setFilteredHotelList(data);
          setLoading(false);
        });
        toast.success(`Hotel ${lock ? "unlocked" : "locked"} successfully`);
      } else {
        throw new Error(`Failed to ${lock ? "lock" : "unlock"} hotel`);
      }
    } catch (error) {
      console.error(`Error ${lock ? "locking" : "unlocking"} hotel:`, error);
      toast.error(`Failed to ${lock ? "lock" : "unlock"} hotel`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hotelService
      .getHotelsBySuppierId()
      .then((data: any) => {
        setHotelList(data);
        setFilteredHotelList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hotel list:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleHotelAvatar = async () => {
    setShowHotelAvatar(false);

    hotelService
      .getHotelsBySuppierId()
      .then(async (data: any) => {
        setHotelList(data);
        setFilteredHotelList(data);
        setLoading(false);
        await handleDeleteHotelAvatar(oldAvatarUrl);
      })
      .catch((error) => {
        console.error("Error fetching hotel list:", error);
        setError(error);
        setLoading(false);
      });
  };

  //reload sau khi add
  const handleCreateHotel = async () => {
    setShowHotelCreate(false);

    hotelService
      .getHotelsBySuppierId()
      .then((data: any) => {
        setHotelList(data);
        setFilteredHotelList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hotel list:", error);
        setError(error);
        setLoading(false);
      });
  };
  const handleUpdateHotel = async () => {
    setShowHotelUpdate(false);
    hotelService
      .getHotelsBySuppierId()
      .then((data: any) => {
        setHotelList(data);
        setFilteredHotelList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hotel list:", error);
        setError(error);
        setLoading(false);
      });
  };

  //delete image from firebase
  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      const storageRef = ref(analytics, imageUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Error deleting image from Firebase Storage:", error);
    }
  };
  //Delete Hotel avatar in cloud storage after update new avatar
  const handleDeleteHotelAvatar = async (imageUrl: string) => {
    try {
      await deleteImageFromStorage(imageUrl);
    } catch (error) {
      console.error("Error deleting room image:", error);
      alert("Failed to delete room image");
    }
  };

  //Delete
  const handleDeleteHotel = async (hotelId: number) => {
    try {
      await hotelService.deleteHotel(hotelId);
      // Load lại dữ liệu từ API

      hotelService
        .getHotelsBySuppierId()
        .then((data: any) => {
          setHotelList(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching hotel list:", error);
          setError(error);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error deleting hotel:", error);
      alert("Failed to delete hotel");
    }
  };
  useEffect(() => {
    const filteredHotels = hotelList.filter((hotel: IHotel) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        hotel.hotelName?.toLowerCase().includes(lowerCaseQuery) ||
        hotel.hotelId?.toString().toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredHotelList(filteredHotels);
    setCurrentPage(1); // Reset to the first page when search query changes
  }, [searchQuery, hotelList]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading hotels</div>;
  }

  const indexOfLastHotel = currentPage * hotelPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelPerPage;
  const currentHotel = filteredHotelList.slice(
    indexOfFirstHotel,
    indexOfLastHotel
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredHotelList.length / hotelPerPage);
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
      <div className="search-add ">
        <div className="search-hotel flex">
          <input
            type="text"
            placeholder="Search........."
            className="input-hotel pl-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img src="/image/search.png" alt="" />
        </div>
        {role === "supplier" ? (
          <button
            className="ml-8 button-add relative z-10"
            onClick={() => setShowHotelCreate(true)}
          >
            + Add hotel
          </button>
        ) : (
          <div></div>
        )}
      </div>
      <div className="table-hotel pt-8">
        <div className="flex flex-col overflow-x-auto">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-start text-sm font-light text-surface dark:text-white border-solid">
                  <thead className="border-b border-neutral-200 font-medium dark:border-white/10 bk-top-table">
                    <tr className="text-center">
                      <th scope="col" className="px-6 py-4">
                        HotelId
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Avatar
                      </th>
                      {/* <th scope="col" className="px-6 py-4">
                        Isverify
                      </th> */}
                      <th scope="col" className="px-6 py-4">
                        Manage Hotel Image
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Manage Voucher
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Manage Room
                      </th>
                      <th scope="col" className="px-6 py-4">
                        View Detail
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Manage Comment
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Manage Rate
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Status
                      </th>
                      {role === "supplier" ? (
                        <th scope="col" className="px-6 py-4">
                          Action
                        </th>
                      ) : (
                        <div></div>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentHotel.length > 0 ? (
                      currentHotel.map((item: IHotel, index) => (
                        <tr
                          key={index}
                          className="text-center border-b border-neutral-200 dark:border-white/10"
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium text-black">
                            {item.hotelId}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold text-black">
                            {item.hotelName}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 w-0 h-0">
                            <Link href="#" className="flex justify-center">
                              {imageLoadErrors[item.hotelId] ? (
                                <div
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setOldAvatarUrl(item.hotelAvatar);
                                    setHotelId(item.hotelId);
                                    setShowHotelAvatar(true);
                                  }}
                                >
                                  Upload Avatar
                                </div>
                              ) : (
                                <img
                                  src={item.hotelAvatar}
                                  alt="Avatar"
                                  className="cursor-pointer rounded-full"
                                  style={{ width: "60px", height: "50px" }}
                                  onClick={() => {
                                    setOldAvatarUrl(item.hotelAvatar);
                                    setHotelId(item.hotelId);
                                    setShowHotelAvatar(true);
                                  }}
                                  onError={() => handleImageError(item.hotelId)}
                                />
                              )}
                            </Link>
                          </td>
                          {/* <td
                            className={`whitespace-nowrap px-6 py-4 ${
                              item.isVerify ? "color-active" : "color-stop"
                            }`}
                          >
                            {item.isVerify ? "Active" : "Stopped"}
                          </td> */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <Link
                              className="flex justify-center"
                              href={`/supplier/hotel/hotelImage/${item.hotelId}`}
                            >
                              <img
                                src="/image/managevoucher.png"
                                alt="Manage Hotel Image"
                              />
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <Link
                              className="flex justify-center"
                              href={`/supplier/hotel/voucher/${item.hotelId}`}
                            >
                              <img
                                src="/image/managevoucher.png"
                                alt="Manage Voucher"
                              />
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <Link
                              className="flex justify-center"
                              href={`/supplier/hotel/room/${item.hotelId}`}
                            >
                              <img
                                src="/image/managevoucher.png"
                                alt="Manage Room"
                              />
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <Link className="flex justify-center" href="#">
                              <img
                                className="w-7 h-7 cursor-pointer"
                                src="/image/viewdetail.png"
                                alt="View Detail"
                                onClick={() => {
                                  setHotel(item);
                                  setShowHotelDetail(true);
                                }}
                              />
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <Link
                              className="flex justify-center"
                              href={`/supplier/hotel/comment/${item.hotelId}`}
                            >
                              <img
                                src="/image/managevoucher.png"
                                alt="Manage Comment"
                              />
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <Link
                              className="flex justify-center"
                              href={`/supplier/hotel/rate/${item.hotelId}`}
                            >
                              <img
                                src="/image/managevoucher.png"
                                alt="Manage Rate"
                              />
                            </Link>
                          </td>
                          <td
                            className={`whitespace-nowrap px-6 py-4 ${
                              item.lock ? "color-stop" : "color-active"
                            }`}
                          >
                            {item.lock ? "Stopped" : "Active"}
                          </td>
                          {role === "supplier" ? (
                            <td className="whitespace-nowrap px-6 py-4 ">
                              <Link href="#" className="flex">
                                <img
                                  className="w-10 h-5 cursor-pointer"
                                  src="/image/pen.png"
                                  alt="Edit"
                                  onClick={() => {
                                    setHotelId(item.hotelId);
                                    setHotel(item);
                                    setShowHotelUpdate(true);
                                  }}
                                />

                                <img
                                  className="w-5 h-5 cursor-pointer ml-3"
                                  onClick={() => handleImageClick(item)}
                                  src={
                                    item.lock
                                      ? "/image/lock.png"
                                      : "/image/unlock.png"
                                  }
                                  alt={item.lock ? "Ban" : "Unban"}
                                />
                              </Link>
                              {showPopup &&
                                selectedHotel?.hotelId === item.hotelId && (
                                  <div className="fixed inset-0 z-50 flex items-center justify-center">
                                    <div
                                      className="fixed inset-0 bg-black opacity-50"
                                      onClick={handleClosePopup}
                                    ></div>
                                    <div className="relative bg-white p-8 rounded-lg">
                                      <p className="color-black font-bold text-2xl">
                                        Do you want to{" "}
                                        {item.lock ? "unlock" : "lock"} this{" "}
                                        {item.hotelName}?
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
                                            handleLockUnlockHotel(
                                              item.hotelId,
                                              item.lock
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
                          ) : (
                            <div></div>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-4 text-red-600 font-bold"
                        >
                          No hotels found
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateHotel
        showHotelCreate={showHotelCreate}
        setShowHotelCreate={setShowHotelCreate}
        onCreate={handleCreateHotel} // Thêm callback để xử lý sau khi tạo
      />
      <UpdateHotel
        showHotelUpdate={showHotelUpdate}
        setShowHotelUpdate={setShowHotelUpdate}
        onUpdate={handleUpdateHotel} // Thêm callback để xử lý sau khi tạo
        ThishotelId={HotelId}
        hotel={Hotel}
        setHotel={setHotel}
      />

      <HotelAvatar
        showHotelAvatar={showHotelAvatar}
        setShowHotelAvatar={setShowHotelAvatar}
        onUpdate={handleHotelAvatar} // Thêm callback để xử lý sau khi tạo
        hotelId={HotelId}
      />
      <DetailHotel
        showHotelDetail={showHotelDetail}
        setShowHotelDetail={setShowHotelDetail}
        hotel={Hotel}
        setHotel={setHotel}
      />
    </div>
  );
};

export default HotelListOfSupplier;
