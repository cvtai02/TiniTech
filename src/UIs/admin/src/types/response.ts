export interface Response<T> {
  data: ResponseBody<T>;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface ResponseBody<T> {
  title: string;
  status: number;
  detail: string;
  data: T;
  error?: any;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: any;
}
