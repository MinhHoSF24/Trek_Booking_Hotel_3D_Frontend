/* eslint-disable @next/next/no-img-element */
"use client";
import { BookingCartItem } from "@/app/entities/bookingCartItem";
import {
  deleteBookingCart,
  getBookingCartByUserId,
  getHotelById,
  getRoomById,
  getRoomImagesByRoomId,
} from "@/app/services/bookingCartService";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Oval } from "react-loader-spinner";
import {
  deleteCartTour,
  getCartTourByUserId,
} from "@/app/services/bookingCartTourService";
import { BookingCartTour } from "@/app/entities/BookingCartTour";
import tourService from "@/app/services/tourService";
import { ITour } from "@/app/entities/tour";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useCart } from "@/app/components/CartContext";
import serviceOfRoom from "@/app/services/serviceOfRoom";
import DetailRoomClient from "@/app/components/RoomClient/DetailRoomClient";

const formatRoomDescription = (description: string) => {
  return description.split(".").map((sentence, index) => {
    if (sentence.trim() === "") return null; // Skip empty strings resulting from splitting
    return (
      <div key={index} className="flex items-baseline pb-2">
        <img className="w-4 mr-2" src="/image/greenTick.png" alt="tick" />
        <span className="font-medium text-base">{sentence.trim()}.</span>
      </div>
    );
  });
};

