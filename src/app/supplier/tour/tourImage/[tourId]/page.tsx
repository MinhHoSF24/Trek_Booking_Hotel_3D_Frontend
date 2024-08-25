"use client";
import React, { useEffect, useState } from "react";
import tourService from "@/app/services/tourService";
import CreateTourImage from "@/app/components/TourImages/CreateTourImage";
import tourImageService from "@/app/services/tourImageService";
import { ref, deleteObject } from "firebase/storage";
import { analytics } from "../../../../../../public/firebase/firebase-config";
import "../../../../../../public/css/tour.css";
import { toast } from "react-toastify";
import { ITour } from "@/app/entities/tour";
import Link from "next/link";

const ListTourImage = ({ params }: { params: { tourId: string } }) => {
  const [showTourImageCreate, setShowTourImageCreate] =
    useState<boolean>(false);
  const [selectedImageTour, setSelectedImageTour] = useState<ITourImage | null>(
    null
  );
  const [listTourImage, setTourImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tourId, setTourId] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tourImagePerPage] = useState(3);
  const [tour, setTour] = useState<ITour | null>(null);
  const handleImageClick = (imageTour: ITourImage) => {
    setSelectedImageTour(imageTour);
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedImageTour(null);
  };

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const tourData = await tourService.getTourById(Number(params.tourId));
        setTour(tourData);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };

    fetchTour();
  }, [params.tourId]);

  const handleCreateTourImage = async () => {
    setShowTourImageCreate(false);
    if (params.tourId) {
      tourService
        .getTourImageByTourId(Number(params.tourId))
        .then((data: any) => {
          setTourImage(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching tour images:", error);
          setError(error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (params.tourId) {
      tourService
        .getTourImageByTourId(Number(params.tourId))
        .then((data: any) => {
          setTourImage(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching tour images:", error);
          setError(error);
          setLoading(false);
        });
    }
  }, [params.tourId]);

  const deleteImageButtonHandler = (tourImageId: number, imageUrl: string) => {
    handleDeleteTourImage(tourImageId, imageUrl);
    setShowPopup(false);
  };

  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      const storageRef = ref(analytics, imageUrl);
      await deleteObject(storageRef);
      //    console.log("Image deleted successfully from Firebase Storage");
    } catch (error) {
      console.error("Error deleting image from Firebase Storage:", error);
    }
  };

  const handleDeleteTourImage = async (
    tourImageId: number,
    imageUrl: string
  ) => {
    try {
      //   console.log("Deleting tour image with ID:", tourImageId);
      await deleteImageFromStorage(imageUrl);
      await tourImageService.deleteTourImage(tourImageId);
      //  console.log("Tour image deleted successfully");

      if (params.tourId) {
        tourService
          .getTourImageByTourId(Number(params.tourId))
          .then((data: any) => {
            setTourImage(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching tour images:", error);
            setError(error);
            setLoading(false);
          });
      }

      toast.success("Delete Image Successful");
    } catch (error) {
      console.error("Error deleting tour image:", error);
      alert("Failed to delete tour image");
    }
  };

  const handleAddImage = () => {
    if (listTourImage.length >= 5) {
      toast.error("You can only add up to 5 images for this tour.");
      return;
    }
    setTourId(Number(params.tourId));
    setShowTourImageCreate(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tour images</div>;
  }
  const indexOfLastTourImage = currentPage * tourImagePerPage;
  const indexOfFirstTourImage = indexOfLastTourImage - tourImagePerPage;
  const currentTourImage = listTourImage.slice(
    indexOfFirstTourImage,
    indexOfLastTourImage
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(listTourImage.length / tourImagePerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <div className="relative">
      <div className="search-add">
     
        <div className="search-hotel flex">
        {tour && (
          <div className="fix-name max-[1522px]:hidden">
            <Link
              href="/supplier/tour"
              style={{ color: "black", fontSize: "14px" }}
            >
              Tour
            </Link>
            <span
              style={{
                color: "black",
                fontSize: "14px",
                marginLeft: "5px",
                marginRight: "5px",
              }}
            >
              {" > "}
            </span>
            <Link
              href={`/supplier/tour/tourImage/${params.tourId}`}
              style={{ color: "#4c7cab", fontSize: "14px" }}
            >
              {tour.tourName}
            </Link>
          </div>
        )}
          <input
            type="text"
            placeholder="Search........."
            className="input-hotel pl-3"
          />
          <img src="/image/search.png" alt="" />
        </div>
        <button className="ml-8 button-add ml-4rem" onClick={handleAddImage}>
          + Add Image Tour
        </button>
      </div>
      <div className="table-hotel pt-8">
        <div className="flex flex-col overflow-x-auto">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-start text-sm font-light text-surface dark:text-white border-solid">
                  <thead className="border-b border-neutral-200 font-medium dark:border-white/10 bk-top-table">
                    <tr className="text-center">
                      <th scope="col" className="px-6 py-4">
                        TourImageId
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        TourImageURL
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTourImage.length > 0 ? (
                      currentTourImage.map((item: ITourImage, index) => (
                        <tr
                          key={index}
                          className="border-b border-neutral-200 dark:border-white/10 text-center"
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {item.tourImageId}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold flex justify-center">
                            <img
                              className="w-[150px] h-[65px]"
                              src={
                                item.tourImageURL
                                  ? item.tourImageURL
                                  : "/image/imagedefault.png"
                              }
                              alt=""
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = "/image/imagedefault.png";
                              }}
                            />
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 ">
                            <div className="flex justify-center">
                              {/* <img
                                className="w-5 h-5 cursor-pointer ml-3"
                                src="/image/bag.png"
                                alt="Delete"
                                onClick={() =>
                                  deleteImageButtonHandler(item.tourImageId, item.tourImageURL)
                                }
                              /> */}
                              <img
                                className="w-7 h-7 cursor-pointer ml-3"
                                src="/image/bag.png"
                                alt="Delete"
                                onClick={() => handleImageClick(item)}
                              />

                              {showPopup &&
                                selectedImageTour?.tourImageId ===
                                  item.tourImageId && (
                                  <div className="fixed inset-0 z-10 flex items-center justify-center ">
                                    {/* Nền mờ */}
                                    <div
                                      className="fixed inset-0 bg-black opacity-5"
                                      onClick={handleClosePopup}
                                    ></div>

                                    {/* Nội dung của popup */}
                                    <div className="relative bg-white p-8 rounded-lg">
                                      <p className="color-black font-bold text-2xl">
                                        Do you want to delete Tour Image 3D Id:{" "}
                                        {item.tourImageId} ?
                                      </p>
                                      <div className="button-kichhoat pt-4">
                                        <button
                                          className="button-exit mr-2"
                                          onClick={handleClosePopup}
                                        >
                                          Exit
                                        </button>
                                        <button
                                          className="button-yes cursor-pointer"
                                          onClick={() =>
                                            deleteImageButtonHandler(
                                              item.tourImageId,
                                              item.tourImageURL
                                            )
                                          }
                                        >
                                          Yes
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-4 text-red-600 font-bold"
                        >
                          No TourImage found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="pagination mt-4 flex justify-between items-center font-semibold">
                  <div>
                    <span className="ml-8">
                      {currentPage} of {totalPages}
                    </span>
                  </div>
                  <div className="flex items-center mr-8">
                    <img
                      className="w-3 h-3 cursor-pointer"
                      src="/image/left.png"
                      alt="Previous"
                      onClick={handlePrevPage}
                    />
                    {Array.from({ length: totalPages }, (_, index) => (
                      <p
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`mb-0 mx-2 cursor-pointer ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                      >
                        {index + 1}
                      </p>
                    ))}
                    <img
                      className="w-3 h-3 cursor-pointer"
                      src="/image/right2.png"
                      alt="Next"
                      onClick={handleNextPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateTourImage
        showTourImageCreate={showTourImageCreate}
        setShowTourImageCreate={setShowTourImageCreate}
        onCreate={handleCreateTourImage}
        tourId={tourId}
        listTourImage={listTourImage.length}
      />
    </div>
  );
};

export default ListTourImage;
