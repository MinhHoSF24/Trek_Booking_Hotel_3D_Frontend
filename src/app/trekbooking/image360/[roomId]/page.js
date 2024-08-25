'use client';
import React, { useEffect, useState, useRef } from 'react';
import '../../../../../public/css/imag360.css';
import '../../../../../public/css/voucher.css';

const roomImage3DService = {
  async getRoom3DImageByRoomId(roomId) {
    console.log("Fetching images for room ID:", roomId);
    try {
      const response = await fetch(
        `https://trekbookingapi.azurewebsites.net/getRoom3DImagebyRoomId/${roomId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`, // Retrieve token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch room image list");
      }
      const data = await response.json();
      console.log("Fetched data:", data); // Trigger refetch after fetching
      return data;
    } catch (error) {
      console.error("Error fetching room image list:", error);
      throw error;
    }
  },
};



const List3DRoom = ({ params }) => {
  const [listImageUrl, setListImageUrl] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const roomId = params.roomId; // Lấy roomId từ params
  const viewerRef = useRef(null);
  const panoramaRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await roomImage3DService.getRoom3DImageByRoomId(roomId);
        if (Array.isArray(data)) {
          const urls = data.map(item => item.roomImage3DURL);
          setListImageUrl(urls);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();

    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/105/three.min.js';
    script1.async = true;
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = '/Components/panolens.min.js';
      script2.async = true;
      script2.onload = () => {
        console.log("Panolens script loaded");
        setScriptsLoaded(true);
      };
      document.body.appendChild(script2);
    };
    document.body.appendChild(script1);

    return () => {
      document.body.removeChild(script1);
      // Optional: Remove script2 if it was added
      const script2 = document.querySelector('script[src="/Components/panolens.min.js"]');
      if (script2) {
        document.body.removeChild(script2);
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (scriptsLoaded && listImageUrl.length > 0) {
      const delay = 500; // Adjust the delay as necessary
      setTimeout(() => {
        console.log("Initializing Panolens viewer with images:", listImageUrl);
        const imageUrl = listImageUrl[currentImageIndex];
        console.log("ImageURL: ", imageUrl);

        if (typeof imageUrl === 'string') {
          // Remove and dispose the previous panorama if it exists
          if (panoramaRef.current) {
            viewerRef.current.remove(panoramaRef.current);
            panoramaRef.current.dispose();
            panoramaRef.current = null;
          }

          const panorama = new PANOLENS.ImagePanorama(imageUrl);
          panoramaRef.current = panorama;

          const imageContainer = document.querySelector('.image360-container');
          if (!imageContainer) {
            console.error("Image container not found");
            return;
          }

          if (!viewerRef.current) {
            const viewer = new PANOLENS.Viewer({
              container: imageContainer,
              autoRotate: true,
              autoRotateSpeed: 0.3,
              controlBar: true,
            });
            viewerRef.current = viewer;
          }

          // Only add panorama to viewer if both are valid
          if (viewerRef.current && panoramaRef.current) {
            viewerRef.current.add(panoramaRef.current);
          } else {
            console.error("Failed to initialize viewer or panorama");
          }
        } else {
          console.error("Current image URL is not a string:", imageUrl);
        }
      }, delay);
    } else {
      console.log("Scripts not loaded or no images found");
    }
  }, [scriptsLoaded, listImageUrl, currentImageIndex]);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % listImageUrl.length);
  };

  const handleBack = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + listImageUrl.length) % listImageUrl.length);
  };

  return (
    <>
      <div className="virtual flex justify-center">
        <div className="border-virtual">
          <div className="virtual-tour flex justify-center items-center">
            <img className='img-line' src="/image/line40.png" alt="" />
            <h5 className='px-3 color-primary font-semibold fz-16'>Virtual Room</h5>
            <img className='img-line' src="/image/line40.png" alt="" />
          </div>
          <p className='color-primary text-center pb-3  fz-12'>Explore 3D Hotel Rooms: Experience Immersive Virtual Reality</p>
        </div>
      </div>
      <div className="tour">
        <div className="container">
          <div className="tour__head"></div>
          <p>Welcome to our immersive 3D hotel room tour Step into a virtual experience where you can explore every corner of our elegantly designed rooms. Our 3D tour provides a detailed and realistic view of our accommodations, allowing you to feel as if you are physically present.</p>
          <p>The luxurious bedding to the modern amenities, you can examine each feature up close. Navigate through the room effortlessly and discover the comfort and sophistication that awaits you. Whether you are planning a stay or simply curious, our 3D hotel room tour offers an unparalleled glimpse into your next travel experience.</p>
          <div className='relative'>
            <div className="image360-container"></div>
            {listImageUrl.length > 0 && (
              <div className="action-image flex justify-between">
                <img onClick={handleBack} className='cursor-pointer wh-fix' src="/image/left360.png" alt="" />
                {/* <div className="img-control flex">
                  <img className='mx-1 cursor-pointer wh-fix' src="/image/plus.png" alt="" />
                  <img className='mx-1 cursor-pointer wh-fix' src="/image/minus.png" alt="" />
                  <img className='mx-1 cursor-pointer wh-fix' src="/image/up.png" alt="" />
                  <img className='mx-1 cursor-pointer wh-fix' src="/image/down1.png" alt="" />
                </div> */}
                <img onClick={handleNext} className='cursor-pointer wh-fix' src="/image/right360.png" alt="" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='pb-28 backgr-home max-[500px]:pb-14'></div>
    </>
  );
};

export default List3DRoom;
