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

const moveCar = (car, currentTime) => {
  const elapsedTime = (currentTime - car.startTime) / 1000;
  const { lat, lon, reachedDestination } = moveTowards(
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
  } else {
    car.location = { lat, lon };
  }
};

const moveTowards = (
  startLat,
  startLon,
  endLat,
  endLon,
  speed,
  elapsedTime
) => {
  const distance = haversineDistance(startLat, startLon, endLat, endLon);
  const totalTime = distance / speed;
  const progress = Math.min(elapsedTime / (totalTime * 3600), 1);

  return {
    lat: startLat + (endLat - startLat) * progress,
    lon: startLon + (endLon - startLon) * progress,
    reachedDestination: progress >= 1,
  };
};

// Expanded list of male first names
const firstNames = [
  "Ali",
  "Mohammed",
  "Ahmed",
  "Omar",
  "Khaled",
  "Zayn",
  "Hassan",
  "Tariq",
  "Yusuf",
  "Karim",
  "Rami",
  "Samir",
  "Amir",
  "Fahad",
  "Walid",
  "Nasser",
  "Zaid",
  "Sami",
  "Faris",
  "Jamil",
  "Yara",
  "Rami",
  "Rayan",
  "Othman",
  "Rashid",
  "Fares",
  "Musa",
  "Sulaiman",
  "Zaher",
  "Hadi",
  "Tariq",
  "Rashid",
  "Bilal",
  "Hassan",
  "Mazen",
  "Imad",
  "Adnan",
  "Mujtaba",
  "Ayman",
  "Fawzi",
  "Bashir",
  "Amir",
  "Sami",
  "Ibrahim",
  "Mousa",
  "Tamer",
  "Riad",
  "Majed",
  "Ahmad",
  "Nabil",
  "Rami",
];

const lastNames = [
  "Al-Mansoori",
  "Al-Hashimi",
  "Al-Qasimi",
  "Al-Nuaimi",
  "Al-Farsi",
  "Al-Majed",
  "Al-Dhaheri",
  "Al-Suwaidi",
  "Al-Kuwari",
  "Al-Obaidli",
  "Al-Rahmani",
  "Al-Basha",
  "Al-Saleh",
  "Al-Mutawa",
  "Al-Ghanem",
  "Al-Mazrouei",
  "Al-Jabari",
  "Al-Khalaf",
  "Al-Sabawi",
  "Al-Ansari",
  "Al-Shamsi",
  "Al-Kaabi",
  "Al-Hassan",
  "Al-Shahidi",
  "Al-Qudah",
  "Al-Muhairi",
  "Al-Maktoum",
  "Al-Ali",
  "Al-Siddiqi",
  "Al-Nasr",
  "Al-Khatib",
  "Al-Fahidi",
  "Al-Amiri",
  "Al-Saeedi",
  "Al-Suwaiyan",
  "Al-Rashid",
  "Al-Tamimi",
  "Al-Hashimi",
  "Al-Maghribi",
  "Al-Shawi",
  "Al-Fahad",
  "Al-Mubarak",
  "Al-Dawood",
  "Al-Ghazi",
  "Al-Qureishi",
  "Al-Mousa",
  "Al-Qatari",
  "Al-Turki",
  "Al-Sharif",
];

const generateRandomName = () => {
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

let cars = [];
const initializeCars = (count) => {
  cars = Array.from({ length: count }, (_, i) => createCar(i + 1));
};

// Get all cars, default 30
app.get("/locations", (req, res) => {
  let count = parseInt(req.query.count) || 30;
  const currentTime = Date.now();

  if (cars.length !== count) {
    initializeCars(count);
  }

  cars.forEach((car) => moveCar(car, currentTime));

  res.json(
    cars.map((car) => ({
      id: car.id,
      lat: car.location.lat,
      lon: car.location.lon,
      speed: car.speed,
      driver: car.driver,
      carData: car.carData,
    }))
  );
});

// Get a single car by ID
app.get("/locations/:id", (req, res) => {
  const carId = parseInt(req.params.id);
  const currentTime = Date.now();

  const car = cars.find((c) => c.id === carId);
  if (!car) {
    return res.status(404).json({ error: "Car not found" });
  }

  moveCar(car, currentTime);

  res.json({
    id: car.id,
    lat: car.location.lat,
    lon: car.location.lon,
    speed: car.speed,
    driver: car.driver,
    carData: car.carData,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
