'use client'
import tourService, { createTour, revalidateTours } from '@/app/services/tourService';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '../../../node_modules/react-bootstrap/esm/Modal';




interface Iprops {
    showRate: boolean;
    setShowRate: (value: boolean) => void;
}
function Rates(props: Iprops) {
    // npm i --save-exact react-toastify@9.1.3
    const {showRate, setShowRate} = props;
    


   
 

    

   const handleCloseModal = () => {
    setShowRate(false)
   }
  return (
    <>
      <Modal className='pt-12' show={showRate} onHide={() => handleCloseModal()} size='lg'>
        <div className="title flex items-center px-6 py-3">
            <img onClick={() => handleCloseModal()} className='w-5 h-5 cursor-pointer' src="/image/comefeedback.png" alt="" />
            <p className='mb-0 ml-6 '>Feedback</p>
        </div>
         <div className="image-review px-6 py-3 flex">
            <img className='w-20 h-14' src="/image/hotelrate.png" alt="" />
            <div className="text-hotel-rate ml-4">
               <p className='font-bold mb-0'>Ceraja Hotel & Resort Dalat</p>
               <p>Deluxe Double Or Twin Garden View</p>
            </div>
         </div>
         <div className="input-rate-text px-6 py-1">
         <textarea className='outline-none review-text'  placeholder='Enter your review...............'></textarea>
         </div>
         <div className="rateting-star px-6 pt-4 flex justify-between max-[540px]:text-xs">
          <p>How do you feel <br/> about the product?</p>
          <div className="danhgia cursor-pointer ">
            <img className='m-auto w-5 h-5' src="/image/star.png" alt="" />
            <p>Very bad</p>
          </div>
          <div className="danhgia cursor-pointer ">
            <img className='m-auto w-5 h-5' src="/image/star.png" alt="" />
            <p>Not bad</p>
          </div>
          <div className="danhgia cursor-pointer ">
            <img className='m-auto w-5 h-5' src="/image/star.png" alt="" />
            <p>Average</p>
          </div>
          <div className="danhgia cursor-pointer ">
            <img className='m-auto w-5 h-5' src="/image/star.png" alt="" />
            <p>Good</p>
          </div>
          <div className="danhgia cursor-pointer ">
            <img className='m-auto w-5 h-5' src="/image/star.png" alt="" />
            <p>Excellent</p>
          </div>
         </div>
         <div className="input-review-phone px-6 pt-4 flex">
           <div className="fullname w-1/2">
            <p className='mb-0 pb-1 font-semibold'>Full name</p>
            <input type="text" className='input-full-rate ' />
           </div>
           <div className="email w-1/2 text-right">
            <p className='mb-0 pb-1 font-semibold text-left ml-4 max-[992px]:ml-6'>Email or phone number</p>
            <input type="text" className='input-full-rate  text-right' />
           </div>
           
         </div>
         <div className="send-button px-6 pt-4 pb-4 flex justify-end">
            <button className='send'>Send</button>
           </div>
      </Modal>
    </>
  );
}

export default Rates;

