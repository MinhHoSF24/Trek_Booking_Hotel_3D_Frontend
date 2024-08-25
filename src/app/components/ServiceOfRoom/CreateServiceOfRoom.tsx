"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form, Modal, Image, Row, Col } from "react-bootstrap";
import serviceOfRoom from "@/app/services/serviceOfRoom";
import useSWR from "swr";

interface Iprops {
  showServiceOfRoomCreate: boolean;
  setShowServiceOfRoomCreate: (value: boolean) => void;
  onCreate: () => void;
  thisRoomId: number;
  existingServices: IService[];
}

interface IService {
  serviceId: number;
  serviceName: string;
  serviceDescription: string;
  serviceImage: string;
}

function CreateServiceOfRoom(props: Iprops) {
  const { showServiceOfRoomCreate, setShowServiceOfRoomCreate, onCreate, thisRoomId, existingServices = [] } = props;
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const {
    data: listService,
    error,
    mutate: mutateListService,
  } = useSWR("listService", () => serviceOfRoom.getServices());
  
//lấy list service hiện có
  useEffect(() => {
    if (existingServices) {
      const existingServiceIds = existingServices.map(service => service.serviceId);
      setSelectedServices(existingServiceIds);
    }
  }, [existingServices]);

  const handleSubmit = async () => {
    try {
      for (const serviceId of selectedServices) {
        if (!existingServices.some(service => service.serviceId === serviceId)) {
          const roomService = {
            roomId: thisRoomId,
            serviceId,
          };
          await serviceOfRoom.createRoomService(roomService);
        }
      }
      toast.success("Add Service Success");
      handleCloseModal();
      onCreate();
    } catch (error) {
      toast.error("Service already exists!");
      console.error("Error adding service:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedServices([]);
    setShowServiceOfRoomCreate(false);
    if (existingServices) {
      const existingServiceIds = existingServices.map(service => service.serviceId);
      setSelectedServices(existingServiceIds);
    }
  };

  const handleSelectService = (serviceId: number) => {
    if (!existingServices.some(service => service.serviceId === serviceId)) {
      setSelectedServices((prevSelectedServices) =>
        prevSelectedServices.includes(serviceId)
          ? prevSelectedServices.filter((id) => id !== serviceId)
          : [...prevSelectedServices, serviceId]
      );
    }
  };

  return (
    <>
      <Modal
        className="pt-36"
        show={showServiceOfRoomCreate}
        onHide={() => handleCloseModal()}
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Service for Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formService">
              <Form.Label>Services</Form.Label>
              <Row>
                {listService && listService.map((service: IService) => {
                  const isExistingService = existingServices.some(existingService => existingService.serviceId === service.serviceId);
                  return (
                    <Col key={service.serviceId} xs={6} className="d-flex align-items-center mb-3">
                      <Image src={service.serviceImage} thumbnail className="me-2" style={{ width: "30px", height: "35px" }} />
                      <Form.Check
                        type="checkbox"
                        label={service.serviceName}
                        checked={selectedServices.includes(service.serviceId)}
                        onChange={() => handleSelectService(service.serviceId)}
                        disabled={isExistingService}
                      />
                    </Col>
                  );
                })}
              </Row>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="border"
            style={{
              background: "white",
              color: "black",
              borderRadius: "10px",
            }}
            onClick={() => handleCloseModal()}
          >
            Close
          </Button>
          <Button
            style={{ background: "#305A61" }}
            onClick={() => handleSubmit()}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateServiceOfRoom;
