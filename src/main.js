import * as THREE from "three";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextureLayer } from "./components/texture-layer";
import styles from "./stylesheets/main.scss";
import { TextureGroup } from "./components/texture-group";
import gb from "../includes/models/separated/hubs_model_short_messy.glb";
import { LabeledTexture } from "./labeled-texture";

import skin from "../includes/textures/skin_default.png";
import blush from "../includes/textures/blush_default.png";
import eyes from "../includes/textures/eyes_default.png";
import eyes_black from "../includes/textures/eyes_black.png";
import eyebrows from "../includes/textures/eyebrows_default.png";
import jacket from "../includes/textures/jacket_default.png";
import shirt from "../includes/textures/shirt_default.png";
import hair from "../includes/textures/hair_default.png";

import duck from "../includes/textures/logo_front/duck.png";
import ae from "../includes/textures/logo_front/ae.png";
import gt from "../includes/textures/logo_front/gt.png";

import skinLayout from "../includes/textures/layouts/skin_layout.png";
import topLayout from "../includes/textures/layouts/top_layout.png";
import eyebrowsLayout from "../includes/textures/layouts/eyebrows_layout.png";
import eyesLayout from "../includes/textures/layouts/eyes_layout.png";
import hairLayout from "../includes/textures/layouts/hair_layout.png";

import Material from "./components/material"

import {Editor} from "./components/editor"
import {RadioButton} from "./components/buttons"

const TEXTURES = "../includes/textures/";

function applyExtenstions() {
  THREE.Color.prototype.getHexStringFull = function getHexStringFull() {
    return "#" + this.getHexString();
  };

  THREE.Color.prototype.randomize = function randomize() {
    this.setHex(Math.random() * 0xffffff);
    return this;
  };
  THREE.Color.prototype.createRandom = function createRandomColor() {
    return new THREE.Color().randomize();
  };
}

async function init() {
  applyExtenstions();

  const size = {
    width: 500,
    height: 400
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(size.width, size.height);
  document.getElementById("container").prepend(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;

  // ambient
  scene.add(new THREE.AmbientLight(0xffffff));

  // light
  camera.position.set(0, 15, 20);
  camera.matrixAutoUpdate = true;

  controls.target.set(0, 15, 0);
  controls.update();

  function render() {
    renderer.render(scene, camera);
  }

  const _loader = new GLTFLoader();
  var body = React.createRef();

  await _loader.load(
    gb,
    avatargltf => {
      avatargltf.scene.scale.x = 30;
      avatargltf.scene.scale.y = 30;
      avatargltf.scene.scale.z = 30;
      avatargltf.scene.traverse(node => {
        if (node.name == "Body") {
          ReactDOM.render(
            <>
            
            <Editor model={node}/>
            
            </>,
            document.getElementById("options")
          );

          scene.add(avatargltf.scene);
        }
      });

      setInterval(() => {
        render();
      }, 100);
    },
    undefined,
    e => {
      console.log(e);
    }
  );
}

window.onload = init;
