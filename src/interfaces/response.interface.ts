export interface HttpResponse<T> {
  isSuccess: boolean;
  version: string;
  statusCode: number;
  error?: any;
  result: T | null;
  timestamp: string;
}
