import { useEffect, useState } from "react";
import "./Toast.css";

let _setToasts = null;
let _idCounter = 0;

export function showToast(message, type = "info") {
  if (_setToasts) {
    const id = ++_idCounter;
    _setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      _setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }
}

export function showConfirm(message) {
  return new Promise((resolve) => {
    if (_setToasts) {
      const id = ++_idCounter;
      _setToasts((prev) => [...prev, { id, message, type: "confirm", resolve }]);
    } else {
      resolve(window.confirm(message));
    }
  });
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleConfirm = (toast, yes) => {
    dismiss(toast.id);
    toast.resolve(yes);
  };

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) =>
        t.type === "confirm" ? (
          <div key={t.id} className="toast toast-confirm" role="alertdialog">
            <p className="toast-msg">{t.message}</p>
            <div className="toast-confirm-btns">
              <button
                className="btn btn-danger toast-btn"
                onClick={() => handleConfirm(t, true)}
              >
                Delete
              </button>
              <button
                className="btn btn-ghost toast-btn"
                onClick={() => handleConfirm(t, false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            <span className="toast-msg">{t.message}</span>
            <button className="toast-close" onClick={() => dismiss(t.id)} aria-label="Dismiss">
              ✕
            </button>
          </div>
        )
      )}
    </div>
  );
}
