import Nav from "./components/Nabar";
import Manager from "./components/Manager";
import Footer from "./components/Footer"
import './App.css'

function App() {
 
  return (
    <>
  <Nav />
  <div className="min-h-[82vh]">
  <Manager /> 
    </div>
  
  <Footer />
        </>
  )
}

export default App
