import Link from "next/link";
export default function EmployeePageHeader(props) {
  const { pageHeader } = props;

  return (
    <div className="container">
      {pageHeader.overTitle && (
        <div className="row mb-3">
          <div className="col">
            <div className="d-inline-block p-2 me-3 text-bg-dark">
              {pageHeader.overTitle}
            </div>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-auto me-auto d-flex align-items-center">
          <h4 className="mb-0">{pageHeader.title}</h4>
          {pageHeader.statusPill && (pageHeader.statusPill == 'active') && (
             <span className="ms-3 badge rounded-pill text-bg-success text-uppercase">
             {pageHeader.statusPill}
           </span>
          ) }
          {pageHeader.statusPill && (pageHeader.statusPill !== 'active') && (
             <span className="ms-3 badge rounded-pill text-bg-warning text-uppercase">
             {pageHeader.statusPill}
           </span>
          ) }
        </div>
        {pageHeader.buttons && (
          <div className="col-auto">
            {pageHeader.buttons.map((action, i) => {
              let btnColor = `btn btn-small me-2 ${action.btnClassName}`;
              return (
                <button
                key={i}
                  type="button"
                  className={btnColor}
                  onClick={(e) =>
                    action.btnAction(action.btnTitle, action.btnActionId)
                  }
                >
                  {action.btnTitle}
                </button>
              );
            })}
          </div>
        )}

        {/* {pageHeader.action && action.length > 0 && (
          <div className="col-auto">
            <Link
              href="/customers"
              className="btn btn-outline-secondary me-2 btn-sm"
            >
              <ArrowLeft size={iconSize} className="me-1" />
              Back
            </Link>
            <Link
              href={editProfileLink}
              className="btn btn-warning me-2 btn-sm"
            >
              <Edit size={iconSize} className="me-1" />
              Edit Profile
            </Link>
            <Link
              href={newEstimateLink}
              className="btn btn-success me-2 btn-sm"
            >
              <FileText size={iconSize} className="me-1" />
              New Estimate
            </Link>
            <Link href={deleteCustomerLink} className={btnDisabledClass}>
              <X size={iconSize} className="me-1" />
              Delete Customer
            </Link>
          </div>
        )} */}
      </div>

      <div className="row">
        <div className="col">
          <hr />
        </div>
      </div>
    </div>
  );
}
