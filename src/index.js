/**
 * This is the main file, which contains all of the URL routes
 * and initializes contexts for various components.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { MathJaxContext } from 'better-react-mathjax';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';

/* Main pages */

import HomePage from './main-pages/home-page/HomePage';
import AboutPage from './main-pages/about/AboutPage';
import ErrorPage from './main-pages/ErrorPage';
import ProjectsPage from './galleries/projects-page/ProjectsPage';
import ImageGallery from './galleries/image-gallery/ImageGallery';

/* Articles */

import GoldenRatioArticle from './articles/golden-ratio/GoldenRatioArticle';
import MandelbrotArticle from './articles/mandelbrot/MandelbrotArticle';
import QuadraticFormulaArticle from './articles/quadratic-formula/QuadraticFormulaArticle';
import ChaosTheoryArticle from './articles/chaos-theory/ChaosTheoryArticle';

/* Demos */

import LotkaVolterraDemo from './demos/lotkavolterra/LotkaVolterraDemo';
import SpringMassDemo from './demos/springmass/SpringMassDemo';
import StringWavesDemo from './demos/stringwaves/StringWavesDemo';
import DoubleSlitDemo from './demos/doubleslit/DoubleSlitDemo'; 

import MandelOrbitDemo from './demos/mandelbrotorbits/MandelOrbitDemo';
import NewtonParamDemo from './demos/newton/newton-params/NewtonParamDemo';
import NewtonFractalDemo from './demos/newton/newton-fractal/NewtonFractalDemo'; 

import VivianiThmDemo from './demos/viviani/VivianiThmDemo';
import WittgensteinRodDemo from './demos/curves/WittgensteinRodDemo';
import PedalDemo from './demos/curves/PedalDemo';
import BonneProjDemo from './demos/bonne/BonneProjDemo';
import SpirographDemo from './demos/spirograph/SpirographDemo';
import CliffordTorusDemo from './demos/clifford/CliffordTorusDemo';
import DandelinDemo from './demos/dandelin/DandelinDemo';
import SteinerDemo from './demos/steiner/SteinerDemo';
import StellationDemo from './demos/stellations/StellationDemo';

/*
Ant Design style info.
*/

const theme = {
    token: {
        fontFamily: "var(--font-family)",
        colorText: "var(--light-col-1)",
        activeShadow: "0 0 0 2px rgba(129, 138, 252, 0.1)"
    },
    components: {
        Select: {
            colorTextPlaceholder: "var(--light-col-1)",
            colorTextQuaternary: "var(--light-col-1)",
            colorPrimaryHover: "var(--elt-col-3)",
            colorBgElevated: "var(--dark-col-3)",
            optionSelectedBg: "var(--elt-col-1)",
            optionActiveBg: "var(--elt-col-3)",
            colorPrimary: "var(--elt-col-1)",
            selectorBg: "var(--dark-col-3)",
            optionFontSize: "1rem"
        },
        Popover: {
            colorBgElevated: "var(--dark-col-3)"
        },
        Tooltip: {
            colorBgSpotlight: "var(--dark-col-3)"
        }
    }
}

/*
List of URLs.
*/

function App() {
    return (
        <ConfigProvider theme={theme}>
            <MathJaxContext>
                <BrowserRouter>
                    <Routes>
                        <Route index element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/gallery" element={<ImageGallery />} />
                        <Route path="*" element={<ErrorPage />} />

                        <Route path="/articles/goldenratio" element={<GoldenRatioArticle />} />
                        <Route path="/articles/mandelbrotexplained" element={<MandelbrotArticle />} />
                        <Route path="/articles/quadraticformula" element={<QuadraticFormulaArticle />} />
                        <Route path="/articles/chaosexplained" element={<ChaosTheoryArticle />} />

                        <Route path="/physics/lotkavolterra" element={<LotkaVolterraDemo />} />
                        <Route path="/physics/springmass" element={<SpringMassDemo />} />
                        <Route path="/physics/stringwaves" element={<StringWavesDemo />} />
                        <Route path="/physics/doubleslit" element={<DoubleSlitDemo />} /> 

                        <Route path="/fractals/mandelorbits" element={<MandelOrbitDemo />} />
                        <Route path="/fractals/newtonparams" element={<NewtonParamDemo />} />
                        <Route path="/fractals/newtonfractals" element={<NewtonFractalDemo />} />

                        <Route path="/geom/bonneproj" element={<BonneProjDemo />} />
                        <Route path="/geom/vivianitheorem" element={<VivianiThmDemo />} />
                        <Route path="/geom/wittgenstein" element={<WittgensteinRodDemo />} />
                        <Route path="/geom/pedalcurves" element={<PedalDemo />} />
                        <Route path="/geom/spirograph" element={<SpirographDemo />} />
                        <Route path="/geom/clifford" element={<CliffordTorusDemo />} />
                        <Route path="/geom/dandelin" element={<DandelinDemo />} />
                        <Route path="/geom/steiner" element={<SteinerDemo />} />
                        <Route path="/geom/stellations" element={<StellationDemo />} />
                    </Routes>
                </BrowserRouter>
            </MathJaxContext>
        </ConfigProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);