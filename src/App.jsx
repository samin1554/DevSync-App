import './App.css'
import Header from './components/Header'
import Body from './components/Body'
import Body2 from './components/Body2'
import Footer from './components/Footer'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default function App() {
  return (
    <div data-theme="light">
      <Header />
      <Body />
      <Body2 />
      <Footer />
    </div>
  )
}



