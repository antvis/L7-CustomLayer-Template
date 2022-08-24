export const frag = `
uniform float u_opacity : 1.0;
uniform float u_stroke_opacity : 1;
uniform float u_stroke_width : 2;
uniform vec4 u_stroke_color : [0.0, 0.0, 0.0, 0.0];

varying vec4 v_color;
varying vec2 v_uv;

#pragma include "picking"

void main() {

    gl_FragColor = v_color;
    // gl_FragColor = vec4(v_uv, 0.0, 1.0);
    gl_FragColor.a *= u_opacity;
    gl_FragColor = filterColor(gl_FragColor);
}
`;
export const vert = `
attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec2 a_uv;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
uniform float u_len;

varying vec4 v_color;
varying vec2 v_uv;

#pragma include "projection"
#pragma include "picking"


void main() { 
    vec2 pos = a_Position.xy;
    float len = u_len;
    if(a_uv.x == 0.0 && a_uv.y == 0.0) { // left top
        pos[0] -= len;
        pos[1] += len;
    } else if(a_uv.x == 1.0 && a_uv.y == 0.0) { // right top
        pos[0] += len;
        pos[1] += len;
    } else if(a_uv.x == 1.0 && a_uv.y == 1.0) { // right bottom
        pos[0] += len;
        pos[1] -= len;
    } else { // left bottom
        pos[0] -= len;
        pos[1] -= len;
    }
    
    v_color = a_Color;
    v_uv = a_uv;

    vec4 project_pos = project_position(vec4(pos.xy, 0.0, 1.0));
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) {
        gl_Position = u_Mvp * vec4(project_pos.xy, 0.0, 1.0);
    } else {
        gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, 0.0, 1.0));
    }
    setPickingColor(a_PickingColor);
}
`;
