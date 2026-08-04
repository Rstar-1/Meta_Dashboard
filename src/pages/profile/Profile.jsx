import React from "react";
import { useSelector } from "react-redux";
import FormBuilder from "../../components/common/FormBuilder";

const Profile = () => {
  const { user } = useSelector((state) => state.auth) || {};

  // Form fields mapping the values from user state or falling back to the screenshot mockup
  const fields = [
    { name: "fullname", type: "text", label: "Full Name", defaultValue: user?.fullname || user?.name || "raj shetye", readOnly: true, style: { backgroundColor: "#f8fafc", color: "#475569" } },
    { name: "email", type: "text", label: "Email Address", defaultValue: user?.email || "akib@gmail.com", readOnly: true, style: { backgroundColor: "#f8fafc", color: "#475569" } },
    { name: "mobile", type: "text", label: "Phone Number", defaultValue: user?.mobile || user?.phone || "8907654321", readOnly: true, style: { backgroundColor: "#f8fafc", color: "#475569" } },
    { name: "role", type: "text", label: "Role (Read-only)", defaultValue: user?.role || "vendor", readOnly: true, style: { backgroundColor: "#f8fafc", color: "#475569" } },
    { name: "status", type: "text", label: "Account Status (Read-only)", defaultValue: user?.status || "Active", readOnly: true, style: { backgroundColor: "#f8fafc", color: "#475569" } },
    { name: "otpStatus", type: "text", label: "OTP Verification Status (Read-only)", defaultValue: user?.otpVerified || (user?.isOtpVerified ? "Verified" : "Verified"), readOnly: true, style: { backgroundColor: "#f8fafc", color: "#475569" } },
    { name: "createdAt", type: "text", label: "Account Created At (Read-only)", defaultValue: user?.createdAt || "2026-08-03, 10:45:21 AM", readOnly: true, style: { backgroundColor: "#f8fafc", color: "#475569" } },
    { name: "lastLogin", type: "text", label: "Last Login Time (Read-only)", defaultValue: user?.lastLogin || "2026-08-03, 10:45:32 AM", readOnly: true, style: { backgroundColor: "#f8fafc", color: "#475569" } }
  ];

  return (
    <>
      <style>{`
        .profile-container {
          padding: 24px;
          background-color: #f8fafc;
          min-height: calc(100vh - 70px);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          font-family: 'Outfit', 'Inter', sans-serif;
        }
        .profile-card-new {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 36px;
          width: 100%;
          max-width: 960px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .profile-title-container {
          margin-bottom: 28px;
          position: relative;
        }
        .profile-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          padding-bottom: 8px;
        }
        .profile-title-underline {
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 50px;
          height: 3px;
          background-color: #4f46e5;
          border-radius: 2px;
        }
      `}</style>

      <div className="profile-container">
        <div className="profile-card-new">
          <div className="profile-title-container">
            <h3 className="profile-title">Personal Information</h3>
            <span className="profile-title-underline"></span>
          </div>

          <FormBuilder
            fields={fields}
            col="2"
            buttonClassName="hidden"
            onSubmit={() => { }}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
