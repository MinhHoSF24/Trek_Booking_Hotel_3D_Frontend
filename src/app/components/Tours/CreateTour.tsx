"use client";
import tourService, {
  createTour,
  revalidateTours,
} from "@/app/services/tourService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../../../../node_modules/react-bootstrap/esm/Button";
import Form from "../../../../node_modules/react-bootstrap/esm/Form";
import Modal from "../../../../node_modules/react-bootstrap/esm/Modal";
import useSWR from "swr";
import { mutate } from "../../../../node_modules/swr/dist/core/index";
import supplierService from "@/app/services/supplierService";

interface Iprops {
  showTourCreate: boolean;
  setShowTourCreate: (value: boolean) => void;
}

function CreateTour(props: Iprops) {
  // npm i --save-exact react-toastify@9.1.3
  const { showTourCreate, setShowTourCreate } = props;
  const [tourName, setTourName] = useState<string>("");
  const [tourDescription, SetTourDescription] = useState<string>("");
  const [tourPrice, SetTourPrice] = useState<number>(0);
  const [tourAddress, SetTourAddress] = useState<string>("");
  const [tourTime, SetTourTime] = useState<string>("");
  const [tourTransportation, SetTourTransportation] = useState<string>("");
  const [tourCapacity, SetTourCapacity] = useState<number>(0);
  const [tourDiscount, setTourDiscount] = useState<number>(0);
  const [tourDay, SetTourDay] = useState<number>(0);
  const [status, SetStatus] = useState<boolean>(false);
  const [lock, SetLock] = useState<boolean>(false);
  const [supplierId, setSupplierId] = useState<number>(0);

  const handleSubmit = async () => {
    const validationErrors = {
      tourName: validateTourName(tourName),
      tourDescription: validateTourDescription(tourDescription),
      tourPrice: validateTourPrice(tourPrice),
      tourAddress: validateTourAddress(tourAddress),
      tourTime: validateTourTime(tourTime),
      tourTransportation: validateTourTransportation(tourTransportation),
      tourCapacity: validateTourCapacity(tourCapacity),
      tourDay: validateTourDay(tourDay),
      // tourDiscount: validateTourDiscount(tourDiscount),
    };

    setErrors(validationErrors);
    if (Object.values(validationErrors).some((error) => error)) {
      return;
    }
    try {
      const response = await createTour(
        tourName,
        tourDescription,
        tourPrice,
        tourAddress,
        tourTime,
        tourTransportation,
        tourCapacity,
        tourDiscount,
        tourDay,
        status,
        lock,
       Number(supplierId)
      );
      if (typeof response === "string") {
        toast.success(response);
      } else {
        toast.success("Create Tour Success");
      }
      handleCloseModal();
      mutate(revalidateTours);
    } catch (error) {
      toast.error("Failed to create tour");
      console.error(error);
    }
  };
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

  const handleCloseModal = () => {
    setTourName("");
    setTourDiscount(0);
    SetTourPrice(0);
    SetTourAddress("");
    SetTourDescription("");
    SetTourTime(getTodayDate());
    SetTourTransportation("");
    SetTourCapacity(0);
    setTourDiscount(0);
    setErrors({});
    setShowTourCreate(false);
    setIsTouched({
      tourName: false,
      tourDescription: false,
      tourPrice: false,
      tourAddress: false,
      tourTime: false,
      tourTransportation: false,
      tourCapacity: false,
      tourDiscount: false,
    });
  };
  //Validate input
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isTouched, setIsTouched] = useState<{ [key: string]: boolean }>({
    tourName: false,
    tourDescription: false,
    tourPrice: false,
    tourAddress: false,
    tourTime: false,
    tourTransportation: false,
    tourCapacity: false,
    tourDiscount: false,
  });

  const validateTourName = (name: string) => {
    if (!name) return "Tour Name is required";
    if (name.length < 20 || name.length > 60) return "Tour Name must be between 6 and 30 words";
    return "";
  };

  const validateTourDescription = (tourDescription: string) => {
    if (!tourDescription) return "Tour Description is required";
    return "";
  };

  const validateTourPrice = (tourPrice: number) => {
    if (!tourPrice) return "Tour Price is required";
    if (isNaN(tourPrice) || tourPrice <= 0)
      return "Tour Price must be a positive number";
    return "";
  };
  const validateTourDay = (tourDay: number) => {
    if (!tourDay) return "Tour Day is required";
    if (isNaN(tourDay) || tourDay <= 0)
      return "Tour Day must be a positive number";
    return "";
  };

  const validateTourAddress = (address: string) => {
    if (!address) return "Tour Address is required";
    return "";
  };

  const validateTourTime = (tourTime: string) => {
    if (!tourTime) return "Tour Time is required";
    const today = getTodayDate().split("-").reverse().join("-");
    if (tourTime < today) return "Tour Time cannot be in the past";
    return "";
  };

  const validateTourTransportation = (tourTransportation: string) => {
    if (!tourTransportation) return "Tour Transportation is required";
    return "";
  };

  const validateTourCapacity = (tourCapacity: number) => {
    if (!tourCapacity) return "Tour Capacity is required";
    if (isNaN(Number(tourCapacity)) || Number(tourCapacity) <= 0)
      return "Tour Capacity must be a positive number";
    return "";
  };

  // const validateTourDiscount = (tourDiscount: number) => {
  //   if (!tourDiscount) return "Tour Discount is required";
  //   // if (isNaN(tourDiscount) || tourDiscount <= 0)
  //   //   return "Tour Capacity must be a positive number";
  //   return "";
  // };

  useEffect(() => {
    if (isTouched.tourName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tourName: validateTourName(tourName),
      }));
    }
  }, [tourName, isTouched.tourName]);

  useEffect(() => {
    if (isTouched.tourDescription) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tourDescription: validateTourDescription(tourDescription),
      }));
    }
  }, [tourDescription, isTouched.tourDescription]);

  useEffect(() => {
    if (isTouched.tourPrice) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tourPrice: validateTourPrice(tourPrice),
      }));
    }
  }, [tourPrice, isTouched.tourPrice]);

  useEffect(() => {
    if (isTouched.tourAddress) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tourAddress: validateTourAddress(tourAddress),
      }));
    }
  }, [tourAddress, isTouched.tourAddress]);

  useEffect(() => {
    if (isTouched.tourTime) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tourTime: validateTourTime(tourTime),
      }));
    }
  }, [tourTime, isTouched.tourTime]);

  useEffect(() => {
    if (isTouched.tourTransportation) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tourTransportation: validateTourTransportation(tourTransportation),
      }));
    }
  }, [tourTransportation, isTouched.tourTransportation]);

  useEffect(() => {
    if (isTouched.tourCapacity) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tourCapacity: validateTourCapacity(tourCapacity),
      }));
    }
  }, [tourCapacity, isTouched.tourCapacity]);

  // useEffect(() => {
  //   if (isTouched.tourDiscount) {
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       tourDiscount: validateTourDiscount(tourDiscount),
  //     }));
  //   }
  // }, [tourDiscount, isTouched.tourDiscount]);

  const handleBlur = (field: string) => {
    setIsTouched((prevTouched) => ({ ...prevTouched, [field]: true }));
  };

  // End Validate input //

  return (
    <>
      <Modal
        className="pt-12"
        show={showTourCreate}
        onHide={() => handleCloseModal()}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <Form.Group className=" mb-3 col-6" controlId="tourName">
                <Form.Label>Tour Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Please enter tour name !!!"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  onBlur={() => handleBlur("tourName")}
                  isInvalid={!!errors.tourName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tourName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className=" mb-3 col-6" controlId="tourTime">
                <Form.Label>Tour Time</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Please enter tour time !!!"
                  value={tourTime}
                  min={getTodayDate().split("-").reverse().join("-")}
                  onChange={(e) => SetTourTime(e.target.value)}
                  onBlur={() => handleBlur("tourTime")}
                  isInvalid={!!errors.tourTime}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tourTime}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                className=" mb-3 col-6"
                controlId="tourTransportation"
              >
                <Form.Label>Tour Transportation</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Please enter tour transportation !!!"
                  value={tourTransportation}
                  onChange={(e) => SetTourTransportation(e.target.value)}
                  onBlur={() => handleBlur("tourTransportation")}
                  isInvalid={!!errors.tourTransportation}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tourTransportation}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className=" mb-3 col-3" controlId="tourPrice">
                <Form.Label>Tour Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Please enter tour price !!!"
                  value={tourPrice}
                  onChange={(e) => SetTourPrice(parseFloat(e.target.value))}
                  onBlur={() => handleBlur("tourPrice")}
                  isInvalid={!!errors.tourPrice}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tourPrice}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className=" mb-3 col-3" controlId="tourPrice">
                <Form.Label>Tour Discount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Please enter tour discount !!!"
                  value={tourDiscount}
                  onChange={(e) => setTourDiscount(parseFloat(e.target.value))}
                  onBlur={() => handleBlur("tourDiscount")}
                  isInvalid={!!errors.tourDiscount}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tourDiscount}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className=" mb-3 col-6" controlId="tourAddress">
                <Form.Label>Tour Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Please enter tour address !!!"
                  value={tourAddress}
                  onChange={(e) => SetTourAddress(e.target.value)}
                  onBlur={() => handleBlur("tourAddress")}
                  isInvalid={!!errors.tourAddress}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tourAddress}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className=" mb-3 col-3" controlId="tourCapacity">
                <Form.Label>Tour Capacity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Please enter tour capacity !!!"
                  value={tourCapacity}
                  onChange={(e) => SetTourCapacity(parseInt(e.target.value))}
                  onBlur={() => handleBlur("tourCapacity")}
                  isInvalid={!!errors.tourCapacity}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tourCapacity}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3 col-3" controlId="tourDay">
                <Form.Label>Tour Day</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Please enter day !!!"
                  value={tourDay}
                  onChange={(e) => SetTourDay(parseInt(e.target.value))}
                  onBlur={() => handleBlur("tourDay")}
                  isInvalid={!!errors.tourDay}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tourDay}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3 col-9" controlId="tourDescription">
                <Form.Label>Tour Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Please enter tour description !!!"
                  value={tourDescription}
                  onChange={(e) => SetTourDescription(e.target.value)}
                  style={{ height: "150px", overflowY: "scroll" }}
                  onBlur={() => handleBlur("tourDescription")}
                  isInvalid={!!errors.tourDescription}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tourDescription}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group hidden className="mb-3 col-6" controlId="supplierId">
                <Form.Label>Supplier Id</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Please enter supplier id !!!"
                  value={supplierId}
                  onChange={(e) => setSupplierId(parseInt(e.target.value))}
                />
              </Form.Group>
            </div>
          </Form>
          <div className="mb-3 ">
            <div className=" text-right relative">
              <button
                className="btn-save-modal mb-2"
                onClick={() => handleSubmit()}
              >
                Create
              </button>
              <br />
              <button
                className="btn-exit-modal"
                onClick={() => handleCloseModal()}
              >
                Exit
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateTour;