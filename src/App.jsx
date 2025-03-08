import React from 'react'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import SourceNewspaper from './pages/SourceNewspaper'
import Categoies from './pages/Categoies'
import Listpage from './pages/listpage'
import Fourcategories from './pages/Fourcategories'

const  App = () => {
  return (
    <div className=''>
        <Routes>
            <Route path='/' element={<Login/>} /> 
            <Route path='/sorcenewspaper'  element={<SourceNewspaper/>} />
            <Route path='/categories' element={<Categoies/>}/>
            <Route path='/listpage' element= {<Listpage/>}/>
            <Route path='/fourcategories' element={<Fourcategories/>}/>
        </Routes>
    </div>
)
}

export default  App