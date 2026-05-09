import { useEffect, useRef } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import * as d3 from 'd3';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const revenue = [32, 38, 41, 36, 44, 49, 52, 48, 55, 61, 64, 72];
const conversion = [2.1, 2.5, 2.7, 2.2, 2.9, 3.1, 3.4, 3.0, 3.6, 3.9, 4.1, 4.5];
const categoryData = [
  { label: 'Desktop', value: 42 },
  { label: 'Mobile', value: 33 },
  { label: 'Tablet', value: 17 },
  { label: 'Other', value: 8 },
];
const scatterData = Array.from({ length: 36 }, (_, i) => ({
  x: i + 1,
  y: 18 + i * 1.7 + Math.sin(i / 2.7) * 5 + (i % 3) * 1.2,
}));

function drawDualAxis(container, animate) {
  const width = container.clientWidth;
  const height = 360;
  const margin = { top: 24, right: 56, bottom: 44, left: 56 };

  const svg = d3.select(container).html('').append('svg').attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', height);

  const x = d3.scaleBand().domain(months).range([margin.left, width - margin.right]).padding(0.25);
  const yLeft = d3.scaleLinear().domain([0, d3.max(revenue) * 1.15]).nice().range([height - margin.bottom, margin.top]);
  const yRight = d3.scaleLinear().domain([0, d3.max(conversion) * 1.25]).nice().range([height - margin.bottom, margin.top]);

  svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x));
  svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yLeft));
  svg.append('g').attr('transform', `translate(${width - margin.right},0)`).call(d3.axisRight(yRight));

  const bars = svg.append('g').selectAll('rect').data(months.map((m, i) => ({ m, v: revenue[i] }))).join('rect').attr('x', (d) => x(d.m)).attr('width', x.bandwidth()).attr('fill', '#2563eb').attr('rx', 4);

  if (animate) {
    bars.attr('y', yLeft(0)).attr('height', 0).transition().duration(900).delay((_, i) => i * 35).attr('y', (d) => yLeft(d.v)).attr('height', (d) => yLeft(0) - yLeft(d.v));
  } else {
    bars.attr('y', (d) => yLeft(d.v)).attr('height', (d) => yLeft(0) - yLeft(d.v));
  }

  const lineData = months.map((m, i) => ({ m, v: conversion[i] }));
  const line = d3.line().x((d) => x(d.m) + x.bandwidth() / 2).y((d) => yRight(d.v)).curve(d3.curveMonotoneX);

  const path = svg.append('path').datum(lineData).attr('fill', 'none').attr('stroke', '#f97316').attr('stroke-width', 2.5).attr('d', line);

  if (animate) {
    const totalLength = path.node().getTotalLength();
    path.attr('stroke-dasharray', `${totalLength} ${totalLength}`).attr('stroke-dashoffset', totalLength).transition().duration(1200).ease(d3.easeCubicOut).attr('stroke-dashoffset', 0);
  }

  const dots = svg.append('g').selectAll('circle').data(lineData).join('circle').attr('cx', (d) => x(d.m) + x.bandwidth() / 2).attr('cy', (d) => yRight(d.v)).attr('fill', '#f97316');
  if (animate) {
    dots.attr('r', 0).transition().duration(500).delay((_, i) => 550 + i * 45).attr('r', 3.8);
  } else {
    dots.attr('r', 3.8);
  }
}

function drawPie(container, animate) {
  const width = container.clientWidth;
  const height = 320;
  const radius = Math.min(width, height) / 2 - 14;

  const svg = d3.select(container).html('').append('svg').attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', height).append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie().value((d) => d.value).sort(null);
  const arc = d3.arc().innerRadius(radius * 0.45).outerRadius(radius);
  const color = d3.scaleOrdinal().domain(categoryData.map((d) => d.label)).range(['#0ea5e9', '#3b82f6', '#8b5cf6', '#f59e0b']);

  const arcs = svg.selectAll('path').data(pie(categoryData)).join('path').attr('fill', (d) => color(d.data.label));

  if (animate) {
    arcs.transition().duration(900).attrTween('d', function (d) {
      const i = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d);
      return (t) => arc(i(t));
    });
  } else {
    arcs.attr('d', arc);
  }
}

function drawScatter(container, animate) {
  const width = container.clientWidth;
  const height = 320;
  const margin = { top: 18, right: 18, bottom: 40, left: 46 };

  const svg = d3.select(container).html('').append('svg').attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', height);
  const x = d3.scaleLinear().domain([1, 36]).range([margin.left, width - margin.right]);
  const y = d3.scaleLinear().domain([0, d3.max(scatterData, (d) => d.y) * 1.1]).nice().range([height - margin.bottom, margin.top]);

  svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x));
  svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

  const dots = svg.append('g').selectAll('circle').data(scatterData).join('circle').attr('cx', (d) => x(d.x)).attr('fill', '#0f766e').attr('opacity', 0.85);
  if (animate) {
    dots.attr('cy', y(0)).attr('r', 0).transition().duration(700).delay((_, i) => i * 20).attr('cy', (d) => y(d.y)).attr('r', 4.2);
  } else {
    dots.attr('cy', (d) => y(d.y)).attr('r', 4.2);
  }
}

export default function D3Page() {
  const { animationsEnabled } = useOutletContext();
  const dualRef = useRef(null);
  const pieRef = useRef(null);
  const scatterRef = useRef(null);

  useEffect(() => {
    if (dualRef.current) drawDualAxis(dualRef.current, animationsEnabled);
    if (pieRef.current) drawPie(pieRef.current, animationsEnabled);
    if (scatterRef.current) drawScatter(scatterRef.current, animationsEnabled);
  }, [animationsEnabled]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        D3.js Charts
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Dual Axis Bars + Line
            </Typography>
            <Box ref={dualRef} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Donut Chart
            </Typography>
            <Box ref={pieRef} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scatter Plot
            </Typography>
            <Box ref={scatterRef} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
