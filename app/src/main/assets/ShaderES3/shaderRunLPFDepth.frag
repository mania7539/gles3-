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
uniform float DispWarpRatio;

float iSize = 5.0f ;
int iTotalNum = 25;//iSize * iSize;
int iRange = 2;//(iSize - 1.0) / 2.0;

vec3 ColorBlockMat[25];
float DepthBlockMat[25];

int index;
float iDepthValue;

int iRangeXNeg;
int iRangeXPos;

in vec2 texCoordVarying;

layout(location = 0) out vec4 outputColor;

vec4 ReadViewColor(vec2 ImagePos) {
    vec2 Pos = vec2((ImagePos.x) / (HorizPixelNum), (ImagePos.y) / (VertPixelNum));
    return texture(inColorDepthMat, Pos);
}


vec4 frag(vec2 i)
{
    
    vec4 outcolor = vec4( 0.0f, 0.0f, 0.0f, 0.0f );

    iDepthValue = ReadViewColor(i).a;
    if (iDepthValue != iNegInit)
    {
        outcolor.a = iDepthValue;
        outcolor.rgb = ReadViewColor(i).rgb;
    }
    else
    {
        index = 0;
        
        if (i.x-0.5f <= iSize || i.x-0.5f >= HorizPixelNum - iSize )
        {
            iRangeXNeg = iRange;
            iRangeXPos = iRange;
        }
        else if (DispWarpRatio >= 0.0f)
        {
            iRangeXNeg = 0;
            iRangeXPos = int(iSize) - 1;
        }
        else
        {
            iRangeXNeg = int(iSize) - 1;
            iRangeXPos = 0;
        }
        
        for (int y = - iRange; y <= iRange; y++)
        {
            for (int x = - iRangeXNeg; x <= iRangeXPos; x++)
            {
                
                float xi = max( 0.5f, min( i.x + float(x) , HorizPixelNum -0.5f) );
                float yi = max( 0.5f, min( i.y + float(y) , VertPixelNum  -0.5f) );
                
                vec2 tmp = vec2( xi, yi);

                iDepthValue = ReadViewColor(tmp).a;
                
                if (iDepthValue != iNegInit)
                {
                    DepthBlockMat[index] = iDepthValue;
                    ColorBlockMat[index] = ReadViewColor(tmp).rgb;
                    index++;
                }
            }
        }
        
        if (index == 0)
        {
            outcolor = ReadViewColor(i);
        }
        else
        {
            vec4 tmpcolor = vec4( 0.0f, 0.0f, 0.0f, 0.0f);

            for (int i = 0; i < index ; i++)
            {
                tmpcolor.r += ColorBlockMat[i].r;
                tmpcolor.g += ColorBlockMat[i].g;
                tmpcolor.b += ColorBlockMat[i].b;
                tmpcolor.a += DepthBlockMat[i];
            }

            outcolor.r =float( int(tmpcolor.r*255.0f) /(index) )/255.0f;
            outcolor.g =float( int(tmpcolor.g*255.0f) /(index) )/255.0f;
            outcolor.b =float( int(tmpcolor.b*255.0f) /(index) )/255.0f;
            outcolor.a =floor( tmpcolor.a*255.0f/float(index) +0.5f)/255.0f;
            //float( int(tmpcolor.a)        /(index) )/512.0f;
        }
    }
    return outcolor;
}


void main()
{
    vec2 tmp = vec2(gl_FragCoord.x, gl_FragCoord.y);
    
    outputColor = frag(tmp);
}

