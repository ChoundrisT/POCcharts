import { useState } from 'react';
import { Box, Button, FormControlLabel, Stack, Switch } from '@mui/material';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'MUI Charts', to: '/' },
  { label: 'D3.js', to: '/d3' },
  { label: 'visx', to: '/visx' },
];

export default function App() {
  const location = useLocation();
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{ p: 2, borderBottom: '1px solid #e5e7eb', justifyContent: 'space-between' }}
      >
        <Stack direction="row" spacing={1}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Button
                key={item.to}
                component={RouterLink}
                to={item.to}
                variant={isActive ? 'contained' : 'outlined'}
              >
                {item.label} ({item.to})
              </Button>
            );
          })}
        </Stack>
        <FormControlLabel
          control={
            <Switch
              checked={animationsEnabled}
              onChange={(event) => setAnimationsEnabled(event.target.checked)}
            />
          }
          label={`Animations ${animationsEnabled ? 'ON' : 'OFF'}`}
          sx={{ mr: 0 }}
        />
      </Stack>
      <Outlet context={{ animationsEnabled }} />
    </Box>
  );
}
