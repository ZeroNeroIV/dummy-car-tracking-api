const express = require("express");
const app = express();
const port = 3000;

const EARTH_RADIUS = 6371;
const KHALIFA_TOWER_LAT = 25.197197;
const KHALIFA_TOWER_LON = 55.274376;

const getRandomInRange = (min, max) => Math.random() * (max - min) + min;

const generateRandomNearbyLocation = (centerLat, centerLon, radiusKm) => {
  const radiusInDegrees = radiusKm / 111;
  return {
    lat: centerLat + getRandomInRange(-radiusInDegrees, radiusInDegrees),
    lon: centerLon + getRandomInRange(-radiusInDegrees, radiusInDegrees),
  };
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
};

const moveCar = (startLat, startLon, endLat, endLon, speed, elapsedTime) => {
  const distance = haversineDistance(startLat, startLon, endLat, endLon);
  const totalTime = distance / speed;
  const progress = Math.min(elapsedTime / (totalTime * 3600), 1);

  return {
    lat: startLat + (endLat - startLat) * progress,
    lon: startLon + (endLon - startLon) * progress,
    reachedDestination: progress >= 1,
  };
};

const generateRandomName = () => {
  const firstNames = ["Ali", "Mohammed", "Fatima", "Ahmed", "Sara"];
  const lastNames = ["Al-Mansoori", "Al-Hashimi", "Al-Qasimi", "Al-Nuaimi"];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
    lastNames[Math.floor(Math.random() * lastNames.length)]
  }`;
};

const generateRandomCarData = () => {
  const carBrands = ["Toyota", "Nissan", "Honda", "Lexus"];
  const carModels = ["Camry", "Altima", "Accord", "RX"];
  const colors = ["White", "Black", "Silver", "Gray"];

  return {
    brand: carBrands[Math.floor(Math.random() * carBrands.length)],
    model: carModels[Math.floor(Math.random() * carModels.length)],
    year: Math.floor(getRandomInRange(2015, 2024)),
    color: colors[Math.floor(Math.random() * colors.length)],
    plateNumber: `${String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    )}${Math.floor(Math.random() * 99999)
      .toString()
      .padStart(5, "0")}`,
  };
};

const createCar = (id) => ({
  id,
  location: generateRandomNearbyLocation(
    KHALIFA_TOWER_LAT,
    KHALIFA_TOWER_LON,
    5
  ),
  target: generateRandomNearbyLocation(KHALIFA_TOWER_LAT, KHALIFA_TOWER_LON, 5),
  speed: getRandomInRange(30, 70),
  startTime: Date.now(),
  driver: {
    name: generateRandomName(),
    age: Math.floor(getRandomInRange(25, 60)),
    licenseNumber: `UAE-${Math.floor(Math.random() * 9999999)
      .toString()
      .padStart(7, "0")}`,
  },
  carData: generateRandomCarData(),
});

let cars = []; // Cached cars for consistent tracking

app.get("/locations", (req, res) => {
  let count = parseInt(req.query.count) || 30; // Default to 30 cars
  const currentTime = Date.now();

  if (cars.length !== count) {
    cars = Array.from({ length: count }, (_, i) => createCar(i + 1));
  }

  const updatedLocations = cars.map((car) => {
    const elapsedTime = (currentTime - car.startTime) / 1000;
    const { lat, lon, reachedDestination } = moveCar(
      car.location.lat,
      car.location.lon,
      car.target.lat,
      car.target.lon,
      car.speed,
      elapsedTime
    );

    if (reachedDestination) {
      car.location = { lat, lon };
      car.target = generateRandomNearbyLocation(
        KHALIFA_TOWER_LAT,
        KHALIFA_TOWER_LON,
        5
      );
      car.startTime = currentTime;
    }

    return {
      id: car.id,
      lat,
      lon,
      speed: car.speed,
      driver: car.driver,
      carData: car.carData,
    };
  });

  res.json(updatedLocations);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
