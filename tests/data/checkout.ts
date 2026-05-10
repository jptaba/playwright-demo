export const checkoutCustomer = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '12345',
} as const;

export type CheckoutCustomer = typeof checkoutCustomer;

export type CheckoutItem = {
  readonly name: string;
  readonly slug: string;
};

export const checkoutItem: CheckoutItem = {
  name: 'Sauce Labs Backpack',
  slug: 'sauce-labs-backpack',
};

export const checkoutSecondItem: CheckoutItem = {
  name: 'Sauce Labs Bike Light',
  slug: 'sauce-labs-bike-light',
};
