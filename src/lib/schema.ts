// Define the TypeScript interface for wage data
export interface WageRecord {
  year: number;           // Calendar year (YYYY)
  nominal_wage: number;   // Average student wage in USD/hour
  cpi: number;            // Consumer Price Index (1982–1984=100)
  real_wage: number;      // Wage adjusted for inflation (USD/hour)
}