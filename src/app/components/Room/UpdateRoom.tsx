"use client";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import roomService from "@/app/services/roomService";
import { mutate } from "swr";
import { toast } from "react-toastify";

interface IProps {
  showRoomUpdate: boolean;
  setShowRoomUpdate: (value: boolean) => void;
  hotelId: string;
  room: IRoom | null;
  setRoom: (value: IRoom | null) => void;
}

function UpdateRoom(props: IProps) {
  const { showRoomUpdate, setShowRoomUpdate, hotelId, room, setRoom } = props;
  const [roomId, setRoomId] = useState<number>(0);
  const [roomName, setRoomName] = useState<string>("");
  const [roomNote, setNote] = useState<string>("");
  const [discountPercent, setDiscount] = useState<string>("");
  const [roomDescription, setDescription] = useState<string>("");
  const [roomAvailable, setAvailable] = useState<string>("");
  const [roomPrice, setPrice] = useState<string>("");
  const [roomCapacity, setCapacity] = useState<string>("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isTouched, setIsTouched] = useState<{ [key: string]: boolean }>({
    roomName: false,
    roomNote: false,
    discountPercent: false,
    roomDescription: false,
    roomAvailable: false,
    roomPrice: false,
    roomCapacity: false,
  });
  const validateRoomName = (name: string) => {
    if (!name) return "Room Name is required";
    return "";
  };

  const validateRoomNote = (note: string) => {
    if (!note) return "Room Note is required";
    return "";
  };
