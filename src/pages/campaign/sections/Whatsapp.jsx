import React, { useState, useCallback } from "react";
import Fields from "../../../components/forms/Fields";
import Button from "../../../components/common/Button";
import { SendingToChips, WhatsappTemplateMockup } from "../campaignComponents";

// 3 Core WhatsApp Templates
const WHATSAPP_TEMPLATES = [
    {
        id: "promotion",
        name: "Promotion",
        tag: "20% OFF",
        icon: "🎉",
        description: "Special offer banner with quick reply button",
        data: {
            templateType: "promotion",
            campaignName: "Festive Special Offer - 20% OFF",
            header: "",
            body: "Hi Aarav,\n\nEnjoy 20% OFF on select items at Company.\n\nThis limited-time offer is valid until 30 Nov 2026.\n\nReply SHOP to see what's included!",
            footer: "",
            buttonLabel: "SHOP",
            buttonType: "reply",
        },
    },
    {
        id: "otp",
        name: "OTP Code",
        tag: "546372",
        icon: "🔐",
        description: "Security verification code with one-tap copy button",
        data: {
            templateType: "otp",
            campaignName: "Authentication Verification OTP",
            otpCode: "546372",
            header: "",
            body: "546372 is your verification code. For your security, do not share this code.",
            footer: "",
            buttonLabel: "Copy Code",
            buttonType: "copy_code",
        },
    },
    {
        id: "welcome",
        name: "Welcome",
        tag: "10% OFF",
        icon: "👋",
        description: "Onboarding welcome message with Shop now action",
        data: {
            templateType: "welcome",
            campaignName: "Welcome offer - November",
            header: "Welcome to [Company]",
            body: "Hi Aarav, thanks for joining us! Enjoy 10% off your first order with code WELCOME10.",
            footer: "Reply STOP to opt out",
            buttonLabel: "Shop now",
            buttonType: "url",
        },
    },
];

