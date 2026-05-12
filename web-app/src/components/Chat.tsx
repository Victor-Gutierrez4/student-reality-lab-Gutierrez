import React, { useMemo, useState } from 'react';
import rawData from '../data/processed.json';

type Msg = { role: 'user' | 'assistant'; content: string };

type WageRecord = {
  year: number;
  nominal_wage: number;
  cpi: number;
  real_wage: number;
};

const data = rawData as WageRecord[];

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

function percentChange(start: number, end: number) {
  return (((end - start) / start) * 100).toFixed(1);
}

function findYears(message: string) {
  return Array.from(message.matchAll(/\b(20\d{2}|19\d{2})\b/g)).map((match) =>
    Number(match[0])
  );
}

function answerQuestion(message: string) {
  const lower = message.toLowerCase();
  const years = findYears(message);
  const first = data[0];
  const last = data[data.length - 1];

  if (years.length >= 2) {
    const start = data.find((row) => row.year === years[0]);
    const end = data.find((row) => row.year === years[1]);

    if (!start || !end) {
      return `I can compare years from ${first.year} through ${last.year}. Try comparing ${first.year} and ${last.year}.`;
    }

    return `From ${start.year} to ${end.year}, nominal wages changed from ${formatMoney(
      start.nominal_wage
    )} to ${formatMoney(end.nominal_wage)}, a ${percentChange(
      start.nominal_wage,
      end.nominal_wage
    )}% increase. Real wages changed from ${formatMoney(
      start.real_wage
    )} to ${formatMoney(end.real_wage)}, only a ${percentChange(
      start.real_wage,
      end.real_wage
    )}% increase after inflation.`;
  }

  if (years.length === 1) {
    const row = data.find((item) => item.year === years[0]);

    if (!row) {
      return `The chart covers ${first.year} through ${last.year}, so I do not have a data point for ${years[0]}.`;
    }

    return `In ${row.year}, the nominal student wage is ${formatMoney(
      row.nominal_wage
    )}/hour. Adjusted for inflation, that is ${formatMoney(
      row.real_wage
    )}/hour, with CPI at ${row.cpi}.`;
  }

  if (lower.includes('cpi') || lower.includes('inflation')) {
    return 'CPI is the Consumer Price Index. This project uses CPI to convert nominal wages into real wages, which shows purchasing power after inflation.';
  }

  if (lower.includes('real wage') || lower.includes('real wages')) {
    return 'Real wage means the hourly wage after adjusting for inflation. It is the better measure for whether students can actually buy more over time.';
  }

  if (lower.includes('claim') || lower.includes('takeaway') || lower.includes('show')) {
    return `The main takeaway is that nominal wages rose ${percentChange(
      first.nominal_wage,
      last.nominal_wage
    )}% from ${first.year} to ${last.year}, but real wages rose only ${percentChange(
      first.real_wage,
      last.real_wage
    )}%. The pay number went up more than student purchasing power did.`;
  }

  return `Ask me about a year, compare two years, or ask what real wages mean. I answer only from the ${data.length} rows used in this chart.`;
}

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content:
        'I can explain the chart data. Try "compare 2013 and 2022" or "what is real wage?"',
    },
  ]);
  const [input, setInput] = useState('');

  const suggestions = useMemo(
    () => ['Compare 2013 and 2022', 'What is real wage?', 'What is the takeaway?'],
    []
  );

  function send(text = input) {
    const question = text.trim();
    if (!question) return;

    const userMsg: Msg = { role: 'user', content: question };
    const reply: Msg = { role: 'assistant', content: answerQuestion(question) };

    setMessages((current) => [...current, userMsg, reply]);
    setInput('');
  }

  return (
    <section className="chat-panel" aria-labelledby="chat-heading">
      <div className="section-kicker">Evidence assistant</div>
      <h2 id="chat-heading">Ask the data</h2>
      <p className="chat-intro">
        This chat answers from the same processed data used in the chart, so the
        response can be checked against the visualization.
      </p>

      <div className="chat-log" aria-live="polite">
        {messages.map((message, index) => (
          <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
            <strong>{message.role === 'user' ? 'You' : 'Data assistant'}</strong>
            <span>{message.content}</span>
          </div>
        ))}
      </div>

      <div className="suggestions" aria-label="Suggested questions">
        {suggestions.map((suggestion) => (
          <button type="button" key={suggestion} onClick={() => send(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') send();
          }}
          placeholder="Ask about a year or comparison"
          aria-label="Ask a question about the wage data"
        />
        <button type="button" onClick={() => send()}>
          Send
        </button>
      </div>
    </section>
  );
}
