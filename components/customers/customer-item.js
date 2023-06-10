import Link from "next/link";
import {User} from 'react-feather';
import { formatPhoneNumber } from "../../utils/functions";

export default function CustomerItem(props) {
  const {
    id,
    firstname,
    lastname,
    email,
    phone,
    serviceAddress
  } = props.item;
  

  const fullName = `${firstname} ${lastname}`;

  const profileLink = `/customers/profile/${id}`;
  const iconSize = 16;

  return (
    <tr className="align-middle" key={id}>
      <td>{fullName}</td>
      <td>{email}</td>
      <td>{formatPhoneNumber(phone)}</td>
      <td>
        {serviceAddress && serviceAddress.items.map((item, i)=> (
          <div key={i}>
            <p><b>Address #{i+1}</b>
            <br />
            {item.street} {item.city}, {item.addressState} {item.zipcode}
            </p>
          </div>
        ))}
      </td>
      <td className="text-center">
        <Link href={profileLink} className="btn btn-primary btn-sm me-2">
        <User size={iconSize} className="me-1" />View Profile
        </Link>
      </td>
    </tr>
  );
}
