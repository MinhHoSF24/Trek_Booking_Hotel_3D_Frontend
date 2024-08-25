/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import Searchcart from "../../components/searchcart";
import "../../../../public/css/search.css";
import { Oval } from "react-loader-spinner";
import commentService from "@/app/services/commentService";
import hotelService from "@/app/services/hotelService";
import roomService from "@/app/services/roomService";
import rateService from "@/app/services/rateService";
import Slider from "react-slick";
import hotelImageService from "@/app/services/hotelImageService";
import Link from "next/link";
import serviceOfRoom from "@/app/services/serviceOfRoom";
import RangeSlider from "rc-slider";
import "rc-slider/assets/index.css";
import useSWR from "swr";

const SearchPage = () => {
  const [hotelList, setHotelList] = useState<IHotel[]>([]);
  const [averageRatings, setAverageRatings] = useState<{
    [key: number]: number;
  }>({});
  const [roomList, setRoomList] = useState<IRoom[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false); // State để quản lý việc xem tất cả
  const [error, setError] = useState<Error | null>(null);
  const [commentsCount, setCommentsCount] = useState<{ [key: number]: number }>(
    {}
  );
  const [hotelImages, setHotelImages] = useState<{
    [key: number]: IHotelImage[];
  }>({});
  const [roomServices, setRoomServices] = useState<{
    [key: number]: IService[];
  }>({});

  const { data: listService, mutate: mutateService } = useSWR(
    "listService",
    () => serviceOfRoom.getServices()
  );
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
    const removeVietnameseTones = (str:any) => {
    // Hàm loại bỏ dấu tiếng Việt
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  };
  const filteredHotels = hotelList ? hotelList.filter(hotel => {
    const normalizedAddress = removeVietnameseTones(hotel.hotelCity.toLowerCase());
    const normalizedSearchTerm = removeVietnameseTones(searchTerm.toLowerCase());
    const matchesSearch = normalizedAddress.includes(normalizedSearchTerm);
  
  
    return matchesSearch;
  }) : [];
  // Pagination for hotels
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  // Pagination for services
  const [showAllServices, setShowAllServices] = useState(false);
  const visibleServicesCount = 10;

  // Filter states
  const [selectedRating, setSelectedRating] = useState<number[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);

  // Search states
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const cityParam = searchParams.get("city");

    setCity(cityParam);
  }, []);

  useEffect(() => {
    if (city) {
      searchHotels(city);
    }
  }, [city]);

  const searchHotels = async (city: string) => {
    try {
      setLoading(true);
      const hotelSchedule = await hotelService.searchHotelByCity(city);
      setHotelList(hotelSchedule);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error searching hotels:", error);
      setError(
        error instanceof Error
          ? error
          : new Error("An unexpected error occurred")
      );
    }
  };

  useEffect(() => {
    const fetchRates = async () => {
      const averages: { [key: number]: number } = {};
      for (const hotel of hotelList) {
        try {
          const rates = await rateService.getRatesByHotelId(hotel.hotelId);
          const averageRate =
            rates.reduce((sum, rate) => sum + rate.rateValue, 0) / rates.length;
          averages[hotel.hotelId] = Math.round(averageRate);
        } catch (error) {
          console.error(
            `Error fetching rates for hotel ${hotel.hotelId}:`,
            error
          );
          averages[hotel.hotelId] = 0;
        }
      }
      setAverageRatings(averages);
    };
    if (hotelList.length > 0) {
      fetchRates();
    }
  }, [hotelList]);

  useEffect(() => {
    const fetchHotelsAndRooms = async () => {
      setLoading(true);
      try {
        const rooms = await roomService.getRooms();
        setRoomList(rooms);
        setLoading(false);
      } catch (error) {
        setError(
          error instanceof Error
            ? error
            : new Error("An unexpected error occurred")
        );
        setLoading(false);
      }
    };
    fetchHotelsAndRooms();
  }, []);

  useEffect(() => {
    if (roomList.length > 0) {
      roomList.forEach((room) => fetchRoomServices(room.roomId));
    }
  }, [roomList]);

  useEffect(() => {
    if (hotelList) {
      fetchHotelImages(hotelList);
    }
  }, [hotelList]);

  const fetchHotelImages = async (hotels: IHotel[]) => {
    const imagesMap: { [key: number]: IHotelImage[] } = {};
    for (const hotel of hotels) {
      const images: IHotelImage[] =
        await hotelImageService.getHotelImageByHotelId(hotel.hotelId);
      if (images.length > 0) {
        imagesMap[hotel.hotelId] = images;
      }
    }
    setHotelImages(imagesMap);
  };

  const fetchCommentsCount = useCallback(async () => {
    const counts: { [key: number]: number } = {};
    for (const hotel of hotelList) {
      try {
        const comments = await commentService.getCommentsByHotelId(
          hotel.hotelId
        );
        counts[hotel.hotelId] = comments.length;
      } catch (error) {
        console.error(
          `Error fetching comments for hotel ${hotel.hotelId}:`,
          error
        );
        counts[hotel.hotelId] = 0;
      }
    }
    setCommentsCount(counts);
  }, [hotelList]);

  useEffect(() => {
    if (hotelList.length > 0) {
      fetchCommentsCount();
    }
  }, [hotelList, fetchCommentsCount]);

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

  const getLowestPriceDiscount = useCallback(
    (hotelId: number) => {
      const rooms = roomList.filter((room) => room.hotelId === hotelId);
      if (rooms.length > 0) {
        const lowestPrice = Math.min(
          ...rooms.map(
            (room) =>
              room.roomPrice - room.roomPrice * (room.discountPercent / 100)
          )
        );
        return parseFloat(lowestPrice.toFixed(2));
      }
      return null;
    },
    [roomList]
  );

  const getRoomsByHotelId = (hotelId: number) => {
    return roomList.filter((room) => room.hotelId === hotelId).slice(0, 2);
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating((prevSelected) =>
      prevSelected.includes(rating)
        ? prevSelected.filter((item) => item !== rating)
        : [...prevSelected, rating]
    );
  };

  const handleServiceChange = (service: string) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(service)
        ? prevSelected.filter((item) => item !== service)
        : [...prevSelected, service]
    );
  };

  const filterHotels = () => {
    return hotelList.filter((hotel) => {
      const matchesRating =
        selectedRating.length === 0 ||
        selectedRating.includes(averageRatings[hotel.hotelId]);
      const matchesService =
        selectedServices.length === 0 ||
        selectedServices.every((service) =>
          roomList.some(
            (room) =>
              room.hotelId === hotel.hotelId &&
              roomServices[room.roomId]?.some(
                (rs) => rs.serviceName === service
              )
          )
        );
      const lowestPriceDiscount = getLowestPriceDiscount(hotel.hotelId);
      const matchesPrice =
        lowestPriceDiscount !== null &&
        lowestPriceDiscount >= priceRange[0] &&
        lowestPriceDiscount <= priceRange[1];
      return matchesRating && matchesService && matchesPrice;
    });
  };
  const getHotelCountByCity = (city: string) => {
    return currentHotels.filter((hotel) =>
      removeVietnameseTones(hotel.hotelCity.toLowerCase()).includes(
        removeVietnameseTones(city.toLowerCase())
      )
    ).length;
  };

  if (loading) {
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

  const fetchRoomServices = async (roomId: number) => {
    try {
      const services = await serviceOfRoom.getServiceByRoomId(roomId);
      setRoomServices((prev) => ({ ...prev, [roomId]: services }));
    } catch (error) {
      console.error("Error fetching room services:", error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    draggable: false,
    autoplay: false,
    autoplaySpeed: 4000,
  };

  const totalPages = Math.ceil(filterHotels().length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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

  const currentHotels =  filterHotels().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      <div className="pt-44">
        <div className="img-bk-search">
          <Searchcart />
        </div>
        <div className="content-search backgr-home pb-12 pt-20">
          <div className="container">
            <div className="text-center">
              <p className="font-bold text-4xl">The Best Place For Vacation </p>
            </div>
            <div
              className="mb-10 pt-6" >
              <div className="row mx-3">
          <div className="col-lg-2 col-md-4 col-12 max-[992px]:pt-4 ">
              <a
                href={`/trekbooking/search_city?city=Cần Thơ`}
                className="text-white no-underline zoom-effect-container"
              >
                <div className="relative image-card hover-effect hover-effect">
                  <img
                    className="border w-full hover-image hover-image"
                    style={{ borderRadius: "20px", height: "231px" }}
                    src="/image/cantho1.png"
                    alt="can tho"
                  />
                  <div
                    className="absolute z-10 w-full bottom-0 pl-4 py-2 hover-overlay hover-overlay"
                    style={{
                      backgroundColor: "rgb(31,28,23,0.3)",
                      border: "0 0 1px 1px",
                      borderBottomLeftRadius: "20px",
                      borderBottomRightRadius: "20px",
                    }}
                  >
                    <p className="text-white font-semibold text-base mb-1">
                      Can Tho
                    </p>
                    <p className="opacity-80 mb-0">{getHotelCountByCity("Can Tho")} Places</p>
                  </div>
                </div>
              </a>
              
            </div>
          <div className="col-lg-2 col-md-4 col-12 max-[992px]:pt-4">
              <a
                href={`/trekbooking/search_city?city=Vũng Tàu`}
                className="text-white no-underline zoom-effect-container"
              >
                <div className="relative image-card hover-effect">
                  <img
                    className="border w-full hover-image"
                    style={{ borderRadius: "20px", height: "231px" }}
                    src="/image/vungtau1.jpg"
                    alt="Vung Tau"
                  />
                 <div
                    className="absolute z-10 w-full bottom-0 pl-4 py-2 hover-overlay"
                    style={{
                      backgroundColor: "rgb(31,28,23,0.3)",
                      border: "0 0 1px 1px",
                      borderBottomLeftRadius: "20px",
                      borderBottomRightRadius: "20px",
                    }}
                  >
                    <p className="text-white font-semibold text-base mb-1">
                      Vung Tau
                    </p>
                    <p className="opacity-80 mb-0">{getHotelCountByCity("Vung Tau")} Places</p>
                  </div>
                </div>
              </a>
              
            </div>
          <div className="col-lg-2 col-md-4 col-12 max-[992px]:pt-4">
              <a
                href={`/trekbooking/search_city?city=Ninh Bình`}
                className="text-white no-underline zoom-effect-container"
              >
                <div className="relative image-card hover-effect">
                  <img
                    className="border w-full hover-image"
                    style={{ borderRadius: "20px", height: "231px" }}
                    src="/image/ninhbinh1.jpg"
                    alt="ninh binh"
                  />
                  <div
                    className="absolute z-10 w-full bottom-0 pl-4 py-2 hover-overlay"
                    style={{
                      backgroundColor: "rgb(31,28,23,0.3)",
                      border: "0 0 1px 1px",
                      borderBottomLeftRadius: "20px",
                      borderBottomRightRadius: "20px",
                    }}
                  >
                    <p className="text-white font-semibold text-base mb-1">
                      Ninh Binh
                    </p>
                    <p className="opacity-80 mb-0">{getHotelCountByCity("Ninh Binh")} Places</p>
                  </div>
                </div>
              </a>
            
            </div>
          <div className="col-lg-2 col-md-4 col-12 max-[992px]:pt-4">
              <a
                href={`/trekbooking/search_city?city=Ho Chi Minh`}
                className="text-white no-underline zoom-effect-container"
              >
                <div className="relative image-card hover-effect">
                  <img
                    className="border w-full hover-image"
                    style={{ borderRadius: "20px", height: "231px" }}
                    src="/image/hcm.png"
                    alt="da lat"
                  />
                  <div
                    className="absolute z-10 w-full bottom-0 pl-4 py-2 hover-overlay"
                    style={{
                      backgroundColor: "rgb(31,28,23,0.3)",
                      border: "0 0 1px 1px",
                      borderBottomLeftRadius: "20px",
                      borderBottomRightRadius: "20px",
                    }}
                  >
                    <p className="text-white font-semibold text-base mb-1">
                     Ho Chi Minh
                    </p>
                    <p className="opacity-80 mb-0">{getHotelCountByCity("Ho Chi Minh")} Places</p>
                  </div>
                </div>
              </a>
              
            </div>
          <div className="col-lg-2 col-md-4 col-12 max-[992px]:pt-4">
              <a
                href={`/trekbooking/search_city?city=Hanoi`}
                className="text-white no-underline zoom-effect-container"
              >
                <div className="relative image-card hover-effect">
                  <img
                    className="border w-full hover-image"
                    style={{ borderRadius: "20px", height: "231px" }}
                    src="/image/hanoi.png"
                    alt="da lat"
                  />
                  <div
                    className="absolute z-10 w-full bottom-0 pl-4 py-2 hover-overlay"
                    style={{
                      backgroundColor: "rgb(31,28,23,0.3)",
                      border: "0 0 1px 1px",
                      borderBottomLeftRadius: "20px",
                      borderBottomRightRadius: "20px",
                    }}
                  >
                    <p className="text-white font-semibold text-base mb-1">
                     Ha Noi
                    </p>
                    <p className="opacity-80 mb-0">{getHotelCountByCity("Ha Noi")} Places</p>
                  </div>
                </div>
              </a>
            </div>
          <div className="col-lg-2 col-md-4 col-12 max-[992px]:pt-4">
              <a
                href={`/trekbooking/search_city?city=Phan Thiết`}
                className="text-white no-underline zoom-effect-container"
              >
                <div className="relative image-card hover-effect">
                  <img
                    className="border w-full hover-image"
                    style={{ borderRadius: "20px", height: "231px" }}
                    src="/image/phanthiet.jpg"
                    alt="phan thiet"
                  />
                  <div
                    className="absolute z-10 w-full bottom-0 pl-4 py-2 hover-overlay"
                    style={{
                      backgroundColor: "rgb(31,28,23,0.3)",
                      border: "0 0 1px 1px",
                      borderBottomLeftRadius: "20px",
                      borderBottomRightRadius: "20px",
                    }}
                  >
                    <p className="text-white font-semibold text-base mb-1">
                      Phan Thiet
                    </p>
                    <p className="opacity-80 mb-0">{getHotelCountByCity("Phan Thiet")} Places</p>
                  </div>
                </div>
              </a>
            
            </div>
          </div>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-4 col-12 max-[768px]:pb-4">
                <div className="border-filter">
                  <p className="text-center text-2xl pb-8 font-bold color-black">
                    Filters
                  </p>
                   <div className="range">
                    <p className="font-bold color-black">Price Range</p>
                    <p className="color-black">0 US$ - 5000 US$</p>
                    <RangeSlider
                      range
                      min={0}
                      max={5000}
                      value={priceRange}
                      onChange={(value) => setPriceRange(value as number[])}
                      trackStyle={[{ backgroundColor: "#305A61" }]}
                      handleStyle={[
                        { borderColor: "#305A61" },
                        { borderColor: "#305A61" },
                      ]}
                    />
                    <div className="flex justify-between mt-2">
                      <span>Min: {priceRange[0]}$</span>
                      <span>Max: {priceRange[1]}$</span>
                    </div>
                  </div>
                  <div className="start flex justify-between mt-4">
                    <p className="font-bold">Star Rating</p>
                    <img
                      className="h-5 w-5 cursor-pointer"
                      src="/image/down.png"
                      alt=""
                    />
                  </div>
                  <div className="input-star flex pb-8">
                    <input
                      type="checkbox"
                      className="h-5"
                      onChange={() => handleRatingChange(1)}
                    />
                    <img className="input-star" src="/image/star.png" alt="" />
                  </div>
                  <div className="input-star flex pb-8">
                    <input
                      type="checkbox"
                      className="h-5"
                      onChange={() => handleRatingChange(2)}
                    />
                    <img className="input-star" src="/image/star.png" alt="" />
                    <img className="input-star" src="/image/star.png" alt="" />
                  </div>
                  <div className="input-star flex pb-8">
                    <input
                      type="checkbox"
                      className="h-5"
                      onChange={() => handleRatingChange(3)}
                    />
                    <img className="input-star" src="/image/star.png" alt="" />
                    <img className="input-star" src="/image/star.png" alt="" />
                    <img className="input-star" src="/image/star.png" alt="" />
                  </div>
                  <div className="input-star flex pb-8">
                    <input
                      type="checkbox"
                      className="h-5"
                      onChange={() => handleRatingChange(4)}
                    />
                    <img className="input-star" src="/image/star.png" alt="" />
                    <img className="input-star" src="/image/star.png" alt="" />
                    <img className="input-star" src="/image/star.png" alt="" />
                    <img className="input-star" src="/image/star.png" alt="" />
                  </div>
                  <div className="input-star flex pb-8">
                    <input
                      type="checkbox"
                      className="h-5"
                      onChange={() => handleRatingChange(5)}
                    />
                    <img className="input-star" src="/image/star.png" alt="" />
                    <img className="input-star" src="/image/star.png" alt="" />
                    <img className="input-star" src="/image/star.png" alt="" />
                    <img className="input-star" src="/image/star.png" alt="" />
                    <img className="input-star" src="/image/star.png" alt="" />
                  </div>
                  <div className="pb-4">
                    <div className="start flex justify-between">
                      <p className="font-bold">Services</p>
                      <img
                        className="h-5 w-5 cursor-pointer"
                        src="/image/down.png"
                        alt=""
                      />
                    </div>
                    {listService &&
                      listService
                        .slice(0, showAllServices ? listService.length : visibleServicesCount)
                        .map((service) => (
                          <div
                            className="flex pb-4 "
                            key={service.serviceId}
                          >
                            <input
                              type="checkbox"
                              className="h-5"
                              onChange={() =>
                                handleServiceChange(service.serviceName)
                              }
                            />
                            <p className="text-faci">{service.serviceName}</p>
                          </div>
                        ))}
                    {listService && listService.length > visibleServicesCount && (
                      <div className="text-center mt-4">
                      <button
                          className="no-underline text-white border px-3 font-medium text-sm"
                          style={{
                            backgroundColor: "#305A61",
                            borderRadius: "10px",
                          }}
                          onClick={() => setShowAllServices(!showAllServices)}
                        >
                          {showAllServices ? "Show Less" : "See More"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-8 col-12">
                {currentHotels.length > 0 ? (
                  currentHotels.map((item: IHotel) => (
                    <div
                      key={item.hotelId}
                      className="row bg-white py-3 px-2 mb-4"
                      style={{
                        borderRadius: "20px",
                        boxShadow: "0 4px 4px 0 #7F7F7F",
                      }}
                    >
                      <div className="col-4">
                        <div className="">
                          <img
                            className="w-full h-64"
                            style={{ borderRadius: "10px" }}
                            src={item.hotelAvatar}
                            alt=""
                          />
                        </div>
                        <div className="my-3">
                          {hotelImages[item.hotelId]?.length >= 2 ? (
                            <Slider {...settings}>
                              {hotelImages[item.hotelId]?.map((image) => (
                                <div key={image.hotelImageId}>
                                  <img
                                    className="w-full h-20 px-1"
                                    style={{ borderRadius: "10px" }}
                                    src={image.hotelImageURL}
                                    alt="hotel thumbnail"
                                  />
                                </div>
                              ))}
                            </Slider>
                          ) : (
                            <img
                              className="w-full h-40 px-1"
                              style={{ borderRadius: "10px" }}
                              src={hotelImages[item.hotelId]?.[0].hotelImageURL}
                              alt="room thumbnail"
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-5">
                        <div className="px-3">
                          <span className="font-bold text-lg pt-2 color-black">
                            {item.hotelName}
                          </span>
                          <div className="review flex items-center py-3">
                            <span className="color-primary disnone">
                              Hotels
                            </span>
                            {averageRatings[item.hotelId] > 0 ? (
                              [...Array(averageRatings[item.hotelId])].map(
                                (_, index) => (
                                  <img
                                    key={index}
                                    className="inline ml-2"
                                    src="/image/star.png"
                                    alt=""
                                  />
                                )
                              )
                            ) : (
                              <span className="ml-2">No rating</span>
                            )}
                            <span
                              style={{ color: "#8E8D8A" }}
                              className="ml-3 disnone"
                            >
                              {commentsCount[item.hotelId] === 0 ||
                              commentsCount[item.hotelId] === 1
                                ? `${commentsCount[item.hotelId] || 0} review`
                                : `${commentsCount[item.hotelId] || 0} reviews`}
                            </span>
                          </div>
                          <div className="flex">
                            <img
                              className="w-5 h-5"
                              src="/image/map.png"
                              alt=""
                            />
                            <p className="ml-3 color-black">{item.hotelCity}</p>
                          </div>
                          <div className="row mt-4">
                            {getRoomsByHotelId(item.hotelId).map((room) => (
                              <div className="col-6" key={room.roomId}>
                                <div>
                                  <p className="font-bold text-sm">
                                    {room.roomName} 
                                  </p>
                                  <div className="max-h-40 overflow-y-auto custom-scrollbar">
                                    {roomServices[room.roomId]?.map(
                                      (service) => (
                                        <div
                                          className="flex items-center mt-3"
                                          key={service.serviceId}
                                        >
                                          <img
                                            className="w-3 h-3"
                                            src={
                                              service.serviceImage ||
                                              "/image/greenTick.png"
                                            }
                                            alt=""
                                          />
                                          <span className="ml-2 color-black">
                                            {service.serviceName}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-3"
                        style={{
                          borderRadius: "10px",
                          backgroundColor: "#F5F5F5",
                        }}
                      >
                        <div className="text-center pt-14">
                          <p className="text-normal color-primary font-bold">
                            Holiday sale
                          </p>
                          <p
                            className="font-bold decor text-xl max-[460px]:text-xs"
                            style={{ color: "#8E8D8A" }}
                          >
                            {getLowestPrice(item.hotelId) || "N/A"}US$
                          </p>
                          <p
                            className="color-black font-bold text-xl max-[460px]:text-xs"
                            style={{ color: "rgb(255, 94, 31)" }}
                          >
                            {getLowestPriceDiscount(item.hotelId) || "N/A"}US$
                          </p>
                          <p className="pb-4" style={{ color: "#8E8D8A" }}>
                            Exclude taxes & fees
                          </p>
                          <Link
                            href={`/trekbooking/list_hotel/${item.hotelId}`}
                            className="text-white font-medium btn btn-success text-lg border no-underline"
                            style={{
                              backgroundColor: "#305A61",
                              borderRadius: "20px",
                            }}
                          >
                            View Hotel
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <p className="text-center py-4 text-red-600 font-bold">
                      No hotel found
                    </p>
                  </div>
                )}
                <div className="pagination mt-4 flex justify-center items-center font-semibold">
                {totalPages > 0 && (
                  <div className="flex items-center mr-8">
                  <img className="w-3 h-3 cursor-pointer" src="/image/left.png" alt="Previous" onClick={handlePrevPage} />
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`pagination-button mx-2 ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                      <img className="w-3 h-3 cursor-pointer" src="/image/right2.png" alt="Next" onClick={handleNextPage} />
                  </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
