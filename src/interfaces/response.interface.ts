export interface HttpResponse<T> {
  isSuccess: boolean;
  version: string;
  statusCode: number;
  error: null;
  result: T | null;
  timestamp: string;
}
