"use client";

import { useState, useCallback } from "react";

/**
 * Custom hook for managing localStorage with React state
 * Automatically syncs with localStorage and handles serialization
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.error(`Error loading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage.
    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                // Allow value to be a function so we have same API as useState
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;

                // Only update if value actually changed
                if (JSON.stringify(valueToStore) === JSON.stringify(storedValue)) {
                    return;
                }

                // Save state
                setStoredValue(valueToStore);
                // Save to local storage
                if (typeof window !== "undefined") {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            } catch (error) {
                // A more advanced implementation would handle the error case
                console.error(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue]
    );

    // Function to remove the key from localStorage
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== "undefined") {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
}

/**
 * Hook specifically for AI tool data with materialId scoping
 */
export function useAIToolStorage<T>(
    toolName: string,
    materialId: string,
    initialValue: T
) {
    const key = `ai-tool-${toolName}-${materialId}`;
    return useLocalStorage<T>(key, initialValue);
}

/**
 * Utility to clear all AI tool data for a specific material
 */
export function clearAIToolDataForMaterial(materialId: string) {
    if (typeof window === "undefined") return;

    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
        if (key.includes(`-${materialId}`) && key.startsWith("ai-tool-")) {
            localStorage.removeItem(key);
        }
    });
}

/**
 * Utility to get all cached AI tools for a material
 */
export function getCachedAITools(materialId: string) {
    if (typeof window === "undefined") return {};

    const cached: Record<string, unknown> = {};
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
        if (key.includes(`-${materialId}`) && key.startsWith("ai-tool-")) {
            try {
                const value = localStorage.getItem(key);
                if (value) {
                    const toolName = key.replace(`ai-tool-`, "").replace(`-${materialId}`, "");
                    cached[toolName] = JSON.parse(value);
                }
            } catch (error) {
                console.error(`Error parsing cached data for key "${key}":`, error);
            }
        }
    });

    return cached;
}
