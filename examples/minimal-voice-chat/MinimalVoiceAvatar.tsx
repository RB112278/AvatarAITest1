"use client";

import React, { useEffect } from "react";
import { useMinimalAvatar } from "./useMinimalAvatar";

/**
 * Minimal Voice Chat Component
 *
 * A clean, simple example of HeyGen Interactive Avatar integration
 * focused on voice-only language learning interactions.
 *
 * Features:
 * - Auto-starts voice chat on load
 * - Video display of avatar
 * - Connection status
 * - Stop button when active
 */
export const MinimalVoiceAvatar: React.FC = () => {
  const { videoRef, isConnecting, isConnected, error, startSession, stopSession, avatarRef } =
    useMinimalAvatar();

  // Auto-start session when component mounts (only once)
  useEffect(() => {
    startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array = run only once on mount

  // Send greeting when avatar connects
  useEffect(() => {
    if (isConnected && avatarRef.current) {
      // Small delay to ensure voice chat is fully ready
      const timer = setTimeout(() => {
        avatarRef.current?.speak({
          text: "Hello! I'm Alessandra, your language learning partner. I'm here to help you practice and improve your language skills. What would you like to work on today?",
          taskType: "talk" as any,
          taskMode: "async" as any,
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isConnected, avatarRef]);

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={styles.video}
        >
          <track kind="captions" />
        </video>

        {/* Connection Status Overlay */}
        {isConnecting && (
          <div style={styles.overlay}>
            <div style={styles.statusText}>Connecting...</div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div style={styles.errorOverlay}>
            <div style={styles.errorText}>Error: {error}</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        {isConnected && (
          <button onClick={stopSession} style={styles.stopButton}>
            Stop Session
          </button>
        )}
      </div>
    </div>
  );
};

// Minimal inline styles - replace with your own design system
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  videoContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: "9 / 16", // Vertical/portrait orientation
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  statusText: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "500",
  },
  placeholderText: {
    color: "#999999",
    fontSize: "16px",
    textAlign: "center",
    padding: "0 20px",
  },
  errorOverlay: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    right: "20px",
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    padding: "12px",
    borderRadius: "8px",
  },
  errorText: {
    color: "#ffffff",
    fontSize: "14px",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    gap: "12px",
  },
  startButton: {
    padding: "14px 32px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#3b82f6",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  stopButton: {
    padding: "14px 32px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#ef4444",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  disabledButton: {
    padding: "14px 32px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#999999",
    backgroundColor: "#333333",
    border: "none",
    borderRadius: "8px",
    cursor: "not-allowed",
  },
  infoText: {
    marginTop: "24px",
    textAlign: "center",
  },
  infoTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  infoDescription: {
    fontSize: "14px",
    color: "#666666",
    lineHeight: "1.5",
  },
};
