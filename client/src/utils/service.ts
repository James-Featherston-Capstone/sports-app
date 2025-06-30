const BASE_URL = "https://sports-app-nz7w.onrender.com/api";
const fetchData = async <T = any>(
  path: string,
  request: Object
): Promise<T> => {
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
