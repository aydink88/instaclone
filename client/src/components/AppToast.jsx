import { Toast, ToastContainer } from "react-bootstrap";
import { useUIContext } from "../contexts/UIContext";

export default function AppToast() {
  const {
    uiState: { toast },
    setToast,
  } = useUIContext();
  return (
    <ToastContainer position="top-start">
      <Toast
        show={!!toast.message}
        onClose={() => {
          setToast("");
        }}
        delay={3000}
        autohide
        bg={toast.variant}
      >
        <Toast.Header>
          <strong className="me-auto">{toast.title.toLocaleUpperCase()}</strong>
        </Toast.Header>
        <Toast.Body>{toast.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
