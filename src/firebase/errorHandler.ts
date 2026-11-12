export type OperationType = 'create' | 'read' | 'update' | 'delete' | 'list';

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  status: number;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): FirestoreErrorInfo {
  let message = 'An unexpected Firestore error occurred.';
  let status = 500;

  if (error && typeof error === 'object' && 'code' in error) {
    const fbError = error as { code: string; message: string };
    switch (fbError.code) {
      case 'permission-denied':
        message = `Permission denied for ${operationType} on path: ${path || 'unknown'}. Verify your user role and authentication.`;
        status = 403;
        break;
      case 'not-found':
        message = `Document not found at path: ${path || 'unknown'}.`;
        status = 404;
        break;
      case 'already-exists':
        message = `Document already exists at path: ${path || 'unknown'}.`;
        status = 409;
        break;
      case 'unauthenticated':
        message = `You must be authenticated to perform ${operationType} on ${path || 'collection'}.`;
        status = 401;
        break;
      case 'resource-exhausted':
        message = 'Quota exceeded or database rate limit hit.';
        status = 429;
        break;
      default:
        message = fbError.message || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  const errorInfo: FirestoreErrorInfo = {
    error: message,
    operationType,
    path,
    status
  };

  console.error('[HEMORA Firestore Error]', errorInfo, error);
  return errorInfo;
}
