# student-reality-lab-Gutierrez
README.md — Starter Draft

Title:
Are Student Wages Keeping Up with Inflation?

Essential Question:
Are part-time student wages keeping pace with inflation over the past 10 years?

Claim (Hypothesis):
Nominal student wages have increased slightly, but real wages adjusted for inflation have stagnated.

Audience:
Current and prospective students, part-time workers, and university administrators.

STAR Draft:

S — Situation: Students often rely on part-time jobs to cover tuition and living costs. Inflation reduces purchasing power, making it harder to afford essentials.

T — Task: Determine whether wages have kept up with inflation over time. Viewers should be able to see trends in real vs nominal wages.

A — Action: Build 1–4 interactive charts showing nominal vs real wages, including filters for year and region.

R — Result: Expect to show that real wages have been mostly flat despite nominal increases. Key metric: wage growth vs inflation rate.

Dataset & Provenance:

Wages: U.S. Bureau of Labor Statistics (BLS) – “Student/part-time wages by year” (https://www.bls.gov/
)

Inflation: U.S. Bureau of Labor Statistics CPI (https://www.bls.gov/cpi/
)

Retrieval date: March 9, 2026

License: Public government data

Data Dictionary (example):

Column	Meaning	Units
year	Calendar year	YYYY
nominal_wage	Average student wage	USD/hour
cpi	Consumer Price Index	Index (1982–1984=100)
real_wage	Nominal wage adjusted for inflation	USD/hour
region	U.S. region (optional)	String

Data Viability Audit:

Missing values → fill using linear interpolation or remove years with incomplete data

Cleaning plan → merge wage + CPI, calculate real wages

Dataset limits → Only U.S. data; may not represent all student demographics

Draft Chart Screenshot:

Line chart: Year vs Real Wage vs Nominal Wage

Why it answers the question:

Shows trend comparison over time

Makes gap between nominal and real wages immediately visible

/data/notes.md:

Sources, retrieval notes, CPI adjustments, caveats
