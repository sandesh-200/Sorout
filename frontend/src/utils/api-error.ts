import axios from "axios"

export function getApiErrorMessage(
    error: unknown,
    fallback = "Something went wrong. Please try again."
): string {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.message ??
            error.response?.data?.detail ??
            error.message ??
            fallback
        )
    }

    if (error instanceof Error) {
        return error.message
    }

    return fallback
}