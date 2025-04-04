/**
 * Replaces the current route based on the current path.
 * @param router - The Next.js Router object.
 */
export const routeReplacer = (router: any): void => {
    const currentPath = window.location.pathname;
  
    if (currentPath === "/") {
      router.replace("/for-you"); // Navigate to "For You" page
    } else if (currentPath.startsWith("/book/")) {
      router.replace(currentPath); // Stay on the current book page
    } else {
      router.replace("/for-you"); // Default fallback
    }
  };