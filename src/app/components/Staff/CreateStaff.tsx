"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form, Modal } from "react-bootstrap";
import supplierStaffService from "@/app/services/supplierStaffService";
import supplierService from "@/app/services/supplierService";
interface Iprops {
  showStaffCreate: boolean;
  setShowStaffCreate: (value: boolean) => void;
  onCreate: () => void;
}

function CreateSupplierStaff(props: Iprops) {
  const { showStaffCreate, setShowStaffCreate, onCreate } = props;
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [staffName, setStaffName] = useState<string>("");
  const [staffPhoneNumber, setStaffPhoneNumber] = useState<string>("");
  const [staffEmail, setStaffEmail] = useState<string>("");
  const [staffAddress, setStaffAddress] = useState<string>("");
  const [staffPassword, setStaffPassword] = useState<string>("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isTouched, setIsTouched] = useState<{ [key: string]: boolean }>({
    staffName: false,
    staffPhoneNumber: false,
    staffEmail: false,
    staffAddress: false,
    staffPassword: false,
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
  const validateStaffName = (name: string) => {
    if (!name) return "Staff Name is required";
    return "";
  };

  const validateStaffPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return "Staff Phone Number is required";
    if (!/0[0-9]{9}$/.test(phoneNumber))
      return "Staff Phone Number must be 10 digits";
    return "";
  };

  const validateStaffEmail = (email: string) => {
    if (!email) return "Staff Email is required";
    if (!/^([A-Za-z][\w\.\-]+)@([a-z]+)((\.(\w){2,3})+)$/.test(email))
      return "Staff Email must be a valid format email address";
    return "";
  };

  const validateStaffAddress = (address: string) => {
    if (!address) return "Staff Address is required";
    return "";
  };

  const validateStaffPassword = (password: string) => {
    if (!password) return "Staff Password is required";
    return "";
  };

  useEffect(() => {
    if(isTouched.staffName){
      setErrors((prevErrors) => ({...prevErrors, staffName: validateStaffName(staffName)}));
    }
  }, [staffName, isTouched.staffName]);

  useEffect(() => {
    if(isTouched.staffPhoneNumber){
      setErrors((prevErrors) => ({...prevErrors, staffPhoneNumber: validateStaffPhoneNumber(staffPhoneNumber)}));
    }
  }, [staffPhoneNumber, isTouched.staffPhoneNumber]);

  useEffect(() => {
    if(isTouched.staffEmail){
      setErrors((prevErrors) => ({...prevErrors, staffEmail: validateStaffEmail(staffEmail)}));
    }
  }, [staffEmail, isTouched.staffEmail]);

  useEffect(() => {
    if(isTouched.staffAddress) {
    setErrors((prevErrors) => ({...prevErrors, staffAddress: validateStaffAddress(staffAddress)}));
    } 
  }, [staffAddress, isTouched.staffAddress]);

  useEffect(() => {
    if (isTouched.staffPassword) {
      setErrors((prevErrors) => ({...prevErrors, staffPassword: validateStaffPassword(staffPassword)}));
    }
  }, [staffPassword, isTouched.staffPassword]);const handleBlur = (field: string) => {
    setIsTouched((prevTouched) => ({ ...prevTouched, [field]: true }));
  };

  const handleSubmit = async () => {
    
    const validationErrors = {
      staffName: validateStaffName(staffName),
      staffPhoneNumber: validateStaffPhoneNumber(staffPhoneNumber),
      staffEmail: validateStaffEmail(staffEmail),
      staffAddress: validateStaffAddress(staffAddress),
      staffPassword: validateStaffPassword(staffPassword),
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      return;
    }
    if (supplierId === null) {
      toast.error("Supplier ID is not available");
      return;
    }
    try {
      const supplierStaff: ISupplierStaff = {
        staffId: 0,
        staffName,
        staffPhoneNumber,
        staffEmail,
        IsVerify: true,
        staffAddress,
        staffPassword,
        status: true, // Default value is true
        supplierId: supplierId,
        roleId: 3,
      };
      const response = await supplierStaffService.createStaff(supplierStaff);
      toast.success("Create Supplier Staff Success");
      handleCloseModal();
      onCreate();
    } catch (error) {
      toast.error("Failed to create supplier staff");
      console.error("Error creating supplier staff:", error);
    }
  };

  const handleCloseModal = () => {
    setStaffName("");
    setStaffPhoneNumber("");
    setStaffEmail("");
    setStaffAddress("");
    setStaffPassword("");
    setErrors({});
    setShowStaffCreate(false);
    setIsTouched({
      staffName: false,
      staffPhoneNumber: false,
      staffEmail: false,
      staffAddress: false,
      staffPassword: false,
    });
  };

  return (
    <>
      <Modal
        className="pt-36"
        show={showStaffCreate}
        onHide={() => handleCloseModal()}
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formStaffName">
              <Form.Label>Staff Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please enter staff name"
                value={staffName}
                onChange={(e: any) => setStaffName(e.target.value)}
                onBlur={() => handleBlur("staffName")}
                isInvalid={!!errors.staffName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.staffName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStaffPhoneNumber">
              <Form.Label>Staff Phone</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Please enter staff phone number"
                value={staffPhoneNumber}
                onChange={(e: any) => setStaffPhoneNumber(e.target.value)}onBlur={() => handleBlur("staffPhoneNumber")}
                isInvalid={!!errors.staffPhoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.staffPhoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStaffEmail">
              <Form.Label>Staff Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Please enter staff email"
                value={staffEmail}
                onChange={(e: any) => setStaffEmail(e.target.value)}
                onBlur={() => handleBlur("staffEmail")}
                isInvalid={!!errors.staffEmail}
              />
              <Form.Control.Feedback type="invalid">
                {errors.staffEmail}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStaffAddress">
              <Form.Label>Staff Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please enter staff address"
                value={staffAddress}
                onChange={(e: any) => setStaffAddress(e.target.value)}
                onBlur={() => handleBlur("staffAddress")}
                isInvalid={!!errors.staffAddress}
              />
              <Form.Control.Feedback type="invalid">
                {errors.staffAddress}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStaffPassword">
              <Form.Label>Staff Password</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please enter staff password"
                value={staffPassword}
                onChange={(e: any) => setStaffPassword(e.target.value)}
                onBlur={() => handleBlur("staffPassword")}
                isInvalid={!!errors.staffPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.staffPassword}
              </Form.Control.Feedback>
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

export default CreateSupplierStaff;