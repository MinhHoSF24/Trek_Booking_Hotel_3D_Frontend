import Image from "next/image";

const Footer = () => {
  return (
    <>
      <footer className="bg-neutral-800">
        <div className="container grid content-center h-full py-8 ">
          <div className="row max-[1024px]:text-center">
            <div className="col-lg-3 col-12 ">
              <div className="mb-4 ">
                <p className="text-xl text-white font-bold">
                  ABOUT TREK BOOKING
                </p>
                <a
                  href="/how-to-book"
                  className="text-base text-white block mt-2 no-underline"
                >
                  How to Book
                </a>
                <a
                  href="/contact-us"
                  className="text-base text-white block mt-2 no-underline"
                >
                  Contact Us
                </a>
                <a
                  href="/help-center"
                  className="text-base text-white block mt-2 no-underline"
                >
                  Help Center
                </a>
                <a
                  href="/about-us"
                  className="text-base text-white block mt-2 no-underline"
                >
                  About Us
                </a>
                <a
                  href="/terms-conditions"
                  className="text-base text-white block mt-2 no-underline"
                >
                  Terms & Conditions
                </a>
                <a
                  href="/new-release-features"
                  className="text-base text-white block mt-2 no-underline"
                >
                  New Release Features
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-12  ">
              <div className="mb-4  ">
                <p className="text-xl text-white font-bold">PRODUCT</p>
                <a
                  href="/trekbooking/list_hotel"
                  className="text-base text-white block mt-2 no-underline"
                >
                  Hotel
                </a>
                <a
                  href="/trekbooking/tour"
                  className="text-base text-white block mt-2 no-underline"
                >
                  Attraction
                </a>
                <a
                  href="/signup_supplier"
                  className="text-base text-white block mt-2 no-underline"
                >
                  Register Your Accommodation
                </a>
                <a
                  href="/top-hotels"
                  className="text-base text-white block mt-2 no-underline"
                >
                  Top 5 Hotel
                </a>
                <a
                  href="/top-attractions"
                  className="text-base text-white block mt-2 no-underline"
                >
                  Top 5 Attraction
                </a>
                <a
                  href="/things-to-do"
                  className="text-base text-white block mt-2 no-underline"
                >
                  Things to Do
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-12 flex max-[1024px]:justify-center ">
              <div className="mb-4 ">
                <p className="text-xl text-white font-bold  ">FOLLOW US ON</p>
                <div className="flex space-x-4 mt-2">
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/image/instagram-logo.png"
                      width={40}
                      height={40}
                      alt="Instagram"
                    />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61562667667183"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/image/facebook-logo.png"
                      width={40}
                      height={40}
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://www.tiktok.com/@tien_v?_t=8o2X9VpJAxN&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/image/tiktok-logo.png"
                      width={40}
                      height={40}
                      alt="TikTok"
                    />
                  </a>
                  <a
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/image/youtube-logo.png"
                      width={40}
                      height={40}
                      alt="YouTube"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-12 relative">
              <div className="mb-4">
                <p className="text-xl text-white font-bold">CONTACT US</p>
                <p className="text-base text-white">Phone: 0913477124</p>
                <p className="text-base text-white">
                  Email: trekbookingvn@gmail.com
                </p>
                <p className="text-base text-white">
                  Address: 600 Nguyen Van Cu Noi Dai, An Binh, Ninh Kieu, Can
                  Tho 900000
                </p>
                <div className="mt-4 flex  max-[1024px]:justify-center">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0533542569992!2d105.72985667492205!3d10.012451790093616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0882139720a77%3A0x3916a227d0b95a64!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgQ-G6p24gVGjGoQ!5e0!3m2!1sen!2s!4v1721064964597!5m2!1sen!2s"
                    width="235"
                    height="150"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-10 flex justify-center border-t">
          <p className="text-white text-base pt-2">
            Copyright © 2024 Trek Booking. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;