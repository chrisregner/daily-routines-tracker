import React from 'react'
import { Icon } from 'antd'
import { Link } from 'react-router-dom'

export default () => (
  <div className='pa3'>
    <div className='pb3 f4 lh-title'>
      <Link to='/'><Icon type='arrow-left' /></Link>
    </div>
    <div className='mt6 f3 lh-copy'>
      Sorry, the page you requested doesn’t exist. <br />
      <Link to='/'>Go to home page</Link>
    </div>
  </div>
)
