import { config } from "dotenv";
config();

const key = process.env.TELNYX_API_KEY;

async function get(path) {
  const res = await fetch(`https://api.telnyx.com/v2${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  return res.json();
}

// Try toll-free with best_effort
console.log("=== Searching toll-free numbers (888) with best_effort ===");
const tf888 = await get("/available_phone_numbers?filter[phone_number][starts_with]=%2B1888&filter[best_effort]=true&filter[limit]=5");
const nums888 = tf888?.data ?? [];
console.log("Found:", nums888.length);
nums888.forEach(n => console.log(" ", n.phone_number));

// Try any toll-free
console.log("\n=== Searching any toll-free (800/888/877/866) ===");
const tfAny = await get("/available_phone_numbers?filter[phone_number_type]=toll-free&filter[best_effort]=true&filter[limit]=5");
const numsAny = tfAny?.data ?? [];
console.log("Found:", numsAny.length);
numsAny.forEach(n => console.log(" ", n.phone_number));

if (numsAny.length === 0) {
  console.log("Response:", JSON.stringify(tfAny).slice(0, 400));
}

// Try local US number as fallback
console.log("\n=== Searching local US numbers (fallback) ===");
const local = await get("/available_phone_numbers?filter[country_code]=US&filter[best_effort]=true&filter[limit]=5");
const localNums = local?.data ?? [];
console.log("Found:", localNums.length);
localNums.forEach(n => console.log(" ", n.phone_number, n.locality, n.region));
