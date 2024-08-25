"use client"

import { Suspense, useEffect, useState } from 'react';
import tourService from "@/app/services/tourService"; // Đảm bảo import đúng
import { ITour } from '@/app/entities/tour';
import { useRouter, useSearchParams } from "next/navigation";
import { Oval } from 'react-loader-spinner';
import userService from '@/app/services/userService';
import { toast } from "react-toastify";
import { BookingCartTour } from '@/app/entities/BookingCartTour';
import { getCartTourByUserId } from '@/app/services/bookingCartTourService';
import paymentService from '@/app/services/paymentService';

const TourOrder = () => {
  const [bookingCart, setBookingCart] = useState<BookingCartTour[]>([]);
  const [tourDetails, setTourDetails] = useState<ITour | null>(null);

  const searchParams = useSearchParams();
  const tourId = Number(searchParams.get('tourId'));
  const quantity = Number(searchParams.get('quantity'));

  const [tour, setTour] = useState<ITour | null>(null);
  const [loading, setLoading] = useState(true);


  const [user, setUser] = useState<IUser | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const isFormValid = fullName && email && phone;

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!tourId || !quantity) {
      setLoading(false);
      return;
    }

    const fetchTour = async () => {
      try {

        const bookingCartItems = await getCartTourByUserId();
        setBookingCart(bookingCartItems);
        const fetchedTour = await tourService.getTourById(tourId);
        setTour(fetchedTour);
        setTourDetails(fetchedTour);
        const userData = await userService.getUserById();
        setUser(userData);
        setFullName(userData.userName || '');
        setEmail(userData.email || '');
        setPhone(userData.phone || '');
      } catch (error) {
        console.error('Failed to fetch tour:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId, quantity]);





  const handlePayment = async () => {
    if (!item) {
      toast.error('No booking item found!');
      return;
    }
    if (!fullName || !email || !phone) {
      toast.error('Please fill out all required fields.');
      return;
    }
    const paymentData = {
      Order: {
        orderHeader: {
          userId: user?.userId,
          fullName: fullName, // Sử dụng giá trị từ trạng thái
          email: email,       // Sử dụng giá trị từ trạng thái
          phone: phone,
          totalPrice: finalPrice,
          tourOrderDate: getCurrentDate(),
          process: "Pending",
          completed: false,
          supplierId: tourDetails?.supplierId
        },
        orderDetails: bookingCart.map(cartItem => ({
          tourId: cartItem.tourId,
          tourName: tourDetails?.tourName,
          tourOrderQuantity: quantity,
          tourTotalPrice: finalPrice,
        })),
      },
      successUrl: 'trekbooking/booking_history', // Thay thế bằng URL thành công thực tế của bạn
      cancelUrl: 'trekbooking/booking_cart', // Thay thế bằng URL hủy thực tế của bạn
    };
    const bookingData = {
      bookingId: 0,
      userId: user?.userId,
      supplierId: tourDetails?.supplierId,
      tourId: item.tourId,
      tourOrderDate: getCurrentDate(),
      TourOrderQuantity: quantity,
      TourTotalPrice: finalPrice,
      status: true,
      isConfirmed: true,
    };
    await paymentService.createTourOrder(bookingData);
    await paymentService.handleTourPayment(paymentData);

  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Oval
          height={80}
          width={80}
          color="#305A61"
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#4f9a94"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  const item = bookingCart.find(item => item.tourId === tourId);
  if (!item) {
    return <div className='container py-8'>No booking Tour information found.</div>;
  }

  if (!tour) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Tour not found or invalid parameters.</p>
      </div>
    );
  }

  const totalPrice = tour.tourPrice * quantity;
  const discountAmount = (totalPrice * tour.tourDiscount) / 100;
  const finalPrice = totalPrice - discountAmount;

  return (
    <>
      <div className="container py-8 pt-44">
        <div>
          <a
            className="no-underline flex items-center font-medium text-xl"
            style={{ color: "#305A61" }}
            href="#"
          >
            <img src="/image/chevron-down.png" alt="" /> Back
          </a>
        </div>
        <div className="row pt-8">
          <div className="col-md-6">
            <div
              className="border"
              style={{ borderRadius: "10px", boxShadow: "0 6px 4px 0 #7F7F7F" }}
            >
              <div className="w-4/5 m-auto">
                <div className="text-center pt-5">
                  <span
                    className=" text-xl font-semibold"
                    style={{ color: "#305A61" }}
                  >
                    Guest Information
                  </span>
                </div>
                <div className="pt-3">
                  <p className="font-semibold">Full name</p>
                  <input
                    value={fullName} // Cập nhật giá trị từ trạng thái
                    onChange={(e) => setFullName(e.target.value)} // Theo dõi sự thay đổi
                    type='text'
                    required
                    className='border w-full py-2 px-2'
                    style={{ borderRadius: '10px', borderColor: '#D2D2D2' }}
                  />
                </div>
                <div className="pt-3">
                  <p className="font-semibold">Email</p>
                  <input
                    value={email} // Cập nhật giá trị từ trạng thái
                    onChange={(e) => setEmail(e.target.value)} // Theo dõi sự thay đổi
                    type='text'
                    required
                    className='border w-full py-2 px-1'
                    style={{ borderRadius: '10px', borderColor: '#D2D2D2' }}
                  />
                </div>
                <div className="pt-3">
                  <p className="font-semibold">Phone number</p>
                  <input
                    value={phone} // Cập nhật giá trị từ trạng thái
                    onChange={(e) => setPhone(e.target.value)} // Theo dõi sự thay đổi
                    type='text'
                    required
                    className='border w-full py-2 px-1'
                    style={{ borderRadius: '10px', borderColor: '#D2D2D2' }}
                  />
                </div>

                <div className="flex justify-end pt-3 pb-4">
                <button
              className="text-white font-medium py-2 px-6 text-lg border"
             style={{ backgroundColor: "#305A61", borderRadius: "20px" }}
              onClick={handlePayment}
              >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="border"
              style={{ borderRadius: "10px", boxShadow: "0 6px 4px 0 #7F7F7F" }}
            >
              <div className="w-3/5 m-auto">
                <div className="text-center pt-5">
                  <span
                    className=" text-xl font-semibold"
                    style={{ color: "#305A61" }}
                  >
                    Price Details
                  </span>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between">
                    <p className="font-semibold text-lg">{tour.tourPrice} US$ x {quantity} Member:</p>
                    <p className="text-2xl">{totalPrice} US$</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-semibold text-lg">VAT:</p>
                    <p className="text-2xl">
                      <span className="text-2xl"></span> 0US$
                    </p>
                  </div>
                  <div className="flex justify-between border-solid border-b-2 border-black">
                    <p className="font-semibold text-lg">Discount</p>
                    <p className="text-2xl">
                      <span className="text-2xl">-</span> {discountAmount} US$
                    </p>
                  </div>
                  <div className="flex justify-between pt-2">
                    <p className="font-semibold text-lg">Total</p>
                    <p className="text-2xl font-semibold">{finalPrice} US$</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};


export default function WrappedLoginSupplier() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TourOrder />
    </Suspense>
  );
}