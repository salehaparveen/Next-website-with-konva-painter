import ReactDOM from "react-dom";
import { CheckCircle, XOctagon, Info } from "react-feather";
import cssAttributes from "./notification.module.css";

function Notification(props) {
  const { title, message, status } = props;

  const iconSize = 28;
  let statusClasses = "alert-secondary";
  let statusIcon = <Info size={iconSize} />;

  if (status === "success") {
    statusClasses = "alert-success";
    statusIcon = <CheckCircle size={iconSize} />;
  }

  if (status === "error") {
    statusClasses = "alert-danger";
    statusIcon = <XOctagon size={iconSize} />;
  }

  const cssClasses = `  position-fixed top-50 start-50 translate-middle alert text-center p-4 ${statusClasses}`;
  const backgroundClasses = `position-fixed top-0 start-0 ${cssAttributes.darkBackground}`;

  return ReactDOM.createPortal(
    <div className={backgroundClasses}>
      <div className={cssClasses} role="alert">
        <div className="mb-3">{statusIcon}</div>
        <div>{title}</div>
        <div className="mb-3">{message}</div>
      </div>
    </div>,
    document.getElementById("notifications")
  );
}

export default Notification;
