import React from 'react'
import {connect} from 'cerebral/react'
import SunRotation from '../SunRotation'
import SunRotation02 from '../SunRotation02'
import Home from '../Home'
import './styles.css'

const pages = {
  sunRotation: SunRotation,
  sunRotation02: SunRotation02,
  home: Home
}

export default connect({
  currentPage: 'currentPage',
  title: 'title'
},
  function App (props) {
    const Page = pages[props.currentPage]
    return (
      <div className='container'>
        <h1>{props.title}</h1>

        {pages[props.currentPage] && (
          <Page />
        )}

      </div>
    )
  }
)
