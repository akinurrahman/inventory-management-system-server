import fetch from "node-fetch";

interface GeoIPResponse {
  city?: string;
  regionName?: string;
  country?: string;
}

export const getLocationFromIP = async (ip: string) => {
  if (!ip) return "";
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}`);
    const data = (await res.json()) as GeoIPResponse; // type assertion
    return `${data.city || ""}, ${data.regionName || ""}, ${
      data.country || ""
    }`;
  } catch {
    return "";
  }
};
