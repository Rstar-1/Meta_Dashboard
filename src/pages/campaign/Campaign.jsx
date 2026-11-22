import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "../../components/common/Container";
import Fields from "../../components/forms/Fields";
import Tab from "../../components/common/Tab";
import { showToast } from "../../components/common/Toast";
import { canAccessPage, useCurrentUser } from "../../utils";

// Channel section middle components
import WhatsappSection from "./sections/Whatsapp";
import GmailSection from "./sections/Gmail";
import SmsSection from "./sections/SMS";

// Data, API, Slice and icons
import { SAVED_TEMPLATES } from "./campaignConstants";
import { getLeadsApi } from "../../api/leadApi";
import {
    getAudienceRecipientsApi,
    getTemplatesApi,
    sendCampaignApi,
} from "../../api/campaignApi";
import { sendCampaign } from "../../feature/campaignSlice";
import { AVATAR_PALETTE } from "../../utils/apiData";
import {
    TemplateFolderIcon,
    WhatsappTemplateMockup,
    SmsTemplateMockup,
    GmailTemplateMockup,
} from "./campaignComponents";

const USER_FILTERS = ["All", "Leads", "Customers"];

const RIGHT_TABS = [
    { name: "Preview", value: "preview" },
    { name: "Saved Templates", value: "templates", count: SAVED_TEMPLATES.length },
];

const formatHighlightedTokens = (text) => {
    if (!text) return null;
    const parts = text.split(/(\[Company\]|\{company\})/gi);
    return parts.map((part, i) => {
        const lower = part.toLowerCase();
        if (lower === "[company]" || lower === "{company}") {
            return (
                <span
                    key={i}
                    className="rounded-4 font-600 inline-block"
                    style={{
                        backgroundColor: "#dbeafe",
                        color: "#1d4ed8",
                        padding: "1px 6px",
                        margin: "0 2px",
                        lineHeight: 1.2,
                    }}
                >
                    [Company]
                </span>
            );
        }
        return part;
    });
};

const Campaign = () => {
    const { channel } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user: currentUser, role: userRole } = useCurrentUser();

    // Map route channel param to canonical channel (defaulting to whatsapp)
    const activeChannel = useMemo(() => {
        const lower = (channel || "").toLowerCase();
        if (lower === "gmail") return "gmail";
        if (lower === "sms") return "sms";
        return "whatsapp"; // whatsapp / whasapp / default
    }, [channel]);

    // Channel page name mapping for granular permission check
    const channelPageName = useMemo(() => {
        if (activeChannel === "sms") return "SMS Campaign";
        if (activeChannel === "gmail") return "Gmail Campaign";
        return "Whatsapp Campaign";
    }, [activeChannel]);

    // Check if the current user has access to activeChannel
    const hasChannelAccess = useMemo(() => {
        return canAccessPage(currentUser || userRole, channelPageName, "Campaign");
    }, [currentUser, userRole, channelPageName]);

    // Enforce channel-level permission check: redirect if restricted (e.g. SMS for vendor)
    useEffect(() => {
        if (!hasChannelAccess) {
            const channelOptions = [
                { id: "whatsapp", page: "Whatsapp Campaign" },
                { id: "gmail", page: "Gmail Campaign" },
                { id: "sms", page: "SMS Campaign" },
            ];
            const fallback = channelOptions.find(
                (ch) => ch.id !== activeChannel && canAccessPage(currentUser || userRole, ch.page, "Campaign")
            );

            if (fallback) {
                showToast(`Access to ${activeChannel.toUpperCase()} Campaign is not permitted for your role. Redirecting to ${fallback.id.toUpperCase()}.`, "warning");
                navigate(`/campaign/${fallback.id}`, { replace: true });
            } else {
                showToast("Access to Campaign channels is not permitted for your role.", "warning");
                navigate("/dashboard", { replace: true });
            }
        }
    }, [hasChannelAccess, activeChannel, currentUser, userRole, navigate]);

    // Redux & local sending state
    const reduxIsSending = useSelector((state) => state.campaigns?.isSending);
    const [localIsSending, setLocalIsSending] = useState(false);
    const isSending = Boolean(reduxIsSending || localIsSending);

    // Selected leads / users (starts empty until real leads arrive from getLeadsApi)
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [userFilter, setUserFilter] = useState("All");

    // Dynamic leads loaded directly from Leads table data (empty initial state to prevent mock data flash)
    const [apiLeads, setApiLeads] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(true);

    // Dynamic templates from practice-api
    const [channelTemplates, setChannelTemplates] = useState(SAVED_TEMPLATES);

    // Fetch pre-approved templates for active channel
    useEffect(() => {
        let isMounted = true;
        getTemplatesApi(activeChannel)
            .then((res) => {
                const list = res?.data !== undefined ? res.data : res;
                if (isMounted && Array.isArray(list) && list.length > 0) {
                    const formatted = list.map((tpl) => ({
                        id: tpl.id || tpl.templateType,
                        name: tpl.title || tpl.name || "Template",
                        description: tpl.description || "",
                        header: tpl.header || "",
                        subject: tpl.subject || "",
                        body: tpl.body || "",
                        footer: tpl.footer || "",
                        buttonLabel: tpl.buttonLabel || "",
                        buttonType: tpl.buttonType || "url",
                        templateType: tpl.templateType || "promotion",
                        otpCode: tpl.otpCode || "",
                        shortUrl: tpl.shortUrl || "",
                        time: "Now",
                    }));
                    setChannelTemplates(formatted);
                }
            })
            .catch(() => {});
        return () => {
            isMounted = false;
        };
    }, [activeChannel]);

    // Fetch audience recipients dynamically directly from Leads table data (getLeadsApi)
    const fetchCampaignLeads = useCallback(async () => {
        setLoadingLeads(true);
        try {
            // Directly fetch leads from Leads table (getLeadsApi) for SMS, Gmail, and Mobile/WhatsApp
            const res = await getLeadsApi({ isDeleted: false, limit: 100 });
            const payload = res?.data !== undefined ? res.data : res;
            const list = Array.isArray(payload)
                ? payload
                : Array.isArray(payload?.leads)
                ? payload.leads
                : Array.isArray(payload?.data)
                ? payload.data
                : [];

            if (list && list.length > 0) {
                const formatted = list.map((item, idx) => {
                    const id = String(item.customId || item.id || item._id || `LED-${String(idx + 1).padStart(3, "0")}`);
                    const name = item.name || item.fullname || "Lead";
                    const mobile = item.mobile || item.phone || item.recipientAddress || "";
                    const email = item.email ? String(item.email).toLowerCase().trim() : "";
                    const initials = name
                        .split(" ")
                        .filter(Boolean)
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "L";
                    const color = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];

                    return {
                        id,
                        _id: item._id || item.id || id,
                        name,
                        mobile,
                        phone: mobile,
                        email,
                        recipientAddress: activeChannel === "gmail" ? (email || mobile) : (mobile || phone || email),
                        location: item.location || "",
                        severity: item.severity || "low",
                        type: "Leads", // Sourced from Leads table -> Leads tab
                        avatar: initials,
                        color,
                        leadId: item._id || id,
                        userId: null,
                    };
                });
                setApiLeads(formatted);
                setSelectedUserIds((prev) => {
                    if (prev.length > 0) {
                        const valid = prev.filter((pid) => formatted.some((l) => l.id === pid));
                        if (valid.length > 0) return valid;
                    }
                    return formatted.map((l) => l.id);
                });
            }
        } catch (err) {
            console.warn("fetchCampaignLeads error in Campaign:", err);
        } finally {
            setLoadingLeads(false);
        }
    }, [activeChannel]);

    useEffect(() => {
        fetchCampaignLeads();
    }, [fetchCampaignLeads]);

    // All contacts for campaigns (Gmail, SMS, WhatsApp)
    const allUsers = apiLeads;

    // Dynamic right tabs
    const rightTabs = useMemo(() => [
        { name: "Preview", value: "preview" },
        { name: "Saved Templates", value: "templates", count: channelTemplates.length },
    ], [channelTemplates.length]);
    // Selected template
    const [selectedTemplateId, setSelectedTemplateId] = useState("welcome");
    const [rightTab, setRightTab] = useState("preview");

    // Form data
    const [formData, setFormData] = useState({
        templateType: "promotion",
        campaignName: "Festive offer - November",
        header: "Welcome to {company}",
        subject: "Aarav, enjoy 20% OFF – limited time only",
        body: "Enjoy 20% OFF on select items at Company.\nThis limited-time offer is valid until 30 Nov 2026.",
        footer: "You received this because you opted in. Unsubscribe",
        buttonLabel: "Shop now",
        fromEmail: "offers@yourbrand.in",
        otpCode: "546372",
    });

    // Handle form field change
    const handleChangeField = useCallback((field, val) => {
        setFormData((prev) => ({ ...prev, [field]: val }));
    }, []);

    // Filter users list: Leads show in 'All' and 'Leads'; Customers tab shows nothing
    const filteredUsers = useMemo(() => {
        if (userFilter === "Customers") {
            return [];
        }

        return allUsers.filter((user) => {
            const matchesFilter =
                userFilter === "All" || userFilter === "Leads" || user.type === "Leads";
            const q = userSearchQuery.trim().toLowerCase();
            const matchesSearch =
                !q ||
                user.name.toLowerCase().includes(q) ||
                (user.phone && String(user.phone).toLowerCase().includes(q)) ||
                (user.mobile && String(user.mobile).toLowerCase().includes(q)) ||
                (user.email && String(user.email).toLowerCase().includes(q));
            return matchesFilter && matchesSearch;
        });
    }, [allUsers, userFilter, userSearchQuery]);

    // Selected user objects
    const selectedUsers = useMemo(() => {
        return allUsers.filter((u) => selectedUserIds.includes(u.id));
    }, [allUsers, selectedUserIds]);

    // Check if all currently filtered users are selected
    const allShownSelected = useMemo(() => {
        return (
            filteredUsers.length > 0 &&
            filteredUsers.every((u) => selectedUserIds.includes(u.id))
        );
    }, [filteredUsers, selectedUserIds]);

    // Toggle select all shown
    const handleToggleSelectAll = useCallback(() => {
        if (allShownSelected) {
            const shownIds = new Set(filteredUsers.map((u) => u.id));
            setSelectedUserIds((prev) => prev.filter((id) => !shownIds.has(id)));
        } else {
            const shownIds = filteredUsers.map((u) => u.id);
            setSelectedUserIds((prev) => Array.from(new Set([...prev, ...shownIds])));
        }
    }, [allShownSelected, filteredUsers]);

    // Toggle individual user
    const handleToggleUser = useCallback((userId) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    }, []);

    // Clear selection
    const handleClearSelection = useCallback(() => {
        setSelectedUserIds([]);
    }, []);

    // Direct Send action via Twilio & Practice-API
    const handleSend = useCallback(async () => {
        if (!selectedUsers || selectedUsers.length === 0) {
            showToast("Please select at least one recipient user.", "warning");
            return;
        }

        setLocalIsSending(true);
        try {
            const recipients = selectedUsers.map((u) => {
                const address =
                    activeChannel === "gmail"
                        ? u.email || ""
                        : u.mobile || u.phone || "";
                return {
                    name: u.name || "Lead",
                    recipientAddress: address,
                    mobile: u.mobile || u.phone || "",
                    email: u.email || "",
                    recipientType: "Lead",
                    leadId: u.leadId || u._id || u.id,
                    userId: null,
                };
            });

            const payload = {
                name: formData.campaignName || `${activeChannel.toUpperCase()} Campaign - ${new Date().toLocaleDateString()}`,
                campaignName: formData.campaignName,
                channel: activeChannel,
                templateType: formData.templateType || selectedTemplateId || "promotion",
                status: "in_progress",
                header: formData.header || "",
                subject: formData.subject || "",
                previewText: formData.previewText || "",
                body: formData.body || "",
                footer: formData.footer || "",
                bannerIncluded:
                    formData.bannerIncluded !== undefined
                        ? Boolean(formData.bannerIncluded)
                        : (formData.templateType === "promotion"),
                bannerType: formData.bannerType || "special_offer",
                bannerImageUrl: formData.bannerImageUrl || "",
                buttonLabel: formData.buttonLabel || (activeChannel === "gmail" ? "Shop now" : ""),
                buttonType: formData.buttonType || (activeChannel === "whatsapp" ? "reply" : "none"),
                buttonUrl: formData.buttonUrl || formData.shortUrl || "https://yourbrand.in/s/x7Qa",
                shortUrl: formData.shortUrl || "https://yourbrand.in/s/x7Qa",
                trackableShortLink: formData.shortUrl || "https://yourbrand.in/s/x7Qa",
                otpCode: formData.otpCode || "546372",
                securityNote: formData.securityNote || "",
                fromEmail: formData.fromEmail || "offers@yourbrand.in",
                fromNumber: formData.fromNumber || "",
                recipients,
            };

            const result = await dispatch(sendCampaign(payload)).unwrap();
            showToast(
                `Campaign "${result?.name || payload.name}" successfully sent to ${selectedUsers.length} user(s) via ${activeChannel.toUpperCase()}!`,
                "success"
            );
        } catch (err) {
            console.error("sendCampaign dispatch error:", err);
            showToast(
                typeof err === "string" ? err : err?.message || "Failed to dispatch campaign",
                "error"
            );
        } finally {
            setLocalIsSending(false);
        }
    }, [selectedUsers, formData, activeChannel, selectedTemplateId, dispatch]);

    // Handle template click
    const handleSelectTemplate = useCallback(
        (tpl) => {
            setSelectedTemplateId(tpl.id);
            setFormData((prev) => ({
                ...prev,
                templateType: tpl.templateType || tpl.id || prev.templateType,
                header: tpl.header !== undefined ? tpl.header : prev.header,
                subject: tpl.subject !== undefined ? tpl.subject : prev.subject,
                body: tpl.body !== undefined ? tpl.body : prev.body,
                footer: tpl.footer !== undefined ? tpl.footer : prev.footer,
                buttonLabel: tpl.buttonLabel !== undefined ? tpl.buttonLabel : prev.buttonLabel,
                buttonType: tpl.buttonType || prev.buttonType,
                otpCode: tpl.otpCode || prev.otpCode,
            }));
            showToast(`Template "${tpl.name}" applied`, "success");
        },
        []
    );

    const handleCopyCode = useCallback((code, e) => {
        e?.stopPropagation();
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(code);
        }
        showToast(`Promo code "${code}" copied!`, "success");
    }, []);

    // Structure blocks definition according to active channel
    const structureBlocks = useMemo(() => {
        if (activeChannel === "whatsapp") {
            return [
                {
                    key: "header",
                    label: "Header",
                    value: formData.header || "Welcome to {company}",
                    inUse: true,
                },
                {
                    key: "body",
                    label: "Body",
                    value: formData.body || "Hi {name}, thanks for joining...",
                    inUse: true,
                },
                {
                    key: "footer",
                    label: "Footer",
                    value: formData.footer || "Reply STOP to opt out",
                    inUse: true,
                },
                {
                    key: "button",
                    label: "Button",
                    value: formData.buttonLabel || "Shop now",
                    inUse: true,
                },
            ];
        }
        if (activeChannel === "gmail") {
            return [
                {
                    key: "subject",
                    label: "Subject",
                    value: formData.subject || "Welcome to {company}",
                    inUse: true,
                },
                {
                    key: "body",
                    label: "Body",
                    value: formData.body || "Hi {name}, thanks for joining...",
                    inUse: true,
                },
                {
                    key: "footer",
                    label: "Footer",
                    value: formData.footer || "Reply STOP to opt out",
                    inUse: true,
                },
                {
                    key: "button",
                    label: "Button",
                    value: "Not used in Gmail",
                    inUse: false,
                },
            ];
        }
        // SMS
        return [
            {
                key: "header",
                label: "Header",
                value: "Not used in SMS",
                inUse: false,
            },
            {
                key: "body",
                label: "Body",
                value: formData.body || "Hi {name}, thanks for joining...",
                inUse: true,
            },
            {
                key: "footer",
                label: "Footer",
                value: formData.footer || "Reply STOP to opt out",
                inUse: true,
            },
            {
                key: "button",
                label: "Button",
                value: "Not used in SMS",
                inUse: false,
            },
        ];
    }, [activeChannel, formData]);

    // Preview rendered text with interpolated variables
    const sampleUserName = selectedUsers[0]?.name?.split(" ")[0] || "there";

    const previewHeader = useMemo(() => {
        const text = formData.header || "Welcome to {company}";
        return text
            .replace(/\{name\}/gi, sampleUserName)
            .replace(/\{company\}/gi, "[Company]")
            .replace(/\{date\}/gi, "Nov 20")
            .replace(/\{link\}/gi, "https://bit.ly/3xyz");
    }, [formData.header, sampleUserName]);

    const previewSubject = useMemo(() => {
        const text = formData.subject || "Welcome to {company}";
        return text
            .replace(/\{name\}/gi, sampleUserName)
            .replace(/\{company\}/gi, "[Company]")
            .replace(/\{date\}/gi, "Nov 20")
            .replace(/\{link\}/gi, "https://bit.ly/3xyz");
    }, [formData.subject, sampleUserName]);

    const previewBody = useMemo(() => {
        const text =
            formData.body ||
            "Hi {name}, thanks for joining us! Enjoy 10% off your first order with code WELCOME10.";
        return text
            .replace(/\{name\}/gi, sampleUserName)
            .replace(/\{company\}/gi, "[Company]")
            .replace(/\{date\}/gi, "Nov 20")
            .replace(/\{link\}/gi, "https://bit.ly/3xyz");
    }, [formData.body, sampleUserName]);

    const previewFooter = useMemo(() => {
        const text = formData.footer || "Reply STOP to opt out";
        return text
            .replace(/\{name\}/gi, sampleUserName)
            .replace(/\{company\}/gi, "[Company]")
            .replace(/\{date\}/gi, "Nov 20")
            .replace(/\{link\}/gi, "https://bit.ly/3xyz");
    }, [formData.footer, sampleUserName]);

    if (!hasChannelAccess) {
        return null;
    }

    return (
        <Container
            version="v0"
            className="w-full flex overflow-hidden h-full"
            style={{ height: "calc(100vh - 60px)" }}
        >
            {/* ----------------- LEFT COLUMN: USERS ----------------- */}
            <aside
                className="w-25 bordr overflow-auto h-full"
                style={{ height: "calc(100vh - 60px)" }}
            >
                <div className="sticky top-0 left-0 bg-white p-10 z-10">
                    <Fields
                        type="input"
                        icon="Search"
                        iconPosition="left"
                        placeholder="Search users..."
                        value={userSearchQuery}
                        onChange={(val) => setUserSearchQuery(val || "")}
                    />
                    <div className="flex items-center gap-8 mt-8">
                        {USER_FILTERS.map((f) => {
                            const isActive = userFilter === f;
                            return (
                                <button
                                    key={f}
                                    type="button"
                                    onClick={() => setUserFilter(f)}
                                    className="rounded-20 border-0 cursor-pointer mini-text font-500 transition-all"
                                    style={{
                                        padding: "4px 14px",
                                        backgroundColor: isActive ? "#1e293b" : "transparent",
                                        color: isActive ? "#ffffff" : "#475569",
                                        border: "none",
                                    }}
                                >
                                    {f}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-10">
                    <div className="flex items-center gap-8 mb-10 pb-8 bordb" style={{ borderColor: "#f1f5f9" }}>
                        <input
                            type="checkbox"
                            id="selectAllUsers"
                            checked={allShownSelected}
                            onChange={handleToggleSelectAll}
                            className="cursor-pointer"
                            style={{
                                width: "16px",
                                height: "16px",
                                accentColor: "#1e3a8a",
                            }}
                        />
                        <label
                            htmlFor="selectAllUsers"
                            className="small-text text-dark font-500 cursor-pointer"
                        >
                            Select all shown
                        </label>
                    </div>

                    <div className="grid-cols-1 gap-6">
                        {loadingLeads && filteredUsers.length === 0 ? (
                            <div className="grid-cols-1 gap-6">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center gap-10 p-8 rounded-8 bg-forth animate-pulse">
                                        <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: "#e2e8f0" }} />
                                        <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "#e2e8f0" }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ width: "60%", height: 10, borderRadius: 4, backgroundColor: "#e2e8f0", marginBottom: 6 }} />
                                            <div style={{ width: "40%", height: 8, borderRadius: 4, backgroundColor: "#f1f5f9" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            filteredUsers.map((user) => {
                                const isSelected = selectedUserIds.includes(user.id);
                                const isEmailChannel = activeChannel === "gmail";
                                const contactInfo = isEmailChannel
                                    ? (user.email || user.mobile || user.phone || "—")
                                    : (user.mobile || user.phone || user.email || "—");

                                return (
                                    <div
                                        key={user.id}
                                        onClick={() => handleToggleUser(user.id)}
                                        className="flex items-center justify-between p-8 rounded-8 cursor-pointer transition-all"
                                        style={{
                                            backgroundColor: isSelected ? "#f8fafc" : "#ffffff",
                                        }}
                                    >
                                        <div className="flex items-center gap-10 overflow-hidden">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleToggleUser(user.id)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="cursor-pointer flex-shrink-0"
                                                style={{
                                                    width: "16px",
                                                    height: "16px",
                                                    accentColor: "#1e3a8a",
                                                }}
                                            />
                                            <span
                                                className="rounded-full flex items-center justify-center mini-text font-600 flex-shrink-0"
                                                style={{
                                                    width: "28px",
                                                    height: "28px",
                                                    backgroundColor: `${user.color}18`,
                                                    color: user.color,
                                                }}
                                            >
                                                {user.avatar}
                                            </span>
                                            <div className="overflow-hidden">
                                                <p className="small-text font-500 text-dark truncate">
                                                    {user.name}
                                                </p>
                                                <p
                                                    className="mini-text text-gray truncate"
                                                    style={{ fontSize: "11px" }}
                                                >
                                                    {contactInfo}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {!loadingLeads && filteredUsers.length === 0 && (
                            <p className="mini-text text-gray text-center py-20">
                                {userFilter === "Customers" ? "No customers found" : "No users found"}
                            </p>
                        )}
                    </div>
                </div>
            </aside>

            {/* ----------------- MIDDLE COLUMN: CHANNEL SECTION ----------------- */}
            <div className="w-45 bg-forth overflow-auto h-full" style={{ height: "calc(100vh - 60px)" }}>
                {activeChannel === "whatsapp" && (
                    <WhatsappSection
                        formData={formData}
                        onChangeField={handleChangeField}
                        selectedUsers={selectedUsers}
                        onClearSelection={handleClearSelection}
                        onSend={handleSend}
                        isSending={isSending}
                    />
                )}

                {activeChannel === "gmail" && (
                    <GmailSection
                        formData={formData}
                        onChangeField={handleChangeField}
                        selectedUsers={selectedUsers}
                        onClearSelection={handleClearSelection}
                        onSend={handleSend}
                        isSending={isSending}
                    />
                )}

                {activeChannel === "sms" && (
                    <SmsSection
                        formData={formData}
                        onChangeField={handleChangeField}
                        selectedUsers={selectedUsers}
                        onClearSelection={handleClearSelection}
                        onSend={handleSend}
                        isSending={isSending}
                    />
                )}
            </div>

            {/* ----------------- RIGHT COLUMN: TEMPLATES & PREVIEW ----------------- */}
            <aside
                className="w-30 bordl overflow-auto h-full flex flex-column bg-white"
                style={{ height: "calc(100vh - 60px)" }}
            >
                {/* Sticky Tab Header */}
                <div className="sticky top-0 bg-white z-10 px-14 pt-10 bordb">
                    <Tab
                        tabs={rightTabs}
                        activeTab={rightTab}
                        onChange={setRightTab}
                        version="v1"
                    />
                </div>

                <div className="p-14 flex-1 overflow-auto">
                    {/* TAB 1: PREVIEW */}
                    {rightTab === "preview" && (
                        <div>
                            {/* WhatsApp Preview */}
                            {activeChannel === "whatsapp" && (
                                <WhatsappTemplateMockup
                                    templateType={formData.templateType || "welcome"}
                                    formData={formData}
                                    sampleUserName={sampleUserName}
                                />
                            )}

                            {/* SMS Preview */}
                            {activeChannel === "sms" && (
                                <SmsTemplateMockup
                                    templateType={formData.templateType || "promotion"}
                                    formData={formData}
                                    sampleUserName={sampleUserName}
                                />
                            )}

                            {/* Gmail Preview */}
                            {activeChannel === "gmail" && (
                                <GmailTemplateMockup
                                    templateType={formData.templateType || "promotion"}
                                    formData={formData}
                                    sampleUserName={sampleUserName}
                                />
                            )}
                        </div>
                    )}

                    {/* TAB 2: SAVED TEMPLATES */}
                    {rightTab === "templates" && (
                        <div className="grid-cols-1 gap-8">
                            {channelTemplates.map((tpl) => {
                                const isSelected = selectedTemplateId === tpl.id;
                                return (
                                    <div
                                        key={tpl.id}
                                        onClick={() => handleSelectTemplate(tpl)}
                                        className="flex items-center gap-10 p-12 rounded-8 cursor-pointer transition-all border-tertiary"
                                        style={{
                                            background: isSelected
                                                ? "var(--forth)"
                                                : "var(--white)",
                                            border: isSelected
                                                ? "1px solid var(--primary)"
                                                : "1px solid var(--tertiary)",
                                        }}
                                    >
                                        <TemplateFolderIcon size={46} />
                                        <div className="overflow-hidden flex-1">
                                            <div className="flex items-center justify-between">
                                                <h5 className="headmini-text font-600 text-dark">
                                                    {tpl.name}
                                                </h5>
                                                {isSelected && (
                                                    <span className="mini-text font-600 text-primary bg-light-primary px-6 py-2 rounded-5">
                                                        In use
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mini-text text-gray font-400 mt-2">
                                                {tpl.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </aside>
        </Container>
    );
};

export default React.memo(Campaign);
