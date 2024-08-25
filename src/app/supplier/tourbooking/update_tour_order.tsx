"use client";
import orderTourHeaderService from "@/app/services/orderTourHeaderService";
import supplierService from "@/app/services/supplierService";
import tourService from "@/app/services/tourService";
import userService from "@/app/services/userService";

import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import { format } from "date-fns";

interface IProps {
  showModalEditTourOrder: boolean;
  setShowModalEditTourOrder: (value: boolean) => void;
  orderTourHeader: IOrderTourHeader | null;
  setOrderTourHeader: (value: IOrderTourHeader[]) => void;
  orderTourDetail: IOrderTourDetail | null;
  setOrderTourDetail: (value: IOrderTourDetail) => void;
}

const UpdateTourOrder = (props: IProps) => {
  const [supplierId, setSupplierId] = useState<number | null>(null);
  useEffect(() => {
    const fetchSupplierId = async () => {
      try {
        const supplier = await supplierService.getSupplierById();
        setSupplierId(supplier.supplierId);
      } catch (error) {
        toast.error("Failed to fetch supplier ID");
      }
    };
    fetchSupplierId();
  }, []);
  const {
    showModalEditTourOrder,
    setShowModalEditTourOrder,
    orderTourHeader,
    setOrderTourHeader,
    orderTourDetail,
    setOrderTourDetail,
  } = props;
  const [orderTourHeaderId, setOrderTourHeaderId] = useState<number>(0);
  const [userId, setUserId] = useState<number>(0);
  const [tourId, setTourId] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [tourOrderQuantity, setTourOrderQuantity] = useState<number>(0);
  const [tourTotalPrice, setTourTotalPrice] = useState<number>(0);
  const [tourOrderDate, setTourOrderDate] = useState<string | Date>("");
  const [tourName, setTourName] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [process, setProcess] = useState<string>("");
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (orderTourHeader && orderTourDetail) {
      setOrderTourHeaderId(orderTourHeader.id);
      setUserId(orderTourHeader.userId);
      setTourId(orderTourDetail.tourId);
      setTotalPrice(orderTourHeader.totalPrice);
      setTourOrderQuantity(orderTourDetail.tourOrderQuantity);
      setTourOrderDate(orderTourHeader.tourOrderDate);
      setTourTotalPrice(orderTourDetail.tourTotalPrice);
      setTourName(orderTourDetail.tourName);
      setFullName(orderTourHeader.fullName);
      setEmail(orderTourHeader.email);
      setPhone(orderTourHeader.phone);
      setProcess(orderTourHeader.process);
      setCompleted(orderTourHeader.completed);
    }
  }, [orderTourHeader, orderTourDetail]);
  const { data: listTour } = useSWR("tourList", tourService.getTours);
const { data: listUser } = useSWR("userList", userService.getUsers);
  const handleCloseModal = () => {
    setShowModalEditTourOrder(false);
  };
  const getItemName = (
    list: any[] | undefined,
    id: number,
    idField: string,
    nameField: string
  ) => {
    const item = list?.find((item: any) => item[idField] === id);
    return item ? item[nameField] : "N/A";
  };
  const handleSubmit = async () => {
    try {
      const response = await orderTourHeaderService.updateOrderTourHeader({
        id: orderTourHeaderId,
        process,
      });
      if (typeof response === "string") {
        toast.success(response);
      } else {
        toast.success("Update tour order Success");
      }
      mutate("orderTourData");
      handleCloseModal();
    } catch (error) {
      toast.error("Update Error");
      console.error(error);
    }
  };

  if (!orderTourHeader) {
    return null; // or a loading indicator if needed
  }

  return (
    <>
      <Modal
        show={showModalEditTourOrder}
        onHide={() => handleCloseModal()}
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Tour Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label className="font-semibold">User</Form.Label>
                  <Form.Control
                    readOnly
                    style={{ backgroundColor: "#CED1D2" }}
                    className="font-semibold"
                    type="text"
                    value={getItemName(listUser, userId, "userId", "email")}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="font-semibold">
                    Tour Order Date
                  </Form.Label>
                  <Form.Control
                    readOnly
                    className="font-semibold"
                    style={{ backgroundColor: "#CED1D2" }}
                    type="date"
                    value={
                      tourOrderDate
                        ? format(new Date(tourOrderDate), "yyyy-MM-dd")
                        : ""
                    }
                    onChange={(e) => setTourOrderDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="font-semibold">Total Price</Form.Label>
                  <Form.Control
                    readOnly
                    style={{ backgroundColor: "#CED1D2" }}
                    type="number"
                    className="font-semibold"
                    value={tourTotalPrice}
                    onChange={(e) => setTourTotalPrice(Number(e.target.value))}
                  />
                </Form.Group>
              </div>
<div className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label className="font-semibold">Tour Name</Form.Label>
                  <Form.Control
                    readOnly
                    style={{ backgroundColor: "#CED1D2" }}
                    className="font-semibold"
                    type="text"
                    value={getItemName(listTour, tourId, "tourId", "tourName")}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="font-semibold">
                    Tour Quantity
                  </Form.Label>
                  <Form.Control
                    readOnly
                    style={{ backgroundColor: "#CED1D2" }}
                    type="number"
                    className="font-semibold"
                    value={tourOrderQuantity}
                    onChange={(e) =>
                      setTourOrderQuantity(Number(e.target.value))
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="font-semibold">Process</Form.Label>
                  <Form.Control
                    className={
                      process === "Paid" ? "color-paid" : "color-active"
                    }
                    as="select"
                    value={process}
                    onChange={(e) => setProcess(e.target.value)}
                  >
                    <option className="color-paid" value="Paid">
                      Paid
                    </option>
                    <option className="color-active" value="Success">
                      Success
                    </option>
                  </Form.Control>
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="text-black font-semibold border"
            style={{ backgroundColor: "white", borderRadius: "10px" }}
            onClick={() => handleCloseModal()}
          >
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#305A61", borderRadius: "10px" }}
            onClick={() => handleSubmit()}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default UpdateTourOrder;