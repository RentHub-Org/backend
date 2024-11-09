import { bttToTrx, kbToGb, trxToCredits } from 'src/utils';

const BTT_PER_GB = 125;

function calculateBttCost(fileSizeGb, rentalDays) {
  return fileSizeGb * (rentalDays / 30) * BTT_PER_GB;
}

function calculatePlatformFee(fileSizeGb) {
  const platformFeeRate = 0.1; // 10% of the file size in GB
  return platformFeeRate * fileSizeGb * BTT_PER_GB;
}

export function calculateRentalCost(fileSizeKb, rentalDays) {
  // Convert file size from KB to GB
  const fileSizeGb = kbToGb(fileSizeKb);

  // Calculate costs in BTT
  const bttCost = calculateBttCost(fileSizeGb, rentalDays);
  const platformFeeBtt = calculatePlatformFee(fileSizeGb);
  // 100 for the transaction fee to push the metadata
  const totalBttCost = bttCost + platformFeeBtt + 100;

  // Convert BTT to TRX
  const trxCost = bttToTrx(totalBttCost);

  // Convert TRX to credits
  const creditsCost = trxToCredits(trxCost);

  return {
    bttCost: totalBttCost,
    trxCost: trxCost,
    creditsCost: Math.ceil(creditsCost),
  };
}

// file * days * btt per gb
