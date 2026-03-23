import React from 'react';
import WageChart from './components/WageChart';
import Chat from './components/Chat';

function App() {
  return (
    <div
  style={{
    maxWidth: "900px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
    padding: "20px"
  }}
>

  <h1 style={{ textAlign: "center" }}>
    Are Student Wages Keeping Up With Inflation?
  </h1>

  <p style={{ textAlign: "center", color: "#555" }}>
    Many students work part-time jobs while in school. This project explores
    whether wage growth has kept up with inflation over time and how rising
    prices may affect student purchasing power.
  </p>

  <div style={{ margin: "40px 0" }}>
    <WageChart />
  </div>

  <div style={{ margin: "24px 0" }}>
    <Chat />
  </div>

  <h3>Claim</h3>
  <p>
    Wage growth for students has increased slightly over time, but inflation
    has often risen at a similar or faster rate, meaning the real value of
    wages has not improved significantly.
  </p>

  <h3>Takeaway</h3>
  <p>
    Even when wages increase, inflation can reduce real purchasing power.
    This makes it harder for students to keep up with living costs while
    attending school.
  </p>

</div>
  );
}

export default App;