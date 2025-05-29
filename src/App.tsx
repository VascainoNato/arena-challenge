import './index.css'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Content from './components/Content'

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen h-screen overflow-hidden">
        <Header />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Content />
        </div>
        <Footer />
      </div>
    </>
  )
}

export default App
