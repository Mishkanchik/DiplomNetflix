// IMPORTANT: This file is a reference for the fix needed in LanguageContext.tsx
// 
// The original LanguageContext.tsx file has duplicate keys in the 'en' translations object
// which causes TypeScript compilation errors:
// - Error TS1117: An object literal cannot have multiple properties with the same name
// 
// Duplicate keys found (lines 393-414 approximately):
// - 'series.top_rated': 'Top Rated Series' (appears twice)
// - 'cartoons.top': 'Top Cartoons' (appears twice)
// - 'filter.clear': 'Clear' (appears twice)
// - 'favorites.*' keys appear twice
// - 'watch_later.*' keys appear twice
// 
// TO FIX: Remove the second occurrence of these duplicate entries from the 'en' object.
// Keep only the first occurrence of each key.
// 
// This is a temporary file. After fixing the main LanguageContext.tsx, delete this file.
