"use client";
import React, { useEffect, useState } from "react";
import tourService from "@/app/services/tourService";
import roomImageService from "@/app/services/roomImageService";
import { ref, deleteObject } from "firebase/storage";
import { analytics } from "../../../../../../../../public/firebase/firebase-config";
import roomService from "@/app/services/roomService";
import CreateRoomImage from "@/app/components/RoomImages/CreateRoomImage";
import hotelService from "@/app/services/hotelService";
import '../../../../../../../../public/css/room.css'
import { toast } from "react-toastify";
import "../../../../../../../../public/css/tour.css";
import Link from "next/link";

const ListRoomImage = ({ params }: { params: { hotelId: string, roomId: string } }) => {
  const [showRoomImageCreate, setShowRoomImageCreate] = useState<boolean>(false);
  const [listRoomImage, setRoomImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomId, setRoomId] = useState(0);
  const [room, setRoom] = useState<IRoom | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImageRoomId, setSelectedImageRoomId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomImagePerPage] = useState(3);
  const [hotel, setHotel] = useState<IHotel | null>(null);

  const handleImageClick = (roomImageId: number) => {
    setSelectedImageRoomId(roomImageId);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedImageRoomId(null);
  };

  const handleCreateRoomImage = async () => {
    setShowRoomImageCreate(false);
    if (params.roomId) {
      roomImageService
        .getRoomImageByRoomId(Number(params.roomId))
        .then((data: any) => {
          setRoomImage(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching room images:", error);
          setError(error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    const fetchHotelandRoom = async () => {
      try {
        const hotelData = await hotelService.getHotelById(Number(params.hotelId));
        setHotel(hotelData);

        const roomData = await roomService.getRoomById(Number(params.roomId));
        setRoom(roomData);
      } catch (error) {
        console.error("Error fetching hotel and room details:", error);
      }
    };

    fetchHotelandRoom();
  }, [params.hotelId, params.roomId]);

  useEffect(() => {
    if (params.roomId) {
        roomImageService
          .getRoomImageByRoomId(Number(params.roomId))
          .then((data: any) => {
            setRoomImage(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching room images:", error);
            setError(error);
            setLoading(false);
          });
      }
  }, [params.roomId]);



  const deleteImageButtonHandler = (roomImageId: number, imageUrl: string) => {
    handleDeleteRoomImage(roomImageId, imageUrl);
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

  const handleDeleteRoomImage = async (roomImageId: number, imageUrl: string) => {
    try {
      await deleteImageFromStorage(imageUrl);
      await roomImageService.deleteRoomImage(roomImageId);

      if (params.roomId) {
        roomImageService
          .getRoomImageByRoomId(Number(params.roomId))
          .then((data: any) => {
            setRoomImage(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching room images:", error);
            setError(error);
            setLoading(false);
          });
      }

      toast.success("Delete Image Successful");
    } catch (error) {
      console.error("Error deleting room image:", error);
      alert("Failed to delete room image");
    }
  };

  const handleAddImage = () => {
    if (listRoomImage.length >= 7) {
      toast.error("You can only add up to 7 images for this tour.");
      return;
    }
    setRoomId(Number(params.roomId));
    setShowRoomImageCreate(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading room images</div>;
  }

  const indexOfLastRoomImage = currentPage * roomImagePerPage;
  const indexOfFirstRoomImage = indexOfLastRoomImage - roomImagePerPage;
  const currentRoomImage = listRoomImage.slice(indexOfFirstRoomImage, indexOfLastRoomImage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(listRoomImage.length / roomImagePerPage);

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
      {hotel && room && (
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
                style={{ color: "black", fontSize: "18px" }}
              >
                {hotel.hotelName}
              </Link>
              {/* <span
                style={{
                  color: "black",
                  fontSize: "18px",
                  marginLeft: "5px",
                  marginRight: "5px",
                }}
              >
                {" > "}
              </span> */}
              {/* <span style={{ color: "#4c7cab", fontSize: "18px" }}>
                {room.roomName}
              </span> */}
            </div>
          )}
        <div className="search-hotel flex">
          <input type="text" placeholder="Search........." className="input-hotel pl-3" />
          <img src="/image/search.png" alt="" />
        </div>
        <button className="ml-8 button-add relative z-10" onClick={handleAddImage}>
          + Add Room Image
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
                      <th scope="col" className="px-6 py-4">RoomImageId</th>
                      <th scope="col" className="px-6 py-4 text-center">RoomImageURL</th>
                      <th scope="col" className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRoomImage.length > 0 ? (
                      currentRoomImage.map((item: IRoomImage, index) => (
                        <tr key={index} className="border-b border-neutral-200 dark:border-white/10 text-center">
                          <td className="whitespace-nowrap px-6 py-4 font-medium">{item.roomImageId}</td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold flex justify-center">
                            <img className="w-[150px] h-[60px]" src={item.roomImageURL ? item.roomImageURL : "/image/imagedefault.png"} alt="" onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = "/image/imagedefault.png";
                            }} />
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex justify-center">
                              <img className="w-7 h-7 cursor-pointer ml-3" src="/image/bag.png" alt="Delete" onClick={() => handleImageClick(item.roomImageId)} />
                              {showPopup && selectedImageRoomId === item.roomImageId && (
                                <div className="fixed inset-0 z-10 flex items-center justify-center">
                                  <div className="fixed inset-0 bg-black opacity-5" onClick={handleClosePopup}></div>
                                  <div className="relative bg-white p-8 rounded-lg">
                                    <p className="color-black font-bold text-2xl">Do you want to delete Room Image 3D Id: {item.roomImageId}?</p>
                                    <div className="button-kichhoat pt-4">
                                      <button className="button-exit mr-2" onClick={handleClosePopup}>Exit</button>
                                      <button className="button-yes cursor-pointer" onClick={() => deleteImageButtonHandler(item.roomImageId, item.roomImageURL)}>Yes</button>
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
                        <td colSpan={8} className="text-center py-4 text-red-600 font-bold">No RoomImage found</td>
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
      <CreateRoomImage showRoomImageCreate={showRoomImageCreate} setShowRoomImageCreate={setShowRoomImageCreate} onCreate={handleCreateRoomImage} roomId={roomId} listRoomImage={listRoomImage.length} />
    </div>
  );
};

export default ListRoomImage;
