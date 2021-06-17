uniform vec3 uLightPosition;
//out float intensivity;
out vec3 fragmentNormal;
out vec3 fragmentPosition;

out vec3 v_reflection;
out vec3 v_refraction;
out float v_fresnel;
void main() {
    fragmentNormal = normalize(normal);
    fragmentPosition = vec3(modelViewMatrix *  vec4(position, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);




}