//new
  const validateRoomDiscount = (discount: string) => {
    if (!discount) return "Room Discount is required";
    
    const discountValue = parseFloat(discount);
    if (isNaN(discountValue) || discountValue <= 0) {
      return "Room Discount must be a positive number";
    }
  
    if (discountValue < 1 || discountValue > 90) {
      return "Room Discount must be between 1 and 90";
    }
  
    return "";
  };

  const validateRoomDiscription = (discription: string) => {
    if (!discription) return "Room Discription is required";
    return "";
  };

  const validateRoomAvailable = (available: string) => {
    if (!available) return "Room Available is required";
    if (isNaN(parseInt(available)) || parseInt(available) <= 0)
      return "Room Available must be a positive number";
    return "";
  };

  const validateRoomPrice = (price: string) => {
    if (!price) return "Room Price is required";
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0)
      return "Room Price must be a positive number";
    return "";
  };

  const validateRoomCapacity = (capacity: string) => {
    if (!capacity) return "Room Capacity is required";
    if (isNaN(parseInt(capacity)) || parseInt(capacity) <= 0)
      return "Room Capacity must be a positive number";
    return "";
  };

  useEffect(() => {
    if (isTouched.roomName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        roomName: validateRoomName(roomName),
      }));
    }
  }, [roomName, isTouched.roomName]);

  useEffect(() => {
    if (isTouched.roomNote) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        roomNote: validateRoomNote(roomNote),
      }));
    }
  }, [roomNote, isTouched.roomNote]);

  useEffect(() => {
    if (isTouched.discountPercent) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        discountPercent: validateRoomDiscount(discountPercent),
      }));
    }
  }, [discountPercent, isTouched.discountPercent]);

  useEffect(() => {
    if (isTouched.roomDescription) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        roomDescription: validateRoomDiscription(roomDescription),
      }));
    }
  }, [roomDescription, isTouched.roomDescription]);

  useEffect(() => {
    if (isTouched.roomAvailable) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        roomAvailable: validateRoomAvailable(roomAvailable),
      }));
    }
  }, [roomAvailable, isTouched.roomAvailable]);

  useEffect(() => {
    if (isTouched.roomPrice) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        roomPrice: validateRoomPrice(roomPrice),
      }));
    }
  }, [roomPrice, isTouched.roomPrice]);

  useEffect(() => {
    if (isTouched.roomCapacity) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        roomCapacity: validateRoomCapacity(roomCapacity),
      }));
    }
  }, [roomCapacity, isTouched.roomCapacity]);

  const handleBlur = (field: string) => {
    setIsTouched((prevTouched) => ({ ...prevTouched, [field]: true }));
  };

  const handleCloseModal = async () => {
    setRoomName("");
    setNote("");
    setDiscount("");
    setDescription("");
    setAvailable("");
    setPrice("");
    setCapacity("");
    setErrors({});
    setRoom(null);
    setShowRoomUpdate(false);
    setIsTouched({
      roomName: false,
      roomNote: false,
      discountPercent: false,
      roomDescription: false,
      roomAvailable: false,
      roomPrice: false,
      roomCapacity: false,
    });
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
    }
  }, [room]);  

  const handleSubmit = async () => {
    const validationErrors = {
      roomName: validateRoomName(roomName),
      roomNote: validateRoomNote(roomNote),
      discountPercent: validateRoomDiscount(discountPercent),
      roomDescription: validateRoomDiscription(roomDescription),
      roomAvailable: validateRoomAvailable(roomAvailable),
      roomPrice: validateRoomPrice(roomPrice),
      roomCapacity: validateRoomCapacity(roomCapacity),
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      return;
    }
    try {
      const room: IRoom = {
        roomId: Number(roomId),
        roomName,
        roomNote,
        roomStatus: true,
        roomAvailable: parseInt(roomAvailable),
        roomPrice: parseFloat(roomPrice),
        roomCapacity: parseInt(roomCapacity),
        discountPercent: parseFloat(discountPercent),
        roomDescription,
        hotelId: Number(hotelId),
      };

      const updateRoom = await roomService.updateRoom(room);

      if (typeof updateRoom === "string") {
        toast.success(updateRoom);
      } else {
        toast.success("Update Room Success");
      }
      handleCloseModal();
      mutate("listRoom");
    } catch (error) {
      toast.error("Failed to update room");
      console.error(error);
    }
  };

  return (
    <Modal
      className="modal-xl"
      show={showRoomUpdate}
      onHide={() => handleCloseModal()}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Room Name</Form.Label>
                <Form.Control
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  onBlur={() => handleBlur("roomName")}
                  isInvalid={!!errors.roomName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.roomName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Available</Form.Label>
                <Form.Control
                  type="text"
                  value={roomAvailable}
                  onChange={(e) => setAvailable(e.target.value)}
                  onBlur={() => handleBlur("roomAvailable")}
                  isInvalid={!!errors.roomAvailable}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.roomAvailable}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  type="text"
                  value={roomNote}
                  onChange={(e) => setNote(e.target.value)}
                  onBlur={() => handleBlur("roomNote")}
                  isInvalid={!!errors.roomNote}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.roomNote}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  value={roomPrice}
                  onChange={(e) => setPrice(e.target.value)}
                  onBlur={() => handleBlur("roomPrice")}
                  isInvalid={!!errors.roomPrice}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.roomPrice}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Discount Percent</Form.Label>
                <Form.Control
                  type="text"
                  value={discountPercent}
                  onChange={(e) => setDiscount(e.target.value)}
                  onBlur={() => handleBlur("discountPercent")}
                  isInvalid={!!errors.discountPercent}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.discountPercent}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Capacity</Form.Label>
                <Form.Control
                  type="text"
                  value={roomCapacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  onBlur={() => handleBlur("roomCapacity")}
                  isInvalid={!!errors.roomCapacity}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.roomCapacity}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={11}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={roomDescription}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => handleBlur("roomDescription")}
                  isInvalid={!!errors.roomDescription}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.roomDescription}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={1} className="d-flex align-items-end">
              <div className="d-flex flex-column gap-2">
                <Button
                  style={{
                    background: "#305A61",
                    color: "white",
                    border: "1px solid #ccc",
                  }}
                  onClick={() => handleSubmit()}
                >
                  Save
                </Button>
                <Button
                  style={{
                    border: "1px solid #ccc",
                    color: "black",
                    background: "white",
                  }}
                  onClick={() => handleCloseModal()}
                >
                  Exit
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateRoom;