import React, { useEffect, useRef, useState, useMemo } from "react";
import orderHotelHeaderService from "@/app/services/orderHotelHeaderService";
import orderTourHeaderService from "@/app/services/orderTourHeaderService";
import * as XLSX from "xlsx";

const BarChart = ({ setBarChartData }) => {
  const chartRef = useRef(null);
  const [timeRange, setTimeRange] = useState("week");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [year, setYear] = useState("");
  const [quarterYear, setQuarterYear] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(true);
  const [dateError, setDateError] = useState("");
  const [googleChartsLoaded, setGoogleChartsLoaded] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setHasData(true);
    setDateError("");
    try {
      let dataHotel = [],
        dataTour = [];

      if (timeRange === "week") {
        dataHotel =
          await orderHotelHeaderService.getCurrentWeekRevenueHotelBySupplierId();
        dataTour =
          await orderTourHeaderService.getCurrentWeekRevenueTourBySupplierId();
      } else if (timeRange === "month") {
        dataHotel =
          await orderHotelHeaderService.getCurrentMonthOfYearRevenueHotelBySupplierId();
        dataTour =
          await orderTourHeaderService.getCurrentMonthOfYearRevenueTourBySupplierId();
      } else if (timeRange === "quarter" && quarterYear) {
        dataHotel =
          await orderHotelHeaderService.getRevenueQuarterOfYearHotelBySupplierId(
            quarterYear
          );
        dataTour =
          await orderTourHeaderService.getRevenueQuarterOfYearTourBySupplierId(
            quarterYear
          );
      } else if (timeRange === "custom" && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
          setDateError("Start date cannot be greater than end date");
          setLoading(false);
          return;
        }

        const differenceInDays = (end - start) / (1000 * 3600 * 24);
        if (differenceInDays > 31) {
          setDateError("Date range cannot be more than 31 days");
          setLoading(false);
          return;
        }

        dataHotel =
          await orderHotelHeaderService.getRevenueHotelBySupplierIdAndDateRange(
            startDate,
            endDate
          );
        dataTour =
          await orderTourHeaderService.getRevenueTourBySupplierIdAndDateRange(
            startDate,
            endDate
          );
      } else if (timeRange === "year" && year) {
        dataHotel =
          await orderHotelHeaderService.getRevenueHotelMonthToYearBySupplierId(
            year
          );
        dataTour =
          await orderTourHeaderService.getRevenueTourMonthToYearBySupplierId(
            year
          );
      }
const formattedData = formatData(dataHotel, dataTour);
      setChartData(formattedData);
      setBarChartData(formattedData);
    } catch (error) {
      console.error("Failed to fetch revenue data", error);
      setHasData(false);
      setChartData([]);
      setBarChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatData = useMemo(
    () => (hotelData, tourData) => {
      let formattedData = [];

      if (timeRange === "week") {
        formattedData = [["Day of Week", "Hotel", "Tour"]];
        hotelData.forEach((item, index) => {
          const date = new Date(item.weekStartDate);
          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
          formattedData.push([
            formattedDate,
            item.revenue,
            tourData[index]?.revenue || 0,
          ]);
        });
      } else if (timeRange === "month") {
        formattedData = [["Month of Year", "Hotel", "Tour"]];
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        hotelData.forEach((item, index) => {
          formattedData.push([
            monthNames[index],
            item.revenue,
            tourData[index]?.revenue || 0,
          ]);
        });
      } else if (timeRange === "quarter") {
        formattedData = [
          ["Revenue quarter of Year " + `${quarterYear}`, "Hotel", "Tour"],
        ];
        hotelData.forEach((item, index) => {
          formattedData.push([
            `Q${index + 1}`,
            item.revenue,
            tourData[index]?.revenue || 0,
          ]);
        });
      }
      else if (startDate && endDate) {
        const dataMap = new Map();

        // Thêm dữ liệu khách sạn vào dataMap
        if (hotelData.length > 0) {
          hotelData.forEach((item) => {
            const date = new Date(item.dateRange);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
            dataMap.set(formattedDate, { hotel: item.revenue, tour: 0 });
          });
        }

        // Thêm dữ liệu tour vào dataMap
        if (tourData.length > 0) {
          tourData.forEach((item) => {
            const date = new Date(item.dateRange);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
            if (dataMap.has(formattedDate)) {
              dataMap.get(formattedDate).tour = item.revenue;
            } else {
              dataMap.set(formattedDate, { hotel: 0, tour: item.revenue });
            }
          });
        }

        // Chuyển đổi dataMap thành mảng và sắp xếp theo ngày
        formattedData = [
          [`Revenue from ${startDate} to ${endDate}`, "Hotel", "Tour"],
        ];

        // Sắp xếp các ngày
        const sortedDates = Array.from(dataMap.keys()).sort(
          (a, b) => new Date(a) - new Date(b)
        );

        // Thêm dữ liệu đã sắp xếp vào formattedData
        sortedDates.forEach((date) => {
          const value = dataMap.get(date);
          formattedData.push([date, value.hotel, value.tour]);
        });
      }
      else if (timeRange === "year") {
formattedData = [
          ["Revenue of the Months in the Year " + `${year}`, "Hotel", "Tour"],
        ];
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        hotelData.forEach((item, index) => {
          formattedData.push([
            monthNames[index],
            item.revenue,
            tourData[index]?.revenue || 0,
          ]);
        });
      }

      setHasData(
        formattedData.length > 1 &&
          formattedData.some((row) => row.slice(1).some((value) => value > 0))
      );
      return formattedData;
    },
    [timeRange, startDate, endDate, year, quarterYear]
  );

  useEffect(() => {
    fetchData();
  }, [timeRange, startDate, endDate, year, quarterYear]);

  useEffect(() => {
    if (timeRange !== "custom") {
      setStartDate("");
      setEndDate("");
    }
    if (timeRange !== "quarter") {
      setQuarterYear("");
    }
    if (timeRange !== "year") {
      setYear("");
    }
    setChartData([]);
    setHasData(false);
  }, [timeRange]);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.onload = () => {
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(() => setGoogleChartsLoaded(true));
      };
      document.body.appendChild(script);
    } else {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => setGoogleChartsLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (googleChartsLoaded) {
      drawChart();
    }
  }, [chartData, hasData, dateError, googleChartsLoaded]);

  const drawChart = () => {
    if (chartRef.current) {
      chartRef.current.innerHTML = "";

      if (dateError) {
        chartRef.current.innerHTML = `<div style='text-align: center; font-size: 20px; padding-top: 150px; color: red'>${dateError}</div>`;
      } else if (hasData && chartData.length > 1) {
        const dataTable = google.visualization.arrayToDataTable(chartData);
        const title =
          timeRange === "custom"
            ? "Revenue Hotel and Tour from " + `${startDate} to ${endDate}`
            : "Revenue Hotel and Tour by " + `${timeRange}`;
        const options = {
          title: title,
          hAxis: {
            title: "",
          },
          series: {
            0: { targetAxisIndex: 0 },
            1: { targetAxisIndex: 1 },
          },
          vAxes: {
            0: { title: "Revenue Hotel" },
            1: { title: "Revenue Tour" },
          },
        };
        const chart = new google.visualization.ColumnChart(chartRef.current);
        chart.draw(dataTable, options);
      } else {
chartRef.current.innerHTML =
          "<div style='text-align: center; font-size: 20px; padding-top: 150px;'>No data</div>";
      }
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet(chartData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Revenue Data");
    XLSX.writeFile(wb, "RevenueData.xlsx");
  };

  const handleDateChange = (e, setter) => {
    const date = e.target.value;
    setter(date);
  };

  const handleYearChange = (e, type) => {
    const selectedYear = e.target.value;
    if (type === "quarter") {
      setQuarterYear(selectedYear);
    } else if (type === "month") {
      setYear(selectedYear);
    }
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <select
          style={{ margin: "5px 0px 5px 0px" }}
          onChange={(e) => setTimeRange(e.target.value)}
          value={timeRange}
        >
          <option value="week">Week</option>
          <option value="year">Month</option>
          <option value="quarter">Quarter</option>
          <option value="custom">Custom Made</option>
        </select>
        {timeRange === "custom" && (
          <div style={{ display: "flex" }}>
            <div
              style={{
                marginLeft: "20px",
                background: "white",
                marginBottom: "5px",
              }}
            >
              <label>
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateChange(e, setStartDate)}
                />
              </label>
            </div>
            <div
              style={{
                marginLeft: "20px",
                background: "white",
                marginBottom: "5px",
              }}
            >
              <label>
                End Date:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateChange(e, setEndDate)}
                />
              </label>
            </div>
          </div>
        )}
        {timeRange === "year" && (
          <div style={{ marginLeft: "20px" }}>
            <select value={year} onChange={(e) => handleYearChange(e, "month")}>
              <option value="">Select Year</option>
              {Array.from({ length: 100 }, (_, i) => 2000 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}
        {timeRange === "quarter" && (
          <div style={{ marginLeft: "20px" }}>
            <select
              value={quarterYear}
              onChange={(e) => handleYearChange(e, "quarter")}
            >
              <option value="">Select Year</option>
              {Array.from({ length: 100 }, (_, i) => 2000 + i).map((year) => (
                <option key={year} value={year}>
{year}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          onClick={exportToExcel}
          style={{
            marginLeft: "20px",
            marginBottom: "5px",
            paddingRight: "3px",
            color: "white",
            fontWeight: "bold",
            background: "green",
            borderRadius: "5px",
          }}
        >
          <i
            className="fa fa-file-excel-o"
            style={{ marginRight: "5px", marginLeft: "3px" }}
          ></i>
          Excel
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          ref={chartRef}
          id="columnchart_material"
          style={{ width: "100%", height: "300px" }}
        />
      )}
    </div>
  );
};

export default BarChart;