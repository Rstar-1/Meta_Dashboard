import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../../components/common/Container";
import Icon from "../../../components/common/Icon";
import Fields from "../../../components/forms/Fields";
import Button from "../../../components/common/Button";

/* ==========================================================================
   CUSTOM ASSETS & ICONS
   ========================================================================== */

// Folder Card Icon
const FolderCardIcon = React.memo(({ size = 80 }) => {
    const height = Math.round((size * 64) / 80);

    return (
        <div style={{ width: `${size}px`, height: `${height}px` }}>
            <svg
                width={size}
                height={height}
                viewBox="0 0 80 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Back flap */}
                <path
                    d="M6 14C6 9.58172 9.58172 6 14 6H29.5C32.3 6 34.9 7.4 36.3 9.8L38.2 13H68C72.4183 13 76 16.5817 76 21V52C76 56.4183 72.4183 60 68 60H14C9.58172 60 6 56.4183 6 52V14Z"
                    fill="#ffedd5"
                />
                {/* Front flap */}
                <path
                    d="M4 22C4 17.5817 7.58172 14 12 14H68C72.4183 14 76 17.5817 76 22V52C76 56.4183 72.4183 60 68 60H12C7.58172 60 4 56.4183 4 52V22Z"
                    fill="#fed7aa"
                />
            </svg>
        </div>
    );
});
FolderCardIcon.displayName = "FolderCardIcon";

// Mini Folder Icon for Sidebar
const SidebarFolderIcon = React.memo(() => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
            d="M3 7C3 5.34315 4.34315 4 6 4H9.58579C10.3814 4 11.1444 4.31607 11.7071 4.87868L12.7071 5.87868C13.2698 6.44129 14.0328 6.75736 14.8284 6.75736H18C19.6569 6.75736 21 8.10021 21 9.75736V17C21 18.6569 19.6569 20 18 20H6C4.34315 20 3 18.6569 3 17V7Z"
            fill="#fed7aa"
        />
        <path
            d="M2 9.5C2 8.11929 3.11929 7 4.5 7H19.5C20.8807 7 22 8.11929 22 9.5V17C22 18.6569 20.6569 20 19 20H5C3.34315 20 2 18.6569 2 17V9.5Z"
            fill="#fb923c"
        />
    </svg>
));
SidebarFolderIcon.displayName = "SidebarFolderIcon";

/* ==========================================================================
   DATA SOURCES
   ========================================================================== */

const APPDATA = [
    { id: "whatsapp", name: "Whatsapp", size: "5.8 GB", type: "default" },
    { id: "gmail", name: "Gmail", size: "3.2 GB", type: "projects" },
    { id: "sms", name: "SMS", size: "1.5 GB", type: "music" },
    { id: "map", name: "Location", size: "1.5 GB", type: "music" },
    { id: "lead", name: "Leads", size: "1.5 GB", type: "music" },
    { id: "ecom", name: "Ecom Website", size: "1.5 GB", type: "music" },
    { id: "web", name: "Agency Website", size: "1.5 GB", type: "music" },
    { id: "dasb", name: "Dashboard", size: "1.5 GB", type: "music" },
    { id: "inra", name: "KAIOM", size: "1.5 GB", type: "music" },
    { id: "node", name: "Node API", size: "1.5 GB", type: "music" },
];

const SIDEBAR_ITEMS = [
    {
        id: "head",
        name: "Header",
        type: "default",
        isOpen: true,
        children: [
            { id: "head-1", name: "Header 1", type: "default" },
            { id: "head-2", name: "Header 2", type: "default" },
        ],
        info: [
            { label: "Type", value: "Folder" },
            { label: "Created By", value: "Admin" },
            { label: "Modified", value: "Sep 17, 2020 4:25" },
            { label: "Created", value: "Sep 10, 2020 2:25" },
        ],
    },
    {
        id: "foot",
        name: "Footer",
        type: "default",
        children: [
            { id: "foot-1", name: "Footer 1", type: "default" },
            { id: "foot-2", name: "Footer 2", type: "default" },
        ],
        info: [
            { label: "Type", value: "Folder" },
            { label: "Created By", value: "Admin" },
            { label: "Modified", value: "Sep 17, 2020 4:25" },
            { label: "Created", value: "Sep 10, 2020 2:25" },
        ],
    },
    {
        id: "design",
        name: "HeroSection",
        isOpen: true,
        type: "default",
        info: [
            { label: "Type", value: "Folder" },
            { label: "Created By", value: "Admin" },
            { label: "Modified", value: "Sep 17, 2020 4:25" },
            { label: "Created", value: "Sep 10, 2020 2:25" },
        ],
        children: [
            { id: "hero-1", name: "Hero 1", type: "default" },
            { id: "hero-2", name: "Hero 2", type: "default" },
        ],
    },
    {
        id: "projects",
        name: "AboutSection",
        type: "projects",
        info: [
            { label: "Type", value: "Folder" },
            { label: "Created By", value: "Admin" },
            { label: "Modified", value: "Sep 17, 2020 4:25" },
            { label: "Created", value: "Sep 10, 2020 2:25" },
        ],
        children: [
            { id: "about-1", name: "About 1", type: "default" },
            { id: "about-2", name: "About 2", type: "default" },
        ],
    },
    {
        id: "feature",
        name: "FeatureSection",
        type: "default",
        info: [
            { label: "Type", value: "Folder" },
            { label: "Created By", value: "Admin" },
            { label: "Modified", value: "Sep 17, 2020 4:25" },
            { label: "Created", value: "Sep 10, 2020 2:25" },
        ],
        children: [
            { id: "feature-1", name: "Feature 1", type: "default" },
            { id: "feature-2", name: "Feature 2", type: "default" },
        ],
    },
];

