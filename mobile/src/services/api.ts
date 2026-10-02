import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/config";

type RequestOptions = RequestInit & {
  skipAuth?: boolean;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = await AsyncStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined)
  };

  if (token && !options.skipAuth) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  let data: any;

  try {
    data = await response.json();
  } catch {
    data = {
      success: false,
      message: "Server returned an invalid response"
    };
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `HTTP error ${response.status}`
    );
  }

  return data as T;
}

export interface User {
  id: string;
  email: string;
  role?: string;
  role_id?: number;
  created_at?: string;
  is_active?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface Psychologist {
  id: string;
  specialization?: string;
  experience_years?: number;
  education?: string;
  rating?: number;
  about?: string;
  is_verified?: boolean;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url?: string;
  status: string;
  created_at: string;
  category?: string;
  first_name?: string;
  last_name?: string;
}

export const api = {
  health: () =>
    request<{
      success: boolean;
      server: string;
      database: string;
      databaseTime: string;
    }>("/health"),

  getUsers: () =>
    request<{
      success: boolean;
      count: number;
      users: User[];
    }>("/users"),

  register: (payload: {
    email: string;
    password: string;
    first_name: string;
    last_name?: string;
    phone?: string;
  }) =>
    request<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  login: (payload: {
    email: string;
    password: string;
  }) =>
    request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  getPsychologists: () =>
    request<{
      success: boolean;
      count: number;
      psychologists: Psychologist[];
    }>("/psychologists"),

  getArticles: () =>
    request<{
      success: boolean;
      count: number;
      articles: Article[];
    }>("/articles"),

  createLead: (payload: {
    user_id?: string | null;
    source?: string;
  }) =>
    request<{
      success: boolean;
      message: string;
      lead: Record<string, unknown>;
    }>("/leads", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
