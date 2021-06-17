uniform float uuTime;
uniform vec3 uLightPosition;

//in float intensivity;
in vec3 fragmentNormal;
in vec3 fragmentPosition;
in vec3 fragmentColor;
in float fragmentBlendCoef;

uniform vec2 resolution;
uniform float uTime;
uniform float subsecond;

vec2 offset;
float x;
float y;
float d;
float rx;
float ry;
float randRes;


float intensivityByuTime(float x){
    return (sin(x/1.0)*abs(sin(x))-0.5)*2.0;
}



void main(){

    const float PI = 3.1415926;
    const int PIi = 31415926;
    const int PI2i = 15707963;
    const float speed = 2.0;
    vec4 ambientColor = vec4(0.0, 0.0, 0.0, 1.0);

    vec3 lightDirection = normalize(uLightPosition - fragmentNormal);
    float diff = max(dot(fragmentNormal, lightDirection), 0.0);
    vec4 diffuse = vec4(0.3, 0.3, 0.3, 0.3) * diff;

    int uTimePhase = int(round(uuTime) * 10000000.0) % (PI2i);
    float phaseOffset = float(uTimePhase) / 10000000.0;
    //    float phaseOffset = sin(fragmentPosition.x + fragmentPosition.y + fragmentPosition.z) * 30.0;

    //    int uTimeRed = int(round(uuTime * 10000.0)) % (PIi );
    //    float uTimeOffsetRed = float(uTimeRed) / 20000.0;
    //    vec3 offsetPositionRed = fragmentPosition + PI / 0.5 * abs(sin(uTimeOffsetRed));


    //    int uTimeGreen = (int(round(uuTime * 10000.0)) + 1000) % (31415);
    //    float uTimeOffsetGreen = float(uTimeGreen) / 20000.0;
    //    vec3 offsetPositionGreen = fragmentPosition + 3.1415 / 2.0 * sin(uTimeOffsetGreen);

    vec3 lightViewDirection = normalize(uLightPosition - fragmentPosition);
    vec3 viewDirection = normalize(cameraPosition - fragmentPosition);
    vec3 reflectDirection = reflect(-lightViewDirection, fragmentNormal);
    float specularStrength = max(dot(lightViewDirection, viewDirection), 0.0) + tan(uuTime);
    float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), 2.0);
    //    vec4 specular = vec4(0.0, 0.0, 1.0, 1.0) * specularStrength * spec;
    float redPhase = PI/2.0 + uuTime * speed;
    float greenPhase = PI/2.0 - 1.0   + uuTime * speed * 1.0;
    float bluePhase = PI/2.0  -1.0*2.0 +  uuTime * speed;
    //    float greenPhase = PI/2.0 - 1.7  + uuTime * speed;
    //    float bluePhase = PI/2.0 + uuTime;
    float sinOffsetRed = sin((fragmentPosition.x + redPhase)* 5.0);
    float sinOffsetGreen = sin((fragmentPosition.x + greenPhase)* 5.0);
    float sinOffsetBlue = sin((fragmentPosition.x + bluePhase)* 5.0);
    float SpecularColorRed = max(sinOffsetRed, 0.0);
    float SpecularColorGreen = max(sinOffsetGreen, 0.0);
    float SpecularColorBlue= max(sinOffsetBlue, 0.0);
    //    float SpecularColorBlue = max(sin(fragmentPosition.x + redPhase), 0.0);
    //    float SpecularColorRed = max(sin(offsetPositionRed.x - PI/2.0 ), 0.0);
    //    float SpecularColorGreen = max(sin(offsetPositionGreen.x ), 0.0);
    //    vec4 specular = vec4(SpecularColorRed, SpecularColorGreen, 0.3, 1.0);
    //    float x  =uuTime;
    //    float intensivity = sin(x/5.0)*abs(sin(x));
    float specIntense = max(intensivityByuTime(fragmentPosition.x + redPhase), 0.0) * 2.0;

//    vec4 specular = vec4(SpecularColorRed, SpecularColorGreen, SpecularColorBlue, 1.0) * specIntense * diff * spec;
    vec4 specular = vec4(SpecularColorRed, SpecularColorGreen, SpecularColorBlue, 1.0) * specIntense * diff * spec;
    float multiplier = 0.1 / ((specular.r + specular.g + specular.b) / 3.0);
    specular *= multiplier;
    specular *= multiplier;

//    vec4 specular = vec4(SpecularColorRed, SpecularColorGreen, SpecularColorBlue, 1.0) * specIntense  * 2.0;
//    const float mc = 0.05;
//    if ((specular.x < mc) && (specular.y < mc) && (specular.z < mc)) discard;


    //    vec3 lookVector = position - cameraPosition;
    //    vec3 lightVector = position -uLightPosition;
    //    intensivity = acos(dot(lookVector, lightVector));
//    specular.a = 0.5;
        //gl_FragColor = ambientColor + diffuse + specular;
//        gl_FragColor = ambientColor + diffuse + vec4(fragmentColor, 1.0);
//        gl_FragColor = ambientColor * (1.0 - fragmentBlendCoef)  + vec4(fragmentColor, 1.0) * fragmentBlendCoef;
        gl_FragColor = ambientColor  + vec4(fragmentColor, 1.0) * fragmentBlendCoef / 3.0;

//    gl_FragColor = specular;
    //    gl_FragColor = ambientColor  + specular;
}

float rand(vec2 seed);
//
//float hasStar() {
//    if (randRes > 0.95) {
//        float cx = rx * d;
//        float cy = ry * d;
//
//        float r = sqrt(pow(x - cx, 2.0) + pow(y - cy, 2.0));
//        return 1.0 - ((r * 2.0) / d);
//    }
//    return 0.0;
//}
//
//vec4 starColor() {
//    return vec4(
//    abs(mod(y - x, 255.0)) / 255.0,
//    abs(mod(x + y, 255.0)) / 255.0,
//    abs(mod(x - y, 255.0)) / 255.0,
//    1.0
//    ) * 1.5;
//}
//
//float blink() {
//    if (randRes > 0.98)
//    return sin(randRes/3.0+(offset.x+offset.y+gl_FragCoord.x)/d)/2.0 + 0.5;
//    return 1.0;
//}
//
//void main() {
//    offset = vec2(uTime * 10.0 + sin(uTime * 8.0), uTime * 100.0);
//    x = floor(offset.x + gl_FragCoord.x + 0.5);
//    y = floor(offset.y + gl_FragCoord.y + 0.5);
//    d = 16.0;
//    rx = floor(x / d + 0.5);
//    ry = floor(y / d + 0.5);
//    randRes = rand(vec2(rx, ry));
//    vec4 result = starColor() * hasStar() * blink();
//    gl_FragColor = result;
//}
//
float rand(vec2 seed) {
    return fract(sin(dot(seed.xy, vec2(12.9898, 78.233))) * 43758.5453);
}