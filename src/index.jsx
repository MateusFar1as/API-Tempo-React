import React, {useState,useEffect} from 'react'
import nuvem from './IMGS/nuvem.png'
import chuva from './IMGS/chuva.png'
import sol from './IMGS/sol.png'

function Lista(props){
  return(
    <div className='apiArea'>
      <div className='dentroArea1'>
        <img src={props.pImg} alt="" />
        <span className='temp'>{props.pTemp}</span>
        <span className='tipoTemp'>ºC</span>
      </div>
      <div className='dentroArea2'>
        <span>{props.pName}</span>
        <span>{props.pWeather}</span>
      </div>
    </div>
  )
}

export function Home() {
  const [name,setName] = useState()
  const [atualiza,setAtualiza] = useState([])
  const [img,setImg] = useState()
  const cidadeStorage = localStorage.getItem('Cidade')

  useEffect(() => {
    cidadeStorage == null ? '' : setAtualiza(['']),apiTempCidade(cidadeStorage)
  },[])

  function atualizar(){
    setAtualiza([''])
    localStorage.setItem('Cidade',name)
    apiTempCidade(name)
  }

  const [cidade,setCidade] = useState({
    name: '',
    lat: '',
    lon: '',
    temp: '',
    weather: ''
  })

  function apiTempCidade(cidadeNome){
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cidadeNome}&limit=1&appid=0a0a9bdd0ae1ff640c88a3e47bffdf8a`)
    .then(response => response.json())
    .then(data => {
      apiTempCondicao(data[0].name,data[0].lat,data[0].lon)
    })
  }

  function apiTempCondicao(cidadeNome,lat,lon){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0a0a9bdd0ae1ff640c88a3e47bffdf8a`)
    .then(response => response.json())
    .then(data => {
      setCidade({
        name: cidadeNome,
        lat: lat,
        lon: lon,
        temp: Math.floor(data.main.temp - 273.15),
        weather: data.weather[0].description
      })
      switch(data.weather[0].main){
        case "Rain": setImg(chuva); break;
        case "Clouds": setImg(nuvem); break;
        case "Clear": setImg(sol); break;
        default: setImg(sol);
      }
    })
  }

  const enter = e => {
    if(e.key == 'Enter'){
      setAtualiza([''])
      localStorage.setItem('Cidade',name)
      apiTempCidade(name)
    }
  }

  return (
    <div className='container'>
      <main>
        <h1>Temperatura</h1>
        <div className='areaTexto'>
          <input type="text" placeholder='Nome Cidade...' onChange={e => setName(e.target.value)} onKeyPress={enter}/>

          <button onClick={atualizar}>OK</button>
        </div>
        {
          atualiza.map(nome => <Lista key='0' pName={cidade.name} pLat={cidade.lat} pLon={cidade.lon} pTemp={cidade.temp} pWeather={cidade.weather} pImg={img}/>)
        }
      </main>
    </div>
  )
}