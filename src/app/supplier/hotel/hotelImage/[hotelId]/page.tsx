/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { toast } from "react-toastify";
import "../../../../../../public/css/room.css";
import Link from "next/link";
import { analytics } from "../../../../../../public/firebase/firebase-config";
import hotelImageService from "@/app/services/hotelImageService";
import hotelService from "@/app/services/hotelService";
import CreateHotelImage from "@/app/components/HotelImage/CreateHotelImage";

const ListHotelImage = ({ params }: { params: { hotelId: string } }) => {
  const [showHotelImageCreate, setShowHotelImageCreate] = useState<boolean>(false);
  const [listHotelImage, setHotelImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotelId, setHotelId] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImageHotelId, setSelectedImageHotelId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelImagePerPage] = useState(3);
  const [hotel, setHotel] = useState<IHotel | null>(null);

  const handleImageClick = (hotelImageId: number) => {
    setSelectedImageHotelId(hotelImageId);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedImageHotelId(null);
  };

  const handleCreateHotelImage = async () => {
    setShowHotelImageCreate(false);
    if (params.hotelId) {
      hotelImageService
        .getHotelImageByHotelId(Number(params.hotelId))
        .then((data: any) => {
          setHotelImage(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching hotel images:", error);
          setError(error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const hotelData = await hotelService.getHotelById(Number(params.hotelId));
        setHotel(hotelData);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };

    fetchHotel();
  }, [params.hotelId]);

  useEffect(() => {
    if (params.hotelId) {
        hotelImageService
          .getHotelImageByHotelId(Number(params.hotelId))
          .then((data: any) => {
            setHotelImage(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching hotel images:", error);
            setError(error);
            setLoading(false);
          });
      }
  }, [params.hotelId]);



  const deleteImageButtonHandler = (hotelImageId: number, imageUrl: string) => {
    handleDeleteHotelImage(hotelImageId, imageUrl);
    setShowPopup(false);
  };

  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      const storageRef = ref(analytics, imageUrl);
await deleteObject(storageRef);
    } catch (error) {
      console.error("Error deleting image from Firebase Storage:", error);
    }
  };

  const handleDeleteHotelImage = async (hotelImageId: number, imageUrl: string) => {
    try {
      await deleteImageFromStorage(imageUrl);
      await hotelImageService.deleteHotelImage(hotelImageId);

      if (params.hotelId) {
        hotelImageService
          .getHotelImageByHotelId(Number(params.hotelId))
          .then((data: any) => {
            setHotelImage(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching hotel images:", error);
            setError(error);
            setLoading(false);
          });
      }

      toast.success("Delete Image Successful");
    } catch (error) {
      console.error("Error deleting hotel image:", error);
      alert("Failed to delete hotel image");
    }
  };

  const handleAddImage = () => {
    if (listHotelImage.length >= 4) {
      toast.error("You can only add up to 4 images for this hotel.");
      return;
    }
    setHotelId(Number(params.hotelId));
    setShowHotelImageCreate(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading hotel images</div>;
  }

  const indexOfLastHotelImage = currentPage * hotelImagePerPage;
  const indexOfFirstHotelImage = indexOfLastHotelImage - hotelImagePerPage;
  const currentHotelImage = listHotelImage.slice(indexOfFirstHotelImage, indexOfLastHotelImage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(listHotelImage.length / hotelImagePerPage);

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
        <div className="search-hotel flex">
          <input type="text" placeholder="Search........." className="input-hotel pl-3" />
          <img src="/image/search.png" alt="" />
        </div>
<button className="ml-8 button-add relative z-10" onClick={handleAddImage}>
          + Add Hotel Image
        </button>
      </div>
      <div className="table-hotel pt-8">
        <div className="flex flex-col overflow-x-auto">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-start text-sm font-light text-surface dark:text-white border-solid">
                  <thead className="border-b border-neutral-200 font-medium dark:border-white/10 bk-top-table">
                    <tr className="text-center">
                      <th scope="col" className="px-6 py-4">HotelImageId</th>
                      <th scope="col" className="px-6 py-4 text-center">HotelImageURL</th>
                      <th scope="col" className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentHotelImage.length > 0 ? (
                      currentHotelImage.map((item: IHotelImage, index) => (
                        <tr key={index} className="border-b border-neutral-200 dark:border-white/10 text-center">
                          <td className="whitespace-nowrap px-6 py-4 font-medium">{item.hotelImageId}</td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold flex justify-center">
                            <img className="w-[150px] h-[60px]" src={item.hotelImageURL ? item.hotelImageURL : "/image/imagedefault.png"} alt="" onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = "/image/imagedefault.png";
                            }} />
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex justify-center">
                              <img className="w-7 h-7 cursor-pointer ml-3" src="/image/bag.png" alt="Delete" onClick={() => handleImageClick(item.hotelImageId)} />
                              {showPopup && selectedImageHotelId === item.hotelImageId && (
                                <div className="fixed inset-0 z-10 flex items-center justify-center">
                                  <div className="fixed inset-0 bg-black opacity-5" onClick={handleClosePopup}></div>
                                  <div className="relative bg-white p-8 rounded-lg">
                                    <p className="color-black font-bold text-2xl">Do you want to delete Hotel Image 3D Id: {item.hotelImageId}?</p>
                                    <div className="button-kichhoat pt-4">
                                      <button className="button-exit mr-2" onClick={handleClosePopup}>Exit</button>
<button className="button-yes cursor-pointer" onClick={() => deleteImageButtonHandler(item.hotelImageId, item.hotelImageURL)}>Yes</button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-red-600 font-bold">No HotelImage found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="pagination mt-4 flex justify-between items-center font-semibold">
                  <div>
                    <span className="ml-8">{currentPage} of {totalPages}</span>
                  </div>
                  <div className="flex items-center mr-8">
                    <img className="w-3 h-3 cursor-pointer" src="/image/left.png" alt="Previous" onClick={handlePrevPage} />
                    {Array.from({ length: totalPages }, (_, index) => (
                      <p key={index} onClick={() => paginate(index + 1)} className={`mb-0 mx-2 cursor-pointer ${currentPage === index + 1 ? 'active' : ''}`}>{index + 1}</p>
                    ))}
                    <img className="w-3 h-3 cursor-pointer" src="/image/right2.png" alt="Next" onClick={handleNextPage} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateHotelImage showHotelImageCreate={showHotelImageCreate} setShowHotelImageCreate={setShowHotelImageCreate} onCreate={handleCreateHotelImage} hotelId={hotelId} listHotelImage={listHotelImage.length} />
    </div>
  );
};

export default ListHotelImage;
