/**
 * This is the article I wrote on the golden ratio and how I calculated it.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { MathJax } from 'better-react-mathjax';
import { Link } from 'react-router-dom';

import { ArticleLayout, ArticleImage } from '../components/article-components';
import phiImg from './icosarect.png';

function GoldenRatioArticle() {
    return (<>
        <title>Calculating the golden ratio | Zenzicubic</title>
        <ArticleLayout
            title="Calculating the golden ratio"
            date="29 March 2022 (updated 27 December 2023)">
                <h2 className="section-header">The Fibonacci Numbers</h2>
                <p>
                    One of the most famous number sequences is the Fibonacci sequence. It goes 0, 1, 1, 2, 3, 5, 8, 13, 21, and so on. Each element of the sequence (after the second) is the sum of the previous two, which is how we get successive terms of the sequence. We can write this as a linear recurrence:
                    <MathJax>{'\\(F_{n+1}=F_n+F_{n-1}\\)'}</MathJax>
                    This sequence has been known since antiquity. Interestingly enough, the limiting ratio between Fibonacci numbers approaches a constant value known as the golden ratio, <MathJax inline>{'\\(\\varphi\\)'}</MathJax>, whose value is 1.618033988749899484820&hellip;<br />
                    Furthermore, no matter what the first two numbers in the sequence are, this limiting ratio will remain the same. This may be proven by rewriting the linear recurrence as a 2x2 matrix and computing its eigenvalues.<br /><br />
                    
                    The golden ratio is irrational, and goes on and on forever without repeating. It too has been known since ancient times, and was widely considered as sacred in the ancient world. It appears in nature and architecture, namely the pyramids of Giza and the Parthenon. Many plants exhibit the Fibonacci numbers.</p>

                <ArticleImage 
                    imgUrl={phiImg} imgAlt="Golden rectangles in an icosahedron" 
                    imgDesc="An icosahedron exhibits the golden ratio."/>

                <p>
                    The golden ratio appears in geometry. Half the golden ratio is the cosine of 36&deg;, and the golden ratio appears in pentagons, pentagrams, dodecahedra, icosahedra, and much, much more. In this article, I will both derive a formula for the exact value of the golden ratio, and explain how I wrote a program that calculated 1,000,000,000 digits of it.
                </p>
                
                <h2 className="section-header">Deriving an Exact Value</h2>

                <p>
                    We already know that the limiting ratio between two consecutive Fibonacci numbers, which we&apos;ll call <MathJax inline>{'\\(a\\)'}</MathJax> and <MathJax inline>{'\\(b\\)'}</MathJax>, is the golden ratio. This also holds true for the next term in the Fibonacci sequence, <MathJax inline>{'\\(a + b\\)'}</MathJax>. Thus we can say that
                
                    <MathJax>{`\\(\\begin{align*}
                        \\frac{b}{a} = \\frac{a+b}{b} = \\varphi.
                    \\end{align*}\\)`}</MathJax><br />

                    Taking the second equality and rewriting it as a sum furnishes this:

                    <MathJax>{`\\(\\begin{align*}
                        \\frac{a}{b} + 1 = \\varphi.
                    \\end{align*}\\)`}</MathJax><br />

                    Since <MathJax inline>{'\\(\\frac{b}{a}=\\varphi\\)'}</MathJax>, we can rewrite this expression like so:

                    <MathJax>{`\\(\\begin{align*}
                        \\frac{1}{\\varphi} + 1 = \\varphi.
                    \\end{align*}\\)`}</MathJax><br />

                    Multiplying through by <MathJax inline>{'\\(\\varphi\\)'}</MathJax> and rearranging so that all terms lie on one side, we obtain the following quadratic equation:

                    <MathJax>{`\\(\\begin{align*}
                        \\varphi^2 - \\varphi - 1 = 0
                    \\end{align*}\\)`}</MathJax><br />

                    Solving this using the <Link to="/articles/quadraticformula">quadratic formula</Link>, we obtain two solutions:

                    <MathJax>{`\\(\\begin{align*}
                        \\frac{1 \\pm \\sqrt{5}}{2}
                    \\end{align*}\\)`}</MathJax><br />

                    Since the golden ratio is a ratio of strictly positive quantities (the Fibonacci numbers in our case), we keep the positive solution which has the value we observed before:

                    <MathJax>{`\\(\\begin{align*}
                        \\varphi = \\frac{1 + \\sqrt{5}}{2}
                    \\end{align*}\\)`}</MathJax>
                </p>

                <h2 className="section-header">Computing the Golden Ratio</h2>

                <div className="article-section">
                    <h3 className="subsection-header">The Problem</h3>
                    <p>
                        If you enter the value we just derived into your calculator, you will get a value of 1.618033 and so on, which is what we&apos;ve established up to this point. However, considering that I mentioned that I wanted to calculate 1,000,000,000 digits of the golden ratio, we must find an algorithm that does this.<br /><br />
                    
                        The problem we&apos;re trying to solve reduces to finding one of the zero(s) of a specific function. This particular problem has been solved, and one of the most common methods for approximating the value of a function&apos;s zero is the Newton-Raphson method.
                    </p>
                    <h3 className="subsection-header">The Newton-Raphson Method</h3>
                    <p>
                        At any given point on some function <MathJax inline>{'\\(f\\)'}</MathJax>&apos;s graph, its tangent line is a good linear approximation to that function around that point. As such, the x-intercept of this tangent line is an approximation to our zero.<br /><br />
                        
                        If you&apos;ve taken a Calculus class before, you will know that that slope is equal to the derivative of <MathJax inline>{'\\(f\\)'}</MathJax> at that point, <MathJax inline>{'\\(f^\\prime(x)\\)'}</MathJax>. As such, the equation of the tangent line through some x-coordinate <MathJax inline>{'\\(x_0\\)'}</MathJax> is
                        
                        <MathJax>{`\\(\\begin{align*}
                            y - f(x_0) = f^\\prime(x_0)(x - x_0)
                        \\end{align*}\\)`}</MathJax><br />

                        Solving for <MathJax inline>{'\\(x\\)'}</MathJax> furnishes our desired x-intercept:

                        <MathJax>{`\\(\\begin{align*}
                            -f(x_0) &= f^\\prime(x_0)(x - x_0) \\\\
                            -f(x_0) &= xf^\\prime(x_0) - x_0f^\\prime(x_0) \\\\
                            -xf^\\prime(x_0) &= f(x_0) - x_0f^\\prime(x_0) \\\\
                            \\therefore x &= x_0 - \\frac{f(x_0)}{f^\\prime(x_0)}
                        \\end{align*}\\)`}</MathJax><br />

                        The core idea of the Newton-Raphson method is that we take some initial approximation and compute the x-intercept of the tangent line at this value to produce a (hopefully) better approximation. We take this x-intercept, and repeat the process of finding the tangent line and its x-intercept until the approximation is precise enough for our liking. We can write this as a recurrence relation:
                        
                        <MathJax>{`\\(\\begin{align*}
                            x_{n+1} &= x_n - \\frac{f(x_n)}{f^\\prime(x_n)}
                        \\end{align*}\\)`}</MathJax><br />
                        
                        In fact, the Newton-Raphson method has quadratic convergence, meaning that the number of correct digits doubles each iteration. So, to find the golden ratio, we can just choose some initial approximation (say 1.62) and apply a few iterations to get to the desired degree of precision. 

                        Here is an <a href="https://www.desmos.com/calculator/tbr2j9zq8r" target="_blank" rel="noopener noreferrer">interactive example</a> that I made in Desmos.<br /><br />

                        In practice, we need to use something called &quot;arbitrary-precision arithmetic&quot; to allow us to perform calculations with the enormous number of digits we want to find, because computers usually store decimals using only a finite amount of decimal precision.
                    </p>
                    <h3 className="subsection-header">The Details</h3>
                    <p>
                        Now, for the details of how I actually did the calculation. I wrote my program in Java, using the <a href="http://www.apfloat.org/apfloat_java/" target="_blank" rel="noopener noreferrer">Apfloat</a> Java arbitrary-precision arithmetic library. Unfortunately, I no longer have the code. My program actually used a slightly different method called the <a href="https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Heron&apos;s_method" target="_blank" rel="noopener noreferrer">Babylonian algorithm</a> to compute the square root of 5, which I then converted to the golden ratio.<br /><br />

                        When it came time to actually perform the calculation, I performed several test calculations. I encountered issues with memory from trying to write all of the 1 billion digits to a single file, which took me a lot longer than I care to admit. I ended up writing it to 20 separate files of 50 million each. It also took a bit of tweaking to figure out the number of iterations needed to correctly obtain 1 billion digits, which ended up being 40.<br /><br />
                        
                        Actual calculation took 179 minutes or about 3 hours in total on the crummy laptop I had at the time I originally wrote this article. After it finished, I eagerly saved the 20 files to my 2 TB hard disk. I examined them at various points, checking that they match against <a href="http://www.numberworld.org/digits/GoldenRatio/" target="_blank" rel="noopener noreferrer">existing tables</a>. All checks were good, and I let out a few colorful words of excitement. I finished at 7:41 PM EST. The total size of all of the files (uncompressed txt format) was 953 MB.<br /><br />

                        I accidentally calculated an additional digit, and I can say with 99% certainty that the 1,000,000,001th digit of <MathJax inline>{'\\(\\varphi\\)'}</MathJax> is a 1.
                        The last few digits of my calculation were:<br />
                        ...1018075041304850929640807448240488278075162815536599715551744547383806284019434153026258738913328331. 
                        To download the first 1,000,000 digits, <a href={require("./phi.txt")}>click here.</a><br /><br />

                        System Info (for the machine I did this on):
                    </p>

                    <ul>
                        <li>Dell Latitude Laptop</li>
                        <li>OS: Windows 10 Pro</li>
                        <li>Processor: Intel&reg; Core&trade; i7-6820HQ CPU @ 2.70GHz, 2701 Mhz, 4 Cores, 8 Logical Processors x64</li>
                        <li>476 GB memory</li>
                    </ul>
                    
                    <p>
                        Even though 1,000,000,000 digits isn&apos;t the world record for the golden ratio, I&apos;m still pleased with this result.
                    </p>
                </div>

                <h2 className="section-header">Why did I do this?</h2>

                <p>
                    So, why would anyone decide to do this? Inspiration for this project came from a couple of places.<br /><br />
                    
                    First, Pi Day, 3/14. I was originally planning to calculate pi. I tried a variety of series on paper and in code, and they all converged rather slowly.<br /><br />
                    
                    Second, <a href="https://scp-wiki.wikidot.com/scp-4314" target="_blank" rel="noopener noreferrer">SCP-4314</a>, which I also <a href="https://youtu.be/13e3l8mcl-I" target="_blank" rel="noopener noreferrer">did a reading of</a>. I had the idea to calculate pi out to ridiculous numbers of decimal places to check if there were any Ortothan messages there. (There weren&apos;t, and this proves that I&apos;m a massive nerd.) I gave up on pi after realizing how hard it was. So I started working with the golden ratio.<br /><br />

                    The original version of this article was written over a year ago (as of 27 December 2023), and my understanding of mathematics has improved since then. Thus, I recently rewrote it mostly from scratch. Well, I hope this was interesting, and I hope you enjoyed. Have a mathematical day!
                </p>
        </ArticleLayout>
    </>);
}

export default GoldenRatioArticle;