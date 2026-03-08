const OW_KEY = process.env.REACT_APP_OPENWEATHER_KEY;
const FIRMS_KEY = process.env.REACT_APP_FIRMS_KEY;

// Get weather + compute FWI from temp, humidity, wind
export async function getFireWeather(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OW_KEY}&units=imperial`
  );
  const d = await res.json();
  console.log("🌤️ WEATHER RAW:", d);
  const temp = d.main.temp;           // °F
  const humidity = d.main.humidity;   // %
  const windSpeed = Math.round(d.wind.speed);  // mph
  const windDeg = d.wind.deg;
  const windDir = degToCompass(windDeg);

  // Simplified FWI formula (0-100)
  const tempScore = Math.min((temp - 50) / 50 * 40, 40);    // max 40pts
  const humScore = Math.min((100 - humidity) / 100 * 35, 35); // max 35pts
  const windScore = Math.min(windSpeed / 40 * 25, 25);        // max 25pts
  const fwi = Math.max(0, Math.round(tempScore + humScore + windScore));

  console.log("🔥 FIRE WEATHER COMPUTED:", { fwi, temp, humidity, windSpeed, windDir });
  return { fwi, temp, humidity, windSpeed, windDir };
}

// Get active fires from NASA FIRMS near lat/lon
export async function getActiveFires(lat, lon) {
  const delta = 1.5;
  const area = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  const firmsUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${FIRMS_KEY}/VIIRS_SNPP_NRT/${area}/1`;
  
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(firmsUrl)}`;
    const res = await fetch(proxyUrl);
    const csv = await res.text();
    console.log("🛰️ FIRMS CSV (first 500 chars):", csv.slice(0, 500));

    const rows = csv.trim().split("\n").slice(1).filter(Boolean);
    const fires = rows.map(row => {
      const cols = row.split(",");
      return { lat: parseFloat(cols[0]), lon: parseFloat(cols[1]) };
    });

    const nearestMiles = fires.length
      ? Math.min(...fires.map(f => haversine(lat, lon, f.lat, f.lon))).toFixed(1)
      : "N/A";

    const firePoints = fires.slice(0, 5);
    console.log("🔥 ACTIVE FIRES:", { count: fires.length, nearestMiles, firePoints });
    return { fires: fires.length, nearestMiles, firePoints };

  } catch (e) {
    console.warn("⚠️ FIRMS unavailable, using fallback:", e.message);
    return { fires: 0, nearestMiles: "N/A", firePoints: [] };
  }
}

function degToCompass(deg) {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}