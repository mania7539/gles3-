#version 300 es

#ifdef GL_ES
// define default precision for float, vec, mat.
precision highp float;
precision highp sampler2D;
precision highp int;
#endif

uniform sampler2D LeftColorMat;
uniform sampler2D LeftDispMat;
uniform float DispWarpRatio;
uniform float HorizPixelNum;
uniform float VertPixelNum;
uniform float iDispZero;
uniform int iRangePos;
uniform int iRangeNeg;

float iPosXNew;
float iPosXNewBound;
float iPosWarp;
float iDispMax;
float iDispNew;

in vec2 texCoordVarying;

layout(location = 0) out vec4 outputColor;


vec4 ReadColorMat(vec2 ImagePos) {
    vec2 Pos = vec2((ImagePos.x) / (HorizPixelNum), (ImagePos.y) / (VertPixelNum));
    return texture(LeftColorMat, Pos);
}

vec4 ReadDispMat(vec2 ImagePos) {
    vec2 Pos = vec2((ImagePos.x) / (HorizPixelNum), (ImagePos.y) / (VertPixelNum));
    return texture(LeftDispMat, Pos);
}

vec4 frag(vec2 i) {
    
    iDispMax = -256.0f;
    
    vec4 outcolor = vec4( 0.0f, 0.0f, 0.0f, 0.0f);
    
    for (int x = - iRangeNeg; x <= iRangePos; x++)
    {
        iPosXNew = float(x) + i.x - 0.5f;
        
        if (iPosXNew < 0.0f)
        {
            iPosXNewBound = -iPosXNew;
        }
        else if (iPosXNew >= HorizPixelNum)
        {
            iPosXNewBound = HorizPixelNum - (iPosXNew - HorizPixelNum) - 1.0f;
        }
        else
        {
            iPosXNewBound = iPosXNew;
        }
        
        vec2 tmp = vec2(iPosXNewBound + 0.5f, i.y);

        iDispNew = floor( (ReadDispMat(tmp).r* 255.0f - iDispZero)* DispWarpRatio + 0.5f );

        
        iPosWarp = iPosXNew - iDispNew;
        
        if ( iPosWarp > 0.0f && iPosWarp < HorizPixelNum)
        {
            if (DispWarpRatio < 0.0f)
            {
                iDispNew *= -1.0f;
            }
            
            if ( iPosWarp == i.x - 0.5f )
            {
                if (iDispNew >= iDispMax)
                {
                    iDispMax = iDispNew ;
                    outcolor.rgb = ReadColorMat(tmp).rgb;
                    outcolor.a = (iDispMax +256.0f )/ 512.0f;
                }
            }
        }
    }
    return outcolor;
}

void main()
{
    vec2 tmp = vec2(gl_FragCoord.x, gl_FragCoord.y);
    outputColor = frag(tmp.xy);
}
