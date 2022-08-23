export const frag = `
varying vec4 v_color;
varying float v_z;

uniform float u_opacity: 1.0;
uniform sampler2D u_texture;

#pragma include "picking"

void main() {
    gl_FragColor = texture2D(u_texture, vec2(v_z, 0.5));
    gl_FragColor.a *= u_opacity;
    gl_FragColor = filterColor(gl_FragColor);
}

`;
export const vert = `
precision highp float;

#define pi 3.1415926535
#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2

attribute vec3 a_Position;
attribute vec3 a_Pos;
attribute vec4 a_Color;
attribute vec3 a_Size;
attribute vec3 a_Normal;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
varying vec4 v_color;
varying float v_z;

uniform float u_opacity : 1;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {
    vec3 offset = a_Size * a_Position;
    if (u_CoordinateSystem == COORDINATE_SYSTEM_P20 || u_CoordinateSystem == COORDINATE_SYSTEM_P20_OFFSET) { // amap & mapbox
        offset = offset * pow(2.0, (19.0 - u_Zoom));
    } else if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // amap2
        offset = offset * pow(2.0, (19.0 - 3.0 - u_Zoom));
    }

    vec4 project_pos = project_position(vec4(a_Pos.xy, 0., 1.0));
    vec4 pos = vec4(project_pos.xy + offset.xy, offset.z, 1.0);

    v_z = a_Position.z;

    v_color = vec4( a_Color.rgb * calc_lighting(pos), a_Color.w);
  
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) {
      gl_Position = u_Mvp * pos;
    } else {
      gl_Position = project_common_position_to_clipspace(pos);
    }
  
    setPickingColor(a_PickingColor);
}
`;
