// Explicit interface so AI-generated tests can construct new instances from
// variable values without hitting literal-type assignment errors.
export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export const checkoutCustomer: CheckoutCustomer = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '12345',
} as const;

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
