import React, { useState, useMemo, useCallback } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import Icon from "../../../components/common/Icon";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import Tab from "../../../components/common/Tab";
import FormBuilder from "../../../components/forms/FormBuilder";
import { showToast } from "../../../components/common/Toast";
import INITIAL_FILES_DATA from "../codeData.json";
import Container from "../../../components/common/Container";

/* ==========================================================================
   HELPER ICONS & LANGUAGE DETECTOR
   ========================================================================== */

const FolderIcon = React.memo(({ isOpen }) => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isOpen ? "#2563eb" : "#3b82f6"}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
));
FolderIcon.displayName = "FolderIcon";

const getFileLanguage = (fileName = "") => {
    const ext = fileName.split(".").pop().toLowerCase();
    switch (ext) {
        case "jsx":
        case "tsx":
            return "jsx";
        case "js":
        case "ts":
            return "js";
        case "json":
            return "json";
        case "css":
        case "scss":
            return "css";
        case "html":
            return "html";
        case "md":
            return "markdown";
        default:
            return "jsx";
    }
};

/* ==========================================================================
   MEMOIZED SUB-COMPONENTS
   ========================================================================== */

const TabItem = React.memo(({ tab, isActive, onSelect, onClose }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onClick={() => onSelect(tab)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="flex items-center gap-8 bordr p-10 cursor-pointer"
            style={{
                backgroundColor: isActive ? "var(--white)" : hovered ? "var(--tertiary)" : "transparent",
                color: isActive ? "var(--primary)" : "var(--gray)",
                borderTop: isActive ? "1px solid var(--primary)" : "1px solid transparent",
            }}
        >
            <Icon
                name="File"
                width="14"
                height="14"
                stroke={isActive ? "var(--primary)" : "var(--gray)"}
            />
            <p className="mini-text font-500">{tab}</p>
            <Icon
                onClick={(e) => {
                    e.stopPropagation();
                    onClose(tab);
                }}
                name="Close"
                width="14"
                height="14"
                stroke="currentColor"
            />

        </div>
    );
});
TabItem.displayName = "TabItem";

const TreeItem = React.memo(
    ({
        item,
        level = 0,
        activeFile,
        onSelectFile,
        openFolders,
        onToggleFolder,
        onDeleteFile,
    }) => {
        const isFolder = item.type === "folder";
        const isOpen = Boolean(openFolders[item.id]);
        const isActive = activeFile === item.name;
        const [isHovered, setIsHovered] = useState(false);

        if (isFolder) {
            return (
                <div>
                    <div
                        onClick={() => onToggleFolder(item.id)}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="flex items-center justify-between gap-6 py-6 pr-10 cursor-pointer"
                        style={{
                            paddingLeft: `${8 + level * 8}px`,
                            backgroundColor: isHovered ? "var(--tertiary)" : "transparent",
                        }}
                    >
                        <div className="flex items-center gap-6">
                            <Icon
                                name={isOpen ? "ChevronDown" : "ChevronRight"}
                                width="12"
                                height="12"
                                stroke="var(--gray)"
                            />
                            <FolderIcon isOpen={isOpen} />
                            <p className="mini-text text-dark font-400">{item.name}</p>
                        </div>
                        {isHovered && item.id !== "src" && (
                            <Icon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteFile(item.id || item.name);
                                }}
                                name="Close"
                                width="12"
                                height="12"
                                stroke="var(--gray)"
                            />
                        )}
                    </div>
                    {isOpen && item.children && (
                        <>
                            {item.children.map((child) => (
                                <TreeItem
                                    key={child.id}
                                    item={child}
                                    level={level + 1}
                                    activeFile={activeFile}
                                    onSelectFile={onSelectFile}
                                    openFolders={openFolders}
                                    onToggleFolder={onToggleFolder}
                                    onDeleteFile={onDeleteFile}
                                />
                            ))}
                        </>
                    )}
                </div>
            );
        }

        return (
            <div
                onClick={() => onSelectFile(item.name)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 14px",
                    paddingLeft: `${18 + level * 14}px`,
                    cursor: "pointer",
                    fontSize: "13px",
                    backgroundColor: isActive ? "#eff6ff" : isHovered ? "#f1f5f9" : "transparent",
                    color: isActive ? "#2563eb" : "#334155",
                    borderLeft: isActive ? "2px solid #2563eb" : "2px solid transparent",
                    fontWeight: isActive ? 600 : 400,
                    userSelect: "none",
                    transition: "all 0.15s ease",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icon
                        name="File"
                        width="14"
                        height="14"
                        stroke={isActive ? "#2563eb" : "#64748b"}
                    />
                    <span>{item.name}</span>
                </div>

                {isHovered && (
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteFile(item.id || item.name);
                        }}
                        title={`Delete ${item.name}`}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "16px",
                            height: "16px",
                            borderRadius: "4px",
                            color: "#94a3b8",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#ef4444";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#94a3b8";
                        }}
                    >
                        <Icon name="Close" width="10" height="10" stroke="currentColor" />
                    </span>
                )}
            </div>
        );
    }
);
TreeItem.displayName = "TreeItem";

