"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRequiredCost = calculateRequiredCost;
const BTT_COST_PER_GB_PER_MONTH = 3750;
const PLATFORM_FEE_USDT_PER_100MB = 0.01;
const TRX_TO_CREDIT_CONVERSION = 10000;
const BTT_TO_TRX_RATE = 0.0000008669;
const TRX_PRICE_USDT = 0.1658;
function calculateRequiredCost(fileSizeKB, rentalDays) {
    const fileSizeGB = fileSizeKB / (1024 * 1024);
    console.log('file :', fileSizeKB, 'gb: ', fileSizeGB);
    const monthlyStorageCostBTT = BTT_COST_PER_GB_PER_MONTH * fileSizeGB;
    const dailyStorageCostBTT = monthlyStorageCostBTT / 30;
    const storageCostBTT = dailyStorageCostBTT * rentalDays;
    const platformFeeTRX = (PLATFORM_FEE_USDT_PER_100MB / TRX_PRICE_USDT) * (fileSizeKB / 102400);
    const platformFeeBTT = platformFeeTRX / BTT_TO_TRX_RATE;
    const adjustedPlatformFeeBTT = (rentalDays / 31) * platformFeeBTT;
    const totalCostBTT = storageCostBTT + adjustedPlatformFeeBTT;
    const totalCostTRX = totalCostBTT * BTT_TO_TRX_RATE;
    const totalCredits = totalCostTRX * TRX_TO_CREDIT_CONVERSION;
    console.log({ toalCostBTT: totalCostBTT, totalCostTRX, totalCredits });
    return Math.ceil(totalCredits);
}
//# sourceMappingURL=creditCalculator.js.map