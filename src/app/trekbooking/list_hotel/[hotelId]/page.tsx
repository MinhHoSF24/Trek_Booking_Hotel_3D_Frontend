/* eslint-disable @next/next/no-img-element */
"use client";
import hotelService from "@/app/services/hotelService";
import roomImageService from "@/app/services/roomImageService";
import roomService from "@/app/services/roomService";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import React from "react";
import Slider from "react-slick";
import {
  addToBookingCart,
  getBookingCartByUserId,
} from "@/app/services/bookingCartService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import commentService from "@/app/services/commentService";
import rateService from "@/app/services/rateService";
import { Oval } from "react-loader-spinner"; // Import spinner
import Cookies from "js-cookie";
import userService from "@/app/services/userService";
import hotelImageService from "@/app/services/hotelImageService";
import serviceOfRoom from "@/app/services/serviceOfRoom";
import DetailRoomClient from "@/app/components/RoomClient/DetailRoomClient";
import { useCart } from "@/app/components/CartContext";


const calculateAverageRating = (comments: any) => {
  if (comments.length === 0) return 0;
  const totalRating = comments.reduce((sum: any, comment: any) => sum + (comment.rateValue || 0), 0);
  return parseFloat((totalRating / comments.length).toFixed(1));
};

const formatRoomDescription = (description: string) => {
  return description.split(".").map((sentence, index) => {
    if (sentence.trim() === "") return null; // Skip empty strings resulting from splitting
    return (
      <div key={index} className="flex items-baseline pb-2">
        <img className="w-3 h-3 mr-2" src="/image/greenTick.png" alt="tick" />
        <span className="font-medium text-xs">{sentence.trim()}.</span>
      </div>
    );
  });
};

const fetchHotelImages = async (
  hotelId: number,
  setHotelImages: (images: string[]) => void
) => {
  const images = await hotelImageService.getHotelImageByHotelId(hotelId);
  const imageUrls = images.map((image: IHotelImage) => image.hotelImageURL);
  setHotelImages(imageUrls);
};

