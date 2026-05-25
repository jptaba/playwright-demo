export const inventorySortOptions = {
  nameAsc: {
    label: 'Name (A to Z)',
    value: 'az',
  },
  nameDesc: {
    label: 'Name (Z to A)',
    value: 'za',
  },
  priceLowToHigh: {
    label: 'Price (low to high)',
    value: 'lohi',
  },
  priceHighToLow: {
    label: 'Price (high to low)',
    value: 'hilo',
  },
} as const;
