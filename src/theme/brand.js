/**
 * Centralized Brand Configuration for Cup2Eat
 * 
 * Configured according to the official Cup2Eat brand identity, circular dark-green
 * and gold emblem, and exact promotional reference guidelines.
 */

export const BRAND = {
  name: "Cup2Eat",
  headline: "EAT YOUR DRINK.",
  tagline: "The Cup You Can Eat.",
  subheadline: "An edible way to make every sip more memorable.",
  logo: {
    src: "/assets/cup2eat-logo.jpg",
    alt: "Cup2Eat Official Circular Dark-Green & Gold Emblem",
    primaryColor: "#1B382B", // Deep forest green
    secondaryColor: "#2F4B38", // Dark olive green
    accentColor: "#C8A051", // Warm golden yellow
    backgroundColor: "#FBF9F5", // Off-white / ivory
  },
  contact: {
    email: "support@cup2eat.com",
    phone: "+91 98181 92575",
    whatsappNumber: "919818192575",
    address: "Registered Facility & Kitchen Labs, Bengaluru, Karnataka, India",
    instagramUrl: "https://www.instagram.com/cup2eat/",
  },
  whatsapp: {
    defaultMessage: "Hello Cup2Eat team! I want to inquire about your edible cups for our café / business.",
    productMessage: (productName) => `Hello Cup2Eat, I am interested in ordering "${productName}". Can you share the latest confirmed pricing and availability?`,
    orderMessage: (orderId) => `Hello Cup2Eat Support, I need assistance with Order #${orderId}.`,
  },
  disclaimer: {
    ingredientsNotice: "REFERENCE INGREDIENT DECLARATION: Refined Wheat Flour (Maida), Wheat Flour, Pulses, Corn Flour, Dextrose Sugar, Salt, Emulsifiers, Food Colours INS 102, INS 122, INS 133, Acidity Regulator (INS 514), Vegetable Oil, Baking Powder E500, Artificial Flavouring Substances, Preservatives E223 and Spices. (Pending final production label sign-off).",
    pricingNotice: "BULK & PROMOTIONAL SPECIFICATION: Packaging quantities (396 / 432 / 496 cups) and bulk prices are reference catalog tiers. Custom cafe and event orders can be confirmed via WhatsApp or Admin.",
  },
};
