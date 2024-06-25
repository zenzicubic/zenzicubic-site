/**
 * This is the article I wrote on the quadratic formula. 
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { MathJax } from 'better-react-mathjax';

import { ArticleLayout, ArticleImage } from '../components/article-components';
import problemImg1 from './sqr1.png';
import problemImg2 from './sqr2.png';
import problemImg3 from './sqr3.png';

function QuadraticFormulaArticle() {
    return (<>
        <title>Deriving the quadratic formula | Zenzicubic</title>
        <ArticleLayout
            title="Deriving the quadratic formula"
            date="6 June 2022">
                <p>
                    The quadratic formula is a classic formula in algebra, and one that gives any algebra student war flashbacks from trying to memorize it. Today I&apos;ll be explaining how it is derived.
                </p>

                <h2 className="section-header">Explanation and History</h2>
                
                <p>
                    This is a quadratic equation:

                    <MathJax>{`\\(\\begin{align*}
                            ax^2 + bx + c
                    \\end{align*}\\)`}</MathJax><br />

                    Quadratic equations are a type of polynomial. They appear in everything from biology to chemistry to the many fields of math, from number theory to algebra to complex analysis. But how can we solve them? Unlike most other simple equations you may know of, quadratics can&apos;t just be solved using basic math. Enter the quadratic formula:
                    
                    <MathJax>{`\\(\\begin{align*}
                            x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
                    \\end{align*}\\)`}</MathJax><br />

                    It can solve any quadratic equation. Just plug in the coefficients and constant term and chug. But how do we know that this formula can solve a quadratic?<br /><br />

                    The quadratic formula was first discovered in a slightly different form by the ancient Babylonians millenia ago. But why not earlier? The quadratic formula as we know it happens to be a bit difficult to derive. It involves a process called completing the square, which despite its use as an alternative method to solve quadratics, is rather unintuitive. However, a little bit of geometry can be used to explain it more clearly.
                </p>

                <h2 className="section-header">Derivation</h2>

                <div className="article-section">
                    <h3 className="subsection-header">First Steps</h3>
                    <p>
                        We begin our process with the prototypical quadratic equation:
                        <MathJax>{`\\(\\begin{align*}
                            ax^2 + bx + c = 0
                        \\end{align*}\\)`}</MathJax>

                        We want to find <MathJax inline>{'\\(x\\)'}</MathJax>. So the first thing I&apos;ll do is move the <MathJax inline>{'\\(c\\)'}</MathJax> to the other side:
                        <MathJax>{`\\(\\begin{align*}
                            ax^2 + bx = -c
                        \\end{align*}\\)`}</MathJax>
                        
                        Next, we divide the <MathJax inline>{'\\(a\\)'}</MathJax> out:
                        <MathJax>{`\\(\\begin{align*}
                            x^2 + \\frac{b}{a}x = -\\frac{c}{a}
                        \\end{align*}\\)`}</MathJax>
                    </p>
                    <h3 className="subsection-header">Completing the Square</h3>
                    <p>
                        Now, it&apos;s time to complete the square. I find that looking at what these problems tell us geometrically can help us solve them. So what I think of when I see this is a literal square with side length <MathJax inline>{'\\(a\\)'}</MathJax> and a <MathJax inline>{'\\(\\frac{b}{a}\\)'}</MathJax> by <MathJax inline>{'\\(x\\)'}</MathJax> rectangle:
                    </p>
                    <ArticleImage 
                        imgUrl={problemImg1} 
                        imgAlt="Visualizing the problem as rectangles and squares" 
                        imgDesc="A visual representation of the problem" />
                    <p>
                        We can then bisect the rectangle into two smaller <MathJax inline>{'\\(\\frac{b}{2a}\\)'}</MathJax> by <MathJax inline>{'\\(x\\)'}</MathJax> rectangles, which we then arrange around the sides of the <MathJax inline>{'\\(x\\)'}</MathJax> by <MathJax inline>{'\\(x\\)'}</MathJax> square:
                    </p>
                    <ArticleImage 
                        imgUrl={problemImg2} 
                        imgAlt="Cutting one of the rectangles in half" 
                        imgDesc="Cutting the rectangle in half" />
                    <p>
                        Consider that we haven&apos;t actually changed the values of each side, just rearranged them a bit. Now, we have an almost-square. It&apos;s missing a <MathJax inline>{'\\(\\frac{b}{2a}\\)'}</MathJax> by <MathJax inline>{'\\(\\frac{b}{2a}\\)'}</MathJax> square, which we can add. What we get when we add this square is a <MathJax inline>{'\\(x + \\frac{b}{2a}\\)'}</MathJax> by <MathJax inline>{'\\(x + \\frac{b}{2a}\\)'}</MathJax> square:
                    </p>
                    <ArticleImage 
                        imgUrl={problemImg3} 
                        imgAlt="Adding a new square to the previous diagram" 
                        imgDesc="Completing the square" />
                    <p>
                        ...which we can represent algebraically like this:
                        
                        <MathJax>{`\\(\\begin{align*}
                            \\left(x+\\frac{b}{2a}\\right)^2=\\frac{-c}{a}
                        \\end{align*}\\)`}</MathJax>

                        Remember, what happens on one side must happen on the other, so we add <MathJax inline>{'\\((\\frac{b}{2a})^2\\)'}</MathJax> to the other side.

                        <MathJax>{`\\(\\begin{align*}
                            \\left(x+\\frac{b}{2a}\\right)^2=\\frac{-c}{a}+\\left(\\frac{b}{2a}\\right)^2 
                        \\end{align*}\\)`}</MathJax>

                        For those that have no clue how that worked, I&apos;ll explain how I think of it. The <MathJax inline>{'\\(bx\\)'}</MathJax> in our slightly rearranged equation makes things difficult. We can&apos;t divide or multiply. We can&apos;t use radicals either. So what we do is rearrange the equation, which contains an <MathJax inline>{'\\(x\\)'}</MathJax> by <MathJax inline>{'\\(x\\)'}</MathJax> square and a <MathJax inline>{'\\(\\frac{b}{a}\\)'}</MathJax> by <MathJax inline>{'\\(x\\)'}</MathJax> rectangle. Conveniently for us, that rectangle has one side the same length as the square. So we cut it in half by the side with length <MathJax inline>{'\\(\\frac{b}{a}\\)'}</MathJax> and rearrange the skinny rectangles around the <MathJax inline>{'\\(x\\)'}</MathJax> by <MathJax inline>{'\\(x\\)'}</MathJax> square. What we get is something that&apos;s almost a square, both geometrically and algebraically. So we add in the missing piece (which is a <MathJax inline>{'\\(\\frac{b}{2a}\\)'}</MathJax> by <MathJax inline>{'\\(\\frac{b}{2a}\\)'}</MathJax> square) to &apos;complete the square&apos;, both geometrically and algebraically. We get one big square with dimensions <MathJax inline>{'\\(x + \\frac{b}{2a}\\)'}</MathJax> by <MathJax inline>{'\\(x + \\frac{b}{2a}\\)'}</MathJax>and an area of <MathJax inline>{'\\((x + \\frac{b}{2a})^2\\)'}</MathJax>. So we&apos;ve rearranged it into a form we can solve easily with radicals.
                    </p>
                    <h3 className="subsection-header">Final Steps</h3>
                    <p>
                        But back to the task at hand. Now, we can expand out the <MathJax inline>{'\\((x + \\frac{b}{2a})^2\\)'}</MathJax> on the right by distributing the exponent:

                        <MathJax>{`\\(\\begin{align*}
                            \\left(x+\\frac{b}{2a}\\right)^2=\\frac{-c}{a}+\\frac{b^2}{4a^2}
                        \\end{align*}\\)`}</MathJax>

                        Multiply the leftmost fraction on the right by <MathJax inline>{'\\(4a\\)'}</MathJax> so they have a common denominator, then add them:

                        <MathJax>{`\\(\\begin{align*}
                            \\left(x+\\frac{b}{2a}\\right)^2=\\frac{b^2-4ac}{4a^2}
                        \\end{align*}\\)`}</MathJax>

                        The top of this fraction should be looking pretty familiar right about now. Now, to continue isolating. We&apos;ll take the square root of both sides to isolate the left, giving us this:

                        <MathJax>{`\\(\\begin{align*}
                            x+\\frac{b}{2a}=\\pm\\frac{\\sqrt{b^2-4ac}}{2a}
                        \\end{align*}\\)`}</MathJax>

                        Why did I make it plus or minus? Consider that both a negative and a positive number can give a positive number when we square them. Also remember how we squared <MathJax inline>{'\\(2a\\)'}</MathJax>? We&apos;re taking the square root of the square, so they cancel out.<br />

                        So close! Now all we have to do is just subtract <MathJax inline>{'\\(\\frac{b}{2a}\\)'}</MathJax> from the left side:

                        <MathJax>{`\\(\\begin{align*}
                            x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}
                        \\end{align*}\\)`}</MathJax>

                        And there we have it! I hope this helps you understand your Algebra classes more.
                    </p>
                </div>

                <h2 className="section-header">Conclusion</h2>

                <p>
                    I think that doing these kinds of things in classes (learning not just HOW, but WHY) is very important, and this derivation surprised me at first because I had no idea that this was possible. It definitely helped me understand things like how the quadratic formula works and why we complete the square.
                </p>
        </ArticleLayout>
    </>);
}

export default QuadraticFormulaArticle;