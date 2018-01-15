#version 300 es

#ifdef GL_ES
// define default precision for float, vec, mat.
precision highp float;
precision highp sampler2D;
precision highp int;
#endif

layout(location = 0) in vec4 position;
in vec2 texcoord;

out highp vec2 texCoordVarying;

void main()
{
    // ES need to transform coordinate for to meet the usage of shader.frag
    texCoordVarying = vec2(texcoord.x, texcoord.y);
    gl_Position = position;
}
