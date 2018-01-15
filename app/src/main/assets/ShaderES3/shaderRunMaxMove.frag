#version 300 es

#ifdef GL_ES
// define default precision for float, vec, mat.
precision highp float;
precision highp sampler2D;
precision highp int;
#endif

uniform sampler2D inDepthMat;
uniform float HorizPixelNum;
uniform float VertPixelNum;
//in vec2 texCoordVarying;

layout(location = 0) out vec4 outputColor;

vec4 ReadViewColor(vec2 ImagePos) {
    vec2 Pos = vec2((ImagePos.x) / (HorizPixelNum), (ImagePos.y) / (VertPixelNum));
    return texture(inDepthMat, Pos);
}

vec4 frag(vec2 i)
{
    vec4 outcolor  = vec4(0.0f, 0.0f, 0.0f, 0.0f);
    vec2 DispMap_2 = vec2(max(0.5f, i.x - 2.0f),i.y);
    vec2 DispMap_1 = vec2(max(0.5f, i.x - 1.0f),i.y);
    vec2 DispMap0  = vec2(                  i.x,i.y);
    vec2 DispMap1  = vec2(min(HorizPixelNum -0.5f , i.x + 1.0f),i.y);
    vec2 DispMap2  = vec2(min(HorizPixelNum -0.5f , i.x + 2.0f),i.y);
    
    float maxValue = max(
                         max(
                             max(
                                 max(
                                     ReadViewColor(DispMap_2).r,ReadViewColor(DispMap_1).r
                                     ),ReadViewColor(DispMap0).r
                                 ),ReadViewColor(DispMap1).r
                             ),ReadViewColor(DispMap2).r
                         );
    
    outcolor = vec4(maxValue, 0.0f, 0.0f, 0.0f);
    return outcolor;
}

void main()
{
    vec2 tmp = vec2(gl_FragCoord.x, gl_FragCoord.y);
    outputColor = frag(tmp);
}

