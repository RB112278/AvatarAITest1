"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  VoiceEmotion,
  VoiceChatTransport,
  STTProvider,
} from "@heygen/streaming-avatar";

/**
 * Minimal hook for HeyGen Interactive Avatar voice chat integration
 *
 * This hook provides the core functionality needed to:
 * - Initialize the HeyGen SDK
 * - Start/stop avatar sessions
 * - Start/stop voice chat
 * - Handle the video stream
 */
export const useMinimalAvatar = () => {
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch access token from your backend
   */
  const fetchAccessToken = async (): Promise<string> => {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch access token");
      }

      const token = await response.text();
      return token;
    } catch (err) {
      throw new Error(`Token fetch error: ${err}`);
    }
  };

  /**
   * Initialize the HeyGen StreamingAvatar SDK
   */
  const initializeAvatar = useCallback(async () => {
    try {
      const token = await fetchAccessToken();

      avatarRef.current = new StreamingAvatar({
        token,
        basePath: process.env.NEXT_PUBLIC_BASE_API_URL,
      });

      return avatarRef.current;
    } catch (err) {
      setError(`Initialization error: ${err}`);
      throw err;
    }
  }, []);

  /**
   * Start avatar session with voice chat
   */
  const startSession = useCallback(async () => {
    if (isConnecting || isConnected) {
      console.warn("Session already active or connecting");
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Initialize avatar if not already done
      if (!avatarRef.current) {
        await initializeAvatar();
      }

      if (!avatarRef.current) {
        throw new Error("Failed to initialize avatar");
      }

      // Set up event listeners
      avatarRef.current.on(StreamingEvents.STREAM_READY, ({ detail }) => {
        console.log("Stream ready:", detail);
        setStream(detail);
        setIsConnected(true);
        setIsConnecting(false);
      });

      avatarRef.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected");
        setIsConnected(false);
        setIsConnecting(false);
        setStream(null);
      });

      avatarRef.current.on(StreamingEvents.USER_START, () => {
        console.log("User started talking");
      });

      avatarRef.current.on(StreamingEvents.USER_STOP, () => {
        console.log("User stopped talking");
      });

      avatarRef.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
        console.log("Avatar started talking");
      });

      avatarRef.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        console.log("Avatar stopped talking");
      });

      // Configure avatar session for language learning
      await avatarRef.current.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: "Alessandra_ProfessionalLook2_public",
        knowledgeId: "97de19b2f1454591aa01b3cc148c520b",
        voice: {
          rate: 1.0, // Normal speed for clear pronunciation
          emotion: VoiceEmotion.FRIENDLY, // Warm, encouraging tone
        },
        language: "en",
        voiceChatTransport: VoiceChatTransport.WEBSOCKET,
        sttSettings: {
          provider: STTProvider.DEEPGRAM,
        },
      });

      // Start voice chat (unmuted by default for language practice)
      console.log("Starting voice chat...");
      await avatarRef.current.startVoiceChat({
        isInputAudioMuted: false,
      });

      console.log("Avatar session started successfully");
      console.log("Voice chat active - microphone should be listening");
    } catch (err) {
      console.error("Error starting session:", err);
      setError(`Session error: ${err}`);
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, [isConnecting, isConnected, initializeAvatar]);

  /**
   * Stop avatar session and cleanup
   */
  const stopSession = useCallback(async () => {
    try {
      if (avatarRef.current) {
        // Close voice chat
        avatarRef.current.closeVoiceChat();

        // Stop avatar
        await avatarRef.current.stopAvatar();

        // Remove event listeners
        avatarRef.current.off(StreamingEvents.STREAM_READY, () => {});
        avatarRef.current.off(StreamingEvents.STREAM_DISCONNECTED, () => {});

        avatarRef.current = null;
      }

      setStream(null);
      setIsConnected(false);
      setIsConnecting(false);
      setError(null);

      console.log("Avatar session stopped");
    } catch (err) {
      console.error("Error stopping session:", err);
      setError(`Stop error: ${err}`);
    }
  }, []);

  /**
   * Attach stream to video element when available
   */
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch((err) => {
          console.error("Error playing video:", err);
        });
      };
    }
  }, [stream]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (avatarRef.current) {
        stopSession();
      }
    };
  }, [stopSession]);

  return {
    videoRef,
    avatarRef,
    isConnecting,
    isConnected,
    error,
    startSession,
    stopSession,
  };
};
