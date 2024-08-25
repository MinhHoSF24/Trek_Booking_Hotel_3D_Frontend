import { ITour } from "@/app/entities/tour";
import { revalidateTours, updateTour } from "@/app/services/tourService";
import React from "react";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import Button from "../../../../node_modules/react-bootstrap/esm/Button";
import Form from "../../../../node_modules/react-bootstrap/esm/Form";
import Modal from "../../../../node_modules/react-bootstrap/esm/Modal";
import { mutate } from "../../../../node_modules/swr/dist/core/index";
interface IProps{
  showTourDetail: boolean;
  setShowTourDetail: (value:boolean) => void;
    tour: ITour | null;
    setTour: (value: ITour | null) => void;
}
function DetailTour(props: IProps) {
const {showTourDetail, setShowTourDetail,tour,setTour} = props;
const [tourId,setTourId] = useState<number>(0);
const [tourName,setTourName] = useState<string>("");
const [tourDescription,setTourDescription] = useState<string>("");
const [tourPrice,setTourPrice] =useState<number>(0);
const [tourAddress,setTourAddress] = useState<string>("");
const [tourTime,setTourTime] = useState<string>("");
const [tourTransportation,setTourTransportation] = useState<string>("");
const [tourCapacity,setTourCapacity] =useState<number>(0);
const [tourDiscount,setTourDiscount] =useState<number>(0);
const [status, SetStatus] = useState<boolean>(true);
const [supplierId,setSupplierId] =useState<number>(0);
const [tourDay, SetTourDay] = useState<number>(0);


const formattedDescription = tourDescription.split('.').map((sentence, index) => (
    // Thêm thẻ <br/> vào cuối mỗi câu, bỏ qua câu cuối cùng
    <React.Fragment key={index}>
     {sentence && <><span className="big-dot">. </span>{sentence.trim()}<br/></>}
    </React.Fragment>
  ));

const handleSetTourTime = (time: string | Date) => {
    let parsedDate;
    if (time instanceof Date) {
        parsedDate = time;
    } else {
        parsedDate = new Date(time);
    }
    setTourTime(parsedDate.toISOString().split('T')[0]); // Định dạng ngày thành yyyy-MM-dd
};
useEffect(() => {
    if(tour && tour.tourId){
        setTourId(tour.tourId);
        setTourName(tour.tourName);
        setTourDescription(tour.tourDescription);
        setTourPrice(tour.tourPrice);
        setTourAddress(tour.tourAddress);
        handleSetTourTime(tour.tourTime);
        setTourCapacity(tour.tourCapacity);
        setTourDiscount(tour.tourDiscount);
        SetTourDay(tour.tourDay);
        setTourTransportation(tour.tourTransportation);
        setSupplierId(tour.supplierId);
    }
},[tour])


 const handleClosedDetail = () => {
  setShowTourDetail(false)
 }
 return (
    <>
      <Modal className='pt-16 ' show={showTourDetail} onHide={() => handleClosedDetail()} size='lg'>
       
      <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="padding-tour-detail ">
        <Form>
        <div className="container-with-scroll" style={{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: '400px' }}>
  <div className="row">
    <Form.Group className="mb-3 col-6" controlId="tourName">
      <Form.Label className="font-bold text-xl">Tour Name</Form.Label>
      <p>{tourName}</p>
    </Form.Group>
    <Form.Group className="mb-3 col-3" controlId="tourTime">
      <Form.Label className="font-bold text-xl">Tour Time</Form.Label>
      <p>{tourTime}</p>
    </Form.Group>
    <Form.Group className="mb-3 col-3" controlId="tourDay">
      <Form.Label className="font-bold text-xl">Tour Day</Form.Label>
      <p>{tourDay}</p>
    </Form.Group>
    <Form.Group className="mb-3 col-6" controlId="tourTransportation">
      <Form.Label className="font-bold text-xl">Tour Transportation</Form.Label>
      <p>{tourTransportation}</p>
    </Form.Group>
    <Form.Group className="mb-3 col-3" controlId="tourPrice">
      <Form.Label className="font-bold text-xl">Tour Price</Form.Label>
      <p>{tourPrice}$</p>
    </Form.Group>
    <Form.Group className="mb-3 col-3" controlId="tourDiscount">
      <Form.Label className="font-bold text-xl">Discount</Form.Label>
      <p>{tourDiscount}$</p>
    </Form.Group>
    <Form.Group className="mb-3 col-6" controlId="tourAddress">
      <Form.Label className="font-bold text-xl">Tour Address</Form.Label>
      <p>{tourAddress}</p>
    </Form.Group>
    <Form.Group className="mb-3 col-6" controlId="tourCapacity">
      <Form.Label className="font-bold text-xl">Tour Capacity</Form.Label>
      <p>{tourCapacity}</p>
    </Form.Group>
    <Form.Group className="mb-3 col-12" controlId="tourDescription">
      <Form.Label className="font-bold text-xl">Tour Description</Form.Label>
      <p>{formattedDescription}</p>
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
</div>


        </Form>
            </Modal.Body>
       
      </Modal>
    </>
  );
}
export default DetailTour;