#version 300 es
layout(location= STRV(POS_ATTRIB)) in vec2 pos;
layout(location= STRV(COLOR_ATTRIB)) in vec4 color;
layout(location= STRV(SCALEROT_ATTRIB)) in vec4 scaleRot;
layout(location= STRV(OFFSET_ATTRIB)) in vec2 offset;
out vec4 vColor;
void main() {
    mat2 sr = mat2(scaleRot.xy, scaleRot.zw);
    gl_Position = vec4(sr*pos + offset, 0.0, 1.0);
    vColor = color;
}