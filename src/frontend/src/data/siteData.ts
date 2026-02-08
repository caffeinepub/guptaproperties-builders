export interface Property {
  id: string;
  title: string;
  price?: string;
  location?: string;
  description: string;
  images: string[];
}

export const businessInfo = {
  name: 'GuptaProperties&Builders',
  address: 'WZ-131, Shop No.1, Om Vihar Phase-1, Metro Pillar No. 703-704, Uttam Nagar, New Delhi-110059',
  phone: '9868599938',
  phoneLink: 'tel:+919868599938',
};

export const socialLinks = {
  maps: 'https://maps.app.goo.gl/rp9nw7uf3LgE3nZV9?g_st=aw',
  youtube: 'https://youtube.com/@guptapropertiesbuilders6499?si=N7EoU72HqrdFEMws',
  facebook: 'https://www.facebook.com/profile.php?id=100064206905886&mibextid=ZbWKwL',
  instagram: 'https://www.instagram.com/jitender.gupta.794?igsh=cWdxc213d3d0c2U5',
};

export const seedProperties: Property[] = [
  {
    id: 'seed-1',
    title: '3 BHK Luxury Apartment',
    price: '₹85 Lakhs',
    location: 'Uttam Nagar, New Delhi',
    description: 'Spacious 3 bedroom apartment with modern amenities, parking, and 24/7 security. Perfect for families looking for comfort and convenience.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260066-6bc35f0a1f80?w=800&h=600&fit=crop',
    ],
  },
  {
    id: 'seed-2',
    title: 'Commercial Shop Space',
    price: '₹1.2 Cr',
    location: 'Om Vihar, New Delhi',
    description: 'Prime commercial property in high-traffic area. Ideal for retail business with excellent visibility and accessibility.',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    ],
  },
  {
    id: 'seed-3',
    title: 'Independent House',
    price: '₹1.5 Cr',
    location: 'Dwarka, New Delhi',
    description: 'Beautiful independent house with 4 bedrooms, garden, and parking. Modern construction with premium fittings.',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    ],
  },
];
