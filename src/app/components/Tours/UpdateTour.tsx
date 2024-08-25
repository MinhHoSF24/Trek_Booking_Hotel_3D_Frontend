import { ITour } from "@/app/entities/tour";
import { revalidateTours, updateTour } from "@/app/services/tourService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Form from "../../../../node_modules/react-bootstrap/esm/Form";
import Modal from "../../../../node_modules/react-bootstrap/esm/Modal";
import { mutate } from "../../../../node_modules/swr/dist/core/index";
interface IProps {
  showTourUpdate: boolean;
  setShowTourUpdate: (value: boolean) => void;

  tour: ITour | null;
  setTour: (value: ITour | null) => void;
}
function UpdateTour(props: IProps) {
  const { showTourUpdate, setShowTourUpdate, tour, setTour } = props;
  const [tourId, setTourId] = useState<number>(0);
  const [tourName, setTourName] = useState<string>("");
  const [tourDescription, setTourDescription] = useState<string>("");
  const [tourPrice, setTourPrice] = useState<number>(0);
  const [tourAddress, setTourAddress] = useState<string>("");
  const [tourTime, setTourTime] = useState<string>("");
  const [tourTransportation, setTourTransportation] = useState<string>("");
  const [tourCapacity, setTourCapacity] = useState<number>(0);
  const [tourDiscount, setTourDiscount] = useState<number>(0);
  const [tourDay, SetTourDay] = useState<number>(0);
  const [status, SetStatus] = useState<boolean>(true);
  const [supplierId, setSupplierId] = useState<number>(0);

  const handleSetTourTime = (time: string | Date) => {
    let parsedDate;
    if (time instanceof Date) {
      parsedDate = time;
    } else {
      parsedDate = new Date(time);
    }
     parsedDate.setDate(parsedDate.getDate() + 1); // Cộng thêm một ngày
    setTourTime(parsedDate.toISOString().split("T")[0]); // Định dạng ngày thành yyyy-MM-dd
  };
  useEffect(() => {
    if (tour && tour.tourId) {
      setTourId(tour.tourId);
      setTourName(tour.tourName);
      setTourDescription(tour.tourDescription);
      setTourPrice(tour.tourPrice);
      setTourAddress(tour.tourAddress);
      handleSetTourTime(tour.tourTime);
      setTourCapacity(tour.tourCapacity);
      setTourDiscount(tour.tourDiscount);
      setTourTransportation(tour.tourTransportation);
      setSupplierId(tour.supplierId);
      SetTourDay(tour.tourDay)
    }
  }, [tour]);

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
      const response = await updateTour(
        tourId,
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
        supplierId
      );
      if (typeof response === "string") {
        toast.success(response);
      } else {
        toast.success("Update Tour Success");
      }
      handleCloseModal();
      mutate(revalidateTours);
    } catch (error) {
      toast.error("Failed to update tour");
      console.error(error);
    }
  };

  // Hàm để lấy ngày hôm nay định dạng dd-MM-yyyy
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = (today.getMonth() + 1).toString(); // Tháng bắt đầu từ 0
    let dd = today.getDate().toString();

    if (parseInt(dd) < 10) dd = "0" + dd;
    if (parseInt(mm) < 10) mm = "0" + mm;

    return `${dd}-${mm}-${yyyy}`;
  };

  const handleCloseModal = () => {
    setTourName("");
    setTourDiscount(0);
    setTourPrice(0);
    setTourAddress("");
    setTourTime("");
    setTourTransportation("");
    setTourCapacity(0);
    setTourDiscount(0);
    SetTourDay(0);
    setTour(null);
    setShowTourUpdate(false);
    setErrors({});
    setIsTouched({
      tourName: false,
      tourDescription: false,
      tourPrice: false,
      tourAddress: false,
      tourTime: false,
      tourTransportation: false,
      tourCapacity: false,
      tourDay:false,
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
    tourDay:false,
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
    
    const tourDate = tourTime.split(' ')[0]; // Assuming tourTime is in the format "YYYY-MM-DD HH:MM"
    const today = getTodayDate(); // Assuming getTodayDate() returns the date in "YYYY-MM-DD" format
  
    // if (tourDate < today) return "Tour Time cannot be in the past";
  
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
  //   if (isNaN(tourDiscount) || tourDiscount <= 0)
  //     return "Tour Capacity must be a positive number";
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
  return (
    <>
      <Modal
        className="pt-12"
        show={showTourUpdate}
        onHide={() => handleCloseModal()}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Tour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row font-semibold">
              <Form.Group hidden className="mb-3 col-6" controlId="tourName">
                <Form.Label>Tour Id</Form.Label>
                <Form.Control
                  readOnly
                  type="text"
                  placeholder="Please enter tour name !!!"
                  value={tourId}
                  onChange={(e) => setTourId(parseInt(e.target.value))}
                />
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="tourName">
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
              <Form.Group className="mb-3 col-6" controlId="tourTime">
                <Form.Label>Time</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Please enter tour time"
                  value={tourTime}
                  min={getTodayDate().split("-").reverse().join("-")}
                  onChange={(e) => setTourTime(e.target.value)}
                  onBlur={() => handleBlur("tourTime")}
                  isInvalid={!!errors.tourTime}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tourTime}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3 col-6" controlId="tourTransportation">
                <Form.Label>Tour Transportation</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Please enter tour transportation !!!"
                  value={tourTransportation}
                  onChange={(e) => setTourTransportation(e.target.value)}
                  onBlur={() => handleBlur("tourTransportation")}
                  isInvalid={!!errors.tourTransportation}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tourTransportation}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3 col-3" controlId="tourPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Please enter tour price !!!"
                  value={tourPrice}
                  onChange={(e) => setTourPrice(parseFloat(e.target.value))}
                  onBlur={() => handleBlur("tourPrice")}
                  isInvalid={!!errors.tourPrice}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tourPrice}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3 col-3" controlId="tourPrice">
                <Form.Label>Discount</Form.Label>
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
              <Form.Group className="mb-3 col-6" controlId="tourAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Please enter tour address !!!"
                  value={tourAddress}
                  onChange={(e) => setTourAddress(e.target.value)}
                  onBlur={() => handleBlur("tourAddress")}
                  isInvalid={!!errors.tourAddress}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tourAddress}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3 col-3" controlId="tourCapacity">
                <Form.Label>Capacity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Please enter tour capacity !!!"
                  value={tourCapacity}
                  onChange={(e) => setTourCapacity(parseInt(e.target.value))}
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
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Please enter tour description !!!"
                  value={tourDescription}
                  onChange={(e) => setTourDescription(e.target.value)}
                  style={{ height: "150px", overflowY: "scroll" }}
                  onBlur={() => handleBlur("tourDescription")}
                  isInvalid={!!errors.tourDescription}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tourDescription}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group hidden className="mb-3 col-6 " controlId="supplierId">
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
                Save
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
export default UpdateTour;