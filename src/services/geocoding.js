export async function getCoordinates(location) {
  const key = process.env.REACT_APP_OPENWEATHER_KEY;
  const isZip = /^\d{5}$/.test(location.trim());

  const url = isZip
    ? `https://api.openweathermap.org/geo/1.0/zip?zip=${location.trim()},US&appid=${key}`
    : `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${key}`;

  const res = await fetch(url);
  const data = await res.json();
  console.log("📍 GEOCODING:", data);

  // zip endpoint returns a single object, direct returns an array
  if (isZip) {
    if (data.cod) throw new Error("Location not found");
    return { lat: data.lat, lon: data.lon, name: data.name };
  } else {
    if (!data.length) throw new Error("Location not found");
    return { lat: data[0].lat, lon: data[0].lon, name: data[0].name };
  }
}