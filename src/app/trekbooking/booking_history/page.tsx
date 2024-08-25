/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import Link from "../../../../node_modules/next/link";
import { useRouter } from "next/navigation";
import { Oval } from "react-loader-spinner";
import "../../../../public/css/voucher.css";
import "../../../../public/css/history.css";
import orderTourHeaderService from "@/app/services/orderTourHeaderService";
import orderTourDetailService from "@/app/services/orderTourDetailService";
import tourImageService from "@/app/services/tourImageService";
import orderHotelHeaderService from "@/app/services/orderHotelHeaderService";
import orderHotelDetailService from "@/app/services/orderHotelDetailService";
import roomImageService from "@/app/services/roomImageService";
import Rates from "@/app/components/FeedBack/Rates";
import commentService from "@/app/services/commentService";
import RoomBookingDetail from "@/app/components/BookingDetail/RoomBookingDetail";
import TourBookingDetail from "@/app/components/BookingDetail/TourBookingDetail";

const formatRoomDescription = (description: string) => {
  return description.split(".").map((sentence, index) => {
    if (sentence.trim() === "") return null;
    return (
      <div key={index} className="flex items-baseline pb-2">
        <img className="w-2 h-2 mr-2" src="/image/tick.png" alt="tick" />
        <span className="font-medium text-xs">{sentence.trim()}.</span>
      </div>
    );
  });
};

