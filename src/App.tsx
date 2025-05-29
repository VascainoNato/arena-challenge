import './index.css'
import Header from '../components/layout/Header'
import Content from '../components/layout/Content'
import Footer from '../components/layout/Footer'

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
