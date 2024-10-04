/**
 * This is the rhombic triacontahedron stellation demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useRef, useCallback } from 'react';
import { Select } from 'antd';

import { Vector3, WebGLRenderer, Scene, PerspectiveCamera, MeshNormalMaterial,
         Mesh, DoubleSide, BufferGeometry, BufferAttribute } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { facetVerts, matrices, facets, stellations } from './triacontahedron_data';
import { CanvasDemo } from '../../components/demos/demos';
import Accordion from '../../components/accordion/Accordion';

import './stellation-demo.css';
import diagram from './diagram.png';

// Stellation displayed on load
const firstStellation = 107;

// The actual demo
function StellationDemo() {
    // Canvas and renderer
    const canvasRef = useRef(null);
    const renderer = useRef(null);
    const scene = useRef(null);

    // Camera and orbit controls
    const camera = useRef(null);
    const orbitCtrls = useRef(null);

    // Vertices and geometry
    const mesh = useRef(null);
    const vertices = useRef(null);

    // Scale info
    const sclInfo = useRef(null);
    const isMobile = useRef(false);

    // Animation frame
    const frameRef = useRef(null);

    /*
    Building the stellation mesh.
    */

    const addPolygon = useCallback((verts) => {
        // Adds a polygon, triangulating if need be
        for (let i = 1; i < verts.length - 1; i ++) {
            vertices.current.push(
                ...verts[0],
                ...verts[i],
                ...verts[i + 1]);
        }
    }, []);

    const addFacet = useCallback((indices) => {
        for (let mat of matrices) {
            // Get transformed vertices
            let tranVerts = [];
            for (let i of indices) {
                let v = facetVerts[i].mulMatrix(mat);
                tranVerts.push([v.x, v.y, v.z]);
            }

            // Add polygon
            addPolygon(tranVerts);
        }
    }, [addPolygon]);

    const makeStellation = useCallback((num) => {
        vertices.current = [];

        // Get facets with given types and chiralities
        let stelFacets = stellations[num].facets;
        let nFacets, matchingFacets = [];
        for (let facet of stelFacets) {
            if (facet[0] === "L" || facet[0] === "R") {
                nFacets = facets.filter(f => (
                    f.type === facet.substring(1) && 
                    f.chirality === facet[0]));
            } else {
                nFacets = facets.filter(f => f.type === facet);
            }
            matchingFacets = matchingFacets.concat(nFacets);
        }

        // Add facets to mesh
        for (let facet of matchingFacets) {
            addFacet(facet.indices);
        }

        // Create geometry
        let geom = new BufferGeometry();
        let arr = new Float32Array(vertices.current);

        geom.setAttribute("position", new BufferAttribute(arr, 3));
        geom.computeVertexNormals();
        
        // Add (or update) mesh with geometry
        if (!mesh.current) {
            let mat = new MeshNormalMaterial({side: DoubleSide});
            mesh.current = new Mesh(geom, mat);
            scene.current.add(mesh.current);
        } else {
            mesh.current.geometry.dispose();
            mesh.current.geometry = geom;
        }
    }, [addFacet]);  

    /*
    Animation loop.
    */

    const mainLoop = useCallback(() => {
        // Main rendering loop
        renderer.current.render(scene.current, camera.current);
        frameRef.current = requestAnimationFrame(mainLoop);
    }, []);
    
    const startLoop = useCallback(() => {
        // Starts the animation frame loop
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [mainLoop]);

    const stopLoop = useCallback(() => {
        // Stops the animation loop
        cancelAnimationFrame(frameRef.current);
    }, []);

    /*
    Handling resizing.
    */

    const handleResize = useCallback((scl) => {
        // Check for undersized screens
        if (scl.isMobile) {
            stopLoop();
        } else if (isMobile.current) {
            startLoop();
        }
        isMobile.current = scl.isMobile;

        // Set scale and resize renderer
        sclInfo.current = scl;
        if (renderer.current) {
            renderer.current.setSize(scl.width, scl.height);
            camera.current.aspect = scl.aspect;
            camera.current.updateProjectionMatrix();
        }
    }, [startLoop, stopLoop]);

    /*
    Initializing the demo.
    */

    const initialize = useCallback(() => {
        // Create renderer and scene
        let scl = sclInfo.current;
        renderer.current = new WebGLRenderer({canvas: canvasRef.current, antialias: true});
        renderer.current.setPixelRatio(window.devicePixelRatio);
        renderer.current.setSize(scl.width, scl.height);
        renderer.current.setClearColor(0x121212);

        scene.current = new Scene();

        // Create camera and orbit controls
        camera.current = new PerspectiveCamera(45, scl.aspect, 1, 1000);
        orbitCtrls.current = new OrbitControls(camera.current, canvasRef.current);

        camera.current.position.set(0, 9, 11);
        camera.current.lookAt(new Vector3(0, 0, 0));
        orbitCtrls.current.update();

        // Start loop
        makeStellation(firstStellation); 
        if (!isMobile.current) {
            startLoop();
        }
        return stopLoop;
    }, [makeStellation, startLoop, stopLoop]);

    return (<>
        <title>Stellations | Zenzicubic</title>
        <CanvasDemo title="Stellations" canvasRef={canvasRef} onInitialize={initialize} onResize={handleResize}>
            <p>This is an interactive demo of the 227 fully supported <a href="https://en.wikipedia.org/wiki/Stellation#Stellating_polyhedra" target="_blank" rel="noopener noreferrer">stellations</a> of the rhombic triacontahedron.</p>

            <Accordion sections={[
                {title: "What is this?", content: <p>
                    Stellation is a geometric process in which all of a polyhedron&apos;s faces are extended outward until they intersect again. These new intersections create volumes called &quot;cells&quot;. We can visualize these intersections as lines in the plane of one of the polyhedron&apos;s faces. This pattern is called a stellation diagram:<br />

                    <img src={diagram} id="interstitial-img"
                        alt="Stellation diagram for rhombic triacontahedron"/><br />

                    This particular stellation diagram is the diagram for the <a href="https://en.wikipedia.org/wiki/Rhombic_triacontahedron" target="_blank" rel="noopener noreferrer">rhombic triacontahedron</a>, a 30-sided polyhedron with rhombic faces and icosahedral symmetry. Each of the polygons in this diagram, knowwn as &quot;facets&quot; may or may not be filled in, and the faces of the original polyhedron are replaced with the stellation diagram to create stellations of this polyhedron. The polygons in the stellation diagram thus become the faces of the cells in the stellation.<br /><br />

                    Generally, only arrangements of these polygons are chosen such that the resulting stellations have the same symmetries (either rotational or reflectional) as the original solid, and all of the cells in the stellation are of finite volume. Stellations with only rotational symmetry are called &quot;chiral&quot;, and have multiple forms which cannot be superposed, a bit like your left and right hands. Stellations not possessing this property are referred to as &quot;achiral&quot;. 112 of the stellations shown here are chiral, and the other 115 are achiral.<br /><br />

                    For the rhombic triacontahedron, this gives 358 million different stellations. Here, a further condition is applied to reduce this number to a more reasonable 227: only stellations which have a distinct inside and outside are considered. That is to say that only one of the sides of each face is exposed. These stellations are called &quot;fully supported&quot;.<br /><br />

                    The paper <a href="https://www.researchgate.net/publication/265206552_Stellations_of_the_Rhombic_Triacontahedron_and_Beyond"  target="_blank" rel="noopener noreferrer">&quot;Stellations of the Rhombic Triacontahedron and Beyond&quot;</a> enumerates the 227 such fully supported stellations of the rhombic triacontahedron, and describes a notation for describing them based on stellation cells. This paper helped me quite a lot to write this demo.
                </p>},
                {title: "How do I use this?", content: <p>
                    Click and drag to rotate. Scroll or pinch to zoom. To select a stellation, use the selection dropdown. Stellations are named using the cell-based notation described in the paper mentioned above. If the stellation is chiral, its name will be <i>italicized</i>. For chiral stellations, one enantiomorph each is displayed. If the stellation is known by another name, this other name will be displayed in parentheses after the stellation symbol.
                </p>}
            ]} />
            <hr />

            <p>Stellation</p>
            <Select options={stellations.map((stel, i) => ({
                    label: (stel.chiral ? <i>{stel.name}</i> : stel.name),
                    value: i
                }))} onChange={(val) => makeStellation(val)} 
                virtual={false} defaultValue={firstStellation} />
        </CanvasDemo>
    </>);
}

export default StellationDemo;