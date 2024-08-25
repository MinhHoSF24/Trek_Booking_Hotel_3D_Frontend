import React from 'react'
import Link from '../../../node_modules/next/link'
import Searchcart from '../components/searchcart'
const page = () => {
  return (
    <div>


    <nav className="to-white pt-2 pb-2">
    <ul className="flex ul-menu">
      <li className="li-menu hover-bold">
        <Link href="/"
        className="font-bold text-decoration-none  "
        style={{ color: "#305A61" }}
      >
        Home
        </Link>
      </li>
      <li className="li-menu hover-bold">
        <a href="" className="font-bold text-decoration-none" style={{ color: "#1F1C17" }}>
          Hotel
        </a>
      </li>
      <li className="li-menu hover-bold">
        <a href="" className="font-bold text-decoration-none" style={{ color: "#1F1C17" }}>
          Attractions
        </a>
      </li>
      <li className="li-menu hover-bold none-t">
        <a href="" className="font-bold text-decoration-none" style={{ color: "#1F1C17" }}>
          Gift Voucher
        </a>
      </li>
    </ul>
  </nav>
   <Searchcart/>
   <div className="content-cart backgr-home pb-16">
    <div className="container">
    <div className="backhome flex pb-8">
      <img src="/image/back.png" alt="" />
    <a href="" className='no-underline text-blackish  text-xl'>Back to home</a>
    
    </div>
    <h4 className='text-blackish font-bold ml-2'>For my upcoming trip</h4>
    <div className="card-cart">
      <p className='font-bold ml-2 pt-4'>Deluxe Double Or Twin Garden View</p>
      <div className="row">
         <div className="col-4">
          <div className="img-big pb-2">
            <img src="/image/imgcart1.png" alt="" />
          </div>
          <div className="img-small flex">
          <img className='w-100-768' src="/image/imgcart2.png" alt="" />
          <img className='ml-2  none-768' src="/image/imgcart3.png" alt="" />
          <img className='ml-2 w992-none' src="/image/imagecart4.png" alt="" />
          </div>
         </div>
         <div className="col-8">
          <div className="row border-room">
            <div className="col-lg-4 mt-1 ">
               <p className='text-blackish text-xl text-center font-bold'>Room information</p>
               <div className="text-cart flex">
                <img className='mt-1 yes-icon' src="/image/yes.png" alt="" />
                <p className='ml-2 text-xl'>Lorem ipsum dolor sit</p>
               </div>
               <div className="text-cart flex">
                <img className='mt-1 yes-icon' src="/image/yes.png" alt="" />
                <p className='ml-2 text-xl'>Lorem ipsum dolor sit</p>
               </div>
               <div className="text-cart flex">
                <img className='mt-1 yes-icon' src="/image/yes.png" alt="" />
                <p className='ml-2 text-xl'>Lorem ipsum dolor sit</p>
               </div>
           
            </div>
            <div className="mt-1 col-lg-4">
            <p className='text-blackish text-xl text-center font-bold'>Convenient</p>
            <div className="text-cart flex">
                <img className='mt-1 yes-icon' src="/image/wifi.jpg" alt="" />
                <p className='ml-2 text-xl'>Free WiFi</p>
               </div>
               <div className="text-cart flex">
                <img className='mt-1 yes-icon' src="/image/smoking1.png" alt="" />
                <p className='ml-2 text-xl'>Non-smoking rooms</p>
               </div>
               <div className="text-cart flex">
                <img className='mt-1 yes-icon' src="/image/call.png" alt="" />
                <p className='ml-2 text-xl'>24-hour reception</p>
               </div>
              </div>
              <div className="col-lg-2 ">
            <p className='text-blackish text-xl text-center font-bold'>Guest(s)</p>
            <div className="text-cart flex">
                <img className='mt-1 yes-icon' src="/image/user.png" alt="" />
                <img className='mt-1 yes-icon ml-1' src="/image/user.png" alt="" />
               </div>
              </div>
              <div className="col-lg-2 bg-D9D9D9 bk-none-ts">
              <p className='text-blackish text-xl text-center font-bold'>Price</p>
              <p className='text-unli font-bold text-center ' style={{color:"#8E8D8A"}}>45US$</p>
              <p className='font-bold text-center' >35US$</p>
             <p className='fz-12' style={{color:"#8E8D8A"}}>Exclude taxes & fees</p>
           <div className="text-center">
           <button className='font-bold check-cart text-center buttonrepon'>Check</button>
             <button className='font-bold choose-cart text-center buttonrepon1 magin-6'>Choose</button>
           </div>
              </div>
          </div>
         </div>
      </div>
    </div>
    </div>

   </div>
    </div>
  )
}

export default page