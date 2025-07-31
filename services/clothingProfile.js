const axios = require("axios");
const { clothingProfileTypes } = require("../services/clothingProfileTypes");

async function fetchClothingProfile(userId) {
  const url = '${process.env.PROFILE_API_URL}/${userId}';
  const res = await fetch(url, {
    headers: {
      Authorization: 'Bearer ${process.env.PROFILE_API_URL}'
    }
  })
  if (!res.ok) {
    throw new Error('Error while fetching: ${res.statusText}'); kK: w
  }
  const data = await res.json();
  const clothingProfile = new clothingProfile(data);
  return clothingProfile;
}
module.exports = { fetchClothingProfile };

