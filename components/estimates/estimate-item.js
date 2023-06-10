import Link from "next/link";
import { User } from "react-feather";

export default function EstimateItem(props) {
  const { id, estimateNumber, status, serviceAddress } = props.item;

  const { name } = props.item.customerDetails;

  const profileLink = `/estimates/${id}:${estimateNumber}`;
  const iconSize = 16;

  return (
    <tr className="align-middle">
      <td>{estimateNumber}</td>
      <td>{name}</td>
      <td>
        {status == "DRAFT" && (
          <span className="badge rounded-pill text-bg-secondary">{status}</span>
        )}

        {status == "FINAL" && (
          <span className="badge rounded-pill text-bg-success">{status}</span>
        )}
      </td>
      <td>{serviceAddress}</td>
      <td className="text-center">
        <Link href={profileLink} className="btn btn-warning btn-sm">
          View Details
        </Link>
      </td>
    </tr>
  );
}
