import * as WebBrowser from "expo-web-browser";
import { AuthRequest, makeRedirectUri } from "expo-auth-session";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../firebase.config";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

const API_BASE_URL = process.env.EXPO_BASE_URL;
const WEB_CLIENT_ID =
  process.env.EXPO_GOOGLE_WEB_CLIENT_ID ||
  "357562099421-3arlng9efmu9j1o2m44e6tg8ov8tpni6.apps.googleusercontent.com";
const IOS_CLIENT_ID =
  process.env.IOS_CLIENT_ID ||
  "357562099421-ts15vf1jhev5bfuk8ntuv7d61c7o6vbb.apps.googleusercontent.com";
const ANDROID_CLIENT_ID =
  process.env.ANDROID_CLIENT_ID ||
  "357562099421-rpj2ujttvq112g0qmu3d37kkdqn1pi1d.apps.googleusercontent.com";

if (!WEB_CLIENT_ID || !IOS_CLIENT_ID || !ANDROID_CLIENT_ID) {
  throw new Error("Google Client IDs are not set in environment variables.");
}

export type SocialAuthResponse = {
  message: string;
  user: any;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export async function signInWithGoogle(role: "user" | "doctor" = "user") {
  try {
    const redirectUri = makeRedirectUri();
    console.log("Redirect URI:", redirectUri);

    const discovery = {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
    };

    // 👇 Use Implicit Flow (token response type)
    const authRequest = new AuthRequest({
      clientId: WEB_CLIENT_ID,
      redirectUri,
      scopes: ["profile", "email"],
      responseType: "token", // ✅ Fix for code_challenge_method error
    });

    const result = await authRequest.promptAsync(discovery);

    if (result.type !== "success" || !result.authentication?.accessToken) {
      console.log("Google Sign-In canceled or failed");
      return null;
    }

    const { accessToken } = result.authentication;
    const credential = GoogleAuthProvider.credential(null, accessToken);
    const userCredential = await signInWithCredential(auth, credential);

    const firebaseUser = userCredential.user;
    const firebaseIdToken = await firebaseUser.getIdToken();

    const responseBackend = await fetch(`${API_BASE_URL}/api/v1/auth/social`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: firebaseIdToken, role }),
    });

    if (!responseBackend.ok) {
      const err = await responseBackend.json();
      throw new Error(err.message);
    }

    const authResponse = await responseBackend.json();
    return authResponse;
  } catch (error) {
    console.error("Google Sign-In error:", error);
    await auth.signOut();
    return null;
  }
}