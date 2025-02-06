const authHelper = {
  getUrlParamValue(paramName: string) {
    return new URLSearchParams(window.location.search).get(paramName);
  },
  getParamFromCookies: (paramName: string) => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(row => row.startsWith(paramName));
    return cookie ? cookie.split('=')[1] : null;
  },
  generateCodeVerifier: (length: number) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    localStorage.setItem("verifier", text);
    return text;
  },
  generateCodeChallenge: async (codeVerifier: string) => {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
  },
  getAccessToken: (): string | null => {
    const token = localStorage.getItem("access_token");
    return token || null;
  },
  getRefreshToken: (): string | null => {
    const token = localStorage.getItem("refresh_token");
    return token || null;
  },
  removeCodeFromUrl: (searchParams: URLSearchParams, replaceUrl: (url: string) => void) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { code, ...restParams } = Object.fromEntries(searchParams.entries());
    const newSearchParams = new URLSearchParams(restParams);
    replaceUrl(`${window.location.pathname}?${newSearchParams.toString()}`);
  }
}

export const { 
  getUrlParamValue, 
  getParamFromCookies,
  generateCodeVerifier, 
  generateCodeChallenge,
  getAccessToken,
  removeCodeFromUrl
} = authHelper;