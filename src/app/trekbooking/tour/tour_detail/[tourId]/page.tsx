/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import tourService from "@/app/services/tourService";
import { ITour } from "@/app/entities/tour";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  addToBookingCartTour,
  getCartTourByUserId,
} from "@/app/services/bookingCartTourService";
import userService from "@/app/services/userService";
import Cookies from "js-cookie";
import { useRouter } from "../../../../../../node_modules/next/navigation";
import { Oval } from "react-loader-spinner";
import { useCart } from "@/app/components/CartContext";

const fetchTourImages = async (
  tourId: number,
  setTourImages: (images: string[]) => void
) => {
  const images = await tourService.getTourImageByTourId(tourId);
  const imageUrls = images.map((image: ITourImage) => image.tourImageURL);
  setTourImages(imageUrls);
};

const TourDetail = ({ params }: { params: { tourId: string } }) => {
  const { fetchTotalItems } = useCart();
  const token = Cookies.get("tokenUser");
  const [tour, setTour] = useState<ITour | null>(null);
  const [tourImages, setTourImages] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [cartData, setCartData] = useState<any>(null);
  const { data: tourDetail } = useSWR(`tour_detail/${params.tourId}`, () =>
    tourService.getTourById(Number(params.tourId))
  );
  const router = useRouter();

  useEffect(() => {
    const fetchCartData = async () => {
      if (token) {
        try {
          const existingCart = await getCartTourByUserId();
          setCartData(existingCart);
        } catch (err) {
          console.error(err);
          // Xử lý lỗi nếu cần
        }
      }
    };

    fetchCartData();
  }, [token]);

  useEffect(() => {
    const fetchUserData = async () => {
      // const token = Cookies.get("tokenUser");
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

  useEffect(() => {
    if (tourDetail) {
      setTour(tourDetail);
      fetchTourImages(Number(params.tourId), setTourImages);
    }
  }, [tourDetail, params.tourId]);
  const handleAddToCart = async () => {
    try {
      // const existingCart = await getCartTourByUserId();
      if (cartData) {
        const tourExists = cartData.some(
          (item: any) => item.tourId === tour?.tourId
        );
        if (tourExists) {
          toast.error("Tour is already in the cart");
          return;
        }
      }

      if (!token) {
        toast.error("You must login to book the tour!");
        setTimeout(() => {
          router.push(
            `/login_client?redirect=/trekbooking/tour/tour_detail/${params.tourId}`
          );
        }, 2000);
        return;
      }

      const tourCartItem = {
        userId: (await userData).userId,
        tourId: Number(params.tourId),
        tourQuantity: 1,
        tourPrice: tour?.tourPrice,
      };

      await addToBookingCartTour(tourCartItem);
      fetchTotalItems(); // Gọi hàm này để cập nhật số lượng items trong giỏ hàng
      toast.success("Tour added to cart!");
      router.push("/trekbooking/booking_cart");
    } catch (error: any) {
      console.error("Error adding to cart:", error);

      if (error.message.includes("CartTour already exists")) {
        toast.error("Tour is already in the cart");
      } else {
        toast.error("Error adding tour to cart.");
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (tourDetail) {
        await fetchTourImages(Number(params.tourId), setTourImages);
        mutate(`tour_detail/${params.tourId}`);
      }
    }, 1000); // Kiểm tra thay đổi mỗi 1 giây
    return () => clearInterval(interval); // Xóa interval để tránh rò rỉ bộ nhớ
  }, [tourDetail, params.tourId]);

  if (!tour) {
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
  const tourTime = new Date(tour.tourTime);
  const formattedTime = tourTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = tourTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="backgr-home pt-1">
      <div className="container pb-4">
        <div
          className="font-semibold text-xl my-5"
          style={{ color: "#305A61" }}
        >
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
            href="/trekbooking/tour"
          >
            Attractions
          </Link>{" "}
          <span>/</span> <span>{tour?.tourName}</span>
        </div>
        <div style={{ borderRadius: "20px", boxShadow: "0 4px 4px 0 #7F7F7F" }}>
          <div className="py-8 px-3">
            <p className="font-semibold text-3xl">{tour.tourName}</p>
            <div className="time-location flex pb-2">
              <div className="time-fe flex">
                <img className="w-5 h-5" src="/image/calendar.png" alt="" />
                <p className="ml-1">{formattedTime}</p>
              </div>
              <div className="location-fe flex ml-4">
                <img className="w-5 h-5" src="/image/map.png" alt="" />
                <p className="ml-1">{tour.tourAddress}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <img
                  src={tourImages[0]}
                  className="w-full"
                  style={{ borderRadius: "10px", height: "410px" }}
                  alt="Image 1"
                />
              </div>
              <div className="col-md-6">
                <div className="grid h-full grid-cols-2 gap-x-2 gap-y-2">
                  {tourImages.slice(1).map((image, index) => (
                    <div key={index} style={{ height: "200px" }}>
                      <img
                        src={image}
                        style={{ borderRadius: "10px" }}
                        className="w-full h-full"
                        alt={`Image ${index + 2}`}
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
            <div
              className="py-8 px-4"
              style={{
                borderRadius: "20px",
                boxShadow: "0 4px 4px 0 #7F7F7F",
              }}
            >
              <a
                className="no-underline px-4 py-1 text-base font-medium text-white"
                style={{ borderRadius: "10px", backgroundColor: "#305A61" }}
                href="#"
              >
                Overview
              </a>
              <p
                className="font-bold text-xl pt-4"
                style={{ color: "#305A61" }}
              >
                About <span>{tour.tourName}</span>
              </p>
              <p
                className="text-base font-light"
                style={{ textIndent: "10px" }}
              >
                {tour.tourDescription}
              </p>
              <div>
                <img
                  style={{ borderRadius: "20px" }}
                  src={tourImages[0]}
                  alt="tour thumb"
                />
              </div>
            </div>
          </div>
          <div className="col-md-4 max-[768px]:pt-4">
            <div
              className="pt-8 pb-14 px-5 bg-white"
              style={{ borderRadius: "20px", boxShadow: "0 4px 4px 0 #7F7F7F" }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src="/image/calendartour.png"
                    style={{ width: "19px", height: "19px" }}
                    alt="tour calendar"
                  />
                  <span className="font-semibold ml-1">Departure time:</span>
                </div>
                <div>
                  <span className="font-semibold">{formattedTime}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center">
                  <img
                    src="/image/uptour.png"
                    style={{ width: "19px", height: "19px" }}
                    alt="tour calendar"
                  />
                  <span className="font-semibold ml-1">
                    Departure location:
                  </span>
                </div>
                <div>
                  <span className="font-semibold">{tour.tourAddress}</span>
                </div>
              </div>
              <div
                className="flex justify-between items-center mt-3 pb-3"
                style={{ borderBottom: "2px solid #000" }}
              >
                <div className="flex items-center">
                  <img
                    src="/image/user.png"
                    style={{ width: "19px", height: "19px" }}
                    alt="tour calendar"
                  />
                  <span className="font-semibold ml-1">Capacity:</span>
                </div>
                <div>
                  <span className="font-semibold">{tour.tourCapacity}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3 pb-3">
                <div className="">
                  <span
                    className="font-bold text-xl ml-1"
                    style={{ color: "#305A61" }}
                  >
                    Price:
                  </span>
                </div>
                <div>
                  <span className="font-bold text-xl">
                    <span>{tour.tourPrice}</span>US$
                  </span>
                </div>
              </div>
              <div className="flex float-end pb-4">
                <button
                  className="no-underline px-4 py-1 text-base font-medium text-white"
                  style={{ borderRadius: "12px", backgroundColor: "#305A61" }}
                  onClick={handleAddToCart}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TourDetail;
