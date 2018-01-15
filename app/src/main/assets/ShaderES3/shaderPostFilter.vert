#version 300 es

#ifdef GL_ES
// define default precision for float, vec, mat.
precision highp float;
precision highp sampler2D;
precision highp int;
#endif

layout(location = 0) in vec4 position;

in vec2 texcoord;
in vec4 normal;
in vec4 color;

out highp vec2 texCoordVarying;

void main()
{
    
    #ifdef INTEL_CARD
        color = vec4(1.0); // for intel HD cards
        normal = vec4(1.0); // for intel HD cards
    #endif
    
    // ES need to transform coordinate for to meet the usage of shader.frag
    texCoordVarying = texcoord;
    gl_Position = position;
}
