#version 300 es

#ifdef GL_ES
// define default precision for float, vec, mat.
precision highp float;
precision highp sampler2D;
precision highp int;
#endif

uniform sampler2D goldenMat;
uniform sampler2D testMat;
uniform float HorizPixelNum;
uniform float VertPixelNum;

in vec2 texCoordVarying;

layout(location = 0) out vec4 outputColor;

vec4 ReadViewColor(int View, vec2 ImagePos) {
    vec4 Color;
    
    vec2 Pos;
    Pos.x = (ImagePos.x) / (HorizPixelNum);
    Pos.y = (ImagePos.y) / (VertPixelNum);
    
    if (View == 0)
    {
        Color = texture(goldenMat, Pos);
    }
    else
    {
        Color = texture(testMat, Pos);
    }
    return Color;
}

vec4 frag(vec2 i) {
    
    vec4 outcolor = vec4( 0.0f, 0.0f, 0.0f, 0.0f);
    
//    if( abs(ReadViewColor(1, i).r - ReadViewColor(0, i).r) > 0.0f && abs(ReadViewColor(1, i).r - ReadViewColor(0, i).r) < 0.01f){
//        outcolor.r = 0.0f;
//        outcolor.g = 1.0f;
//        outcolor.b = 0.0f;
//        outcolor.a = 0.0f;
//    }
//    else if(abs(ReadViewColor(1, i).r - ReadViewColor(0, i).r) > 0.01f)
//    {
//        outcolor.r = 0.0f;
//        outcolor.g = 0.0f;
//        outcolor.b = 1.0f;
//        outcolor.a = 0.0f;
//    }
//    else{
//        outcolor.r = 1.0f;
//        outcolor.g = 0.0f;
//        outcolor.b = 0.0f;
//        outcolor.a = 0.0f;
//    }
    
//    if(ReadViewColor(0, i).rgb == ReadViewColor(1, i).rgb)
//    {
//        outcolor.r = 1.0f;
//        outcolor.g = 0.0f;
//        outcolor.b = 0.0f;
//        outcolor.a = 0.0f;
//    };
    if( ReadViewColor(0, i).rgb == ReadViewColor(1, i).rgb)
    {
        outcolor.r = 1.0f;
        outcolor.g = 0.0f;
        outcolor.b = 0.0f;
        outcolor.a = 0.0f;
    }
//    else{
//        //outcolor = ReadViewColor(0, i).aaaa;
//    }
    ;
    return outcolor;
}
void main()
{
    vec2 tmp = vec2(gl_FragCoord.x, gl_FragCoord.y);
    outputColor = frag(tmp);
}

