# Are Student Wages Keeping Up with Inflation?

## Essential Question

Are part-time student wages keeping pace with inflation over the past 10 years?

## Claim (Hypothesis)

Nominal student wages have increased slightly, but real wages adjusted for inflation have stagnated.

## Audience

Current and prospective students, part-time workers, and university administrators.

---

# STAR Framework

### Situation

Students often rely on part-time jobs to cover tuition and living costs. Inflation reduces purchasing power, making it harder to afford essentials.

### Task

Determine whether wages have kept up with inflation over time. Viewers should be able to see trends in real vs nominal wages.

### Action

Build interactive charts showing nominal vs real wages, including filters for year.

### Result

The visualization shows that real wages remain mostly flat despite nominal increases.
Key metric: wage growth compared with inflation rate.

---

# Dataset & Provenance

**Wages:**
U.S. Bureau of Labor Statistics (BLS) – Student / part-time wage data
https://www.bls.gov/

**Inflation:**
U.S. Bureau of Labor Statistics Consumer Price Index (CPI)
https://www.bls.gov/cpi/

**Retrieval Date:**
March 9, 2026

**License:**
Public U.S. government data

---

# Data Dictionary

| Column       | Meaning                             | Units                   |
| ------------ | ----------------------------------- | ----------------------- |
| year         | Calendar year                       | YYYY                    |
| nominal_wage | Average student wage                | USD/hour                |
| cpi          | Consumer Price Index                | Index (1982–1984 = 100) |
| real_wage    | Nominal wage adjusted for inflation | USD/hour                |
| region       | U.S. region (optional)              | String                  |

---

# Data Viability Audit

**Missing Values**
Missing values will be filled using linear interpolation or removed if incomplete.

**Cleaning Plan**
Merge wage data with CPI data and calculate real wages.

**Dataset Limits**
Data only represents U.S. averages and may not reflect all student demographics.

---

# Draft Visualization

Line chart comparing:

* Nominal wages
* Real wages (inflation-adjusted)

This visualization answers the question by showing the trend comparison over time and highlighting the gap between nominal and real wages.

---

# Project Structure

```
web-app/
src/
components/
WageChart.tsx
data/
processed.json
```

---

# Notes

See `/data/notes.md` for:

* Source retrieval notes
* CPI adjustment calculations
* Data caveats
