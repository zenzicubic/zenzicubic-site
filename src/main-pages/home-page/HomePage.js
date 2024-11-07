/**
 * This is the home page component, which contains links to my social medias
 * as well as some of the most important pages of the site.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { Link } from 'react-router-dom';

import FrontPageLayout from '../layout/FrontPageLayout';
import bgImg from '../../images/front_page_bg.png';
import logoImg from '../../images/logo.png';
import portraitImg from '../../images/portrait.png';
import './home-page.css';

function HomePage() {
    return (
        <>
            <title>Home | Zenzicubic</title>
            <FrontPageLayout img={bgImg}>
                <div id="homepage-header-imgs">
                    <img src={portraitImg} className="homepage-header-img" alt="Portrait of Zenzicubic" />
                    <img src={logoImg} className="homepage-header-img" alt="Zenzicubic's logo" />
                </div>

                <h2>Zenzicubic</h2>

                <Link to="/about" className="homepage-btn-link">About Me</Link>
                <Link to="/projects" className="homepage-btn-link">Projects</Link>
                <Link to="/gallery" className="homepage-btn-link">Gallery</Link>

                <a href="https://www.youtube.com/c/zenzicubic/" 
                    target="_blank" className="homepage-btn-link"
                    rel="noopener noreferrer">YouTube</a>

                <a href="https://twitter.com/zenzicubic" 
                    target="_blank" className="homepage-btn-link"
                    rel="noopener noreferrer">Twitter (no longer active)</a>

                <a href="https://bsky.app/profile/zenzicubic.dev" 
                    target="_blank" className="homepage-btn-link"
                    rel="noopener noreferrer">Bluesky</a>

                <a href="https://vtubie.com/zenzicubic/" 
                    target="_blank" className="homepage-btn-link"
                    rel="noopener noreferrer">VTubie</a>

                <a href="https://discord.gg/byeqzUdRT9" 
                    target="_blank" className="homepage-btn-link"
                    rel="noopener noreferrer">Discord Server</a>

                <a href="https://www.shadertoy.com/user/zenzicubic" 
                    target="_blank" className="homepage-btn-link"
                    rel="noopener noreferrer">Shadertoy</a>

                <a href="https://github.com/zenzicubic" 
                    target="_blank" className="homepage-btn-link"
                    rel="noopener noreferrer">GitHub</a>

                <a href="mailto:contact@zenzicubic.dev"
                    className="homepage-btn-link">Email</a>
            </FrontPageLayout>
        </>
    );
}

export default HomePage;