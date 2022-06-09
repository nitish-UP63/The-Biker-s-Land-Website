import React from 'react';
// import playStore from "../../../images/playstore.png";
// import appStore from "../../../images/Appstore.png"

import "./Footer.css"

const Footer = () => {
  return (
    <footer id="footer">
    <div className='leftFooter'>
    {/* <h4>DOWNLOAD OUR APP</h4>
    <p>Download App for Android and IOS mobile phone</p>
    <img src={playStore} alt="playstore" ></img>
    <img src={appStore} alt="Appstore" ></img> */}
    </div>
    <div className='midFooter'>
    <h1>The Biker's Land</h1>
    <p>Let's Make Your Bike Good Together</p>
     <p>Copyrights 2022 &copy; Biker</p>

    </div>
    <div className='rightFooter'>
        <h4>Follow Us</h4>
        <a href="https://instagram.com/the_bikers_land_mbd?igshid=YmMyMTA2M2Y=">Instagram</a>
        <a href="">Facebook</a>
        <a href="">Twitter</a>

    </div>
    </footer>
  )
}

export default Footer