const DetailHotel = ({ params }: { params: { hotelId: string } }) => {
  const [averageRatings, setAverageRatings] = useState<{ [key: number]: number }>({});
  const { fetchTotalItems } = useCart();
  const token = Cookies.get("tokenUser");
  const [hotelImages, setHotelImages] = useState<string[]>([]);
  const [commentList, setCommentList] = useState<IComment[]>([]);
  const [rateList, setRateList] = useState<IRate[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [combinedList, setCombinedList] = useState<(IComment & { rateValue?: number })[]>([]);
  const displayedComments = showAll ? combinedList : combinedList.slice(0, 3);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [roomList, setRoomList] = useState<IRoom[]>([]);
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [availableRooms, setAvailableRooms] = useState<{ [key: number]: number }>({});
  const [roomImages, setRoomImages] = useState<{ [key: number]: IRoomImage[] }>({});
  const [roomServices, setRoomServices] = useState<{ [key: number]: IService[] }>({});
  const [showRoomDetail, setShowRoomDetail] = useState<boolean>(false);
  const [RoomId, setRoomId] = useState(0);
  const [Room, setRoom] = useState<IRoom | null>(null);

  //format date de show
  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = (today.getMonth() + 1).toString(); // thang di tu 0
    let dd = today.getDate().toString();

    if (parseInt(dd) < 10) dd = "0" + dd;
    if (parseInt(mm) < 10) mm = "0" + mm;

    return `${dd}-${mm}-${yyyy}`;
  };
  useEffect(() => {
    if (!checkInDate || !checkOutDate) {
      setErrorMessage('Please click both check-in and check-out dates.');
    } else {
      setErrorMessage('');
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    const fetchRates = async () => {
      const averages: { [key: number]: number } = {};
      for (const hotel of hotels) {
        try {
          const rates = await rateService.getRatesByHotelId(hotel.hotelId);
          const averageRate = rates.reduce((sum, rate) => sum + rate.rateValue, 0) / rates.length;
          averages[hotel.hotelId] = Math.round(averageRate); // Round to the nearest whole number
        } catch (error) {
          console.error(`Error fetching rates for hotel ${hotel.hotelId}:`, error);
          averages[hotel.hotelId] = 0;
        }
      }
      setAverageRatings(averages);
    };
    if (hotels.length > 0) {
      fetchRates();
    }
  }, [hotels]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await hotelService.getHotels();
        setHotels(data);
      } catch (error: any) {
        // handle error
      } finally {
        // finalize
      }
    };

    fetchHotels();
  }, []);

  const displayedHotels = showAll ? hotels : hotels.slice(0, 3);

  useEffect(() => {
    if (Number(params.hotelId) && checkInDate && checkOutDate) {
      getRoomAvailable(Number(params.hotelId), checkInDate, checkOutDate);
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const user = await userService.getUserById();
          setUserData(user);
        } catch (err) {
          console.error(err);
          // Xử lý lỗi nếu cần
        }
      }
    };
    fetchUserData();
  }, [token]);

  const averageRating = () => {
    if (combinedList.length === 0) return 0;
    const totalRates = combinedList.reduce((acc, curr) => acc + (curr.rateValue || 0), 0);
    return totalRates / combinedList.length;
  };

  const averageRating1 = calculateAverageRating(combinedList);

  const { data: hotel, error } = useSWR("detailHotel", () => hotelService.getHotelById(Number(params.hotelId)));
  const { data: listRoom, isLoading } = useSWR("listRoom", () => roomService.getRoomsByHotelId(Number(params.hotelId)));
  const { data: listComment } = useSWR("listComment", () => commentService.getCommentsByHotelId(Number(params.hotelId)));
  const { data: listRate } = useSWR("listRate", () => rateService.getRatesByHotelId(Number(params.hotelId)));
  const router = useRouter();

  useEffect(() => {
    if (listRoom) {
      setRoomList(listRoom);
      fetchRoomImages(listRoom);
      fetchRoomServices(listRoom);
    }
  }, [listRoom]);

  const fetchRoomServices = async (rooms: IRoom[]) => {
    const servicesMap: { [key: number]: IService[] } = {};
    for (const room of rooms) {
      const services: IService[] = await serviceOfRoom.getServiceByRoomId(room.roomId);
      if (services.length > 0) {
        servicesMap[room.roomId] = services;
      }
    }
    setRoomServices(servicesMap);
  };

  useEffect(() => {
    if (listComment) {
      setCommentList(listComment);
    }
  }, [listComment]);

  useEffect(() => {
    if (listRate) {
      setRateList(listRate);
    }
  }, [listRate]);

  useEffect(() => {
    if (listComment && listRate) {
      const combined = listComment.map((comment: any) => {
        const rate = listRate.find(
          (rate: any) => rate.userId === comment.userId && rate.orderHotelHeaderId === comment.orderHotelHeaderId
        );
        return {
          ...comment,
          rateValue: rate?.rateValue,
        };
      });
      setCombinedList(combined);
    }
  }, [listComment, listRate]);

  useEffect(() => {
    if (hotel) {
      fetchHotelImages(Number(params.hotelId), setHotelImages);
    }
  }, [hotel, params.hotelId]);

  const fetchRoomImages = async (rooms: IRoom[]) => {
    const imagesMap: { [key: number]: IRoomImage[] } = {};
    for (const room of rooms) {
      const images: IRoomImage[] = await roomImageService.getRoomImageByRoomId(room.roomId);
      if (images.length > 0) {
        imagesMap[room.roomId] = images;
      }
    }
    setRoomImages(imagesMap);
  };

  const getRoomAvailable = async (
    hotelId: number,
    checkInDate: string,
    checkOutDate: string
  ) => {
    try {
      const hotelSchedule: IRoomAvailability[] = await roomService.SearchRoomSchedule(hotelId, checkInDate, checkOutDate);
      const availableRoomsMap: { [key: number]: number } = {};
      hotelSchedule.forEach((room) => {
        availableRoomsMap[room.roomId] = room.availableRooms;
      });
      setAvailableRooms(availableRoomsMap);
      console.log(hotelSchedule);
    } catch (error) {
      console.error("Error searching hotels:", error);
    }
  };

  const handleDateChange = async () => {
    if (!Number(params.hotelId) || !checkInDate || !checkOutDate) {
      toast.error("Please select both check-in and check-out dates");
      return;
    }
    await getRoomAvailable(Number(params.hotelId), checkInDate, checkOutDate);
  };

  const getLowestPrice = useCallback(
    (hotelId: number) => {
      const rooms = roomList.filter((room) => room.hotelId === hotelId);
      if (rooms.length > 0) {
        return Math.min(...rooms.map((room) => room.roomPrice));
      }
      return null;
    },
    [roomList]
  );

  const renderGuests = (guestValue: number) => {
    const guests = [];
    for (let i = 0; i < guestValue; i++) {
      guests.push(
        <img key={i} className="w-4 h-4" src="/image/user.png" alt="guest" />
      );
    }
    return guests;
  };

  const renderStars = (rateValue: number) => {
    const stars = [];
    for (let i = 0; i < rateValue; i++) {
      stars.push(
        <img
          key={i}
          className="pr-1"
          src={i < rateValue ? "/image/start.png" : ""}
          alt="star"
        />
      );
    }
    return stars;
  };

  const handleAddToCart = async (room: IRoom) => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select both check-in and check-out dates");
      return;
    }
    const currentDate = new Date();
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Kiểm tra ngày nhận phòng và trả phòng
    if (checkIn < currentDate) {
      toast.error(
        "Check-in date cannot be in the past and must be more than 1 day later"
      );
      return;
    }
    if (checkOut <= checkIn) {
      toast.error("Check-out date must be after check-in date");
      return;
    }
    const stayDuration = (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24);
    if (stayDuration > 30) {
      toast.error("Stay cannot be longer than 30 days");
      return;
    }
    if (stayDuration < 1) {
      toast.error("Stay duration must be at least 1 day");
      return;
    }
    if (!token) {
      toast.error("You must login to book the room!");
      setTimeout(() => {
        router.push(`/login_client?redirect=/trekbooking/list_hotel/${params.hotelId}`);
      }, 2000);
      return;
    }

    const existingCart = await getBookingCartByUserId();
    const roomExists = existingCart.some((item: any) => item.roomId === room.roomId);
    if (roomExists) {
      toast.error("Room is already in the cart");
      return;
    }
    try {
      const bookingData = {
        bookingCartId: 0,
        userId: (await userData).userId,
        hotelId: room.hotelId,
        roomId: room.roomId,
        checkInDate: new Date(checkInDate).toISOString(),
        checkOutDate: new Date(checkOutDate).toISOString(),
        totalPrice: room.roomPrice,
        roomQuantity: 1,
        voucherCode: "not have",
        userNote: "not have",
      };

      const result = await addToBookingCart(bookingData);
      fetchTotalItems(); // Gọi hàm này để cập nhật số lượng items trong giỏ hàng
      router.push(`/trekbooking/booking_infor?roomId=${room.roomId}&hotelId=${room.hotelId}`);
      console.log("Booking cart added:", result);
    } catch (error) {
      console.error("Error adding to booking cart:", error);
    }
  };

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (isLoading || !listRoom || !listComment || !combinedList) {
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
    autoplay: false,
    autoplaySpeed: 4000,
  };

  const settingsComment = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    draggable: false,
    autoplay: false,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  
  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      <div className="container">
        <div className="font-semibold text-xl mt-8" style={{ color: "#305A61" }}>
          <Link
            className="no-underline underline_hv"
            style={{ color: "#305A61" }}
            href="/"
          >
            Home
          </Link>{" "}
          <span>/</span>{" "}
          <Link
            className="no-underline underline_hv"
            style={{ color: "#305A61" }}
            href="/trekbooking/list_hotel"
          >
            Hotels
          </Link>{" "}
          <span>/</span> <span>{hotel?.hotelName}</span>
        </div>
      </div>
      <div className="container mt-2 mb-10 pt-16">
        <div className="py-8 px-3">
          <div className="row">
            <div className="col-md-8">
              <p className="font-semibold text-3xl">{hotel?.hotelName}</p>
              <div className="flex items-center w-2/5 pb-3">
                <div>
                  <span className="p-0 text-base font-normal" style={{ color: "#305A61" }}>
                    Hotels
                  </span>
                </div>
                <div className="flex h-3 ml-4">
                  {renderStars(averageRating())}
                </div>
                <div className="ml-4">
                  <img className="w-4" src="/image/map-ping.png" alt="" />
                </div>
                <div className="ml-4">
                  <span className="text-base font-normal">
                    {hotel?.hotelCity}
                  </span>
                </div>
              </div>
              <span className="text-base font-normal">
                {hotel?.hotelDistrict}
              </span>
            </div>

            <div className="col-md-4">
              <div className="grid justify-items-center content-center py-4 mb-4 border rounded-xl" style={{ backgroundColor: "#F5F5F5" }}>
                <div>
                  <span className="font-semibold">
                    Price/room/night starts from
                  </span>
                </div>
                <span className="font-bold text-2xl my-1">
                  ${getLowestPrice(Number(params.hotelId)) || "N/A"}
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 max-[767px]:mb-8">
              <div className="row">
                <div className="col-md-6">
                  <div className="">
                    <img
                      className="w-full"
                      src={hotel?.hotelAvatar}
                      style={{ borderRadius: "10px", height: "410px" }}
                      alt="Image 1"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="grid h-full grid-cols-2 gap-x-2 gap-y-2">
                    {hotelImages.map((image, index) => (
                      <div key={image} style={{ height: "200px" }}>
                        <img
                          src={image}
                          style={{ borderRadius: "10px" }}
                          className="w-full h-full"
                          alt={`Image ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-8">
              <a
                className="no-underline px-4 py-1 text-base font-medium text-white"
                style={{ borderRadius: "10px", backgroundColor: "#305A61" }}
                href="#"
              >
                Overview
              </a>
              <p className="font-bold pt-3">About Accommodation</p>
              <p className="text-justify"> {hotel?.hotelFulDescription}</p>
            </div>

            <div className="col-md-4">
              <div className="grid justify-items-center content-center py-32 border" style={{ backgroundColor: "#F5F5F5", borderRadius: "10px" }}>
                <div>
                  <span className="font-bold text-xl">Reviews and ratings</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-xl pr-2 my-2">
                    {averageRating().toFixed(1)}
                  </span>
                  <div className="flex h-3">{renderStars(averageRating())}</div>
                </div>
                <span>Based on {combinedList.length} reviews</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span className="font-semibold text-3xl ">
            Rooms available at <span>{hotel?.hotelName}</span>
          </span>
          <div>
            <div className="row py-3">
              <label className="col-6 label-custom" htmlFor="checkInDate">
                Check-in Date:
              </label>
              <label className="col-6 label-custom" htmlFor="checkOutDate">
                Check-out Date:
              </label>
              <div className="row mx-0 items-center">
                <div className="input-date">
                  <div className="col-6">
                    <input
                      type="date"
                      id="checkInDate"
                      value={checkInDate}
                      min={getTodayDate().split("-").reverse().join("-")}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      required
                      className="hotel-date-input outline-none border-none"
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="date"
                      id="checkOutDate"
                      value={checkOutDate}
                      min={getTodayDate().split("-").reverse().join("-")}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      required
                      className="hotel-date-input outline-none border-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            {errorMessage && <p className="text-danger ml-2 font-semibold">{errorMessage}</p>}
          </div>
          {listRoom.length > 0 ? (
            listRoom.map((item: IRoom) => (
              <div
                key={item.roomId}
                className="border rounded-xl mt-3"
                style={{ boxShadow: "0 4px 4px 0 #7F7F7F" }}
              >
                <div className="mx-5 mt-4 mb-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-xl">
                      {item.roomName}
                    </span>
                    <span
                      className="text-center text-xs font-light pb-3"
                      style={{ color: "#8E8D8A", fontSize: "16px" }}
                    >
                      {/* <img src="/image/correct.png" className="w-5 h-5" /> */}
                      Available Rooms: {availableRooms[item.roomId] || 0}
                    </span>

                    <Link
                      className="mr-8"
                      href={`/trekbooking/image360/${item.roomId}`}
                    >
                      <img
                        src="/image/view3D.png"
                        className="w-10 h-10"
                        alt="view 3D"
                      />
                    </Link>
                  </div>

                  <div className="row">
                    <div className="col-lg-4 col-md-12">
                      {roomImages[item.roomId]?.length >= 2 ? (
                        <Slider {...settings}>
                          {roomImages[item.roomId]?.map((image) => (
                            <div key={image.roomImageId} className="slide-flex">
                              <img
                                className="w-5/6 h-60 rounded-lg"
                                src={image.roomImageURL}
                                alt="room thumbnail"
                              />
                            </div>
                          ))}
                        </Slider>
                      ) : (
                        <img
                          className="w-full h-60 border rounded-lg"
                          src={roomImages[item.roomId]?.[0].roomImageURL}
                          alt="room thumbnail"
                        />
                      )}
                    </div>
                    <div
                      className="col-lg-8 col-md-12 border "
                      style={{ borderRadius: "10px" }}
                    >
                      <div className="row">
                        <div className="col-5 border-r border-gray">
                          <p
                            className="text-center text-sm font-semibold pt-3"
                            style={{ color: "#305A61" }}
                          >
                            Room information
                          </p>
                          <div className="w-3/4 m-auto">
                            {formatRoomDescription(item.roomDescription)}
                          </div>
                        </div>
                        <div
                          className="col-3 border-r border-gray"
                          style={{ height: "290px" }}
                        >
                          <p
                            className="text-center text-sm font-semibold pt-3"
                            style={{ color: "#305A61" }}
                          >
                            Convenient
                          </p>
                          <div className="w-3/4 m-auto max-h-48 overflow-y-auto custom-scrollbar">
                            {roomServices[item.roomId]?.map((service) => (
                              <div
                                className="flex items-center pb-3"
                                key={service.serviceId}
                              >
                                <img
                                  className="w-3 h-3 mr-2"
                                  src={
                                    service.serviceImage ||
                                    "/image/greenTick.png"
                                  }
                                  alt={service.serviceDescription}
                                />
                                <span className="font-medium text-xs">
                                  {service.serviceName}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="row max-[768px]:justify-center">
                            <div className="col-6">
                              <p
                                className="text-center text-sm font-semibold pt-3"
                                style={{ color: "#305A61" }}
                              >
                                Guest(s)
                              </p>
                              <div className="flex flex-wrap items-center pb-1 w-3/4 mx-auto">
                                {/* Hiển thị số lượng khách */}
                                {Array.from({
                                  length: item.roomCapacity,
                                }).map((_, i) => (
                                  <img
                                    key={i}
                                    className="w-4 h-4 m-1"
                                    src="/image/user.png"
                                    alt="guest"
                                  />
                                ))}
                              </div>
                            </div>
                            <div
                              className="col-lg-6 col-md-6"
                              style={{
                                height: "290px",
                                border: "1px solid #D9D9D9",
                                borderRadius: "10px",
                                backgroundColor: "#F5F5F5",
                              }}
                            >
                              <div className="grid justify-items-center">
                                <span
                                  className="text-center text-sm font-semibold pb-3 pt-3"
                                  style={{ color: "#305A61" }}
                                >
                                  Price
                                </span>
                                <span
                                  className=" text-center text-xl font-bold pb-3 line-through"
                                  style={{ color: "#8E8D8A" }}
                                >
                                  {item.roomPrice}$
                                </span>
                                <span
                                  className="text-center text-xl font-bold pb-3"
                                  style={{ color: "rgb(255, 94, 31)" }}
                                >
                                  {(
                                    item.roomPrice -
                                    (item.roomPrice * item.discountPercent) /
                                    100
                                  ).toFixed(2)}
                                  $
                                </span>
                                <span
                                  className="text-center text-xs font-light pb-3"
                                  style={{ color: "#8E8D8A" }}
                                >
                                  Exclude taxes & fees
                                </span>

                                <div className="pb-1">
                                  <Link
                                    href=""
                                    className={`px-2 py-1 text-white no-underline font-medium text-xs ${availableRooms[item.roomId] == null
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                      }`}
                                    style={{
                                      backgroundColor:
                                        availableRooms[item.roomId] == null
                                          ? "#d3d3d3"
                                          : "#305A61",
                                      borderRadius: "10px",
                                    }}
                                    onClick={(e: any) => {
                                      if (availableRooms[item.roomId] == null) {
                                        e.preventDefault();
                                      } else {
                                        handleAddToCart(item);
                                      }
                                    }}
                                  >
                                    {availableRooms[item.roomId] == null
                                      ? "Room's full"
                                      : "Choose"}
                                  </Link>
                                </div>

                                <div className="pt-3">
                                  <div
                                    className="px-1 py-1  text-white no-underline font-medium text-xs cursor-pointer"
                                    style={{
                                      backgroundColor: "#305A61",
                                      borderRadius: "10px",
                                    }}
                                    onClick={() => {
                                      setRoomId(item.roomId);
                                      setRoom(item);
                                      setShowRoomDetail(true);
                                    }}
                                  >
                                    View Detail
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="text-center py-4 text-red-600 font-bold">
                No rooms found
              </p>
            </div>
          )}
        </div>

        <div className="row pt-16">
          <div className="col-lg-8 col-12 ">
            <div className="tfvt-listing-header flex max-[530px]:block">
              <h3 className="mb-0 max-[530px]:mb-2">Reviews</h3>
              <div className="rating-review flex items-center">
                <div className="count-review">
                  {`(${combinedList.length}) Reviews`}
                </div>
                <div className="comment-total-rating-stars stars flex">
                  {[...Array(5)].map((star, index) => (
                    <img
                      key={index}
                      className="w-4 h-4 mx-1"
                      src="/image/start.png"
                      alt=""
                      style={{ opacity: index < Math.round(averageRating1) ? 1 : 0.2 }}
                    />
                  ))}
                </div>
                <div className="comment-text">({averageRating1} out of 5)</div>
              </div>
            </div>
            <div className="comment mt-8">
              <div className="comment-list-wrap">
                <h4 className="comment-title font-semibold pb-6">
                  {`(${combinedList.length}) Comments`}
                </h4>
                <div className="comment-list">
                  <>
                    {displayedComments.length > 0 ? (
                      displayedComments.map((item, index) => (
                        <li key={index} className="list-none pb-8">
                          <div className="article">
                            <div className="gravatar">
                              <img src={item.user?.avatar || "/image/usersupplier.png"} className="avatar avatar-70 photo" height="70" width="70" />
                            </div>
                            <div className="comment-content max-[768px]:ml-4">
                              <div className="comment_meta clearfix pb-2">
                                <div className="comment-top">
                                  <h4 className="comment_author">{item.user?.userName || 'Anonymous'}</h4>
                                </div>
                                <div className="comment_time">{new Date(item.dateSubmitted).toLocaleDateString()}</div>
                              </div>
                              <div className="flex items-center pb-1">
                                {renderStars(item.rateValue || 0)}
                                <span className="comment-total-rating-value px-1">{item.rateValue || 0}</span>
                              </div>
                              <div className="comment_text">
                                <span className="font-medium break-words">
                                  {item.message}
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="list-none pb-6">
                        <p className="text-center py-4 text-red-600 font-bold">No comment found</p>
                      </li>
                    )}

                    <div className="button-view-all flex justify-center pb-12">
                      <button onClick={() => setShowAll(!showAll)} className="flex items-center viewall-comment">
                        {showAll ? "VIEW LESS" : "VIEW MORE"}
                        <img className="w-4 ml-2" src="/image/tourright.png" alt="" />
                      </button>
                    </div>

                  </>


                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-12">
            <div className="tfvt_single_sidebar">
              <ul className="tfvt-single-tour-sidebar  pl-0">
                <li className="widget">
                  <h3 className="widget-title">Recent Hotels</h3>
                  <ul className="recent-tour pl-0">
                    {displayedHotels.map((hotel, index) => (
                      <Link key={index} className="text-decoration-none" href={`/trekbooking/list_hotel/${hotel.hotelId}`}>
                        <li className="item-recent-tour flex pb-12 cursor-pointer">
                          <div className="thumb">
                            <img src={hotel.hotelAvatar || "https://vitourwp.themesflat.co/wp-content/uploads/2024/05/tour-feature-12-206x166.webp"} alt="featured-image" />
                          </div>
                          <div className="content">
                            <div className="flex items-center pb-2">
                              {averageRatings[hotel.hotelId] > 0 ? (
                                [...Array(averageRatings[hotel.hotelId])].map(
                                  (_, starIndex) => (
                                    <img
                                      key={starIndex}
                                      className="inline w-3 h-3 ml-1"
                                      src="/image/star.png"
                                      alt="star"
                                    />
                                  )
                                )
                              ) : (
                                <span className="">No rating</span>
                              )}
                            </div>
                            <h6 className="h6-title">{hotel.hotelName}</h6>
                            <div className="price-from">From <span className="currency_amount"> ${getLowestPrice(hotel.hotelId) || "100"}</span></div>
                          </div>
                        </li>
                      </Link>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <DetailRoomClient
        showRoomDetail={showRoomDetail}
        setShowRoomDetail={setShowRoomDetail}
        hotelId={params.hotelId}
        room={Room}
        setRoom={setRoom}
      />
    </>
  );
};

export default DetailHotel;
