/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import type { Account } from '../types/spending'

export const ACCOUNTS: Account[] = [
  {
    id: "acc-current",
    name: "Everyday Account",
    type: "current",
    accountNumberMasked: "•••• 4821",
    balance: 18_432.56,
  },
  {
    id: "acc-savings",
    name: "Goal Save",
    type: "savings",
    accountNumberMasked: "•••• 7790",
    balance: 64_210.0,
  },
  {
    id: "acc-credit",
    name: "Credit Card",
    type: "credit-card",
    accountNumberMasked: "•••• 1102",
    balance: -6_840.19,
  },
];
