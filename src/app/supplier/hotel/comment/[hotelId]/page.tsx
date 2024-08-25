/* eslint-disable @next/next/no-img-element */
'use client'
import commentService from "@/app/services/commentService";
import hotelService from "@/app/services/hotelService";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import "../../../../../../public/css/comment.css";

const ListCommentOfHotel = ({ params }: { params: { hotelId: string } }) => {
  const [hotel, setHotel] = useState<IHotel | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5);
  const { data: listComment, error } = useSWR("listComment", () =>
    commentService.getCommentsByHotelId(Number(params.hotelId))
  );
  
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const hotelData = await hotelService.getHotelById(
          Number(params.hotelId)
        );
        setHotel(hotelData);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };

    fetchHotel();
  }, [params.hotelId]);
  const totalPages = listComment ? Math.ceil(listComment.length / roomsPerPage) : 0;
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentComments = listComment ? listComment.slice(indexOfFirstRoom, indexOfLastRoom) : [];
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
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
  if (!listComment) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading comments</div>;
  }

  return (
    <div className="relative">
      <div className="search-add ">
      {hotel && (
          <div className="fix-name">
            <Link
              href="/supplier/hotel"
              style={{ color: "black", fontSize: "18px" }}
            >
              Hotel
            </Link>
            <span
              style={{
                color: "black",
                fontSize: "18px",
                marginLeft: "5px",
                marginRight: "5px",
              }}
            >
              {" > "}
            </span>
            <Link
              href={`/supplier/hotel/room/${params.hotelId}`}
              style={{ color: "#4c7cab", fontSize: "18px" }}
            >
              {hotel.hotelName}
            </Link>
          </div>
        )}
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
                        CommentId
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        BookingId
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Hotel Name
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        User Name
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Message
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Date Submitted
                      </th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {currentComments.length > 0 ? (
                      currentComments.map((item: IComment, index) => {
                        // Parse the tourTime to a Date object if it's a string
                        const commentTimeDate = new Date(item.dateSubmitted);
                        const formattedCommentTime =
                          commentTimeDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });

                        const truncatedMessage =
                          item.message.length > 20
                            ? `${item.message.slice(0, 20)}...`
                            : item.message;

                        return (
                          <tr
                            key={index}
                            className="border-b border-neutral-200 dark:border-white/10 text-center"
                          >
                            <td className="whitespace-nowrap px-6 py-4 font-semibold">
                              {item.commentId}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold">
                              {item.bookingId}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold">
                              {item.hotel?.hotelName}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold">
                              {item.user?.email}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold">
                              {truncatedMessage}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold">
                              {formattedCommentTime}
                            </td>
                            
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={9}
                          className="text-center py-4 text-red-600 font-bold"
                        >
                          No comments found
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
    </div>
  );
};

export default ListCommentOfHotel;
