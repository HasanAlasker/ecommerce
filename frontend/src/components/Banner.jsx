import React from 'react'


export default function Banner() {
  return (
    <div className="banner">
        <div className="decorative-element element1"></div>
        <div className="decorative-element element2"></div>
        <div className="decorative-element element3"></div>
        
        <div className="small-flowers">🌸🌺</div>
        
        <div className="banner-content">
            <h1 className='xLarge'>Discover your perfect blooms here</h1>
            <p>Explore our stunning collection of lifelike artificial flowers that bring timeless beauty to any space. Each piece is crafted with meticulous attention to detail, offering you the elegance of nature without the maintenance.</p>
            <a href="#collection" className="cta-button">View Collection</a>
        </div>

        <div className="flower-image">
            <div className="flower-circle">
                <div className="flower">🌸</div>
            </div>
        </div>
    </div>
  )
}
