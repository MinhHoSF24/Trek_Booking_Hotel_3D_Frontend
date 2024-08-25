"use client";
import { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import Slider from "react-slick";
import roomImageService from "@/app/services/roomImageService";
import orderHotelDetailService from "@/app/services/orderHotelDetailService";
import commentService from "@/app/services/commentService";
import rateService from "@/app/services/rateService";
import { Oval } from "react-loader-spinner";

interface IProps {
  showRoomBookingDetail: boolean;
  setShowRoomBookingDetail: (value: boolean) => void;
  orderHotelHeaderId: number | null;
  orderHotelHeader: IOrderHotelHeader | null;
  setOrderHotelHeader: (value: IOrderHotelHeader | null) => void;
}

function RoomBookingDetail(props: IProps) {
  const {
    showRoomBookingDetail,
    setShowRoomBookingDetail,
    orderHotelHeaderId,
    orderHotelHeader,
    setOrderHotelHeader,
  } = props;
  const [orderHotelDetail, setOrderHotelDetail] = useState<IOrderHotelDetail | null>(null);

  const [roomImages, setRoomImages] = useState<IRoomImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [comments, setComments] = useState<IComment[]>([]);
  const [rates, setRates] = useState<IRate[]>([]);
  const [combinedList, setCombinedList] = useState<(IComment & { rateValue?: number })[]>([]);

  const handleCloseModal = () => {
    setShowRoomBookingDetail(false);
  };

  useEffect(() => {
    const fetchHotelBookingDetail = async () => {
      if (orderHotelHeaderId !== null) {
        try {
          const hotelBookingDetail = await orderHotelDetailService.getOrderHotelDetailByOrderHotelHeaderId(orderHotelHeaderId);
          setOrderHotelDetail(hotelBookingDetail);
          fetchRoomImages(Number(hotelBookingDetail.roomId));
          fetchCommentsAndRates(orderHotelHeaderId);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchHotelBookingDetail();
  }, [orderHotelHeaderId]);

  const fetchRoomImages = async (roomId: number) => {
    const images = await roomImageService.getRoomImageByRoomId(roomId);
    setRoomImages(images);
    if (images.length > 0) {
      setSelectedImage(images[0].roomImageURL);
    }
  };

  const fetchCommentsAndRates = async (orderHotelHeaderId: number) => {
    try {
      const comments = await commentService.getCommentsByOrderHotelHeaderId(orderHotelHeaderId);
      setComments(comments);
      const rates = await rateService.getRatesByOrderHotelHeaderId(orderHotelHeaderId);
      setRates(rates);
      const combined = comments.map((comment: IComment) => {
        const rate = rates.find((rate: IRate) => rate.userId === comment.userId && rate.orderHotelHeaderId === comment.orderHotelHeaderId);
        return {
          ...comment,
          rateValue: rate?.rateValue,
        };
      });
      setCombinedList(combined);
    } catch (err) {
      console.error(err);
    }
  };

  const thumbnailSliderSettings = {
    slidesToShow: roomImages.length < 4 ? roomImages.length : 4,
    slidesToScroll: 1,
    focusOnSelect: true,
  };

  const renderStars = (rateValue: number) => {
    const stars = [];
    for (let i = 0; i < rateValue; i++) {
      stars.push(<img key={i} className="pr-1" src="/image/start.png" alt="star" />);
    }
    return stars;
  };

  const averageRating = () => {
    if (combinedList.length === 0) return 0;
    const totalRates = combinedList.reduce((acc, curr) => acc + (curr.rateValue || 0), 0);
    return totalRates / combinedList.length;
  };

  if (!orderHotelDetail || !orderHotelHeader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Oval height={80} width={80} color="#305A61" visible={true} ariaLabel="oval-loading" secondaryColor="#4f9a94" strokeWidth={2} strokeWidthSecondary={2} />
      </div>
    );
  }

  return (
    <Modal className="pt-16" show={showRoomBookingDetail} onHide={handleCloseModal} backdrop="static" keyboard={false} size="xl">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: "bold" }}>{orderHotelDetail?.hotelName}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="padding-tour-detail">
        <Row>
          <Col lg={8}>
            <div className="main-image-container mb-3">
              <img className="w-100 h-auto rounded-lg" src={selectedImage} alt="Selected room" />
            </div>
            <Slider {...thumbnailSliderSettings} className="thumbnail-slider mt-2">
              {roomImages.map((image) => (
                <div key={image.roomImageId} className="slide-flex" onClick={() => setSelectedImage(image.roomImageURL)}>
                  <img className={`w-100 h-auto border rounded-lg ${image.roomImageURL === selectedImage ? "blur" : ""}`} src={image.roomImageURL} alt="room thumbnail" />
                </div>
              ))}
            </Slider>
          </Col>
          <Col lg={4}>
            <div className="max-[992px]:pt-2">
              <h5 style={{ fontWeight: "bold" }}>Room Information:</h5>
              <p><strong>Room name:</strong> <span>{orderHotelDetail?.roomName}</span></p>
              <p><strong>User name:</strong> <span>{orderHotelHeader?.fullName}</span></p>
              <p><strong>User email:</strong> <span>{orderHotelHeader?.email}</span></p>
              <p><strong>User phone:</strong> <span>{orderHotelHeader?.phone}</span></p>
            </div>

            <div className="price-section">
             
              <p style={{ fontWeight: "bold" }}>Check in date: {orderHotelHeader?.checkInDate ? new Date(orderHotelHeader.checkInDate).toLocaleDateString() : "N/A"}</p>
              <p style={{ fontWeight: "bold" }}>Check out date: {orderHotelHeader?.checkOutDate ? new Date(orderHotelHeader.checkOutDate).toLocaleDateString() : "N/A"}</p>
              <h4 style={{ fontWeight: "bold", color: "rgb(255, 94, 31)" }}>Total Price: {orderHotelHeader?.totalPrice} $</h4>
              <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', marginTop: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <h5 style={{ fontWeight: "bold" }}>Reviews and Ratings:</h5>
                {combinedList.map((item, index) => (
                  <div key={index} className="py-3">
                    <div className="flex">
                      <div className="pl-2">
                        <span className="font-semibold text-sm">{item.user?.userName}</span>
                        <p className="text-xs">{new Date(item.dateSubmitted).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex h-3 my-2">{renderStars(item.rateValue || 0)}</div>
                    <span className="text-sm">{item.message}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-9 ">
              <button className="btn btn-primary " style={{ backgroundColor: "rgb(48, 90, 97)" }} onClick={handleCloseModal}>
                See another booking
              </button>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default RoomBookingDetail;
