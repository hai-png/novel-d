import { useCallback } from 'react';
import { Page } from '../types';

/**
 * Centralized navigation utility for robust cross-page navigation
 */
export const useNavigation = () => {
  /**
   * Navigate to home page and scroll to a specific section
   * Uses multiple retry attempts to ensure the section is found after rendering
   */
  const navigateToHomeWithScroll = useCallback((
    onNavigate: (page: Page) => void,
    sectionId: string,
    attempts = 8,
    delayMs = 100,
    initialDelayMs = 150  // Initial delay before first scroll attempt
  ) => {
    // Navigate to home first
    onNavigate('home');

    // Dispatch custom event to signal that navigation has handled scrolling
    window.dispatchEvent(new CustomEvent('navigation-scroll-start'));

    // Track if we've successfully scrolled
    let hasScrolled = false;

    // Function to attempt scrolling to the section
    const scrollToSection = (): boolean => {
      if (hasScrolled) return true;
      
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        hasScrolled = true;
        return true;
      }
      return false;
    };

    // Initial delay to allow page content to render
    setTimeout(() => {
      // Use requestAnimationFrame for better sync with React rendering
      const attemptScroll = (attempt: number) => {
        if (attempt >= attempts || hasScrolled) return;
        
        requestAnimationFrame(() => {
          if (!scrollToSection()) {
            // Try again after delay
            setTimeout(() => {
              attemptScroll(attempt + 1);
            }, delayMs);
          }
        });
      };

      // Start the retry loop
      attemptScroll(0);
    }, initialDelayMs);

    // Final fallback - scroll to top if section not found after all attempts
    setTimeout(() => {
      if (!hasScrolled) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, initialDelayMs + (attempts * delayMs) + 100);
  }, []);

  /**
   * Navigate to home and scroll to services section
   */
  const navigateToServices = useCallback((onNavigate: (page: Page) => void) => {
    navigateToHomeWithScroll(onNavigate, 'services');
  }, [navigateToHomeWithScroll]);

  /**
   * Navigate to home and scroll to contact section
   */
  const navigateToContact = useCallback((onNavigate: (page: Page) => void) => {
    navigateToHomeWithScroll(onNavigate, 'contact');
  }, [navigateToHomeWithScroll]);

  /**
   * Navigate to home and scroll to about section
   */
  const navigateToAbout = useCallback((onNavigate: (page: Page) => void) => {
    navigateToHomeWithScroll(onNavigate, 'about');
  }, [navigateToHomeWithScroll]);

  /**
   * Navigate to home and scroll to process section
   */
  const navigateToProcess = useCallback((onNavigate: (page: Page) => void) => {
    navigateToHomeWithScroll(onNavigate, 'process');
  }, [navigateToHomeWithScroll]);

  /**
   * Navigate to a service page
   */
  const navigateToServicePage = useCallback((
    onNavigate: (page: Page) => void,
    page: Page
  ) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return {
    navigateToHomeWithScroll,
    navigateToServices,
    navigateToContact,
    navigateToAbout,
    navigateToProcess,
    navigateToServicePage,
  };
};
