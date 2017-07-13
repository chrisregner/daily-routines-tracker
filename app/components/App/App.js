import React from 'react'
import styled from 'styled-components'

import RoutineForm from 'components/RoutineForm'

const StyledDiv = styled.div`
  min-width: 310px;
`

class App extends React.Component {
  render = () => <StyledDiv className='pa3'>
    <RoutineForm
      handleSubmit={() => {}}
      handleDismiss={() => {}}
    />
  </StyledDiv>
}

export default App
