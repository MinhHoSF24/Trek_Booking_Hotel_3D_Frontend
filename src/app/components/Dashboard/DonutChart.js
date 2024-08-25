import orderHotelDetailService from "@/app/services/orderHotelDetailService";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";

const DonutChart = ({ setDonutChart }) => {
  const chartRef = useRef(null);
  const [timeRange, setTimeRange] = useState("week");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setHasData(true);
      setDateError("");
      setLoading(true);
      try {
        let data;
        if (timeRange === "week") {
          data = await orderHotelDetailService.getTop5RoomInWeek();
        } else if (timeRange === "total") {
          data = await orderHotelDetailService.getTop5RoomOrders();
        } else if (startDate && endDate) {
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

          data =
            await orderHotelDetailService.getMostFrequentlyRoomBySupplierIdAndDateRange(
              startDate,
              endDate
            );
        }

        const formattedData = [
          [
            `Most Frequently Ordered Rooms (${startDate} to ${endDate})`,
            "Order Count",
          ],
          ...data.map((item) => [
            `${item.roomName || item.name} | ${item.hotelName}`,
            item.orderCount,
          ]),
        ];
        setChartData(formattedData);
        setDonutChart(formattedData);
        setHasData(data.length > 0);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    if (timeRange === "custom" && (!startDate || !endDate)) {
      setHasData(false);
      setChartData([]);
      setLoading(false);
    } else {
      fetchData();
    }
  }, [timeRange, startDate, endDate, setDonutChart]);

  useEffect(() => {
    if (timeRange !== "custom") {
      setStartDate("");
      setEndDate("");
    }
  }, [timeRange]);

  useEffect(() => {
    const loadGoogleCharts = () => {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.onload = () => {
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(drawChart);
      };
      document.body.appendChild(script);
    };
const drawChart = () => {
      if (chartRef.current) {
        if (dateError) {
          chartRef.current.innerHTML = `<div style='text-align: center; font-size: 20px; padding-top: 50px; color: red'>${dateError}</div>`;
        } else if (hasData && chartData.length > 1) {
          const data = google.visualization.arrayToDataTable(chartData);
          const title =
            timeRange === "custom"
              ? `Most Frequently Ordered Rooms (${startDate} to ${endDate})`
              : `Most Frequently Ordered Rooms (${timeRange})`;
          const options = {
            title: title,
            pieHole: 0.4,
          };
          const chart = new google.visualization.PieChart(chartRef.current);
          chart.draw(data, options);
        } else {
          chartRef.current.innerHTML =
            "<div style='text-align: center; font-size: 20px; padding-top: 50px;'>No data</div>";
        }
      }
    };

    if (!window.google) {
      loadGoogleCharts();
    } else {
      google.charts.setOnLoadCallback(drawChart);
    }
  }, [chartData, loading, timeRange, hasData, dateError, startDate, endDate]);

  const exportToExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet(chartData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Most Frequently Ordered Rooms");
    XLSX.writeFile(wb, "MostFrequentlyOrderedRooms.xlsx");
  };

  const handleDateChange = (e, setter) => {
    const date = e.target.value;
    setter(date);
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <select
          style={{ margin: "20px 0px 5px 0px" }}
          onChange={(e) => setTimeRange(e.target.value)}
          value={timeRange}
        >
          <option value="week">Week</option>
          {/* <option value="total">Total</option> */}
          <option value="custom">Custom Made</option>
        </select>
        {timeRange === "custom" && (
          <div
            style={{ display: "flex", marginTop: "20px", marginBottom: "5px" }}
          >
            <div style={{ marginLeft: "20px", background: "white" }}>
              <label>
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateChange(e, setStartDate)}
                />
              </label>
            </div>
            <div style={{ marginLeft: "20px", background: "white" }}>
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
        <button
          onClick={exportToExcel}
          style={{
            marginLeft: "20px",
            marginBottom: "5px",
            marginTop: "20px",
            color: "white",
            fontWeight: "bold",
            background: "green",
borderRadius: "5px",
            paddingRight: "5px",
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
          id="donutchart"
          style={{
            width: "100%",
            height: chartData.length > 1 ? "300px" : "100px",
          }}
        ></div>
      )}
    </div>
  );
};

export default DonutChart;