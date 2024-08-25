/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import Link from "next/link";
import { Carousel } from "react-bootstrap";
import Searchcart from "./searchcart";
import roomImageService from "../services/roomImageService";
import Slider from "react-slick";
import { Oval } from "react-loader-spinner"; // Import spinner
import  "../../../public/css/slider.css";
import React, { useEffect, useState } from "react";
const Homepage = () => {
  const [roomImages, setRoomImages] = useState<IRoomImage[]>([]);
  useEffect(() => {
    const fetchRoomImages = async () => {
      try {
        const images = await roomImageService.getRoomImage();
        setRoomImages(images);
      } catch (error) {
        console.error('Error fetching room images:', error);
      }
    };

    fetchRoomImages();
  }, []);
   // Hàm để chia dữ liệu hình ảnh thành các nhóm 4 hình
   const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Hiển thị 4 hình ảnh mỗi lần
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
     <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      <div className="pt-44">
        <Searchcart />
        <div className="slider h-96 p-12 backgr-home">
          <h1 className="pb-4 pl-6 font-bold">Plenty of hotel selections</h1>
          <Slider {...settings}>
      {roomImages.length > 0 ? (
        roomImages.map((image) => (
          <Link key={image.roomImageId} className='text-decoration-none' href="/trekbooking/list_hotel">
            <img
              className="rounded-2xl px-2"
              src={image.roomImageURL}
              alt={`Room image ${image.roomImageId}`}
            />
          </Link>
        ))
      ) : (
        <div className="flex justify-center items-center">
          
      </div>
      )}
    </Slider>
        </div>
        <div className="villas p-12 backgr-home">
          <h1 className="pb-4 pl-6 font-bold text-small">
            Explore various villas and apartments at Trek Booking
          </h1>
          <div className=" row">
            <Link href="/trekbooking/list_hotel" className="col col-6">
              <img className="w-100 cursor-pointer" src="/image/Villa.png" alt="" />
            </Link>
            <Link href="/trekbooking/list_hotel" className="col col-6">
              <img className="w-100 cursor-pointer" src="/image/Apartments.png" alt="" />
            </Link>
          </div>
        </div>
        <div className="content-page p-12 backgr-home relative">
          <h1 className="pb-4 pl-6 font-bold text-center">
          Explore Your World
          </h1>
          <div className="line">
            <img src="/image/linecontent.png" alt="" />
          </div>
          <div className="cham">
            <img src="/image/cham.png" alt="" />
          </div>
          <div className="cham1">
            <img src="/image/cham.png" alt="" />
          </div>
          <div className="cham2">
            <img src="/image/cham.png" alt="" />
          </div>
          <div className="cham3">
            <img src="/image/cham.png" alt="" />
          </div>
          <div className="row reponsive-content pb-12">
            <div className="col col-lg-6 col-md-12  col-sm-12 col-12 img-reponsive-1024">
              <img src="/image/content1.png" alt="" />
            </div>

            <div className=" col col-lg-6 col-md-12 col-sm-12 col-12  text-content reponsive-content">
              <p className="text-blackish font-bold text-2xl  text-content-wrap mt--8 text-center-1024 width-70 float-right  magin-r-0">
              Tourism Tour
              </p>
              <p className="text-center-1024 width-70 float-right  magin-r-0 text-xl">
              Tourism tours offer amazing and unforgettable experiences for travelers. Experience beautiful landscapes, enjoy rich local cuisine, and participate in unique cultural activities. All of these will create memorable moments in each journey.
              </p>
            </div>
          </div>

          <div className="row reponsive-content pb-12">
            <div className=" col col-lg-6 col-md-12 col-sm-12 col-12  text-content reponsive-content">
              <p className="text-blackish font-bold text-2xl  text-content-wrap mt--8 text-center-1024 width-70 float-left  magin-r-0">
              Adventurous Expeditions
              </p>
              <p className="text-center-1024 width-70 float-left  magin-r-0 text-xl">
              Adventurous expeditions provide thrill-seekers with the chance to explore uncharted territories. Engage in exhilarating activities, from mountain climbing to deep-sea diving, and discover the beauty of nature’s most remote places. Each adventure brings new challenges and unforgettable memories.
              </p>
            </div>
            <div className="col col-lg-6 col-md-12  col-sm-12 col-12 img-reponsive-1024 image-repons">
              <img src="/image/content2.png" alt="" />
            </div>
          </div>

          <div className="row reponsive-content pb-12">
            <div className="col col-lg-6 col-md-12  col-sm-12 col-12 img-reponsive-1024">
              <img src="/image/content3.png" alt="" />
            </div>

            <div className=" col col-lg-6 col-md-12 col-sm-12 col-12  text-content reponsive-content">
              <p className="text-blackish font-bold 2text-xl  text-content-wrap mt--8 text-center-1024 width-70 float-right  magin-r-0">
              Cultural Journeys
              </p>
              <p className="text-center-1024 width-70 float-right  magin-r-0 text-xl">
              Cultural journeys immerse travelers in the rich heritage and traditions of diverse communities. Visit historical landmarks, attend local festivals, and learn about the unique customs of each destination. These experiences foster a deeper understanding and appreciation of different cultures.
              </p>
            </div>
          </div>

          <div className="row reponsive-content pb-12">
            <div className=" col col-lg-6 col-md-12 col-sm-12 col-12  text-content reponsive-content">
              <p className="text-blackish font-bold text-2xl  text-content-wrap mt--8 text-center-1024 width-70 float-left  magin-r-0">
              Relaxing Retreats
              </p>
              <p className="text-center-1024 width-70 float-left  magin-r-0 text-xl">
              Relaxing retreats offer a perfect escape from the hustle and bustle of everyday life. Enjoy serene environments, luxurious spa treatments, and peaceful surroundings. These retreats provide an opportunity to rejuvenate and unwind, leaving you refreshed and revitalized.
              </p>
            </div>
            <div className="col col-lg-6 col-md-12  col-sm-12 col-12 img-reponsive-1024 image-repons">
              <img src="/image/content4.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div
        className=" w-full bg-auto bg-no-repeat bg-center flex justify-center backgr-home"
        style={{
          background: "url(/image/bg_city_hall.png)",
          backgroundSize: "cover",
          height: "957px",
          position: "relative",
        }}
      >
        <div style={{}}></div>
        <div
          className="w-3/4 h text-center grid content-center"
          style={{ height: "957px" }}
        >
          <h2 className="color247 font-bold text-4xl">
          Discover Luxurious Stays: Your Ultimate Hotel Experience Awaits in Every Destination.
          </h2>
        </div>
      </div>

      {/* ------------------------------------------------------------------------------------------ */}
      <div className=" backgr-home">
        <div className="container ">
          <div className="text-center pt-12">
            <p className="font-bold text-4xl text-black">
              Enhance your trip the way you like it
            </p>
          </div>
          <div className="w-3/5 text-center m-auto">
            <p className="text-base font-normal">
            Tailor your travel experience to suit your personal preferences. Choose from a variety of accommodations, from cozy boutique hotels to luxurious resorts. Enjoy personalized services, exclusive amenities, and unique local experiences. Whether you seek adventure, relaxation, or cultural immersion, our tailored options ensure your trip is exactly how you envision it.
            </p>
          </div>

          <Link href="/trekbooking/tour" className="row pt-5 text-decoration-none">
  
          <div className="col-md-4 col-4  grid items-center justify-items-center justify-center card1 cursor-pointer">
              <Image
                src={"/image/boat1.png"}
                className="card1"
                width={410}
                height={550}
                alt="thuyen"
              ></Image>
              <div className="mt-3">
                <p className="lg:text-lg font-bold text-black">Tours and Attraction</p>
              </div>
            </div>
            <div className="col-md-4 col-4  grid items-center justify-items-center justify-center card1 cursor-pointer">
              <Image
                src={"/image/floatingHomeStay.png"}
                className="card1"
                width={410}
                height={550}
                alt="nha tren song"
              ></Image>
              <div className="mt-3">
                <p className="lg:text-lg font-bold text-black">Fun Activities</p>
              </div>
            </div>
            <div className="col-md-4 col-4  grid items-center justify-items-center justify-center card1 cursor-pointer">
              <Image
                src={"/image/tuktuk.png"}
                className="card1"
                width={410}
                height={550}
                alt="xe tuk tuk"
              ></Image>
              <div className="mt-3">
                <p className="lg:text-lg  font-bold text-black">Travel Insurance</p>
              </div>
            </div>
          
            </Link>
        </div>
      </div>
      {/* ------------------------------------------------------------------------------------------ */}
      <div className="container my-24 ">
        <div className="mb-5">
          <p className="font-bold text-4xl">Why book with Trek Booking ?</p>
        </div>

        <div className="w-full row">
          <div className="col-md-4 h-full pb-4">
            <div className="h-full rounded-20">
               <p className="title-whatbook pl-4 mt-3 text-lg">
                Why Choose Us?
              </p>
              <div className="w-full  px-3 text-base pb-4">
              Exceptional travel experiences tailored just for you. Enjoy seamless booking and personalized services.
              </div>
            </div>
          </div>
          <div className="col-md-4  h-full pb-4">
            <div className="h-full rounded-20">
              <p className="title-whatbook pl-4 mt-3 text-lg">
               Our Promise
              </p>
              <div className="w-full  px-3 text-base pb-4">
              Unforgettable adventures with top-notch service and unmatched value. Your satisfaction guaranteed.
              </div>
            </div>
          </div>
          <div className="col-md-4  h-full  pb-4">
            <div className="h-full rounded-20">
              <p className="title-whatbook pl-4 mt-3 text-lg">
              Book with Confidence
              </p>
              <div className="w-full  px-3 text-base pb-4">
              Secure and easy booking process. Enjoy peace of mind and exceptional travel support.
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ------------------------------------------------------------------------------------------ */}
      <div className=" p-12 backgr-home">
        <h3 className="pb-4  font-bold text-2xl">
          Rediscover yourself in Asia and beyond
        </h3>
        <div className="row">
          <div className="col-lg-3 col-md-3 col-3 relative">
            <img src="/image/jappan.png" alt="" />
          </div>
          <div className="col-lg-3 col-md-3 col-3">
            <img src="/image/indonesia.png" alt="" />
            <img className="pt-8" src="/image/taiwan.png" alt="" />
          </div>
          <div className="col-lg-3 col-md-3 col-3">
            <img src="/image/vietnam.png" alt="" />
            <img className="pt-8" src="/image/china.png" alt="" />
          </div>
          <div className="col-lg-3 col-md-3 col-3">
            <img src="/image/korea.png" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
