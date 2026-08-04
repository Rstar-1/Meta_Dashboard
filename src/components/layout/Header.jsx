import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../common/Icon";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Map current pathname to display title dynamically
  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/analytics":
        return "Web Analytics";
      case "/management/product":
        return "Products";
      case "/management/cms":
        return "Content Management";
      case "/management/orders":
        return "Orders";
      case "/management/leads":
        return "Leads";
      case "/builder/meta":
        return "SEO Metadata";
      case "/builder/json":
        return "JSON Config";
      case "/management/ai":
        return "AI Integrations";
      case "/users":
        return "System Users";
      case "/customers":
        return "Clients";
      default:
        return "Products";
    }
  };

  return (
    <div className="w-full bg-white bordb">
      <div className="flex items-center justify-between p-12">
        <div className="flex items-center gap-12">
          {/* Back Button */}
          <div
            onClick={() => navigate(-1)}
            className="border-tertiary rounded-5 icon-lg cursor-pointer"
          >
            <Icon name="ChevronLeft" width="20" height="20" stroke="var(--gray)" strokeWidth="2" />
          </div>

          {/* Page Title */}
          <h2 className="mid-text text-secondary font-500">
            {getTitle()}
          </h2>
        </div>

        {/* Right Side: Health Score & Action Buttons */}
        <div className="flex items-center gap-6">
          <div className="border-tertiary rounded-5 bg-forth px-12 py-3 flex items-center gap-8">
            <p className="mini-text text-gray uppercase font-600 tracking-wider">
              Profile Score
            </p>
            {/* Green Dot */}
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--success)", display: "flex", flexShrink: 0 }} />
            <p className="small-text text-success font-700">
              98.6%
            </p>
          </div>

          {/* Help Button */}
          <div className="border-tertiary rounded-5 bg-white p-8 flex items-center justify-center cursor-pointer text-gray hover-text-dark">
            <Icon name="Help" width="14" height="14" strokeWidth="2.5" />
          </div>

          {/* Dark Mode Button */}
          <div className="border-tertiary rounded-5 bg-white p-8 flex items-center justify-center cursor-pointer text-gray hover-text-dark">
            <Icon name="Moon" width="14" height="14" strokeWidth="2.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;