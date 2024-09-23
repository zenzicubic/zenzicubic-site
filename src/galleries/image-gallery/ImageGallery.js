/**
 * This is the image gallery page, and an associated component.
 * Most of this file is just descriptions and info of each image.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { MathJax } from 'better-react-mathjax';
import { Fragment, useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import LoadingAnimation from '../../components/loading-animation/LoadingAnimation';
import Gallery from '../gallery-template/Gallery';
import bgImg from './pics/gamma.png';

import './img-gallery.css';


/*
Here is the list of images and categories.
*/

const categories = ["Birds and nature", "Mathematical visualization", "Other"]

const images = [
    {
        title: "Kummer Surface",
        description: <>A rendering of <a href="https://en.wikipedia.org/wiki/Kummer_surface" target="_blank" rel="noopener noreferrer">Kummer&apos;s quartic surface</a>, a nodal surface with 16 double points.</>,
        filename: "kummer.png",
        date: "23 Sep 2024",
        category: 1
    },
    {
        title: "Vermillion Flycatcher",
        description: "A vermillion flycatcher, photographed during a vacation to the Quindio region of Colombia.",
        filename: "vermillionflycatcher.png",
        date: "1 Sep 2024",
        category: 0
    },
    {
        title: "Monastery",
        description: <>A photo I took of a room in the abandoned St. Paul&apos;s Abbey in Newton, NJ.</>,
        filename: "monastery.png",
        date: "2 Jul 2024",
        category: 2
    },
    {
        title: "Tree Swallow",
        description: "A tree swallow on a branch, photographed at the Pole Farm in Mercer County, NJ.",
        filename: "treeswallow.png",
        date: "30 Jun 2024",
        category: 0
    },
    {
        title: "Five Cubes",
        description: <>A raytraced image of the <a href="https://en.wikipedia.org/wiki/Compound_of_five_cubes" target="_blank" rel="noopener noreferrer">compound of five cubes</a> in a dodecahedron.</>,
        filename: "cubefivecmpd.png",
        date: "14 May 2024",
        category: 1
    },
    {
        title: "Five Tetrahedra",
        description: <>A raytraced image of the <a href="https://en.wikipedia.org/wiki/Compound_of_five_tetrahedra" target="_blank" rel="noopener noreferrer">compound of five tetrahedra</a>.</>,
        filename: "tetfivecmpd.png",
        date: "14 May 2024",
        category: 1
    },
    {
        title: "Chuck-will's-widow",
        description: "A female chuck-will's-widow sitting on her nest. Photographed at Fort De Soto, FL.",
        filename: "chuckwillswidow.png",
        date: "27 Apr 2024",
        category: 0
    },
    {
        title: "Purple Gallinule",
        description: "A purple gallinule, photographed in Sarasota, FL while on vacation.",
        filename: "purplegallinule.png",
        date: "25 Apr 2024",
        category: 0
    },
    {
        title: "Oystercatcher",
        description: "An American oystercatcher in front of a wave. I took this picture at Sandy Hook NWR in New Jersey.",
        filename: "oystercatcher.png",
        date: "21 Apr 2024",
        category: 0
    },
    {
        title: "Monk Parakeets",
        description: <>One of the many nests of feral monk parakeets who have made their home in Edgewater, NJ.</>,
        filename: "parakeets.png",
        date: "9 Apr 2024",
        category: 0
    },
    {
        title: "Osprey",
        description: <>An osprey in flight over the pond at Garret Mountain Park near Patterson, NJ.</>,
        filename: "osprey.png",
        date: "7 Apr 2024",
        category: 0
    },
    {
        title: "Brown Creeper",
        description: <>A brown creeper climbing a tree, sighted near Garret Mountain Park near Patterson, NJ.</>,
        filename: "creeper.png",
        date: "7 Apr 2024",
        category: 0
    },
    {
        title: "Diamond Lattice",
        description: <>A view from inside the crystal structure of diamond, or more technically the diamond cubic lattice.</>,
        filename: "diamondcubic.png",
        date: "6 Apr 2024",
        category: 1
    },
    {
        title: "Abandoned Resort",
        description: <>A picture I took a few weeks ago at the abandoned Unity House resort in the Poconos between PA and NJ.</>,
        filename: "unityhouse.png",
        date: "2 Mar 2024",
        category: 2
    },
    {
        title: "Cubic Surface",
        description: <>A raytraced image of the cubic surface defined by the equation <MathJax inline>{'\\(z(z^2-1)=x(x^2-3y^2),\\)'}</MathJax> based on <a href="https://mathcurve.com/surfaces.gb/cubic/cubic.shtml" target="_blank" rel="noopener noreferrer">this page by Robert Ferreol</a>.</>,
        filename: "mathcurve_cubic.png",
        date: "14 Feb 2024",
        category: 1
    },
    {
        title: "Tritrumpet",
        description: <>A raytraced image of the <a href="http://www.paulbourke.net/geometry/tritrumpet/" target="_blank" rel="noopener noreferrer">tritrumpet</a> cubic surface defined by the equation <MathJax inline>{'\\(8z^2+(2x+1)(3y^2-(x-1)^2)=0.\\)'}</MathJax></>,
        filename: "tritrumpet.png",
        date: "14 Feb 2024",
        category: 1
    },
    {
        title: "Goursat Cubic",
        description: <>A raytraced image of Goursat&apos;s tetrahedral cubic surface defined by the equation <MathJax inline>{'\\(x^2+y^2+z^2-kxyz=1,\\)'}</MathJax> with <MathJax inline>{'\\(k = \\frac{5}{2}\\)'}</MathJax> in this image.</>,
        filename: "goursat_cubic.png",
        date: "13 Feb 2024",
        category: 1
    },
    {
        title: "Clebsch Cubic",
        description: <>A raytraced image of a view of the famous <a href="https://blogs.ams.org/visualinsight/2016/03/01/clebsch-surface/" target="_blank" rel="noopener noreferrer">Clebsch cubic</a> in <MathJax inline>{'\\(\\mathbb{R}^3.\\)'}</MathJax></>,
        filename: "clebsch_cubic.png",
        date: "13 Feb 2024",
        category: 1
    },
    {
        title: "Cayley Cubic no. 2",
        description: <>A raytraced image of another view of Cayley&apos;s nodal cubic surface in <MathJax inline>{'\\(\\mathbb{R}^3\\)'}</MathJax>, described by the equation <MathJax inline>{'\\(x^2+y^2+z^2-2xyz=1.\\)'}</MathJax></>,
        filename: "cayley_cubic_2.png",
        date: "13 Feb 2024",
        category: 1
    },
    
    {
        title: "Cayley Cubic no. 1",
        description: <>A raytraced image of <a href="https://mathcurve.com/surfaces.gb/cayley/cayley.shtml" target="_blank" rel="noopener noreferrer">a view</a> of Cayley&apos;s nodal cubic surface in <MathJax inline>{'\\(\\mathbb{R}^3.\\)'}</MathJax> I built a raytracer for cubic surfaces to make this series of images.</>,
        filename: "cayley_cubic_1.png",
        date: "13 Feb 2024",
        category: 1
    },
    {
        title: "Sanderling",
        description: "A picture I took of a sanderling at Barnegat Light State Park in New Jersey.",
        filename: "sanderling.png",
        date: "2 Feb 2024",
        category: 0
    },
    {
        title: "Red-breasted Merganser",
        description: "A picture I took of a red-breasted merganser male showing his crest at Barnegat Light State Park in New Jersey.",
        filename: "merganser.png",
        date: "2 Feb 2024",
        category: 0
    },
    {
        title: "Long-tailed Duck Male",
        description: "A picture of one of my favorite sea ducks: a long-tailed duck male, taken by me at Barnegat Light State Park in New Jersey.",
        filename: "longtail2.png",
        date: "2 Feb 2024",
        category: 0
    },
    {
        title: "Newton Fractal no. 6",
        description: <>A view of the Newton fractal for the polynomial <MathJax inline>{"\\(z^8+15z^4-16.\\)"}</MathJax></>,
        filename: "newtonfractal6.png",
        date: "8 Jan 2024",
        category: 1
    },
    {
        title: "Newton Fractal no. 5",
        description: <>A view of the Newton fractal for the polynomial <MathJax inline>{"\\(z^3+2.57z^2+1,\\)"}</MathJax> zoomed to show one of the hidden Julia sets within.</>,
        filename: "newtonfractal5.png",
        date: "8 Jan 2024",
        category: 1
    },
    {
        title: "Newton Fractal no. 4",
        description: <>A view of the Newton fractal for the polynomial <MathJax inline>{"\\(z^4-4z^2-6\\)"}</MathJax>.</>,
        filename: "newtonfractal4.png",
        date: "8 Jan 2024",
        category: 1
    },
    {
        title: "Newton Fractal no. 3",
        description: <>A view of the Newton fractal for the polynomial <MathJax inline>{"\\(z^5+z^3-1\\)"}</MathJax>.</>,
        filename: "newtonfractal3.png",
        date: "8 Jan 2024",
        category: 1
    },
    {
        title: "Newton Fractal no. 2",
        description: <>A view of the Newton fractal for the polynomial <MathJax inline>{"\\(z^6+z^3-1\\)"}</MathJax>.</>,
        filename: "newtonfractal2.png",
        date: "8 Jan 2024",
        category: 1
    },
    {
        title: "Newton Fractal no. 1",
        description: <>A view of the Newton fractal for the polynomial <MathJax inline>{"\\(z^5-1\\)"}</MathJax>.</>,
        filename: "newtonfractal1.png",
        date: "8 Jan 2024",
        category: 1
    },
    {
        title: "Loon in Flight",
        description: "A picture of a red-throated loon starting to fly. I took this picture at Sandy Hook NWR in New Jersey.",
        filename: "redthroatedloon.png",
        date: "31 Dec 2023",
        category: 0
    },
    {
        title: "Islamic-style Hyperbolic Tiling",
        description: <>A <MathJax inline>{"\\(\\{4, 5\\}\\)"}</MathJax> hyperbolic tiling with a pattern based on zellij tiles and girih patterns from Islamic geometric design.</>,
        filename: "islamictiling.png",
        date: "29 Dec 2023",
        category: 1
    },
    {
        title: "Heptagonal Band",
        description: <>The <MathJax inline>{"\\(\\{7, 3\\}\\)"}</MathJax> hyperbolic tiling in the band model.</>,
        filename: "heptaband.png",
        date: "9 Dec 2023",
        category: 1
    },
    {
        title: "Heptagonal Half-Plane",
        description: <>The <MathJax inline>{"\\(\\{7, 3\\}\\)"}</MathJax> hyperbolic tiling in the Poincar&eacute; half-plane model.</>,
        filename: "heptahalf.png",
        date: "9 Dec 2023",
        category: 1
    },
    {
        title: "Square Model",
        description: <>The <MathJax inline>{"\\(\\{5, 4\\}\\)"}</MathJax> hyperbolic tiling in an <a href="http://archive.bridgesmathart.org/2018/bridges2018-59.pdf" target="_blank" rel="noopener noreferrer">approximate square model</a> of the hyperbolic plane.</>,
        filename: "squaremodel.png",
        date: "7 Dec 2023",
        category: 1
    },
    {
        title: "Cardioid Model",
        description: <>The <MathJax inline>{"\\(\\{4, 6\\}\\)"}</MathJax> hyperbolic tiling in the Poincar&eacute; disk with the conformal map <MathJax inline>{"\\(z \\mapsto (z+1)^2 \\)"}</MathJax> applied.</>,
        filename: "cardioidmodel.png",
        date: "7 Dec 2023",
        category: 1
    },
    {
        title: "Triangle Group",
        description: "An image of the 732 triangle group.",
        filename: "732trigroup.png",
        date: "6 Dec 2023",
        category: 1
    },
    {
        title: "Jacobi CN",
        description: <>A plot of the Jacobi elliptic function <MathJax inline>{'\\(\\text{cn}(z, 0.5)\\)'}</MathJax> made using a domain coloring program I wrote.</>,
        filename: "cn.png",
        date: "5 Nov 2023",
        category: 1
    },
    {
        title: "Gamma Function",
        description: <>A domain-coloring plot of the gamma function <MathJax inline>{'\\(\\Gamma(z)\\)'}</MathJax> in the complex plane.</>,
        filename: "gamma.png",
        date: "5 Nov 2023",
        category: 1
    },
    {
        title: "Digamma Function",
        description: <>A domain-coloring plot of the digamma function <MathJax inline>{'\\(\\psi(z)\\)'}</MathJax> in the complex plane.</>,
        filename: "digamma.png",
        date: "5 Nov 2023",
        category: 1
    },
    {
        title: "Lemniscate Sine",
        description: <>A domain-coloring plot of the lemniscate sine function <MathJax inline>{'\\(\\text{sl}(z)\\)'}</MathJax> in the complex plane.</>,
        filename: "sl.png",
        date: "5 Nov 2023",
        category: 1
    },
    {
        title: "Lambert W",
        description: <>A domain-coloring plot of the Lambert W function <MathJax inline>{'\\(W(z)\\)'}</MathJax> in the complex plane.</>,
        filename: "lambertw.png",
        date: "5 Nov 2023",
        category: 1
    },
    {
        title: "Icosahedral Function",
        description: <>A domain-coloring plot of <a href="https://math.stackexchange.com/questions/1469554/polyhedral-symmetry-in-the-riemann-sphere" target="_blank" rel="noopener noreferrer">a rational function with icosahedral symmetry.</a></>,
        filename: "icosa.png",
        date: "5 Nov 2023",
        category: 1
    },
    {
        title: "Rail Bridge Graffiti",
        description: "Some particularly attractive graffiti I photographed at the abandoned Paulinskill Viaduct.",
        filename: "railbridge.png",
        date: "16 Sep 2023",
        category: 2
    },
    {
        title: "Icosahedral Sphere Inversion",
        description: "A fractal pattern generated by iterated inversion in spheres arranged in an icosahedron.",
        filename: "icosahedral_sph_inv.png",
        date: "14 Sep 2023",
        category: 1
    },
    {
        title: "Coal Dumper",
        description: "A picture I took of the abandoned McMyler coal dumper in Port Reading, NJ.",
        filename: "coaldumper.jpg",
        date: "30 Aug 2023",
        category: 2
    },
    {
        title: "Wada",
        description: "An image of chaotic scattering phenomena between spheres in an octahedral arrangement.",
        filename: "wada.png",
        date: "8 Jul 2023",
        category: 1
    },
    {
        title: "Gambel's Quail",
        description: "A picture I took of a Gambel's quail in the Bosque del Apache NWR in New Mexico.",
        filename: "gambelsquail.jpg",
        date: "12 Apr 2023",
        category: 0
    },
    {
        title: "Gaussian Rationals",
        description: <>An image of some of the <a href="https://math.stackexchange.com/questions/4617218/why-do-the-gaussian-rationals-make-these-patterns" target="_blank" rel="noopener noreferrer">Gaussian rationals</a>, or complex numbers with rational real and imaginary parts.</>,
        filename: "gaussianrationals.png",
        date: "12 Jan 2023",
        category: 1
    },
    {
        title: "Burrowing Owl",
        description: "I took this picture of a burrowing owl (Athene cunicularia) at a baseball field in Cape Coral, FL.",
        filename: "burrowingowl.jpg",
        date: "22 Nov 2021",
        category: 0
    }
];

