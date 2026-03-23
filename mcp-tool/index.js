const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(bodyParser.json())

// Load local data (JSON) so MCP stub can answer data queries like "year 2017"
let wageData = []
try {
  const jsonPath = path.resolve(__dirname, '..', 'web-app', 'src', 'data', 'processed.json')
  console.log('Attempting to load JSON from:', jsonPath)
  const json = fs.readFileSync(jsonPath, 'utf8')
  wageData = JSON.parse(json)
  console.log(`Loaded wage data (${wageData.length} rows) from ${jsonPath}`)
} catch (e) {
  console.warn('Could not load wage data:', e.message)
}

// Helper: local year lookup
function lookupYear(message) {
  const yearMatch = String(message).match(/(19|20)\d{2}/)
  if (yearMatch && wageData.length) {
    const year = Number(yearMatch[0])
    const row = wageData.find(r => r.year === year)
    return { year, row }
  }
  return null
}

// Helper: find most recent year from a list of messages
function lookupYearFromHistory(messages) {
  if (!messages || !messages.length) return null
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (!m || !m.content) continue
    const found = lookupYear(m.content)
    if (found && found.row) return found
  }
  return null
}

// Configure API keys for OpenAI
const OPENAI_KEY = process.env.OPENAI_API_KEY

app.post('/mcp', async (req, res) => {
  // Accept either { message: string } or { messages: [{role, content}] }
  const body = req.body || {}
  const incomingMessage = body.message || ''
  const incomingMessages = Array.isArray(body.messages) ? body.messages : (incomingMessage ? [{ role: 'user', content: incomingMessage }] : [])

  console.log('MCP incoming message(s):', incomingMessages.map(m => m.content).join(' | '))

  // Use the latest user message for year lookup
  const userMessages = incomingMessages.filter(m => m.role === 'user' && m.content)
  const latestMessage = userMessages.length ? userMessages[userMessages.length - 1].content.trim() : incomingMessage.trim()

  console.log('latestMessage:', latestMessage)
  const latestYear = lookupYear(latestMessage)
  console.log('latestYear:', latestYear)
  const historyYear = lookupYearFromHistory(userMessages)
  const selectedYear = latestYear && latestYear.row ? latestYear : historyYear

  // If user asks to compare two specific years
  const compareMatch = latestMessage.match(/compare.*(\d{4}).*and.*(\d{4})/i)
  if (compareMatch) {
    const year1 = parseInt(compareMatch[1])
    const year2 = parseInt(compareMatch[2])
    const data1 = wageData.find(r => r.year === year1)
    const data2 = wageData.find(r => r.year === year2)

    // Check if both years exist
    if (!data1 && !data2) {
      const availableYears = wageData.map(r => r.year).join(', ')
      const reply = `I don't have data for either ${year1} or ${year2}. The available years are: ${availableYears}.`
      console.log('  comparison reply:', reply)
      return res.json({ reply })
    } else if (!data1) {
      const availableYears = wageData.map(r => r.year).join(', ')
      const reply = `I don't have data for ${year1}. The available years are: ${availableYears}.`
      console.log('  comparison reply:', reply)
      return res.json({ reply })
    } else if (!data2) {
      const availableYears = wageData.map(r => r.year).join(', ')
      const reply = `I don't have data for ${year2}. The available years are: ${availableYears}.`
      console.log('  comparison reply:', reply)
      return res.json({ reply })
    }

    // Both years exist, proceed with comparison
    const nomChange = ((data2.nominal_wage - data1.nominal_wage) / data1.nominal_wage * 100).toFixed(1)
    const cpiChange = ((data2.cpi - data1.cpi) / data1.cpi * 100).toFixed(1)
    const realChange = ((data2.real_wage - data1.real_wage) / data1.real_wage * 100).toFixed(1)
    const reply = `Comparing ${year1} and ${year2}: In ${year1}, the student wage was ${data1.nominal_wage}, with a CPI of ${data1.cpi}, resulting in a real wage of ${data1.real_wage}. In ${year2}, the student wage was ${data2.nominal_wage}, with a CPI of ${data2.cpi}, resulting in a real wage of ${data2.real_wage}. From ${year1} to ${year2}, nominal wages ${nomChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(nomChange)}%, CPI ${cpiChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(cpiChange)}%, and real wages ${realChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(realChange)}%.`
    console.log('  comparison reply:', reply)
    return res.json({ reply })
  }

  // If latest message includes explicit year, return that year data
  if (latestYear && latestYear.row) {
    const { year, row } = latestYear
    const reply = `In ${year}, the student wage was ${row.nominal_wage}, with a CPI of ${row.cpi}, resulting in a real wage of ${row.real_wage}.`
    console.log('  local year reply:', reply)
    return res.json({ reply })
  }

  // If user asks for all years or list
  if (/\b(all|list|every)\b/i.test(latestMessage) && /\b(year|years|wage)\b/i.test(latestMessage)) {
    const summary = wageData.map(row => `In ${row.year}, the student wage was ${row.nominal_wage}, with a CPI of ${row.cpi}, resulting in a real wage of ${row.real_wage}`).join(' ')
    const reply = `Here are all the years: ${summary}`
    console.log('  all years reply:', reply)
    return res.json({ reply })
  }

  // If user asks why wages changed and we have year context, provide year-over-year comparison
  if (/\bwhy.*(increase|decrease|change|higher|lower|different)\b/i.test(latestMessage) && selectedYear && selectedYear.row) {
    const { year, row } = selectedYear
    const prevYear = wageData.find(r => r.year === year - 1)
    if (prevYear) {
      const nomChange = ((row.nominal_wage - prevYear.nominal_wage) / prevYear.nominal_wage * 100).toFixed(1)
      const cpiChange = ((row.cpi - prevYear.cpi) / prevYear.cpi * 100).toFixed(1)
      const realChange = ((row.real_wage - prevYear.real_wage) / prevYear.real_wage * 100).toFixed(1)
      const reply = `From ${prevYear.year} to ${year}, nominal wages ${nomChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(nomChange)}%, CPI ${cpiChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(cpiChange)}%, resulting in real wages ${realChange > 0 ? 'increasing' : 'decreasing'} by ${Math.abs(realChange)}%. This shows how inflation affects purchasing power.`
      console.log('  change explanation reply:', reply)
      return res.json({ reply })
    }
  }

  // If user asks about overall trends or reasons for increases over time
  if (/\b(why|what.*reason|how.*come|trend|over time|historically|overall|reason)\b/i.test(latestMessage) && /\b(increase|decrease|change|grow|rise|fall|trend)s?\b/i.test(latestMessage)) {
    if (wageData.length > 1) {
      const first = wageData[0]
      const last = wageData[wageData.length - 1]
      const years = last.year - first.year
      const nomChange = ((last.nominal_wage - first.nominal_wage) / first.nominal_wage * 100).toFixed(1)
      const cpiChange = ((last.cpi - first.cpi) / first.cpi * 100).toFixed(1)
      const realChange = ((last.real_wage - first.real_wage) / first.real_wage * 100).toFixed(1)
      const reply = `Over the ${years} years from ${first.year} to ${last.year}, nominal wages increased by ${nomChange}%, CPI increased by ${cpiChange}%, resulting in real wages ${realChange > 0 ? 'increasing' : 'decreasing'} by ${Math.abs(realChange)}%. This indicates that while wages have grown nominally, inflation has largely kept pace, with real purchasing power remaining relatively stable.`
      console.log('  overall trend reply:', reply)
      return res.json({ reply })
    }
  }

  // If user asks for reasoning/comparison and we have a year context, do reasoning
  const intentReason = /\b(why|because|explain|compare|difference)\b/i.test(latestMessage)
  if (intentReason && selectedYear && selectedYear.row) {
    const { year, row } = selectedYear
    const reply = `For ${year}, nominal wage ${row.nominal_wage} and CPI ${row.cpi} give a real wage of ${row.real_wage}. The real wage is nominal wage adjusted for inflation. Wages increase slowly, but CPI rises, so real purchasing power may not improve much.`
    console.log('  local reasoning reply:', reply)
    return res.json({ reply })
  }

  // If we have a recent year context and user asks a casual follow-up, return contextual summary
  if (selectedYear && selectedYear.row && /\b(really|barely|more|less|increase|decrease|still|trend)\b/i.test(latestMessage)) {
    const { year, row } = selectedYear
    const reply = `Looking at ${year}, nominal wage ${row.nominal_wage} with CPI ${row.cpi} gives real wage ${row.real_wage}. The trend shows real wages are mostly stable over time.`
    console.log('  local followup summary:', reply)
    return res.json({ reply })
  }

  // If user asks for definitions of terms
  if (/\bwhat (is|does|means?)\b/i.test(latestMessage)) {
    if (/\binflation\b/i.test(latestMessage)) {
      const reply = "Inflation is the rate at which the general level of prices for goods and services rises, eroding purchasing power. It's measured by the Consumer Price Index (CPI). When inflation occurs, a dollar buys less than it did before. Real wages account for inflation to show actual purchasing power."
      console.log('  definition reply for inflation:', reply)
      return res.json({ reply })
    }
    if (/\bcpi\b/i.test(latestMessage)) {
      const reply = "CPI stands for Consumer Price Index. It measures the average change in prices paid by consumers for goods and services over time. A higher CPI indicates higher inflation. Real wages are calculated by adjusting nominal wages for inflation using CPI."
      console.log('  definition reply for CPI:', reply)
      return res.json({ reply })
    }
    if (/\bnominal.*wage\b/i.test(latestMessage)) {
      const reply = "Nominal wage is the actual dollar amount of wages paid, without adjusting for inflation. It represents the face value of earnings in current dollars."
      console.log('  definition reply for nominal wage:', reply)
      return res.json({ reply })
    }
    if (/\breal.*wage\b/i.test(latestMessage)) {
      const reply = "Real wage is the wage adjusted for inflation. It's calculated as nominal wage divided by CPI (multiplied by 100). It shows the actual purchasing power of wages over time."
      console.log('  definition reply for real wage:', reply)
      return res.json({ reply })
    }
  }

  // If user asks why wages changed and we have year context, provide year-over-year comparison
  if (/\bwhy.*(increase|decrease|change|higher|lower|different)\b/i.test(latestMessage) && selectedYear && selectedYear.row) {
    const { year, row } = selectedYear
    const prevYear = wageData.find(r => r.year === year - 1)
    if (prevYear) {
      const nomChange = ((row.nominal_wage - prevYear.nominal_wage) / prevYear.nominal_wage * 100).toFixed(1)
      const cpiChange = ((row.cpi - prevYear.cpi) / prevYear.cpi * 100).toFixed(1)
      const realChange = ((row.real_wage - prevYear.real_wage) / prevYear.real_wage * 100).toFixed(1)
      const reply = `From ${prevYear.year} to ${year}, nominal wages ${nomChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(nomChange)}%, CPI ${cpiChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(cpiChange)}%, resulting in real wages ${realChange > 0 ? 'increasing' : 'decreasing'} by ${Math.abs(realChange)}%. This shows how inflation affects purchasing power.`
      console.log('  change explanation reply:', reply)
      return res.json({ reply })
    }
  }

  // If we have a query that is not a strict year answer, use local reasoning
  const activeMessage = incomingMessage || (incomingMessages[0] && incomingMessages[0].content) || ''
  const queryText = latestMessage || activeMessage

  // For general questions, provide helpful responses based on context
  if (selectedYear && selectedYear.row) {
    const { year, row } = selectedYear
    const reply = `Based on the data, in ${year} the student wage was ${row.nominal_wage}, with a CPI of ${row.cpi}, resulting in a real wage of ${row.real_wage}. This is from the student wages dataset.`
    console.log('  local general reply:', reply)
    return res.json({ reply })
  }

  // Fallback: friendly local-chat behavior
  const recentYear = lookupYearFromHistory(userMessages)
  if (recentYear && recentYear.row) {
    const { year, row } = recentYear
    return res.json({ reply: `I'm happy to help. In ${year}, the student wage was ${row.nominal_wage}, with a CPI of ${row.cpi}, resulting in a real wage of ${row.real_wage}. You can ask about another year or request a comparison.` })
  }
  return res.json({ reply: `Hi there! I can answer student wage questions from the chart data. Try: "what is the student wage for 2019" or "year 2017".` })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`MCP tool listening on http://localhost:${port}`))
