 export type AppResponse<T> = {
  success: boolean;
  status_code: number;
  message: string;
  data: T | null;
  error_code?: string;
};