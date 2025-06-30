const BASE_URL =
  import.meta.env.VITE_URL_MODE === "dev"
    ? "http://localhost:3000/api"
    : "https://sports-app-nz7w.onrender.com/api";
const fetchData = async <T = any>(
  path: string,
  request: Object
): Promise<T> => {
  console.log(BASE_URL);
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
