"use client";
import hotelService from "@/app/services/hotelService";
import roomService from "@/app/services/roomService";
import userService from "@/app/services/userService";

import { useEffect, useState, useMemo } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import useSWR from "swr";

interface IProps {
  showModalBookingDetail: boolean;
  setShowModalBookingDetail: (value: boolean) => void;
  orderHotelHeader: IOrderHotelHeader | null;
  setOrderHotelHeader: (value: IOrderHotelHeader[]) => void;
  orderHotelDetail: IOrderHotelDetail | null;
  setOrderHotelDetail: (value: IOrderHotelDetail) => void;
}

const BookingDetail = (props: IProps) => {
  const {
    showModalBookingDetail,
    setShowModalBookingDetail,
    orderHotelHeader,
    setOrderHotelHeader,
    orderHotelDetail,
    setOrderHotelDetail,
  } = props;

  const [orderHotelHeaderlId, setOrderHotelHeaderId] = useState<number>(0);
  const [userId, setUserId] = useState<number>(0);
  const [hotelId, setHotelId] = useState<number>(0);
  const [roomId, setRoomId] = useState<number>(0);
  const [hotelName, setHotelName] = useState<string>("");
  const [checkInDate, setCheckInDate] = useState<string | Date>("");
  const [checkOutDate, setCheckOutDate] = useState<string | Date>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [roomQuantity, setRoomQuantity] = useState<number>(0);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [process, setProcess] = useState<string>("");
  const [completed, setCompleted] = useState<boolean>(false);
  const [requirement, setRequirement] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");

  useEffect(() => {
    if (orderHotelHeader && orderHotelDetail) {
      // console.log("Order Hotel Header:", orderHotelHeader);
      // console.log("Order Hotel Detail:", orderHotelDetail);
      setOrderHotelHeaderId(orderHotelHeader.id);
      setUserId(orderHotelHeader.userId);
      setHotelId(orderHotelDetail.hotelId);
      setRoomId(orderHotelDetail.roomId);
      setCheckInDate(orderHotelHeader.checkInDate);
      setCheckOutDate(orderHotelHeader.checkOutDate);
      setTotalPrice(orderHotelHeader.totalPrice);
      setVoucherCode(orderHotelHeader.voucherCode);
      setRoomQuantity(orderHotelDetail.roomQuantity);
      setFullName(orderHotelHeader.fullName);
      setEmail(orderHotelHeader.email);
      setPhone(orderHotelHeader.phone);
      setProcess(orderHotelHeader.process);
      setCompleted(orderHotelHeader.completed);
      setRequirement(orderHotelHeader.requirement);
      setRoomName(orderHotelDetail.roomName);
      setHotelName(orderHotelDetail.hotelName);
    }
  }, [orderHotelHeader, orderHotelDetail]);

  const handleCloseModal = () => {
    setShowModalBookingDetail(false);
  };

  return (
    <>
      <Modal
        show={showModalBookingDetail}
        onHide={handleCloseModal}
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Room Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <Form.Group className="mb-3 col-6" controlId="Full Name">
                <Form.Label className="font-bold text-xl">Full Name</Form.Label>
                <p>{fullName}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="totalPrice">
                <Form.Label className="font-bold text-xl">
                  Total Price
                </Form.Label>
                <p>${totalPrice}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="Full Name">
                <Form.Label className="font-bold text-xl">Email</Form.Label>
                <p>{email}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="Full Name">
                <Form.Label className="font-bold text-xl">Phone</Form.Label>
                <p>{phone}</p>
              </Form.Group>
              
              <Form.Group className="mb-3 col-6" controlId="hotelName">
                <Form.Label className="font-bold text-xl">
                  Hotel Name
                </Form.Label>
                <p>{hotelName}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="roomName">
                <Form.Label className="font-bold text-xl">Room Name</Form.Label>
                <p>{roomName}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="checkInDate">
                <Form.Label className="font-bold text-xl">
                  Check In Date
                </Form.Label>
                <p>{new Date(checkInDate).toLocaleDateString()}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="checkOutDate">
                <Form.Label className="font-bold text-xl">
                  Check Out Date
                </Form.Label>
                <p>{new Date(checkOutDate).toLocaleDateString()}</p>
              </Form.Group>
              
              <Form.Group className="mb-3 col-6" controlId="roomQuantity">
                <Form.Label className="font-bold text-xl">
                  Room Quantity
                </Form.Label>
                <p>{roomQuantity}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="voucherCode">
                <Form.Label className="font-bold text-xl">
                  Voucher Code
                </Form.Label>
                <p>{voucherCode}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="userNote">
                <Form.Label className="font-bold text-xl">
                  Requirement
                </Form.Label>
                <p>{requirement}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="isConfirmed">
                <Form.Label className="font-bold text-xl">Process</Form.Label>
                <p
                  className={`whitespace-nowrap ${
                    process === "Paid" ? "color-paid" : "color-active"
                  }`}
                >
                  {process}
                </p>
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BookingDetail;