<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        // Handle API requests with JSON responses
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->handleApiException($request, $exception);
        }

        return parent::render($request, $exception);
    }

    /**
     * Handle API exceptions with standardized JSON responses.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleApiException(Request $request, Throwable $exception): JsonResponse
    {
        $statusCode = $this->getStatusCode($exception);
        $message = $this->getMessage($exception);
        $errors = [];

        // Handle validation exceptions
        if ($exception instanceof ValidationException) {
            $errors = $exception->errors();
            $message = 'Les données fournies ne sont pas valides.';
        }

        // Handle authentication exceptions
        if ($exception instanceof AuthenticationException) {
            $message = 'Non authentifié.';
        }

        // Handle model not found exceptions
        if ($exception instanceof ModelNotFoundException) {
            $message = 'Ressource non trouvée.';
        }

        // Handle method not allowed exceptions
        if ($exception instanceof MethodNotAllowedHttpException) {
            $message = 'Méthode non autorisée pour cette ressource.';
        }

        // Handle too many requests exceptions
        if ($exception instanceof TooManyRequestsHttpException) {
            $message = 'Trop de requêtes. Veuillez réessayer plus tard.';
        }

        // Log the exception
        if ($statusCode >= 500) {
            \Log::error('API Exception', [
                'exception' => get_class($exception),
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString(),
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'user_id' => auth()->id(),
            ]);
        }

        $response = [
            'success' => false,
            'message' => $message,
            'status_code' => $statusCode,
        ];

        // Add errors if validation failed
        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        // Add debug information in development
        if (config('app.debug')) {
            $response['debug'] = [
                'exception' => get_class($exception),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString(),
            ];
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Get the HTTP status code for the exception.
     *
     * @param  \Throwable  $exception
     * @return int
     */
    protected function getStatusCode(Throwable $exception): int
    {
        if ($exception instanceof HttpException) {
            return $exception->getStatusCode();
        }

        if ($exception instanceof ValidationException) {
            return Response::HTTP_UNPROCESSABLE_ENTITY;
        }

        if ($exception instanceof AuthenticationException) {
            return Response::HTTP_UNAUTHORIZED;
        }

        if ($exception instanceof ModelNotFoundException) {
            return Response::HTTP_NOT_FOUND;
        }

        if ($exception instanceof NotFoundHttpException) {
            return Response::HTTP_NOT_FOUND;
        }

        if ($exception instanceof MethodNotAllowedHttpException) {
            return Response::HTTP_METHOD_NOT_ALLOWED;
        }

        if ($exception instanceof TooManyRequestsHttpException) {
            return Response::HTTP_TOO_MANY_REQUESTS;
        }

        return Response::HTTP_INTERNAL_SERVER_ERROR;
    }

    /**
     * Get the message for the exception.
     *
     * @param  \Throwable  $exception
     * @return string
     */
    protected function getMessage(Throwable $exception): string
    {
        // Use the exception's message if it's not empty
        if (!empty($exception->getMessage())) {
            return $exception->getMessage();
        }

        // Default messages based on status code
        $statusCode = $this->getStatusCode($exception);

        return match ($statusCode) {
            Response::HTTP_BAD_REQUEST => 'Requête incorrecte.',
            Response::HTTP_UNAUTHORIZED => 'Non authentifié.',
            Response::HTTP_FORBIDDEN => 'Accès interdit.',
            Response::HTTP_NOT_FOUND => 'Ressource non trouvée.',
            Response::HTTP_METHOD_NOT_ALLOWED => 'Méthode non autorisée.',
            Response::HTTP_UNPROCESSABLE_ENTITY => 'Les données fournies ne sont pas valides.',
            Response::HTTP_TOO_MANY_REQUESTS => 'Trop de requêtes. Veuillez réessayer plus tard.',
            Response::HTTP_INTERNAL_SERVER_ERROR => 'Erreur interne du serveur.',
            default => 'Une erreur est survenue.',
        };
    }
}
