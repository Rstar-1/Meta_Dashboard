import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "../common/Container";
import Button from "../common/Button";
import Tab from "../common/Tab";
import Icon from "../common/Icon";
import { menuData } from "../../utils/apiData";

// Category list item with CSS hover & active states
const CategoryItem = ({ cat, selectedItem, onClick, isCollapsed }) => {
    const isActive = selectedItem === cat.name;
    return (
        <div
            onClick={onClick}
            className={`flex items-center rounded-5 cursor-pointer ${isCollapsed ? "justify-center py-12" : "justify-between p-10"
                } ${isActive ? "bg-forth text-dark font-600" : "text-gray font-500"}`}
            title={isCollapsed ? cat.name : ""}
        >
            <div className="flex items-center gap-8">
                <div
                    className="flex items-center justify-center rounded-5"
                    style={{ backgroundColor: cat.color || "#1e74db", width: 25, height: 25 }}
                >
                    {cat.icon ? (
                        <Icon name={cat.icon} width="14" height="14" stroke="#ffffff" strokeWidth="2.5" />
                    ) : (
                        <p className="small-text text-white font-400">{cat.name.charAt(0).toUpperCase()}</p>
                    )}
                </div>
                {!isCollapsed && <p className="small-text">{cat.name}</p>}
            </div>
            {!isCollapsed && typeof cat.count === "number" && (
                <p className={`mini-text ${isActive ? "text-secondary font-500" : "text-gray"}`}>
                    {cat.count.toLocaleString()}
                </p>
            )}
        </div>
    );
};

const Structure = ({
    sidebarTitle = "Categories",
    sidebarItems = [],
    selectedSidebarItem = "",
    onSidebarItemClick = () => { },
    headerIcon,
    headerTitle,
    headerSub,
    quickAction,
    showTabControls = true,
    tabs = [],
    activeTab = "",
    onTabChange = () => { },
    filterDescription = "",
    hasActiveFilters = false,
    onClearAllFilters = () => { },
    filterInputs = null,
    children
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Flatten menuData category sub-items to generate default sidebar links
    const defaultSidebarItems = [];
    menuData.forEach(group => {
        if (group.category) {
            group.category.forEach(sub => {
                if (sub.status) {
                    defaultSidebarItems.push({
                        name: sub.name,
                        route: sub.route,
                        icon: sub.icon,
                        color: sub.name === "Products" ? "#1e74db" :
                            sub.name === "CMS" ? "#10b981" :
                                sub.name === "Leads" ? "#f59e0b" :
                                    sub.name === "SEO Metadata" ? "#8b5cf6" :
                                        sub.name === "System Users" ? "#6366f1" : "#1e74db"
                    });
                }
            });
        }
    });

    const isUsingDefault = !sidebarItems || sidebarItems.length === 0;
    const resolvedItems = isUsingDefault ? defaultSidebarItems : sidebarItems;

    // Detect selected item by matching route if using defaults
    const resolvedSelectedItem = isUsingDefault
        ? (defaultSidebarItems.find(item => item.route === location.pathname)?.name || "")
        : selectedSidebarItem;

    const handleItemClick = (item) => {
        if (isUsingDefault) {
            navigate(item.route);
        } else {
            onSidebarItemClick(item.name);
        }
    };

    return (
        <Container version="v0">
            <div className="flex w-full items-start">
                {/* Left Sidebar */}
                <div
                    className={`${isSidebarCollapsed ? "w-5" : "w-20"} bg-white p-10 bordr sticky top-0 h-page overflow-hidden`}
                    style={{
                        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        flexShrink: 0,
                        minWidth: isSidebarCollapsed ? 60 : 240
                    }}
                >
                    <div className={`flex items-center mt-6 mb-12 ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
                        {!isSidebarCollapsed && <p className="small-text text-dark font-500 uppercase">{sidebarTitle}</p>}
                        <Button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            bg="forth"
                            color="gray"
                            colorHover="dark"
                            version="icon"
                            icon={isSidebarCollapsed ? "ChevronRight" : "ChevronLeft"}
                            title={`${isSidebarCollapsed ? "Expand" : "Collapse"} ${sidebarTitle}`}
                        />
                    </div>

                    {/* Sidebar Items */}
                    <div className="grid-cols-1 gap-4">
                        {resolvedItems.map((item, idx) => (
                            <CategoryItem
                                key={idx}
                                cat={item}
                                selectedItem={resolvedSelectedItem}
                                onClick={() => handleItemClick(item)}
                                isCollapsed={isSidebarCollapsed}
                            />
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div
                    className={isSidebarCollapsed ? "w-95" : "w-80"}
                    style={{ transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)", minWidth: 0 }}
                >
                    {/* Sticky Header Section */}
                    <div className="sticky top-0 left-0 w-full z-10">
                        <div className="flex items-center justify-between bg-white p-16 bordb">
                            <div className="flex items-center gap-12">
                                {headerIcon && (
                                    <div className="bg-light-primary text-primary rounded-5 p-12 flex items-center justify-center">
                                        {headerIcon}
                                    </div>
                                )}
                                <div>
                                    <h2 className="mid-text text-dark font-500">{headerTitle}</h2>
                                    {headerSub && <p className="mini-text text-gray mt-2">{headerSub}</p>}
                                </div>
                            </div>
                            {quickAction && <div className="text-right">{quickAction}</div>}
                        </div>

                        {/* Tabs and Filters Row */}
                        {showTabControls && (
                            <div className="bg-white bordb">
                                <Tab tabs={tabs} activeTab={activeTab} onChange={onTabChange} />

                                {activeTab !== "Analytic" && (filterDescription || filterInputs || hasActiveFilters) && (
                                    <div>
                                        <div className="flex items-center justify-between py-12 px-12 bg-white">
                                            <p className="small-text text-gray">{filterDescription}</p>
                                            <div className="flex items-center gap-8">
                                                {filterInputs && (
                                                    <Button
                                                        version="v2"
                                                        bg={showFilters ? "secondary" : "white"}
                                                        color={showFilters ? "white" : "secondary"}
                                                        border="secondary"
                                                        onClick={() => setShowFilters(!showFilters)}
                                                        className="flex items-center gap-4"
                                                    >
                                                        <Icon name="Filter" width="12" height="12" strokeWidth="2.5" className="mr-4" />
                                                        {showFilters ? "Hide Filters" : "Filters"}
                                                    </Button>
                                                )}
                                                {hasActiveFilters && (
                                                    <Button
                                                        text="Clear All"
                                                        version="v2"
                                                        bg="white"
                                                        color="danger"
                                                        border="danger"
                                                        onClick={onClearAllFilters}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {/* Collapsible Filters UI */}
                                        {showFilters && filterInputs && (
                                            <div className="bg-forth border-t border-b p-16 gap-16" style={{ transition: "all 0.3s ease" }}>
                                                {filterInputs}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Children Content Area */}
                    <div className="p-12 bg-forth">{children}</div>
                </div>
            </div>
        </Container>
    );
};

export default Structure;