const SETTINGS_LIST = [
    { key: "completed", label: "Completed" },
    { key: "active", label: "Active" },
];

const findItemById = (items, targetId) => {
    for (const item of items) {
        if (item.id === targetId) return item;
        if (item.children) {
            const found = findItemById(item.children, targetId);
            if (found) return found;
        }
    }
    return null;
};

/* ==========================================================================
   MEMOIZED CHILD COMPONENTS
   ========================================================================== */

const SidebarFolderItem = React.memo(
    ({ item, isSelected, onSelect, onToggle }) => {
        return (
            <div>
                <div
                    onClick={() => {
                        onSelect(item.id);
                        if (item.children) {
                            onToggle(item.id);
                        }
                    }}
                    className={`flex items-center justify-between p-8 rounded-8 cursor-pointer ${isSelected === item.id ? "bg-forth text-primary font-600" : "text-gray font-500"
                        }`}
                    style={{ transition: "background-color 0.15s ease" }}
                >
                    <div className="flex items-center gap-8">
                        <SidebarFolderIcon />
                        <span className="small-text">{item.name}</span>
                    </div>

                    {item.children ? (
                        <span className="text-gray flex items-center">
                            <Icon
                                name={item.isOpen ? "ChevronDown" : "ChevronRight"}
                                width="12"
                                height="12"
                                stroke="currentColor"
                            />
                        </span>
                    ) : (
                        <span className="text-gray flex items-center opacity-40">
                            <Icon name="ChevronRight" width="12" height="12" stroke="currentColor" />
                        </span>
                    )}
                </div>

                {item.children && item.isOpen && (
                    <div
                        className="flex flex-column gap-4 my-4"
                        style={{
                            marginLeft: "18px",
                            paddingLeft: "14px",
                            borderLeft: "1px dashed var(--tertiary)",
                        }}
                    >
                        {item.children.map((sub) => (
                            <div
                                key={sub.id}
                                onClick={() => {
                                    onSelect(sub.id);
                                }}
                                className={`flex items-center gap-6 p-6 rounded-6 cursor-pointer ${isSelected === sub.id ? "bg-forth text-primary font-600" : "text-gray hover:text-dark"
                                    }`}
                            >
                                <SidebarFolderIcon />
                                <span className="mini-text">{sub.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
);
SidebarFolderItem.displayName = "SidebarFolderItem";

const FolderCard = React.memo(({ folder, isSelected, onClick }) => {
    return (
        <div
            onClick={() => onClick(folder)}
            className={`flex flex-column items-center justify-center p-10 rounded-5 cursor-pointer ${isSelected ? "bg-forth" : "bg-transparent"
                }`}
        >
            <FolderCardIcon size={76} />
            <p className="small-text font-500 text-dark mt-5 text-center line-clamp1">
                {folder.name}
            </p>
        </div>
    );
});
FolderCard.displayName = "FolderCard";

/* ==========================================================================
   MAIN PROJECTS COMPONENT
   ========================================================================== */

const Projects = ({ onOpenStructure }) => {
    const navigate = useNavigate();
    const [selectedFolderId, setSelectedFolderId] = useState("head");
    const [selectedAppId, setSelectedAppId] = useState("whatsapp");
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarFolders, setSidebarFolders] = useState(SIDEBAR_ITEMS);

    const [settings, setSettings] = useState({
        completed: true,
        active: false,
    });

    const activeFolder = useMemo(() => {
        return (
            findItemById(sidebarFolders, selectedFolderId) ||
            sidebarFolders[0] || { id: "default", name: "Folder", type: "default" }
        );
    }, [sidebarFolders, selectedFolderId]);

    const isChildItem = useMemo(() => {
        return !activeFolder?.children || activeFolder.children.length === 0;
    }, [activeFolder]);

    const showSettings = isChildItem;
    const canRedirect = isChildItem;

    const activeInfo = useMemo(() => {
        return (
            activeFolder?.info || [
                { label: "Type", value: "Folder" },
                { label: "Created By", value: "Admin" },
                { label: "Modified", value: "Sep 17, 2020 4:25" },
                { label: "Created", value: "Sep 10, 2020 2:25" },
            ]
        );
    }, [activeFolder]);

    const filteredAppData = useMemo(() => {
        if (!searchQuery.trim()) return APPDATA;
        return APPDATA.filter((app) =>
            app.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const handleAppCardClick = useCallback(
        (app) => {
            setSelectedAppId(app.id);
            const channelId = (app.id || "").toLowerCase();
            if (channelId === "whatsapp" || channelId === "whasapp") {
                navigate("/campaign/whatsapp");
            } else if (channelId === "gmail") {
                navigate("/campaign/gmail");
            } else if (channelId === "sms") {
                navigate("/campaign/sms");
            }
        },
        [navigate]
    );

    const toggleSidebarFolder = useCallback((folderId) => {
        setSidebarFolders((prev) =>
            prev.map((item) =>
                item.id === folderId ? { ...item, isOpen: !item.isOpen } : item
            )
        );
    }, []);

    const handleSettingChange = useCallback((key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleSearchChange = useCallback((val) => {
        const text = typeof val === "string" ? val : val?.target?.value || "";
        setSearchQuery(text);
    }, []);

    return (
        <Container
            version="v0"
            className="w-full bg-white flex overflow-hidden h-full"
            style={{ height: "calc(100vh - 60px)" }}
        >
            {/* ================= LEFT SIDEBAR ================= */}
            <aside className="w-20 overflow-auto bg-forth h-full">
                <div className="sticky top-0 left-0 p-9 flex items-center justify-between bg-white">
                    <h5 className="headmini-text font-500 text-dark">
                        Configuration
                    </h5>
                    <Button
                        version="icon"
                        bg="white"
                        color="gray"
                        icon="Plus"
                        iconWidth="11"
                        iconHeight="11"
                        title="Add File or Folder"
                    />
                </div>
                <div className="grid-cols-1 gap-2 px-10 mt-5">
                    {sidebarFolders.map((item) => (
                        <SidebarFolderItem
                            key={item.id}
                            item={item}
                            isSelected={selectedFolderId}
                            onSelect={setSelectedFolderId}
                            onToggle={toggleSidebarFolder}
                        />
                    ))}
                </div>
            </aside>

            {/* ================= MIDDLE MAIN AREA ================= */}
            <div className="w-60 overflow-auto h-full p-14">
                <Fields
                    type="input"
                    icon="Search"
                    iconPosition="left"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />

                <div className="grid-cols-5 gap-12 mt-10">
                    {filteredAppData.map((app) => (
                        <FolderCard
                            key={app.id}
                            folder={app}
                            isSelected={app.id === selectedAppId}
                            onClick={handleAppCardClick}
                        />
                    ))}
                </div>
            </div>

            {/* ================= RIGHT SIDEBAR ================= */}
            <aside className="w-20 overflow-auto h-full bordl">
                <div className="p-12">
                    <div
                        className={`flex flex-column items-center py-12 ${canRedirect ? "cursor-pointer" : ""}`}
                        onClick={() => {
                            if (canRedirect) {
                                onOpenStructure?.(activeFolder);
                            }
                        }}
                        title={canRedirect ? `Open ${activeFolder.name} in Structure` : activeFolder.name}
                    >
                        <FolderCardIcon size={162} />
                        <h4 className="mid-text font-500 text-dark mt-6 uppercase">
                            {activeFolder.name}
                        </h4>
                    </div>

                    <div className="py-12">
                        <p className="para-text font-600 text-dark uppercase bg-forth p-10">Info</p>
                        <div className="grid-cols-1 gap-12 mt-8 p-8">
                            {activeInfo.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                    <p className="text-gray mini-text">{item.label}</p>
                                    <p className="font-500 text-dark mini-text">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {showSettings && (
                        <div className="py-12">
                            <p className="para-text font-600 text-dark uppercase bg-forth p-10">Settings</p>
                            <div className="grid-cols-1 gap-12 mt-8 p-8">
                                {SETTINGS_LIST.map((item) => (
                                    <div key={item.key} className="flex items-center justify-between w-full">
                                        <p className="text-dark small-text font-500 w-80">{item.label}</p>
                                        <div className="w-20">
                                            <Fields
                                                type="switch"
                                                value={settings[item.key]}
                                                onChange={(val) => handleSettingChange(item.key, val)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </Container>
    );
};

export default React.memo(Projects);
