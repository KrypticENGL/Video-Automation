const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** 125000 → "₹1,25,000" (Indian digit grouping, whole rupees). */
export const formatInr = (amount: number) => `₹${inr.format(amount)}`;
