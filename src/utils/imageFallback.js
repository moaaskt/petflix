/**
 * Image Fallback Constants
 * 
 * Provides elegant fallback images for broken or missing content images.
 */

// Fallback image for movie/series posters (vertical aspect ratio)
export const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1560160990-2e805565d7c4?auto=format&fit=crop&w=800&q=80';

// Fallback image for hero banners (horizontal aspect ratio)
export const FALLBACK_HERO = 'https://images.unsplash.com/photo-1574267432644-f74f8ec55100?auto=format&fit=crop&w=1920&q=80';

/**
 * Handle image load error by setting fallback
 * @param {Event} e - Image error event
 * @param {string} fallbackUrl - URL of fallback image
 */
export const handleImageError = (e, fallbackUrl) => {
    // Prevent infinite loop if fallback also fails
    if (e.target.src !== fallbackUrl) {
        e.target.src = fallbackUrl;
        e.target.onerror = null; // Remove error handler to prevent loop
    }
};
