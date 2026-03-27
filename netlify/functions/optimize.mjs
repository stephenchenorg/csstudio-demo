// H型鋼排料最佳化演算法 — Netlify Serverless Function
// Kerf: 每支零件 = 1 刀 kerf (N 支 = N 刀)
// 支援混合定尺料排料 + 多策略搜尋最小總用料

function generatePatterns(sizes, stockLen, kerf) {
  const results = []
  function recurse(idx, rem, cur) {
    if (idx === sizes.length) {
      if (cur.some(c => c > 0)) results.push([...cur])
      return
    }
    const s = sizes[idx]
    const maxN = Math.floor(rem / (s + kerf))
    for (let n = 0; n <= maxN; n++) {
      cur[idx] = n
      recurse(idx + 1, rem - n * (s + kerf), cur)
    }
    cur[idx] = 0
  }
  recurse(0, stockLen, new Array(sizes.length).fill(0))
  return results
}

function patternUsed(pattern, sizes, kerf) {
  let total = 0, cnt = 0
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] > 0) { total += pattern[i] * sizes[i]; cnt += pattern[i] }
  }
  total += cnt * kerf
  return total
}

function optimizeSpec(parts, stockLengths, kerf) {
  const demand = {}
  parts.forEach(p => {
    if (p.length > 0 && p.qty > 0) demand[p.length] = (demand[p.length] || 0) + p.qty
  })

  const distinctLens = Object.keys(demand).map(Number).sort((a, b) => b - a)
  if (!distinctLens.length) return []

  const stocks = [...stockLengths].sort((a, b) => b - a)

  const allPatterns = []
  for (const stock of stocks) {
    const patterns = generatePatterns(distinctLens, stock, kerf)
    for (const counts of patterns) {
      const used = patternUsed(counts, distinctLens, kerf)
      if (used <= stock) {
        allPatterns.push({
          stock, counts, used,
          waste: stock - used,
          totalPieces: counts.reduce((s, v) => s + v, 0),
          util: used / stock,
        })
      }
    }
  }
  allPatterns.sort((a, b) => b.util - a.util || b.totalPieces - a.totalPieces)

  function getMaxTimes(pat, dem) {
    let t = Infinity
    for (let i = 0; i < distinctLens.length; i++) {
      if (pat.counts[i] > 0) {
        const avail = dem[distinctLens[i]] || 0
        if (avail < pat.counts[i]) return 0
        t = Math.min(t, Math.floor(avail / pat.counts[i]))
      }
    }
    return t === Infinity ? 0 : t
  }

  function applyN(pat, dem, n) {
    const d = { ...dem }
    for (let i = 0; i < distinctLens.length; i++)
      d[distinctLens[i]] = (d[distinctLens[i]] || 0) - pat.counts[i] * n
    return d
  }

  function demandEmpty(dem) {
    return distinctLens.every(l => (dem[l] || 0) <= 0)
  }

  function makeBins(pat, n) {
    return Array.from({ length: n }, () => ({
      stock: pat.stock, counts: [...pat.counts], waste: pat.waste, usedLength: pat.used,
    }))
  }

  function runGreedy(dem) {
    const bins = []
    const rem = { ...dem }
    while (!demandEmpty(rem)) {
      let applied = false
      for (const ap of allPatterns) {
        const mt = getMaxTimes(ap, rem)
        if (mt > 0) {
          bins.push(...makeBins(ap, mt))
          for (let i = 0; i < distinctLens.length; i++)
            rem[distinctLens[i]] -= ap.counts[i] * mt
          applied = true
          break
        }
      }
      if (!applied) {
        for (const stock of stocks) {
          const bin = { stock, counts: new Array(distinctLens.length).fill(0), waste: 0, usedLength: 0 }
          let r = stock
          for (let i = 0; i < distinctLens.length; i++) {
            while ((rem[distinctLens[i]] || 0) > 0 && r >= distinctLens[i] + kerf) {
              bin.counts[i]++; rem[distinctLens[i]]--; r -= (distinctLens[i] + kerf)
            }
          }
          if (bin.counts.some(c => c > 0)) {
            bin.usedLength = stock - r; bin.waste = r; bins.push(bin); applied = true; break
          }
        }
        if (!applied) break
      }
    }
    return bins
  }

  function totalStock(bins) { return bins.reduce((s, b) => s + b.stock, 0) }

  let bestTotal = Infinity
  let bestBins = null
  function tryCandidate(bins) {
    const t = totalStock(bins)
    if (t < bestTotal) { bestTotal = t; bestBins = bins }
  }

  // 1. Pure greedy
  tryCandidate(runGreedy({ ...demand }))

  // 2. Single-level search
  const TOP1 = Math.min(allPatterns.length, 30)
  for (let i = 0; i < TOP1; i++) {
    const fp = allPatterns[i]
    const mt = getMaxTimes(fp, demand)
    if (mt <= 0) continue
    tryCandidate([...makeBins(fp, mt), ...runGreedy(applyN(fp, demand, mt))])
  }

  // 3. Two-level search
  for (let i = 0; i < TOP1; i++) {
    const fp = allPatterns[i]
    if (getMaxTimes(fp, demand) < 1) continue
    const dem1 = applyN(fp, demand, 1)
    const TOP2 = Math.min(allPatterns.length, 15)
    for (let j = 0; j < TOP2; j++) {
      const sp = allPatterns[j]
      const mt2 = getMaxTimes(sp, dem1)
      if (mt2 <= 0) continue
      tryCandidate([...makeBins(fp, 1), ...makeBins(sp, mt2), ...runGreedy(applyN(sp, dem1, mt2))])
    }
  }

  // Assign names
  const namePool = {}
  parts.forEach(p => {
    if (p.length > 0 && p.qty > 0) {
      if (!namePool[p.length]) namePool[p.length] = []
      for (let i = 0; i < p.qty; i++) namePool[p.length].push(p.name)
    }
  })

  bestBins.forEach(bin => {
    bin.pieces = []
    for (let i = 0; i < distinctLens.length; i++) {
      for (let k = 0; k < bin.counts[i]; k++) {
        const name = (namePool[distinctLens[i]] && namePool[distinctLens[i]].length)
          ? namePool[distinctLens[i]].shift() : '?'
        bin.pieces.push({ name, length: distinctLens[i] })
      }
    }
    const lg = {}
    bin.pieces.forEach(p => { lg[p.length] = (lg[p.length] || 0) + 1 })
    const sl = Object.keys(lg).map(Number).sort((a, b) => b - a)
    bin.cutCombo = sl.map(l => lg[l] > 1 ? l + '*' + lg[l] : String(l)).join(' + ')
    bin.cutCount = bin.pieces.length
    delete bin.counts
  })

  bestBins.sort((a, b) => b.stock - a.stock || b.usedLength - a.usedLength)
  return bestBins
}

// Netlify Function handler
export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  try {
    const { specs, stockLengths, kerf } = await req.json()

    if (!Array.isArray(specs) || !specs.length) {
      return new Response(JSON.stringify({ error: '請提供規格資料' }), { status: 400 })
    }

    const results = specs.map(spec => {
      const bins = optimizeSpec(spec.parts, stockLengths, kerf)
      const unitWeight = spec.unitWeight || 0

      let cutWeightTotal = 0
      let purchaseWeightTotal = 0
      const procurement = {}

      bins.forEach(bin => {
        bin.purchaseWeight = (bin.stock / 1000) * unitWeight
        bin.cutWeight = (bin.usedLength / 1000) * unitWeight
        bin.wasteWeight = (bin.waste / 1000) * unitWeight
        bin.wastePercent = bin.stock > 0 ? (bin.waste / bin.stock * 100) : 0
        cutWeightTotal += bin.cutWeight
        purchaseWeightTotal += bin.purchaseWeight
        procurement[bin.stock] = (procurement[bin.stock] || 0) + 1
      })

      return {
        spec: { name: spec.name, unitWeight, material: spec.material },
        bins,
        cutWeightTotal,
        purchaseWeightTotal,
        procurement,
      }
    })

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
}
