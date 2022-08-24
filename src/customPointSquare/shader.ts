export const frag = `
uniform float u_opacity : 1.0;
uniform float u_stroke_width : 1.0;
uniform vec4 u_stroke_color : [0.0, 0.0, 0.0, 0.0];

varying vec4 v_color;
varying vec2 v_uv;

#pragma include "picking"

void main() {
    gl_FragColor = v_color;
    

    if(u_stroke_width > 0.001) {
        float strokeWidth = min(u_stroke_width, 0.5);
        float strokeBorder = 0.5 - strokeWidth;
        if(abs(v_uv.x - 0.5) > strokeBorder || abs(v_uv.y - 0.5) > strokeBorder) {
            gl_FragColor = u_stroke_color;
        }
    }

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
uniform float u_rotate: 0.0;

varying vec4 v_color;
varying vec2 v_uv;

#pragma include "projection"
#pragma include "picking"

void main() { 
    vec2 pos = a_Position.xy;
    float len = u_len;
    
    highp float angle_sin = sin(u_rotate);
    highp float angle_cos = cos(u_rotate);
    mat2 rotation_matrix = mat2(angle_cos, -1.0 * angle_sin, angle_sin, angle_cos);
    vec2 offset;
    if(a_uv.x == 0.0 && a_uv.y == 0.0) { // left top
        offset = vec2(-len, len) * rotation_matrix;
    } else if(a_uv.x == 1.0 && a_uv.y == 0.0) { // right top
        offset = vec2(len, len) * rotation_matrix;
    } else if(a_uv.x == 1.0 && a_uv.y == 1.0) { // right bottom
        offset = vec2(len, -len) * rotation_matrix;
    } else { // left bottom
        offset = vec2(-len, -len) * rotation_matrix;
    }
    
    v_color = a_Color;
    v_uv = a_uv;

    offset = project_pixel(offset);

    vec4 project_pos = project_position(vec4(pos.xy, 0.0, 1.0));
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) {
        gl_Position = u_Mvp * vec4(project_pos.xy + offset, 0.0, 1.0);
    } else {
        gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));
    }
    setPickingColor(a_PickingColor);
}
`;
