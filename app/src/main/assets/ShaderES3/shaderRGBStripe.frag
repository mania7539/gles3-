#version 300 es

precision highp float;
precision highp int;
// platforms/es/uniforms.frag, platform uniforms ------------------------------------------------------------
// shared uniforms
uniform float PanelHorizPixelNum;
uniform float PanelVertPixelNum;
uniform float TextureHorizPixelNum;
uniform float TextureVertPixelNum;

uniform int PanelMode;
uniform int ViewNumber;

uniform float EffContentPitch;
uniform float LensDriftAngleRad;

// For scale and drag on mobile
uniform float ZoomScale;
uniform vec2 DragShift;

// other uniforms
uniform sampler2D ColorTex0;
uniform sampler2D ColorTex1;
uniform sampler2D ColorTex2;
uniform sampler2D ColorTex3;
uniform sampler2D ColorTex4;
uniform sampler2D ColorTex5;
uniform sampler2D ColorTex6;
uniform sampler2D ColorTex7;
uniform sampler2D ColorTex8;
uniform sampler2D ColorTex9;
uniform sampler2D ColorTex10;
uniform sampler2D ColorTex11;
uniform sampler2D ColorTex12;
uniform sampler2D ColorTex13;
uniform sampler2D ColorTex14;
uniform sampler2D ColorTex15;

in vec2 texCoordVarying;

layout(location = 0) out vec4 outputColor;

// shared/global_variables.frag, global variables ------------------------------------------------------------
vec2 panelPos;
vec2 texturePos;

float panelAspectRatio;
float imageAspectRatio;

// shared/calAspectRatio.frag ------------------------------------------------------------
void calAspectRatio(){
    panelAspectRatio = PanelVertPixelNum/PanelHorizPixelNum;
    imageAspectRatio = TextureVertPixelNum/TextureHorizPixelNum;
}

// platforms/es/calPanelPos.frag, panel position ------------------------------------------------------------
void calPanelPos(){
    if (PanelMode == 0){
        panelPos.x = float(texCoordVarying.x) * PanelHorizPixelNum;
        panelPos.y = float(texCoordVarying.y) * PanelVertPixelNum;
    } else {
        panelPos.x = - float(sign(PanelMode)) * float(texCoordVarying.y) * PanelVertPixelNum;
        panelPos.y = float(sign(PanelMode)) * float(texCoordVarying.x) * PanelHorizPixelNum;
    }
}

// platforms/es/calTexturePos.frag, texture position ------------------------------------------------------------
void calTexturePos(){
    // Center shift due to zoom
    float ZoomCenterShift = (0.5/ZoomScale)-0.5;
    
    texturePos = texCoordVarying / ZoomScale - ZoomCenterShift - DragShift;
    
    if (imageAspectRatio > panelAspectRatio){
        // If the image is thinner than screen, scale texturePos.x to higher aspect ratio
        texturePos.x = texturePos.x * imageAspectRatio / panelAspectRatio - (1.0 * imageAspectRatio / panelAspectRatio - 1.0)/2.0;
    } else {
        // If the image is fatter than screen, scale texturePos.y to lower aspect ratio
        texturePos.y = texturePos.y / imageAspectRatio * panelAspectRatio - (1.0 / imageAspectRatio * panelAspectRatio - 1.0)/2.0;
    }
}

// platforms/es/isOutofRange.frag, filling black for out-of-range texturePos ------------------------------------------------------------
bool isOutofRange(){
    if (texturePos.x > 1.0 || texturePos.x < 0.0 || texturePos.y > 1.0 ||  texturePos.y < 0.0){
        return true;
    } else {
        return false;
    }
}

// layouts/rgb_stripe/getSubpixelPos.frag, rgb stripe ------------------------------------------------------------

vec3 getSubpixelPos(float origin){
    // From pixel center find each subpixel center
    return vec3(origin - 0.333333, origin, origin + 0.333333);
}

