"use client";
import { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import Slider from "react-slick";
import roomImageService from "@/app/services/roomImageService";
import orderHotelDetailService from "@/app/services/orderHotelDetailService";
import commentService from "@/app/services/commentService";
import rateService from "@/app/services/rateService";
import { Oval } from "react-loader-spinner";
import orderTourDetailService from "@/app/services/orderTourDetailService";
import tourImageService from "@/app/services/tourImageService";

interface IProps {
  showTourBookingDetail: boolean;
  setShowTourBookingDetail: (value: boolean) => void;
  orderTourHeaderId: number | null;
  orderTourHeader: IOrderTourHeader | null;
  setOrderTourHeader: (value: IOrderTourHeader | null) => void;
}

function TourBookingDetail(props: IProps) {
  const {
    showTourBookingDetail,
    setShowTourBookingDetail,
    orderTourHeaderId,
    orderTourHeader,
    setOrderTourHeader,
  } = props;
  const [orderTourDetail, setOrderTourDetail] =
    useState<IOrderTourDetail | null>(null);

  const [tourImages, setTourImages] = useState<ITourImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const handleCloseModal = () => {
    setShowTourBookingDetail(false);
  };

  useEffect(() => {
    const fetchTourBookingDetail = async () => {
      if (orderTourHeaderId !== null) {
        try {
          const tourBookingDetail =
            await orderTourDetailService.getOrderTourDetailByOrderTourHeaderId(
              orderTourHeaderId
            );
          setOrderTourDetail(tourBookingDetail);
          fetchTourImages(Number(tourBookingDetail.tourId));
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchTourBookingDetail();
  }, [orderTourHeaderId]);

  const fetchTourImages = async (TourId: number) => {
    const images = await tourImageService.getTourImageByTourId(TourId);
    setTourImages(images);
    if (images.length > 0) {
      setSelectedImage(images[0].tourImageURL);
    }
  };

  const thumbnailSliderSettings = {
    slidesToShow: tourImages.length < 4 ? tourImages.length : 4,
    slidesToScroll: 1,
    focusOnSelect: true,
  };

  if (!orderTourDetail || !orderTourHeader) {
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

  return (
    <Modal
      className="pt-16"
      show={showTourBookingDetail}
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: "bold" }}>
          {orderTourDetail?.tourName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="padding-tour-detail">
        <Row>
          <Col lg={8}>
            <div className="main-image-container mb-3">
              <img
                className="w-100 h-auto rounded-lg"
                src={selectedImage}
                alt="Selected room"
              />
            </div>
            <Slider
              {...thumbnailSliderSettings}
              className="thumbnail-slider mt-2"
            >
              {tourImages.map((image) => (
                <div
                  key={image.tourImageId}
                  className="slide-flex"
                  onClick={() => setSelectedImage(image.tourImageURL)}
                >
                  <img
                    className={`w-100 h-auto border rounded-lg ${
                      image.tourImageURL === selectedImage ? "blur" : ""
                    }`}
                    src={image.tourImageURL}
                    alt="room thumbnail"
                  />
                </div>
              ))}
            </Slider>
          </Col>
          <Col lg={4}>
            <div className="max-[992px]:pt-2">
              <h5 style={{ fontWeight: "bold" }}>Tour Information:</h5>
              <p>
                <strong>Tour name:</strong>{" "}
                <span>{orderTourDetail?.tourName}</span>
              </p>
              <p>
                <strong>User name:</strong>{" "}
                <span>{orderTourHeader?.fullName}</span>
              </p>
              <p>
                <strong>User email:</strong>{" "}
                <span>{orderTourHeader?.email}</span>
              </p>
              <p>
                <strong>User phone:</strong>{" "}
                <span>{orderTourHeader?.phone}</span>
              </p>
            </div>
            <p>
              <strong>Tour quantity:</strong>{" "}
              <span>{orderTourDetail?.tourOrderQuantity}</span>
            </p>
            <div className="price-section">
              <h4 style={{ fontWeight: "bold", color: "rgb(255, 94, 31)" }}>
                Total Price: {orderTourHeader?.totalPrice} $
              </h4>
              {/* <h6 style={{ fontWeight: "bold" }}>Check in date: {orderTourHeader?.checkInDate ? new Date(orderHotelHeader.checkInDate).toLocaleDateString() : "N/A"}</h6>
              <h6 style={{ fontWeight: "bold" }}>Check out date: {orderTourHeader?.checkOutDate ? new Date(orderHotelHeader.checkOutDate).toLocaleDateString() : "N/A"}</h6> */}

             <div className="flex justify-center pt-6">
             <button
                className="btn btn-primary"
                style={{
                  backgroundColor: "rgb(48, 90, 97)",
                  marginTop: "20px",
                }}
                onClick={handleCloseModal}
              >
                See another tour booking
              </button>
             </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default TourBookingDetail;
