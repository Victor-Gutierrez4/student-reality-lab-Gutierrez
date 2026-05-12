import React from 'react';
import WageChart from './components/WageChart';
import Chat from './components/Chat';
import './App.css';

function App() {
  return (
    <main className="story-shell">
      <section className="hero">
        <div className="section-kicker">Student Reality Lab</div>
        <h1>Are Student Wages Keeping Up With Inflation?</h1>
        <p>
          Many students work part-time jobs while in school. This data story
          tests whether wage growth has actually improved purchasing power once
          inflation is included.
        </p>
      </section>

      <section className="claim-strip" aria-label="Claim and takeaway">
        <div>
          <span>Claim</span>
          <p>
            Student wages increased in dollars, but inflation kept real wage
            gains small.
          </p>
        </div>
        <div>
          <span>Takeaway</span>
          <p>
            Students should compare pay raises with inflation before assuming
            they can afford more.
          </p>
        </div>
      </section>

      <WageChart />
      <Chat />

      <section className="story-text" aria-labelledby="notice-heading">
        <h2 id="notice-heading">What to notice</h2>
        <p>
          The blue line shows the hourly wage students would see on a paycheck.
          That number rises from 2013 to 2022, which can make the labor market
          look healthier at first glance. The green line adjusts those wages for
          inflation, showing what the pay is worth after prices rise. The
          important pattern is the gap between the two lines: nominal pay moves
          upward, but real pay changes much more slowly. Use the slider to stop
          at an earlier year and see how the conclusion develops over time. The
          data does not prove every student has the same experience, but it does
          show why a higher hourly wage is not automatically a better financial
          reality.
        </p>
      </section>
    </main>
  );
}

export default App;
