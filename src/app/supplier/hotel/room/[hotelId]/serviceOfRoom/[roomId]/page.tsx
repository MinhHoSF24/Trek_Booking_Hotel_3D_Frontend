/* eslint-disable @next/next/no-img-element */
"use client";
import CreateServiceOfRoom from "@/app/components/ServiceOfRoom/CreateServiceOfRoom";
import commentService from "@/app/services/commentService";
import rateService from "@/app/services/rateService";
import serviceOfRoom from "@/app/services/serviceOfRoom";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import "../../../../../../../../public/css/tour.css";
import hotelService from "@/app/services/hotelService";
import roomService from "@/app/services/roomService";
const ListServiceOfRoom = ({ params }: { params: {hotelId:string, roomId: string } }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [room, setRoom] = useState<IRoom | null>(null);
  const [hotel, setHotel] = useState<IHotel | null>(null);
  //const [RoomService, setRoomService] = useState<IRoomService | null>(null);
  const [selectedRoomService, setSelectedRoomService] = useState<IRoomService | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5);
  const [showServiceOfRoomCreate, setShowServiceOfRoomCreate] =
    useState<boolean>(false);

    useEffect(() => {
      const fetchHotelandRoom = async () => {
        try {
          const hotelData = await hotelService.getHotelById(
            Number(params.hotelId)
          );
          setHotel(hotelData);
  
          const roomData = await roomService.getRoomById(Number(params.roomId));
          setRoom(roomData);
        } catch (error) {
          console.error("Error fetching hotel and room details:", error);
        }
      };
  
      fetchHotelandRoom();
    }, [params.hotelId, params.roomId]);
    const {
      data: listServiceOfRoom,
      error,
      mutate: mutateServiceOfRoom,
    } = useSWR("listServiceOfRoom", () =>
      serviceOfRoom.getServiceByRoomId(Number(params.roomId))
    );
  const handleCreateServiceOfRoom = async () => {
    setShowServiceOfRoomCreate(false);
    mutateServiceOfRoom(); // Revalidate lại danh sách nhân viên sau khi tạo mới
  };

  const handleRoomServiceClick = (service: IService) => {
    const roomService: IRoomService = {
      roomId: Number(params.roomId),
      serviceId: service.serviceId,
    };
    setSelectedRoomService(roomService);
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedRoomService(null);
  };
  const handleDeleteRoomService = async (service: IService) => {
    try {
        const roomService: IRoomService = {
            roomId: Number(params.roomId),
            serviceId: service.serviceId,
          };
      await serviceOfRoom.deleteRoomService(roomService);
      mutateServiceOfRoom();
      handleClosePopup();
      toast.success("Remove service Successful");
    } catch (error) {
      console.error("Error to remove service:", error);
      alert("Failed to remove service");
    }
  };
  const totalPages = listServiceOfRoom ? Math.ceil(listServiceOfRoom.length / roomsPerPage) : 0;
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = listServiceOfRoom ? listServiceOfRoom.slice(indexOfFirstRoom, indexOfLastRoom) : [];
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
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
  if (!listServiceOfRoom) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading rates</div>;
  }

  return (
    <div className="relative">
      <div className="search-add ">
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
            <span style={{ color: "#4c7cab", fontSize: "18px" }}>
              {room.roomName}
            </span>
          </div>
        )}
        <button
          className="ml-8 button-add relative z-10"
          onClick={() => setShowServiceOfRoomCreate(true)}
        >
          + Add Service
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
                        Service Name
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Service Description
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Service Image
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRooms .length > 0 ? (
                      currentRooms .map((item: IService, index) => {
                        return (
                          <tr
                            key={index}
                            className="border-b border-neutral-200 dark:border-white/10 text-center"
                          >
                            <td className="whitespace-nowrap px-6 py-4 font-semibold">
                              {item.serviceName}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold">
                              {item.serviceDescription}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold">
                             <div className="flex justify-center"><img className="w-[35px] h-[40px]" src={item.serviceImage}></img></div>
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 flex justify-center">
                            <img
                                className="w-7 h-7 cursor-pointer ml-3"
                                src="/image/bag.png"
                                alt="Delete"
                                onClick={() => handleRoomServiceClick(item)}
                              />
                              {showPopup &&
                                selectedRoomService?.serviceId === item.serviceId && (
                                  <div className="fixed inset-0 z-10 flex items-center justify-center ">
                                    {/* Nền mờ */}
                                    <div
                                      className="fixed inset-0 bg-black opacity-5"
                                      onClick={handleClosePopup}
                                    ></div>

                                    {/* Nội dung của popup */}
                                    <div className="relative bg-white p-8 rounded-lg">
                                      <p className="color-black font-bold text-2xl">
                                        Do you want to delete Service: {item.serviceName} ?
                                        
                                      </p>
                                      <div className="button-kichhoat pt-4">
                                        <button
                                          className="button-exit mr-2"
                                          onClick={handleClosePopup}
                                        >
                                          Exit
                                        </button>
                                        <button
                                          className="button-yes cursor-pointer"
                                          onClick={() =>
                                            handleDeleteRoomService(item)}
                                        >

                                          Yes
                                        </button>
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
                          colSpan={9}
                          className="text-center py-4 text-red-600 font-bold"
                        >
                          No service found
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
                <CreateServiceOfRoom
                  showServiceOfRoomCreate={showServiceOfRoomCreate}
                  setShowServiceOfRoomCreate={setShowServiceOfRoomCreate}
                  onCreate={handleCreateServiceOfRoom}
                  thisRoomId={Number(params.roomId)}
                  existingServices={listServiceOfRoom}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ListServiceOfRoom;
