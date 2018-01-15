#version 300 es

#ifdef GL_ES
// define default precision for float, vec, mat.
precision highp float;
precision highp sampler2D;
precision highp int;
#endif

uniform sampler2D inColorDepthMat;

uniform float iNegInit;
uniform float HorizPixelNum;
uniform float VertPixelNum;

int iHoleCnt;
float iDepthValue;

in vec2 texCoordVarying;

layout(location = 0) out vec4 outputColor;

vec4 ReadViewColor(vec2 ImagePos) {
    vec2 Pos = vec2((ImagePos.x) / (HorizPixelNum), (ImagePos.y) / (VertPixelNum));
    return texture(inColorDepthMat, Pos);;
}

vec4 frag(vec2 i)
{
    vec4 outcolor = vec4( 0.0f, 0.0f, 0.0f, 0.0f);
    iHoleCnt = 0;
    for (int y = -1; y <= 1; y++)
    {
        for (int x = -1; x <= 1; x++)
        {            
            float xi = max( 0.5f, min( i.x + float(x), HorizPixelNum - 0.5f) );
            float yi = max( 0.5f, min( i.y + float(y), VertPixelNum - 0.5f) );
            
            vec2 tmp = vec2(xi , yi);

            iDepthValue = ReadViewColor(tmp).a;
                
            if (iDepthValue == iNegInit){
                iHoleCnt++;
            }
        }
    }
        
    if (iHoleCnt >= 5){
        outcolor.a = iNegInit;
        outcolor.rgb = ReadViewColor(i).rgb;
    }else{
        outcolor = ReadViewColor(i);
    }
    
    return outcolor;
}

void main()
{
    vec2 tmp = vec2(gl_FragCoord.x, gl_FragCoord.y);
    outputColor = frag(tmp);

}