const BookingCart = () => {
  const router = useRouter();
  const [roomServices, setRoomServices] = useState<{
    [key: number]: IService[];
  }>({});
  const [isFirstDivVisible, setIsFirstDivVisible] = useState(true);
  const { fetchTotalItems } = useCart();
  const handleBookingCartClick = (e: any) => {
    e.preventDefault();
    setIsFirstDivVisible(false);
  };

  const [showRoomDetail, setShowRoomDetail] = useState<boolean>(false);
  const [RoomId, setRoomId] = useState(0);
  const [Room, setRoom] = useState<IRoom | null>(null);
  // check chechkin checkout khi nó thay đổi

  //

  const handleCartToursClick = (e: any) => {
    e.preventDefault();
    setIsFirstDivVisible(true);
  };

  const handleDeleteCart = async (cartId: number) => {
    try {
      await deleteBookingCart(cartId);
      setBookingCart((prev) =>
        prev.filter((item) => item.bookingCartId !== cartId)
      );
      fetchTotalItems(); // Gọi hàm này để cập nhật số lượng items trong giỏ hàng
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  };

  const handleAddToCart = (roomId: number, hotelId: number) => {
    router.push(
      `/trekbooking/booking_infor?roomId=${roomId}&hotelId=${hotelId}`
    );
  };

  const [bookingCart, setBookingCart] = useState<BookingCartItem[]>([]);
  const [roomDetails, setRoomDetails] = useState<{ [key: number]: IRoom }>({});
  const [hotelDetails, setHotelDetails] = useState<{ [key: number]: IHotel }>(
    {}
  );
  const [roomImages, setRoomImages] = useState<{ [key: number]: IRoomImage[] }>(
    {}
  );
  const [tourImages, setTourImages] = useState<{ [key: number]: string }>({});
  const [tourNames, setTourNames] = useState<{ [key: number]: ITour }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [cartTours, setCartTours] = useState<BookingCartTour[]>([]);

  useEffect(() => {
    const fetchCartTours = async () => {
      const token = Cookies.get("tokenUser");
      if (!token) {
        return;
      }

      try {
        const tours = await getCartTourByUserId();
        if (tours && tours.length === 0) {
          return;
        }
        setCartTours(tours);

        const imagesMap: { [key: number]: string } = {};
        const namesMap: { [key: number]: ITour } = {};

        const imagesPromises = tours.map((tour: ITour) =>
          tourService.getTourImageByTourId(tour.tourId)
        );
        const namesPromises = tours.map((tour: ITour) =>
          tourService.getTourById(tour.tourId)
        );

        const imagesResults = await Promise.all(imagesPromises);
        const namesResults = await Promise.all(namesPromises);

        tours.forEach((tour: ITour, index: number) => {
          imagesMap[tour.tourId] =
            imagesResults[index][0]?.tourImageURL || "/default-image.png";
          namesMap[tour.tourId] = {
            ...tour,
            tourName: namesResults[index]?.tourName || "Unknown Tour",
          };
        });

        setTourImages(imagesMap);
        setTourNames(namesMap);
      } catch (error) {
        console.log("Failed to fetch cart tours");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCartTours();
  }, []);

  useEffect(() => {
    const fetchBookingCart = async () => {
      const token = Cookies.get("tokenUser");
      if (!token) {
        return;
      }

      try {
        const result = await getBookingCartByUserId();
        if (result && result.length === 0) {
          return;
        }
        setBookingCart(result);

        const roomDetailPromises = result.map((item: BookingCartItem) =>
          getRoomById(item.roomId)
        );
        const hotelDetailPromises = result.map((item: BookingCartItem) =>
          getHotelById(item.hotelId)
        );

        const roomDetails = await Promise.all(roomDetailPromises);
        const hotelDetails = await Promise.all(hotelDetailPromises);

        const roomDetailsMap: { [key: number]: IRoom } = {};
        const hotelDetailsMap: { [key: number]: IHotel } = {};

        roomDetails.forEach((room: IRoom) => {
          roomDetailsMap[room.roomId] = room;
        });
        hotelDetails.forEach((hotel: IHotel) => {
          hotelDetailsMap[hotel.hotelId] = hotel;
        });

        setRoomDetails(roomDetailsMap);
        setHotelDetails(hotelDetailsMap);

        const roomImagePromises = result.map((item: BookingCartItem) =>
          getRoomImagesByRoomId(item.roomId)
        );
        const roomImagesArray = await Promise.all(roomImagePromises);

        const roomImagesMap: { [key: number]: IRoomImage[] } = {};
        roomImagesArray.forEach((images: IRoomImage[], index: number) => {
          const roomId = result[index].roomId;
          roomImagesMap[roomId] = images;
        });

        setRoomImages(roomImagesMap);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching booking cart:", error);
        setIsLoading(false);
      }
    };

    fetchBookingCart();
  }, []);

  const handleQuantityChange = (tourId: number, delta: number) => {
    setCartTours((prevCartTours) => {
      return prevCartTours.map((tour) => {
        if (tour.tourId === tourId) {
          const newQuantity = tour.tourQuantity + delta;
          if (newQuantity >= 1 && newQuantity <= 20) {
            return { ...tour, tourQuantity: newQuantity };
          }
        }
        return tour;
      });
    });
  };

  const handleDelete = async (cartTourId: number) => {
    try {
      await deleteCartTour(cartTourId);
      setCartTours((prevCartTours) =>
        prevCartTours.filter((tour) => tour.cartTourId !== cartTourId)
      );
      fetchTotalItems(); // Gọi hàm này để cập nhật số lượng items trong giỏ hàng
      toast.success("Cart tour deleted successfully");
    } catch (error) {
      console.error("Error deleting cart tour:", error);
      toast.error("Failed to delete cart tour");
    }
  };
  const handleBuy = (tour: any) => {
    router.push(
      `/trekbooking/tour_order?tourId=${tour.tourId}&quantity=${tour.tourQuantity}`
    );
  };

  if (isLoading) {
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
    autoplay: true,
    autoplaySpeed: 1000,
  };

  const calculateTotalPrice = (
    pricePerNight: number,
    numberOfNights: number
  ) => {
    return pricePerNight * numberOfNights;
  };

  return (
    <div className="container py-8 pt-44">
      <div>
        <a
          className="no-underline flex items-center font-medium text-xl"
          style={{ color: "#305A61" }}
          href="#"
        >
          <img src="/image/chevron-down.png" alt="" /> Back
        </a>
      </div>
      <div className="flex my-8">
        <div className="pr-5">
          <a
            className="no-underline px-4 py-2 border text-sm font-medium listA"
            href="#"
            style={{ borderRadius: "10px" }}
            onClick={handleCartToursClick}
          >
            Cart Tours
          </a>
        </div>
        <div>
          <a
            className="no-underline px-4 py-2 border text-sm font-medium listA"
            href="#"
            style={{ borderRadius: "10px" }}
            onClick={handleBookingCartClick}
          >
            Booking Cart
          </a>
        </div>
      </div>
      {isFirstDivVisible ? (
        <div className="row ">
          <div className="col-lg-12 col-md-12">
            <div
              className="border"
              style={{ borderRadius: "10px", boxShadow: "0 6px 4px 0 #7F7F7F" }}
            >
              <div className="px-10 pt-7 pb-12">
                <div className="row border-solid border-b-2 border-black pb-3">
                  <div className="col-md-7">
                    <span
                      className="font-bold text-lg"
                      style={{ color: "#305A61" }}
                    >
                      Tours
                    </span>
                  </div>
                  <div className="col-md-5 row">
                    <div className="col-md-4 text-center">
                      <span
                        className="font-bold text-lg"
                        style={{ color: "#305A61" }}
                      >
                        Quantity
                      </span>
                    </div>
                    <div className="col-md-4 text-center">
                      <span
                        className="font-bold text-lg"
                        style={{ color: "#305A61" }}
                      >
                        Total
                      </span>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </div>
                {cartTours.length > 0 ? (
                  cartTours.map((tour, index) => (
                    <div className="row pt-10" key={index}>
                      <div className="col-md-7 flex justify-evenly items-center">
                        <div className="">
                          <img
                            className="border w-40 h-28"
                            style={{ borderRadius: "10px" }}
                            src={
                              tourImages[tour.tourId] || "/default-image.png"
                            }
                            alt="Tour Image"
                          />
                        </div>
                        <div className="w-2/5">
                          <span className="font-semibold text-base">
                            {tourNames[tour.tourId]?.tourName || "Unknown Tour"}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-5 row">
                        <div className="col-md-4 flex items-center content-center justify-evenly">
                          <button
                            onClick={() => handleQuantityChange(tour.tourId, 1)}
                          >
                            +
                          </button>
                          <div>
                            <span>{tour.tourQuantity}</span>
                          </div>
                          <button
                            onClick={() =>
                              handleQuantityChange(tour.tourId, -1)
                            }
                          >
                            -
                          </button>
                        </div>
                        <div className="col-md-4 flex items-center content-center justify-evenly">
                          <span className="font-semibold">
                            {tour?.tourPrice * tour?.tourQuantity} US$
                          </span>
                        </div>
                        <div className="col-md-2 flex items-center content-center justify-evenly">
                          <a
                            href="#"
                            onClick={() => handleDelete(tour.cartTourId)}
                          >
                            <img src="/image/trash.png" alt="" />
                          </a>
                        </div>
                        <div className="col-md-2 flex items-center content-center justify-evenly">
                          <button
                            className="buyagain py-2 px-4"
                            onClick={() => handleBuy(tour)}
                          >
                            Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <p className="text-center py-4 text-red-600 font-bold">
                      No tours in your cart
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="block">
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
            <div className="container py-8">
              <div>
                <span className="font-semibold text-3xl">Cart Information</span>
                {bookingCart.length > 0 ? (
                  bookingCart.map((item, index) => {
                    const room = roomDetails[item.roomId] || ({} as IRoom);
                    const hotel = hotelDetails[item.hotelId] || ({} as IHotel);
                    const images = roomImages[item.roomId] || [];
                    const totalPrice = item.totalPrice; // Tính tổng giá cho 3 ngày

                    return (
                      <div
                        key={index}
                        className="border rounded-xl mt-3 pb-6"
                        style={{ boxShadow: "0 4px 4px 0 #7F7F7F" }}
                      >
                        
                        <div className="close flex justify-end">
                          
                          <img
                            className="w-10 mr-3 mt-2 cursor-pointer"
                            src="/image/close.jpg"
                            onClick={() => handleDeleteCart(item.bookingCartId)}
                            alt=""
                          />
                        </div>
                        <div className="flex mx-5  mb-2">
                            <div className="">
                              <div className="flex items-center">
                                <label
                                  className="font-bold text-lg"
                                  style={{ color: "#ac7171" }}
                                  htmlFor="checkInDate"
                                >
                                  Check-in Date:
                                </label>
                                <br></br>
                                <span
                                  id="checkInDate"
                                  
                                  // onChange={(e) =>
                                  //   setCheckOutDate(e.target.value)
                                  // }
                                  className="ml-2 text-lg"

                                >
                                  {item.checkInDate || ""}
                                  </span>
                              </div>
                            </div>
                            <div className="ml-2">
                              <div className="flex items-center">
                                <label
                                  className="font-bold text-lg "
                                  style={{ color: "#ac7171" }}
                                  htmlFor="checkOutDate"
                                >
                                  Check-out Date:
                                </label>
                                <br></br>
                                <span
                                  id="checkOutDate"
                                  
                                  // onChange={(e) =>
                                  //   setCheckOutDate(e.target.value)
                                  // }
                                  className=" ml-2 text-lg"

                                >
                                  {item.checkOutDate || ""}
                                  </span>
                              </div>
                            </div>
                          </div>
                        <div className="mx-5  mb-2 ">
                          <div className="flex justify-between">
                            <span className="font-semibold text-xl">
                              {room.roomName}
                            </span>

                            <Link
                              className="mr-8"
                              href={`/trekbooking/image360/${room.roomId}`}
                            >
                              <img
                                src="/image/view3D.png"
                                className="w-10 h-10"
                                alt="view 3D"
                              />
                            </Link>
                          </div>

                          <div className="row">
                            <div className="col-lg-4 col-md-12 ">
                              {images.length >= 2 ? (
                                <Slider {...settings}>
                                  {images.map((image) => (
                                    <div key={image.roomImageId} className="">
                                      <img
                                        className="w-3/4 h-60 border rounded-lg mx-auto"
                                        src={image.roomImageURL}
                                        alt="room thumbnail"
                                      />
                                    </div>
                                  ))}
                                </Slider>
                              ) : (
                                <img
                                  className="w-full h-60 border rounded-lg"
                                  src={images[0]?.roomImageURL}
                                  alt="room thumbnail"
                                />
                              )}
                            </div>

                            <div
                              className="col-lg-8 col-md-12 border"
                              style={{ borderRadius: "10px" }}
                            >
                              <div className="row">
                                <div className="col-8 border-r border-gray">
                                  <p
                                    className="text-center text-lg font-semibold pt-3"
                                    style={{ color: "#305A61" }}
                                  >
                                    Room information
                                  </p>
                                  <div className="w-3/4 m-auto ">
                                    {formatRoomDescription(
                                      room.roomDescription
                                    )}
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="row max-[768px]:justify-center">
                                    <div className="col-6">
                                      <p
                                        className="text-center text-lg font-semibold pt-3"
                                        style={{ color: "#305A61" }}
                                      >
                                        Guest(s)
                                      </p>
                                      <div className="flex flex-wrap items-center pb-1 w-3/4 mx-auto">
                                        {/* Hiển thị số lượng khách */}
                                        {Array.from({
                                          length: room.roomCapacity,
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
                                      className="col-lg-6 h-80 max-[505px]:h-96 max-[768px]:flex max-[768px]:items-center"
                                      style={{
                                      
                                        border: "1px solid #D9D9D9",
                                        borderRadius: "10px",
                                        backgroundColor: "#F5F5F5",
                                      }}
                                    >
                                      <div className="grid justify-items-center">
                                        <span
                                          className="text-center text-lg font-semibold pb-3 pt-3 "
                                          style={{ color: "#305A61" }}
                                        >
                                          Price
                                        </span>
                                        <span className="text-center text-xl font-bold pb-3 " style={{ color: "rgb(255, 94, 31)" }}>
                                          {totalPrice}$
                                        </span>
                                        <span
                                          className="text-center text-xs font-light pb-3 md:mr-3"
                                          style={{ color: "#8E8D8A" }}
                                        >
                                          Exclude taxes & fees
                                        </span>
                                        <div className="pb-1">
                                          <Link
                                            href=""
                                            className="px-2 py-1 border text-white no-underline font-medium text-xs "
                                            style={{
                                              backgroundColor: "#305A61",
                                              borderRadius: "10px",
                                            }}
                                            onClick={(e: any) => {
                                              e.preventDefault();
                                              handleAddToCart(
                                                item.roomId,
                                                item.hotelId
                                              );
                                            }}
                                          >
                                            Choose
                                          </Link>
                                        </div>

                                        <div className="pt-3">
                                          <Link
                                            href=""
                                            className="px-1 py-1 border text-white no-underline font-medium text-xs"
                                            style={{
                                              backgroundColor: "#305A61",
                                              borderRadius: "10px",
                                            }}
                                            onClick={() => {
                                              setRoomId(item.roomId);
                                              setRoom(room);
                                              setShowRoomDetail(true);
                                            }}
                                          >
                                            View Detail
                                          </Link>
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
                    );
                  })
                ) : (
                  <div className="col-12">
                    <p className="text-center py-4 text-red-600 font-bold">
                      No items in cart
                    </p>
                  </div>
                )}
              </div>
            </div>
            <DetailRoomClient
              showRoomDetail={showRoomDetail}
              setShowRoomDetail={setShowRoomDetail}
              hotelId={String(Room?.hotelId)}
              room={Room}
              setRoom={setRoom}
            />
          </>
        </div>
      )}
    </div>
  );
};

export default BookingCart;