/*
This component describes a single image display.
*/

function Image(props) {
    return (
        <div className="gallery-img-container">
            <div className="gallery-img-display">
                <LazyLoadImage className="gallery-img" src={props.url}
                    alt={props.title} onClick={props.onClick}
                    placeholder={<LoadingAnimation />}/>
            </div>
            <div className="gallery-img-content">
                <h3>{props.title}</h3>
                <h5>{props.date}</h5>
                <p>{props.description}</p>
            </div>
        </div>
    );
}

/*
This component describes the actual gallery page.
*/

function ImageGallery() {
    const [showPopup, setPopupVisibility] = useState(false);
    const [galleryData, setGalleryData] = useState([]);
    const [selectedImg, setSelectedImg] = useState(0);

    // Get the image data for the gallery
    useEffect(() => {
        // First build list of all categories
        let data = [...new Array(categories.length)].map(() => []);

        // Then sort images into those categories
        let imgData, i = 0;
        for (let img of images) {
            let localPath = require("./pics/" + img.filename);
            imgData = {...img, localPath, idx: i};
            data[img.category].push(imgData);
            i ++;
        }
        setGalleryData(data);
    }, []);

    return (<>
        <title>Gallery | Zenzicubic</title>
        <div id="img-gallery-popup"
            className={(showPopup ? "visible" : "")}>
            <img id="gallery-popup-img" src={selectedImg.localPath} 
                alt={selectedImg.title} />
            <button onClick={() => setPopupVisibility(false) } id="gallery-close-btn">
                <span className="material-icons">close</span>
            </button>
        </div>
        <Gallery 
            title="Gallery"
            description="These are random images that I&apos;ve collected over the years and thought would be worth showing. These are mostly mathematical images and bird photos, but there are also a few miscellaneous photos mixed in." 
            bgImg={bgImg}>
                {galleryData.map((imgs, i) => (<Fragment key={"category" + i}>
                    <h2 className="category-title">{categories[i]}</h2>
                    {imgs.map((img) => (
                        <Image title={img.title} description={img.description}
                            date={img.date} url={img.localPath} key={"image-" + img.idx}
                            onClick={() => {
                                setSelectedImg(img);
                                setPopupVisibility(true);
                        }} />
                    ))}
                </Fragment>))}
            </Gallery>
        </>
    );
}

export default ImageGallery;