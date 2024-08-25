"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import hotelService from "@/app/services/hotelService";
import { Button, Form, Modal } from "react-bootstrap";
import { cities, countries } from "country-cities";
import supplierService from "@/app/services/supplierService";

interface Iprops {
  showHotelCreate: boolean;
  setShowHotelCreate: (value: boolean) => void;
  onCreate: () => void;
}

type FormControlElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

const handleEvent = <T extends HTMLElement>(
  handler: (event: React.ChangeEvent<T>) => void
) => {
  return (event: React.ChangeEvent<FormControlElement>) => {
    handler(event as unknown as React.ChangeEvent<T>);
  };
};

function CreateHotel(props: Iprops) {
  const { showHotelCreate, setShowHotelCreate, onCreate } = props;

  // const [HotelId, setHotelId] = useState<number>();
  const [hotelName, setHotelName] = useState<string>("");
  const [hotelPhone, setHotelPhone] = useState<string>("");
  const [hotelEmail, setHotelEmail] = useState<string>("");
  const [hotelAvatar, setHotelAvatar] = useState<string>("");
  const [hotelFulDescription, setHotelFullDescription] = useState<string>("");
  const [hotelDistrict, setHotelDistrict] = useState<string>("");
  const [hotelCity, setHotelCity] = useState<string>("");
  const [hotelInformation, setHotelInformation] = useState<string>("");
  //
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [supplierId, setSupplierId] = useState<number | null>(null);
  //
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isTouched, setIsTouched] = useState<{ [key: string]: boolean }>({
    hotelName: false,
    hotelPhone: false,
    hotelEmail: false,
    hotelFulDescription: false,
    hotelDistrict: false,
    hotelCity: false,
    hotelInformation: false,
  });
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
  useEffect(() => {
    const loadCountries = async () => {
      const allCountries = await countries.all();
      setCountriesList(allCountries);
    };

    loadCountries();
  }, []);

  const handleCountryChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const countryCode = event.target.value;
   
    setSelectedCountry(countryCode);
    const city = await cities.getByCountry(countryCode);

    setCitiesList(city || []);
    setSelectedCity("");
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cityCode = event.target.value;
    setSelectedCity(cityCode);
  };

  //Validate Input
  const validateHotelName = (name: string) => {
    if (!name) return "Hotel Name is required";
    if (name.length < 20 || name.length > 60) return "Hotel Name must be between 6 and 30 words";
    return "";
  };
  const validateHotelPhone = (phoneNumber: string) => {
    if (!phoneNumber) return "Hotel Phone Number is required";
    if (!/0[0-9]{9}$/.test(phoneNumber))
      return "Hotel Phone Number must be 10 digits";
    return "";
  };

  const validateHotelEmail = (email: string) => {
    if (!email) return "Hotel Email is required";
    if (!/^([A-Za-z][\w\.\-]+)@([a-z]+)((\.(\w){2,3})+)$/.test(email))
      return "Hotel Email must be a valid format email address";
    return "";
  };

  const validateHotelFulDescription = (description: string) => {
    if (!description) return "Hotel Description is required";
    return "";
  };

  const validateHotelDistrict = (district: string) => {
    if (!district) return "Hotel District is required";
    return "";
  };

  const validateHotelCity = (city: string) => {
    if (!city) return "Hotel City is required";
    return "";
  };

  const validateHotelInformation = (information: string) => {
    if (!information) return "Hotel Information is required";
    return "";
  };

  useEffect(() => {
    if (isTouched.hotelName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        hotelName: validateHotelName(hotelName),
      }));
    }
  }, [hotelName, isTouched.hotelName]);

  useEffect(() => {
    if (isTouched.hotelPhone) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        hotelPhone: validateHotelPhone(hotelPhone),
      }));
    }
  }, [hotelPhone, isTouched.hotelPhone]);

  useEffect(() => {
    if (isTouched.hotelEmail) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        hotelEmail: validateHotelEmail(hotelEmail),
      }));
    }
  }, [hotelEmail, isTouched.hotelEmail]);

  useEffect(() => {
    if (isTouched.hotelFulDescription) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        hotelFulDescription: validateHotelFulDescription(hotelFulDescription),
      }));
    }
  }, [hotelFulDescription, isTouched.hotelFulDescription]);

  useEffect(() => {
    if (isTouched.hotelDistrict) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        hotelDistrict: validateHotelDistrict(hotelDistrict),
      }));
    }
  }, [hotelDistrict, isTouched.hotelDistrict]);

  // useEffect(() => {
  //   if (isTouched.hotelCity) {
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       hotelCity: validateHotelCity(hotelCity),
  //     }));
  //   }
  // }, [hotelCity, isTouched.hotelCity]);

  useEffect(() => {
    if (isTouched.hotelInformation) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        hotelInformation: validateHotelInformation(hotelInformation),
      }));
    }
  }, [hotelInformation, isTouched.hotelInformation]);

  const handleBlur = (field: string) => {
    setIsTouched((prevTouched) => ({ ...prevTouched, [field]: true }));
  };
  // End Validate Input //

  const handleSubmit = async () => {

    const validationErrors = {
      hotelName: validateHotelName(hotelName),
      hotelPhone: validateHotelPhone(hotelPhone),
      hotelEmail: validateHotelEmail(hotelEmail),
      hotelFulDescription: validateHotelFulDescription(hotelFulDescription),
      hotelDistrict: validateHotelDistrict(hotelDistrict),
      //hotelCity: validateHotelCity(hotelCity),
      hotelInformation: validateHotelInformation(hotelInformation),
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      return;
    }

    try {
      const hotel: IHotel = {
        hotelId: 0,
        hotelName,
        hotelPhone,
        hotelEmail,
        hotelAvatar: "1",
        hotelFulDescription,
        hotelDistrict ,
        hotelCity:`${selectedCity},${selectedCountry}`,
        hotelInformation,
        isVerify: false, 
        lock:false,
        supplierId: Number(supplierId),
        services: [],
      };
      const response = await hotelService.createHotel(hotel);
      toast.success("Create Hotel Success");
      handleCloseModal();
      onCreate();
    } catch (error) {
      toast.error("Failed to create hotel");
      console.error("Error creating hotel:", error);
    }
  };

  const handleCloseModal = () => {
    setHotelName("");
    setHotelPhone("");
    setHotelEmail("");
    setHotelFullDescription("");
    setHotelDistrict("");
    setHotelCity("");
    setHotelInformation("");
    setErrors({});
    setShowHotelCreate(false);
    setIsTouched({
      hotelName: false,
      hotelPhone: false,
      hotelEmail: false,
      hotelFulDescription: false,
      hotelDistrict: false,
      hotelCity: false,
      hotelInformation: false,
    });
  };

  return (
    <>
      <Modal
        className="pt-36"
        show={showHotelCreate}
        onHide={() => handleCloseModal()}
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Hotel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formHotelName">
              <Form.Label>Hotel Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please enter hotel name"
                value={hotelName}
                onChange={(e: any) => setHotelName(e.target.value)}
                onBlur={() => handleBlur("hotelName")}
                isInvalid={!!errors.hotelName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.hotelName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formHotelPhone">
              <Form.Label>Hotel Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please enter hotel phone"
                value={hotelPhone}
                onChange={(e: any) => setHotelPhone(e.target.value)}
                onBlur={() => handleBlur("hotelPhone")}
                isInvalid={!!errors.hotelPhone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.hotelPhone}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formHotelEmail">
              <Form.Label>Hotel Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Please enter hotel email"
                value={hotelEmail}
                onChange={(e: any) => setHotelEmail(e.target.value)}
                onBlur={() => handleBlur("hotelEmail")}
                isInvalid={!!errors.hotelEmail}
              />
              <Form.Control.Feedback type="invalid">
                {errors.hotelEmail}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formHotelFullDescription">
              <Form.Label>Hotel Full Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Please enter hotel full description"
                value={hotelFulDescription}
                onChange={(e: any) => setHotelFullDescription(e.target.value)}
                onBlur={() => handleBlur("hotelFulDescription")}
                isInvalid={!!errors.hotelFulDescription}
              />
              <Form.Control.Feedback type="invalid">
                {errors.hotelFulDescription}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formHotelDistrict">
              <Form.Label>Hotel District</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please enter hotel district"
                value={hotelDistrict}
                onChange={(e: any) => setHotelDistrict(e.target.value)}
                onBlur={() => handleBlur("hotelDistrict")}
                isInvalid={!!errors.hotelDistrict}
              />

              <Form.Control.Feedback type="invalid">
                {errors.hotelDistrict}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formHotelCity">
              <Form.Label>Hotel City</Form.Label>
              <Form.Control
                as="select"
                value={selectedCountry}
                onChange={handleEvent<HTMLSelectElement>(handleCountryChange)}
              >
                <option value="">Select Country</option>
                {countriesList.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control
                as="select"
                value={selectedCity}
                onChange={handleEvent<HTMLSelectElement>(handleCityChange)}
                disabled={!selectedCountry}
              >
                <option value="">Select City</option>
                {citiesList.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.hotelCity}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formHotelInformation">
              <Form.Label>Hotel Information</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please enter hotel information"
                value={hotelInformation}
                onChange={(e: any) => setHotelInformation(e.target.value)}
                onBlur={() => handleBlur("hotelInformation")}
                isInvalid={!!errors.hotelInformation}
              />
              <Form.Control.Feedback type="invalid">
                {errors.hotelInformation}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCloseModal()}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSubmit()}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateHotel;
