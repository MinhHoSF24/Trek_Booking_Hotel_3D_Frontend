import { useEffect, useRef, useState } from "react";
import orderHotelHeaderService from "@/app/services/orderHotelHeaderService";
import orderTourHeaderService from "@/app/services/orderTourHeaderService";
import * as XLSX from "xlsx";

const LineChartGG = ({ setLineChartData }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const hotelData =
          await orderHotelHeaderService.getRevenueYearBySupplierId();
        const tourData =
          await orderTourHeaderService.getRevenueTourBySupplierId();
        const combinedData = {};

        hotelData.forEach((item) => {
          combinedData[item.year] = { hotel: item.revenue, tour: 0 };
        });

        tourData.forEach((item) => {
          if (combinedData[item.year]) {
            combinedData[item.year].tour = item.revenue;
          } else {
            combinedData[item.year] = { hotel: 0, tour: item.revenue };
          }
        });

        const formattedData = [
          ["Year", "Hotel", "Tour"],
          ...Object.keys(combinedData).map((year) => [
            year.toString(),
            combinedData[year].hotel,
            combinedData[year].tour,
          ]),
        ];

        setChartData(formattedData);
        setLineChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch revenue data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [setLineChartData]);

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
      if (loading || chartData.length <= 1) return;

      const data = google.visualization.arrayToDataTable(chartData);

      const options = {
        title: "Annual Revenue",
        hAxis: {
          title: "Year",
        },
        vAxis: {
          title: "Revenue (USD)",
        },
        series: {
          0: { color: "red" },
          1: { color: "green" },
        },
      };

      const chart = new google.visualization.LineChart(chartRef.current);
      chart.draw(data, options);
    };

    if (!window.google) {
      loadGoogleCharts();
    } else {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChart);
    }
  }, [chartData, loading]);

  const exportToExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet(chartData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Annual Revenue");
XLSX.writeFile(wb, "AnnualRevenueOfHotelAndTour.xlsx");
  };

  return (
    <div>
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
      {loading ? (
        <p>Loading...</p>
      ) : chartData.length <= 1 ? (
        <div
          style={{
            width: "100%",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>No data</p>
        </div>
      ) : (
        <div
          ref={chartRef}
          id="chart_div"
          style={{
            width: "100%",
            height: "300px",
          }}
        ></div>
      )}
    </div>
  );
};

export default LineChartGG;