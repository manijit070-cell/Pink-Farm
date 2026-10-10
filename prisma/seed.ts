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
      name: "Premium Phool Makhana",
      slug: "premium-phool-makhana",
      shortDescription: "Handpicked, light & wholesome",
      description: "Discover pure, wholesome snacking. Our Premium Phool Makhana is handpicked from the finest lotus harvest, gently air-roasted, and minimally processed to preserve maximum protein, calcium, and natural antioxidants.",
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
      description: "A spicy kick in every crunchy bite. Slow-roasted jumbo makhana tossed in a fiery, zesty Peri Peri seasoning blend for snack lovers who crave bold heat and crisp satisfaction.",
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
      description: "Desi tadka, bold flavour, perfect crunch. Infused with aromatic roasted cumin, dried mango amchur, and authentic Punjabi spice tadka for a truly lip-smacking snack.",
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
      description: "Refreshing mint with a chatpata twist. Crisp roasted makhana seasoned with garden-fresh dried mint leaves and tangy rock salt for a cool, savory teatime crunch.",
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
      description: "Makhana meets the goodness of gud. Naturally sweetened with unrefined traditional jaggery and a hint of sesame, offering rich caramel crunch without refined sugar or artificial additives.",
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
      name: "Himalayan Pink Salted Makhana",
      slug: "himalayan-pink-salted-makhana",
      shortDescription: "Simply salted, perfectly crunchy.",
      description: "Simply salted, perfectly crunchy. Lightly roasted with a touch of cold-pressed oil and dusted with pure mineral-rich Himalayan pink salt to accentuate the natural puff and crunch of premium makhana.",
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
