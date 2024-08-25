/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import Slider from 'react-slick';
import { Suspense, useEffect, useState } from 'react';
import { getBookingCartByUserId, getHotelById, getRoomById, getRoomImagesByRoomId } from '@/app/services/bookingCartService';
import { BookingCartItem } from '@/app/entities/bookingCartItem';
import { useSearchParams } from 'next/navigation';
import { Oval } from 'react-loader-spinner'; 
import voucherService from '@/app/services/voucherService';
import userService from '@/app/services/userService';
import { toast } from "react-toastify";
import paymentService from '@/app/services/paymentService';
const formatRoomDescription = (description: string) => {
    return description.split('.').map((sentence, index) => {
        if (sentence.trim() === '') return null; // Skip empty strings resulting from splitting
        return (
            <div key={index} className='flex items-baseline pb-2'>
                <img className='w-2 h-2 mr-2' src='/image/tick.png' alt='tick' />
                <span className='font-medium text-base'>{sentence.trim()}.</span>
            </div>
        );
    });
};

const BookingInfo = () => {
    // const successUrl = 'http://localhost:3000/trekbooking';
    const [bookingCart, setBookingCart] = useState<BookingCartItem[]>([]);
    const [roomDetails, setRoomDetails] = useState<IRoom | null>(null);
    const [hotelDetails, setHotelDetails] = useState<IHotel | null>(null);
    const [roomImages, setRoomImages] = useState<IRoomImage[]>([]);
    const [vouchers, setVouchers] = useState<IVoucher[]>([]); // State for vouchers
    const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null); 
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const roomId = Number(searchParams.get('roomId'));
    const hotelId = Number(searchParams.get('hotelId'));
    //const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
    const [user, setUser] = useState<IUser | null>(null);
    const [paidDate, setPaidDate] = useState('');

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const item = bookingCart.find(item => item.roomId === roomId && item.hotelId === hotelId);
    const [requirement , setRequirement ] = useState('');
    useEffect(() => {
        const currentDate = new Date().toISOString(); // Lấy ngày hiện tại và chuyển thành định dạng ISO
        setPaidDate(currentDate);
      }, []);
    useEffect(() => {
        const fetchBookingInfo = async () => {
            try {
              
                const bookingCartItems = await getBookingCartByUserId();
                setBookingCart(bookingCartItems);
                const room = await getRoomById(roomId);
                const hotel = await getHotelById(hotelId);
                setRoomDetails(room);
                setHotelDetails(hotel);
                const images = await getRoomImagesByRoomId(roomId);
                // console.log('Room Images:', images);
                setRoomImages(images);
const fetchedVouchers = await voucherService.getVouchersByHotelId(hotelId);
                setVouchers(fetchedVouchers);
               const userData = await userService.getUserById();
                setUser(userData);
                setFullName(userData.userName || '');
                setEmail(userData.email || '');
                setPhone(userData.phone || '');
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching booking info:', error);
                setIsLoading(false);
            }
        };
        fetchBookingInfo();
    }, [roomId, hotelId]);
   
    const calculateNights = (checkInDate: string, checkOutDate: string) => {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const differenceInTime = checkOut.getTime() - checkIn.getTime();
        return differenceInTime / (1000 * 3600 * 24);
    };

    const calculateTotalPrice_booking = (pricePerNight: number, numberOfNights: number) => {
        return pricePerNight * numberOfNights;
    };

    const applyVoucher = (voucher: IVoucher) => {
        setSelectedVoucher(voucher);
    };

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
              totalPrice: finalTotalPrice,
              checkInDate: item?.checkInDate,
              checkOutDate: item?.checkOutDate,
              requirement: requirement,
              process: "Pending",
              completed: false,
              supplierId: hotelDetails?.supplierId,
              voucherId: selectedVoucher ? selectedVoucher.voucherId : null ,
              voucherCode: selectedVoucher ? selectedVoucher.voucherCode : null ,
            },
            orderDetails: bookingCart.map(cartItem => ({
              roomId: cartItem.roomId,
              hotelId: cartItem.hotelId,
              price: cartItem.totalPrice,
              roomQuantity: cartItem.roomQuantity,
              roomName: roomDetails?.roomName,
              hotelName: hotelDetails?.hotelName,
           

            })),
          },
          successUrl: 'trekbooking/booking_history', // Thay thế bằng URL thành công thực tế của bạn
          cancelUrl: 'trekbooking/booking_cart', // Thay thế bằng URL hủy thực tế của bạn
        };
        const bookingData = {
            bookingId: 0,
            userId: user?.userId,
            hotelId: item.hotelId,
            roomId: item.roomId,
            checkInDate: item?.checkInDate,
            checkOutDate: item?.checkOutDate,
            totalPrice: finalTotalPrice,
            roomQuantity: item.roomQuantity,
            voucherCode: selectedVoucher ? selectedVoucher.voucherCode : null ,
            userNote: requirement, // Sử dụng ghi chú của người dùng nếu có
            status: true,
isConfirmed: true,
          };
        try {
            await paymentService.createBooking(bookingData);
          await paymentService.handlePayment(paymentData, item);
         toast.success('Payment and booking created successfully!');
        } catch (error) {
          console.error('Error during payment and booking:', error);
          toast.error('Failed to complete payment and create booking.');
        }

        
      };

    const buttonStyleEnabled = {
        backgroundColor: '#305A61', // Màu nền ban đầu
        borderRadius: '20px',
    };

    const buttonStyleDisabled = {
        backgroundColor: '#A9A9A9', // Màu xám khi vô hiệu hóa
        borderRadius: '20px',
        cursor: 'not-allowed',
    };

    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Oval
                    height={80}
                    width={80}
                    color='#305A61'
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor='#4f9a94'
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                />
            </div>
        );
    }
   
    if (!item) {
        return <div className='container py-8'>No booking information found.</div>;
    }

    const nights = calculateNights(item.checkInDate, item.checkOutDate);
    const totalPrice = calculateTotalPrice_booking(item.totalPrice, nights);
    const discount = selectedVoucher ? (totalPrice * selectedVoucher.discountPercent / 100) : 0;
    const finalTotalPrice = totalPrice - discount;

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        draggable: true,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
    };

    return (
        <>
            <link
                rel='stylesheet'
                type='text/css'
                href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'
            />
            <link
                rel='stylesheet'
                type='text/css'
                href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'
            />
            <div className='container py-8 pt-44'>
                <div>
              
                    {roomDetails && hotelDetails ? (
                        <div className='border rounded-xl mt-3 pb-6' style={{ boxShadow: '0 4px 4px 0 #7F7F7F' }}>
                            <div className='mx-5 mt-4 mb-2 '>
                                <div className='flex justify-between'>
                                    <span className='font-semibold text-xl'>{roomDetails.roomName}</span>
                                    <Link className='mr-8' href={`/trekbooking/image360/${roomDetails.roomId}`}>
<img src='/image/view3D.png' className='w-10 h-10' alt='view 3D' />
</Link>
                                </div>

                                <div className='row'>
                                    <div className='col-lg-4 col-md-12 '>
                                        {roomImages.length >= 2 ? (
                                            <Slider {...settings}>
                                                {roomImages.map(image => (
                                                    <div key={image.roomImageId} className=''>
                                                        <img
                                                            className='w-3/4 h-60 border rounded-lg mx-auto'
                                                            src={image.roomImageURL}
                                                            alt='room thumbnail'
                                                        />
                                                    </div>
                                                ))}
                                            </Slider>
                                        ) : (
                                            <img
                                                className='w-full h-60 border rounded-lg'
                                                src={roomImages[0]?.roomImageURL}
                                                alt='room thumbnail'
                                            />
                                        )}
                                    </div>

                                    <div className='col-lg-8 col-md-12 border' style={{ borderRadius: '10px' }}>
                                        <div className='row'>
                                        <div className="col-8 border-r border-gray">
                                  <p
                                    className="text-center text-lg font-semibold pt-3"
                                    style={{ color: "#305A61" }}
                                  >
                                    Room information
                                  </p>
                                  <div className='w-3/4 m-auto '>{formatRoomDescription(roomDetails.roomDescription)}</div>
                                </div>
                                            <div className='col-4'>
                                                <div className='row max-[768px]:justify-center'>
                                                    <div className='col-6'>
                                                        <p className='text-center text-sm font-semibold pt-3' style={{ color: '#305A61' }}>
                                                            Guest(s)
                                                        </p>
                                                        <div className='flex flex-wrap items-center pb-1 w-3/4 mx-auto'>
                                                            {Array.from({ length: roomDetails.roomCapacity }).map((_, i) => (
                                                                <img key={i} className='w-4 h-4 m-1' src='/image/user.png' alt='guest' />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className='col-lg-6 col-md-6 flex max-[768px]:items-center'
                                                        style={{
                                                            height: '20rem',
                                                            border: '1px solid #D9D9D9',
                                                            borderRadius: '10px',
backgroundColor: '#F5F5F5',
}}
                                                    >
                                                        <div className='grid justify-items-center r '>
                                                            <span className='text-center text-sm font-semibold pb-3 pt-3 ' style={{ color: '#305A61' }}>
                                                                Price
                                                            </span>
                                                            <span className='text-center  text-xl font-bold pb-3 '   style={{ color: "rgb(255, 94, 31)" }}>
                                                                {roomDetails.roomPrice} $
                                                            </span>
                                                            <span className='text-center text-xs font-light pb-3 md:mr-3' style={{ color: '#8E8D8A' }}>
                                                                Exclude taxes & fees
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='col-12'>
                            <p className='text-center py-4 text-red-600 font-bold'>No items in cart</p>
                        </div>
                    )}
                </div>

                <div className='pt-4'>
                    <a className='no-underline flex items-center font-medium text-xl' style={{ color: '#305A61' }} href='#'>
                        <img src='/image/chevron-down.png' alt='' /> Back
                    </a>
                </div>
                {item && (
                    <div className='row pt-8'>
                        <div className='col-md-6 max-[768px]:pb-6'>
                            <div className='border' style={{ borderRadius: '10px', boxShadow: '0 6px 4px 0 #7F7F7F' }}>
                                <div className='w-4/5 m-auto'>
                                    <div className='text-center pt-5'>
                                        <span className=' text-xl font-semibold' style={{ color: '#305A61' }}>
                                            Guest Information
                                        </span>
                                    </div>
                                    <div className='pt-3'>
                                        <p className='font-semibold'>Full name</p>
                                        <input
value={fullName} // Cập nhật giá trị từ trạng thái
onChange={(e) => setFullName(e.target.value)} // Theo dõi sự thay đổi
                                            type='text'
                                            className='border w-full py-2 px-2'
                                            style={{ borderRadius: '10px', borderColor: '#D2D2D2' }}
                                        />
                                    </div>
                                    <div className='pt-3'>
                                        <p className='font-semibold'>Email</p>
                                        <input
                                            value={email} // Cập nhật giá trị từ trạng thái
                                            onChange={(e) => setEmail(e.target.value)} // Theo dõi sự thay đổi
                                            type='text'
                                            className='border w-full py-2 px-1'
                                            style={{ borderRadius: '10px', borderColor: '#D2D2D2' }}
                                        />
                                    </div>
                                    <div className='pt-3'>
                                        <p className='font-semibold'>Phone number</p>
                                        <input
                                            value={phone} // Cập nhật giá trị từ trạng thái
                                            onChange={(e) => setPhone(e.target.value)} // Theo dõi sự thay đổi
                                            type='text'
                                            className='border w-full py-2 px-1'
                                            style={{ borderRadius: '10px', borderColor: '#D2D2D2' }}
                                        />
                                    </div>
                                    <div className='pt-3'>
                                        <p className='font-semibold'>
                                            Special requirements <span className='font-medium' style={{ color: '#8E8D8A' }}>
                                                (optional)
                                            </span>
                                        </p>
                                        <input type='text' value={requirement}  onChange={(e) => setRequirement(e.target.value)}   className='border w-full py-2 px-1' style={{ borderRadius: '10px', borderColor: '#D2D2D2' }} />
                                    </div>
                                    <div className='flex justify-end pt-3 pb-4'>
                                        <button
                                            className=' text-white font-medium py-2 px-6 text-lg border'
                                            style={{ backgroundColor: '#305A61', borderRadius: '20px' }}
onClick={handlePayment}
                                        >
                                            Continue
</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6 '>
                            <div className='border' style={{ borderRadius: '10px', boxShadow: '0 6px 4px 0 #7F7F7F' }}>
                                <div className='w-3/5 m-auto'>
                                    <div className='text-center pt-5'>
                                        <span className=' text-xl font-semibold' style={{ color: '#305A61' }}>
                                            Price Details
                                        </span>
                                    </div>
                                    <div className='pt-4'>
                                        <div className='flex justify-between'>
                                            <p className='font-semibold text-lg'>1 Room x {nights} Nights:</p> {/* Cập nhật số ngày ở */}
                                            <p className='text-2xl'>{totalPrice}US$</p> {/* Hiển thị tổng giá cho số đêm */}
                                        </div>
                                        <div className='flex justify-between'>
                                            <p className='font-semibold text-lg'>VAT:</p>
                                            <p className='text-2xl'>
                                                <span className='text-2xl'>-</span> 0$
                                            </p>
                                        </div>
                                        <div className='flex justify-between border-solid border-b-2 border-black'>
                                            <p className='font-semibold text-lg'>Discount</p>
                                            <p className='text-2xl'>
                                                <span className='text-2xl'>-</span> {discount.toFixed(2)}US$
                                            </p>
                                        </div>
                                        <div className='flex justify-between pt-2'>
                                            <p className='font-semibold text-lg'>Total</p>
                                            <p className='text-2xl font-semibold'>{finalTotalPrice.toFixed(2)}US$</p> {/* Hiển thị tổng giá cuối cùng */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {vouchers.filter(voucher => voucher.voucherStatus && voucher.voucherQuantity >= 1).length >= 2 ? (
    <Slider {...settings}>
        {vouchers.filter(voucher => voucher.voucherStatus && voucher.voucherQuantity >= 1).map(voucher => {
            const availableDate = new Date(voucher.availableDate).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
            const expireDate = new Date(voucher.expireDate).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });

            return (
                <div key={voucher.voucherId} className='border mt-6' style={{ borderRadius: '10px', boxShadow: '0 6px 4px 0 #7F7F7F' }}>
                    <div className='w-11/12 m-auto'>
                        <div className='pt-5'>
                            <span className='text-xl font-semibold' style={{ color: '#305A61' }}>
                                Discount vouchers:
                            </span>
                        </div>
                        <div className='pt-4'>
                            <div className='pt-2'>
                                <span className='text-lg'>
                                    <span className='text-lg font-semibold'>[{voucher.voucherCode}]</span> -{' '}
                                    <span className='text-red-400 font-semibold'> {voucher.discountPercent}%</span>
                                </span>
                            </div>
                            <div className='flex justify-end font-semibold'>
                                <p className='mb-0'>HSD: {availableDate} - {expireDate}</p>
                            </div>
                        </div>
                        <div className='flex justify-end pt-3 pb-2'>
                            <button
                                className='text-white font-medium py-1 px-4 text-lg border'
                                style={selectedVoucher?.voucherId === voucher.voucherId ? buttonStyleDisabled : buttonStyleEnabled}
                                onClick={() => applyVoucher(voucher)}
                                disabled={selectedVoucher?.voucherId === voucher.voucherId}
                            >
                                {selectedVoucher?.voucherId === voucher.voucherId ? 'Applied' : 'Apply'}
                            </button>
                        </div>
                    </div>
                </div>
            );
        })}
    </Slider>
) : (
    vouchers.filter(voucher => voucher.voucherStatus && voucher.voucherQuantity >= 1).map(voucher => {
        const availableDate = new Date(voucher.availableDate).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        const expireDate = new Date(voucher.expireDate).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        return (
            <div key={voucher.voucherId} className='border mt-6' style={{ borderRadius: '10px', boxShadow: '0 6px 4px 0 #7F7F7F' }}>
                <div className='w-11/12 m-auto'>
                    <div className='pt-5'>
                        <span className=' text-xl font-semibold' style={{ color: '#305A61' }}>
                            Discount vouchers:
                        </span>
                    </div>
                    <div className='pt-4'>
                        <div className='pt-2'>
                            <span className='text-lg'>
                                <span className='text-lg font-semibold'>[{voucher.voucherCode}]</span> -{' '}
                                <span className='text-red-400 font-semibold'> {voucher.discountPercent}%</span>
                            </span>
                        </div>
                        <div className='flex justify-end font-semibold'>
                            <p className='mb-0'>HSD: {availableDate} - {expireDate}</p>
                        </div>
                    </div>
                    <div className='flex justify-end pt-3 pb-2'>
                        <button
                            className='text-white font-medium py-1 px-4 text-lg border'
                            style={selectedVoucher?.voucherId === voucher.voucherId ? buttonStyleDisabled : buttonStyleEnabled}
                            onClick={() => applyVoucher(voucher)}
                            disabled={selectedVoucher?.voucherId === voucher.voucherId}
                        >
                            {selectedVoucher?.voucherId === voucher.voucherId ? 'Applied' : 'Apply'}
                        </button>
                    </div>
                </div>
            </div>
        );
    })
)}


                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default function WrappedLoginSupplier() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <BookingInfo />
        </Suspense>
    );
  }