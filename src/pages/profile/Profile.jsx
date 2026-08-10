import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FormBuilder from "../../components/common/FormBuilder";
import Button from "../../components/common/Button";
import { updateUser as updateUserAction } from "../../feature/authSlice";
import { updateUser as updateUserApi, getProfile as getProfileApi } from "../../api/userApi";
import Container from "../../components/common/Container";

const fileToDataUri = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

const Profile = () => {
  const { user } = useSelector((state) => state.auth) || {};
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfileApi();
        const profileData = profile?.data || profile;
        if (profileData) {
          dispatch(updateUserAction(profileData));
        }
      } catch (err) {
        console.warn("Could not retrieve fresh profile from server:", err);
      }
    };
    fetchProfile();
  }, [dispatch]);

  const [profileForm, setProfileForm] = useState({
    fullname: "",
    email: "",
    mobile: "",
    role: "vendor",
    status: "Active",
    otpStatus: "Verified",
    createdAt: "",
    lastLogin: "",
    image: "",
    address_street: "",
    address_city: "",
    address_state: "",
    address_country: "",
    address_pincode: "",
    shop_shopName: "",
    shop_businessType: "",
    shop_category: "",
    shop_gstNumber: "",
    shop_panNumber: "",
    shop_shopLicenseNumber: ""
  });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileForm({
        fullname: user.fullname || "",
        email: user.email || "",
        mobile: user.mobile || "",
        role: user.role || "vendor",
        status: user.status !== false && user.status !== "Inactive" ? "Active" : "Inactive",
        otpStatus: user.isOtpVerified ? "Verified" : "Unverified",
        createdAt: user.createdAt ? new Date(user.createdAt.$date || user.createdAt).toLocaleString() : "",
        lastLogin: user.lastLogin ? new Date(user.lastLogin.$date || user.lastLogin).toLocaleString() : "",
        image: user.image || "",
        address_street: user.address?.[0]?.street || "",
        address_city: user.address?.[0]?.city || "",
        address_state: user.address?.[0]?.state || "",
        address_country: user.address?.[0]?.country || "",
        address_pincode: user.address?.[0]?.pincode || "",
        shop_shopName: user.shopDetails?.shopName || "",
        shop_businessType: user.shopDetails?.businessType || "",
        shop_category: user.shopDetails?.category || "",
        shop_gstNumber: user.shopDetails?.gstNumber || "",
        shop_panNumber: user.shopDetails?.panNumber || "",
        shop_shopLicenseNumber: user.shopDetails?.shopLicenseNumber || ""
      });
    }
  }, [user]);

  const personalFields = [
    { name: "fullname", type: "text", label: "Full Name", validation: { required: true } },
    { name: "email", type: "email", label: "Email Address", validation: { required: true, email: true } },
    { name: "mobile", type: "tel", label: "Phone Number", validation: { required: true, mobile: true } },
    { name: "image", type: "dragfile", label: "Profile Image" },
    { name: "role", type: "text", label: "Role (Read-only)", readOnly: true, style: { backgroundColor: "#f8fafc", color: "#475569" } },
    { name: "status", type: "text", label: "Account Status (Read-only)", readOnly: true, style: { backgroundColor: "#f8fafc", color: "#475569" } },
    { name: "otpStatus", type: "text", label: "OTP Verification Status (Read-only)", readOnly: true, style: { backgroundColor: "#f8fafc", color: "#475569" } },
    { name: "createdAt", type: "text", label: "Account Created At (Read-only)", readOnly: true, style: { backgroundColor: "#f8fafc", color: "#475569" } },
    { name: "lastLogin", type: "text", label: "Last Login Time (Read-only)", readOnly: true, style: { backgroundColor: "#f8fafc", color: "#475569" } }
  ];

  const addressFields = [
    { name: "address_street", type: "text", label: "Street Address" },
    { name: "address_city", type: "text", label: "City" },
    { name: "address_state", type: "text", label: "State" },
    { name: "address_country", type: "text", label: "Country" },
    { name: "address_pincode", type: "text", label: "Pincode" }
  ];

  const shopDetailsFields = [
    { name: "shop_shopName", type: "text", label: "Shop Name" },
    { name: "shop_businessType", type: "text", label: "Business Type" },
    { name: "shop_category", type: "text", label: "Shop Category" },
    { name: "shop_gstNumber", type: "text", label: "GST Number" },
    { name: "shop_panNumber", type: "text", label: "PAN Number" },
    { name: "shop_shopLicenseNumber", type: "text", label: "Shop License Number" }
  ];

  const sections = [
    { title: "Personal & Account Information", fields: personalFields },
    { title: "Address Details", fields: addressFields },
    { title: "Shop Details", fields: shopDetailsFields }
  ];

  const handleProfileSubmit = async (e) => {
    e?.preventDefault();

    if (!profileForm.fullname) {
      alert("Full Name is required");
      return;
    }
    if (!profileForm.email) {
      alert("Email is required");
      return;
    }
    if (!profileForm.mobile) {
      alert("Phone Number is required");
      return;
    }

    let imageVal = profileForm.image;
    if (Array.isArray(imageVal) && imageVal.length > 0) {
      const firstItem = imageVal[0];
      if (firstItem instanceof File) {
        imageVal = await fileToDataUri(firstItem);
      } else if (typeof firstItem === "string") {
        imageVal = firstItem;
      } else if (typeof firstItem === "object" && (firstItem.url || firstItem.src)) {
        imageVal = firstItem.url || firstItem.src;
      }
    } else if (imageVal instanceof File) {
      imageVal = await fileToDataUri(imageVal);
    }

    const payload = {
      fullname: profileForm.fullname,
      email: profileForm.email,
      mobile: profileForm.mobile,
      image: imageVal || "",
      address: [
        {
          street: profileForm.address_street,
          city: profileForm.address_city,
          state: profileForm.address_state,
          country: profileForm.address_country,
          pincode: profileForm.address_pincode
        }
      ],
      shopDetails: {
        shopName: profileForm.shop_shopName,
        businessType: profileForm.shop_businessType,
        category: profileForm.shop_category,
        gstNumber: profileForm.shop_gstNumber,
        panNumber: profileForm.shop_panNumber,
        shopLicenseNumber: profileForm.shop_shopLicenseNumber
      }
    };

    const userId = user?._id || user?.id;

    try {
      if (userId) {
        const response = await updateUserApi(userId, payload);
        const updatedData = response?.data || response;
        dispatch(updateUserAction(updatedData || { ...user, ...payload }));
        alert("Profile updated successfully on the server!");
      } else {
        dispatch(updateUserAction({ ...user, ...payload }));
        alert("Profile updated successfully locally!");
      }
    } catch (err) {
      console.warn("Failed to update profile on the server, falling back to session update:", err);
      dispatch(updateUserAction({ ...user, ...payload }));
      alert("Profile updated locally (offline mode).");
    }
  };

  return (
    <Container version="v4" style={{ background: 'var(--forth)' }}>
      <form onSubmit={handleProfileSubmit} className="grid-cols-1 gap-12">

        {sections.map((section, idx) => (
          <div key={idx} className="bg-white p-20 rounded-5">
            <h3 className="mid-text text-dark font-500 pb-20">{section.title}</h3>
            <FormBuilder
              fields={section.fields}
              col="3"
              value={profileForm}
              onChange={setProfileForm}
              buttonClassName="hidden"
            />
          </div>
        ))}

        <div className="bg-white px-15 py-10 rounded-5 flex justify-end">
          <Button type="submit" version="v2" bg="primary" text='Save Changes' />
        </div>

      </form>
    </Container>
  );
};

export default Profile;
