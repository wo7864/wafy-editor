//normal.js

const textAppear = {
    icon: "match-moving",
    name: "textAppear",
    attr:[
        {
            name: 'speed1',
            title: '글자 당 속도',
            value:0.3,
            unit:'초'
        },
        {
            name: 'bright',
            title: '밝기',
            value:10,

        }
    ]
}


/// image.js

const hoverRotate = {
    icon: "match-moving",
    name: "hoverRotate",
    attr:[
        
    ]

}



///

const move = {
    icon: "match-moving",
    name: "move",
    attr: [
        {
            name: 'duration',
            title: '재생시간',
            value: 0.3,
            unit:'초',
        },
        {
            name: 'delay',
            title: '지연시간',
            value: 0,
            unit:'초',
        },
        {
            name: 'value',
            title: '이동 값',
            value: 30,
        },
        {
            name: 'timingFunction',
            title: '가속유형',
            value: 'linear',
            options: ['ease-in', 'ease-out',]
        }
    ]
}

const changeColor = {
    icon: "match-moving",
    name: "changeColor",
    attr: [
        {
            name: 'duration',
            title: '재생시간',
            value: 0.3,
            unit:'초',
        },
        {
            name: 'delay',
            title: '지연시간',
            value: 0,
            unit:'초',
        },
        {
            name: 'backgroundColor',
            title: '배경색',
            value: '#000',
        },
        {
            name: 'color',
            title: '글자색',
            value: '#fff',
        },
        {
            name: 'direction',
            title: '채우는 방향',
            value: 'left',
        },
        {
            name: 'timingFunction',
            title: '가속유형',
            value: 'linear',
            options: ['ease-in', 'ease-out',]
        }
    ]
}


////////////////스크롤
const fadeInOut_Scroll = {
    icon: "match-moving",
    name: "fadeInOut_Scroll",
    attr: [
        {
            name: 'duration',
            title: '재생시간',
            value: 1,
            unit:'초',
        },
        {
            name: 'delay',
            title: '지연시간',
            value: 0,
            unit:'초',
        },
        {
            name: 'value',
            title: '이동 값',
            value: 100,
        },
        {
            name: 'timingFunction',
            title: '가속유형',
            value: 'linear',
            options: ['ease-in', 'ease-out',]
        }
    ]
}

const scaleUp_Scroll = {
    icon: "match-moving",
    name:"scaleUp_Scroll",
    attr: [
        {
            name: 'scale',
            title: '크기 비율',
            value: 3,
        },
    ]}
// 스크롤 텍스트
const typing_Scroll = {
    icon: "match-moving",
    name:"typing_Scroll",
    attr: [
        {
            name: 'speed',
            title: '속도',
            value: 1,
        },
    ]
}

const AnimationList = [textAppear, hoverRotate, move, fadeInOut_Scroll, changeColor, scaleUp_Scroll, typing_Scroll];
export default AnimationList;