import React from 'react'
import banner from '../assets/pics/banner.png'

export default function Banner() {
  return (
    <div className='banner'>
        <img src={banner} className='bannerImage' alt="promo banner" />
    </div>
  )
}
