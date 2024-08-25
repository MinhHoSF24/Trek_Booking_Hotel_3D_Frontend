"use client";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import roomService from "@/app/services/roomService";
import { mutate } from "swr";
import { toast } from "react-toastify";
import voucherService from "@/app/services/voucherService";

interface IProps {
  showVoucherUpdate: boolean;
  setShowVoucherUpdate: (value: boolean) => void;
  hotelId: string;
  voucher: IVoucher | null;
  setVoucher: (value: IVoucher | null) => void;
}

function UpdateVoucher(props: IProps) {
  const {
    showVoucherUpdate,
    setShowVoucherUpdate,
    hotelId,
    voucher,
    setVoucher,
  } = props;
  const [voucherId, setVoucherId] = useState<number>(0);
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [availableDate, setAvailableDate] = useState<string>("");
  const [expireDate, setExpireDate] = useState<string>("");
  const [voucherQuantity, setVoucherQuantity] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<string>("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isTouched, setIsTouched] = useState<{ [key: string]: boolean }>({
    voucherCode: false,
    availableDate: false,
    expireDate: false,
    voucherQuantity: false,
    discountPercent: false,
  });

  // Validate Input //
  // Lay ngay hom nay dinh dang dd-mm-yyyy
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = (today.getMonth() + 1).toString(); // thang di tu 0
    let dd = today.getDate().toString();

    if (parseInt(dd) < 10) dd = "0" + dd;
    if (parseInt(mm) < 10) mm = "0" + mm;

    return `${dd}-${mm}-${yyyy}`;
  };

  const validateAvailableDate = (availableDate: string) => {
    if (!availableDate) return "Available Date is required";
    const today = getTodayDate();
    const selectedDate = new Date(availableDate);
    if (selectedDate.toString() < today)
      return "Available Date cannot be in the past";
    return "";
  };

  const validateExpireDate = (expireDate: string, availableDate: string) => {
    if (!expireDate) return "Expired Date is required";
    const selectedExpireDate = new Date(expireDate);
    const selectedAvailableDate = new Date(availableDate);
    if (selectedExpireDate <= selectedAvailableDate)
      return "Expired Date must be after Available Date";
    return "";
  };

  const validateVoucherQuantity = (quantity: string) => {
    if (!quantity) return "Quantity is required";
    if (!quantity || isNaN(parseInt(quantity)))
      return "Quantity must be a positive number";
    return "";
  };

  const validateDiscountPercent = (discountPercent: string) => {
    if (!discountPercent) return "Discount Percent is required";
    if (!discountPercent || isNaN(parseInt(discountPercent)))
      return "Discount Percent must be a number";
    return "";
  };

  useEffect(() => {
    if (isTouched.availableDate) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        availableDate: validateAvailableDate(availableDate),
      }));
    }
  }, [availableDate, isTouched.availableDate]);

  useEffect(() => {
    if (isTouched.expireDate) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        expireDate: validateExpireDate(expireDate, availableDate),
      }));
    }
  }, [expireDate, isTouched.expireDate]);

  useEffect(() => {
    if (isTouched.voucherQuantity) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        voucherQuantity: validateVoucherQuantity(voucherQuantity),
      }));
    }
  }, [voucherQuantity, isTouched.voucherQuantity]);

  useEffect(() => {
    if (isTouched.discountPercent) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        discountPercent: validateDiscountPercent(discountPercent),
      }));
    }
  }, [discountPercent, isTouched.discountPercent]);

  const handleBlur = (field: string) => {
    setIsTouched((prevTouched) => ({ ...prevTouched, [field]: true }));
  };
  // End Validate input

  const handleSetAvailableDate = (time: string | Date) => {
    let parsedDate;
    if (time instanceof Date) {
      parsedDate = time;
    } else {
      parsedDate = new Date(time);
    }
    parsedDate.setDate(parsedDate.getDate() + 1); // Cộng thêm một ngày
    setAvailableDate(parsedDate.toISOString().split("T")[0]); // Định dạng ngày thành yyyy-MM-dd
  };

  const handleSetExpireDate = (time: string | Date) => {
    let parsedDate;
    if (time instanceof Date) {
      parsedDate = time;
    } else {
      parsedDate = new Date(time);
    }
    parsedDate.setDate(parsedDate.getDate() + 1); // Cộng thêm một ngày
    setExpireDate(parsedDate.toISOString().split("T")[0]); // Định dạng ngày thành yyyy-MM-dd
  };

  const handleCloseModal = async () => {
    setVoucherCode("");
    setAvailableDate("");
    setExpireDate("");
    setVoucherQuantity("");
    setDiscountPercent("");
    setErrors({});
    setVoucher(null);
    setShowVoucherUpdate(false);
    setIsTouched({
      voucherCode: false,
      availableDate: false,
      expireDate: false,
      voucherQuantity: false,
      discountPercent: false,
    });
  };

  useEffect(() => {
    if (voucher && voucher.voucherId) {
      setVoucherId(voucher.voucherId);
      setVoucherCode(voucher.voucherCode);
      handleSetAvailableDate(voucher.availableDate);
      handleSetExpireDate(voucher.expireDate);
      setVoucherQuantity(voucher.voucherQuantity.toString());
      setDiscountPercent(voucher.discountPercent.toString());
    }
  }, [voucher]);

  const handleSubmit = async () => {
    const validationErrors = {      
      availableDate: validateAvailableDate(availableDate),
      expireDate: validateExpireDate(expireDate, availableDate),
      voucherQuantity: validateVoucherQuantity(voucherQuantity),
      discountPercent: validateDiscountPercent(discountPercent),
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      return;
    }

    try {
      const voucher: IVoucher = {
        voucherId: Number(voucherId),
        voucherCode,
        availableDate,
        expireDate,
        voucherQuantity: parseInt(voucherQuantity),
        discountPercent: parseInt(discountPercent),
        voucherStatus: true,
        hotelId: Number(hotelId),
      };

      const updateVoucher = await voucherService.updateVoucher(voucher);

      if (typeof updateVoucher === "string") {
        toast.success(updateVoucher);
      } else {
        toast.success("Update Voucher Success");
      }
      handleCloseModal();
      mutate("listVoucher");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Voucher Code already exists") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            voucherCode: error.message,
          }));
        } else {
          toast.error("Failed to create voucher");
        }
        console.error(error);
      }
    }
  };

  return (
    <Modal
      className="modal-xl"
      show={showVoucherUpdate}
      onHide={() => handleCloseModal()}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Voucher</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Voucher Code</Form.Label>
                <Form.Control
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  onBlur={() => handleBlur("voucherCode")}                  
                  readOnly
                />                
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Voucher Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={voucherQuantity}
                  onChange={(e) => setVoucherQuantity(e.target.value)}
                  onBlur={() => handleBlur("voucherQuantity")}
                  isInvalid={!!errors.voucherQuantity}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.voucherQuantity}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Available Date</Form.Label>
                <Form.Control
                  readOnly
                  type="date"
                  value={availableDate}
                  min={getTodayDate().split("-").reverse().join("-")}
                  onChange={(e) => setAvailableDate(e.target.value)}
                  onBlur={() => handleBlur("availableDate")}
                  isInvalid={!!errors.availableDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.availableDate}{" "}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Discount Percent</Form.Label>
                <Form.Control
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  onBlur={() => handleBlur("discountPercent")}
                  isInvalid={!!errors.discountPercent}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.discountPercent}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="align-items-end">
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Expire Date</Form.Label>
                <Form.Control
                  type="date"
                  value={expireDate}
                  min={availableDate}
                  onChange={(e) => setExpireDate(e.target.value)}
                  onBlur={() => handleBlur("expireDate")}
                  isInvalid={!!errors.expireDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.expireDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col className="d-flex justify-content-end">
              <div className="d-flex gap-4">
                <Button
                  style={{
                    border: "1px solid #ccc",
                    color: "black",
                    background: "white",
                    paddingRight: "50px",
                    paddingLeft: "50px",
                    marginRight: "20px",
                    marginBottom: "16px",
                  }}
                  onClick={() => handleCloseModal()}
                >
                  Exit
                </Button>
                <Button
                  style={{
                    background: "#305A61",
                    color: "white",
                    border: "1px solid #ccc",
                    paddingRight: "50px",
                    paddingLeft: "50px",
                    marginBottom: "16px",
                  }}
                  onClick={() => handleSubmit()}
                >
                  Save
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateVoucher;