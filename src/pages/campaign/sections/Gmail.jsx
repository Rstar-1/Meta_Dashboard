import React, { useState, useCallback } from "react";
import Fields from "../../../components/forms/Fields";
import Button from "../../../components/common/Button";
import { SendingToChips, GmailTemplateMockup } from "../campaignComponents";

// 3 Pre-approved Gmail / Nodemailer Templates matching backend template.data.js & nodemailer.service.js
const GMAIL_TEMPLATES = [
    {
        id: "promotion",
        name: "Promotion",
        tag: "20% OFF",
        icon: "🎉",
        description: "Special offer email with visual banner & Shop now CTA",
        data: {
            templateType: "promotion",
            campaignName: "Festive Gmail Offer - 20% OFF",
            fromEmail: "offers@yourbrand.in",
            subject: "Aarav, enjoy 20% OFF – limited time only",
            previewText: "Enjoy 20% OFF on select items at Company. Valid till 30 Nov 2026.",
            body: "Enjoy 20% OFF on select items at Company.\nThis limited-time offer is valid until 30 Nov 2026.",
            bannerIncluded: true,
            bannerImageUrl: "",
            buttonLabel: "Shop now",
            buttonUrl: "https://yourbrand.in/shop",
            footer: "You received this because you opted in. Unsubscribe",
        },
    },
    {
        id: "otp",
        name: "OTP Code",
        tag: "546372",
        icon: "🔐",
        description: "Security verification code with high-contrast digits",
        data: {
            templateType: "otp",
            campaignName: "Security Verification Code",
            fromEmail: "no-reply@yourbrand.in",
            subject: "546372 is your verification code",
            previewText: "For your security, do not share this code.",
            otpCode: "546372",
            securityNote: "For your security, do not share this code. It expires in 10 minutes.",
            body: "546372 is your verification code.\nFor your security, do not share this code. It expires in 10 minutes.",
            bannerIncluded: false,
            bannerImageUrl: "",
            buttonLabel: "",
            buttonUrl: "",
            footer: "If you did not request this, ignore this email.",
        },
    },
    {
        id: "welcome",
        name: "Welcome",
        tag: "10% OFF",
        icon: "👋",
        description: "Customer onboarding with welcome discount code",
        data: {
            templateType: "welcome",
            campaignName: "Welcome onboarding - November",
            fromEmail: "welcome@yourbrand.in",
            subject: "Welcome to Company 🎉 Your 10% off is inside",
            previewText: "Thanks for joining us! Enjoy 10% off your first order.",
            body: "Hi Aarav, thanks for joining us!\nEnjoy 10% off your first order with code WELCOME10.",
            bannerIncluded: false,
            bannerImageUrl: "",
            buttonLabel: "Shop now",
            buttonUrl: "https://yourbrand.in/welcome",
            footer: "You received this because you opted in. Unsubscribe",
        },
    },
];

const GmailSection = React.memo(
    ({
        formData,
        onChangeField,
        selectedUsers = [],
        onClearSelection,
        onSend,
        isSending = false,
    }) => {
        const currentType = formData.templateType || "promotion";
        const [activeView, setActiveView] = useState("form"); // 'form' | 'preview'
        const charCount = (formData.body || "").length;

        // Apply a template directly
        const handleSelectTemplate = useCallback(
            (tpl) => {
                Object.entries(tpl.data).forEach(([key, val]) => {
                    onChangeField(key, val);
                });
            },
            [onChangeField]
        );

        // Toggle banner included flag
        const handleToggleBanner = useCallback(() => {
            const current =
                formData.bannerIncluded !== undefined
                    ? Boolean(formData.bannerIncluded)
                    : currentType === "promotion";
            onChangeField("bannerIncluded", !current);
        }, [formData.bannerIncluded, currentType, onChangeField]);

        const isBannerActive =
            formData.bannerIncluded !== undefined
                ? Boolean(formData.bannerIncluded)
                : currentType === "promotion";

        return (
            <div
                className="flex flex-column justify-between w-full"
                style={{ minHeight: "100%" }}
            >
                {/* Fixed Top Header with View Switcher */}
                <div className="bg-white bordb p-10 px-14 sticky top-0 left-0 z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-8">
                            <h5 className="mid-text capitalize text-dark font-600">
                                ✉️ Gmail Campaign
                            </h5>
                            <span
                                className="px-6 py-2 rounded-4 mini-text font-600"
                                style={{
                                    backgroundColor: "#ecfdf5",
                                    color: "#047857",
                                    border: "1px solid #a7f3d0",
                                    fontSize: "10px",
                                }}
                            >
                                ✓ Nodemailer SMTP
                            </span>
                        </div>
                        <p className="mini-text text-gray mt-2" style={{ fontSize: "11px" }}>
                            Choose from pre-approved responsive email templates dispatched strictly via Nodemailer
                        </p>
                    </div>

                    {/* View Switcher Pills */}
                    <div
                        className="flex items-center p-2 rounded-8"
                        style={{ backgroundColor: "#f1f5f9" }}
                    >
                        <button
                            type="button"
                            onClick={() => setActiveView("form")}
                            className="px-10 py-4 rounded-6 mini-text font-600 border-0 cursor-pointer transition-all"
                            style={{
                                backgroundColor: activeView === "form" ? "#ffffff" : "transparent",
                                color: activeView === "form" ? "#0f172a" : "#64748b",
                                boxShadow: activeView === "form" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                            }}
                        >
                            ✏️ Fields
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveView("preview")}
                            className="px-10 py-4 rounded-6 mini-text font-600 border-0 cursor-pointer transition-all"
                            style={{
                                backgroundColor: activeView === "preview" ? "#ffffff" : "transparent",
                                color: activeView === "preview" ? "#0f172a" : "#64748b",
                                boxShadow: activeView === "preview" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                            }}
                        >
                            ✉️ Preview
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div
                    className="p-14 flex-1 overflow-auto"
                    style={{ minHeight: "calc(100vh - 165px)" }}
                >
                    {/* 3 Gmail Templates Selector Cards */}
                    <div className="mb-14">
                        <label
                            className="mini-text font-600 text-gray uppercase block mb-8"
                            style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}
                        >
                            Select Email Template
                        </label>
                        <div className="grid grid-cols-3 gap-10">
                            {GMAIL_TEMPLATES.map((tpl) => {
                                const isSelected = currentType === tpl.id;
                                return (
                                    <div
                                        key={tpl.id}
                                        onClick={() => handleSelectTemplate(tpl)}
                                        className="p-10 rounded-10 cursor-pointer transition-all relative flex flex-column justify-between bg-white"
                                        style={{
                                            border: isSelected ? "2px solid #0d9488" : "1px solid #e2e8f0",
                                            boxShadow: isSelected
                                                ? "0 4px 12px rgba(13, 148, 136, 0.12)"
                                                : "0 1px 2px rgba(0,0,0,0.03)",
                                            backgroundColor: isSelected ? "#f0fdfa" : "#ffffff",
                                        }}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <span style={{ fontSize: "18px" }}>{tpl.icon}</span>
                                                <span
                                                    className="mini-text font-700 px-6 py-1 rounded-4"
                                                    style={{
                                                        fontSize: "10px",
                                                        backgroundColor: isSelected ? "#0d9488" : "#f1f5f9",
                                                        color: isSelected ? "#ffffff" : "#475569",
                                                    }}
                                                >
                                                    {tpl.tag}
                                                </span>
                                            </div>
                                            <p
                                                className="small-text font-700 text-dark"
                                                style={{ fontSize: "13px", color: isSelected ? "#0d9488" : "#0f172a" }}
                                            >
                                                {tpl.name}
                                            </p>
                                            <p
                                                className="mini-text text-gray mt-2"
                                                style={{ fontSize: "11px", lineHeight: "1.3" }}
                                            >
                                                {tpl.description}
                                            </p>
                                        </div>

                                        <div className="mt-8 pt-6 bordh flex items-center justify-between">
                                            <span
                                                className="mini-text font-600"
                                                style={{
                                                    fontSize: "10.5px",
                                                    color: isSelected ? "#0d9488" : "#94a3b8",
                                                }}
                                            >
                                                {isSelected ? "✓ Active Template" : "Click to use"}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* VIEW 1: FORM FIELDS */}
                    {activeView === "form" && (
                        <div className="grid-cols-1 gap-12">
                            <Fields
                                type="input"
                                label="Campaign name"
                                value={formData.campaignName || ""}
                                onChange={(val) => onChangeField("campaignName", val)}
                                placeholder="Festive offer - November"
                            />

                            <SendingToChips selectedUsers={selectedUsers} />

                            <div className="grid grid-cols-2 gap-10">
                                <Fields
                                    type="input"
                                    label="Sender email address"
                                    value={formData.fromEmail || "offers@yourbrand.in"}
                                    onChange={(val) => onChangeField("fromEmail", val)}
                                    placeholder="offers@yourbrand.in"
                                />

                                <Fields
                                    type="input"
                                    label="Subject line"
                                    value={formData.subject || ""}
                                    onChange={(val) => onChangeField("subject", val)}
                                    placeholder="Aarav, enjoy 20% OFF – limited time only"
                                />
                            </div>

                            <Fields
                                type="input"
                                label="Inbox Preview Text (Preheader snippet)"
                                value={formData.previewText || ""}
                                onChange={(val) => onChangeField("previewText", val)}
                                placeholder="Enjoy 20% OFF on select items at Company. Valid till 30 Nov 2026."
                            />

                            {/* Template-Specific Settings */}

                            {/* A. PROMOTION TEMPLATE FIELDS */}
                            {currentType === "promotion" && (
                                <div
                                    className="p-12 rounded-10 bg-white"
                                    style={{ border: "1px solid #e2e8f0" }}
                                >
                                    <div className="flex items-center gap-6 mb-10 text-primary">
                                        <span style={{ fontSize: "16px" }}>🎉</span>
                                        <h6 className="mid-text font-500 text-dark">
                                            Promotion Template Settings
                                        </h6>
                                    </div>

                                    <div className="grid-cols-1 gap-10">
                                        {/* Banner Toggle Card */}
                                        <div
                                            onClick={handleToggleBanner}
                                            className="p-10 rounded-8 flex items-center justify-between cursor-pointer transition-all"
                                            style={{
                                                backgroundColor: isBannerActive ? "#f0fdf4" : "#f8fafc",
                                                border: isBannerActive ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
                                            }}
                                        >
                                            <div className="flex items-center gap-8">
                                                <span style={{ fontSize: "20px" }}>🎁</span>
                                                <div>
                                                    <p className="small-text font-700 text-dark">
                                                        Special Offer Banner Included
                                                    </p>
                                                    <p className="mini-text text-gray" style={{ fontSize: "11px" }}>
                                                        {isBannerActive
                                                            ? "Rendered with 3D Gift Box, Shopping Bags & 'SPECIAL OFFER' Tag"
                                                            : "Banner disabled - email will render pure text & CTA button"}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`mini-text font-700 px-8 py-3 rounded-4 ${
                                                    isBannerActive ? "text-success bg-white" : "text-gray"
                                                }`}
                                                style={{ border: isBannerActive ? "1px solid #86efac" : "none" }}
                                            >
                                                {isBannerActive ? "Active ✓" : "Off"}
                                            </span>
                                        </div>

                                        {isBannerActive && (
                                            <Fields
                                                type="input"
                                                label="Custom Banner Image URL (Optional)"
                                                value={formData.bannerImageUrl || ""}
                                                onChange={(val) => onChangeField("bannerImageUrl", val)}
                                                placeholder="https://yourbrand.in/banner.png (Leave blank for default 3D gradient)"
                                            />
                                        )}

                                        <Fields
                                            type="textarea"
                                            label="Offer Message Body"
                                            value={
                                                formData.body !== undefined
                                                    ? formData.body
                                                    : "Enjoy 20% OFF on select items at Company.\nThis limited-time offer is valid until 30 Nov 2026."
                                            }
                                            onChange={(val) => onChangeField("body", val)}
                                            style={{ minHeight: "90px", width: "96%" }}
                                        />

                                        <div className="grid grid-cols-2 gap-10">
                                            <Fields
                                                type="input"
                                                label="CTA Button Label"
                                                value={formData.buttonLabel || "Shop now"}
                                                onChange={(val) => onChangeField("buttonLabel", val)}
                                                placeholder="Shop now"
                                            />

                                            <Fields
                                                type="input"
                                                label="CTA Button Link URL"
                                                value={formData.buttonUrl || "https://yourbrand.in/shop"}
                                                onChange={(val) => onChangeField("buttonUrl", val)}
                                                placeholder="https://yourbrand.in/shop"
                                            />
                                        </div>

                                        <Fields
                                            type="input"
                                            label="Footer Disclaimer"
                                            value={
                                                formData.footer !== undefined
                                                    ? formData.footer
                                                    : "You received this because you opted in. Unsubscribe"
                                            }
                                            onChange={(val) => onChangeField("footer", val)}
                                            placeholder="You received this because you opted in. Unsubscribe"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* B. OTP TEMPLATE FIELDS */}
                            {currentType === "otp" && (
                                <div
                                    className="p-12 rounded-10 bg-white"
                                    style={{ border: "1px solid #e2e8f0" }}
                                >
                                    <div className="flex items-center gap-6 mb-10 text-primary">
                                        <span style={{ fontSize: "16px" }}>🔐</span>
                                        <h6 className="small-text font-700 text-dark">
                                            OTP Verification Settings
                                        </h6>
                                    </div>

                                    <div className="grid-cols-1 gap-10">
                                        <div className="grid grid-cols-2 gap-10">
                                            <Fields
                                                type="input"
                                                label="Sample OTP Code"
                                                value={formData.otpCode || "546372"}
                                                onChange={(val) => {
                                                    onChangeField("otpCode", val);
                                                    onChangeField(
                                                        "subject",
                                                        `${val} is your verification code`
                                                    );
                                                }}
                                                placeholder="546372"
                                            />

                                            <Fields
                                                type="input"
                                                label="Inbox Preview Text"
                                                value={formData.previewText || "For your security, do not share this code."}
                                                onChange={(val) => onChangeField("previewText", val)}
                                                placeholder="For your security, do not share this code."
                                            />
                                        </div>

                                        <Fields
                                            type="textarea"
                                            label="Security Warning Note / Message Body"
                                            value={
                                                formData.securityNote ||
                                                formData.body ||
                                                "For your security, do not share this code. It expires in 10 minutes."
                                            }
                                            onChange={(val) => {
                                                onChangeField("securityNote", val);
                                                onChangeField("body", val);
                                            }}
                                            style={{ minHeight: "80px", width: "96%" }}
                                        />

                                        <Fields
                                            type="input"
                                            label="Footer Disclaimer"
                                            value={
                                                formData.footer !== undefined
                                                    ? formData.footer
                                                    : "If you did not request this, ignore this email."
                                            }
                                            onChange={(val) => onChangeField("footer", val)}
                                            placeholder="If you did not request this, ignore this email."
                                        />
                                    </div>
                                </div>
                            )}

                            {/* C. WELCOME TEMPLATE FIELDS */}
                            {currentType === "welcome" && (
                                <div
                                    className="p-12 rounded-10 bg-white"
                                    style={{ border: "1px solid #e2e8f0" }}
                                >
                                    <div className="flex items-center gap-6 mb-10 text-primary">
                                        <span style={{ fontSize: "16px" }}>👋</span>
                                        <h6 className="small-text font-700 text-dark">
                                            Welcome Offer Settings
                                        </h6>
                                    </div>

                                    <div className="grid-cols-1 gap-10">
                                        <Fields
                                            type="textarea"
                                            label="Welcome Message Body"
                                            value={
                                                formData.body !== undefined
                                                    ? formData.body
                                                    : "Hi Aarav, thanks for joining us!\nEnjoy 10% off your first order with code WELCOME10."
                                            }
                                            onChange={(val) => onChangeField("body", val)}
                                            style={{ minHeight: "90px", width: "96%" }}
                                        />

                                        <div className="grid grid-cols-2 gap-10">
                                            <Fields
                                                type="input"
                                                label="CTA Button Label"
                                                value={formData.buttonLabel || "Shop now"}
                                                onChange={(val) => onChangeField("buttonLabel", val)}
                                                placeholder="Shop now"
                                            />

                                            <Fields
                                                type="input"
                                                label="CTA Button Link URL"
                                                value={formData.buttonUrl || "https://yourbrand.in/welcome"}
                                                onChange={(val) => onChangeField("buttonUrl", val)}
                                                placeholder="https://yourbrand.in/welcome"
                                            />
                                        </div>

                                        <Fields
                                            type="input"
                                            label="Footer Disclaimer"
                                            value={
                                                formData.footer !== undefined
                                                    ? formData.footer
                                                    : "You received this because you opted in. Unsubscribe"
                                            }
                                            onChange={(val) => onChangeField("footer", val)}
                                            placeholder="You received this because you opted in. Unsubscribe"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW 2: DEDICATED PREVIEW VIEW */}
                    {activeView === "preview" && (
                        <div className="flex flex-column items-center">
                            <div className="mb-10 px-12 py-6 rounded-8 flex items-center gap-8" style={{ backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0" }}>
                                <span style={{ fontSize: "14px" }}>✉️</span>
                                <span className="mini-text font-600 text-success">
                                    Nodemailer Responsive HTML Email Preview (matches buildCampaignHtml)
                                </span>
                            </div>
                            <div style={{ maxWidth: "500px", width: "100%" }}>
                                <GmailTemplateMockup
                                    templateType={currentType}
                                    formData={formData}
                                    sampleUserName={selectedUsers[0]?.name?.split(" ")[0] || "Kabir"}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed Bottom Action Bar */}
                <div className="flex items-center justify-between bg-white bordh p-10 px-14 sticky bottom-0 left-0 z-10">
                    <div>
                        <p className="mini-text text-gray font-500">
                            {charCount} characters
                        </p>
                        <span className="mini-text text-muted" style={{ fontSize: "10.5px" }}>
                            Engine: Nodemailer SMTP
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button
                            text="Clear selection"
                            bg="tertiary"
                            variant="outline"
                            color="dark"
                            version="v2"
                            onClick={onClearSelection}
                        />
                        <Button
                            text={
                                isSending
                                    ? "Sending..."
                                    : selectedUsers.length > 0
                                    ? `Send to ${selectedUsers.length} Users`
                                    : "Send to Users"
                            }
                            bg="primary"
                            color="white"
                            version="v2"
                            icon={isSending ? "" : "Send"}
                            onClick={onSend}
                            disabled={selectedUsers.length === 0 || isSending}
                        />
                    </div>
                </div>
            </div>
        );
    }
);

GmailSection.displayName = "GmailSection";

export default GmailSection;
