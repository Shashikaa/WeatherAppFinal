import React, { useEffect, useState } from 'react';
import Clear from './assets/images/Clear.jpg';
import Cloudy from './assets/images/Cloudy.jpg';
import Fog from './assets/images/Fog.jpg';
import Rainy from './assets/images/Rainy.jpg';
import Snow from './assets/images/Snow.jpg';
import Stormy from './assets/images/Stormy.jpg';
import Sunny from './assets/images/Sunny.jpg';
import './BackgroundLayout.css';

const BackgroundLayout = ({ weather }) => {
  const [image, setImage] = useState(Sunny);

  useEffect(() => {
    if (weather && weather.conditions) {
      const conditions = weather.conditions.toLowerCase();
      if (conditions.includes('clear')) {
        setImage(Clear);
      } else if (conditions.includes('cloud')) {
        setImage(Cloudy);
      } else if (conditions.includes('rain') || conditions.includes('shower')) {
        setImage(Rainy);
      } else if (conditions.includes('snow')) {
        setImage(Snow);
      } else if (conditions.includes('fog')) {
        setImage(Fog);
      } else if (conditions.includes('thunder') || conditions.includes('storm')) {
        setImage(Stormy);
      } else {
        setImage(Sunny);
      }
    }
  }, [weather]);

  return (
    <div className='background-image' style={{ backgroundImage: `url(${image})` }}>
      {/* No content directly in BackgroundLayout */}
    </div>
  );
};

export default BackgroundLayout;
