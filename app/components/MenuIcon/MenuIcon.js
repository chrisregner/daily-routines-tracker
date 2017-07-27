import React from 'react'
import styled from 'styled-components'

let s

const MenuIcon = () => (
  <s.Dots className="dots">
    <div className="dot"></div>
  </s.Dots>
)

s = {
  Dots: styled.div`
    & {
      position: relative;
      width: 18px;
      height: 18px;
    }

    & .dot,
    & .dot:before,
    & .dot:after {
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 4px;
      background-color: #34495e;
    }

    & .dot {
      top: 50%;
      right: 50%;
      margin-top: -2px;
      margin-right: -2px;
    }

    & .dot:before,
    & .dot:after {
      content: "";
    }

    & .dot:before {
      bottom: 7px;
      transition: bottom .3s ease-out;
    }

    & .dot:after {
      top: 7px;
      transition: top .3s ease-out;
    }

    /*&:hover .dot:before,
    &:focus .dot:before,
    &:active .dot:before {
      bottom: -7px;
    }

    &:hover .dot:after,
    &:focus .dot:after,
    &:active .dot:after {
      top: -7px;
    }*/
  `,
}

export default MenuIcon
