const fs = require('fs')
const path = require('path')

// Very small QA script that checks each spec has a corresponding sprint file
const specsDir = path.join(__dirname, '..', 'docs', 'specs')
const sprintsDir = path.join(__dirname, '..', 'docs', 'sprints')

function listMd(dir) {
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.md')) : []
}

const specs = listMd(specsDir)
const sprints = listMd(sprintsDir)

const missing = specs.filter(s => {
  const name = s.replace('.md', '')
  return !sprints.some(sp => sp.startsWith(name))
})

console.log('Specs:', specs)
console.log('Sprints:', sprints)
if (missing.length) {
  console.log('Missing sprint files for specs:', missing)
  process.exitCode = 2
} else {
  console.log('All specs have sprint files (basic check).')
}
