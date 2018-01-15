#version 300 es

#ifdef GL_ES
// define default precision for float, vec, mat.
precision highp float;
precision highp sampler2D;
precision highp int;
#endif

uniform sampler2D ColorTex15;

uniform float PanelHorizPixelNum;
uniform float PanelVertPixelNum;
uniform int PanelMode;
uniform int postFilterSwitch;
uniform float f1;
uniform float f2;
uniform float f3;
in vec2 texCoordVarying;

layout(location = 0) out vec4 outputColor;

void main()
{
    vec4 color = vec4(0.0,0.0,0.0,1.0);
    
    if (postFilterSwitch == 1){
        if (PanelMode == 0){
            color += f1 * texture(ColorTex15, texCoordVarying + vec2(0.0, 2.0/PanelVertPixelNum));
            color += f2 * texture(ColorTex15, texCoordVarying + vec2(0.0, 1.0/PanelVertPixelNum));
            color += f3 * texture(ColorTex15, texCoordVarying);
            color += f2 * texture(ColorTex15, texCoordVarying + vec2(0.0, -1.0/PanelVertPixelNum));
            color += f1 * texture(ColorTex15, texCoordVarying + vec2(0.0, -2.0/PanelVertPixelNum));
//            color += 3.0 * texture(ColorTex15, texCoordVarying + vec2(0.0, 2.0/PanelVertPixelNum));
//            color += (-20.0) * texture(ColorTex15, texCoordVarying + vec2(0.0, 1.0/PanelVertPixelNum));
//            color += 134.0 * texture(ColorTex15, texCoordVarying);
//            color += (-20.0) * texture(ColorTex15, texCoordVarying + vec2(0.0, -1.0/PanelVertPixelNum));
//            color += 3.0 * texture(ColorTex15, texCoordVarying + vec2(0.0, -2.0/PanelVertPixelNum));
        } else {
            color += f1 * texture(ColorTex15, texCoordVarying + vec2(2.0/PanelHorizPixelNum, 0.0));
            color += f2 * texture(ColorTex15, texCoordVarying + vec2(1.0/PanelHorizPixelNum, 0.0));
            color += f3 * texture(ColorTex15, texCoordVarying);
            color += f2 * texture(ColorTex15, texCoordVarying + vec2(-1.0/PanelHorizPixelNum, 0.0));
            color += f1 * texture(ColorTex15, texCoordVarying + vec2(-2.0/PanelHorizPixelNum, 0.0));
//            color += 3.0 * texture(ColorTex15, texCoordVarying + vec2(2.0/PanelHorizPixelNum, 0.0));
//            color += (-20.0) * texture(ColorTex15, texCoordVarying + vec2(1.0/PanelHorizPixelNum, 0.0));
//            color += 134.0 * texture(ColorTex15, texCoordVarying);
//            color += (-20.0) * texture(ColorTex15, texCoordVarying + vec2(-1.0/PanelHorizPixelNum, 0.0));
//            color += 3.0 * texture(ColorTex15, texCoordVarying + vec2(-2.0/PanelHorizPixelNum, 0.0));
        }
        
        color /= 100.0;
    } else {
        color = texture(ColorTex15, texCoordVarying);
    }
    
    outputColor = color;
}

