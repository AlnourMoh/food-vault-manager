import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/base.css'
import './styles/tailwind.css'
import './styles/legacy.css'
import './styles/zxing-scanner.css' // استيراد أنماط الماسح الضوئي
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
