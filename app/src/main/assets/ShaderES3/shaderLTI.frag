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

float iDepthValue;

//in vec2 texCoordVarying;

layout(location = 0) out vec4 outputColor;

vec4 ReadViewColor(vec2 ImagePos) {
    vec2 Pos = vec2((ImagePos.x) / (HorizPixelNum), (ImagePos.y) / (VertPixelNum));
    return texture(inDepthMat, Pos);;
}

vec4 frag(vec2 i)
{
    vec4 outcolor = vec4( 0.0f, 0.0f, 0.0f, 0.0f);
    vec2 tmp_5 = vec2(max(0.5f, i.x - 5.0f), i.y);
    vec2 tmp_4 = vec2(max(0.5f, i.x - 4.0f), i.y);
    vec2 tmp_3 = vec2(max(0.5f, i.x - 3.0f), i.y);
    vec2 tmp_2 = vec2(max(0.5f, i.x - 2.0f), i.y);
    vec2 tmp_1 = vec2(max(0.5f, i.x - 1.0f), i.y);
    vec2 tmp0  = vec2(                  i.x, i.y);
    vec2 tmp1  = vec2(min(HorizPixelNum -0.5f, i.x + 1.0f), i.y);
    vec2 tmp2  = vec2(min(HorizPixelNum -0.5f, i.x + 2.0f), i.y);
    vec2 tmp3  = vec2(min(HorizPixelNum -0.5f, i.x + 3.0f), i.y);
    vec2 tmp4  = vec2(min(HorizPixelNum -0.5f, i.x + 4.0f), i.y);
    vec2 tmp5  = vec2(min(HorizPixelNum -0.5f, i.x + 5.0f), i.y);

    int ACValue = int((ReadViewColor(tmp_5.xy).r + ReadViewColor(tmp5.xy).r) * 255.0f) * (-1) +
                    int((ReadViewColor(tmp_4.xy).r + ReadViewColor(tmp4.xy).r) * 255.0f) * (-9) +
                    int((ReadViewColor(tmp_3.xy).r + ReadViewColor(tmp3.xy).r) * 255.0f) * (-16) +
                    int((ReadViewColor(tmp_2.xy).r + ReadViewColor(tmp2.xy).r) * 255.0f) * (-7) +
                    int((ReadViewColor(tmp_1.xy).r + ReadViewColor(tmp1.xy).r) * 255.0f) * (17) +
                    int(ReadViewColor(tmp0.xy).r * 255.0f) * (32);

    ACValue = max(0, (ACValue>>3) - 10);

    int DispValue = (int(ReadViewColor(tmp0).r * 255.0f) + ACValue);

    float maxClip = max(
                        max(
                            max(
                                max(
                                    max(
                                        ReadViewColor(tmp_5.xy).r, ReadViewColor(tmp_4.xy).r
                                        ),ReadViewColor(tmp_3.xy).r
                                    ),ReadViewColor(tmp_2.xy).r
                                ),ReadViewColor(tmp_1.xy).r
                            ),ReadViewColor(tmp0.xy).r
                        );

    maxClip = max(
                  max(
                      max(
                          max(
                              max(
                                  maxClip, ReadViewColor(tmp5.xy).r
                                  ),ReadViewColor(tmp4.xy).r
                              ),ReadViewColor(tmp3.xy).r
                          ),ReadViewColor(tmp2.xy).r
                      ),ReadViewColor(tmp1.xy).r
                  );

    float minClip = min(
                        min(
                            min(
                                min(
                                    min(
                                        ReadViewColor(tmp_5.xy).r, ReadViewColor(tmp_4.xy).r
                                        ),ReadViewColor(tmp_3.xy).r
                                    ),ReadViewColor(tmp_2.xy).r
                                ),ReadViewColor(tmp_1.xy).r
                            ),ReadViewColor(tmp0.xy).r
                        );

    minClip = min(
                  min(
                      min(
                          min(
                              min(
                                  minClip, ReadViewColor(tmp5.xy).r
                                  ),ReadViewColor(tmp4.xy).r
                              ),ReadViewColor(tmp3.xy).r
                          ),ReadViewColor(tmp2.xy).r
                      ),ReadViewColor(tmp1.xy).r
                  );

    float DispFinalValue = float(
                                 min(
                                     max(
                                         minClip, float(DispValue)/255.0f
                                         ),maxClip
                                     )
                                 );


    outcolor = vec4(DispFinalValue, 0.0f, 0.0f, 0.0f);

    return outcolor;
}

void main()
{
    vec2 tmp = vec2(gl_FragCoord.x, gl_FragCoord.y);
    outputColor =frag(tmp);
}
