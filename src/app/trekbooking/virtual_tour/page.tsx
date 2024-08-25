import React from 'react'
import '../../../../public/css/voucher.css'
const page = () => {
  return (
  
    <div>
    <nav className="to-white pt-2 pb-2">
          <ul className="flex ul-menu">
            <li className="li-menu hover-bold">
              <a
                href=""
                className="font-bold text-decoration-none link-style "
                style={{ color: "#305A61" }}
              >
                Home
              </a>
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
      <div className="virtual flex justify-center">
       <div className="border-virtual">
         <div className="virtual-tour flex justify-center items-center">
          <img className='img-line' src="/image/line40.png" alt="" />
          <h5 className='px-3 color-primary font-semibold fz-16'>Virtual tour</h5>
          <img className='img-line' src="/image/line40.png" alt="" />
         </div>
  
         <p className='color-primary text-center pb-3 fz-12'>Lorem ipsum dolor sit amet consectetur. Vel sit dignissim feugiat semper at pharetra laoreet</p>
       </div>
      </div>
     <div className="body-image-360 backgr-home">
     <div className="container color-black">
     <p>Lorem ipsum dolor sit amet consectetur. Sodales vitae gravida eget tristique sed nec. Lectus ac viverra arcu vestibulum. Tincidunt velit nulla pellentesque dolor cras. Lacus auctor ut quis ullamcorper consectetur sit.</p>
     <p>Lorem ipsum dolor sit amet consectetur. Sodales vitae gravida eget tristique sed nec. Lectus ac viverra arcu vestibulum. Tincidunt velit nulla pellentesque dolor cras. Lacus auctor ut quis ullamcorper consectetur sit.</p>
     <div className="image-session relative pt-3 pb-14">
      <img className='relative' src="/image/image360.png" alt="" />
      <div className="action-image flex justify-between">
        <img className='cursor-pointer wh-fix' src="/image/left360.png" alt="" />
        <div className="img-control flex">
        <img className='mx-1 cursor-pointer wh-fix' src="/image/plus.png" alt="" />
        <img className='mx-1 cursor-pointer wh-fix' src="/image/minus.png" alt="" />
        <img className='mx-1 cursor-pointer wh-fix' src="/image/up.png" alt="" />
        <img className='mx-1 cursor-pointer wh-fix' src="/image/down1.png" alt="" />
        
        </div>
        <img className='cursor-pointer wh-fix' src="/image/right360.png" alt="" />

      </div>
     </div>
     </div>
     </div>
    </div>
  )
}

export default page