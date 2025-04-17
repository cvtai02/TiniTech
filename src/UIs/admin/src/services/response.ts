export interface Response<T> {
  title: string;
  status: number;
  detail: string;
  data: T;
  error?: any;
}
