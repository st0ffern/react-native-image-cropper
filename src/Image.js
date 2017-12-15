import GL from "gl-react";
import React from "react";
import rectCrop from "rect-crop";
import rectClamp from "rect-clamp";
import PropTypes from 'prop-types';

const shaders = GL.Shaders.create({
  image: {
    frag: `
precision highp float;
varying vec2 uv;
uniform sampler2D t;
uniform vec4 crop;
vec2 invert (vec2 p) {${""/* y is reversed in gl context */}
  return vec2(p.x, 1.0-p.y);
}
void main () {
  vec2 p = invert(invert(uv) * crop.zw + crop.xy);
  gl_FragColor =
    step(0.0, p.x) *
    step(0.0, p.y) *
    step(p.x, 1.0) *
    step(p.y, 1.0) *
    texture2D(t, p);
}`
  }
});

const Image = GL.createComponent(
({
  width,
  height,
  source,
  imageSize,
  resizeMode = "cover",
  center,
  zoom,
}) => {
  if (!imageSize) {
    if (source.width && source.height) {
      imageSize = { width: source.width, height: source.height };
    }
    else {
      throw new Error("gl-rect-image: imageSize is required if you don't provide {width,height} in source");
    }
  }
  let crop;
  switch (resizeMode) {
  case "cover": {
    if (!center) center = [ 0.5, 0.5 ];
    if (!zoom) zoom = 1;
    let rect = rectCrop(zoom, center)({ width, height }, imageSize);
    rect = rectClamp(rect, [ 0, 0, imageSize.width, imageSize.height ]);
    crop = [
      rect[0] / imageSize.width,
      rect[1] / imageSize.height,
      rect[2] / imageSize.width,
      rect[3] / imageSize.height
    ];
    break;
  }
  case "contain": {
    if (center || zoom) {
      console.warn("gl-react-image: center and zoom props are only supported with resizeMode='cover'");
    }
    const ratio = width / height;
    const imageRatio = imageSize.width / imageSize.height;
    crop =
      ratio > imageRatio
      ? [ (1 - ratio / imageRatio) / 2, 0, ratio / imageRatio, 1 ]
      : [ 0, (1 - imageRatio / ratio) / 2, 1, imageRatio / ratio ];
    break;
  }
  case "stretch":
    if (center || zoom) {
      console.warn("gl-react-image: center and zoom props are only supported with resizeMode='cover'");
    }
    crop = [ 0, 0, 1, 1 ];
    break;

  default:
    throw new Error("gl-react-image: unknown resizeMode="+resizeMode);
  }

  return <GL.Node
    shader={shaders.image}
    uniforms={{
      t: source,
      crop,
    }}
  />;
},
  {
    displayName: "Image",
    propTypes: {
      source: PropTypes.any.isRequired,
      imageSize: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }),
      resizeMode: PropTypes.string,
    }
  });

module.exports ={
  Image,
}