const Booking_History = () => {
  const router = useRouter();
  const [currentOrderHotelHeader, setCurrentOrderHotelHeader] =
    useState<IOrderHotelHeader | null>(null);
  const [currentOrderTourHeader, setCurrentOrderTourHeader] =
    useState<IOrderTourHeader | null>(null);
  const [isFirstDivVisible, setIsFirstDivVisible] = useState(true);
  const [showRate, setShowRate] = useState<boolean>(false);
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentHotelId, setCurrentHotelId] = useState<number | null>(null);
  const [currentOrderHotelHeaderId, setCurrentOrderHotelHeaderId] = useState<
    number | null
  >(null);
  const [currentHotelName, setCurrentHotelName] = useState<string | null>(null);
  const [currentRoomName, setCurrentRoomName] = useState<string | null>(null);
  const [currentRoomImageURL, setCurrentRoomImageURL] = useState<string | null>(
    null
  );
  const [feedbackStatus, setFeedbackStatus] = useState<{
    [key: number]: boolean;
  }>({});

  const handleBookingCartClick = (e: any) => {
    e.preventDefault();
    setIsFirstDivVisible(false);
  };

  const handleCartToursClick = (e: any) => {
    e.preventDefault();
    setIsFirstDivVisible(true);
  };

  const [orderHotelHeader, setOrderHotelHeader] = useState<IOrderHotelHeader[]>(
    []
  );

  const [orderTourHeader, setOrderTourHeader] = useState<IOrderTourHeader[]>(
    []
  );
  //popuppp
  const [showRoomBookingDetail, setShowRoomBookingDetail] =
    useState<boolean>(false);
  const [showTourBookingDetail, setShowTourBookingDetail] =
    useState<boolean>(false);
  const [orderHotelHeaderId, setOrderHotelHeaderId] = useState<number | null>(
    null
  );
  const [orderTourHeaderId, setOrderTourHeaderId] = useState<number | null>(
    null
  );
  //
  const [tourDetails, setTourDetails] = useState<{
    [key: number]: IOrderTourDetail[];
  }>({});
  const [hotelDetails, setHotelDetails] = useState<{
    [key: number]: IOrderHotelDetail[];
  }>({});
  const [roomImages, setRoomImages] = useState<IRoomImage[]>([]);
  const [tourImages, setTourImages] = useState<ITourImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const headers =
          await orderTourHeaderService.getOrderTourHeaderByUserId();
        setOrderTourHeader(headers);

        const detailPromises = headers.map((header) =>
          orderTourDetailService.getOrderTourDetailByOrderTourHeaderId(
            header.id
          )
        );
        const detailsArray = (await Promise.all(detailPromises))
          .filter(Boolean)
          .flat();
        const detailsMap: { [key: number]: IOrderTourDetail[] } = {};

        detailsArray.forEach((detail) => {
          if (!detailsMap[detail.orderTourHeaderlId]) {
            detailsMap[detail.orderTourHeaderlId] = [];
          }
          detailsMap[detail.orderTourHeaderlId].push(detail);
        });
        setTourDetails(detailsMap);

        // Fetch tour images
        const tourIds = new Set(
          detailsArray
            .filter(
              (detail): detail is IOrderTourDetail =>
                detail !== null && detail.tourId !== undefined
            )
            .map((detail) => detail.tourId)
        );

        const imagePromises = Array.from(tourIds).map((tourId) =>
          tourImageService.getTourImageByTourId(tourId)
        );
        const imagesArray = await Promise.all(imagePromises);
        const allTourImages = imagesArray.flat();
        setTourImages(allTourImages);

        console.log("Order Tour Headers:", headers);
        console.log("Tour Details Map:", detailsMap);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tour:", error);
        setIsLoading(false);
      }
    };

    fetchTour();
  }, []);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const headers =
          await orderHotelHeaderService.getOrderHotelHeaderByUserId();
        setOrderHotelHeader(headers);

        const detailPromises = headers.map((header) =>
          orderHotelDetailService.getOrderHotelDetailByOrderHotelHeaderId(
            header.id
          )
        );
        const detailsArray = (await Promise.all(detailPromises))
          .filter(Boolean)
          .flat();
        const detailsMap: { [key: number]: IOrderHotelDetail[] } = {};

        detailsArray.forEach((detail) => {
          if (!detailsMap[detail.orderHotelHeaderlId]) {
            detailsMap[detail.orderHotelHeaderlId] = [];
          }
          detailsMap[detail.orderHotelHeaderlId].push(detail);
        });
        setHotelDetails(detailsMap);

        // Fetch room images
        const roomIds = new Set(
          detailsArray
            .filter(
              (detail): detail is IOrderHotelDetail =>
                detail !== null && detail.roomId !== undefined
            )
            .map((detail) => detail.roomId)
        );

        const imagePromises = Array.from(roomIds).map((roomId) =>
          roomImageService.getRoomImageByRoomId(roomId)
        );
        const imagesArray = await Promise.all(imagePromises);
        const allRoomImages = imagesArray.flat();
        setRoomImages(allRoomImages);
        // Kiểm tra feedback cho từng orderHotelHeader
        const feedbackPromises = headers.map(async (header) => {
          const hasFeedback = await commentService.checkFeedback(header.id);
          return { headerId: header.id, hasFeedback };
        });
        // console.log("Order Hotel Headers:", headers);
        // console.log("Hotel Details Map:", detailsMap);
        const feedbackResults = await Promise.all(feedbackPromises);
        const feedbackStatusMap: { [key: number]: boolean } = {};
        feedbackResults.forEach((result) => {
          feedbackStatusMap[result.headerId] = result.hasFeedback;
        });
        setFeedbackStatus(feedbackStatusMap);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching room:", error);
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, []);
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
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
    autoplay: false,
    autoplaySpeed: 1000,
  };

  const handleFeedbackClick = (headerId: number, userId: number) => {
    const hotelDetail = hotelDetails[headerId]?.find(
      (detail) => detail.orderHotelHeaderlId === headerId
    );

    if (hotelDetail) {
      const roomImage = roomImages.find(
        (image) => image.roomId === hotelDetail.roomId
      );
      setShowRate(true);
      setCurrentBookingId(1); // Assuming 99 is the bookingId you want to use
      setCurrentUserId(userId);
      setCurrentHotelId(hotelDetail.hotelId);
      setCurrentOrderHotelHeaderId(headerId);
      setCurrentHotelName(hotelDetail.hotelName); // Assuming hotelName is a property of hotelDetail
      setCurrentRoomName(hotelDetail.roomName);
      setCurrentRoomImageURL(roomImage ? roomImage.roomImageURL : null);
    } else {
      console.error("Hotel detail not found for headerId:", headerId);
    }
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
      <div className="pt-10">
        <div className="payment-wallet">
          <h3>History</h3>
        </div>
        <div className="container py-8">
          <div className="flex my-8">
            <div className="pr-5">
              <a
                className="no-underline px-4 py-2 border text-sm font-medium listA"
                href="#"
                style={{ borderRadius: "10px" }}
                onClick={handleCartToursClick}
              >
                Tours
              </a>
            </div>
            <div>
              <a
                className="no-underline px-4 py-2 border text-sm font-medium listA"
                href="#"
                style={{ borderRadius: "10px" }}
                onClick={handleBookingCartClick}
              >
                Rooms
              </a>
            </div>
          </div>
          {isFirstDivVisible ? (
            <div className="row ">
              <div className="">
                <div
                  className="border "
                  style={{
                    borderRadius: "10px",
                    boxShadow: "0 6px 4px 0 #7F7F7F",
                  }}
                >
                  <div className="px-10 pt-7 pb-12">
                    <div className="row border-solid border-b-2 border-black pb-3">
                      <div className="col-lg-6 col-md-4 max-[768px]:hidden">
                        <span
                          className="font-bold text-lg max-[555px]:text-xs"
                          style={{ color: "#305A61" }}
                        >
                          Tours
                        </span>
                      </div>
                      <div className="col-lg-6 col-md-8 col-12 row">
                        <div className="col-lg-4 col-md-3 col-3 max-[400px]:col-3 text-center max-[400px]:hidden">
                          <span
                            className="font-bold text-lg max-[555px]:text-xs"
                            style={{ color: "#305A61" }}
                          >
                            OrderDate
                          </span>
                        </div>
                        <div className="col-lg-2 col-md-3 col-2 max-[400px]:col-4 text-center ">
                          <span
                            className="font-bold text-lg max-[555px]:text-xs"
                            style={{ color: "#305A61" }}
                          >
                            Quantity
                          </span>
                        </div>
                        <div className="col-lg-2 col-md-2 col-2 max-[400px]:col-2 max-[400px]:ml-6 text-center ">
                          <span
                            className="font-bold text-lg max-[555px]:text-xs  max-[370px]:ml-2"
                            style={{ color: "#305A61" }}
                          >
                            Total
                          </span>
                        </div>
                        <div className="col-lg-2 col-md-2 col-2 max-[400px]:col-3 max-[400px]:ml-2 text-center ">
                          <span
                            className="font-bold text-lg max-[555px]:text-xs  max-[370px]:ml-3"
                            style={{ color: "#305A61" }}
                          >
                            Status
                          </span>
                        </div>
                        <div className="col-lg-2 col-md-2 col-3 max-[400px]:col-2 text-center max-[400px]:ml-4">
                          <span
                            className="font-bold text-lg max-[555px]:text-xs max-[370px]:ml-6"
                            style={{ color: "#305A61" }}
                          >
                            Action
                          </span>
                        </div>
                      </div>
                    </div>
                    {orderTourHeader.length > 0 ? (
                      orderTourHeader.map((header, index) => (
                        <div className="row pt-10" key={index}>
                          <div className="col-lg-6 col-md-4 col-0 flex items-center">
                            <div className="col-lg-2 col-md-6 col-12 max-[768px]:hidden">
                              {tourImages.filter((image) =>
                                tourDetails[header.id]?.some(
                                  (detail) => detail.tourId === image.tourId
                                )
                              ).length >= 2 ? (
                                <Slider {...settings}>
                                  {tourImages
                                    .filter((image) =>
                                      tourDetails[header.id]?.some(
                                        (detail) =>
                                          detail.tourId === image.tourId
                                      )
                                    )
                                    .map((image) => (
                                      <div key={image.tourImageId} className="">
                                        <img
                                          style={{ borderRadius: "10px" }}
                                          className="w-3/4 h-12 border rounded-lg mx-auto"
                                          src={image.tourImageURL}
                                          alt="tour thumbnail"
                                        />
                                      </div>
                                    ))}
                                </Slider>
                              ) : tourImages.filter((image) =>
                                  tourDetails[header.id]?.some(
                                    (detail) => detail.tourId === image.tourId
                                  )
                                ).length === 1 ? (
                                tourImages
                                  .filter((image) =>
                                    tourDetails[header.id]?.some(
                                      (detail) => detail.tourId === image.tourId
                                    )
                                  )
                                  .map((image) => (
                                    <div key={image.tourImageId} className="">
                                      <img
                                        style={{ borderRadius: "10px" }}
                                        className="w-3/4 h-12 border rounded-lg mx-auto"
                                        src={image.tourImageURL}
                                        alt="tour thumbnail"
                                      />
                                    </div>
                                  ))
                              ) : (
                                <img
                                  style={{ borderRadius: "10px" }}
                                  className="w-full h-12 border rounded-lg"
                                  src="/path/to/default/image.jpg"
                                  alt="default thumbnail"
                                />
                              )}
                            </div>
                            <div className="w-2/5 ml-4 max-[992px]:text-xs max-[768px]:hidden">
                              <span>
                                {tourDetails[header.id]
                                  ?.map((detail) => detail.tourName)
                                  .join(", ")}
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-8 col-12 row ">
                            <div className="col-lg-4 col-md-4 col-3 flex items-center content-center justify-evenly  max-[400px]:hidden">
                              <div>
                                <span className="max-[500px]:text-xs ">
                                  {new Date(
                                    header.tourOrderDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-2 max-[400px]:col-4 max-[400px]:ml-2 flex items-center content-center justify-evenly ">
                              <div className="max-[500px]:text-xs">
                                {tourDetails[header.id]
                                  ?.map((detail) => detail.tourOrderQuantity)
                                  .join(", ")}
                              </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-2 max-[400px]:col-3 max-[400px]:ml-2 flex items-center content-center justify-evenly ">
                              <div className="max-[500px]:text-xs">
                                {header.totalPrice}$
                              </div>
                            </div>
                            <div
                              className="col-lg-2 col-md-2 col-2 max-[400px]:col-2 max-[400px]:ml-4 flex items-center content-center justify-evenly max-[500px]:text-xs "
                              style={{ color: "#32CD32", fontWeight: "bold" }}
                            >
                              {header.process}
                            </div>
                            <div className="col-lg-2 col-md-2 col-3  max-[400px]:col-2    flex items-center content-center justify-evenly max-[400px]:ml-4 ">
                              <a href="#" style={{ display: "flex" }}>
                                <img
                                  className="w-6"
                                  src="/image/infor.png"
                                  alt=""
                                  onClick={() => {
                                    console.log("Clicked on tour info icon"); // Log kiểm tra sự kiện
                                    setOrderTourHeaderId(header.id);
                                    setCurrentOrderTourHeader(header);
                                    setShowTourBookingDetail(true);
                                  }}
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12">
                        <p className="text-center py-4 text-red-600 font-bold">
                          No history
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row ">
              <div className="">
                <div
                  className="border "
                  style={{
                    borderRadius: "10px",
                    boxShadow: "0 6px 4px 0 #7F7F7F",
                  }}
                >
                  <div className="px-10 pt-7 pb-12">
                    <div className="row border-solid border-b-2 border-black pb-3">
                      <div className="col-lg-6 col-md-4 max-[768px]:hidden">
                        <span
                          className="font-bold text-lg max-[555px]:text-xs"
                          style={{ color: "#305A61" }}
                        >
                          Rooms
                        </span>
                      </div>
                      <div className="col-lg-6 col-md-8 col-12 row">
                        <div className="col-lg-4 col-md-3 col-3 max-[400px]:col-3 text-center max-[400px]:hidden">
                          <span
                            className="font-bold text-lg max-[555px]:text-xs"
                            style={{ color: "#305A61" }}
                          >
                            CheckIn
                          </span>
                        </div>
                        <div className="col-lg-2 col-md-3 col-2 max-[400px]:col-4 text-center ">
                          <span
                            className="font-bold text-lg max-[555px]:text-xs"
                            style={{ color: "#305A61" }}
                          >
                            CheckOut
                          </span>
                        </div>
                        <div className="col-lg-2 col-md-2 col-2 max-[400px]:col-2 max-[400px]:ml-6 text-center ">
                          <span
                            className="font-bold text-lg max-[555px]:text-xs  max-[370px]:ml-2"
                            style={{ color: "#305A61" }}
                          >
                            Total
                          </span>
                        </div>
                        <div className="col-lg-2 col-md-2 col-2 max-[400px]:col-3 max-[400px]:ml-2 text-center ">
                          <span
                            className="font-bold text-lg max-[555px]:text-xs  max-[370px]:ml-3"
                            style={{ color: "#305A61" }}
                          >
                            Status
                          </span>
                        </div>
                        <div className="col-lg-2 col-md-2 col-3 max-[400px]:col-2 text-center max-[400px]:ml-4">
                          <span
                            className="font-bold text-lg max-[555px]:text-xs max-[370px]:ml-6"
                            style={{ color: "#305A61" }}
                          >
                            Action
                          </span>
                        </div>
                      </div>
                    </div>
                    {orderHotelHeader.length > 0 ? (
                      orderHotelHeader.map((header, index) => (
                        <div className="row pt-10" key={index}>
                          <div className="col-lg-6 col-md-4 col-0 flex items-center">
                            <div className="col-lg-2 col-md-6 col-12 max-[768px]:hidden">
                              {roomImages.filter((image) =>
                                hotelDetails[header.id]?.some(
                                  (detail) => detail.roomId === image.roomId
                                )
                              ).length >= 2 ? (
                                <Slider {...settings}>
                                  {roomImages
                                    .filter((image) =>
                                      hotelDetails[header.id]?.some(
                                        (detail) =>
                                          detail.roomId === image.roomId
                                      )
                                    )
                                    .map((image) => (
                                      <div key={image.roomImageId} className="">
                                        <img
                                          style={{ borderRadius: "10px" }}
                                          className="w-3/4 h-12 border rounded-lg mx-auto"
                                          src={image.roomImageURL}
                                          alt="room thumbnail"
                                        />
                                      </div>
                                    ))}
                                </Slider>
                              ) : roomImages.filter((image) =>
                                hotelDetails[header.id]?.some(
                                    (detail) => detail.roomId === image.roomId
                                  )
                                ).length === 1 ? (
                                roomImages
                                  .filter((image) =>
                                    hotelDetails[header.id]?.some(
                                      (detail) => detail.roomId === image.roomId
                                    )
                                  )
                                  .map((image) => (
                                    <div key={image.roomImageId} className="">
                                      <img
                                        style={{ borderRadius: "10px" }}
                                        className="w-3/4 h-12 border rounded-lg mx-auto"
                                        src={image.roomImageURL}
                                        alt="room thumbnail"
                                      />
                                    </div>
                                  ))
                              ) : (
                                <img
                                  style={{ borderRadius: "10px" }}
                                  className="w-full h-12 border rounded-lg"
                                  src="/path/to/default/image.jpg"
                                  alt="default thumbnail"
                                />
                              )}
                            </div>
                            <div className="w-2/5 ml-4 max-[992px]:text-xs max-[768px]:hidden">
                              <span>
                                {hotelDetails[header.id]
                                  ?.map((detail) => detail.roomName)
                                  .join(", ")}
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-8 col-12 row ">
                            <div className="col-lg-4 col-md-4 col-3 flex items-center content-center justify-evenly  max-[400px]:hidden">
                              <div>
                                <span className="max-[500px]:text-xs ">
                                  {new Date(
                                    header.checkInDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-2 max-[400px]:col-4 max-[400px]:ml-2 flex items-center content-center justify-evenly ">
                              <div className="max-[500px]:text-xs">
                                {new Date(
                                  header.checkOutDate
                                ).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-2 max-[400px]:col-3 max-[400px]:ml-2 flex items-center content-center justify-evenly ">
                              <div className="max-[500px]:text-xs">
                                {header.totalPrice}$
                              </div>
                            </div>
                            <div
                              className="col-lg-2 col-md-2 col-2 max-[400px]:col-2 max-[400px]:ml-4 flex items-center content-center justify-evenly max-[500px]:text-xs "
                              style={{ color: "#32CD32", fontWeight: "bold" }}
                            >
                              {header.process}
                            </div>
                            <div className="col-lg-2 col-md-2 col-3  max-[400px]:col-2 flex items-center content-center justify-evenly max-[400px]:ml-4 ">
                              <a href="#" className="flex items-center">
                                {!feedbackStatus[header.id] && (
                                  <img
                                    className="w-6 mr-3"
                                    src="/image/feedback.png"
                                    alt=""
                                    onClick={() =>
                                      handleFeedbackClick(
                                        header.id,
                                        header.userId
                                      )
                                    }
                                  />
                                )}

                                <img
                                  className="w-6"
                                  src="/image/infor.png"
                                  alt=""
                                  onClick={() => {
                                    setOrderHotelHeaderId(header.id);
                                    setCurrentOrderHotelHeader(header);
                                    setShowRoomBookingDetail(true);
                                  }}
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12">
                        <p className="text-center py-4 text-red-600 font-bold">
                          No history
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Rates
        showRate={showRate}
        setShowRate={setShowRate}
        bookingId={currentBookingId}
        userId={currentUserId}
        hotelId={currentHotelId}
        orderHotelHeaderId={currentOrderHotelHeaderId}
        hotelName={currentHotelName}
        roomName={currentRoomName}
        roomImageURL={currentRoomImageURL}
      />
      <TourBookingDetail
        showTourBookingDetail={showTourBookingDetail}
        setShowTourBookingDetail={setShowTourBookingDetail}
        orderTourHeaderId={Number(orderTourHeaderId)}
        orderTourHeader={currentOrderTourHeader}
        setOrderTourHeader={setCurrentOrderTourHeader}
      />
      <RoomBookingDetail
        showRoomBookingDetail={showRoomBookingDetail}
        setShowRoomBookingDetail={setShowRoomBookingDetail}
        orderHotelHeaderId={Number(orderHotelHeaderId)}
        orderHotelHeader={currentOrderHotelHeader}
        setOrderHotelHeader={setCurrentOrderHotelHeader}
      />
    </>
  );
};

export default Booking_History;
