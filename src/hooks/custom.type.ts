import axios from "axios";

export const http = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10_000,
});

export type RequestState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};