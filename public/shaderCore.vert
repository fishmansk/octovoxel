uniform vec3 uLightPosition;
//out float intensivity;
out vec3 fragmentNormal;
out vec3 fragmentPosition;
out vec3 fragmentColor;
out float fragmentBlendCoef;

out vec3 v_reflection;
out vec3 v_refraction;
out float v_fresnel;

uniform float uTime;

//float rand(vec2 seed) {
//    return fract(sin(dot(seed.xy, vec2(12.9898, 78.233))) * 43758.5453);
//}
//float rand(vec2 n) {
//    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
//}
//
//float noise(vec2 p){
//    vec2 ip = floor(p);
//    vec2 u = fract(p);
//    u = u*u*(3.0-2.0*u);
//
//    float res = mix(
//    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
//    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
//    return res*res;
//}
float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio

float gold_noise(vec2 xy, float seed){
    return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
}

void main() {

    fragmentNormal = normalize(normal);
    float delta = sin(uTime) * 10.0;
    float x = delta + position.x * 2.0 * normal.z * normal.y;
    float y = delta + normal.y *  position.z * 2.0 * position.y * 2.0;
//    float z = sin(uTime + normal.z) * cos(uTime + normal.x);
    float d = 1.0;
    float rx = x;
    float ry = y;
//    float rx = floor(x / d + 0.5);
//    float ry = floor(y / d + 0.5);
//    float rz = floor(z / d + 0.5);
    //    float randRes = rand(vec2(rx, ry));
    //    float randValue = noise(vec2(rx, ry));
//    float randValue = rand(vec2(rx, ry));
    float randValue = gold_noise(vec2(rx, ry), 0.05);
//    float randValue1 = rand(vec2(ry, rz));
    fragmentColor = normalize(vec3(0.3, 0.0, 0.0));
//    fragmentColor = normalize(vec3(randValue * normal.x, randValue * (normal.x + normal.z) / 2.0, randValue * normal.z));
    //    fragmentColor = vec3(0.0, 0.0, 0.0);
    fragmentBlendCoef = randValue;

    vec3 offsetPosition = position + normal * randValue;
    fragmentPosition = vec3(modelViewMatrix *  vec4(offsetPosition, 1.0));




    gl_Position = projectionMatrix * modelViewMatrix * vec4(offsetPosition, 1.0);


}