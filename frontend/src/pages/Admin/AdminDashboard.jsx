import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats', error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Loading dashboard...</div>;

  const chartData = {
    labels: stats.last30DaysTraffic?.map(d => d.date) || [],
    datasets: [
      {
        label: 'Daily Views',
        data: stats.last30DaysTraffic?.map(d => d.views) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Platform Traffic (Last 30 Days)',
      },
    },
  };

  return (
    <div>
      <h2 style={{marginBottom: 24}}>Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Videos</div>
          <div className="stat-value">{stats.totalVideos}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Views</div>
          <div className="stat-value">{stats.totalViews}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Comments</div>
          <div className="stat-value">{stats.totalComments}</div>
        </div>
      </div>

      <div className="admin-chart-container">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default AdminDashboard;
