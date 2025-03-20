import axios from "axios";

const api = axios.create({
  baseURL: window.ENV.VITE_API_URL, // e.g., "https://localhost:7021/api"
});

// Function to get the token
async function getToken(credentials) {
  // Construct the URL (ensure proper slash handling)
  const url = `/Auth/login`;

  try {
    const response = await api.post(url, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check for non-200 status codes (Axios throws for non-2xx, but you might want extra checks)
    if (response.status !== 200) {
      console.error(`Unexpected status code: ${response.status}`);
      throw new Error(`Unexpected response status: ${response.status}`);
    }
    if(response.data.data!==null){
      return response.data;
    }
    else{
      return response.data;
    }
    // Assuming the token is in response.data
    
  } catch (error) {
    // Check if it's an Axios error
    if (axios.isAxiosError(error)) {
      // Request was made and server responded with a status outside the 2xx range
      if (error.response) {
        console.error("Server responded with an error:", {
          status: error.response.status,
          data: error.response.data,
        });
        // Optionally, throw a new error or return a standardized error object
        throw new Error(`Server Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("No response received:", error.request);
        throw new Error("No response received from the server. Please try again later.");
      } else {
        // Something else happened setting up the request
        console.error("Axios error:", error.message);
        throw new Error(`Axios error: ${error.message}`);
      }
    } else {
      // Non-Axios error
      console.error("Unexpected error:", error);
      throw error;
    }
  }
}

export default getToken;
