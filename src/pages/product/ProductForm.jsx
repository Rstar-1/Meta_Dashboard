import React from "react";
import Fields from "../../components/common/Fields";
import FormBuilder from "../../components/common/FormBuilder";
import Button from "../../components/common/Button";

const ProductForm = ({
  form,
  setForm,
  onSubmit,
  categoriesList = [],
  isEditingProduct = false,
  onCancel
}) => {
  if (!form) return null;

  const basicInfoFields = [
    { name: "name", label: "Product Name", type: "input", required: true },
    { name: "slug", label: "Slug", type: "input", required: true },
    { name: "sku", label: "SKU", type: "input", required: true },
    { name: "productCode", label: "Product Code", type: "input" },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: categoriesList.filter(c => c.name !== "All Products").map(c => ({ label: c.name, value: c.name }))
    },
    { name: "shortDesc", label: "Short Description", type: "textarea", required: true, className: "col-span-2" },
    { name: "desc", label: "Description", type: "textarea", required: true, className: "col-span-2" }
  ];

  const pricingStockFieldsRow1 = [
    { name: "price", label: "Price (INR)", type: "number", required: true },
    {
      name: "unit",
      label: "Unit",
      type: "select",
      options: [
        { label: "Kg", value: "Kg" },
        { label: "Pcs", value: "Pcs" },
        { label: "Mtr", value: "Mtr" }
      ]
    },
    { name: "currency", label: "Currency", type: "input", disabled: true }
  ];

  const pricingStockFieldsRow2 = [
    { name: "stock", label: "Stock", type: "number", required: true },
    { name: "reservedStock", label: "Reserved Stock", type: "number" },
    {
      name: "stockStatus",
      label: "Stock Status",
      type: "select",
      options: [
        { label: "In Stock", value: "In Stock" },
        { label: "Out of Stock", value: "Out of Stock" }
      ]
    }
  ];

  const pricingSwitches = [
    { name: "isTrending", label: "Is Trending" },
    { name: "isBestSeller", label: "Is Best Seller" }
  ];

  const seoFields = [
    { name: "metaTitle", label: "Meta Title", type: "input", limit: 60 },
    { name: "metaDesc", label: "Meta Description", type: "textarea", limit: 160 },
    { name: "metaKeywords", label: "Meta Keywords", type: "input", limit: 160 }
  ];

  const handleAddVariant = () => {
    setForm(prev => ({
      ...prev,
      variants: [
        ...(prev.variants || []),
        { size: "", color: "", price: "", stock: "" }
      ]
    }));
  };

  const handleUpdateVariant = (index, field, value) => {
    setForm(prev => {
      const updatedVariants = [...(prev.variants || [])];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value
      };
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleRemoveVariant = (index) => {
    setForm(prev => ({
      ...prev,
      variants: (prev.variants || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left Column */}
          <div className="grid-cols-1 gap-12">
            {/* Card 1: Basic Information */}
            <div className="border-tertiary rounded-5 bg-white p-16">
              <h3 className="mid-text font-600 text-dark mb-16">Basic Information</h3>
              <div className="grid grid-cols-2 gap-12">
                {basicInfoFields.map((field) => (
                  <div key={field.name} className={field.className || "col-span-1"}>
                    <Fields
                      {...field}
                      value={form[field.name]}
                      onChange={(val) => setForm(prev => ({ ...prev, [field.name]: val }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Key Features */}
            <FormBuilder
              value={form}
              onChange={setForm}
              fields={[
                { name: "features", label: "Key Features", type: "bulk-badge", addText: "Feature" }
              ]}
              buttonClassName="hidden"
            />

            {/* Card 3: Trust Badges */}
            <FormBuilder
              value={form}
              onChange={setForm}
              fields={[
                { name: "badges", label: "Trust Badges", type: "bulk-badge", addText: "Badge" }
              ]}
              buttonClassName="hidden"
            />
          </div>

          {/* Middle Column */}
          <div className="gap-12 grid-cols-1">
            {/* Card 4: Pricing & Inventory */}
            <div className="border-tertiary rounded-5 bg-white p-16">
              <h3 className="mid-text font-600 text-dark mb-16">Pricing & Inventory</h3>
              <div className="grid grid-cols-3 gap-12 mb-12">
                {pricingStockFieldsRow1.map((field) => (
                  <Fields
                    key={field.name}
                    {...field}
                    value={form[field.name]}
                    onChange={(val) => setForm(prev => ({ ...prev, [field.name]: val }))}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-12 mb-12">
                {pricingStockFieldsRow2.map((field) => (
                  <Fields
                    key={field.name}
                    {...field}
                    value={form[field.name]}
                    onChange={(val) => setForm(prev => ({ ...prev, [field.name]: val }))}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-12 items-center">
                {pricingSwitches.map((sw) => (
                  <div key={sw.name} className="gap-4">
                    <span className="mini-text text-gray font-600">{sw.label}</span>
                    <Fields
                      type="switch"
                      value={form[sw.name]}
                      onChange={(val) => setForm(prev => ({ ...prev, [sw.name]: val }))}
                    />
                  </div>
                ))}
                <div className="gap-4">
                  <span className="mini-text text-gray font-600">Is Active</span>
                  <Fields
                    type="switch"
                    value={form.isActive}
                    onChange={(val) => setForm(prev => ({ ...prev, isActive: val }))}
                  />
                </div>
              </div>
              <div className="mt-12">
                <Fields
                  label="Approval Status"
                  type="select"
                  value={form.status}
                  onChange={(val) => setForm(prev => ({ ...prev, status: val }))}
                  options={[
                    { label: "Pending", value: "pending" },
                    { label: "Approved", value: "approved" },
                    { label: "Rejected", value: "rejected" }
                  ]}
                />
              </div>
            </div>

            {/* Card: Product Variants */}
            <div className="border-tertiary rounded-5 bg-white p-16">
              <div className="flex items-center justify-between mb-16">
                <h3 className="mid-text font-600 text-dark">Product Variants</h3>
                <Button
                  type="button"
                  version="v2"
                  bg="primary"
                  variant="outline"
                  icon="Plus"
                  onClick={handleAddVariant}
                >
                  Add Variant
                </Button>
              </div>

              {(form.variants || []).length === 0 ? (
                <div className="text-center py-16 border-dashed border-tertiary rounded-5">
                  <p className="mini-text text-gray">No variants added yet. Click "Add Variant" to create variants.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-12">
                  {(form.variants || []).map((variant, idx) => (
                    <div key={idx} className="border border-tertiary rounded-5 p-12 bg-forth/20 relative">
                      <div className="flex items-center justify-between mb-12 pb-8 border-b border-tertiary">
                        <span className="mini-text font-600 text-dark">Variant #{idx + 1}</span>
                        <Button
                          type="button"
                          version="icon"
                          icon="Trash"
                          bg="white"
                          onClick={() => handleRemoveVariant(idx)}
                          style={{ color: "var(--danger)" }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-12 mb-12">
                        <Fields
                          label="Size"
                          type="input"
                          placeholder="e.g. Small, M, 42"
                          value={variant.size || ""}
                          onChange={(val) => handleUpdateVariant(idx, "size", val)}
                        />
                        <Fields
                          label="Color"
                          type="input"
                          placeholder="e.g. Red, Blue, Black"
                          value={variant.color || ""}
                          onChange={(val) => handleUpdateVariant(idx, "color", val)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-12">
                        <Fields
                          label="Price (INR)"
                          type="number"
                          placeholder="0"
                          value={variant.price ?? ""}
                          onChange={(val) => handleUpdateVariant(idx, "price", val)}
                        />
                        <Fields
                          label="Stock"
                          type="number"
                          placeholder="0"
                          value={variant.stock ?? ""}
                          onChange={(val) => handleUpdateVariant(idx, "stock", val)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="gap-12 grid-cols-1">
            {/* Card 5: Product Images */}
            <FormBuilder
              value={form}
              onChange={setForm}
              fields={[
                { name: "images", label: "Product Images", type: "bulk-image", helperText: "Max 5 images. JPG, PNG, WEBP up to 5MB" }
              ]}
              buttonClassName="hidden"
            />

            {/* Card 6: Specifications */}
            <FormBuilder
              value={form}
              onChange={setForm}
              fields={[
                { name: "specifications", label: "Specifications", type: "bulk-inputs", addText: "Specification" }
              ]}
              buttonClassName="hidden"
            />

            {/* Card 7: SEO Information */}
            <div className="border-tertiary rounded-5 bg-white p-16">
              <h3 className="mid-text font-600 text-dark mb-16">SEO Information</h3>
              <div className="grid grid-cols-1 gap-12">
                {seoFields.map((field) => (
                  <div key={field.name}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="mini-text text-gray font-600">{field.label}</span>
                      <span className="mini-text text-gray">
                        {(form[field.name]?.length || 0)}/{field.limit}
                      </span>
                    </div>
                    <Fields
                      type={field.type}
                      placeholder={field.label}
                      value={form[field.name]}
                      onChange={(val) => setForm(prev => ({ ...prev, [field.name]: val }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-12 mt-16 p-16 bg-white rounded-5 border border-tertiary">
          <Button
            type="button"
            version="v2"
            bg="white"
            color="gray"
            border="tertiary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            version="v2"
            bg="primary"
          >
            {isEditingProduct ? "Update Product" : "Publish Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
