import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { normalizeCompanyName } from "../src/lib/normalization/company";
import { computeConfidenceScore } from "../src/lib/analytics/confidence";
import { standardLevels } from "../src/lib/validation/salary";

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter });

const companies = [
  "Google", "Amazon", "Microsoft", "Uber", "Atlassian", 
  "Flipkart", "Swiggy", "Zomato", "Razorpay", "Airbnb"
];

const indianLocations = ["Bengaluru", "Hyderabad", "Pune", "Noida"];
const globalLocations = ["San Francisco", "Seattle", "New York", "London"];

const roles = ["Software Engineer", "Product Manager", "Data Scientist", "Frontend Engineer", "Backend Engineer"];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Seeding database...");
  await prisma.salary.deleteMany({}); // clear existing
  
  const salariesToInsert = [];

  for (let i = 0; i < 400; i++) {
    const company = getRandomItem(companies);
    const normalizedCompany = normalizeCompanyName(company);
    const role = getRandomItem(roles);
    
    // Choose location randomly, mix Indian and Global
    const isIndia = Math.random() > 0.4;
    const location = getRandomItem(isIndia ? indianLocations : globalLocations);
    
    // Choose level
    const levelIndex = getRandomInt(0, standardLevels.length - 1);
    const level = standardLevels[levelIndex];

    // Determine experience based on level roughly
    const baseExp = levelIndex * 2;
    const experience_years = getRandomInt(Math.max(0, baseExp - 1), baseExp + 4);

    // Determine compensation based on location and level
    let base_salary, bonus, stock;

    if (isIndia) {
      // In USD for consistency (approx values in USD representing high-tier India comp)
      const baseMin = 15000 + (levelIndex * 15000);
      const baseMax = 30000 + (levelIndex * 25000);
      base_salary = getRandomInt(baseMin, baseMax);
      bonus = getRandomInt(base_salary * 0.05, base_salary * 0.2);
      stock = getRandomInt(base_salary * 0.1, base_salary * 1.0);
    } else {
      // Global comp
      const baseMin = 100000 + (levelIndex * 30000);
      const baseMax = 150000 + (levelIndex * 40000);
      base_salary = getRandomInt(baseMin, baseMax);
      bonus = getRandomInt(base_salary * 0.1, base_salary * 0.3);
      stock = getRandomInt(50000, 100000 + (levelIndex * 100000));
    }

    const total_compensation = base_salary + bonus + stock;

    const data = {
      company,
      normalized_company: normalizedCompany,
      role,
      level_standardized: level,
      location,
      experience_years,
      base_salary,
      bonus,
      stock,
      total_compensation,
      confidence_score: 1.0, // Computed below
    };

    data.confidence_score = computeConfidenceScore(data as any);

    salariesToInsert.push(data);
  }

  // Insert in chunks
  await prisma.salary.createMany({
    data: salariesToInsert,
    skipDuplicates: true,
  });

  console.log(`Seeded ${salariesToInsert.length} records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
