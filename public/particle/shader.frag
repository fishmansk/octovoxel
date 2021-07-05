uniform float uTime;
uniform float uCount;
uniform vec3 uLightPosition;

in vec3 fragmentNormal;
in vec3 fragmentPosition;
in vec3 fragmentColor;
flat in int fragmentOrder;
in float distanceToCenter;

void main(){

    //    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    //Скорость движения 1000 в секунду, или 5000
    float timeOffset = mod((uTime) / 10.0, 0.4) * 500.0;
//    float timeOffset = mod(uTime, 5.0) * 1000.0;
    float distanceOrder = abs(timeOffset - float(fragmentOrder));
    float intensivity = 0.0;
    if (distanceOrder < 25.0){
        intensivity = 1.0 - (distanceOrder / 25.0);
    }

    float totalIntensivity = 1.0;
    if (distanceToCenter < 50.0){
        totalIntensivity = 1.0 - distanceToCenter / 50.0;
    }
    //    intensivity = sin((float(fragmentOrder) + uTime * 50.0) / 50.0);

    //    gl_FragColor = vec4(fragmentColor, 0.5) * min((float(fragmentOrder) / 1000.0), 1.0);
//    gl_FragColor = (vec4(fragmentColor, 0.5)  + vec4(0.0, 1.0, 1.0, 1.0) * intensivity * 2.0);
    gl_FragColor = (vec4(fragmentColor, 0.5)  + vec4(1.0, 1.0, 1.0, 1.0) * intensivity * 2.0);
//    gl_FragColor = (vec4(0.5, 0.5, 0.5, 1.0)  + vec4(1.0, 1.0, 0.0, 1.0) * intensivity * 2.0);
    gl_FragColor *= totalIntensivity;
}