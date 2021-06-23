attribute vec2 offset;
attribute vec3 color;
attribute vec3 colorVertex;
attribute int order;


uniform vec3 uLightPosition;
out vec3 fragmentNormal;
out vec3 fragmentPosition;

out vec3 v_reflection;
out vec3 v_refraction;
out float v_fresnel;

out vec3 fragmentColor;
flat out int fragmentOrder;
out float distanceToCenter;



void main() {
    //    fragmentNormal = normalize(normal);
        fragmentPosition = vec3(modelViewMatrix *  vec4(position, 1.0));
    //    gl_Position = projectionMatrix * modelViewMatrix * vec4(offset, 0.0, 1.0);
    vec3 offsetPosition = position + vec3(offset.xy, 0.0);
    //    gl_Position = projectionMatrix * modelViewMatrix * vec4(offsetPosition, 1.0);
    distanceToCenter = distance(fragmentPosition, vec3(0.0, 0.0, 0.0));
    fragmentColor = colorVertex;
    fragmentOrder = order;



    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix *  vec4(position, 1.0) + vec4(offset * 0.3, 0.0, 0.0);
    //    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);


}