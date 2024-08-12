import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
// import api from "@/interceptors/axios";
import { api } from "@/interceptors/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components you need
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SuperAdminReports = () => {
  const [sessionData, setSessionData] = useState([]);
  const [authData, setAuthData] = useState([]);
  const [timeframe, setTimeframe] = useState("all");
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);

  const sessionChartRef = useRef(null);
  const authChartRef = useRef(null);

  // Determine the report type based on the timeframe
  // const reportTypeSession = timeframe === 'monthly' ? "Monthly Active Sessions" : "Monthly Active Sessions";
  // const reportTypeAuth = timeframe === 'monthly' ? "Monthly Verification and 2FA" : "Yearly Verification and 2FA";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const sessionResponse = await api.get("session/report");
      const authResponse = await api.get("auth/report");

      setSessionData(sessionResponse.data);
      setAuthData(authResponse.data);

      console.log(sessionResponse.data);
      console.log(authResponse.data);

      // Extract unique years
      const sessionYears = new Set(
        sessionResponse.data.map((item) => parseInt(item.year, 10))
      );
      const authYears = new Set(
        authResponse.data.map((item) => parseInt(item.year, 10))
      );
      const uniqueYears = Array.from(
        new Set([...sessionYears, ...authYears])
      ).sort((a, b) => a - b);

      setAvailableYears(uniqueYears);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const processAuthChartData = (data, uniqueYears, type, selectedYear) => {
    let labels = [];
    let emailVerifiedData = [];
    let twoFaEnabledData = [];

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-based month

    if (type === "monthly") {
      const allMonths = [];

      if (selectedYear && selectedYear !== "") {
        // Generate all months for the selected year up to the current month
        for (let month = 1; month <= Math.min(12, currentMonth); month++) {
          allMonths.push({
            month,
            year: selectedYear,
            label: `${monthNames[month - 1]} ${selectedYear}`,
          });
        }

        labels = allMonths.map((m) => m.label);

        const dataMap = data.reduce((acc, item) => {
          if (parseInt(item.year, 10) === parseInt(selectedYear, 10)) {
            const monthIndex = parseInt(item.month, 10);
            const key = `${monthNames[monthIndex - 1]} ${item.year}`;
            acc[key] = {
              emailVerified: item.emailVerified,
              twoFaEnabled: item.twoFaEnabled,
            };
          }
          return acc;
        }, {});

        emailVerifiedData = allMonths.map(
          (m) => dataMap[m.label]?.emailVerified || 0
        );
        twoFaEnabledData = allMonths.map(
          (m) => dataMap[m.label]?.twoFaEnabled || 0
        );
      } else {
        // Generate all months for all unique years up to the current month
        uniqueYears.forEach((year) => {
          const endMonth = year === currentYear ? currentMonth : 12;
          for (let month = 1; month <= endMonth; month++) {
            allMonths.push({
              month,
              year,
              label: `${monthNames[month - 1]} ${year}`,
            });
          }
        });

        labels = allMonths.map((m) => m.label);

        const dataMap = data.reduce((acc, item) => {
          const monthIndex = parseInt(item.month, 10);
          const key = `${monthNames[monthIndex - 1]} ${item.year}`;
          acc[key] = {
            emailVerified: item.emailVerified,
            twoFaEnabled: item.twoFaEnabled,
          };
          return acc;
        }, {});

        emailVerifiedData = allMonths.map(
          (m) => dataMap[m.label]?.emailVerified || 0
        );
        twoFaEnabledData = allMonths.map(
          (m) => dataMap[m.label]?.twoFaEnabled || 0
        );
      }
    } else if (type === "yearly") {
      labels = uniqueYears.map((year) => year);
      emailVerifiedData = uniqueYears.map((year) => {
        const item = data.find((d) => parseInt(d.year, 10) === year);
        return item ? item.emailVerified : 0;
      });
      twoFaEnabledData = uniqueYears.map((year) => {
        const item = data.find((d) => parseInt(d.year, 10) === year);
        return item ? item.twoFaEnabled : 0;
      });
    }

    return {
      labels,
      datasets: [
        {
          label: "Email Verified Users",
          data: emailVerifiedData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
        {
          label: "2FA Enabled Users",
          data: twoFaEnabledData,
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
        },
      ],
    };
  };

  const processSessionChartData = (data, uniqueYears, type, selectedYear) => {
    let labels = [];
    let totalMinutesData = [];
    let averageMinutesData = [];

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-based month

    if (type === "monthly") {
      const allMonths = [];
      if (selectedYear && selectedYear !== "") {
        // Generate all months for the selected year up to the current month
        for (let month = 1; month <= Math.min(12, currentMonth); month++) {
          allMonths.push({
            month,
            year: selectedYear,
            label: `${monthNames[month - 1]} ${selectedYear}`,
          });
        }

        labels = allMonths.map((m) => m.label);

        const dataMap = data.reduce((acc, item) => {
          if (parseInt(item.year, 10) === parseInt(selectedYear, 10)) {
            const monthIndex = parseInt(item.month, 10);
            const key = `${monthNames[monthIndex - 1]} ${item.year}`;
            acc[key] = {
              totalDurationMinutes: item.totalDurationMinutes,
              averageDurationMinutes: item.averageDurationMinutes,
            };
          }
          return acc;
        }, {});

        totalMinutesData = allMonths.map(
          (m) => dataMap[m.label]?.totalDurationMinutes || 0
        );
        averageMinutesData = allMonths.map(
          (m) => dataMap[m.label]?.averageDurationMinutes || 0
        );
      } else {
        // Generate all months for all unique years up to the current month
        uniqueYears.forEach((year) => {
          const endMonth = year === currentYear ? currentMonth : 12;
          for (let month = 1; month <= endMonth; month++) {
            allMonths.push({
              month,
              year,
              label: `${monthNames[month - 1]} ${year}`,
            });
          }
        });

        labels = allMonths.map((m) => m.label);

        const dataMap = data.reduce((acc, item) => {
          const monthIndex = parseInt(item.month, 10);
          const key = `${monthNames[monthIndex - 1]} ${item.year}`;
          acc[key] = {
            totalDurationMinutes: item.totalDurationMinutes,
            averageDurationMinutes: item.averageDurationMinutes,
          };
          return acc;
        }, {});

        totalMinutesData = allMonths.map(
          (m) => dataMap[m.label]?.totalDurationMinutes || 0
        );
        averageMinutesData = allMonths.map(
          (m) => dataMap[m.label]?.averageDurationMinutes || 0
        );
      }
    } else if (type === "yearly") {
      labels = uniqueYears.map((year) => year);
      totalMinutesData = uniqueYears.map((year) => {
        const item = data.find((d) => parseInt(d.year, 10) === year);
        return item ? item.totalDurationMinutes : 0;
      });
      averageMinutesData = uniqueYears.map((year) => {
        const item = data.find((d) => parseInt(d.year, 10) === year);
        return item ? item.averageDurationMinutes : 0;
      });
    } else {
      // All time
      labels = data.map((item) => {
        const monthIndex = parseInt(item.month, 10) - 1;
        const monthName = monthNames[monthIndex];
        return `${monthName} ${item.year}`;
      });
      totalMinutesData = data.map((item) => item.totalDurationMinutes);
      averageMinutesData = data.map((item) => item.averageDurationMinutes);
    }

    return {
      labels,
      datasets: [
        {
          label: "Total Minutes",
          data: totalMinutesData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
        {
          label: "Average Minutes",
          data: averageMinutesData,
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
        },
      ],
    };
  };

  const sessionChartData = processSessionChartData(
    sessionData,
    availableYears,
    timeframe === "monthly" ? "monthly" : "yearly",
    selectedYear
  );
  const authChartData = processAuthChartData(
    authData,
    availableYears,
    timeframe === "monthly" ? "monthly" : "yearly",
    selectedYear
  );

  // Clean up chart instances before unmounting or re-creating
  useEffect(() => {
    return () => {
      if (sessionChartRef.current) {
        sessionChartRef.current.destroy();
      }
      if (authChartRef.current) {
        authChartRef.current.destroy();
      }
    };
  }, []);

  // Define inline style for the dropdowns
  const dropdownStyle = {
    // slate backgroun color
    backgroundColor: "#101728",
    textColor: "white",
    border: "1px solid darkgrey",
    padding: "5px",
    borderRadius: "4px",
    marginLeft: "20px",
    marginTop: "20px",
  };

  // Define inline style for the headers
  const headerStyle = {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "40px",
    marginBottom: "20px",
  };

  return (
    <div>
      <div>
        <label>
          Timeframe:
          <select
            value={timeframe}
            onChange={handleTimeframeChange}
            style={dropdownStyle}
          >
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>

        {timeframe === "monthly" && (
          <select
            value={selectedYear}
            onChange={handleYearChange}
            style={dropdownStyle}
          >
            <option value="">All Time</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <h2 style={headerStyle}>Session Data</h2>
        <div>
          <Line
            ref={sessionChartRef}
            data={sessionChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const label = tooltipItem.dataset.label || "";
                      const value = tooltipItem.raw;
                      return `${label}: ${value}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: timeframe === "monthly" ? "Month" : "Year",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Duration (Minutes)",
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        <h2 style={headerStyle}>Authentication Data</h2>
        <div>
          <Line
            ref={authChartRef}
            data={authChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const label = tooltipItem.dataset.label || "";
                      const value = tooltipItem.raw;
                      return `${label}: ${value}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: timeframe === "monthly" ? "Month" : "Year",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Count",
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminReports;
