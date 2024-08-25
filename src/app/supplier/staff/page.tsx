/* eslint-disable @next/next/no-img-element */
// my-new-page.js
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import supplierStaffService, {
  revalidateSupplierStaffs,
  toggleSupplierStaffStatus,
} from "@/app/services/supplierStaffService";
import CreateSupplierStaff from "@/app/components/Staff/CreateStaff";
import UpdateStaff from "@/app/components/Staff/UpdateStaff";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import "../../../../public/css/tour.css";

const SupplierStaffList = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStaff, setSelectedSupplierStaff] = useState<ISupplierStaff | null>(null);
  const [showStaffCreate, setShowStaffCreate] = useState<boolean>(false);
  const [showStaffUpdate, setShowStaffUpdate] = useState<boolean>(false);
  const [staffId, setStaffId] = useState(0);
  const [supplierStaff, setSupplierStaff] = useState<ISupplierStaff | null>(null);

  //const supplierId = localStorage.getItem("supplierId");

  const [currentPage, setCurrentPage] = useState(1);
  const [staffPerPage] = useState(5);
  // Sử dụng useSWR để lấy danh sách nhân viên với key phù hợp
  const {
    data: supplierStaffList,
    error,
    mutate: mutateSupplierStaffs,
  } = useSWR(
    "listStaff",
    () => supplierStaffService.getStaffsBySuppierId(),
    {
      revalidateOnFocus: false,
    }
  );

  const handleImageClick = (supplierStaff: ISupplierStaff) => {
    setSelectedSupplierStaff(supplierStaff);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedSupplierStaff(null);
  };

  const handleCreateStaff = async () => {
    setShowStaffCreate(false);
    mutateSupplierStaffs(); // Revalidate lại danh sách nhân viên sau khi tạo mới
  };

  const handleUpdateStaff = async () => {
    setShowStaffUpdate(false);
    mutateSupplierStaffs(); // Revalidate lại danh sách nhân viên sau khi cập nhật
  };

  const toggleSupplierStaff = async (staffId: number) => {
    try {
      await toggleSupplierStaffStatus(staffId);
      setShowPopup(false);
      mutateSupplierStaffs(); // Revalidate lại danh sách nhân viên sau khi thay đổi trạng thái
      toast.success("Success");
    } catch (error: any) {
      console.error(error.message);
      toast.error("Failed to toggle supplier staff status");
    }
  };

  if (!supplierStaffList) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading supplier staff</div>;
  }
  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaff = supplierStaffList.slice(indexOfFirstStaff, indexOfLastStaff);

  const paginate = (pageNumber:number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(supplierStaffList.length / staffPerPage);
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
          <input
            type="text"
            placeholder="Search........."
            className="input-hotel pl-3"
          />
          <img src="/image/search.png" alt="Search" />
        </div>
        <button
          className="ml-8 button-add relative z-10"
          onClick={() => setShowStaffCreate(true)}
        >+ Add staff
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
                      <th scope="col" className="px-6 py-4">StaffId</th>
                      <th scope="col" className="px-6 py-4 text-center">Staff Name</th>
                      <th scope="col" className="px-6 py-4">Phone</th>
                      <th scope="col" className="px-6 py-4">Email</th>
                      <th scope="col" className="px-6 py-4">Address</th>
                      <th scope="col" className="px-6 py-4">Status</th>
                      <th scope="col" className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStaff.length > 0 ? (
                      currentStaff.map((item: ISupplierStaff, index) => (
                        <tr
                          key={index}
                          className="border-b border-neutral-200 dark:border-white/10 text-center"
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-semibold text-black">
                            {item.staffId}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold text-black">
                            {item.staffName}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold text-black">
                            {item.staffPhoneNumber}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold text-black">
                            {item.staffEmail}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold text-black">
                            {item.staffAddress}
                          </td>
                          <td
                            className={`whitespace-nowrap px-6 py-4 ${
                              item.status ? "color-active" : "color-stop"
                            }`}
                          >
                            {item.status ? "Active" : "Stopped"}</td>
                          <td className="whitespace-nowrap px-6 py-4 flex justify-center">
                            <Link href="#">
                              <img
                                className="w-5 h-5 cursor-pointer"
                                src="/image/pen.png"
                                alt="Edit"
                                onClick={() => {
                                  setStaffId(item.staffId);
                                  setSupplierStaff(item);
                                  setShowStaffUpdate(true);
                                }}
                              />
                            </Link>
                            <img
                              className="w-5 h-5 cursor-pointer ml-3"
                              src={
                                item.status
                                  ? "/image/unlock.png"
                                  : "/image/lock.png"
                              }
                              alt={item.status ? "Ban" : "Unban"}
                              onClick={() => handleImageClick(item)}
                            />
                            {showPopup &&
                              selectedStaff?.staffId === item.staffId && (
                                <div className="fixed inset-0 z-10 flex items-center justify-center ">
                                  <div
                                    className="fixed inset-0 bg-black opacity-5"
                                    onClick={handleClosePopup}
                                  ></div>
                                  <div className="relative bg-white p-8 rounded-lg">
                                    <p className="color-black font-bold text-2xl">
                                      Do you want to{" "}
                                      {item.status ? "lock" : "unlock"} this{" "}
                                      {item.staffName}?
                                    </p>
                                    <div className="button-kichhoat pt-4">
                                      <button
                                        className="button-exit mr-2"
                                        onClick={handleClosePopup}
                                      >
                                        Exit
                                      </button>
                                      <button
                                        className="button-yes"
                                        onClick={() =>
                                          toggleSupplierStaff(item.staffId)
                                        }
                                      >
                                        Yes
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </td></tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center py-4 text-red-600 font-bold">
                          No staffs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="pagination mt-4 flex justify-between items-center font-semibold">
                  <div>
                    <span className="ml-8">{currentPage} of {totalPages}</span>
                  </div>
                  <div className="flex items-center mr-8">
                    <img className="w-3 h-3 cursor-pointer" src="/image/left.png" alt="Previous" onClick={handlePrevPage} />
                    {Array.from({ length: totalPages }, (_, index) => (
                      <p
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`mb-0 mx-2 cursor-pointer ${currentPage === index + 1 ? 'active' : ''}`}
                      >
                        {index + 1}
                      </p>
                    ))}
                    <img className="w-3 h-3 cursor-pointer" src="/image/right2.png" alt="Next" onClick={handleNextPage} />
                  </div>
                </div>
                <CreateSupplierStaff
                  showStaffCreate={showStaffCreate}
                  setShowStaffCreate={setShowStaffCreate}
                  onCreate={handleCreateStaff}
                />
                <UpdateStaff
                  showSupplierStaffUpdate={showStaffUpdate}
                  setShowStaffUpdate={setShowStaffUpdate}
                  onUpdate={handleUpdateStaff}
                  ThisstaffId={staffId}
                  supplierStaff={supplierStaff}
                  setSupplierStaff={setSupplierStaff}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierStaffList;