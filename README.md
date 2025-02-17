# Car Tracking API

This API simulates car movement around Burj Khalifa, generating real-time locations for a specified number of cars. Each car has a driver, vehicle details, and a target location.

## Features

- **Dynamic Car Count**: Request a specific number of cars via query parameters (default is 30).
- **Realistic Car Movement**: Uses the Haversine formula to simulate movement.
- **Randomized Data**: Generates random car brands, colors, drivers, and locations.

## Installation

1. Clone this repository:

   ```sh
   git clone https://github.com/ZeroNeroIV/dummy-car-tracking-api.git
   cd car-tracking-api
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the server:

   ```sh
   node server.js
   ```

## Usage

### **Get Car Locations**

Fetch car locations with an optional `count` parameter to specify the number of cars (default: 30).

- **Default (30 cars):**

  ```http
  GET /locations
  ```

- **Custom count (e.g., 50 cars):**

  ```http
  GET /locations?count=50
  ```

#### **Response Format**

```json
[
  {
    "id": 1,
    "lat": 25.195,
    "lon": 55.272,
    "speed": 45,
    "driver": {
      "name": "Ali Al-Mansoori",
      "age": 35,
      "licenseNumber": "UAE-1234567"
    },
    "carData": {
      "brand": "Toyota",
      "model": "Camry",
      "year": 2022,
      "color": "White",
      "plateNumber": "A12345"
    }
  }
]
```

## Future Improvements

- WebSockets for **real-time location updates**.
- Database integration for **persistent tracking**.