const ComponentPreview = React.memo(({ activeFile }) => {
    if (activeFile === "Button.jsx") {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                <div>
                    <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>
                        DEFAULT
                    </div>
                    <button
                        style={{
                            padding: "10px 22px",
                            borderRadius: "8px",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            border: "none",
                            fontWeight: 600,
                            fontSize: "14px",
                            cursor: "pointer",
                            boxShadow: "0 2px 4px rgba(37,99,235,0.2)",
                        }}
                    >
                        Button.jsx
                    </button>
                </div>

                <div>
                    <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>
                        FOCUSED
                    </div>
                    <button
                        style={{
                            padding: "10px 22px",
                            borderRadius: "8px",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            border: "2px solid #38bdf8",
                            boxShadow: "0 0 0 3px rgba(56, 189, 248, 0.35)",
                            fontWeight: 600,
                            fontSize: "14px",
                            cursor: "pointer",
                        }}
                    >
                        Button.jsx
                    </button>
                </div>

                <div>
                    <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>
                        SECONDARY
                    </div>
                    <button
                        style={{
                            padding: "10px 22px",
                            borderRadius: "8px",
                            backgroundColor: "transparent",
                            color: "#2563eb",
                            border: "1.5px solid #2563eb",
                            fontWeight: 600,
                            fontSize: "14px",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                </div>

                <div>
                    <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>
                        DISABLED
                    </div>
                    <button
                        disabled
                        style={{
                            padding: "10px 22px",
                            borderRadius: "8px",
                            backgroundColor: "#f1f5f9",
                            color: "#94a3b8",
                            border: "1px solid #e2e8f0",
                            fontWeight: 600,
                            fontSize: "14px",
                            cursor: "not-allowed",
                        }}
                    >
                        Locked button
                    </button>
                </div>
            </div>
        );
    }

    if (activeFile === "Card.jsx") {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: "#64748b", textTransform: "uppercase" }}>
                    CARD COMPONENT PREVIEW
                </div>
                <div
                    style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "20px",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.04)",
                        backgroundColor: "#ffffff",
                    }}
                >
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "16px", color: "#0f172a" }}>Feature Overview</h4>
                    <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>
                        This modular card component dynamically adapts to slot headers, interactive controls, and nested badges.
                    </p>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                            style={{
                                padding: "8px 16px",
                                borderRadius: "6px",
                                backgroundColor: "#0f172a",
                                color: "#ffffff",
                                fontSize: "12px",
                                border: "none",
                                fontWeight: 500,
                                cursor: "pointer",
                            }}
                        >
                            Explore More
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Default: Input.jsx 4 states
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* 1. DEFAULT */}
            <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>
                    DEFAULT
                </div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e293b", marginBottom: "6px" }}>
                    Email address
                </label>
                <input
                    type="text"
                    placeholder="you@example.com"
                    style={{
                        width: "100%",
                        height: "42px",
                        padding: "0 14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        color: "#334155",
                        outline: "none",
                        backgroundColor: "#ffffff",
                        boxSizing: "border-box",
                    }}
                />
            </div>

            {/* 2. FOCUSED */}
            <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>
                    FOCUSED
                </div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e293b", marginBottom: "6px" }}>
                    Email address
                </label>
                <input
                    type="text"
                    defaultValue="ada@lovelace.dev"
                    style={{
                        width: "100%",
                        height: "42px",
                        padding: "0 14px",
                        borderRadius: "8px",
                        border: "2px solid #3b82f6",
                        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)",
                        fontSize: "14px",
                        color: "#0f172a",
                        outline: "none",
                        backgroundColor: "#ffffff",
                        boxSizing: "border-box",
                    }}
                />
            </div>

            {/* 3. ERROR */}
            <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>
                    ERROR
                </div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e293b", marginBottom: "6px" }}>
                    Email address
                </label>
                <input
                    type="text"
                    defaultValue="ada@"
                    style={{
                        width: "100%",
                        height: "42px",
                        padding: "0 14px",
                        borderRadius: "8px",
                        border: "1.5px solid #ef4444",
                        fontSize: "14px",
                        color: "#0f172a",
                        outline: "none",
                        backgroundColor: "#ffffff",
                        boxSizing: "border-box",
                    }}
                />
                <span style={{ display: "block", marginTop: "6px", fontSize: "12px", color: "#dc2626", fontWeight: 500 }}>
                    Enter a valid email address.
                </span>
            </div>

            {/* 4. DISABLED */}
            <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>
                    DISABLED
                </div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e293b", marginBottom: "6px" }}>
                    Email address
                </label>
                <input
                    type="text"
                    defaultValue="Locked field"
                    disabled
                    style={{
                        width: "100%",
                        height: "42px",
                        padding: "0 14px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#f1f5f9",
                        fontSize: "14px",
                        color: "#94a3b8",
                        cursor: "not-allowed",
                        boxSizing: "border-box",
                    }}
                />
            </div>
        </div>
    );
});
ComponentPreview.displayName = "ComponentPreview";