// shared/getColorFromTexture.frag, getColorFromTexture ------------------------------------------------------------
vec4 getColorFromTexture(int n){
    if (n == 0)
        return texture(ColorTex0, texturePos);
    else if (n == 1 || n == ViewNumber-1)
        return texture(ColorTex1, texturePos);
    else if (n == 2 || n == ViewNumber-2)
        return texture(ColorTex2, texturePos);
    else if (n == 3 || n == ViewNumber-3)
        return texture(ColorTex3, texturePos);
    else if (n == 4 || n == ViewNumber-4)
        return texture(ColorTex4, texturePos);
    else if (n == 5 || n == ViewNumber-5)
        return texture(ColorTex5, texturePos);
    else if (n == 6 || n == ViewNumber-6)
        return texture(ColorTex6, texturePos);
    else if (n == 7 || n == ViewNumber-7)
        return texture(ColorTex7, texturePos);
    else if (n == 8 || n == ViewNumber-8)
        return texture(ColorTex8, texturePos);
    else if (n == 9 || n == ViewNumber-9)
        return texture(ColorTex9, texturePos);
    else if (n == 10 || n == ViewNumber-10)
        return texture(ColorTex10, texturePos);
    else if (n == 11 || n == ViewNumber-11)
        return texture(ColorTex11, texturePos);
    else if (n == 12 || n == ViewNumber-12)
        return texture(ColorTex12, texturePos);
    else if (n == 13 || n == ViewNumber-13)
        return texture(ColorTex13, texturePos);
    else if (n == 14 || n == ViewNumber-14)
        return texture(ColorTex14, texturePos);
    else if (n == 15 || n == ViewNumber-15)
        return texture(ColorTex15, texturePos);
    else
        return vec4(0.0,0.0,0.0,0.0);
}

// shared/pickColor.frag, subpixel color ------------------------------------------------------------
float pickColor(float fractionalView, int channel){
    
    float index = mod(fractionalView, float(ViewNumber));
    
    // 0 ~ VN, mostly on 1 ~ VN
    int n = int(ceil(index));
    
    float w1 = float(n) - index;
    float w2 = 1.0 - w1;
    
    // 0 ~ VN-1
    int n1 = (n - 2 + ViewNumber)%ViewNumber;
    int n2 = (n - 1 + ViewNumber)%ViewNumber;
    
    vec4 c1, c2;
    c1 = getColorFromTexture(n1);
    c2 = getColorFromTexture(n2);
    
    if (channel == 1){
        return c1.r*w1 + c2.r*w2;
    } else if (channel == 2){
        return c1.g*w1 + c2.g*w2;
    } else if (channel == 3) {
        return c1.b*w1 + c2.b*w2;
    }
}

// shared/main.frag, shader entry ------------------------------------------------------------
void main(){
    calAspectRatio();
    calPanelPos();
    calTexturePos();
    
    float viewToPositionRatio = float(ViewNumber)/EffContentPitch;
    
    // Fill black and return if texturePos is out-of-range
    if (isOutofRange()){
        outputColor = vec4(0.0,0.0,0.0,1.0);
        return;
    }
    
    // Mode compensation
    if (PanelMode != 0){
        viewToPositionRatio *= -1.0*float(sign(LensDriftAngleRad))*float(sign(PanelMode));
    }
    
    // Find pixel position (in pixel)
    float pixelPosition = (panelPos.x-0.5) - tan(LensDriftAngleRad)*(panelPos.y-0.5) + 0.5;
    
    // Get position for each subpixels (in pixel)
    vec3 subpixelView = getSubpixelPos(pixelPosition);
    // Map to view number unit (in view)
    subpixelView *= viewToPositionRatio;
    
    // Pick gray level for each subpixels
    outputColor.r = pickColor(subpixelView.r, 1);
    outputColor.g = pickColor(subpixelView.g, 2);
    outputColor.b = pickColor(subpixelView.b, 3);
    outputColor.a = 1.0;
}

