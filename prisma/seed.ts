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

  // The 7 Products
  const products = [
    {
      name: "Pink Farm Signature Makhana",
      slug: "pink-farm-signature-makhana",
      shortDescription: "Our premium, hand-picked Makhana roasted to perfection.",
      description: "Discover the crunch that started it all. Our Signature Makhana is sourced from the finest farms in Bihar, gently roasted, and minimally processed to bring you a snack that is as healthy as it is delicious. Rich in protein and antioxidants.",
      imageUrl: "",
      basePrice: 19900, // 199 INR
      originalPrice: 24900,
      sku: "PF-MAK-01",
      category: "Makhana",
      stockQuantity: 100,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: "250g", packSize: "250g", price: 19900, stockQuantity: 50 },
        { name: "500g", packSize: "500g", price: 34900, stockQuantity: 50 }
      ]
    },
    {
      name: "Classic Salted Makhana",
      slug: "classic-salted-makhana",
      shortDescription: "Lightly salted with Himalayan pink salt.",
      description: "For those who prefer a savory crunch. We've lightly dusted our premium Makhana with Himalayan pink salt to enhance its natural flavor.",
      imageUrl: "",
      basePrice: 22900, // 229 INR
      sku: "PF-MAK-02",
      category: "Makhana",
      stockQuantity: 100,
      isAvailable: true,
      isFeatured: false,
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
