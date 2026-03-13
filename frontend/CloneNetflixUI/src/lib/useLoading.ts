// src/hooks/useLoading.ts
import { useLoader } from "../components/GlobalLoader";

export const useLoading = () => {
    const { showLoader, hideLoader } = useLoader();

    const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
        showLoader();
        try {
            return await fn();
        } finally {
            hideLoader();
        }
    };

    return { withLoading };
};