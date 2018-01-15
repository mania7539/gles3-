#version 300 es

#ifdef GL_ES
// define default precision for float, vec, mat.
precision highp float;
precision highp sampler2D;
precision highp int;
#endif

uniform sampler2D inColorMat;
uniform float HorizPixelNum;
uniform float VertPixelNum;

//in vec2 texCoordVarying;

layout(location = 0) out vec4 outputColor;

vec4 ReadViewColor(vec2 ImagePos) {
    vec2 Pos = vec2((ImagePos.x) / (HorizPixelNum), (ImagePos.y) / (VertPixelNum));
    return texture(inColorMat, Pos);
}

vec4 frag(vec2 i)
{
    vec4 outcolor = vec4( 0.0f, 0.0f, 0.0f, 0.0f);
    outcolor = ReadViewColor(i.xy);
    return outcolor;
}

void main()
{
    vec2 tmp = vec2(gl_FragCoord.x, gl_FragCoord.y);
    outputColor =frag(tmp);
}
