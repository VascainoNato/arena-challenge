import './index.css'
import './App.css'
import Header from './components/Header'
import Content from './components/Content'
import Toggle from './components/Toggle'

function App() {
  return (
    <>
      <div className="flex flex-col flex-1 bg-[#F8F8F8]">
        <Header />
        <Toggle/>
        <div className="flex-1 flex flex-col">
          <Content />
        </div>
      </div>
    </>
  )
}

export default App
