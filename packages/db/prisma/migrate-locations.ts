/**
 * One-off: replace placeholder locations with the real ISA Spa outlets
 * (migrated from isaspa.in/spa-locator). Run: pnpm --filter @isa/db exec tsx prisma/migrate-locations.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Loc = { area: string; city: string; address: string; phone: string };

const LOCATIONS: Loc[] = [
  // Telangana
  { area: "Alkapuri", city: "Hyderabad", address: "Andani Towers, above Jawed Habeeb Saloon, Alkapur Township, Manikonda, Hyderabad", phone: "73998 87887" },
  { area: "Kokapet Terminal", city: "Hyderabad", address: "Unit No. 318, Kokapet Terminal, Gandipet Road, Kokapet, Hyderabad", phone: "83410 01697" },
  { area: "Kondapur", city: "Hyderabad", address: "First Floor, SVS Crown, High-Tension Line Road, Park Avenue Colony, Raghavendra Colony, Kondapur, Hyderabad", phone: "90325 79998" },
  { area: "Tellapur", city: "Hyderabad", address: "27-14/34, 3rd Floor, Mohan Reddy Heights, Beside Vision Urjith Villas, Tellapur, Hyderabad", phone: "63096 73096" },
  { area: "Paradise", city: "Secunderabad", address: "3rd Floor, Vasavi Mansion, Sarojini Devi Road, Secunderabad", phone: "92023 45670" },
  { area: "Kompally", city: "Hyderabad", address: "305, Fairmount Square, Kompally, Hyderabad", phone: "93913 84014" },
  { area: "Financial District", city: "Hyderabad", address: "The Ananta, 4th Floor, above PPS SKODA Showroom, near American Embassy, Financial District, Hyderabad", phone: "77950 30999" },
  { area: "Sun City", city: "Hyderabad", address: "Sun City, Hydershakote, Hyderabad, Telangana 500091", phone: "97033 44500" },
  { area: "RTC X Roads", city: "Hyderabad", address: "3rd Floor, 308 B, Odeon Mall, Chikkadpally, Hyderabad 500020", phone: "78931 36688" },
  { area: "Madhapur", city: "Hyderabad", address: "Sri Sai Nagar, Hitech City Road, Madhapur, Hyderabad", phone: "80969 55557" },
  { area: "Beeramguda", city: "Hyderabad", address: "SS Arcade, 4th Floor, above Reliance, Ameenpur Mandal, Beeramguda, Hyderabad", phone: "90090 00517" },
  { area: "Sainikpuri", city: "Hyderabad", address: "SP Square, Plot No. 112, above Vision Express, Defence Colony, Sainikpuri, Hyderabad", phone: "99666 37399" },
  { area: "Masjid Banda", city: "Hyderabad", address: "GVR Sapphire, 3rd Floor, 192/P, Masjid Banda, Kondapur, Hyderabad", phone: "81214 58877" },
  { area: "Lanco Hills", city: "Hyderabad", address: "4th Floor, SY No. 138/A, Lanco Hills Road, Opp Jains Carlton Creek, Khaja Guda, Hyderabad 500075", phone: "91003 62888" },
  // Karnataka
  { area: "Hopefarm", city: "Bengaluru", address: "3rd Floor, No. 7 & 8, Aashvi Building, Spring Valley, near Whitefield Global School, Channasandra Main Road, Hopefarm Junction, Whitefield, Bengaluru", phone: "88616 36826" },
  { area: "Ram Mandir Circle", city: "Bengaluru", address: "No. 1-891, Ground Floor, ND Complex, beside Atharva Hotel, High Court Road, Bengaluru", phone: "84724 52570" },
  { area: "Bijapur", city: "Vijayapura", address: "Maruti Arcade, Second Floor, above Asian Paints, near Ainapur House Bus Stop, Sy No. 918A, Plot No. 81, Jal Nagar Main Road, Vivek Nagar West, Vijayapura", phone: "89515 81999" },
  { area: "Sindhanur", city: "Sindhanur", address: "1st Floor, above HDFC Bank, Kustagi Road, near Bappur Road Circle, Sindhanur", phone: "63601 43108" },
  // Maharashtra
  { area: "Kalyan", city: "Kalyan", address: "Parwani Building, 1st Floor, opposite Metro Hospital, Murbad Road, Kalyan West", phone: "83559 53557" },
  { area: "Nashik", city: "Nashik", address: "Shreenam Restro, 302, Nashik-Pune Highway, Sinnar, Nashik 422103", phone: "90674 99974" },
  { area: "Thane", city: "Thane", address: "Pokharan Road No. 1, Vartak Nagar, Thane West", phone: "91523 61498" },
  // Andhra Pradesh
  { area: "Tirupati", city: "Tirupati", address: "No. 8, 173, Air Bypass Road, New Balaji Colony, 1st Floor, Tirupati", phone: "93819 66100" },
  // Gujarat
  { area: "Morbi", city: "Morbi", address: "The Fern Residency, Pacific Business Park, 8A National Highway, Mahendranagar, Morbi", phone: "73370 52928" },
  // Himachal Pradesh
  { area: "Dharamshala", city: "Dharamshala", address: "Near Club Mahindra, Sheela Chowk, PO Sidhpur, Teh Dharamshala, District Kangra", phone: "80918 22400" },
  // Uttar Pradesh
  { area: "Varanasi", city: "Varanasi", address: "C 26/35 - 38 R, 2nd Floor, Ramkatora, Varanasi", phone: "93529 70060" },
  // Uttarakhand
  { area: "Jim Corbett", city: "Ramnagar", address: "JUSTa Lazy Haven Corbett, Village Kyari, Ramnagar, Corbett National Park, Uttarakhand 244715", phone: "92582 98609" },
];

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");

async function main() {
  const removed = await prisma.location.deleteMany({});
  console.log(`Removed ${removed.count} existing locations.`);
  let i = 0;
  for (const l of LOCATIONS) {
    await prisma.location.create({
      data: {
        name: `Isa Spa ${l.area}`,
        slug: slugify(l.area),
        city: l.city,
        area: l.area,
        address: l.address,
        phone: l.phone,
        order: i++,
        status: "PUBLISHED",
      },
    });
  }
  console.log(`Inserted ${LOCATIONS.length} real outlets.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
