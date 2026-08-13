import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Container from "../common/Container";
import Icon from "../common/Icon";
import Fields from "../common/Fields";
import { menuData } from "../../utils/apiData";

const SidebarLink = ({ to, label, iconName, shortcut, isCollapsed }) => {
    const [hovered, setHovered] = React.useState(false);

    return (
        <NavLink
            to={to}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={({ isActive }) =>
                `flex items-center rounded-5 small-text font-500 list-none ${isCollapsed ? "justify-center py-8" : "justify-between p-8"
                } mb-2 ${isActive ? "bg-forth text-dark" : (hovered ? "bg-forth text-dark" : "text-gray")
                }`
            }
        >
            <div className="flex items-center gap-2">
                {iconName && (
                    <div className="icon relative flex items-center justify-center">
                        <Icon name={iconName} width='16' height='16' />
                    </div>
                )}
                {!isCollapsed && <span>{label}</span>}
            </div>
            {!isCollapsed && shortcut && (
                <p className="py-2 px-5 rounded-5 bg-white border-tertiary text-gray small-text">
                    {shortcut}
                </p>
            )}
        </NavLink>
    );
};

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const { user } = useSelector((state) => state.auth) || {};
    const [profileHovered, setProfileHovered] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    // Clear search query if sidebar gets collapsed
    React.useEffect(() => {
        if (isCollapsed) {
            setSearchQuery("");
        }
    }, [isCollapsed]);

    const displayRole = user?.role || user?.roleId?.name || "admin";
    const userRole = displayRole.toLowerCase() === "manager" ? "admin" : displayRole;

    // Filter menu items based on the user's role and search query
    const filteredMenu = React.useMemo(() => {
        // First filter by user role
        const roleFiltered = menuData.map(item => {
            const isItemAllowed = !item.role || item.role.some(r => String(r).toLowerCase() === String(userRole).toLowerCase());
            if (!isItemAllowed) return null;

            if (item.category && item.category.length > 0) {
                const allowedSubcategories = item.category.filter(subItem => 
                    !subItem.role || subItem.role.some(r => String(r).toLowerCase() === String(userRole).toLowerCase())
                );
                if (allowedSubcategories.length === 0) return null;
                return {
                    ...item,
                    category: allowedSubcategories
                };
            }
            return item;
        }).filter(Boolean);

        if (!searchQuery.trim()) return roleFiltered;
        const query = searchQuery.toLowerCase();

        return roleFiltered
            .map((item) => {
                const hasSubcategories = item.category && item.category.length > 0;
                if (!hasSubcategories) {
                    const matches = item.name.toLowerCase().includes(query);
                    return matches ? item : null;
                }

                // Filter nested subcategories
                const filteredSubcategories = item.category.filter((subItem) =>
                    subItem.name.toLowerCase().includes(query)
                );

                const categoryMatches = item.name.toLowerCase().includes(query);

                if (categoryMatches || filteredSubcategories.length > 0) {
                    return {
                        ...item,
                        // If parent matches but no subcategories matched, show all.
                        // Otherwise, show only the matching subcategories.
                        category: filteredSubcategories.length > 0 ? filteredSubcategories : item.category
                    };
                }

                return null;
            })
            .filter(Boolean);
    }, [searchQuery, userRole]);

    const userAvatar = user?.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120";
    const userName = user?.fullname || "Sandra Marx";
    const userMobile = user?.mobile || "9807654123";

    return (
        <Container version="v0" className="h-100 bg-white overflow-auto">
            {/* Header */}
            <div className={`pt-16 pb-10 flex items-center ${isCollapsed ? "justify-center px-8" : "justify-between px-16"}`}>
                <div className="flex items-center gap-8">
                    <div
                        className="bg-secondary icon-lg rounded-5 cursor-pointer"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        <p className="text-white font-500 headpara-text">A</p>
                    </div>
                    {!isCollapsed && (
                        <div>
                            <h3 className="headmini-text text-secondary font-600 uppercase">Ashmita Vinyls</h3>
                            <p className="mini-text text-gray capitalize">{displayRole}</p>
                        </div>
                    )}
                </div>
                {!isCollapsed && (
                    <div className="text-gray cursor-pointer" onClick={() => setIsCollapsed(true)}>
                        <Icon name="ChevronsUpDown" width="14" height="14" strokeWidth="2.5" />
                    </div>
                )}
            </div>

            {/* Search Bar / Icon */}
            <div className={isCollapsed ? "px-8 pb-12 flex justify-center" : "px-16 pb-12"}>
                {isCollapsed ? (
                    <div className="icon flex items-center justify-center bg-forth rounded-5 cursor-pointer p-6" onClick={() => setIsCollapsed(false)}>
                        <Icon name="Search" width="16" height="16" stroke="var(--primary)" strokeWidth="2.5" />
                    </div>
                ) : (
                    <Fields
                        type="input"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={setSearchQuery}
                        icon="Search"
                        iconPosition="right"
                        outline={false}
                        style={{ backgroundColor: "var(--forth)", border: "none" }}
                    />
                )}
            </div>

            {/* Navigation Links */}
            <div className={`overflow-auto ${isCollapsed ? "px-8" : "px-16"}`}>
                {filteredMenu.map((item, idx) => {
                    if (!item.status) return null;

                    if (!item.route && item.category && item.category.length > 0) {
                        return (
                            <React.Fragment key={idx}>
                                {!isCollapsed ? (
                                    <div className="flex items-center justify-between mt-10 mb-8">
                                        <p className="mini-text text-gray font-600">{item.name}</p>
                                    </div>
                                ) : (
                                    <hr className="border-0 bg-tertiary mt-12 mb-10" style={{ height: '1px' }} />
                                )}
                                {item.category.map((subItem, subIdx) => {
                                    if (!subItem.status) return null;
                                    return (
                                        <SidebarLink
                                            key={subIdx}
                                            to={subItem.route}
                                            label={subItem.name}
                                            iconName={subItem.icon}
                                            isCollapsed={isCollapsed}
                                        />
                                    );
                                })}
                            </React.Fragment>
                        );
                    }
                    const shortcut = item.name === "Dashboard" ? "⌘" : null;

                    return (
                        <SidebarLink
                            key={idx}
                            to={item.route}
                            label={item.name}
                            iconName={item.icon}
                            shortcut={shortcut}
                            isCollapsed={isCollapsed}
                        />
                    );
                })}
            </div>

            {/* Profile Footer */}
            <div className={`bg-white mt-5 ${isCollapsed ? "px-8" : "px-16"}`}>
                <hr className="border-0 bg-tertiary" style={{ height: '1px' }} />
                <NavLink
                    to="/profile"
                    onMouseEnter={() => setProfileHovered(true)}
                    onMouseLeave={() => setProfileHovered(false)}
                    className={`flex items-center rounded-5 ${profileHovered ? "bg-forth" : ""} ${isCollapsed ? "justify-center p-6" : "justify-between p-10"
                        }`}
                >
                    <div className="flex items-center gap-8">
                        <img
                            src={userAvatar}
                            alt={userName}
                            className="rounded-full common-img object-cover"
                            style={{ width: "36px", height: "36px", borderRadius: "50%" }}
                        />
                        {!isCollapsed && (
                            <div>
                                <h4 className="headmini-text text-dark font-600 capitalize">{userName}</h4>
                                <p className="mini-text text-gray">{userMobile}</p>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="text-gray">
                            <Icon name="ChevronsUpDown" width="14" height="14" strokeWidth="2.5" />
                        </div>
                    )}
                </NavLink>
            </div>
        </Container>
    );
};

export default Sidebar;