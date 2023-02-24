let earthinfo = {
    name: "Земля",
    mass: 1, 
    radius: 6.3721,
    texture: "../images/earthtexture.jpg",
    description: `Земля - третья планета Солнечной системы и крупнейшая планета земной группы, в которую также входят Меркурий, Венера, Марс. 
    На данный момент Земля является единственным известным космическим телом, населенным живыми организмами.`
}

let mooninfo = {
    name: "Луна",
    mass: 0.0123,
    radius: 1.7374,
    texture: "../images/moontexture.jpg",
    description: `Луна - единственный естественный спутник Земли, возникший около 4,5 млрд лет назад. 
    Наиболее популярна гипотеза о том, что Луна сформировалась из осколков после столкновения Земли и Тейи.`
}

const planetinfo = new Map();
planetinfo.set("Earth", earthinfo);
planetinfo.set("Moon", mooninfo)