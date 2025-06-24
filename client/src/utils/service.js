const BASE_URL = "http://localhost:3000/api";
const fetchData = async (path, request) => {
  let data = null;
  try {
    const response = await fetch(path, request);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    data = await response.json();
  } catch (error) {
    console.error(error);
  }
  return data;
};

export { BASE_URL, fetchData };
