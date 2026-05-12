# Are Student Wages Keeping Up with Inflation?

## Essential Question

Are part-time student wages keeping pace with inflation over the past 10 years?

## Claim (Hypothesis)

Nominal student wages have increased, but real wages adjusted for inflation have
stayed mostly flat.

## Audience

Current and prospective students, part-time workers, and university
administrators.

---

## STAR Framework

### Situation

Students often rely on part-time jobs to cover tuition and living costs.
Inflation reduces purchasing power, making essentials harder to afford.

### Task

Determine whether wages have kept up with inflation over time. Viewers should
be able to compare nominal wages with real wages and decide whether pay growth
actually improved student purchasing power.

### Action

Build an interactive data story with a line chart, a year slider, a specific
data callout, and a local evidence assistant that answers from the processed
dataset.

### Result

The visualization shows that real wages remain mostly flat despite nominal
wage increases. Key metric: nominal wage growth compared with real wage growth.

---

## Dataset & Provenance

**Wages:**  
U.S. Bureau of Labor Statistics (BLS) - Student / part-time wage data  
https://www.bls.gov/

**Inflation:**  
U.S. Bureau of Labor Statistics Consumer Price Index (CPI)  
https://www.bls.gov/cpi/

**Retrieval Date:**  
March 9, 2026

**License:**  
Public U.S. government data

---

## Data Dictionary

| Column | Meaning | Units |
| --- | --- | --- |
| year | Calendar year | YYYY |
| nominal_wage | Average student wage before inflation adjustment | USD/hour |
| cpi | Consumer Price Index | Index (1982-1984 = 100) |
| real_wage | Nominal wage adjusted for inflation | USD/hour |
| region | U.S. region, if added in a later version | String |

---

## Data Viability Audit

**Missing Values**  
Missing values will be filled using linear interpolation only when the missing
field is between two known years. Otherwise, incomplete rows will be removed.

**Cleaning Plan**  
Merge wage data with CPI data by year, validate numeric fields, and calculate
real wages so the chart can compare nominal pay with inflation-adjusted pay.

**Dataset Limits**  
The current dataset uses U.S. averages and cannot prove every student's
experience. It does not separate students by region, job type, school, age, or
hours worked.

---

## Draft Visualization

Line chart comparing:

* Nominal wages
* Real wages (inflation-adjusted)

This visualization answers the question by showing the trend comparison over
time and highlighting the gap between nominal and real wages.

---

## Interaction Design

The main interaction is a year-range slider that changes the chart by ending
the story at a selected year. This helps viewers test the claim instead of only
reading it: they can see whether the wage/inflation gap appears early or only
after more years are included.

The app also includes an "Ask the data" chatbox. It does not use a public API
key in the browser. Instead, it answers from the same processed dataset used by
the chart, so every response can be verified against the visual evidence. This
keeps the deployed app safer and better aligned with the rubric's evidence
requirement.

---

## Cleaning & Transform Notes

Raw wage and CPI fields are loaded into a predictable year-by-year structure.
Real wage is defined as the inflation-adjusted hourly wage used for comparing
purchasing power across years.

---

## Project Structure

```text
web-app/
src/
components/
WageChart.tsx
Chat.tsx
data/
processed.json
```

---

## Limits & What I'd Do Next

This prototype uses a small U.S. average dataset, so it cannot prove the
experience of every student, region, job type, or school. Next, I would add
regional wage and CPI data so students can compare the national trend with a
place they may actually live.

---

## Notes

See `/data/notes.md` for:

* Source retrieval notes
* CPI adjustment calculations
* Data caveats
