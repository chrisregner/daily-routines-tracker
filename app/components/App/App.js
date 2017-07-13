import React from 'react'
import styled from 'styled-components'

import TaskForm from 'components/TaskForm'

const StyledDiv = styled.div`
  min-width: 310px;
`

class App extends React.Component {
  render = () => <StyledDiv className='pa3'>
    <TaskForm
      handleSubmit={() => {}}
      handleDismiss={() => {}}
    />
  </StyledDiv>
}

export default App
