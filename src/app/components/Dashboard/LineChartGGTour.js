import { useEffect, useRef, useState } from "react";
import orderTourHeaderService from "@/app/services/orderTourHeaderService";

const LineChartGGTour = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const data = await orderTourHeaderService.getRevenueTourBySupplierId();
        const formattedData = [
          ["Year", "Revenue"],
          ...data.map((item) => [item.year.toString(), item.revenue]),
        ];
 
        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch revenue data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  useEffect(() => {
    const loadGoogleCharts = () => {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.onload = () => {
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(drawChart);
      };
      script.onerror = () => {
        console.error("Failed to load Google Charts");
      };
      document.body.appendChild(script);
    };

    const drawChart = () => {
      if (loading) return;

      const data = google.visualization.arrayToDataTable(chartData);

      const options = {
        title: "Annual revenue of the tour",
        hAxis: {
          title: "Year",
        },
        vAxis: {
          title: "Revenue (USD)",
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

  return (
    <div>
      {loading ? (
        <p>Not Tour...</p>
      ) : (
        <div
          ref={chartRef}
          id="chart_div"
          style={{ width: "100%", height: "400px" }}
        ></div>
      )}
    </div>
  );
};

export default LineChartGGTour;