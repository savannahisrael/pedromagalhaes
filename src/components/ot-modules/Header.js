import React from 'react'
import { Container, Menu, Segment } from 'semantic-ui-react'
import Particles from 'react-particles-js'

import Promotional from '../../components/ot-modules/Promotional'
import PM from '../../static/svg/logo3.svg'

const Header = () => (
  <Segment inverted textAlign='center' style={{ minHeight:'733px', padding: '1em 0em' }} vertical>
    <Menu
      inverted
      pointing
      secondary
      size='large'
      style={{ border: 'none', background: 'none' }}
    >
      <Container style={{ zIndex: '10' }}>
        <PM style={{
 height:'70px', width: '70px', marginRight: '40px', position: 'relative', top: '15px'
}}
        />
        <Menu.Item position='right' as='a' className='active' style={{ border: 'none' }}>HOME</Menu.Item>
        <Menu.Item as='a'>ABOUT</Menu.Item>
        <Menu.Item as='a'>WORK</Menu.Item>
        <Menu.Item as='a'>CONTACT</Menu.Item>
      </Container>
    </Menu>
    <Particles
      params={{
          particles: {
            number: {
              value: 50
            },
            line_linked: {
              shadow: {
                enable: false
              }
            }
          }
        }}
      style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
    />
    <Promotional />
  </Segment>
)

export default Header
