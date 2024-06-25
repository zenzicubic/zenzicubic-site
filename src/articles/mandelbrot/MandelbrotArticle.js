/**
 * This is the article I wrote on the Mandelbrot set and kin. 
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { MathJax } from 'better-react-mathjax';
import { Link } from 'react-router-dom';

import { ArticleLayout, ArticleImage } from '../components/article-components';
import sampleImg from './mandelbrot-sample.png';
import tribrotImg from './tribrot.png';
import brotImg from './mandelbrot2.png';

function MandelbrotArticle() {
    return (<>
        <title>The Mandelbrot Set | Zenzicubic</title>
        <ArticleLayout
            title="The Mandelbrot set for dummies"
            date="24 April 2022">
                <p>
                    The Mandelbrot set is a classic image in computer graphics and math. Chances are you&apos;ve seen it before. Maybe you&apos;ve even seen a program to generate it. But just how does it work? In this article I hope to demystify the quite interesting math behind it. However, before we can do that we must explain complex numbers.
                </p>

                <h2 className="section-header">Complex Numbers</h2>
                
                <div className="article-section">
                    <p>
                        You may be familiar with the idea that there are different types of numbers, and you may even know what complex numbers are, but if you don&apos;t here&apos;s a quick refresher.
                    </p>
                    <h3 className="subsection-header">The imaginary unit, <MathJax inline>{'\\(i\\)'}</MathJax></h3>
                    <p>
                        Try to think about the square root of -1. Try putting it into a calculator. You probably will get "undefined" or some other error. If you think about it, it&apos;s sort of impossible. Any negative number times any other is positive. You get stuck in a logical loop.<br /><br />
                        
                        But problems involving square roots of negative numbers appear everywhere from basic algebra to engineering. Mathematicians needed a way to solve them. So a few mathematicians in 1500s Italy had an idea. Instead of worrying about the square root of -1&apos;s value, they referred to <MathJax inline>{'\\(\\sqrt{-1}\\)'}</MathJax> as <MathJax inline>{'\\(i\\)'}</MathJax>, which later gained the name of the imaginary unit. Imaginary numbers, as they are called, are the square roots of negative real numbers, and are written as <MathJax inline>{'\\(\\sqrt{-a} \\cdot i\\)'}</MathJax> where <MathJax inline>{'\\(a\\)'}</MathJax> is any negative real number. (Real numbers are the normal numbers we use in basic math.)
                    </p>
                    <h3 className="subsection-header">Complex numbers</h3>
                    <p>  
                        Now that you know what imaginary numbers are, we can explain complex numbers. Complex numbers are numbers containing both real numbers and imaginary numbers. They take the form <MathJax inline>{'\\(a+bi\\)'}</MathJax>, where <MathJax inline>{'\\(a\\)'}</MathJax> and <MathJax inline>{'\\(b\\)'}</MathJax> are real numbers and <MathJax inline>{'\\(i\\)'}</MathJax> is the imaginary unit. The <MathJax inline>{'\\(a\\)'}</MathJax> part of that formula is called the "real part" and the <MathJax inline>{'\\(b\\)'}</MathJax> part is called the "imaginary part".<br /><br />
                        
                        If you&apos;ve had an elementary school education, which I assume you have, you probably know that real numbers can be written as a line called a number line, or a "real line" by mathematicians. Just like we can graph real numbers in 1 dimension, we can graph complex numbers in two, on the complex plane. The complex plane has a real axis, which is horizontal, and an imaginary axis, which is vertical. The real part <MathJax inline>{'\\(a\\)'}</MathJax> of a complex number denotes horizontal position, and the imaginary part <MathJax inline>{'\\(b\\)'}</MathJax> indicates vertical position. We can also represent them as a vector pointing to said point: <MathJax inline>{'\\(\\mathbf{z}=\\left\\lt a, b \\right\\gt\\)'}</MathJax>. Complex numbers can be used in most of the same math as real numbers: they can be multiplied, divided, added, and subtracted. Complex-valued functions can have derivatives too.<br /><br />

                        One important quantity of complex numbers is their magnitude, or absolute value. For a given complex number <MathJax inline>{'\\(z\\)'}</MathJax>, its magnitude (usually denoted <MathJax inline>{'\\(|z|\\)'}</MathJax>) is equal to its distance from the origin in the complex plane, equal to <MathJax inline>{'\\(\\sqrt{a^2+b^2}\\)'}</MathJax>. This quantity will appear again later.
                    </p>
                </div>

                <h2 className="section-header">Complex Dynamics</h2>

                <p>
                    Complex dynamics or holomorphic dynamics is a field of mathematics dealing with how functions involving complex numbers behave when iterated. Complex dynamics has uses in both applied and pure mathematics. Complex dynamics deals with how the outputs of complex-valued functions (also known as complex maps) change size and value as they iterate. In this article we&apos;ll be looking at the complex function <MathJax inline>{'\\(f_c(z) = z^2 + c\\)'}</MathJax>, the Mandelbrot set&apos;s generating function, and how it behaves when iterated.
                </p>

                <h2 className="section-header">The Mandelbrot set itself</h2>

                <div className="article-section">
                    <p>
                        The Mandelbrot set is a fractal first visualized by Benoit Mandelbrot at IBM in 1980 using older mathematics from 1978 by Robert W. Brooks, which itself was based on work by Gaston Julia at the beginning of the 20th century. But that doesn&apos;t tell us how it works or what it is.
                    </p>
                    <h3 className="subsection-header">The Mandelbrot set isn&apos;t what you think</h3>
                    <p>
                        If you don&apos;t know much about mathematics, you may just see the Mandelbrot set as trippy colors and vague mathematical connections. But what you don&apos;t know is that the Mandelbrot set is actually a graph of a set. Sets in mathematics are containers, essentially lists, that can hold numbers, functions, and literally anything else. The Mandelbrot set is a set of all of the values of <MathJax inline>{'\\(c\\)'}</MathJax> whose values of <MathJax inline>{'\\(f_c\\)'}</MathJax> are bounded. This may be confusing, but you&apos;ll understand in a moment. The meaning of "bounded" in this context is important, so let me explain. The aforementioned function actually behaves differently for different values of <MathJax inline>{'\\(c\\)'}</MathJax> when iterated. For some values, it diverges, meaning that its magnitude grows to infinity, for some it ping-pongs between a couple values, for some its magnitude remains fixed, and for others it converges on an arbitrary small value close to zero. How this function behaves is very closely dependent on the complex input. Sometimes values of <MathJax inline>{'\\(c\\)'}</MathJax> very close to each other behave very differently. The Mandelbrot set is the set of all numbers that don&apos;t diverge.<br /><br />

                        TL;DR: The Mandelbrot set maps how the function <MathJax inline>{'\\(f_c(z) = z^2 + c\\)'}</MathJax> on the complex plane behaves when iterated for all possible values of <MathJax inline>{'\\(c.\\)'}</MathJax><br /><br />
                        
                        Now how do we get trippy colors from this? That is what I will discuss next.
                    </p>
                    <h3 className="subsection-header">What does the <MathJax inline>{'\\(z\\)'}</MathJax> do? And where does the color come from?</h3>
                    <p>
                        First, what <MathJax inline>{'\\(z\\)'}</MathJax> means. <MathJax inline>{'\\(z\\)'}</MathJax> is an input to the function. It begins at zero, but we iterate the function over and over again, we feed its output back in as <MathJax inline>{'\\(z\\)'}</MathJax>, keeping <MathJax inline>{'\\(c\\)'}</MathJax> the same. This is how we iterate the function. The values of during the iterations are referred to as the &quot;orbit&quot;. They tend to form spirals and geometric shapes in the complex plane when plotted, which can be seen in my demo <Link to="/mandelorbits">here</Link>.<br /><br />
                    
                        Now, how do we color it in? For the values that converge, let&apos;s color them white. For the values that diverge, let&apos;s color them based on how many iterations it takes the magnitude of the function&apos;s output to begin to diverge for each point <MathJax inline>{'\\(c\\)'}</MathJax> on the complex plane below a certain threshold (termed the bailout number). When the magnitude of <MathJax inline>{'\\(z\\)'}</MathJax> crosses the threshold, it is said that <MathJax inline>{'\\(z\\)'}</MathJax> is &quot;escaping&quot;. Not all divergent points on the complex plane diverge at the same speed. So we'll color them based on how fast they diverge with black being fast and white being slow. Points that converge are colored white. When we graph the image from <MathJax inline>{'\\(-2 - 2i\\)'}</MathJax> to <MathJax inline>{'\\(2 + 2i\\)'}</MathJax>, here is what we get:
                    </p>

                    <ArticleImage 
                        imgUrl={sampleImg} imgAlt="Mandelbrot set example 1" 
                        imgDesc="The Mandelbrot set image obtained by our method"/>

                    <p>Looking familiar now, eh? We can use all manner of algorithms and formulae to generate trippy colors from these numbers. Now, let's talk about how to program it.</p>

                </div>

                <h2 className="section-header">Programming (featuring the C programming language)</h2>

                <p>
                    Now, how can we program this? First, let&apos;s focus on the Mandelbrot set&apos;s generating function <MathJax inline>{'\\(f_c(z) = z^2 + c\\)'}</MathJax>. Let&apos;s try setting the complex number formula <MathJax inline>{'\\(a + bi\\)'}</MathJax> as our <MathJax inline>{'\\(z\\)'}</MathJax> and <MathJax inline>{'\\(c\\)'}</MathJax> values. First, <MathJax inline>{'\\(z^2\\)'}</MathJax>:

                    <MathJax>{`\\(\\begin{align*}
                            & z = a+bi \\\\
                            & z^2 = (a+bi)^2
                    \\end{align*}\\)`}</MathJax><br />

                    This takes the form <MathJax inline>{'\\((a+b)^2\\)'}</MathJax>, which we can apply binomial expansion to. This gives us:

                    <MathJax>{`\\(\\begin{align*}
                            a^2 + 2abi - b^2
                    \\end{align*}\\)`}</MathJax>

                    This can be rearranged to:

                    <MathJax>{`\\(\\begin{align*}
                            a^2 - b^2 + 2abi 
                    \\end{align*}\\)`}</MathJax>

                    Now add the <MathJax inline>{'\\(c\\)'}</MathJax> and we&apos;ll be golden!<br /><br />

                    Now we have our general formula, which we can implement. We can just ignore the <MathJax inline>{'\\(i\\)'}</MathJax> and handle the complex numbers piecemeal. Now, to program in C! Since C doesn&apos;t have a default graphics library, I&apos;ve used ASCII characters to print the Mandelbrot set. The math itself is in the test function, and in lieu of a set I&apos;ve used a two-dimensional array. Since a 4x4 grid is pretty small, I mapped the coordinates down from a 100x100 grid. The values of <MathJax inline>{'\\(c\\)'}</MathJax> are stored in the oa and ob variables, and the equation is computed in the while loop. My code is <a href="https://github.com/zenzicubic/mandelbrot-c/blob/main/mandelbrot.c" target="_blank" rel="noopener noreferrer">here</a>. I won&apos;t be including the output of the program because of how long it is, but it essentially is just an ASCII version of the image from before. <br /><br />

                        
                    Just one final note: if you use some other number instead of 2 in <MathJax inline>{'\\(f_c(z) = z^2 + c\\)'}</MathJax>, the main cardioid (and also all of the rest of the set) folds over. Here&apos;s a high-quality render of a tribrot, or 3rd power Mandelbrot set, made with Java:
                </p>

                <ArticleImage 
                    imgUrl={tribrotImg} imgAlt="Tribrot Mandelbrot set" 
                    imgDesc="The 3rd-power Mandelbrot set, or &quot;tribrot&quot;"/>

                <p>
                    Anyway thanks for reading this far and if I messed it up somehow don&apos;t hesitate to reach out. Sadly this will not be made into a video as it&apos;s too lengthy and I can&apos;t visualize it well. There&apos;s some great Numberphile videos on the topic though. As a reward for reading this far here is a better image of a Mandelbrot, also made with Java:
                </p>

                <ArticleImage 
                    imgUrl={brotImg} imgAlt="Mandelbrot set" 
                    imgDesc="A nicer Mandelbrot set"/>
        </ArticleLayout>
    </>);
}

export default MandelbrotArticle;