/* eslint-disable @next/next/no-img-element */
"use client";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { mutate } from "swr";
import { toast } from "react-toastify";
import supplierService from "@/app/services/supplierService";

interface IProps {
  showChangePassword: boolean;
  setShowChangePassword: (value: boolean) => void;
  supplierId: number;
  supplier: ISupplier | null;
  setSupplier: (value: ISupplier | null) => void;
}

function ChangePasswordSupplier(props: IProps) {
  const [supplierName, setSupplierName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [bankAccount, setBankAccount] = useState<string>("");
  const [bankNumber, setBankNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [roleId, setRoleId] = useState<number>();
  const [password, setPassword] = useState<string>("");
  const {
    showChangePassword,
    setShowChangePassword,
    supplierId,
    supplier,
    setSupplier,
  } = props;
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!currentPassword || currentPassword.trim() === "") {
      newErrors.currentPassword = "Current password is required";
    }
    if (!newPassword || newPassword.trim() === "") {
      newErrors.newPassword = "New password is required";
    }
    if (!confirmPassword || confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Confirm password is required";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Password does not match";
    }
    return newErrors;
  };

  const handleCloseModal = async () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setShowChangePassword(false);
  };

  useEffect(() => {
    if (showChangePassword && supplier && supplier.supplierId) {
      setSupplierName(supplier.supplierName);
      setAvatar(supplier.avatar);
      setPhone(supplier.phone);
      setPassword(supplier.password);
      setEmail(supplier.email);
      setRoleId(supplier.roleId);
      setAddress(supplier.address);
      setBankAccount(supplier.bankAccount);
      setBankName(supplier.bankName);
      setBankNumber(supplier.bankNumber);
    }
  }, [showChangePassword, supplier]);

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const supplier: ISupplier = {
        supplierId: Number(supplierId),
        supplierName,
        avatar,
        phone,
        email,
        address,
        password: newPassword,
status: true,
        isVerify: true,
        roleId: Number(roleId),
        bankAccount: bankAccount,
        bankName: bankName,
        bankNumber: bankNumber,
      };
      //Check current password
      const checkResponse = await supplierService.checkPasswordSupplier(
        email,
        currentPassword
      );
      if (!checkResponse.success) {
        setErrors({ currentPassword: checkResponse.message });
        return;
      }
      const response = await supplierService.changePasswordSupplier(supplier);
      if (response) {
        toast.success("Change password successfully!");
      }

      handleCloseModal();
      mutate("password");
      mutate("supplier");
    } catch (error) {
      toast.error("Failed to change password");
      console.error(error);
    }
  };

  return (
    <Modal
      className="modal-xl"
      show={showChangePassword}
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  isInvalid={!!errors.currentPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  isInvalid={!!errors.newPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
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

export default ChangePasswordSupplier;