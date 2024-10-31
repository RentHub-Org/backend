export function calculateRequiredCost(fileSizeKB, rentalDays) {
  // Constants
  const BTT_COST_PER_GB = 3750; // Monthly BTT cost per GB
  const TRX_PER_BTT = 0.00000544; // TRX equivalent of 1 BTT
  const CREDITS_PER_TRX = 10000; // 1 TRX is equivalent to 10,000 credits
  const PLATFORM_FEE_PER_100MB_IN_CREDITS = 603; // Platform fee per 100MB in credits

  // Step 1: Convert file size to GB
  const fileSizeGB = fileSizeKB / (1024 * 1024); // Convert KB to GB

  // Step 2: Calculate monthly storage cost in BTT for the given file size
  const monthlyStorageCostBTT = fileSizeGB * BTT_COST_PER_GB;

  // Step 3: Convert monthly BTT cost to TRX
  const monthlyStorageCostTRX = monthlyStorageCostBTT * TRX_PER_BTT;

  // Step 4: Convert monthly TRX cost to credits
  const monthlyStorageCostCredits =
    monthlyStorageCostTRX * CREDITS_PER_TRX * 6004;

  // Step 5: Adjust storage cost for the rental period (days)
  const rentalPeriodInMonths = rentalDays / 30;
  const totalStorageCostCredits =
    monthlyStorageCostCredits * rentalPeriodInMonths;

  // Step 6: Calculate platform fee in credits based on file size in MB
  const fileSizeMB = fileSizeKB / 1024; // Convert KB to MB
  const platformFeeCredits =
    Math.ceil(fileSizeMB / 100) * PLATFORM_FEE_PER_100MB_IN_CREDITS;

  // Step 7: Calculate total cost in credits (storage + platform fee)
  const totalCostCredits = totalStorageCostCredits + platformFeeCredits;

  return Math.ceil(totalCostCredits); // Round up to cover total cost
}
