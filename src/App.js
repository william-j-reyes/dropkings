import React from 'react';
import Create from "./routes/Create";
import CreateCryptoDrop from "./routes/CreateCryptoDrop";
import GiveAwayDetails from "./routes/GiveAwayDetails";
import Home from './routes/Home';
import About from "./routes/About";
import Giveaways from "./routes/Giveaways";
import Profile from "./routes/Profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import desktopTheme from './themes/desktopTheme';
import mobileTheme from './themes/mobileTheme';
import { useMediaQuery } from 'react-responsive';

function App() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 800px)'})
  let theme;
  if(isTabletOrMobile)
    theme = mobileTheme;
  else
    theme = desktopTheme;
  theme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Create/" element={<Create/>} />
          <Route path="/Create/Crypto" element={<CreateCryptoDrop/>} />
          <Route path="/About" element={<About/>} />
          <Route path="/Giveaways" element={<Giveaways/>} />
          <Route path="/Giveaways/id=:id" element={<GiveAwayDetails/>} />
          <Route path="/Profile" element={<Profile/>} />
          <Route path="/Profile/id=:id" element={<Profile/>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
