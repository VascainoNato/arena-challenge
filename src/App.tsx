import './index.css'
import './App.css'
import Header from './components/Header'
import Content from './components/Content'
import Toggle from './components/Toggle'
import { useState } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState<'popular' | 'newest'>('popular')
  return (
    <>
      <div className="flex flex-col flex-1 bg-[#F8F8F8]">
        <Header />
        <Toggle activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col min-h-screen">
           <Content order={activeTab === 'popular' ? 'RANKING' : 'NEWEST'} />
        </div>
      </div>
    </>
  )
}

export default App