const WhatsappSection = React.memo(
    ({
        formData,
        onChangeField,
        selectedUsers = [],
        onClearSelection,
        onSend,
        isSending = false,
    }) => {
        const currentType = formData.templateType || "welcome";
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

        return (
            <div
                className="flex flex-column justify-between w-full"
                style={{ minHeight: "100%" }}
            >
                {/* Fixed Top Header with View Switcher */}
                <div className="bg-white bordb p-10 px-14 sticky top-0 left-0 z-10 flex items-center justify-between">
                    <div>
                        <h5 className="mid-text capitalize text-dark font-600">
                            Whatsapp Campaign
                        </h5>
                        <p className="mini-text text-gray" style={{ fontSize: "11px" }}>
                            Choose from 3 pre-approved Meta WhatsApp templates
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
                            📱 Preview
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div
                    className="p-14 flex-1 overflow-auto"
                    style={{ minHeight: "calc(100vh - 165px)" }}
                >
                    {/* 3 WhatsApp Templates Selector Cards */}
                    <div className="mb-14">
                        <label className="mini-text font-600 text-gray uppercase block mb-8" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>
                            Select Message Template
                        </label>
                        <div className="grid grid-cols-3 gap-10">
                            {WHATSAPP_TEMPLATES.map((tpl) => {
                                const isSelected = currentType === tpl.id;
                                return (
                                    <div
                                        key={tpl.id}
                                        onClick={() => handleSelectTemplate(tpl)}
                                        className="p-10 rounded-10 cursor-pointer transition-all relative flex flex-column justify-between bg-white"
                                        style={{
                                            border: isSelected ? "2px solid #005c4b" : "1px solid #e2e8f0",
                                            boxShadow: isSelected
                                                ? "0 4px 12px rgba(0, 92, 75, 0.12)"
                                                : "0 1px 2px rgba(0,0,0,0.03)",
                                            backgroundColor: isSelected ? "#f0fdf4" : "#ffffff",
                                        }}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <span style={{ fontSize: "18px" }}>{tpl.icon}</span>
                                                <span
                                                    className="mini-text font-700 px-6 py-1 rounded-4"
                                                    style={{
                                                        fontSize: "10px",
                                                        backgroundColor: isSelected ? "#005c4b" : "#f1f5f9",
                                                        color: isSelected ? "#ffffff" : "#475569",
                                                    }}
                                                >
                                                    {tpl.tag}
                                                </span>
                                            </div>
                                            <p
                                                className="small-text font-700 text-dark"
                                                style={{ fontSize: "13px", color: isSelected ? "#005c4b" : "#0f172a" }}
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
                                                    color: isSelected ? "#005c4b" : "#94a3b8",
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

                            {/* Template-Specific Fields */}

                            {/* A. OTP TEMPLATE FIELDS */}
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
                                        <Fields
                                            type="input"
                                            label="Sample OTP Code"
                                            value={formData.otpCode || "546372"}
                                            onChange={(val) => {
                                                onChangeField("otpCode", val);
                                                onChangeField(
                                                    "body",
                                                    `${val} is your verification code. For your security, do not share this code.`
                                                );
                                            }}
                                            placeholder="546372"
                                        />

                                        <Fields
                                            type="textarea"
                                            label="Message body"
                                            value={formData.body || "546372 is your verification code. For your security, do not share this code."}
                                            onChange={(val) => onChangeField("body", val)}
                                            style={{ minHeight: "80px", width: "96%" }}
                                        />

                                        <Fields
                                            type="input"
                                            label="One-tap Button Label"
                                            value={formData.buttonLabel || "Copy Code"}
                                            onChange={(val) => onChangeField("buttonLabel", val)}
                                            placeholder="Copy Code"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* B. PROMOTION TEMPLATE FIELDS */}
                            {currentType === "promotion" && (
                                <div
                                    className="p-12 rounded-10 bg-white"
                                    style={{ border: "1px solid #e2e8f0" }}
                                >
                                    <div className="flex items-center gap-6 mb-10 text-primary">
                                        <span style={{ fontSize: "16px" }}>🎉</span>
                                        <h6 className="mid-text font-500 text-dark">
                                            Promotion Offer Settings
                                        </h6>
                                    </div>

                                    <div className="grid-cols-1 gap-10">
                                        <div
                                            className="p-10 rounded-8 flex items-center justify-between"
                                            style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}
                                        >
                                            <div className="flex items-center gap-8">
                                                <span style={{ fontSize: "20px" }}>🎁</span>
                                                <div>
                                                    <p className="small-text font-700 text-dark">
                                                        Special Offer Banner Included
                                                    </p>
                                                    <p className="mini-text text-gray" style={{ fontSize: "11px" }}>
                                                        Includes 3D Gift Box, Shopping Bags & Limited Time Only Tag
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="mini-text font-700 text-success">
                                                Active
                                            </span>
                                        </div>

                                        <Fields
                                            type="textarea"
                                            label="Promotion Message Body"
                                            value={formData.body || "Hi Aarav,\n\nEnjoy 20% OFF on select items at Company.\n\nThis limited-time offer is valid until 30 Nov 2026.\n\nReply SHOP to see what's included!"}
                                            onChange={(val) => onChangeField("body", val)}
                                            style={{ minHeight: "120px", width: "96%" }}
                                        />

                                        <Fields
                                            type="input"
                                            label="Quick Reply Button"
                                            value={formData.buttonLabel || "SHOP"}
                                            onChange={(val) => onChangeField("buttonLabel", val)}
                                            placeholder="SHOP"
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
                                            type="input"
                                            label="Header"
                                            value={formData.header || "Welcome to [Company]"}
                                            onChange={(val) => onChangeField("header", val)}
                                            placeholder="Welcome to [Company]"
                                        />

                                        <Fields
                                            type="textarea"
                                            label="Message body"
                                            value={formData.body || "Hi Aarav, thanks for joining us! Enjoy 10% off your first order with code WELCOME10."}
                                            onChange={(val) => onChangeField("body", val)}
                                            placeholder="Hi {name}, thanks for joining us! Enjoy 10% off your first order with code WELCOME10."
                                            style={{ minHeight: "110px", width: "96%" }}
                                        />

                                        <Fields
                                            type="input"
                                            label="Footer"
                                            value={formData.footer || "Reply STOP to opt out"}
                                            onChange={(val) => onChangeField("footer", val)}
                                            placeholder="Reply STOP to opt out"
                                        />

                                        <Fields
                                            type="input"
                                            label="Action Button Label"
                                            value={formData.buttonLabel || "Shop now"}
                                            onChange={(val) => onChangeField("buttonLabel", val)}
                                            placeholder="Shop now"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW 2: DEDICATED PREVIEW VIEW */}
                    {activeView === "preview" && (
                        <div className="flex flex-column items-center">
                            <div style={{ maxWidth: "420px", width: "100%" }}>
                                <WhatsappTemplateMockup
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
                    <p className="mini-text text-gray font-500">
                        {charCount} characters
                    </p>

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

WhatsappSection.displayName = "WhatsappSection";

export default WhatsappSection;
