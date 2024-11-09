export function kbToGb(kb) {
  return kb / (1024 * 1024);
}

const BTT_TO_TRX_RATE = 0.0000051;

export function bttToTrx(btt) {
  return btt * BTT_TO_TRX_RATE;
}

const CREDITS_PER_TRX = 100;

export function trxToCredits(trx) {
  return trx * CREDITS_PER_TRX;
}
