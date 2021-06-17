uniform float uTime;
uniform vec3 uLightPosition;

//in float intensivity;
in vec3 fragmentNormal;
in vec3 fragmentPosition;


float intensivityByTime(float x){
    //    return sin(time / 5.0) * abs(sin(time));
    return (sin(x/1.0)*abs(sin(x))-0.5)*2.0;
}
//    float x  =uTime;
//    float intensivity = sin(x/5.0)*abs(sin(x));


void main(){

    const float PI = 3.1415926;
    const int PIi = 31415926;
    const int PI2i = 15707963;
    const float speed = 2.0;
    vec4 ambientColor = vec4(0.0, 0.0, 0.0, 0.0);

    vec3 lightDirection = normalize(uLightPosition - fragmentNormal);
//    float diff = max(dot(fragmentNormal, lightDirection), 0.0);
    float diff = abs(dot(fragmentNormal, lightDirection));
    vec4 diffuse = vec4(0.3, 0.3, 0.3, 1.0) * diff;

    int timePhase = int(round(uTime) * 10000000.0) % (PI2i);
    float phaseOffset = float(timePhase) / 10000000.0;
    //    float phaseOffset = sin(fragmentPosition.x + fragmentPosition.y + fragmentPosition.z) * 30.0;

    //    int timeRed = int(round(uTime * 10000.0)) % (PIi );
    //    float timeOffsetRed = float(timeRed) / 20000.0;
    //    vec3 offsetPositionRed = fragmentPosition + PI / 0.5 * abs(sin(timeOffsetRed));


    //    int timeGreen = (int(round(uTime * 10000.0)) + 1000) % (31415);
    //    float timeOffsetGreen = float(timeGreen) / 20000.0;
    //    vec3 offsetPositionGreen = fragmentPosition + 3.1415 / 2.0 * sin(timeOffsetGreen);

    vec3 lightViewDirection = normalize(uLightPosition - fragmentPosition);
    vec3 viewDirection = normalize(cameraPosition - fragmentPosition);
    vec3 reflectDirection = reflect(-lightViewDirection, fragmentNormal);
    float specularStrength = max(dot(lightViewDirection, viewDirection), 0.0) + tan(uTime);
    float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), 2.0);
    //    vec4 specular = vec4(0.0, 0.0, 1.0, 1.0) * specularStrength * spec;
    float redPhase = PI/2.0 + uTime * speed;
    float greenPhase = PI/2.0 - 1.0   + uTime * speed * 1.0;
    float bluePhase = PI/2.0  -1.0*2.0 +  uTime * speed;
    //    float greenPhase = PI/2.0 - 1.7  + uTime * speed;
    //    float bluePhase = PI/2.0 + uTime;
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
    //    float x  =uTime;
    //    float intensivity = sin(x/5.0)*abs(sin(x));
    float specIntense = max(intensivityByTime(fragmentPosition.x + redPhase), 0.0) * 2.0;

        vec4 specular = vec4(SpecularColorRed, SpecularColorGreen, SpecularColorBlue, 1.0) * specIntense * diff * spec;
    float multiplier = 0.1 / ((specular.r + specular.g + specular.b) / 3.0);
//    specular *= multiplier;
//    specular *= multiplier;
    if (abs(specIntense) < 0.01) discard;

//    vec4 specular = vec4(SpecularColorRed, SpecularColorGreen, SpecularColorBlue, 1.0) * specIntense  * 2.0;
//    const float mc = 0.05;
//    if ((specular.x < mc) && (specular.y < mc) && (specular.z < mc)) discard;


    //    vec3 lookVector = position - cameraPosition;
    //    vec3 lightVector = position -uLightPosition;
    //    intensivity = acos(dot(lookVector, lightVector));

    //    gl_FragColor = ambientColor + diffuse + specular;
    specular.a = 0.5;
    gl_FragColor = specular;
    //    gl_FragColor = ambientColor  + specular;
}