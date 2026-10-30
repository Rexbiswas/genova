/**
 * Google Identity Services Client Integration for Genova
 */
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number | string;
              locale?: string;
            }
          ) => void;
          prompt: (notification?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean; getNotDisplayedReason: () => string; getSkippedReason: () => string }) => void) => void;
        };
      };
    };
  }
}

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

let scriptLoadingPromise: Promise<boolean> | null = null;

export function loadGoogleScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.google?.accounts?.id) return Promise.resolve(true);

  if (!scriptLoadingPromise) {
    scriptLoadingPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.warn('[GoogleAuth] Failed to load Google Identity Services SDK');
        resolve(false);
      };
      document.head.appendChild(script);
    });
  }

  return scriptLoadingPromise;
}

/**
 * Triggers Google Sign-In using native Google Identity Services popup
 */
export async function triggerGoogleSignIn(
  onSuccess: (credential: string) => void,
  onError?: (err: Error) => void
): Promise<void> {
  if (!GOOGLE_CLIENT_ID) {
    const errorMsg = 'Google Sign-In is not configured yet. Please set VITE_GOOGLE_CLIENT_ID in your .env file.';
    console.warn(`[GoogleAuth] ${errorMsg}`);
    onError?.(new Error(errorMsg));
    return;
  }

  const loaded = await loadGoogleScript();
  if (loaded && window.google?.accounts?.id) {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (response.credential) {
          onSuccess(response.credential);
        } else {
          onError?.(new Error('Google sign-in was cancelled or returned no credentials'));
        }
      },
    });

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback: render and click standard GIS button if OneTap is suppressed
        try {
          const container = document.createElement('div');
          container.style.position = 'fixed';
          container.style.top = '-9999px';
          container.style.left = '-9999px';
          container.style.opacity = '0';
          document.body.appendChild(container);

          window.google!.accounts!.id.renderButton(container, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
          });

          const btn = container.querySelector('div[role="button"]') as HTMLElement | null;
          if (btn) {
            btn.click();
          }
          setTimeout(() => container.remove(), 10000);
        } catch (e) {
          console.warn('[GoogleAuth] Fallback button trigger exception:', e);
        }
      }
    });
    return;
  }

  onError?.(new Error('Unable to initialize Google Identity Services SDK. Please check your internet connection.'));
}
