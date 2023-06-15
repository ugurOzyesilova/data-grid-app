import React, { useState, useEffect } from 'react';
import { Logo, MobileLogo, Youtube, Instagram, Be, LinkedIn } from "../svgs/SvgIcons"

const Nav = () => {

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav className="nav">
      {isMobile ? <MobileLogo /> : <Logo />}
      <ul className="nav__links">
        <li>Hakkımızda</li>
        <li>Jüri-Yarışma Yazılımı</li>
        <li>Word Ninja</li>
        <li>Word Pyramids</li>
      </ul>
      <ul className="nav__social__links">
        <Youtube />
        <Instagram />
        <Be/>
        <LinkedIn />
      </ul>

    </nav>
  )
}

export default Nav