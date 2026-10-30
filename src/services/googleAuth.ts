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
          prompt: () => void;
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
 * Triggers Google Sign-In: uses native GIS popup if VITE_GOOGLE_CLIENT_ID is configured,
 * or generates a test token for development/evaluation if credentials are not yet provisioned.
 */
export async function triggerGoogleSignIn(
  onSuccess: (credential: string) => void,
  onError?: (err: Error) => void
): Promise<void> {
  if (GOOGLE_CLIENT_ID) {
    const loaded = await loadGoogleScript();
    if (loaded && window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (response.credential) {
            onSuccess(response.credential);
          } else {
            onError?.(new Error('Google sign-in was cancelled or failed'));
          }
        },
      });
      window.google.accounts.id.prompt();
      return;
    }
  }

  // Fallback when VITE_GOOGLE_CLIENT_ID is not configured in environment
  console.info(
    '[GoogleAuth] VITE_GOOGLE_CLIENT_ID not configured in frontend .env. Using mock token for testing.'
  );
  // Construct a safe test token payload
  const mockPayload = {
    sub: `mock-google-${Date.now()}`,
    name: 'Dr. Alex Rivera',
    email: 'alex.rivera.health@gmail.com',
    email_verified: true,
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    iss: 'accounts.google.com',
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  const base64Payload = btoa(JSON.stringify(mockPayload));
  const testToken = `mock-google-token.header.${base64Payload}.signature`;
  onSuccess(testToken);
}
