export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const createResponse = <T>(
  data: T,
  message?: string,
  meta?: ApiResponse<T>['meta']
): ApiResponse<T> => ({
  success: true,
  data,
  ...(message && { message }),
  ...(meta && { meta }),
});

export const createErrorResponse = (message: string): { success: boolean; message: string } => ({
  success: false,
  message,
});
