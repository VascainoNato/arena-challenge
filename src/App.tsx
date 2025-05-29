import './index.css'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Content from './components/Content'
import Toggle from './components/Toggle'

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen h-screen overflow-hidden bg-[#F8F8F8]">
        <Header />
        <Toggle/>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Content />
        </div>
        <div className='hidden md:flex'>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default App
