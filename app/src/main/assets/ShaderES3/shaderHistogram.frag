#version 300 es

#ifdef GL_ES
// define default precision for float, vec, mat.
precision highp float;
precision highp sampler2D;
precision highp int;
#endif

//const lowp float scalingFactor = 1.0 / 256.0;

//in lowp vec3 colorFactor;

layout(location = 0) out vec4 outputColor;

void main()
{
    //outputColor = vec4( 1.0, 1.0, 1.0, 1.0);
    outputColor = vec4( 0.5, 0.0, 0.0, 1.0);
}
