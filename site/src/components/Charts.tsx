import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface RepoStats {
  stars: number;
  forks: number;
  watchers: number;
  languages: Record<string, number>;
  commitActivity: { week: string; commits: number }[];
}

export default function Charts() {
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const baseUrl = import.meta.env.BASE_URL || '/willow';
        const response = await fetch(`${baseUrl}/data/stats.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="skeleton h-8 w-48 mb-4"></div>
              <div className="skeleton h-64 w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="alert alert-error">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold">Error Loading Statistics</h3>
          <div className="text-sm">{error || 'Statistics data not available'}</div>
        </div>
      </div>
    );
  }

  // Prepare language chart data
  const languageLabels = Object.keys(stats.languages);
  const languageValues = Object.values(stats.languages);
  const languageColors = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
  ];

  const languageData = {
    labels: languageLabels,
    datasets: [
      {
        data: languageValues,
        backgroundColor: languageColors.slice(0, languageLabels.length),
        borderColor: languageColors.slice(0, languageLabels.length).map(c => c.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  // Prepare repo stats data
  const repoStatsData = {
    labels: ['Stars', 'Forks', 'Watchers'],
    datasets: [
      {
        label: 'Repository Statistics',
        data: [stats.stars, stats.forks, stats.watchers],
        backgroundColor: [
          'rgba(255, 206, 86, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare commit activity data
  const commitData = {
    labels: stats.commitActivity.map(w => w.week),
    datasets: [
      {
        label: 'Commits',
        data: stats.commitActivity.map(w => w.commits),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Repository Stats */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Repository Statistics</h3>
          <div className="h-64">
            <Bar data={repoStatsData} options={{ ...chartOptions, scales: undefined }} />
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Languages</h3>
          <div className="h-64 flex items-center justify-center">
            <Pie data={languageData} options={{ ...chartOptions, scales: undefined }} />
          </div>
        </div>
      </div>

      {/* Commit Activity */}
      <div className="card bg-base-200 shadow-xl md:col-span-2">
        <div className="card-body">
          <h3 className="card-title">12-Week Commit Activity</h3>
          <div className="h-64">
            <Line data={commitData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
