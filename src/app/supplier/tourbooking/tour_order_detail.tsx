import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import useSWR from "swr";

interface IProps {
  showModalTourOrderDetail: boolean;
  setShowModalTourOrderDetail: (value: boolean) => void;
  orderTourHeader: IOrderTourHeader | null;
  setOrderTourHeader: (value: IOrderTourHeader[]) => void;
  orderTourDetail: IOrderTourDetail | null;
  setOrderTourDetail: (value: IOrderTourDetail) => void;
}

const TourOrderDetail = (props: IProps) => {
  const {
    showModalTourOrderDetail,
    setShowModalTourOrderDetail,
    orderTourHeader,
    setOrderTourHeader,
    orderTourDetail,
    setOrderTourDetail,
  } = props;

  const [orderHotelHeaderlId, setOrderHotelHeaderId] = useState<number>(0);
  const [userId, setUserId] = useState<number>(0);
  const [tourId, setTourId] = useState<number>(0);
  const [tourOrderQuantity, setTourOrderQuantity] = useState<number>(0);
  const [tourOrderDate, setTourOrderDate] = useState<string | Date>("");
  const [fullName, setFullName] = useState<string>("");
  const [tourName, setTourName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [completed, setIsCompleted] = useState<boolean>(false);
  const [process, setProcess] = useState<string>("");

  useEffect(() => {
    if (orderTourHeader && orderTourDetail) {
      setOrderHotelHeaderId(orderTourHeader.id);
      setUserId(orderTourHeader.userId);
      setTourId(orderTourDetail.tourId);
      setTourOrderQuantity(orderTourDetail.tourOrderQuantity);
      setTourOrderDate(orderTourHeader.tourOrderDate);
      setTotalPrice(orderTourHeader.totalPrice);
      setIsCompleted(orderTourHeader.completed);
      setProcess(orderTourHeader.process);
      setTourName(orderTourDetail.tourName);
      setFullName(orderTourHeader.fullName);
      setPhone(orderTourHeader.phone);
      setEmail(orderTourHeader.email);
    }
  }, [orderTourHeader, orderTourDetail]);

  const handleCloseModal = () => {
    setShowModalTourOrderDetail(false);
  };

  return (
    <>
      <Modal
        show={showModalTourOrderDetail}
        onHide={() => handleCloseModal()}
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Tour Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <Form.Group className="mb-3 col-6" controlId="userName">
                <Form.Label className="font-bold text-xl">Full Name</Form.Label>
                <p>{fullName}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="userName">
                <Form.Label className="font-bold text-xl">Email</Form.Label>
                <p>{email}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="userName">
                <Form.Label className="font-bold text-xl">Phone</Form.Label>
                <p>{phone}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="hotelName">
                <Form.Label className="font-bold text-xl">Tour Name</Form.Label>
                <p>{tourName}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="checkInDate">
                <Form.Label className="font-bold text-xl">Tour Date</Form.Label>
                <p>{new Date(tourOrderDate).toLocaleDateString()}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="checkOutDate">
                <Form.Label className="font-bold text-xl">
                  Tour Quantity
                </Form.Label>
                <p>{tourOrderQuantity}</p>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="totalPrice">
                <Form.Label className="font-bold text-xl">
                  Total Price
                </Form.Label>
                <p>{totalPrice}</p>
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
export default TourOrderDetail;