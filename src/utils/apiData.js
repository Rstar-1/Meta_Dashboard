const categories = [
  {
    "id": "cat-pvc-curtain",
    "name": "PVC Curtain",
    "icon": "",
    "color": "#e8f0fe",
    "description": "Flexible and durable PVC curtains (Standard, Supreme, Reliable, Freezer Grade, and Magnetic grades) for temperature control, safety, and dust protection.",
    "number": "01",
    "accentColor": "#1f5ac0",
    "bgColor": "#e8f0fe",
    "iconName": "CurtainAlt"
  },
  {
    "id": "cat-pvc-transparent-roll",
    "name": "PVC Transparent Roll",
    "icon": "",
    "color": "#d1fae5",
    "description": "Premium transparent PVC rolls available in standard thicknesses (0.15mm to 0.50mm), low gauges (28/30 & 38/40 PHR), and heavy-duty high gauges (0.80mm to 3.0mm).",
    "number": "02",
    "accentColor": "#7c3aed",
    "bgColor": "#f5f3ff",
    "iconName": "ClearFilm"
  },
  {
    "id": "cat-pvc-color-film",
    "name": "PVC Colour Clear Film Roll",
    "icon": "",
    "color": "#fce7f3",
    "description": "Vibrant color clear films featuring 12 color combinations, fluorescent tones (0.30mm & 0.50mm), solid colors (0.50mm), and rainbow clear options.",
    "number": "03",
    "accentColor": "#ea580c",
    "bgColor": "#fff7ed",
    "iconName": "Film"
  },
  {
    "id": "cat-pvc-reinforced-sheet",
    "name": "PVC Reinforce Sheet",
    "icon": "",
    "color": "#e0e7ff",
    "description": "Heavy-duty reinforced PVC sheets with high tear resistance, featuring 0.35mm thickness, 60\" width, and 100m length; perfect for crate covers and packaging.",
    "number": "04",
    "accentColor": "#4338ca",
    "bgColor": "#e0e7ff",
    "iconName": "Sheet"
  },
  {
    "id": "cat-mounting-brackets",
    "name": "Brackets",
    "icon": "",
    "color": "#ffedd5",
    "description": "Mild steel (MS) and stainless steel (SS 202/304) brackets, bottom sets for magnetic curtains, and track & clip systems (300mm & 350mm).",
    "number": "05",
    "accentColor": "#c2410c",
    "bgColor": "#ffedd5",
    "iconName": "Settings"
  }
];

const products = [
  {
    "id": "ashmita-153625330",
    "name": "W. S. I PVC Strip Curtain Roll",
    "slug": "w-s-i-pvc-strip-curtain-roll",
    "price": 115,
    "priceDisplay": "Rs 115 / Kg",
    "priceCurrency": "INR",
    "inStock": true,
    "sku": "AE-153625330",
    "brand": "Ashmita",
    "category": "cat-pvc-curtain",
    "image": "",
    "tags": ["pvc-strip-curtains", "pvc", "roll"],
    "type": "general",
    "popular": true,
    "rating": 4.5,
    "reviewCount": 31,
    "client": "biz-6",
    "city": "Mumbai",
    "description": "PVC Strip curtain roll. Available in 2mm and 3mm Thickness."
  },
  {
    "id": "ashmita-153625331",
    "name": "Stainless Steel Bracket System",
    "slug": "ss-bracket-system",
    "price": 250,
    "priceDisplay": "Rs 250 / Set",
    "priceCurrency": "INR",
    "inStock": true,
    "sku": "AE-153625331",
    "brand": "Ashmita",
    "category": "cat-mounting-brackets",
    "image": "",
    "tags": ["brackets", "hanger"],
    "type": "general",
    "popular": true,
    "rating": 4.8,
    "reviewCount": 12,
    "client": "biz-6",
    "city": "Mumbai",
    "description": "Premium stainless steel strip curtain mounting hooks and track hangers."
  }
];

const blogs = [];
const client = [];
const reviews = [];
const cms = {};

