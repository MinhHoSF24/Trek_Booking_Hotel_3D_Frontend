"use client";
import { useEffect, useState } from "react";
import { Col, Row, Modal } from "react-bootstrap";
import Slider from "react-slick";
import roomImageService from "@/app/services/roomImageService";
import serviceOfRoom from "@/app/services/serviceOfRoom";
import { orange } from "@mui/material/colors";

interface IProps {
  showRoomDetail: boolean;
  setShowRoomDetail: (value: boolean) => void;
  hotelId: string;
  room: IRoom | null;
  setRoom: (value: IRoom | null) => void;
}

function DetailRoomClient(props: IProps) {
  const { showRoomDetail, setShowRoomDetail, hotelId, room, setRoom } = props;
  const [roomId, setRoomId] = useState<number>(0);
  const [roomName, setRoomName] = useState<string>("");
  const [roomNote, setNote] = useState<string>("");
  const [discountPercent, setDiscount] = useState<string>("");
  const [roomDescription, setDescription] = useState<string>("");
  const [roomAvailable, setAvailable] = useState<string>("");
  const [roomPrice, setPrice] = useState<string>("");
  const [roomCapacity, setCapacity] = useState<string>("");
  const [roomImages, setRoomImages] = useState<IRoomImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [roomServices, setRoomServices] = useState<IService[]>([]);

  const handleCloseModal = async () => {
    setShowRoomDetail(false);
  };

  useEffect(() => {
    if (room && room.roomId) {
      setRoomId(room.roomId);
      setRoomName(room.roomName);
      setNote(room.roomNote);
      setAvailable(room.roomAvailable.toString());
      setPrice(room.roomPrice.toString());
      setCapacity(room.roomCapacity.toString());
      setDiscount(room.discountPercent.toString());
      setDescription(room.roomDescription);
      fetchRoomImages(room.roomId);
      fetchRoomServices(room.roomId);
    }
  }, [room]);

  const fetchRoomImages = async (roomId: number) => {
    const images = await roomImageService.getRoomImageByRoomId(roomId);
    setRoomImages(images);
    if (images.length > 0) {
      setSelectedImage(images[0].roomImageURL);
    }
  };

  const fetchRoomServices = async (roomId: number) => {
    const services = await serviceOfRoom.getServiceByRoomId(roomId);
    setRoomServices(services);
  };

  const formatRoomDescription = (description: string) => {
    return description.split(".").map((sentence, index) => {
      if (sentence.trim() === "") return null;
      return (
        <div key={index} className="flex items-baseline pb-2">
          <img className="w-3 h-3 mr-2" src="/image/greenTick.png" alt="tick" />
          <span className="font-medium text-xs">{sentence.trim()}.</span>
        </div>
      );
    });
  };

  const thumbnailSliderSettings = {
    slidesToShow: roomImages.length < 4 ? roomImages.length : 4,
    slidesToScroll: 1,
    focusOnSelect: true,
  };

  return (
    <Modal
      className="pt-16"
      show={showRoomDetail}
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: "bold" }}>{roomName}</Modal.Title>
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
              {roomImages.map((image) => (
                <div
                  key={image.roomImageId}
                  className="slide-flex"
                  onClick={() => setSelectedImage(image.roomImageURL)}
                >
                  <img
                    className={`w-100 h-auto border rounded-lg ${
                      image.roomImageURL === selectedImage ? "blur" : ""
                    }`}
                    src={image.roomImageURL}
                    alt="room thumbnail"
                  />
                </div>
              ))}
            </Slider>
          </Col>
          <Col lg={4}>
            <div className="max-[992px]:pt-2">
              <h5 style={{ fontWeight: "bold" }}>Room Information:</h5>
              <p className="pt-2">{formatRoomDescription(roomDescription)}</p>
              <p className="capacity" style={{ fontWeight: "bold" }}>
                Capacity: {roomCapacity}
                <img
                  className="inline-image"
                  src="/image/user.png"
                  alt="user icon"
                />
              </p>
              <h5 style={{ fontWeight: "bold" }}>Services: </h5>
             
              <div className="w-3/4 m-auto max-h-48 overflow-y-auto custom-scrollbar" >
                {roomServices.map((service) => (
                  <div
                    className="flex items-center pb-3"
                    key={service.serviceId}
                  >
                    <img
                      className="w-3 h-3 mr-2"
                      src={service.serviceImage || "/image/greenTick.png"}
                      alt={service.serviceDescription}
                    />
                    <span className="font-medium text-xs">
                      {service.serviceName}
                    </span>
                  </div>
                ))}
              </div>
              </div>
      
            <div className="price-section pt-2">

            <p className="pt-2" style={{ fontWeight: "bold"}}>Price: {roomPrice} $</p>

              <h4 className="pb-4" style={{ fontWeight: "bold", color: "rgb(255, 94, 31)"}}>
                Sale:{" "}
                {(
                  parseFloat(roomPrice) -
                  (parseFloat(roomPrice) * parseFloat(discountPercent)) / 100
                ).toFixed(2)}{" "}
                $
              </h4>

              
             <div className="flex justify-end">
             <button className="btn btn-primary mr-14" style={{ backgroundColor: 'rgb(48, 90, 97)' }} onClick={handleCloseModal}>See another room</button>
             </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default DetailRoomClient;
