// Step-through animation of call_stack.py: the code, the call stack, and the terminal.
// Markup: <div class="cstack"></div> inside a slide. N = next, B = back (only while that slide is shown).
// Every output line and traceback below was copied from a real `python3 call_stack.py` (Python 3.14).
;(function () {
  const css = `
  .cstack { display: grid; grid-template-columns: 400px 1fr 520px; gap: 28px; margin-top: 6px; }
  .cstack .col h4 { margin: 0 0 10px; font: 600 17px var(--mono); color: var(--muted); letter-spacing: .04em; }
  .cstack .code { background: var(--ink); color: #e9edf5; border-radius: 10px; padding: 14px 0; font: 19px/1.5 var(--mono); }
  .cstack .ln span { white-space: pre; }
  .cstack .ln { display: flex; padding: 0 16px; border-left: 5px solid transparent; transition: background .2s; }
  .cstack .ln i { width: 34px; flex: none; color: #6b7a96; font-style: normal; text-align: right; margin-right: 18px; }
  .cstack .ln.on { background: rgba(255,214,102,.20); border-left-color: #ffd666; }
  .cstack .ln.err { background: rgba(200,55,45,.35); border-left-color: #ff6b5f; }
  .cstack .ln .k { color: #c586c0; } .cstack .ln .f { color: #dcdcaa; } .cstack .ln .s { color: #ce9178; } .cstack .ln .n { color: #b5cea8; }
  .cstack .stackwrap { height: 470px; border: 3px solid var(--ink); border-top: none; border-radius: 0 0 12px 12px; display: flex; flex-direction: column-reverse; gap: 10px; padding: 12px; background: #fff; position: relative; }
  .cstack .empty { position: absolute; inset: 0; display: grid; place-items: center; color: var(--muted); font: 20px var(--mono); }
  .cstack .fr { border-radius: 10px; padding: 12px 18px; font: 600 26px var(--mono); background: #e6eaf1; color: #5b667a; border: 2px solid #c3cad6; display: flex; justify-content: space-between; align-items: baseline; gap: 12px; white-space: nowrap; }
  .cstack .fr small { font: 500 16px var(--mono); }
  .cstack .fr.top { background: #dfe7fb; color: var(--blue); border-color: var(--blue); box-shadow: 0 3px 0 #b9c8f2; }
  .cstack .fr.bad { background: #fbe1df; color: var(--red); border-color: var(--red); box-shadow: none; }
  .cstack .fr.in { animation: cs-in .45s ease-out; }
  .cstack .fr.out { animation: cs-out .45s ease-in forwards; }
  @keyframes cs-in { from { transform: translateY(-140px); opacity: 0 } to { transform: none; opacity: 1 } }
  @keyframes cs-out { to { transform: translateY(-160px); opacity: 0 } }
  .cstack .cs-tag { font: 600 16px var(--mono); color: var(--muted); text-align: center; margin-bottom: 6px; }
  .cstack .cs-tag b { color: var(--blue); }
  .cstack .term { background: #0f141d; color: #e9edf5; border-radius: 10px; padding: 14px 16px; font: 16px/1.45 var(--mono); height: 470px; overflow: hidden; white-space: pre; }
  .cstack .term .p { color: #8fa1bd; } .cstack .term .e { color: #ff8a80; } .cstack .term .new { background: rgba(255,214,102,.18); }
  .csbar { display: flex; align-items: center; gap: 14px; margin-top: 18px; }
  .csbar .cap { flex: 1; font-size: 25px; line-height: 1.3; min-height: 66px; }
  .csbar button { font: 600 18px var(--mono); padding: 10px 16px; border-radius: 8px; border: 2px solid var(--ink); background: #fff; cursor: pointer; }
  .csbar button.go { background: var(--blue); border-color: var(--blue); color: #fff; }
  .csbar .count { font: 16px var(--mono); color: var(--muted); width: 70px; text-align: right; }
  .csrun { display: inline-flex; gap: 0; margin-left: 16px; vertical-align: middle; }
  .csrun button { font: 600 16px var(--mono); padding: 6px 12px; border: 2px solid var(--ink); background: #fff; cursor: pointer; }
  .csrun button:first-child { border-radius: 8px 0 0 8px; } .csrun button:last-child { border-radius: 0 8px 8px 0; border-left: none; }
  .csrun button.on { background: var(--ink); color: #fff; }`
  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`)

  const BASE = ['def a():', '    print("a starts")', '    b()', '    print("a ends")', '', 'def b():', '    print("b starts")', '    c()', '    print("b ends")', '', 'def c():', '    print("c starts")']
  const CODE = {
    ok: [...BASE, '    print("c ends")', '', 'a()'],
    crash: [...BASE, '    print(10 / 0)', '    print("c ends")', '', 'a()'],
  }
  const M = (line) => ({ fn: '<module>', line }), F = (fn, line) => ({ fn: fn + '()', line })
  const TB = ['Traceback (most recent call last):',
    '  File ".../call_stack.py", line 16, in <module>', '    a()', '    ~^^',
    '  File ".../call_stack.py", line 3, in a', '    b()', '    ~^^',
    '  File ".../call_stack.py", line 8, in b', '    c()', '    ~^^',
    '  File ".../call_stack.py", line 13, in c', '    print(10 / 0)', '          ~~~^~~',
    '!ZeroDivisionError: division by zero']

  // The steps up to "c starts" are the same in both runs; only the last line number of the file differs.
  const start = (last) => [
    { line: 0, stack: [], out: [], cap: 'Press <b>N</b> to step. The stack is empty: nothing is running yet.' },
    { line: last, stack: [M(last)], out: [], cap: `Python starts the file. The file itself is the first frame, <code>&lt;module&gt;</code>. Line ${last} calls <code>a()</code>.` },
    { line: 2, stack: [M(last), F('a', 2)], out: ['a starts'], cap: '<code>a()</code> goes <b>ON</b> the stack (push). Only the frame on top runs.' },
    { line: 3, stack: [M(last), F('a', 3)], out: [], cap: '<code>a</code> calls <code>b()</code>. <code>a</code> pauses on line 3 and waits.' },
    { line: 7, stack: [M(last), F('a', 3), F('b', 7)], out: ['b starts'], cap: '<code>b()</code> goes on top. <code>a</code> is still there underneath, waiting.' },
    { line: 8, stack: [M(last), F('a', 3), F('b', 8)], out: [], cap: '<code>b</code> calls <code>c()</code>. <code>b</code> waits on line 8.' },
    { line: 12, stack: [M(last), F('a', 3), F('b', 8), F('c', 12)], out: ['c starts'], cap: '<code>c()</code> goes on top. Two calls under it are waiting to finish.' },
  ]
  const RUNS = {
    ok: [...start(15),
      { line: 13, stack: [M(15), F('a', 3), F('b', 8), F('c', 13)], out: ['c ends'], cap: '<code>c</code> runs its last line.' },
      { line: 8, stack: [M(15), F('a', 3), F('b', 8)], out: [], cap: '<code>c</code> is done: it comes <b>OFF</b> the stack (pop). <code>b</code> carries on right after line 8.' },
      { line: 9, stack: [M(15), F('a', 3), F('b', 9)], out: ['b ends'], cap: '<code>b</code> runs its last line.' },
      { line: 3, stack: [M(15), F('a', 3)], out: [], cap: '<code>b</code> comes off. <code>a</code> carries on right after line 3.' },
      { line: 4, stack: [M(15), F('a', 4)], out: ['a ends'], cap: '<code>a</code> runs its last line.' },
      { line: 15, stack: [M(15)], out: [], cap: '<code>a</code> comes off. We are back in the file, on line 15.' },
      { line: 0, stack: [], out: [], cap: 'The file ends; the stack is empty. <b>c</b> went on last and came off first. <b>a</b> went on first and came off last: <b>LIFO</b>.' },
    ],
    crash: [...start(16),
      { line: 13, err: true, stack: [M(16), F('a', 3), F('b', 8), F('c', 13)], bad: 1, out: [], cap: '<code>10 / 0</code> raises <code>ZeroDivisionError</code>. Nothing in <code>c</code> catches it, so <code>c</code> cannot finish.' },
      { line: 8, err: true, stack: [M(16), F('a', 3), F('b', 8)], bad: 1, out: [], cap: '<code>c</code> comes off without finishing. The error lands in <code>b</code>, on line 8. <code>b</code> does not catch it either.' },
      { line: 3, err: true, stack: [M(16), F('a', 3)], bad: 1, out: [], cap: '<code>b</code> comes off. The error lands in <code>a</code>, on line 3.' },
      { line: 16, err: true, stack: [M(16)], bad: 1, out: [], cap: '<code>a</code> comes off. The error reaches the file, line 16.' },
      { line: 0, stack: [], out: TB, cap: 'Nobody caught it, so Python stops and prints the <b>traceback</b>: the frames we just watched, bottom of the stack first (line 16, 3, 8, 13). No "ends" line ever printed.' },
    ],
  }

  const hl = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/"[^"]*"/g, (m) => `<span class="s">${m}</span>`)
    .replace(/\b(def)\b/g, '<span class="k">$1</span>')
    .replace(/\b(print|a|b|c)(?=\()/g, '<span class="f">$1</span>')
    .replace(/\b(10|0)\b(?![^<]*<\/span>)/g, '<span class="n">$1</span>')

  document.querySelectorAll('.cstack').forEach((root) => {
    const slide = root.closest('.slide')
    root.innerHTML = `<div class="col"><h4>call_stack.py</h4><div class="code"></div></div>
      <div class="col"><h4>THE CALL STACK</h4><div class="cs-tag">calls go on and come off the <b>top</b></div><div class="stackwrap"></div></div>
      <div class="col"><h4>TERMINAL</h4><div class="term"></div></div>`
    const bar = document.createElement('div'); bar.className = 'csbar'
    bar.innerHTML = '<div class="cap"></div><button data-a="back">◀ Back (B)</button><button class="go" data-a="next">Next ▶ (N)</button><button data-a="play">▶ Play</button><button data-a="reset">Reset</button><div class="count"></div>'
    root.after(bar)
    const h2 = slide.querySelector('h2'), pick = document.createElement('span'); pick.className = 'csrun'
    pick.innerHTML = '<button data-r="ok" class="on">Run 1: no error</button><button data-r="crash">Run 2: 10 / 0</button>'
    h2.append(pick)
    const $ = (s) => root.querySelector(s)
    let run = 'ok', i = 0, timer = null

    const draw = (dir) => {
      const steps = RUNS[run], st = steps[i], prev = steps[i - dir] || st
      $('.code').innerHTML = CODE[run].map((t, n) => `<div class="ln${st.line === n + 1 ? (st.err ? ' err' : ' on') : ''}"><i>${n + 1}</i><span>${hl(t) || ' '}</span></div>`).join('')
      // terminal: everything printed up to this step
      const lines = ['$ python3 call_stack.py']
      steps.slice(0, i + 1).forEach((s) => lines.push(...s.out))
      const fresh = dir === 1 ? st.out.length : 0
      $('.term').innerHTML = lines.map((l, n) => {
        const cls = n === 0 ? 'p' : l.startsWith('!') ? 'e' : ''
        const isNew = n >= lines.length - fresh && fresh > 0 && st.out !== TB
        return `<div class="${cls}${isNew ? ' new' : ''}">${hl(l.replace(/^!/, '')).replace(/<span class="[a-z]">|<\/span>/g, '')}</div>`
      }).join('')
      // stack: frames bottom to top; animate the one pushed or popped when moving forward
      const wrap = $('.stackwrap')
      const frames = st.stack.map((f, n) => {
        const top = n === st.stack.length - 1
        const cls = st.bad && top ? 'bad' : top ? 'top' : ''
        const pushed = dir === 1 && st.stack.length > prev.stack.length && top
        return `<div class="fr ${cls}${pushed ? ' in' : ''}"><span>${hl(f.fn)}</span><small>${top ? (st.bad ? 'error here' : 'running') : 'waiting'} · line ${f.line}</small></div>`
      })
      wrap.innerHTML = frames.join('') + (st.stack.length ? '' : '<div class="empty">(empty)</div>')
      if (dir === 1 && prev.stack.length > st.stack.length) {
        const gone = prev.stack[prev.stack.length - 1], el = document.createElement('div')
        el.className = 'fr out ' + (prev.bad || st.bad || (st.out === TB) ? 'bad' : 'top')
        el.innerHTML = `<span>${hl(gone.fn)}</span><small>done</small>`
        wrap.append(el); setTimeout(() => el.remove(), 460)
      }
      bar.querySelector('.cap').innerHTML = st.cap
      bar.querySelector('.count').textContent = `${i} / ${steps.length - 1}`
    }
    const stop = () => { clearInterval(timer); timer = null; bar.querySelector('[data-a=play]').textContent = '▶ Play' }
    const next = () => { if (i < RUNS[run].length - 1) { i++; draw(1) } else stop() }
    const back = () => { stop(); if (i > 0) { i--; draw(-1) } }
    const reset = () => { stop(); i = 0; draw(0) }
    const play = () => {
      if (timer) return stop()
      if (i >= RUNS[run].length - 1) reset()
      bar.querySelector('[data-a=play]').textContent = '❚❚ Pause'
      timer = setInterval(next, 1800)
    }
    const act = { next: () => { stop(); next() }, back, reset, play }
    bar.addEventListener('click', (e) => { const a = e.target.dataset.a; if (a) act[a]() })
    pick.addEventListener('click', (e) => {
      const r = e.target.dataset.r; if (!r) return
      run = r; pick.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.r === r)); reset()
    })
    addEventListener('keydown', (e) => {
      if (!slide.classList.contains('active') || e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); act.next() }
      else if (e.key === 'b' || e.key === 'B') { e.preventDefault(); back() }
    })
    // N in the presenter window arrives on the codepad channel
    new BroadcastChannel('codepad:' + location.pathname).onmessage = ({ data: d }) => {
      if (d.t === 'cmd' && d.c === 'next' && slide.classList.contains('active')) act.next()
    }
    reset()
  })
})()
