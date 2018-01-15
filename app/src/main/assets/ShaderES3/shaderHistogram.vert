#version 300 es

#ifdef GL_ES
// define default precision for float, vec, mat.
precision highp float;
precision highp sampler2D;
precision highp int;
#endif

//layout(location = 0) in vec3 inPosition;
//out highp vec3 colorFactor;
const vec3 W = vec3(0.299, 0.587, 0.114);
layout(location = 0) in vec4 position;

out lowp vec3  colorFactor;

void main()
{
    float luminance = dot(position.xyz, W);
    //colorFactor = vec3(0.0, 0.0, 1.0);
    gl_Position = vec4(-1.0 + (luminance * 0.0078125), 0.0, 0.0, 1.0);
    gl_PointSize = 100.0;
    
    //gl_Position = position;//vec4(position.x, position.y, position.z, 1.0);
}


