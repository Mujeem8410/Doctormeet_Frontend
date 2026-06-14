import { Bar, Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import API from "../utils/api";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const DashboardCharts = () => {
  const [userStats, setUserStats] = useState({});
  const [appointmentStats, setAppointmentStats] = useState({});
  const [monthlyAppointments, setMonthlyAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await API.get("/admin/cfusers");
      const appRes = await API.get("/admin/cfappointments");
      const monthlyRes = await API.get("/admin/cfmonthly");

      const roleStats = {};
      userRes.data.forEach((u) => (roleStats[u._id] = u.count));
      setUserStats(roleStats);

      const appStats = {};
      appRes.data.forEach((a) => (appStats[a._id] = a.count));
      setAppointmentStats(appStats);

      setMonthlyAppointments(monthlyRes.data);
      console.log(appointmentStats)
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "70vw", height: "60vh" }} className="mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      {/* Pie Chart – Users */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">👥 User Distribution</h3>
        <Pie
          data={{
            labels: Object.keys(userStats),
            datasets: [
              {
                label: "Users",
                data: Object.values(userStats),
                backgroundColor: ["#4F46E5", "#22C55E", "#F59E0B"],
              },
            ],
          }}
        />
      </div>

      {/* Bar Chart – Monthly Appointments */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">📆 Monthly Appointments</h3>
        <Bar
          data={{
            labels: monthlyAppointments.map((m) => `Month ${m._id}`),
            datasets: [
              {
                label: "Appointments",
                data: monthlyAppointments.map((m) => m.count),
                backgroundColor: "#3B82F6",
              },
            ],
          }}
        />
      </div>
    </div>
    </div>
  );
};

export default DashboardCharts;
