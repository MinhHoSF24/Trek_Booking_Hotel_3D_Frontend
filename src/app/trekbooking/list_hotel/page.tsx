/* eslint-disable @next/next/no-img-element */
"use client";
import hotelService from "@/app/services/hotelService";
import roomService from "@/app/services/roomService";
import commentService from "@/app/services/commentService";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Oval } from "react-loader-spinner"; // Import spinner
import rateService from "@/app/services/rateService";
import "../../../../public/css/tour.css";

const ListHotels = () => {
  const [hotelList, setHotelList] = useState<IHotel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roomList, setRoomList] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [viewAll, setViewAll] = useState(false); // State để quản lý việc xem tất cả
  const [commentsCount, setCommentsCount] = useState<{ [key: number]: number }>(
    {}
  );
  const [averageRatings, setAverageRatings] = useState<{
    [key: number]: number;
  }>({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const removeVietnameseTones = (str: any) => {
    // Hàm loại bỏ dấu tiếng Việt
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  };
  const filteredHotels = hotelList ? hotelList.filter(hotel => {
    const normalizedCity = removeVietnameseTones(hotel.hotelCity.toLowerCase());
    const normalizedHotelName = removeVietnameseTones(hotel.hotelName.toLowerCase());
    const normalizedSearchTerm = removeVietnameseTones(searchTerm.toLowerCase());

    const matchesSearch = normalizedCity.includes(normalizedSearchTerm) || normalizedHotelName.includes(normalizedSearchTerm);

    return matchesSearch;
  }) : [];


  useEffect(() => {
    const fetchRates = async () => {
      const averages: { [key: number]: number } = {};
      for (const hotel of hotelList) {
        try {
          const rates = await rateService.getRatesByHotelId(hotel.hotelId);
          const averageRate =
            rates.reduce((sum, rate) => sum + rate.rateValue, 0) / rates.length;
          averages[hotel.hotelId] = Math.round(averageRate); // Round to the nearest whole number
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
    const onScroll = () => {
      const animatedElement = document.querySelector('.animate-on-scroll') as HTMLElement;
      if (!animatedElement) return;

      const rect = animatedElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        animatedElement.classList.add('active1');
      }
    };

    window.addEventListener('scroll', onScroll);
    onScroll(); // Gọi hàm này để kiểm tra vị trí phần tử ngay khi tải trang

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  useEffect(() => {
    const fetchHotelsAndRooms = async () => {
      setLoading(true);
      try {
        const [hotels, rooms] = await Promise.all([
          hotelService.getHotels(),
          roomService.getRooms(),
        ]);
        setHotelList(hotels);
        setRoomList(rooms);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching hotel or room list:", error);
          setError(error);
        } else {
          console.error("Unexpected error:", error);
          setError(new Error("An unexpected error occurred"));
        }
        setLoading(false);
      }
    };

    fetchHotelsAndRooms();
  }, []);
// Function to get hotel count for a specific city
const getHotelCountByCity = (city: string) => {
  return hotelList.filter((hotel) =>
    removeVietnameseTones(hotel.hotelCity.toLowerCase()).includes(
      removeVietnameseTones(city.toLowerCase())
    )
  ).length;
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

  const totalPages = Math.ceil(hotelList.length / itemsPerPage);


  const currentHotels = viewAll
    ? filteredHotels
    : filteredHotels.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

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
  if (error) return <p>Error loading data.</p>;

  return (
    <>
      <div className="container mb-20">
        <div className="text-center pt-44">
          <p className="font-bold text-4xl">The Best Place For Vacation </p>
        </div>
        <div
          className=" mb-10 pt-6">
          <div className="row mx-3">
          <div className="col-lg-2 col-md-4 col-12 max-[992px]:pt-4 ">
              <Link
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
              </Link>
              
            </div>
          <div className="col-lg-2 col-md-4 col-12 max-[992px]:pt-4">
              <Link
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
              </Link>
              
            </div>
          <div className="col-lg-2 col-md-4 col-12 max-[992px]:pt-4">
              <Link
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
              </Link>
            
            </div>
          <div className="col-lg-2 col-md-4 col-12 max-[992px]:pt-4">
              <Link
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
              </Link>
              
            </div>
          <div className="col-lg-2 col-md-4 col-12 max-[992px]:pt-4">
              <Link
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
              </Link>
            </div>
          <div className="col-lg-2 col-md-4 col-12 max-[992px]:pt-4">
              <Link
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
              </Link>
            
            </div>
          </div>


        
        </div>

        <div className="">
          <div className="flex justify-end pb-4">
            <div className="input__container input__container--variant">
              <div className="shadow__input shadow__input--variant"></div>
              <input
                type="text"
                name="text"
                className="input__search input__search--variant"
                placeholder="Search by address..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="row pb-6">
            {currentHotels.length > 0 ? (
              currentHotels
                .filter((item: IHotel) => item.isVerify === true)
                .map((item: IHotel, index: number) => {
                  const newPrice = getLowestPrice(item.hotelId);
                  return (
                    <div key={index} className="col-lg-3 col-md-6 col-12 pb-9 col-md-6 hover-tour cursor-pointer">
                      <Link href={`/trekbooking/list_hotel/${item.hotelId}`} className="fix-link text-decoration-none ">
                        <div className="block-tour content-tour fix-image-tour-client">
                          <div className="img-tour relative">
                            <img
                              src={item.hotelAvatar || "/image/hotel-placeholder.png"}
                              className="w-100 fix-image-tour-client h-56"
                              alt="Hotel"
                            />
                            <div className="meta-lable">
                              <div className="featured-text">Featured</div>
                            </div>
                          </div>

                          <div className="py-1 px-6">
                            <div className="address flex justify-start">
                              <img className="w-7" src="/image/addresstour.gif" alt="" />
                             <span className="address-text">
                             <span className="max-[992px]:hidden">
                                {item.hotelCity.length > 3 ? `${item.hotelCity.slice(0, 18)}...` : item.hotelCity}
                              </span>
                              <span className="min-[992px]:hidden">
                                {item.hotelCity}
                              </span>
                             </span>
                            </div>
                            <p className="color-black font-bold pt-2 text-left"> 
                            <span className="max-[992px]:hidden">
                                      {item.hotelName.length > 3 ? `${item.hotelName.slice(0, 28)}...` : item.hotelName}
                                    </span>
                                    <span className="min-[992px]:hidden">
                                      {/* {item.hotelName} */}
                                      {item.hotelName.length > 3 ? `${item.hotelName.slice(0, 28)}...` : item.hotelName}
                                    </span>
                            </p>
                            <div className="rating-review flex items-center pb-3">
                              <div className="rating flex ">
                                {averageRatings[item.hotelId] > 0 ? (
                                  [...Array(averageRatings[item.hotelId])].map((_, index) => (
                                    <img
                                      key={index}
                                      className="star"
                                      src="/image/star.png"
                                      alt=""
                                    />
                                  ))
                                ) : (
                                  <span>No rating</span>
                                )}
                              </div>
                              <div className="review">
                                ({commentsCount[item.hotelId] || 0} Reviews)
                              </div>
                            </div>
                            <div className="flex justify-start">
                              <div className="flex day">
                                <img className="icon-view" src="/image/locktour.png" alt="" />
                                <div className="number-day">1 Days</div>
                              </div>
                              <div className="flex items-start person min-[1200px]:ml-3">
                                <img className="icon-view1" src="/image/usertour.png" alt="" />
                                <div className="number-day">2 Persons</div>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between tour-info-bottom">
                              <div className="d-flex price">
                                <span className="from-color">From</span>
                                <div className="price-content pb-2">
                                  <span className="price-text item_info_price_new">
                                    <span className="currency_amount">
                                      <span className="currency_symbol">${newPrice || "N/A"}</span>
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <img
                                decoding="async"
                                src="https://vitourwp.themesflat.co/wp-content/plugins/tf-vitour-core-plugin/includes/elementor-widget/assets/images/icons/not-wish-list.svg"
                                alt="Add to Wishlist"
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })
            ) : (
              <div className="col-12 text-center text-gray-500 text-2xl pb-12">No hotels found</div>
            )}

          </div>
          <div className="button-view-all flex justify-center pb-12">
            <button
              className="flex items-center viewall"
              onClick={() => setViewAll(!viewAll)}
            >
              {viewAll ? "VIEW LESS" : "VIEW MORE"}
              <img className="w-4 ml-2" src="/image/tourright.png" alt="" />
            </button>
          </div>
        </div>
      </div>
      <div className="container animate-on-scroll">
        <p className="font-bold text-4xl">Multiple convenient features</p>
        <div className="row py-10">
          {[
            { img: "/image/phone.png", text: "CUSTOMER SUPPORT 24/7" },
            { img: "/image/review.png", text: "HONEST REVIEWS" },
            { img: "/image/schedule.png", text: "EASY RESCHEDULE" },
            { img: "/image/payment.png", text: "PAY UPON CHECK-IN" },
          ].map((feature, idx) => (
            <div key={idx} className="col-lg-3 col-6 card1 pb-3">
              <a href="#" className="no-underline text-black">
                <div
                  className="border grid justify-items-center"
                  style={{
                    borderRadius: "20px",
                    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <img
                    className="mt-5 mb-4"
                    src={feature.img}
                    style={{ width: "67px", height: "67px" }}
                    alt=""
                  />
                  <p className="font-bold pb-4">{feature.text}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ListHotels;
