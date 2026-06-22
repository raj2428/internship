export const products = [
  {
    id: "nexus-watch-ultra",
    name: "Nexus Watch Ultra",
    tagline: "The ultimate rugged titanium smartwatch.",
    category: "wearables",
    price: 299,
    rating: 4.8,
    reviewsCount: 142,
    image: "/images/products/watch-ultra.webp",
    stock: 14,
    description: "Architected for extreme environments, the Nexus Watch Ultra features a solid titanium case, dual-frequency GPS, up to 36 hours of battery life, and advanced cellular connectivity. Designed with a bezel-less OLED screen protected by sapphire glass, it provides continuous biometric tracking and modular strap compatibility.",
    specs: {
      "Case Material": "Aerospace-grade Titanium",
      "Display": "1.92-inch Retina Always-On OLED (2000 nits)",
      "Battery Life": "Up to 36 hours (normal use)",
      "Water Resistance": "WR100 (100 meters)",
      "Sensors": "Heart Rate, ECG, Blood Oxygen, Temperature"
    },
    reviews: [
      { name: "Julian K.", rating: 5, comment: "Survival tracking in the mountains was flawless. Battery life exceeded my expectations.", date: "2026-05-12" },
      { name: "Sienna M.", rating: 4, comment: "Incredibly durable and gorgeous UI. A bit bulky on smaller wrists but absolutely worth it.", date: "2026-06-01" }
    ]
  },
  {
    id: "titan-nebula-chrono",
    name: "Titan Nebula Chrono",
    tagline: "A timeless solid gold mechanical chronograph.",
    category: "wearables",
    price: 499,
    rating: 4.8,
    reviewsCount: 37,
    image: "/images/products/titan-watch.webp",
    stock: 3,
    description: "An exquisite mechanical chronograph crafted in collaboration with Titan. Featuring an 18-karat solid gold case, premium hand-wound movement, sapphire crystal backing showing the intricate internal gears, and a hand-stitched alligator leather strap. A perfect blend of heritage watchmaking and modern luxury.",
    specs: {
      "Case Material": "18-karat Solid Yellow Gold",
      "Movement": "Hand-wound Mechanical Chronograph",
      "Power Reserve": "Up to 48 hours",
      "Glass": "Scratch-resistant Sapphire Crystal",
      "Strap": "Genuine Alligator Leather"
    },
    reviews: [
      { name: "Arthur C.", rating: 5, comment: "Absolute masterclass. The sweeping seconds hand and skeleton back are mesmerizing.", date: "2026-05-20" },
      { name: "Kiran J.", rating: 4, comment: "Stunning heirloom piece. Note that it is hand-wound only, but it keeps time perfectly.", date: "2026-06-05" }
    ]
  },
  {
    id: "aether-keys-pro",
    name: "Aether Keys Pro",
    tagline: "Retro-modern typing perfection with silent linear switches.",
    category: "keyboards",
    price: 189,
    rating: 4.9,
    reviewsCount: 96,
    image: "/images/products/keyboard.webp",
    stock: 8,
    description: "A compact 75% mechanical keyboard designed for coders and creators. Featuring hot-swappable socket mounts, custom factory-lubed linear switches, thick PBT keycaps with translucent legends, and a solid CNC-milled aluminum chassis. Wireless tri-mode connectivity guarantees seamless device switching.",
    specs: {
      "Form Factor": "75% Layout (84 Keys)",
      "Switch Type": "Aether Custom Silent Linear (Hot-swappable)",
      "Chassis": "Anodized CNC Aluminum",
      "Connectivity": "Bluetooth 5.1 / 2.4GHz / USB-C",
      "Backlight": "Per-key Addressable South-facing RGB"
    },
    reviews: [
      { name: "Marcus T.", rating: 5, comment: "The sound profile is a dream—deep creaminess. Latency is non-existent.", date: "2026-05-28" },
      { name: "Emily H.", rating: 5, comment: "I write all day, and my fingers feel significantly less tired. Gorgeous design.", date: "2026-06-10" }
    ]
  },
  {
    id: "sonic-dome-studio",
    name: "Sonic Dome Studio",
    tagline: "Audiophile-grade wireless ANC headphones.",
    category: "audio",
    price: 349,
    rating: 4.7,
    reviewsCount: 204,
    image: "/images/products/headphones.webp",
    stock: 5,
    description: "Escape the noise with Sonic Dome Studio. Engineered with bespoke 40mm beryllium dynamic drivers and state-of-the-art Hybrid Active Noise Cancellation, these headphones reproduce studio-fidelity audio. The plush memory foam ear cups and leather headband offer long-lasting ergonomic comfort.",
    specs: {
      "Drivers": "40mm Beryllium Dynamic Drivers",
      "Frequency Range": "4Hz - 40,000Hz",
      "ANC Depth": "Up to 42dB (Adaptive)",
      "Battery Life": "Up to 45 hours (ANC enabled)",
      "Codecs": "LDAC, AAC, aptX Adaptive, SBC"
    },
    reviews: [
      { name: "David L.", rating: 5, comment: "Unbelievable instrument separation. Bass is tight, not bloated. ANC completely blocks flights.", date: "2026-04-19" },
      { name: "Aria R.", rating: 4, comment: "Sound is unmatched. Touch controls take a bit to get used to, but build quality is stellar.", date: "2026-05-22" }
    ]
  },
  {
    id: "nova-charge-dock",
    name: "Nova Charge Dock",
    tagline: "3-in-1 magnetic wireless charging station.",
    category: "charging",
    price: 79,
    rating: 4.6,
    reviewsCount: 88,
    image: "/images/products/charger.webp",
    stock: 22,
    description: "Power up your ecosystem simultaneously. The Nova Charge Dock features a high-grade magnetic stand for floating phone placement, a wireless pad for earbuds, and a integrated swing-out charger for your smartwatch. Equipped with multi-safety protections and a soft ambient status glow.",
    specs: {
      "Output Capacity": "15W Phone + 5W Watch + 5W Earbuds (25W Max)",
      "Safety Protocols": "FOD, Over-current, Temp Control",
      "Power Input": "USB-C PD 30W+ Required",
      "Material": "Liquid Silicone & Anodized Aluminum"
    },
    reviews: [
      { name: "Leo G.", rating: 4, comment: "Decluttered my desk completely. Phone stays cool while charging rapidly.", date: "2026-05-15" },
      { name: "Sofia P.", rating: 5, comment: "Magnetic snap is incredibly strong. Works perfectly with my case on.", date: "2026-06-18" }
    ]
  },
  {
    id: "vibe-tube-xl",
    name: "Vibe Tube XL",
    tagline: "High-fidelity portable cylindrical speaker.",
    category: "audio",
    price: 129,
    rating: 4.5,
    reviewsCount: 112,
    image: "/images/products/speaker.webp",
    stock: 12,
    description: "Fill any space with 360-degree high-fidelity sound. The Vibe Tube XL combines dual passive radiators with dedicated tweeters and a real wood veneer finish. IPX7 waterproof rating ensures it performs outdoors, while PartySync allows linking multiple speakers for immense soundscapes.",
    specs: {
      "Output Power": "40W RMS",
      "Acoustics": "Dual 2-inch Drivers & Dual Passive Radiators",
      "Waterproofing": "IPX7 Rated",
      "Playtime": "Up to 20 hours",
      "Material": "Sustainable Walnut Wood & Performance Fabric"
    },
    reviews: [
      { name: "Jordan V.", rating: 5, comment: "Surprisingly loud and deep bass for its size. The wood styling looks fantastic in my office.", date: "2026-05-30" },
      { name: "Chloe K.", rating: 4, comment: "Solid build, great audio dispersion. Wish it came with a carrying case though.", date: "2026-06-12" }
    ]
  },
  {
    id: "lumina-bar",
    name: "Lumina Bar",
    tagline: "Asymmetric screen bar for desk eye-comfort.",
    category: "smart-home",
    price: 59,
    rating: 4.8,
    reviewsCount: 75,
    image: "/images/products/light.webp",
    stock: 18,
    description: "Elevate your desktop setup and protect your eyes. Lumina Bar clips onto your monitor and provides glare-free, asymmetric light distribution. Control brightness and color temperature with the wireless desktop dial controller. Fits curved and flat panels seamlessly.",
    specs: {
      "Light Pattern": "Asymmetric Optical Design (No Screen Glare)",
      "Color Temp": "2700K - 6500K (Stepless Adjustment)",
      "Color Rendering": "Ra > 95 (Vivid Color Accuracy)",
      "Power Source": "USB-C Powered (5V, 1A)",
      "Controller": "Wireless 2.4GHz Smart Desktop Knob Dial"
    },
    reviews: [
      { name: "Tariq A.", rating: 5, comment: "Completely eliminated eye strain during night coding sessions. The wireless dial dial is a joy to use.", date: "2026-06-03" },
      { name: "Nina B.", rating: 4, comment: "High quality aluminum finish. Highly recommended, though the clip is slightly tight on super thick bezels.", date: "2026-06-15" }
    ]
  },
  {
    id: "nebula-beam",
    name: "Nebula Beam Projector",
    tagline: "Full HD smart mini projector with autofocus.",
    category: "smart-home",
    price: 399,
    rating: 4.6,
    reviewsCount: 52,
    image: "/images/products/projector.webp",
    stock: 4,
    description: "Transform any wall into a 120-inch theater. Nebula Beam features Native 1080p projection, instant automatic keystone correction, and dynamic autofocus. Built-in Android TV allows streaming Netflix, Prime Video, and YouTube directly. Dynamic sound is delivered by integrated Harman speakers.",
    specs: {
      "Resolution": "Native 1920 x 1080 (1080p HD, HDR10)",
      "Brightness": "600 ANSI Lumens",
      "Projection Size": "40 to 120 inches",
      "Smart OS": "Android TV 11.0 (Built-in apps)",
      "Audio": "2x 5W Stereo Speaker Setup"
    },
    reviews: [
      { name: "Oliver S.", rating: 5, comment: "Autofocus makes setup instantaneous. Bright enough for evening outdoor movie nights.", date: "2026-05-19" },
      { name: "Mia L.", rating: 4, comment: "Crisp picture and good built-in sound. Perfect replacement for a bulky TV in my studio apartment.", date: "2026-06-08" }
    ]
  },
  {
    id: "aero-pods-pro",
    name: "Aero Pods Pro",
    tagline: "True-wireless earbuds with futuristic translucent case.",
    category: "audio",
    price: 149,
    rating: 4.7,
    reviewsCount: 167,
    image: "/images/products/earbuds.webp",
    stock: 15,
    description: "Featuring a translucent polycarbonate charging case, Aero Pods Pro showcase high-tech inner circuitry. Inside, 11mm graphene drivers deliver rich acoustics. Enjoy crystal-clear voice calls via 6 beamforming microphones and customized noise cancellation profiles.",
    specs: {
      "Driver Material": "11mm Graphene Coated Drivers",
      "Active Noise Cancellation": "Dynamic Hybrid ANC (35dB reduction)",
      "Microphones": "6x MEMS Beamforming Mics",
      "Battery Charge": "7 hours buds + 23 hours in charging case",
      "Dust/Waterproofing": "IP54 Rated Buds"
    },
    reviews: [
      { name: "Xavier P.", rating: 5, comment: "The transparent case design is absolutely gorgeous. Buds fit securely even while running.", date: "2026-05-09" },
      { name: "Gemma D.", rating: 4, comment: "Rich bass response. The transparency mode sounds very natural, comparable to high-end rivals.", date: "2026-06-11" }
    ]
  }
];