/* ==========================================================================
   MAIN Strcture COMPONENT (WHITE THEME)
   ========================================================================== */

const Structure = ({ onBack, project }) => {
    const [filesData, setFilesData] = useState(INITIAL_FILES_DATA);
    const [activeFile, setActiveFile] = useState("");
    const [openTabs, setOpenTabs] = useState([]);
    const [demoTabs, setDemoTabs] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemType, setItemType] = useState("file");
    const [locationMode, setLocationMode] = useState("target");
    const [parentFolderId, setParentFolderId] = useState("components");
    const [newFileName, setNewFileName] = useState("");
    const [fileInitialCode, setFileInitialCode] = useState("");

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setNewFileName("");
        setFileInitialCode("");
    }, []);

    const fileMap = useMemo(() => {
        const map = {};
        const traverse = (items) => {
            items.forEach((item) => {
                if (item.type === "file") {
                    map[item.name] = item;
                    map[item.id] = item;
                }
                if (item.children) traverse(item.children);
            });
        };
        traverse(filesData);
        return map;
    }, [filesData]);

    const folderOptions = useMemo(() => {
        const list = [];
        const traverse = (items, prefix = "") => {
            items.forEach((item) => {
                if (item.type === "folder") {
                    const path = prefix ? `${prefix} / ${item.name}` : item.name;
                    list.push({ label: path, value: item.id });
                    if (item.children) traverse(item.children, path);
                }
            });
        };
        traverse(filesData);
        return list;
    }, [filesData]);

    const activeParentFolder = useMemo(() => {
        if (folderOptions.some((opt) => opt.value === parentFolderId)) {
            return parentFolderId;
        }
        return folderOptions[0]?.value || "components";
    }, [folderOptions, parentFolderId]);

    // Folder open states
    const [openFolders, setOpenFolders] = useState(() => {
        const state = {};
        const traverse = (items) => {
            items.forEach((item) => {
                if (item.type === "folder") {
                    state[item.id] = Boolean(item.defaultOpen);
                    if (item.children) traverse(item.children);
                }
            });
        };
        traverse(INITIAL_FILES_DATA);
        return state;
    });

    const handleToggleFolder = useCallback((folderId) => {
        setOpenFolders((prev) => ({
            ...prev,
            [folderId]: !prev[folderId],
        }));
    }, []);

    const handleSelectFile = useCallback((fileName) => {
        setActiveFile(fileName);
        setOpenTabs((prev) => (prev.includes(fileName) ? prev : [...prev, fileName]));
    }, []);

    const handleCloseTab = useCallback(
        (fileName) => {
            setOpenTabs((prevTabs) => {
                const nextTabs = prevTabs.filter((t) => t !== fileName);
                if (activeFile === fileName) {
                    const nextActive = nextTabs.length > 0 ? nextTabs[0] : "";
                    setActiveFile(nextActive);
                }
                return nextTabs;
            });
        },
        [activeFile]
    );

    const handleDeleteFile = useCallback(
        (fileIdOrName) => {
            const removeFromTree = (items) => {
                return items
                    .filter((item) => item.id !== fileIdOrName && item.name !== fileIdOrName)
                    .map((item) => {
                        if (item.children) {
                            return { ...item, children: removeFromTree(item.children) };
                        }
                        return item;
                    });
            };

            setFilesData((prev) => removeFromTree(prev));
            handleCloseTab(fileIdOrName);
            showToast(`Removed "${fileIdOrName}"`, "info");
        },
        [handleCloseTab]
    );

    const modalFields = useMemo(() => {
        const baseFields = [];
        if (locationMode === "target") {
            baseFields.push({
                name: "targetFolder",
                label: "Target Folder",
                type: "select",
                options: folderOptions,
                value: activeParentFolder,
                onChange: (val) => {
                    const selected = typeof val === "string" ? val : val?.value || val;
                    if (selected) {
                        setParentFolderId(selected);
                    }
                },
                validation: { required: true },
            });
        }

        baseFields.push({
            name: "name",
            label: itemType === "file" ? "File Name" : "Folder Name",
            type: "input",
            placeholder:
                itemType === "file"
                    ? locationMode === "root"
                        ? "e.g. README.md, tsconfig.json, .env"
                        : "e.g. Dropdown.jsx, styles.css, api.js"
                    : locationMode === "root"
                        ? "e.g. newfolder, public, assets"
                        : "e.g. services, context, helpers",
            onChange: (val) => {
                const text = typeof val === "string" ? val : val?.target?.value || "";
                setNewFileName(text);
            },
            validation: { required: true },
        });

        return baseFields;
    }, [itemType, locationMode, folderOptions, activeParentFolder]);

    const handleFormSubmit = useCallback(
        (formData) => {
            const trimmedName = (formData.name || newFileName || "").trim();
            if (!trimmedName) {
                showToast("Please enter a name", "warning");
                return;
            }

            const isRoot = locationMode === "root";
            const folderId = isRoot ? "root" : (formData.targetFolder || activeParentFolder || "components");

            const codeContent =
                fileInitialCode ||
                formData.code ||
                (itemType === "file"
                    ? `// ${trimmedName}\nexport default function ${trimmedName.replace(/\.[^/.]+$/, "")}() {\n  return <div>${trimmedName}</div>;\n}`
                    : "");

            const targetFolderObj = folderOptions.find((o) => o.value === folderId);
            const folderPathLabel = targetFolderObj ? targetFolderObj.label : folderId;

            const newItem =
                itemType === "folder"
                    ? {
                        id: trimmedName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                        name: trimmedName,
                        type: "folder",
                        defaultOpen: true,
                        children: [],
                    }
                    : {
                        id: trimmedName,
                        name: trimmedName,
                        type: "file",
                        path: isRoot ? trimmedName : `${folderPathLabel} / ${trimmedName}`,
                        componentType: trimmedName.toLowerCase().includes("button")
                            ? "button"
                            : trimmedName.toLowerCase().includes("card")
                                ? "card"
                                : trimmedName.toLowerCase().includes("input")
                                    ? "input"
                                    : "file",
                        code: codeContent,
                    };

            const insertIntoTree = (items) => {
                if (folderId === "root") {
                    if (newItem.type === "folder") {
                        // Place new root folder alongside root folders (after last folder, before root files)
                        const lastFolderIndex = items.reduce(
                            (lastIdx, cur, idx) => (cur.type === "folder" ? idx : lastIdx),
                            -1
                        );
                        if (lastFolderIndex === -1) {
                            return [newItem, ...items];
                        }
                        const updated = [...items];
                        updated.splice(lastFolderIndex + 1, 0, newItem);
                        return updated;
                    }
                    return [...items, newItem];
                }

                return items.map((item) => {
                    if (item.id === folderId && item.type === "folder") {
                        const existingChildren = item.children || [];
                        let nextChildren;
                        if (newItem.type === "folder") {
                            const lastFolderIdx = existingChildren.reduce(
                                (lastIdx, cur, idx) => (cur.type === "folder" ? idx : lastIdx),
                                -1
                            );
                            if (lastFolderIdx === -1) {
                                nextChildren = [newItem, ...existingChildren];
                            } else {
                                nextChildren = [...existingChildren];
                                nextChildren.splice(lastFolderIdx + 1, 0, newItem);
                            }
                        } else {
                            nextChildren = [...existingChildren, newItem];
                        }
                        return {
                            ...item,
                            children: nextChildren,
                        };
                    }
                    if (item.children) {
                        return {
                            ...item,
                            children: insertIntoTree(item.children),
                        };
                    }
                    return item;
                });
            };

            setFilesData((prev) => insertIntoTree(prev));

            // Auto expand parent folder
            if (folderId !== "root") {
                setOpenFolders((prev) => ({
                    ...prev,
                    [folderId]: true,
                    ...(newItem.type === "folder" ? { [newItem.id]: true } : {}),
                }));
            } else if (newItem.type === "folder") {
                setOpenFolders((prev) => ({
                    ...prev,
                    [newItem.id]: true,
                }));
            }

            if (itemType === "file") {
                setOpenTabs((prev) =>
                    prev.includes(trimmedName) ? prev : [...prev, trimmedName]
                );
                setActiveFile(trimmedName);
            }

            const locationText = isRoot ? "at root level" : `in "${folderPathLabel}"`;
            showToast(`Created ${itemType} "${trimmedName}" ${locationText}!`, "success");
            setNewFileName("");
            setFileInitialCode("");
            setIsModalOpen(false);
        },
        [itemType, locationMode, activeParentFolder, folderOptions, newFileName, fileInitialCode]
    );

    const currentFile = useMemo(() => {
        return fileMap[activeFile] || (openTabs.length > 0 ? fileMap[openTabs[0]] : null) || {};
    }, [fileMap, activeFile, openTabs]);

    const handleCodeChange = useCallback((fileName, newCode) => {
        if (!fileName) return;
        const updateTreeCode = (items) => {
            return items.map((item) => {
                if (item.name === fileName || item.id === fileName) {
                    return { ...item, code: newCode };
                }
                if (item.children) {
                    return { ...item, children: updateTreeCode(item.children) };
                }
                return item;
            });
        };
        setFilesData((prev) => updateTreeCode(prev));
    }, []);

    return (
        <>
            <Container version='v0' className="w-full bg-white flex overflow-hidden h-full" style={{ height: 'calc(100vh - 60px)' }}>
                <aside
                    className="w-20 bg-forth overflow-auto bordr h-full"
                >
                    <div
                        className="sticky top-0 left-0 bg-white flex items-center justify-between p-8"
                    >
                        <div className="flex items-center gap-6">
                            {onBack && (
                                <Button
                                    version="none"
                                    bg="transparent"
                                    color="gray"
                                    icon="ChevronLeft"
                                    iconWidth="18"
                                    iconHeight="18"
                                    onClick={onBack}
                                    title="Back to Folders"
                                    className='w-max p-1'
                                />
                            )}
                            <p className="para-text text-dark font-500 capitalize">
                                {project?.name}
                            </p>
                        </div>
                        <div className="flex items-center gap-5">
                            <Button
                                version="icon"
                                bg="forth"
                                color="gray"
                                icon="Plus"
                                iconWidth="11"
                                iconHeight="11"
                                onClick={() => setIsModalOpen(true)}
                                title="Add File or Folder"
                            />
                            <Button
                                version="icon"
                                bg={demoTabs ? 'secondary' : 'gray'}
                                color='white'
                                icon={demoTabs ? "Code" : "Layers"}
                                iconWidth="11"
                                iconHeight="11"
                                onClick={() => setDemoTabs((prev) => !prev)}
                            />
                        </div>
                    </div>

                    {filesData.map((item) => (
                        <TreeItem
                            key={item.id}
                            item={item}
                            level={0}
                            activeFile={activeFile}
                            onSelectFile={handleSelectFile}
                            openFolders={openFolders}
                            onToggleFolder={handleToggleFolder}
                            onDeleteFile={handleDeleteFile}
                        />
                    ))}
                </aside>

                <div className="w-80">
                    {demoTabs ? (
                        <div className="h-full overflow-hidden">
                            <div
                                className="bg-forth flex items-center justify-between overflow-auto bordb"
                                style={{ flexShrink: 0 }}
                            >
                                <div className="flex items-center overflow-auto">
                                    {openTabs.map((tab) => (
                                        <TabItem
                                            key={tab}
                                            tab={tab}
                                            isActive={activeFile === tab}
                                            onSelect={setActiveFile}
                                            onClose={handleCloseTab}
                                        />
                                    ))}
                                </div>
                            </div>

                            {currentFile.path && (
                                <div
                                    className="flex items-center gap-6 py-7 px-15 bordb"
                                    style={{ flexShrink: 0 }}
                                >
                                    <p className="mini-text text-gray font-500">
                                        {currentFile.path}
                                    </p>
                                </div>
                            )}

                            <div
                                className="overflow-auto bg-white"
                                style={{
                                    height: currentFile.path ? "calc(100% - 76px)" : "calc(100% - 41px)",
                                }}
                            >
                                {openTabs.length > 0 && currentFile.name ? (
                                    <CodeEditor
                                        value={currentFile.code || ""}
                                        language={getFileLanguage(currentFile.name)}
                                        placeholder="Please enter code..."
                                        onChange={(ev) => handleCodeChange(currentFile.name, ev.target.value)}
                                        padding={14}
                                        data-color-mode="light"
                                        style={{ minHeight: "100%", width: "100%", background: '#fff' }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center text-center h-full">
                                        <div className="p-20">
                                            <h5 className="text-gray font-500 uppercase title-text">No active file open.</h5>
                                            <p className="small-text text-gray font-400 mt-4">
                                                Select a file from the Explorer or click "+ New File / Folder" to create one.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-auto h-full">
                            <div className="p-10">
                                <ComponentPreview activeFile={activeFile} />
                            </div>
                        </div>
                    )}
                </div>
            </Container>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={
                    itemType === "file"
                        ? locationMode === "root"
                            ? "Add Root File"
                            : "Add File in Target Folder"
                        : locationMode === "root"
                            ? "Add Root Folder"
                            : "Add Subfolder in Target Folder"
                }
                size="md"
                placement="right"
                type="sidebar"
                footer={null}
            >
                <div>
                    <Tab
                        tabs={[
                            { name: "File", value: "file", icon: "File" },
                            { name: "Folder", value: "folder", icon: "Layers" },
                        ]}
                        activeTab={itemType}
                        onChange={setItemType}
                        version="v1"
                    />

                    <div className="p-12 bg-forth mt-10">
                        <Tab
                            tabs={[
                                {
                                    name: "Folder",
                                    value: "target",
                                    icon: "File",
                                },
                                {
                                    name: "Root",
                                    value: "root",
                                    icon: "File",
                                },
                            ]}
                            activeTab={locationMode}
                            onChange={setLocationMode}
                            version="v3"
                        />

                        <div className="mt-10">
                            <FormBuilder
                                key={`${itemType}-${locationMode}`}
                                fields={modalFields}
                                submitType="json"
                                onSubmit={handleFormSubmit}
                                submitText={
                                    itemType === "file"
                                        ? locationMode === "target"
                                            ? "Create File"
                                            : "Create Root File"
                                        : locationMode === "target"
                                            ? "Create Folder"
                                            : "Create Root Folder"
                                }
                                buttonVersion="v2"
                                buttonBg="primary"
                                col="1"
                            >
                                {itemType === "file" && (
                                    <div className="mt-12">
                                        <div className="flex items-center justify-between mb-8">
                                            <label className="small-text font-600 text-dark">
                                                Initial Code
                                            </label>
                                            <span
                                                className="mini-text text-gray font-500 uppercase px-8 py-2 rounded-4"
                                                style={{ backgroundColor: "var(--tertiary, #f1f5f9)" }}
                                            >
                                                {getFileLanguage(newFileName || "Component.jsx")}
                                            </span>
                                        </div>
                                        <div
                                            className="rounded-5 overflow-hidden"
                                            style={{
                                                border: "1px solid #30363d",
                                                backgroundColor: "#0d1117",
                                            }}
                                        >
                                            <CodeEditor
                                                value={fileInitialCode}
                                                language={getFileLanguage(newFileName || "Component.jsx")}
                                                placeholder="// Enter initial code or component definition..."
                                                onChange={(ev) => setFileInitialCode(ev.target.value)}
                                                padding={14}
                                                data-color-mode="dark"
                                                style={{
                                                    fontSize: 13,
                                                    fontFamily:
                                                        'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                                    minHeight: "180px",
                                                    maxHeight: "260px",
                                                    overflow: "auto",
                                                    backgroundColor: "#0d1117",
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </FormBuilder>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default React.memo(Structure);
