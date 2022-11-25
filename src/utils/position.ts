export function percDiff(etalon, example) {
  return +Math.abs(100 - (example / etalon) * 100).toFixed(2);
}

export const getPositionValue = (positions: any[], coins) => {
  let investedValue = 0;
  let currentValue = 0;
  positions?.forEach((position) => {
    investedValue += position.price * position.quantity;
    const selectedCoin = coins?.find((c) => c?.id === position?.id);
    if (selectedCoin) {
      currentValue += selectedCoin.current_price * position.quantity;
    }
  });
  return { investedValue, currentValue };
};

export const getPositionStats = (positions: any[]) => {
  let quantity = 0;
  positions?.forEach((p) => {
    if (p?.quantity) {
      quantity += Number(p?.quantity);
    }
  });
  return { quantity };
};
