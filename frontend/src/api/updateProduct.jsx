import { BASE_URL } from "../constants/baseUrl";


export const updateProduct = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating Product:", error);
    throw error;
  }
};