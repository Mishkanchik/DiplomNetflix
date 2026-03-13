import api from "./Api";

export const deleteMyProfile = async () => {
  try {
    const response = await api.post(
      "/users/profile/delete-account",
      {},
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
