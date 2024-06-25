/**
 * This is the article I wrote on the basics of chaos theory and dynamical systems.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { MathJax } from 'better-react-mathjax';

import { ArticleLayout, ArticleImage } from '../components/article-components';
import AttractorApplet from './AttractorApplet';
import attractorImg from './duffing.png';

function ChaosTheoryArticle() {
    return (<>
        <title>Chaos theory, for dummies | Zenzicubic</title>
        <ArticleLayout
            title="Chaos theory, for dummies"
            date="24 June 2022">
                <p>
                    How does the flap of a butterfly&apos;s wings connect to pendulums and the weather? The answer is chaos theory, a relatively new and emerging scientific field based on ideas from various fields of math and physics. In this article, I hope to explore some of the many parts of chaos theory, some of its implications, and some of the rather interesting math related to it.
                </p>

                <h2 className="section-header">Big Ideas</h2>

                <div className="article-section">
                    <h3 className="subsection-header">Dynamical Systems &amp; Phase Space</h3>
                    <p>
                        Dynamical systems are a type of mathematical system in which functions describe the location and behavior of a point in space, and typically contain one or more variables. Any type of equation can work, but most commonly differential equations and recurrence relations are most common (which will be discussed later). Put simply, they&apos;re a type of system where functions govern how the system changes and moves with time. They are an important concept and the key element of almost everything else discussed here. Examples include pendulums, water flowing in a river, and populations of lemmings in the Arctic.<br />

                        The space in which dynamical systems operate is called phase space. Phase space is the term for the space or set of all possible states of a system, and each point corresponds to a unique state of the system. The path that a point takes through phase space is called its &quot;trajectory&quot;.
                    </p>
                    <h3 className="subsection-header">Recurrence Relations</h3>
                    <p>
                        Recurrence relations are a way to represent repeatedly applying functions to variables and feeding their outputs back in, which is known as recursion. They can be univariate (single-variable)...

                        <MathJax>{`\\(
                            x_{n+1} = f(x_n)
                        \\)`}</MathJax>

                        ...or multivariate (multivariable):

                        <MathJax>{`\\(\\begin{align*}
                            x_{n+1}&=1-ax_n^2+y_n \\\\
                            y_{n+1}&=bx_n
                        \\end{align*}\\)`}</MathJax>

                        This particular equation is for a dynamical system called the H&eacute;non map. They use subscripts to represent time. For example if <MathJax inline>{'\\(x_0\\)'}</MathJax> is the initial state, then the states that follow it are <MathJax inline>{'\\(x_1, x_2, x_3, \\)'}</MathJax> and so on. They&apos;re called &quot;discrete&quot; or &quot;discrete-time&quot; because they don&apos;t have unique values for all real number times, and only have values for natural number times. This article will mostly focus on them.
                    </p>
                    <h3 className="subsection-header">Differential Equations</h3>
                    <p>
                        Differential equations are a concept from calculus that appears all over mathematics, from finance to physics to biology. Differential equations essentially describe a variable or function in terms of its rate of change, or more technically a function to its derivative. They&apos;re usually represented by a dot.

                        <MathJax>{`\\(
                            \\dot{x} = f(x)
                        \\)`}</MathJax>

                        The dot essentially means &quot;the rate of change of <MathJax inline>{'\\(x\\)'}</MathJax> over a small range of time is equal to some function, <MathJax inline>{'\\(f(x)\\)'}</MathJax>&quot;. Working with these systems usually involves solving these equations, an often difficult task. These will not be detailed too much here, but plenty of information is available online. They&apos;re known as continuous because for any time value one puts in, they&apos;ll get a unique output each time. Differential equations sharing variables are known as &quot;coupled&quot;, and represent a system.
                    </p>
                    <h3 className="subsection-header">Attractors and Basins of Attraction</h3>
                    <p>
                        Attractors in dynamical systems are a set of states to which all trajectories tend to converge. They appear in many dynamical systems. The area of the phase space of a system in which all states are drawn towards its attractors is called its &quot;basin of attraction&quot;. Attractors with fractal properties are called &quot;strange attractors&quot;. We&apos;ll discuss what makes something have fractal properties later.
                    </p>
                </div>

                <h2 className="section-header">Chaos and Chaos Theory Itself</h2>

                <p>
                    So with that out of the way, what is chaos theory and what does it mean to be chaotic? I&apos;ll explain with a story.<br /><br />

                    Say you&apos;re a biologist who studies populations of lemmings and owls in an ecosystem. You&apos;ve spent years coming up with a mathematical model you think perfectly describes how populations change over time. So, you put it into a computer, give it some initial conditions that approximate what you&apos;ve seen in the wild, and let it run for a while. But you notice something peculiar. The outputs of the computer initially seem to follow what you see in nature, but after a short while they begin to diverge, and eventually they are completely different. So you try to simplify your equations, and make your inputs more accurate, but the problem persists.<br /><br />

                    Well, what just happened? You&apos;ve discovered a chaotic system. A chaotic system is a dynamical system that displays sensitive dependence on initial conditions: even slight errors can build up. Examples of chaotic systems include the weather, animal populations, and electric circuits. Weather predictions are often imprecise, because weather is a chaotic system. They are <u>not</u> random; we can predict them using models on a computer, however they require their initial conditions to be extremely precise and exactly model observed data for them to be accurate. For example, this might involve measuring the distance of the Earth and Sun down to the atom to simulate the motions of planets in the solar system. For example, this image depicts two different trajectories in an attractor called the Duffing attractor, given by the differential equation  <MathJax inline>{`\\(\\ddot{x}+\\delta\\dot{x}+\\alpha x+\\beta x^3 = \\gamma \\cos{(\\omega t)}\\)`}</MathJax>. These trajectories differ by less than one in one million, but still quickly diverge.
                </p>

                <ArticleImage
                    imgUrl={attractorImg}
                    imgAlt="Diverging trajectories in the Duffing attractor"
                    imgDesc="Two nearby trajectories in the Duffing attractor diverge" />

                <p>
                    Yet another key determiner of a chaotic system is topological mixing. Topological mixing is essentially the idea that for any given possible set of states will always eventually evolve to some or all of the states in the set. Another way of stating this is that any open set in phase space will eventually intersect other sets in phase space, or mathematically:<br />

                    For a dynamical system <MathJax inline>{'\\(f\\)'}</MathJax> on a phase space <MathJax inline>{'\\(X\\)'}</MathJax> to be topologically mixing, for every pair of open disjoint sets <MathJax inline>{'\\(U\\)'}</MathJax> and <MathJax inline>{'\\(V\\)'}</MathJax>, there must exist an <MathJax inline>{'\\(N\\)'}</MathJax> such that <MathJax inline>{'\\(f_n(U) \\cap V \\neq \\emptyset\\)'}</MathJax> for all <MathJax inline>{'\\(n \\geq N\\)'}</MathJax>.<br /><br />

                    This is not exactly a trivial matter because either both sets would have to be made really big, which is usually unlikely; or the sets would get stretched, folded, bent, and pinched so they mix &amp; permeate space. Essentially this just states that the trajectories in a chaotic systems just mix together over time; a formal way of describing mixing. Of course there are others, but they&apos;re a bit too complex for this.<br /><br />

                    Chaos theory was originally developed in 1963 by Edward N. Lorenz in a similar way to the lemming example above. He was trying to predict weather, so he developed a simplified model of atmospheric convection derived from the Navier-Stokes fluid dynamics equations, but noticed the sensitive dependence on initial conditions characteristic of chaos. The outputs of the computer he was using wildly varied over time. He then simplified it down to a system of 3 relatively simple coupled differential equations that also display chaos, which are named after him:

                    <MathJax>{`\\(\\begin{align*}
                        \\dot{x}&=\\sigma(y-x) \\\\ 
                        \\dot{y}&=x(\\rho-z)-y \\\\ 
                        \\dot{z}&=xy-\\beta z
                    \\end{align*}\\)`}</MathJax>

                    Chaos is often known colloquially as the &quot;butterfly effect&quot;, which came from the title of a talk Lorenz gave on the subject.
                </p>

                <h2 className="section-header">Going Further</h2>

                <div className="article-section">  
                    <p>
                        There&apos;s more though. There are many properties of dynamical systems I haven&apos;t discussed yet. So here are a few of the most important ones:
                    </p>
                    <h3 className="subsection-header">The Lyapunov Exponent</h3>
                    <p>
                        The Lyapunov or Liapunov exponent describes the rate of separation of nearby trajectories in an attractor. Put simply, it numerically describes how quickly two nearby points on or near an attractor diverge, or the rate at which information about initial conditions is lost. This is usually expressed as:

                        <MathJax>{`\\(\\begin{align*}
                            \\Vert\\mathbf{\\delta Z(t)}\\Vert 
                            \\approx e^{\\lambda t} \\Vert\\mathbf{\\delta Z}_0\\Vert,
                        \\end{align*}\\)`}</MathJax>

                        where <MathJax inline>{'\\(\\mathbf{\\delta Z}_0\\)'}</MathJax> denotes the initial separation vector (essentially a line between the two starting points), <MathJax inline>{'\\(\\mathbf{\\delta Z}(t)\\)'}</MathJax> denotes the separation vector for some time <MathJax inline>{'\\(t\\)'}</MathJax>, and the bars denote the magnitude, or length, of that vector. The statement of this equation, put simply, is that the distance between any two trajectories in a dynamical system in terms of a line between them at a given time <MathJax inline>{'\\(t\\)'}</MathJax> is approximately <MathJax inline>{'\\(e^{\\lambda t}\\)'}</MathJax> times the initial distance, where <MathJax inline>{'\\(\\lambda\\)'}</MathJax> is the Lyapunov exponent, <MathJax inline>{'\\(t\\)'}</MathJax> is the time, and <MathJax inline>{'\\(e\\)'}</MathJax> is Euler&apos;s number, about 2.71828. It can be calculated by this limit, which also makes use of separation vectors:
  
                        <MathJax>{`\\(\\begin{align*}
                            \\lambda = \\lim_{t\\to\\infty} \\lim_{\\Vert\\mathbf{\\delta Z}_0\\Vert \\to 0} \\frac{1}{t} \\ln{\\frac{\\Vert \\mathbf{\\delta Z}(t)\\Vert}{\\Vert \\mathbf{\\delta Z}_0 \\Vert}}
                        \\end{align*}\\)`}</MathJax>

                        What this states is that the Lyapunov exponent is equal to the natural logarithm of the average rate of change of the distance between two arbitrarily close but not equal initial states over a time <MathJax inline>{'\\(t\\)'}</MathJax> which approaches infinity. It&apos;s a property characteristic of a chaotic system, because positive Lyapunov exponents denote chaotic systems, while negative Lyapunov exponents denotes that the system attracts to a cycle or stable point.
                    </p>
                    <h3 className="subsection-header">Fractal Dimension</h3>
                    <p>
                        We usually learn that dimensions can only be natural numbers &mdash; a line is one-dimensional, a square two-dimensional, and a cube three-dimensional. But what is a dimension? The usual definition of a dimension is essentially the number of variables it takes to describe a given arbitrarily small region of a shape. A plane is two-dimensional; it has x and y. A sphere can be interpreted as being two-dimensional as well: it&apos;s just composed of copies of the plane at an arbitrarily small scale. But are there other ways to think about this? Yes.<br /><br />

                        What is the relationship of an object&apos;s length, area, or volume to its diameter? This can lead to another way to think about dimension. Let&apos;s consider a line of length. When we divide its length by 2, the line can be cut into two pieces of length <MathJax inline>{'\\(\\frac{1}{2}\\)'}</MathJax>, and when we join it to itself, we get a line of length 2. The same goes for a square; when we cut the side length of a unit square in half, it is cut into 4 squares of area <MathJax inline>{'\\(\\frac{1}{4}\\)'}</MathJax>, and when we double its side length, its area is multiplied by <MathJax inline>{'\\(2^2\\)'}</MathJax>. For a unit cube, we notice something similar. When we halve the side length, the area scales by a factor of <MathJax inline>{'\\(\\frac{1}{8}\\)'}</MathJax> and when we double the side length the area is multiplied by 8, or <MathJax inline>{'\\(2^3\\)'}</MathJax>. You might be noticing a few things. For one, the power we&apos;re raising the scaling factor to is always equal to the dimension.<br /><br />

                        For a shape of side length <MathJax inline>{'\\(\\varepsilon\\)'}</MathJax>, if it is scaled, its volume is always some proportion of <MathJax inline>{'\\(\\varepsilon^d \\)'}</MathJax> times the original, where <MathJax inline>{'\\(d\\)'}</MathJax> is the dimension. Now let&apos;s say we have an irregular object, like a maple leaf. Let&apos;s say we want to generalize this idea of slicing it up into boxes to that. So we cut a set <MathJax inline>{'\\(S\\)'}</MathJax> representing an object into boxes. We can overlay boxes of different side lengths <MathJax inline>{'\\(\\varepsilon\\)'}</MathJax> on the shape, count how many boxes are occupied by a part of the shape, which we&apos;ll denote as a function: <MathJax inline>{'\\(N_\\varepsilon(S)\\)'}</MathJax>. The ratio of the number of boxes we count (area) to the side length of those boxes, which will follow the relationship: <br />

                        <MathJax inline>{`\\(\\begin{align*}
                            N_\\varepsilon(S) \\approx k\\left(\\frac{1}{\\varepsilon}\\right)^d
                        \\end{align*}\\)`}</MathJax>, as <MathJax inline>{'\\(\\varepsilon\\)'}</MathJax> approaches 0, for a dimension <MathJax inline>{'\\(d\\)'}</MathJax> and proportionality constant <MathJax inline>{'\\(k\\)'}</MathJax>. So say we want to find <MathJax inline>{'\\(d\\)'}</MathJax>.<br />
                        
                        But something is raised to the power <MathJax inline>{'\\(d\\)'}</MathJax>! Taking logarithms simplifies this to the following: <br />

                        <MathJax inline>{`\\(\\begin{align*}
                            \\log N_\\varepsilon(S) = \\log k + d \\log \\frac{1}{\\varepsilon}
                        \\end{align*}\\)`}</MathJax>, as <MathJax inline>{`\\(\\varepsilon \\to 0\\)`}</MathJax>. <br />

                        We can write this another way as a limit, and since <MathJax inline>{'\\(k\\)'}</MathJax> is a proportionality constant it drops out:

                        <MathJax>{`\\(\\begin{align*}
                            d=\\lim_{\\varepsilon\\to0} \\frac{\\log{N_\\varepsilon(S)}}{\\log{\\frac{1}{\\varepsilon}}} 
                        \\end{align*}\\)`}</MathJax><br />

                        We don&apos;t just have to use boxes, we can use literally any shape we want. We can use circles, clouds, whatever, and we&apos;ll always get the same answer. The beautiful thing about this is that it also can describe roughness. So we finally get to the definition of fractal, as is most commonly accepted today. A fractal is a geometric object with a <u>non-integer dimension</u>. The classic example of fractal dimension is the coast of the UK, which by this definition is approximately 1.21-dimensional. And some attractors have a non-integer fractal dimension as well; we call them "strange", which I think is a bit rude.
                    </p>
                </div>
                <h2 className="section-header">An Example: The Clifford Attractor</h2>
                <p>
                    The Clifford attractor is a discrete-time dynamical system given by the following recurrence relation in two variables with four free parameters <MathJax inline>{'\\(\\alpha, \\beta, \\gamma, \\delta \\in \\mathbb{R}\\)'}</MathJax>:<br />

                    <MathJax>{`\\(\\begin{align*}\\begin{cases}
                            x_{n + 1} = \\sin(\\alpha y_n) + \\gamma \\cos(\\alpha x_n) \\\\
                            y_{n + 1} = \\sin(\\beta x_n) + \\delta \\cos(\\beta y_n)
                    \\end{cases}\\end{align*}\\)`}</MathJax><br />

		            I&apos;ve included an interactive applet below. The applet starts with a random initial condition, then repeatedly apply the map to that initial point and plot the iterates, giving the attractor you see. The reason I selected it is because I think it demonstrates the principles I described quite well. The system doesn&apos;t always have a positive Lyapunov exponent; sometimes it converges to a single point or a limit cycle. If that is the case, just change the parameters.
                </p>

                <AttractorApplet />

                <h2 className="section-header">Closing Thoughts</h2>
                <p>
                    I find this all amazing, and I hope this enlightened you. It&apos;s all so complex, but that&apos;s because it&apos;s a complicated topic and I&apos;m still figuring it out myself. Differential equations are such a difficult concept, which is why I much prefer discrete attractors and maps. Well anyway, thanks for reading, and I doubt I&apos;ll make a video on this because of how complex this is. I really enjoyed learning about this and making the Clifford attractor demo.
                </p>

                <h3>Resources</h3>
                <p>
                    Here is a list of helpful sites I used to understand these concepts and that might help you too:
                </p>
                <ol>
                    <li><a target="_blank" rel="noopener noreferrer" href="http://www.math.stonybrook.edu/~scott/Book331/Fractal_Dimension.html">Fractal Dimension</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://users.math.yale.edu/public_html/People/frame/Fractals/FracAndDim/BoxDim/BoxDim.html">More on Fractal Dimension</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://math.libretexts.org/Bookshelves/Scientific_Computing_Simulations_and_Modeling/Book%3A_Introduction_to_the_Modeling_and_Analysis_of_Complex_Systems_(Sayama)/09%3A_Chaos/9.03%3A_Lyapunov_Exponent">Lyapunov Exponent</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://hypertextbook.com/chaos/lyapunov-1/">More on the Lyapunov Exponent</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://brilliant.org/wiki/chaos-theory/">Chaos Theory Basics</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://mathworld.wolfram.com/Attractor.html">Wolfram MathWorld on Attractors</a></li>
                </ol>
        </ArticleLayout>
    </>);
}

export default ChaosTheoryArticle;