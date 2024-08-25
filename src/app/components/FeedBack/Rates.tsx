/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import { FaStar } from "react-icons/fa";
import rateService from "@/app/services/rateService";
import commentService from "@/app/services/commentService";

interface Iprops {
  showRate: boolean;
  setShowRate: (value: boolean) => void;
  bookingId: number | null;
  userId: number | null;
  hotelId: number | null;
  orderHotelHeaderId: number | null;
  hotelName: string | null;
  roomName: string | null;
  roomImageURL: string | null;
}

function Rates(props: Iprops) {
  const {
    showRate,
    setShowRate,
    bookingId,
    userId,
    hotelId,
    orderHotelHeaderId,
    hotelName,
    roomName,
    roomImageURL,
  } = props;
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const handleSendFeedback = async () => {
    try {
      if (bookingId && userId && hotelId && orderHotelHeaderId) {
        await rateService.rateBooking({
          rateId: 0,
          rateValue: rating,
          bookingId,
          userId,
          hotelId,
          orderHotelHeaderId,
        });

        await commentService.commentBooking({
          commentId: 0,
          userId,
          orderHotelHeaderId,
          bookingId,
          hotelId,
          dateSubmitted: new Date(),
          message: comment,
        });

        toast.success("Successfully rated and commented!");
        handleCloseModal();
        window.location.reload();
      } else {
        toast.error("Missing information to submit feedback.");
      }
    } catch (error) {
      toast.error("Failed to rate and comment.");
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setShowRate(false);
  };

  return (
    <>
      <style jsx>{`
        .danhgia {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }
        .send {
          background-color: #305a61;
          color: white;
          border: none;
          width: 102px;
          height: 34px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .send:hover {
          background-color: #203a41;
        }
        .send-button {
          padding-right: 50px;
        }
      `}</style>
      <Modal
        className="pt-12"
        show={showRate}
        onHide={handleCloseModal}
        size="lg"
      >
        <div className="title flex items-center px-6 py-3">
          <img
            onClick={handleCloseModal}
            className="w-5 h-5 cursor-pointer"
            src="/image/comefeedback.png"
            alt=""
          />
          <p className="mb-0 ml-6">Feedback</p>
        </div>
        <div className="image-review px-6 py-3 flex">
<img className="w-20 h-14" style={{borderRadius: "10px"}} src={roomImageURL || "/image/hotelrate.png"} alt="Room" />
          <div className="text-hotel-rate ml-4">
            <p className="font-bold mb-0">{hotelName}</p>
            <p>{roomName}</p>
          </div>
        </div>
        <div className="input-rate-text px-6 py-1">
          <textarea
            className="outline-none review-text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            placeholder="Enter your review..............."
          ></textarea>
        </div>
        <div className="rateting-star px-6 pt-4 flex justify-between max-[540px]:text-xs">
          <p>
            How do you feel <br /> about the product?
          </p>
          {[1, 2, 3, 4, 5].map((value) => (
            <div
              key={value}
              className="danhgia cursor-pointer"
              onClick={() => setRating(value)}
              style={{ textAlign: "center" }}
            >
              <FaStar color={value <= rating ? "gold" : "gray"} size={24} />
              <p>
                {value === 1
                  ? "Very bad"
                  : value === 5
                  ? "Excellent"
                  : value === 4
                  ? "Good"
                  : value === 3
                  ? "Average"
                  : "Not bad"}
              </p>
            </div>
          ))}
        </div>
        <div className="send-button px-6 pt-4 pb-4 flex justify-end">
          <button className="send px-3 pt-2" onClick={handleSendFeedback}>
            Send
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Rates;