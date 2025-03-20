// import axios from "axios";


// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL
// });


// async function getAPI(controller, methodName, headers = {}, queryParams = {}) {
//   // Retrieve your host URL (this could come from a config file)

//   // Token management (assume token is stored somewhere like localStorage or in a context)
//   let accessToken = localStorage.getItem("accessToken");

//   if (!accessToken) {
//     // redirect to login page 
//   }

//   // Set up the base URL and endpoint
//   let url = `${controller}/${methodName}`;

//   // If query parameters exist, append them to the URL
//   const queryString = new URLSearchParams(queryParams).toString();
//   if (queryString) {
//     url = `${url}?${queryString}`;
//   }

//   // Set up the request headers. Ensure we add the Authorization header.
//   const requestHeaders = {
//     Authorization: `Bearer ${accessToken}`,
//     ...headers,
//   };

//   try {
//     const response = await api.get(url, { headers: requestHeaders });
//     return response.data;
//   } catch (error) {
//     console.error("API GET request error:", error);
//     throw error;
//   }
// }

// export default getAPI;



import axios from "axios";

const api = axios.create({
  baseURL: window.ENV.VITE_API_URL
});

async function getAPI(controller, methodName, headers = {}, queryParams = {}) {
  // Retrieve access token from localStorage
  let accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    // Handle token absence appropriately; for example, you might throw an error or redirect.
    const tokenError = new Error("Access token is missing. Please log in.");
    console.error(tokenError.message);
    throw tokenError;
  }

  // Set up the base URL and endpoint
  let url = `${controller}/${methodName}`;

  // Append query parameters if any
  const queryString = new URLSearchParams(queryParams).toString();
  if (queryString) {
    url = `${url}?${queryString}`;
  }

  // Prepare request headers with Authorization
  const requestHeaders = {
    Authorization: `Bearer ${accessToken}`,
    ...headers,
  };

  try {
    const response = await api.get(url, { headers: requestHeaders });
    return response.data;
  } catch (error) {
    // Check if the error is an axios error with a response from the server
    if (error.response) {
      console.error(
        "API GET request error:",
        `Status: ${error.response.status}`,
        error.response.data
      );
      throw new Error(
        `API Error: ${error.response.status} - ${JSON.stringify(
          error.response.data
        )}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error("API Error: No response received from the server.");
    } else {
      // Something else happened while setting up the request
      console.error("Error during API GET request:", error.message);
      throw new Error(`API Error: ${error.message}`);
    }
  }
}

async function postAPI(controller, methodName, body = {}, headers = {}) {
  // Retrieve access token from localStorage
  let accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    // Handle token absence appropriately
    const tokenError = new Error("Access token is missing. Please log in.");
    console.error(tokenError.message);
    throw tokenError;
  }

  // Set up the base URL and endpoint
  let url = `${controller}/${methodName}`;

  // Prepare request headers with Authorization
  const requestHeaders = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    ...headers,
  };

  try {
    const response = await api.post(url, body, { headers: requestHeaders });
    return response.data;
  } catch (error) {
    // Check if the error is an axios error with a response from the server
    if (error.response) {
      console.error(
        "API POST request error:",
        `Status: ${error.response.status}`,
        error.response.data
      );
      throw new Error(
        `API Error: ${error.response.status} - ${JSON.stringify(
          error.response.data
        )}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error("API Error: No response received from the server.");
    } else {
      // Something else happened while setting up the request
      console.error("Error during API POST request:", error.message);
      throw new Error(`API Error: ${error.message}`);
    }
  }
}

export default getAPI;
export {postAPI};
