/* eslint-disable @next/next/no-img-element */
"use client";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ChangeEvent, use, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { analytics } from "../../../../public/firebase/firebase-config";
import { countries, cities } from "country-cities";
import supplierService from "@/app/services/supplierService";

interface IProps {
  showSupplierUpdate: boolean;
  setShowSupplierUpdate: (value: boolean) => void;
  supplier: ISupplier | null;
  supplierId: number;
  setSupplier: (value: ISupplier | null) => void;
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

function UpdateProfileSupplier(props: IProps) {
  const {
    showSupplierUpdate,
    setShowSupplierUpdate,
    supplier,
    supplierId,
    setSupplier,
  } = props;
  const [supplierName, setSupplierName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [roleId, setRoleId] = useState<number>();
  const [bankName, setBankName] = useState<string>("");
  const [bankAccount, setBankAccount] = useState<string>("");
  const [bankNumber, setBankNumber] = useState<string>("");
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [previewImageURL, setPreviewImageURL] = useState<string | null>(null);
  const [uploadedImageURLs, setUploadedImageURLs] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

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
    console.log("Fetched country: ", countryCode);
    setSelectedCountry(countryCode);
    const city = await cities.getByCountry(countryCode);
    console.log("Fetched cities: ", city);
    setCitiesList(city || []);
    setSelectedCity("");
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cityCode = event.target.value;
    setSelectedCity(cityCode);
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setFileUpload(file);
      const previewURL = URL.createObjectURL(file);
      setPreviewImageURL(previewURL);
    } else {
      setFileUpload(null);
      setPreviewImageURL(null);
      URL.revokeObjectURL(previewImageURL as string);
    }
  };

  const uploadImages = async () => {
    if (!fileUpload) {
      toast.error("No image to upload.");
      throw new Error("No image to upload.");
    }

    try {
      const storageRef = ref(analytics, "Supplier_Image/" + fileUpload.name);
      const snapshot = await uploadBytes(storageRef, fileUpload);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setUploadedImageURLs([downloadURL]);
      toast.success("Image uploaded successfully!");
      return downloadURL;
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image.");
      throw error;
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!supplierName || supplierName.trim() === "") {
      newErrors.supplierName = "Supplier Name is required";
    } else if (/[^a-zA-Z\s]/.test(supplierName)) {
      newErrors.supplierName =
        "Supplier Name must not contain numbers or special characters";
    }

    if (!phone || phone.trim() === "") {
      newErrors.phone = "Please enter phone number";
    } else if (isNaN(parseInt(phone))) {
      newErrors.phone = "Phone must be a number";
    } else if (!/0[0-9]{9}$/.test(phone))
      newErrors.phone = "Phone number must be 10 digits";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^([A-Za-z][\w\.\-]+)@([a-z]+)((\.(\w){2,3})+)$/.test(email)) {
      newErrors.email = "Staff Email must be a valid format email address";
    }
    if (!selectedCountry) newErrors.country = "Please select a country";
    if (!address || address.trim() === "") {
      newErrors.address = "Address is required";
    }
    if (!bankAccount) newErrors.bankAccount = "Please enter a bank account";
    if (!bankName) newErrors.bankName = "Please enter a bank name";
    if (!bankNumber) {
      newErrors.bankNumber = "Please enter a bank number";
    } else if (isNaN(parseInt(bankNumber))) {
      newErrors.bankNumber = "Please enter number only";
    }
    return newErrors;
  };

  const handleCloseModal = async () => {
    setErrors({});
    setFileUpload(null);
    setPreviewImageURL(null);
    setUploadedImageURLs([]);
    setShowSupplierUpdate(false);
  };

  useEffect(() => {
    if (showSupplierUpdate && supplier && supplier.supplierId) {
      setSupplierName(supplier.supplierName);
      setAvatar(supplier.avatar);
      setPhone(supplier.phone);
      setPassword(supplier.password);
      setEmail(supplier.email);
      setRoleId(supplier.roleId);
      setBankAccount(supplier.bankAccount);
      setBankName(supplier.bankName);
      setBankNumber(supplier.bankNumber);
      if (supplier.address) {
        const addressParts = supplier.address.split(",");
        if (addressParts.length > 1) {
          const displayAddress = addressParts.slice(0, -1).join(",").trim();
          setAddress(displayAddress);
          setSelectedCountry(addressParts[addressParts.length - 1].trim());
        } else {
          setAddress(supplier.address);
          setSelectedCountry("");
        }
      } else {
        setAddress("");
        setSelectedCountry("");
      }
    }
  }, [showSupplierUpdate, supplier]);

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let imageURLs = avatar;
      if (fileUpload) {
        imageURLs = await uploadImages();
      }

      const supplier: ISupplier = {
        supplierId: Number(supplierId),
        supplierName,
        avatar: imageURLs,
        phone,
        email,
        address: `${address}, ${selectedCountry}`,
        password: password,
        status: true,
        isVerify: true,
        roleId: Number(roleId),
        bankAccount: bankAccount,
        bankName: bankName,
        bankNumber: bankNumber,
      };

      const updateSupplier = await supplierService.updateSupplier(supplier);

      if (typeof updateSupplier === "string") {
        toast.success(updateSupplier);
      } else {
        toast.success("Update Profile Success");
      }
      handleCloseModal();
      mutate("profile");
      mutate("supplier");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  return (
    <Modal
      className="modal-xl"
      show={showSupplierUpdate}
      onHide={() => handleCloseModal()}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Supplier Name</Form.Label>
                <Form.Control
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  isInvalid={!!errors.supplierName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.supplierName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCountry}
                  isInvalid={!!errors.country}
                  onChange={handleEvent<HTMLSelectElement>(handleCountryChange)}
                >
                  <option value="">Select Country</option>
                  {countriesList.map((country) => (
                    <option key={country.isoCode} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.country}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  isInvalid={!!errors.address}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  isInvalid={!!errors.bankName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.bankName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bank Account</Form.Label>
                <Form.Control
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  isInvalid={!!errors.bankAccount}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.bankAccount}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bank Number</Form.Label>
                <Form.Control
                  type="text"
                  value={bankNumber}
                  onChange={(e) => setBankNumber(e.target.value)}
                  isInvalid={!!errors.bankNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.bankNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>
                  <div className="flex justify-center flex-wrap">
                    {previewImageURL ? (
                      <img
                        className="max-w-[300px] max-h-[300px] cursor-pointer m-2"
                        src={previewImageURL}
                        alt="Preview"
                        onClick={() =>
                          document.getElementById("fileInput")?.click()
                        }
                      />
                    ) : (
                      <img
                        className="max-w-[300px] max-h-[300px] cursor-pointer m-2"
                        src={avatar ? avatar : "/image/addpicture.png"}
                        alt=""
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "/image/addpicture.png";
                        }}
                      />
                    )}
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                </Form.Label>
                {/* <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  isInvalid={!!errors.address}
                /> */}
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-end">
            <Col xs="auto">
              <Button
                style={{
                  background: "#305A61",
                  color: "white",
                  border: "1px solid #ccc",
                }}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </Col>
            <Col xs="auto">
              <Button
                style={{
                  border: "1px solid #ccc",
                  color: "black",
                  background: "white",
                }}
                onClick={handleCloseModal}
              >
                Exit
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateProfileSupplier;
