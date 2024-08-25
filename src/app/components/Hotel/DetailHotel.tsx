import { ITour } from "@/app/entities/tour";
import { revalidateTours, updateTour } from "@/app/services/tourService";
import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import { mutate } from "../../../../node_modules/swr/dist/core/index";
interface IProps {
  showHotelDetail: boolean;
  setShowHotelDetail: (value: boolean) => void;
  hotel: IHotel | null;
  setHotel: (value: IHotel | null) => void;
}
function DetailHotel(props: IProps) {
  const { showHotelDetail, setShowHotelDetail, hotel, setHotel } = props;

  const [hotelName, setHotelName] = useState<string>("");
  const [hotelPhone, setHotelPhone] = useState<string>("");
  const [hotelEmail, setHotelEmail] = useState<string>("");
  const [hotelAvatar, setHotelAvatar] = useState<string>("");
  const [hotelFulDescription, setHotelFullDescription] = useState<string>("");
  const [hotelDistrict, setHotelDistrict] = useState<string>("");
  const [hotelCity, setHotelCity] = useState<string>("");
  const [hotelInformation, setHotelInformation] = useState<string>("");

  const formattedDescription = hotelFulDescription
    .split(".")
    .map((sentence, index) => (
      // Thêm thẻ <br/> vào cuối mỗi câu, bỏ qua câu cuối cùng
      <React.Fragment key={index}>
        {sentence && (
          <>
            <span className="big-dot">. </span>
            {sentence.trim()}
            <br />
          </>
        )}
      </React.Fragment>
    ));

  useEffect(() => {
    if (hotel && hotel.hotelId) {
      setHotelName(hotel.hotelName);
      setHotelPhone(hotel.hotelPhone);
      setHotelEmail(hotel.hotelEmail);
      setHotelFullDescription(hotel.hotelFulDescription);
      setHotelDistrict(hotel.hotelDistrict);
      setHotelCity(hotel.hotelCity);
      setHotelInformation(hotel.hotelInformation);
    }
  }, [hotel]);
  

  const handleClosedDetail = () => {
    setHotel(null);
    setShowHotelDetail(false);
  };
  return (
    <>
      <Modal
        className="pt-16 "
        show={showHotelDetail}
        onHide={() => handleClosedDetail()}
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="padding-tour-detail ">
          <Form>
            <div className="row">
              <Form.Group className="mb-3 col-6" controlId="tourName">
                <Form.Label className="font-bold text-xl">
                  Hotel Name
                </Form.Label>
                <p>{hotelName}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="tourTime">
                <Form.Label className="font-bold text-xl">
                  Hotel Phone
                </Form.Label>
                <p>{hotelPhone}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="tourTransportation">
                <Form.Label className="font-bold text-xl">
                  Hotel Email
                </Form.Label>
                <p>{hotelEmail}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="tourPrice">
                <Form.Label className="font-bold text-xl">
                  Hotel District
                </Form.Label>
                <p>{hotelDistrict}$</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="tourAddress">
                <Form.Label className="font-bold text-xl">
                  Hotel City
                </Form.Label>
                <p>{hotelCity}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="tourCapacity">
                <Form.Label className="font-bold text-xl">
                  Hotel Information
                </Form.Label>
                <p>{hotelInformation}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-12" controlId="tourDescription">
                <Form.Label className="font-bold text-xl">
                  Hotel Description
                </Form.Label>
                <p>{formattedDescription}</p>
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}
export default DetailHotel;
