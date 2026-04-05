import { useState } from 'react'
import appLogo from './assets/vite-electron-app.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <section id="center">
      <div className="hero">
        <img
          src={appLogo}
          className="hero-logo"
          alt="vite-electron-app logo"
        />
      </div>
      <h1>Electron + Vite + React</h1>
      <div className="card">
        <button className="counter" onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the logo to visit the repository</p>
    </section>
  )
}

export default App
