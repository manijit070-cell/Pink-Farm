const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Check if store settings exist
  const settings = await prisma.storeSettings.findUnique({
    where: { id: "default" }
  });

  if (!settings) {
    await prisma.storeSettings.create({
      data: {
        id: "default",
        storeName: "Pink Farm",
      }
    });
  }

  // Create Admin User
  const adminEmail = "admin@pinkfarm.in";
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        // Development placeholder: 'password123'
        // In production, this should be securely hashed.
        password: "password123", 
        name: "Pink Farm Admin"
      }
    });
  }

  // The 6 Makhana Products
  const products = [
    {
      name: "Raw Premium Phool Makhana",
      slug: "raw-premium-phool-makhana",
      shortDescription: "Handpicked, light & wholesome",
      description: "Made from carefully selected makhana, kept simple and unflavoured for pure versatility. Roast it, season it, or enjoy creating your own snack!",
      imageUrl: "/images/makhana_sig.jpg",
      basePrice: 19900,
      originalPrice: 24900,
      sku: "PF-MAK-01",
      category: "Makhana",
      stockQuantity: 150,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: "250g", packSize: "250g", price: 19900, stockQuantity: 80 },
        { name: "500g", packSize: "500g", price: 34900, stockQuantity: 70 }
      ]
    },
    {
      name: "Peri Peri Makhana",
      slug: "peri-peri-makhana",
      shortDescription: "A spicy kick in every crunchy bite.",
      description: "Carefully selected makhana, perfectly coated with a bold peri peri seasoning. Every crunchy bite brings a spicy twist to your everyday snacking!",
      imageUrl: "/images/makhana_sig.jpg",
      basePrice: 21900,
      originalPrice: 25900,
      sku: "PF-MAK-02",
      category: "Makhana",
      stockQuantity: 120,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: "100g", packSize: "100g", price: 11900, stockQuantity: 60 },
        { name: "250g", packSize: "250g", price: 21900, stockQuantity: 60 }
      ]
    },
    {
      name: "Punjabi Tadka Makhana",
      slug: "punjabi-tadka-makhana",
      shortDescription: "Desi tadka, bold flavour, perfect crunch.",
      description: "Premium handpicked makhana tossed in a flavourful Punjabi tadka seasoning. Enjoy the perfect desi twist in every crunchy bite!",
      imageUrl: "/images/makhana_sig.jpg",
      basePrice: 21900,
      originalPrice: 25900,
      sku: "PF-MAK-03",
      category: "Makhana",
      stockQuantity: 120,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: "100g", packSize: "100g", price: 11900, stockQuantity: 60 },
        { name: "250g", packSize: "250g", price: 21900, stockQuantity: 60 }
      ]
    },
    {
      name: "Pudina Makhana",
      slug: "pudina-makhana",
      shortDescription: "Refreshing mint with a chatpata twist.",
      description: "Carefully selected makhana blended with refreshing minty pudina seasoning. A flavourful, chatpata companion for your everyday snack cravings!",
      imageUrl: "/images/makhana_sig.jpg",
      basePrice: 21900,
      originalPrice: 25900,
      sku: "PF-MAK-04",
      category: "Makhana",
      stockQuantity: 120,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: "100g", packSize: "100g", price: 11900, stockQuantity: 60 },
        { name: "250g", packSize: "250g", price: 21900, stockQuantity: 60 }
      ]
    },
    {
      name: "Caramel Gud Makhana",
      slug: "caramel-gud-makhana",
      shortDescription: "Makhana meets the goodness of gud.",
      description: "Premium makhana coated with a delightful caramel-gud flavour for a sweet, crunchy treat. Perfect for satisfying your sweet cravings, one bite at a time!",
      imageUrl: "/images/makhana_sig.jpg",
      basePrice: 24900,
      originalPrice: 29900,
      sku: "PF-MAK-05",
      category: "Makhana",
      stockQuantity: 100,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: "100g", packSize: "100g", price: 13900, stockQuantity: 50 },
        { name: "250g", packSize: "250g", price: 24900, stockQuantity: 50 }
      ]
    },
    {
      name: "Himalayan Salted Makhana",
      slug: "himalayan-salted-makhana",
      shortDescription: "Simply salted, perfectly crunchy.",
      description: "Carefully selected makhana seasoned with a simple, savoury Himalayan salt flavour. Light, crunchy and perfect for everyday munching!",
      imageUrl: "/images/makhana_sig.jpg",
      basePrice: 20900,
      originalPrice: 24900,
      sku: "PF-MAK-06",
      category: "Makhana",
      stockQuantity: 130,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: "100g", packSize: "100g", price: 11900, stockQuantity: 65 },
        { name: "250g", packSize: "250g", price: 20900, stockQuantity: 65 }
      ]
    },
    {
      name: "Premium Almonds (Badam)",
      slug: "premium-almonds",
      shortDescription: "Crunchy, sweet California almonds.",
      description: "Carefully selected almonds packed with essential nutrients, perfect for your daily nutritional needs or as a wholesome snack.",
      imageUrl: "",
      basePrice: 39900, // 399 INR
      sku: "PF-NUT-01",
      category: "Nuts",
      stockQuantity: 50,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: "Whole Cashews (Kaju)",
      slug: "whole-cashews",
      shortDescription: "Creamy, large-sized whole cashews.",
      description: "Premium W320 grade whole cashews with a rich, creamy texture and sweet flavor.",
      imageUrl: "",
      basePrice: 44900, // 449 INR
      sku: "PF-NUT-02",
      category: "Nuts",
      stockQuantity: 40,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: "Organic Jaggery Powder",
      slug: "organic-jaggery-powder",
      shortDescription: "Chemical-free, natural sweetener.",
      description: "A healthier alternative to refined sugar, our organic jaggery powder is sourced directly from traditional sugarcane farmers.",
      imageUrl: "",
      basePrice: 14900, // 149 INR
      sku: "PF-PAN-01",
      category: "Pantry",
      stockQuantity: 200,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: "Cold-Pressed Mustard Oil",
      slug: "cold-pressed-mustard-oil",
      shortDescription: "Pure Kachi Ghani mustard oil.",
      description: "Extracted using traditional cold-pressing methods to retain its strong flavor, aroma, and nutritional benefits.",
      imageUrl: "",
      basePrice: 29900, // 299 INR
      sku: "PF-OIL-01",
      category: "Oils",
      stockQuantity: 30,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: "A2 Gir Cow Bilona Ghee",
      slug: "a2-gir-cow-bilona-ghee",
      shortDescription: "Authentic, traditional Bilona method ghee.",
      description: "Made from the A2 milk of grass-fed Gir cows using the traditional wooden churner (Bilona) method. Rich in aroma and health benefits.",
      imageUrl: "",
      basePrice: 89900, // 899 INR
      sku: "PF-PAN-02",
      category: "Pantry",
      stockQuantity: 25,
      isAvailable: true,
      isFeatured: true,
    }
  ];

  for (const prod of products) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: prod.slug }
    });

    if (!existingProduct) {
      const { variants, ...productData } = prod;
      const createdProduct = await prisma.product.create({
        data: productData
      });

      if (variants) {
        for (const variant of variants) {
          await prisma.productVariant.create({
            data: {
              ...variant,
              productId: createdProduct.id
            }
          });
        }
      }
    }
  }

  console.log("Database seeded with 7 products and default settings.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
