/**
 * This is the projects page component. Like the gallery, most of this is
 * just descriptions/info about different projects.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { Link } from 'react-router-dom';

import Gallery from '../gallery-template/Gallery';
import bgImg from '../../images/projects_bg.png';
import './projects-page.css';

/*
These are the projects in JSON format.
*/

const projects = [
    {
        title: "Calculating the golden ratio",
        description: "The first article I ever wrote for this site, on calculation of the golden ratio.",
        shortName: "goldenratio",
        link: "/articles/goldenratio",
        imgUrl: "goldenratio.png",
        isExternal: false
    },
    {
        title: "The Mandelbrot set for dummies",
        description: "An explanatory article on the Mandelbrot set for beginners, with images and code.",
        shortName: "mandelbrotexplained",
        link: "/articles/mandelbrotexplained",
        imgUrl: "mandelbrot.png",
        isExternal: false
    },
    {
        title: "Deriving the quadratic formula",
        description: "Explaining the basics of the most ubiquitous equation in algebra classes: the quadratic formula, from first principles.",
        shortName: "quadraticformula",
        link: "/articles/quadraticformula",
        imgUrl: "quadformula.png",
        isExternal: false
    },
    {
        title: "Chaos theory, for dummies",
        description: "An explanation of the fundamental principles of chaos theory and dynamical systems for the beginner, and an interactive demo of a dynamical system in action. This article is mainly to summarize my own learnings.",
        shortName: "chaosexplained",
        link: "/articles/chaosexplained",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/articles/chaos-theory",
        imgUrl: "chaostheory.png",
        isExternal: false
    },
    {
        title: "Mandelbrot orbits",
        description: "An interactive demonstration of the orbits of a given point under the Mandelbrot map.",
        shortName: "mandelorbits",
        link: "/fractals/mandelorbits",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/mandelbrotorbits",
        imgUrl: "mandelorbits.png",
        isExternal: false
    },
    {
        title: "The Newton fractal",
        description: "A program for generating and exploring generalized Newton fractals from an arbitrary polynomial.",
        shortName: "newtonfractals",
        link: "/fractals/newtonfractals",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/newton/newton-fractal",
        imgUrl: "newtonfractal.png",
        isExternal: false
    },
    {
        title: "Newton parameter space",
        description: <>A visualization of the parameter space of cubic Newton fractals, based on <a href="https://www.youtube.com/watch?v=LqbZpur38nw" target="_blank" rel="noopener noreferrer">3Blue1Brown's video</a>.</>,
        shortName: "newtonparams",
        link: "/fractals/newtonparams",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/newton/newton-params",
        imgUrl: "newtonparams.png",
        isExternal: false
    },
    {
        title: "Lotka-Volterra model",
        description: <>An interactive demonstration of the <a href="https://en.wikipedia.org/wiki/Lotka-Volterra_equations" target="_blank" rel="noopener noreferrer">Lotka-Volterra model</a> of animal populations.</>,
        shortName: "lotkavolterra",
        link: "/physics/lotkavolterra",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/lotkavolterra",
        imgUrl: "lotkavolterra.png",
        isExternal: false
    },
    {
        title: "Spring-mass system",
        description: <>An interactive demonstration of a <a href="https://en.wikipedia.org/wiki/Harmonic_oscillator" target="_blank" rel="noopener noreferrer">damped harmonic oscillator</a>, or a simple spring-mass system.</>,
        shortName: "springmass",
        link: "/physics/springmass",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/springmass",
        imgUrl: "pendsim.png",
        isExternal: false
    },
    {
        title: "Waves on a string",
        description: <>An interactive simulation of waves on a string with one end movable, or more technically a simulation of the <a href="https://en.wikipedia.org/wiki/Wave_equation" target="_blank" rel="noopener noreferrer">wave equation</a>.</>,
        shortName: "stringwaves",
        link: "/physics/stringwaves",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/stringwaves",
        imgUrl: "waveeqn.png",
        isExternal: false
    },
    {
        title: "Double-slit experiment",
        description: <>An interactive simulation of the <a href="https://en.wikipedia.org/wiki/Double-slit_experiment" target="_blank" rel="noopener noreferrer">double-slit experiment</a> simulated using the classical wave equation.</>,
        shortName: "doubleslit",
        link: "/physics/doubleslit",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/doubleslit",
        imgUrl: "doubleslit.png",
        isExternal: false
    },
    {
        title: "Spirograph",
        description: "A simple web demo of a spirograph, the classic children's toy.",
        shortName: "spirograph",
        link: "/geom/spirograph",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/spirograph",
        imgUrl: "spirograph.png",
        isExternal: false
    },
    {
        title: "Viviani's theorem",
        description: <>An interactive demonstration of <a href="https://youtu.be/PQbAG1tYpAs" target="_blank" rel="noopener noreferrer">Viviani's theorem</a>.</>,
        shortName: "vivianitheorem",
        link: "/geom/vivianitheorem",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/viviani",
        imgUrl: "vivianithm.png",
        isExternal: false
    },
    {
        title: "Wittgenstein's rod",
        description: <>An interactive demonstration of the <a href="https://youtu.be/0R1_wU_aEVI" target="_blank" rel="noopener noreferrer">Wittgenstein's rod</a> geometry problem.</>,
        shortName: "wittgenstein",
        link: "/geom/wittgenstein",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/curves/WittgensteinRodDemo.js",
        imgUrl: "wittgensteinrod.png",
        isExternal: false
    },
    {
        title: "Pedal curves",
        description: <>An interactive demonstration of <a href="https://youtu.be/ejtqjxGvhL0" target="_blank" rel="noopener noreferrer">pedal curves</a>, a geometric process that maps curves to other curves.</>,
        shortName: "pedalcurves",
        link: "/geom/pedalcurves",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/curves/PedalDemo.js",
        imgUrl: "pedalcurves.png",
        isExternal: false
    },
    {
        title: "Hyperbolic tilings",
        description: "An interactive tool for creating artistic images of regular hyperbolic tilings.",
        shortName: "hyptiler",
        link: "https://curvascope.zenzicubic.dev/",
        srcLink: "https://github.com/zenzicubic/curvascope",
        imgUrl: "hyptiling.png",
        isExternal: true
    },
    {
        title: "The Bonne projection",
        description: "An interactive visualization of the Bonne map projection, a map projection that maps the world to a heart-shaped region.",
        shortName: "bonneproj",
        link: "/geom/bonneproj",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/bonne",
        imgUrl: "bonneproj.png",
        isExternal: false
    },
    {
        title: "Clifford torus",
        description: "An interactive visualization of the Clifford torus, a 4-dimensional analogue of the 2-torus.",
        shortName: "clifford",
        link: "/geom/clifford",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/clifford",
        imgUrl: "cliffordtorus.png",
        isExternal: false
    },
    {
        title: "Dandelin spheres",
        description: <>A demo of the <a href="https://en.wikipedia.org/wiki/Dandelin_spheres" target="_blank" rel="noopener noreferrer">Dandelin spheres</a>, specifically those of a cylinder.</>,
        shortName: "dandelin",
        link: "/geom/dandelin",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/dandelin",
        imgUrl: "dandelin.png",
        isExternal: false
    },
    {
        title: "Steiner chains",
        description: <>A demo of <a href="https://en.wikipedia.org/wiki/Steiner_chain" target="_blank" rel="noopener noreferrer">Steiner chains</a> and M&ouml;bius transformations.</>,
        shortName: "steiner",
        link: "/geom/steiner",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/steiner",
        imgUrl: "steiner.png",
        isExternal: false
    },
    {
        title: "Stellations",
        description: <>A demo of the 227 fully supported stellations of the <a href="https://en.wikipedia.org/wiki/Rhombic_triacontahedron" target="_blank" rel="noopener noreferrer">rhombic triacontahedron</a>.</>,
        shortName: "stellations",
        link: "/geom/stellations",
        srcLink: "https://github.com/zenzicubic/zenzicubic-site/tree/main/src/demos/stellations",
        imgUrl: "stellations.png",
        isExternal: false
    }
];

