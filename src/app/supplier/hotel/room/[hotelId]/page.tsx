/* eslint-disable @next/next/no-img-element */
// pages/room/[hotelId].tsx
"use client";
import React, { useEffect, useState } from "react";
import roomService from "@/app/services/roomService";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import CreateModal from "@/app/components/Room/CreateRoom";
import CreateRoom from "@/app/components/Room/CreateRoom";
import UpdateRoom from "@/app/components/Room/UpdateRoom";
import { Hotel, Room } from "@mui/icons-material";
import DetailRoom from "@/app/components/Room/DetailRoom";
import hotelService from "@/app/services/hotelService";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import "../../../../../../public/css/room.css";
const ListRoom = ({ params }: { params: { hotelId: string } }) => {
  const [showRoomCreate, setShowRoomCreate] = useState<boolean>(false);
  const [showRoomUpdate, setShowRoomUpdate] = useState<boolean>(false);
  const [showRoomDetail, setShowRoomDetail] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);

  const [loading, setLoading] = useState(false);
  const [RoomId, setRoomId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [Room, setRoom] = useState<IRoom | null>(null);
  const [hotel, setHotel] = useState<IHotel | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5);
  const { data: listRoom = [], error } = useSWR("listRoom", () =>
    roomService.getRoomsByHotelId(Number(params.hotelId))
  );
  const [filteredRoomList, setFilteredRoomList] = useState<IRoom[]>(listRoom);
  useEffect(() => {
    if (listRoom) {
      const filteredRooms = listRoom.filter((room: IRoom) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          room.roomName?.toLowerCase().includes(lowerCaseQuery) ||
          room.roomId?.toString().toLowerCase().includes(lowerCaseQuery)
        );
      });
      setFilteredRoomList(filteredRooms);
      setCurrentPage(1);
    }
  }, [searchQuery, listRoom]);

  const handleImageClick = (room: IRoom) => {
    setSelectedRoom(room);
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedRoom(null);
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

  const handleLockUnlockRoom = async (roomId: number, roomStatus: boolean) => {
    setLoading(true);
    try {
      let response;
      if (roomStatus) {
        response = await roomService.deleteRoom(roomId);
      } else {
        response = await roomService.recoverRoomDeleted(roomId);
      }
      if (response) {
        setShowPopup(false);
        await mutate(
          "listRoom",
          roomService.getRoomsByHotelId(Number(params.hotelId)),
          true
        );
        toast.success(
          `Room ${roomStatus ? "locked" : "unlocked"} successfully`
        );
      } else {
        throw new Error(`Failed to ${roomStatus ? "lock" : "unlock"} room`);
      }
    } catch (error) {
      console.error(
        `Error ${roomStatus ? "locking" : "unlocking"} room:`,
        error
      );
      toast.error(`Failed to ${roomStatus ? "lock" : "unlock"} room`);
    } finally {
      setLoading(false);
    }
  };

  if (!listRoom) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading rooms</div>;
  }
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRoomList.slice(
    indexOfFirstRoom,
    indexOfLastRoom
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredRoomList.length / roomsPerPage);

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
          onClick={() => setShowRoomCreate(true)}
        >
          + Add room
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
                      <th scope="col" className="px-6 py-4">
                        RoomId
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4">
                        View Detail
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Manage Service
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Manage Room 3D
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Manage Room Image
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRooms.length > 0 ? (
                      currentRooms.map((item: IRoom, index) => (
                        <tr
                          key={index}
                          className="border-b border-neutral-200 dark:border-white/10 text-center"
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium text-black">
                            {item.roomId}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold text-black">
                            {item.roomName}
                          </td>
                          <td
                            className={`whitespace-nowrap px-6 py-4 ${
                              item.roomStatus ? "color-active" : "color-stop"
                            }`}
                          >
                            {item.roomStatus ? "Active" : "Stopped"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <Link className="flex justify-center" href="#">
                              <img
                                className="w-7 h-7 cursor-pointer"
                                src="/image/viewdetail.png"
                                alt="View Detail"
                                onClick={() => {
                                  setRoomId(item.roomId);
                                  setRoom(item);
                                  setShowRoomDetail(true);
                                }}
                              />
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <Link
                              className="flex justify-center"
                              href={`/supplier/hotel/room/${params.hotelId}/serviceOfRoom/${item.roomId}`}
                            >
                              <img
                                src="/image/managevoucher.png"
                                alt="Manage Service"
                              />
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <Link
                              className="flex justify-center"
                              href={`/supplier/hotel/room/${params.hotelId}/room3DImage/${item.roomId}`}
                            >
                              <img
                                src="/image/managevoucher.png"
                                alt="Manage Room 3D"
                              />
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <Link
                              className="flex justify-center"
                              href={`/supplier/hotel/room/${params.hotelId}/roomImage/${item.roomId}`}
                            >
                              <img
                                src="/image/managevoucher.png"
                                alt="Manage Room Image"
                              />
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 flex justify-center">
                            <Link className="flex justify-center" href="#">
                              <img
                                className="w-5 h-5 cursor-pointer"
                                src="/image/pen.png"
                                alt="Edit"
                                onClick={() => {
                                  setRoomId(item.roomId);
                                  setRoom(item);
                                  setShowRoomUpdate(true);
                                  console.log("RoomId: " + item.roomId, item);
                                }}
                              />
                            </Link>
                            <img
                              className="w-5 h-5 cursor-pointer ml-3"
                              onClick={() => handleImageClick(item)}
                              src={
                                item.roomStatus
                                  ? "/image/lock.png"
                                  : "/image/unlock.png"
                              }
                              alt={item.roomStatus ? "Ban" : "Unban"}
                            />
                            {showPopup &&
                              selectedRoom?.roomId === item.roomId && (
                                <div className="fixed inset-0 z-10 flex items-center justify-center">
                                  <div
                                    className="fixed inset-0 bg-black opacity-50"
                                    onClick={handleClosePopup}
                                  ></div>
                                  <div className="relative bg-white p-8 rounded-lg">
                                    <p className="color-black font-bold text-2xl">
                                      Do you want to{" "}
                                      {item.roomStatus ? "lock" : "unlock"} this{" "}
                                      {item.roomName}?
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
                                          handleLockUnlockRoom(
                                            item.roomId,
                                            item.roomStatus
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
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-4 text-red-600 font-bold"
                        >
                          No rooms found
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
                <CreateRoom
                  showRoomCreate={showRoomCreate}
                  setShowRoomCreate={setShowRoomCreate}
                  hotelId={params.hotelId}
                />
                <UpdateRoom
                  showRoomUpdate={showRoomUpdate}
                  setShowRoomUpdate={setShowRoomUpdate}
                  hotelId={params.hotelId}
                  room={Room}
                  setRoom={setRoom}
                />
                <DetailRoom
                  showRoomDetail={showRoomDetail}
                  setShowRoomDetail={setShowRoomDetail}
                  hotelId={params.hotelId}
                  room={Room}
                  setRoom={setRoom}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListRoom;
