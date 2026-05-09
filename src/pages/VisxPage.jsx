import { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft, AxisRight } from '@visx/axis';
import { Bar, LinePath, Arc } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { pie } from 'd3-shape';

const data = [
  { month: 'Jan', revenue: 32, conversion: 2.1 },
  { month: 'Feb', revenue: 38, conversion: 2.5 },
  { month: 'Mar', revenue: 41, conversion: 2.7 },
  { month: 'Apr', revenue: 36, conversion: 2.2 },
  { month: 'May', revenue: 44, conversion: 2.9 },
  { month: 'Jun', revenue: 49, conversion: 3.1 },
  { month: 'Jul', revenue: 52, conversion: 3.4 },
  { month: 'Aug', revenue: 48, conversion: 3.0 },
  { month: 'Sep', revenue: 55, conversion: 3.6 },
  { month: 'Oct', revenue: 61, conversion: 3.9 },
  { month: 'Nov', revenue: 64, conversion: 4.1 },
  { month: 'Dec', revenue: 72, conversion: 4.5 },
];

const donutData = [
  { label: 'Desktop', value: 42 },
  { label: 'Mobile', value: 33 },
  { label: 'Tablet', value: 17 },
  { label: 'Other', value: 8 },
];

const scatterData = Array.from({ length: 26 }, (_, i) => ({
  x: i + 1,
  y: 12 + i * 2.1 + Math.sin(i / 2.5) * 5,
}));

function useMountAnimation(enabled, duration = 900) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setProgress(1);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.max(0, Math.min(1, (now - start) / duration));
      setProgress(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, enabled]);

  return progress;
}

function DualAxisChart({ progress }) {
  const safeProgress = Math.max(0, Math.min(1, progress));
  const width = 980;
  const height = 380;
  const margin = { top: 24, right: 56, bottom: 48, left: 56 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleBand({ domain: data.map((d) => d.month), range: [0, xMax], padding: 0.25 });
  const yLeftScale = scaleLinear({ domain: [0, Math.max(...data.map((d) => d.revenue)) * 1.15], range: [yMax, 0], nice: true });
  const yRightScale = scaleLinear({ domain: [0, Math.max(...data.map((d) => d.conversion)) * 1.25], range: [yMax, 0], nice: true });

  const animatedData = data.map((d) => ({
    ...d,
    revenue: Math.max(0, d.revenue * safeProgress),
    conversion: Math.max(0, d.conversion * safeProgress),
  }));

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        {animatedData.map((d) => {
          const barX = xScale(d.month) ?? 0;
          const barY = yLeftScale(d.revenue) ?? 0;
          const barHeight = Math.max(0, yMax - barY);
          return <Bar key={d.month} x={barX} y={barY} width={xScale.bandwidth()} height={barHeight} fill="#2563eb" rx={4} />;
        })}

        <LinePath
          data={animatedData}
          x={(d) => (xScale(d.month) ?? 0) + xScale.bandwidth() / 2}
          y={(d) => yRightScale(d.conversion) ?? 0}
          stroke="#f97316"
          strokeWidth={2.5}
          curve={curveMonotoneX}
        />

        {animatedData.map((d) => (
          <circle
            key={`p-${d.month}`}
            cx={(xScale(d.month) ?? 0) + xScale.bandwidth() / 2}
            cy={yRightScale(d.conversion) ?? 0}
            r={3.8}
            fill="#f97316"
            opacity={safeProgress}
          />
        ))}

        <AxisBottom top={yMax} scale={xScale} tickLabelProps={() => ({ fill: '#334155', fontSize: 12 })} />
        <AxisLeft scale={yLeftScale} tickLabelProps={() => ({ fill: '#334155', fontSize: 12 })} />
        <AxisRight left={xMax} scale={yRightScale} tickLabelProps={() => ({ fill: '#334155', fontSize: 12 })} />
      </Group>
    </svg>
  );
}

function DonutChart({ progress }) {
  const safeProgress = Math.max(0, Math.min(1, progress));
  const width = 460;
  const height = 320;
  const radius = Math.min(width, height) / 2 - 24;
  const arcs = useMemo(() => pie().value((d) => d.value)(donutData), []);
  const color = scaleOrdinal({
    domain: donutData.map((d) => d.label),
    range: ['#0ea5e9', '#3b82f6', '#8b5cf6', '#f59e0b'],
  });

  return (
    <svg width={width} height={height}>
      <Group left={width / 2} top={height / 2}>
        {arcs.map((arcDatum, i) => {
          const endAngle = arcDatum.startAngle + (arcDatum.endAngle - arcDatum.startAngle) * safeProgress;
          return (
            <Arc
              key={arcDatum.data.label}
              innerRadius={radius * 0.45}
              outerRadius={radius}
              startAngle={arcDatum.startAngle}
              endAngle={endAngle}
              fill={color(arcDatum.data.label)}
              padAngle={0.01}
            />
          );
        })}
      </Group>
    </svg>
  );
}

function ScatterChart({ progress }) {
  const safeProgress = Math.max(0, Math.min(1, progress));
  const width = 460;
  const height = 320;
  const margin = { top: 20, right: 20, bottom: 40, left: 46 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleLinear({ domain: [1, 26], range: [0, xMax] });
  const yScale = scaleLinear({ domain: [0, Math.max(...scatterData.map((d) => d.y)) * 1.1], range: [yMax, 0], nice: true });

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        {scatterData.map((d, i) => (
          <circle
            key={d.x}
            cx={xScale(d.x) ?? 0}
            cy={yScale(Math.max(0, d.y * safeProgress)) ?? yMax}
            r={3.8}
            fill="#0f766e"
            opacity={0.25 + safeProgress * 0.7}
          />
        ))}

        <AxisBottom top={yMax} scale={xScale} tickLabelProps={() => ({ fill: '#334155', fontSize: 12 })} />
        <AxisLeft scale={yScale} tickLabelProps={() => ({ fill: '#334155', fontSize: 12 })} />
      </Group>
    </svg>
  );
}

export default function VisxPage() {
  const { animationsEnabled } = useOutletContext();
  const progress = useMountAnimation(animationsEnabled, 1000);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        visx Charts
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2, overflowX: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Dual Axis Bars + Line
            </Typography>
            <DualAxisChart progress={progress} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, overflowX: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Donut Chart
            </Typography>
            <DonutChart progress={progress} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, overflowX: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Scatter Plot
            </Typography>
            <ScatterChart progress={progress} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
