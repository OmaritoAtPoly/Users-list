import axios from "axios";

export const toMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response
      ? `Request failed with status ${error.response.status}`
      : "Network error. Please try again.";
  }
  return "Unexpected error. Please try again.";
};