/*
This component represents one of the cards on the projects page.
*/

function ProjectCard(props) {
    const data = props.data;
    return (
        <div className="project-container">
            <div className="project-container-top">
                <img className="project-img" src={require("./project-thumbnails/" + data.imgUrl)} alt={data.title} />
                <div className="project-link">
                    {data.isExternal ? 
                        (<a href={data.link} target="_blank" rel="noopener noreferrer">
                            {data.title}
                        </a>) : (<Link to={data.link}>{data.title}</Link>)}
                </div>
                <p>{data.description}</p>
            </div>
            {(data.srcLink ? (<div className="project-footer">
                <a href={data.srcLink} target="_blank" rel="noopener noreferrer" 
                    className="project-src-link">
                    <span className="material-icons">code</span> View source
                </a>
            </div>) : "")}
        </div>
    )
}

/*
This is the actual projects page.
*/

function ProjectsPage() {
    return (
        <>
            <title>Projects | Zenzicubic</title>
            <Gallery 
                title="Projects"
                description="This is a collection of various programming projects I&apos;ve made over the years in no particular order, along with some articles I&apos;ve written. Most of these are related to math or are math-adjacent." 
                bgImg={bgImg}>
                    {projects.map((project) =>(
                        <ProjectCard data={project} key={"project-" + project.shortName} />
                    ))}
            </Gallery>
        </>
    );
}

export default ProjectsPage;