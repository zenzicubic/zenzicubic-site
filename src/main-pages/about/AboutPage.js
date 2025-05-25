/**
 * This is the about page component. All of this is just JSX.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { Link } from 'react-router-dom';

import FrontPageLayout from '../layout/FrontPageLayout';

import whiteboardImg from '../../images/whiteboard.png';
import bgImg from '../../images/front_page_bg.png';
import './about-page.css';

function AboutPage() {
    return (
        <>
            <title>About | Zenzicubic</title>
            <FrontPageLayout img={bgImg}>
                <h2>About Me</h2>
                <img src={whiteboardImg} 
                    id="about-page-header-img" 
                    alt="Zenzicubic stands in front of a whiteboard" />
                <hr />

                <p>
                    Hello. I&apos;m Zenzicubic, and I&apos;m a VTuber. I make YouTube videos about my passions: mainly practical chemistry and math (with a focus on aesthetically pleasing concepts, especially in group theory, dynamical systems, fractals, and geometry), but also whatever happens to interest me at a given moment. I&apos;ve been on YouTube since 2020, and I&apos;ve been a VTuber since January 2022. I film experiments in my home chemistry lab, and make animated math videos and explainers &#224; la 3Blue1Brown.
                    I&apos;ve also made <a
                        href="https://youtu.be/MA5kXfjLY7Y" 
                        target="_blank" rel="noopener noreferrer">
                        tutorials
                    </a> and <a 
                        href="https://youtu.be/13e3l8mcl-I" 
                        target="_blank" rel="noopener noreferrer">
                        SCP readings
                    </a>, to name a few. I don&apos;t have a schedule; I make videos whenever I feel up to the task, as I focus on quality over quantity.
                    <br /><br />

                    I enjoy programming, and the <Link to="/projects">projects</Link> page contains a healthy collection of online math and math-adjacent demos and articles that I&apos;ve been accumulating since April 2022. The <Link to="/gallery">gallery</Link> page contains many mathematical images that I&apos;ve made over time. I also am an amateur bird photographer; some of my pictures are in the gallery too. In fact, almost everything on this website was made by me, from the stylesheets to the images and UI. If you&apos;re curious, the source code of this site is <a href="https://github.com/zenzicubic/zenzicubic-site" target="_blank" rel="noopener noreferrer">available</a> on my GitHub page. I&apos;ve built myself a custom VTuber setup in Unity, with several rooms and interactive elements, such as a working whiteboard, a greenhouse, and several monitors.
                    <br /><br />
                    
                    A few facts about me:
                </p>

                <ul>
                    <li>I have two dogs.</li>
                    <li>I don&apos;t really watch anime, although <i>Dr.STONE</i> is my favorite.</li>
                    <li>In my free time I enjoy programming, math, chemistry, baking, biking, swimming, and rock climbing.</li>
                    <li>I live in New Jersey.</li>
                    <li>My favorite food is margherita pizza, and my favorite drink is chai.</li>
                    <li>I don&apos;t play video games.</li>
                    <li>I am in high school.</li>
                    <li>I sometimes make edits and create articles on the English Wikipedia.</li>
                </ul>

                <hr />
                <h3>Lore</h3>
                <p>
                    I don&apos;t really have lore. I&apos;m just a person who heard about VTubers from a friend, and got into the VTubing scene as a novel and interesting way to express myself online while keeping my private info private. I&apos;ve been interested in the sciences since I was 5, and I&apos;ve been programming since I was in the 4th grade.
                </p>
                
                <hr />
                <h3>Feel free to have a look around! You&apos;re sure to find something fun.</h3>
            </FrontPageLayout>
        </>
    );
}

export default AboutPage;