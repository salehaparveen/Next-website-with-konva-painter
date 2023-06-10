import { useSession } from "next-auth/react";
import Link from "next/link";

export default function EmployeeItem(props) {
  const {
    id,
    firstName,
    lastName,
    email,
    roleDescription,
    active,
    initialPassword,
  } = props.item;

  const fullName = `${firstName} ${lastName}`;

  const profileLink = `/employees/profile/${id}`;

  let activeLabelColor = "text-bg-success";
  let activeLabelText = "ACTIVE";

  const { data: session, status } = useSession();

  if (!active) {
    activeLabelColor = "text-bg-warning";
    activeLabelText = "INACTIVE";
  }

  const activePillBadge = `badge rounded-pill ${activeLabelColor}`;

  return (
    <tr className="align-middle" key={id}>
      <td>
        {session.user.email == email ? (
          <div>
            {fullName}
            <span className="ms-2 badge rounded-pill text-bg-info">YOU</span>
          </div>
        ) : (
          <Link href={profileLink} className="link-primary">
            {fullName}
          </Link>
        )}
      </td>
      <td>{email}</td>
      <td>{roleDescription}</td>
      <td>
        <span className={activePillBadge}>{activeLabelText}</span>
        {initialPassword && (
          <span className="ms-2 badge rounded-pill text-bg-warning">
            REQUIRES LOGIN
          </span>
        )}
      </td>
      {/* <td className="text-center">
        <Link href={profileLink} className="btn btn-primary btn-sm me-2">
        <Edit size={iconSize} className="me-1" />Manage
        </Link>
      </td> */}
    </tr>
  );
}
