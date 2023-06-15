import React, {useState, useEffect} from 'react'
import Nav from "./components/Nav"
import DatasGrid from "./components/DatasGrid"
import "./App.css"




const App = () => {

 
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    fetch('https://6488afd40e2469c038fe3acd.mockapi.io/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Error fetching data');
      })
      .then(data => {
        console.log(data)
        setDatas(data)
        
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  
  return (
    
    <div>
      <Nav/>
      <DatasGrid datas= {datas} setDatas={setDatas}/>
    </div>
  )
}

export default App
