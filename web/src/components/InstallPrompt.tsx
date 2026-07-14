import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for beforeinstallprompt event (Android)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setShowPrompt(false);
      }

      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(135deg, #0B1F3A 0%, #2E7D32 100%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.2)",
        padding: "16px",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flex: 1,
          color: "white",
        }}
      >
        <Download size={20} strokeWidth={2} />
        <div>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>
            Install CownIt
          </div>
          <div style={{ fontSize: "12px", opacity: 0.9 }}>
            Add to your home screen for quick access
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={handleInstall}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "white",
            color: "#0B1F3A",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "none",
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

export default InstallPrompt;