const header = {
  "logo": {
    "src": "/sobo_logo.webp",
    "alt": "Ashmita Enterprises",
    "path": "/"
  },
  "topNav": {
    "left": [
      {
        "id": "touch",
        "label": "GET IN TOUCH",
        "hasDropdown": true,
        "submenu": [
          {
            "label": "Submit RFQ Requirement",
            "path": "/connect",
            "type": "link"
          },
          {
            "label": "Call +91 87790 30638",
            "href": "tel:+918779030638",
            "type": "tel"
          },
          {
            "label": "WhatsApp Support",
            "href": "https://wa.me/918779030638",
            "type": "external"
          }
        ]
      },
      {
        "id": "corporate",
        "label": "CORPORATE",
        "hasDropdown": true,
        "submenu": [
          {
            "label": "News & Media",
            "path": "/blog",
            "type": "link"
          },
          {
            "label": "About Us",
            "path": "/about",
            "type": "link"
          },
          {
            "label": "Supplier",
            "path": "/supplier/Ashmita",
            "type": "link"
          }
        ]
      },
      {
        "id": "category-top",
        "label": "CATEGORY",
        "path": "/category",
        "hasDropdown": false
      }
    ],
    "right": [
      {
        "id": "wheretobuy",
        "label": "Where To Buy",
        "path": "/wheretobuy",
        "hasDropdown": false
      }
    ]
  },
  "mainNav": [
    {
      "id": "sheets",
      "label": "PVC SHEETS & PANELS",
      "icon": "Sheets",
      "path": "/products",
      "hasDropdown": true,
      "category": "cat-pvc-reinforced-sheet",
      "dropdownTitle": "PVC Sheet Types",
      "cardTitle": "Industrial Grade PVC",
      "cardDesc": "100% Waterproof, Chemical Resistant Heavy-Duty Sheets.",
      "cardLinkText": "View All Sheets"
    },
    {
      "id": "rolls",
      "label": "PVC ROLLS & STRIP CURTAINS",
      "icon": "Rolls",
      "path": "/products",
      "hasDropdown": true,
      "category": "cat-pvc-transparent-roll",
      "dropdownTitle": "Strip Curtains & Rolls",
      "cardTitle": "Cold Storage & Anti-Insect",
      "cardDesc": "Ribbed & Plain Strip Curtains with Stainless Steel Hangers.",
      "cardLinkText": "View All Rolls"
    },
    {
      "id": "industrial",
      "label": "INDUSTRIAL MATERIALS",
      "icon": "Layers",
      "path": "/products",
      "hasDropdown": false
    },
    {
      "id": "all-products",
      "label": "ALL PRODUCTS",
      "icon": "GridDots",
      "path": "/products",
      "hasDropdown": false
    },
    {
      "id": "about",
      "label": "ABOUT US",
      "icon": "Building",
      "path": "/about",
      "hasDropdown": false
    },
    {
      "id": "resources",
      "label": "RESOURCES & MEDIA",
      "icon": "Media",
      "path": "/blog",
      "hasDropdown": false
    }
  ],
  "mobileMenu": [
    {
      "id": "categories",
      "label": "Explore Products",
      "icon": "Product",
      "hasSubmenu": true,
      "submenuType": "categories"
    },
    {
      "id": "category-page",
      "label": "Category",
      "icon": "Grid",
      "path": "/category",
      "hasSubmenu": false
    },
    {
      "id": "about-mobile",
      "label": "About Us",
      "icon": "Info",
      "path": "/about",
      "hasSubmenu": false
    },
    {
      "id": "news-mobile",
      "label": "News & Media",
      "icon": "Media",
      "path": "/blog",
      "hasSubmenu": false
    },
    {
      "id": "supplier",
      "label": "Supplier Detail",
      "icon": "Users",
      "path": "/supplier/Ashmita",
      "hasSubmenu": false
    },
    {
      "id": "wheretobuy",
      "label": "Where To Buy",
      "icon": "MapPin",
      "path": "/wheretobuy",
      "hasSubmenu": false
    }
  ]
};

const footer = {
  "brand": {
    "logo": "⚙️",
    "name": "Ashmita Enterprises",
    "description": "Leading importer and wholesaler of high-quality PVC Strip Curtains, PVC Rolls, Clear PVC Sheets, and Mounting Brackets based in Mumbai, Maharashtra.",
    "socials": [
      {
        "platform": "facebook",
        "iconName": "Facebook",
        "url": "#"
      },
      {
        "platform": "instagram",
        "iconName": "Instagram",
        "url": "#"
      },
      {
        "platform": "whatsapp",
        "iconName": "WhatsApp",
        "url": "#"
      }
    ]
  },
  "columns": [
    {
      "title": "Quick Links",
      "links": [
        {
          "label": "Home",
          "path": "/home"
        },
        {
          "label": "About Us",
          "path": "/about"
        },
        {
          "label": "Products",
          "path": "/products"
        },
        {
          "label": "Blogs",
          "path": "/blog"
        },
        {
          "label": "Connect",
          "path": "/connect"
        }
      ]
    },
    {
      "title": "Commissioning Support",
      "links": [
        {
          "label": "About Group",
          "path": "/about"
        },
        {
          "label": "Contact Desk",
          "path": "/contact"
        },
        {
          "label": "Engineering Insights",
          "path": "/blog"
        },
        {
          "label": "RFQ Portal",
          "path": "/contact"
        }
      ]
    }
  ],
  "newsletter": {
    "title": "Product Updates",
    "description": "Get product updates, new catalog releases, and price lists.",
    "placeholder": "Corporate email...",
    "buttonText": "Subscribe"
  },
  "bottom": {
    "copyright": "© 2026 Ashmita Enterprises. All rights reserved. Importer & Wholesaler.",
    "links": [
      {
        "label": "Privacy Policy",
        "url": "#"
      },
      {
        "label": "Terms & Conditions",
        "url": "#"
      }
    ]
  }
};

export {
  products,
  categories,
  blogs,
  client,
  footer,
  header,
  reviews,
  cms
};
