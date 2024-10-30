// Constants based on provided data
const BTT_COST_PER_GB_PER_MONTH = 3750; // BTT per GB per month
const PLATFORM_FEE_USDT_PER_100MB = 0.01; // USDT for 100 MB per 31 days
const TRX_TO_CREDIT_CONVERSION = 10000; // 1 TRX = 10,000 credits
const BTT_TO_TRX_RATE = 0.0000008669; // BTT to TRX conversion rate
const TRX_PRICE_USDT = 0.1658; // TRX price in USDT

/**
 * Function to calculate required credits for file storage
 * @param {number} fileSizeKB - File size in KB
 * @param {number} rentalDays - Number of rental days
 * @returns {number} - Total credits required for storage
 */
export function calculateRequiredCost(fileSizeKB, rentalDays) {
  // Step 1: Convert file size to GB
  const fileSizeGB = fileSizeKB / (1024 * 1024); // Convert KB to GB

  console.log('file :', fileSizeKB, 'gb: ', fileSizeGB);

  // Step 2: Calculate monthly storage cost in BTT
  const monthlyStorageCostBTT = BTT_COST_PER_GB_PER_MONTH * fileSizeGB;

  // Step 3: Calculate daily storage cost in BTT
  const dailyStorageCostBTT = monthlyStorageCostBTT / 30;

  // Step 4: Calculate total storage cost in BTT for the rental period
  const storageCostBTT = dailyStorageCostBTT * rentalDays;

  // Step 5: Calculate platform fee in BTT for the rental period
  const platformFeeTRX =
    (PLATFORM_FEE_USDT_PER_100MB / TRX_PRICE_USDT) * (fileSizeKB / 102400); // TRX for 100 MB
  const platformFeeBTT = platformFeeTRX / BTT_TO_TRX_RATE;
  const adjustedPlatformFeeBTT = (rentalDays / 31) * platformFeeBTT;

  // Step 6: Calculate total cost in BTT (storage cost + platform fee)
  const totalCostBTT = storageCostBTT + adjustedPlatformFeeBTT;

  // Step 7: Convert total BTT cost to TRX
  const totalCostTRX = totalCostBTT * BTT_TO_TRX_RATE;

  // Step 8: Convert TRX to credits
  const totalCredits = totalCostTRX * TRX_TO_CREDIT_CONVERSION;

  console.log({ toalCostBTT: totalCostBTT, totalCostTRX, totalCredits });

  return Math.ceil(totalCredits);
}
