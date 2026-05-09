import { Box, Typography, Stack, Paper } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  SparkLineChart,
  RadarChart,
  Gauge,
} from '@mui/x-charts';

const monthLabels = [
  'Jan 2025',
  'Feb 2025',
  'Mar 2025',
  'Apr 2025',
  'May 2025',
  'Jun 2025',
  'Jul 2025',
  'Aug 2025',
  'Sep 2025',
  'Oct 2025',
  'Nov 2025',
  'Dec 2025',
  'Jan 2026',
  'Feb 2026',
  'Mar 2026',
  'Apr 2026',
  'May 2026',
  'Jun 2026',
  'Jul 2026',
  'Aug 2026',
  'Sep 2026',
  'Oct 2026',
  'Nov 2026',
  'Dec 2026',
];

const pseudoRandom = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const withNoise = (value, seed, spread) => value + (pseudoRandom(seed) - 0.5) * spread;

const sales = monthLabels.map((_, i) => {
  const trend = 220 + i * 7.5;
  const seasonal = Math.sin((i / 12) * Math.PI * 2) * 42;
  const promoBoost = i === 10 || i === 22 ? 38 : 0;
  const dip = i === 16 ? -25 : 0;
  return Math.round(withNoise(trend + seasonal + promoBoost + dip, i + 1, 22));
});

const forecast = sales.map((v, i) => Math.round(withNoise(v * 0.95 + 12, 200 + i, 16)));

const revenue = monthLabels.map((_, i) => {
  const trend = 28000 + i * 1350;
  const seasonal = Math.sin((i / 12) * Math.PI * 2 + 0.4) * 5200;
  const eventBoost = i === 11 || i === 23 ? 4200 : 0;
  return Math.round(withNoise(trend + seasonal + eventBoost, 400 + i, 2200));
});

const cost = revenue.map((v, i) =>
  Math.round(withNoise(v * (0.48 + pseudoRandom(700 + i) * 0.08), 900 + i, 900)),
);

const conversionRate = monthLabels.map((_, i) => {
  const baseline = 2.1 + i * 0.05;
  const seasonal = Math.sin((i / 12) * Math.PI * 2 + 1.2) * 0.35;
  const noisy = withNoise(baseline + seasonal, 1200 + i, 0.32);
  return Number(Math.max(1.4, noisy).toFixed(2));
});

const scatterUsers = Array.from({ length: 36 }, (_, i) => {
  const x = i + 1;
  const saturation = 100 * (1 - Math.exp(-x / 14));
  const weeklyWobble = Math.sin(x / 2.8) * 6;
  const y = withNoise(saturation + weeklyWobble, 1500 + i, 8);
  return { x, y: Number(Math.max(6, y).toFixed(1)) };
});

const sparkData = Array.from({ length: 36 }, (_, i) => {
  const base = 32 + i * 0.45 + Math.sin(i / 3.4) * 4;
  return Number(withNoise(base, 1800 + i, 2.1).toFixed(2));
});

export default function MuiChartsPage() {
  const { animationsEnabled } = useOutletContext();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        MUI X Charts - All Main Types
      </Typography>

      <Stack spacing={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Line Chart</Typography>
          <LineChart
            height={260}
            skipAnimation={!animationsEnabled}
            xAxis={[{ scaleType: 'point', data: monthLabels }]}
            series={[
              { data: sales, label: 'Sales' },
              { data: forecast, label: 'Forecast' },
            ]}
          />
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Bar Chart</Typography>
          <BarChart
            height={260}
            skipAnimation={!animationsEnabled}
            xAxis={[{ scaleType: 'band', data: monthLabels }]}
            series={[
              { data: revenue, label: 'Revenue' },
              { data: cost, label: 'Cost' },
            ]}
          />
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Bar Chart (Dual Y-Axis)</Typography>
          <BarChart
            height={280}
            skipAnimation={!animationsEnabled}
            xAxis={[{ scaleType: 'band', data: monthLabels }]}
            yAxis={[
              { id: 'left', label: 'Revenue ($)', min: 0 },
              { id: 'right', label: 'Conversion Rate (%)', position: 'right', min: 0 },
            ]}
            series={[
              { data: revenue, label: 'Revenue', yAxisId: 'left' },
              { data: conversionRate, label: 'Conversion Rate', yAxisId: 'right' },
            ]}
          />
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Pie Chart</Typography>
          <PieChart
            height={260}
            skipAnimation={!animationsEnabled}
            series={[
              {
                data: [
                  { id: 0, value: 40, label: 'Desktop' },
                  { id: 1, value: 30, label: 'Mobile' },
                  { id: 2, value: 20, label: 'Tablet' },
                  { id: 3, value: 10, label: 'Other' },
                ],
              },
            ]}
          />
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Scatter Chart</Typography>
          <ScatterChart
            height={260}
            skipAnimation={!animationsEnabled}
            series={[
              {
                label: 'Users',
                data: scatterUsers,
              },
            ]}
          />
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">SparkLine Chart</Typography>
          <SparkLineChart data={sparkData} height={90} />
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Radar Chart</Typography>
          <RadarChart
            height={280}
            skipAnimation={!animationsEnabled}
            series={[
              {
                label: 'Team A',
                data: [80, 65, 90, 70, 75],
              },
              {
                label: 'Team B',
                data: [60, 80, 70, 85, 65],
              },
            ]}
            radar={{
              metrics: ['Speed', 'Quality', 'Cost', 'Scale', 'UX'],
            }}
          />
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Gauge</Typography>
          <Gauge width={240} height={240} value={72} />
        </Paper>
      </Stack>
    </Box>
  );
}
