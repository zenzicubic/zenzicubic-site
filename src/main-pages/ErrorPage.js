/**
 * This is the 404 error page component.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { Link } from 'react-router-dom';

import FrontPageLayout from './FrontPageLayout';
import bgImg from '../images/404_bg.png';

function ErrorPage() {
    return (
        <>
            <title>404! | Zenzicubic</title>
            <FrontPageLayout img={bgImg}>
                <h1>Oh no!</h1>
                <p>
                    Unfortunately I couldn't find that page. Check your spelling and try again.<br />
                    <Link to="/">Click here</Link> to go back to this website&apos;s homepage.
                </p>
            </FrontPageLayout>
        </>
    );
}

export default ErrorPage;