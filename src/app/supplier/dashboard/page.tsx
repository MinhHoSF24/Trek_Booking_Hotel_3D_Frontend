"use client";
import React, { useEffect, useState } from "react";
import "../../../../public/css/dashboard.css";
import PieChartGG from "../../components/Dashboard/PieChartGG";
import DonutChart from "../../components/Dashboard/DonutChart";
import LineChartGG from "../../components/Dashboard/LineChartGG";
import BarChart from "../../components/Dashboard/BarChart";
import LineChartGGTour from "../../components/Dashboard/LineChartGGTour";
import orderHotelHeaderService from "@/app/services/orderHotelHeaderService";
import orderTourHeaderService from "@/app/services/orderTourHeaderService";
import * as XLSX from "xlsx";
const DashBoard = () => {
  const [count, setCount] = useState<number | null>(null);
  const [countTour, setCountTour] = useState<number | null>(null);
  const [percent, setPercent] = useState<number | null>(null);
  const [percentTour, setPercentTour] = useState<number | null>(null);
  const [totalRevenueHotel, setTotalRevenueHotel] = useState<number | null>(
    null
  );
  const [totalRevenueTour, setTotalRevenueTour] = useState<number | null>(null);
  const [percentRevenueHotel, setPercentRevenueHotel] = useState<number | null>(
    null
  );
  const [percentRevenueTour, setPercentRevenueTour] = useState<number | null>(
    null
  );
  const [lineChartData, setLineChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [donutChartData, setDonutChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data =
          await orderHotelHeaderService.countTotalOrderHotelBySupplierId();
        setCount(data);
      } catch (error) {
        console.error("Failed to fetch total order count", error);
      }
    };

    const fetchPercentChange = async () => {
      try {
        const percentChange =
          await orderHotelHeaderService.getPercentChangeFromLastWeek();
        setPercent(percentChange);
      } catch (error) {
        console.error("Failed to fetch percent change", error);
      }
    };

    const fetchTotalRevenueHotel = async () => {
      try {
        const totalRevenueHotel =
          await orderHotelHeaderService.getTotalRevenueHotelBySupplierId();
        setTotalRevenueHotel(totalRevenueHotel);
      } catch (error) {
        console.error("Failed to fetch total revenue hotel", error);
      }
    };

    const fetchPercentRevenueHotel = async () => {
      try {
        const percentRevenueHotel =
          await orderHotelHeaderService.getPercentChangeRevenueFromLastWeek();
        setPercentRevenueHotel(percentRevenueHotel);
      } catch (error) {
        console.error("Failed to fetch percent revenue hotel", error);
      }
    };

    const fetchCountTour = async () => {
      try {
        const count =
          await orderTourHeaderService.countTotalOrderTourBySupplierId();
        setCountTour(count);
      } catch (error) {
console.error("Failed to fetch total tour count", error);
      }
    };

    const fetchPercentTourChange = async () => {
      try {
        const percentTourChange =
          await orderTourHeaderService.getPercentChangeTourFromLastWeek();
        setPercentTour(percentTourChange);
      } catch (error) {
        console.error("Failed to fetch percent tour change", error);
      }
    };

    const fetchTotalRevenueTour = async () => {
      try {
        const totalRevenueTour =
          await orderTourHeaderService.getTotalRevenueTourBySupplierId();
        setTotalRevenueTour(totalRevenueTour);
      } catch (error) {
        console.error("Failed to fetch total revenue tour", error);
      }
    };

    const fetchPercentRevenueTour = async () => {
      try {
        const percentRevenueTour =
          await orderTourHeaderService.getPercentChangeRevenueTourFromLastWeek();
        setPercentRevenueTour(percentRevenueTour);
      } catch (error) {
        console.error("Failed to fetch percent revenue tour", error);
      }
    };

    fetchCount();
    fetchPercentChange();
    fetchTotalRevenueHotel();
    fetchPercentRevenueHotel();
    fetchCountTour();
    fetchPercentTourChange();
    fetchTotalRevenueTour();
    fetchPercentRevenueTour();
  }, []);

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const data = [
      ["Total Hotel Orders", count],
      ["Hotel Order Percent Change", percent],
      ["Total Hotel Revenue", totalRevenueHotel],
      ["Hotel Revenue Percent Change", percentRevenueHotel],
      ["Total Tour Orders", countTour],
      ["Tour Order Percent Change", percentTour],
      ["Total Tour Revenue", totalRevenueTour],
      ["Tour Revenue Percent Change", percentRevenueTour],
    ];
    if (data.length > 0) {
      const datax = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, datax, "Total Data");
    }

    if (barChartData.length > 0) {
      const barChartWS = XLSX.utils.aoa_to_sheet(barChartData);
      XLSX.utils.book_append_sheet(workbook, barChartWS, "Revenue Data");
    }

    if (lineChartData.length > 0) {
      const lineChartWS = XLSX.utils.aoa_to_sheet(lineChartData);
      XLSX.utils.book_append_sheet(
        workbook,
        lineChartWS,
        "Annual Revenue Data"
      );
    }

    if (pieChartData.length > 0) {
      const pieChartWS = XLSX.utils.aoa_to_sheet(pieChartData);
      XLSX.utils.book_append_sheet(workbook, pieChartWS, "Tour Data");
    }

    if (donutChartData.length > 0) {
      const donutChartWS = XLSX.utils.aoa_to_sheet(donutChartData);
      XLSX.utils.book_append_sheet(workbook, donutChartWS, "Room Data");
    }

    XLSX.writeFile(workbook, "dashboard_charts_data.xlsx");
  };

  return (
    <>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <div className="relative">
<div className="table-hotel1 max-[768px]:w-100 pt-8">
          <button
            onClick={exportToExcel}
            style={{
              marginBottom: "10px",
              color: "white",
              fontWeight: "bold",
              background: "green",
              borderRadius: "5px",
              paddingRight: "3px",
            }}
          >
            <i
              className="fa fa-file-excel-o"
              style={{ marginRight: "5px", marginLeft: "3px" }}
            ></i>
            Export All to Excel
          </button>
          <div className="row pb-4">
            <div className="col-lg-3 col-6 max-[992px]:mb-4">
              <div className="card radius-10 border-start border-0 border-3 border-info">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div>
                      <p className="mb-0 text-secondary">Total Hotel Orders</p>
                      <h4 className="my-1 text-info">
                        {count !== null ? count : "No order yet..."}
                      </h4>
                      {percent !== null ? (
                        <p className="mb-0 font-13">
                          {percent === Number.MAX_VALUE
                            ? "+∞% from last week"
                            : `${percent > 0 ? "+" : ""}${
                                Number.isInteger(percent)
                                  ? percent
                                  : percent.toFixed(1).replace(".", ",")
                              }% from last week`}
                        </p>
                      ) : (
                        <p className="mb-0 font-13">Loading...</p>
                      )}
                    </div>
                    <div className="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto">
                      <i className="fa fa-shopping-cart"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="card radius-10 border-start border-0 border-3 border-danger">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div>
                      <p className="mb-0 text-secondary">Total Hotel Revenue</p>
                      <h4 className="my-1 text-danger">
                        $
                        {totalRevenueHotel !== null
                          ? totalRevenueHotel.toLocaleString()
                          : "No revenue yet..."}
                      </h4>

                      {percentRevenueHotel !== null ? (
                        <p className="mb-0 font-13">
                          {percentRevenueHotel === 999999999
                            ? "+∞% from last week"
                            : `${percentRevenueHotel > 0 ? "+" : ""}${
                                Number.isInteger(percentRevenueHotel)
                                  ? percentRevenueHotel
                                  : percentRevenueHotel
                                      .toFixed(1)
                                      .replace(".", ",")
                              }% from last week`}
                        </p>
                      ) : (
                        <p className="mb-0 font-13">Loading...</p>
                      )}
                    </div>
                    <div className="widgets-icons-2 rounded-circle bg-gradient-bloody text-white ms-auto">
                      <i className="fa fa-dollar"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="card radius-10 border-start border-0 border-3 border-success">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div>
                      <p className="mb-0 text-secondary">Total Tour Orders</p>
                      <h4 className="my-1 text-success">
                        {countTour !== null ? countTour : "No order yet..."}
                      </h4>

                      {percentTour !== null ? (
                        <p className="mb-0 font-13">
                          {percentTour === Number.MAX_VALUE
                            ? "+∞% from last week"
                            : `${percentTour > 0 ? "+" : ""}${
                                Number.isInteger(percentTour)
                                  ? percentTour
                                  : percentTour.toFixed(1).replace(".", ",")
                              }% from last week`}
                        </p>
                      ) : (
                        <p className="mb-0 font-13">Loading...</p>
                      )}
                    </div>
                    <div className="widgets-icons-2 rounded-circle bg-gradient-ohhappiness text-white ms-auto">
                      <i className="fa fa-shopping-cart"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="card radius-10 border-start border-0 border-3 border-warning">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div>
                      <p className="mb-0 text-secondary">Total Tour Revenue</p>
                      <h4 className="my-1 text-warning">
                        $
                        {totalRevenueTour !== null
                          ? totalRevenueTour.toLocaleString()
                          : "No revenue yet..."}
                      </h4>
                      {percentRevenueTour !== null ? (
                        <p className="mb-0 font-13">
                          {percentRevenueTour === 999999999
                            ? "+∞% from last week"
                            : `${percentRevenueTour > 0 ? "+" : ""}${
                                Number.isInteger(percentRevenueTour)
                                  ? percentRevenueTour
                                  : percentRevenueTour
                                      .toFixed(1)
                                      .replace(".", ",")
                              }% from last week`}
                        </p>
                      ) : (
                        <p className="mb-0 font-13">Loading...</p>
                      )}
</div>
                    <div className="widgets-icons-2 rounded-circle bg-gradient-blooker text-white ms-auto">
                      <i className="fa fa-dollar"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <BarChart setBarChartData={setBarChartData} />
          </div>
          <div>
            <DonutChart setDonutChart={setDonutChartData} />
          </div>
          <div>
            <PieChartGG setPieChartData={setPieChartData} />
          </div>
          {/* <div>
            <LineChartGG setLineChartData={setLineChartData} />
          </div> */}

          {/* <div>
            <LineChartGGTour />
          </div> */}
          {/* <div className="row  pb-4 ml-1 max-[768px]:ml-0">
            <div className="col-lg-6 col-md-6 col-12 max-[768px]:mb-4">
              <LineChartGG />
            </div>
            <div className=" col-lg-5 col-md-6 col-12 ml-4 max-[768px]:ml-0  ">
              <DonutChart />
            </div>
          </div> */}
          {/* <div className="row  ml-1 max-[768px]:ml-0">
            <div className=" col-lg-6 col-md-6  col-12 max-[768px]:mb-4">
              <LineChartGGTour />
            </div>
            <div className="col-lg-5 col-md-6 col-12  ml-4 max-[768px]:ml-0 ">
              <PieChartGG />
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default DashBoard;