// ==UserScript==
// @name         xuexitong_bot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       anonymous
// @include      https://mobilelearn.chaoxing.com/widget/pcpick/stu/index?courseId=206931780&jclassId=13952640
// @include      https://mobilelearn.chaoxing.com/widget/sign/pcStuSignController/preSign*
// @grant        none
// ==/UserScript==

var profile = {
    time: "2020-05-15T18:35:00",//设置开始时间，时间格式： "YYYY-MM-DDTHH:mm:ss"。举例：假设课堂开始时间为 739年2月2日2时2分2秒，必须写成 "0739-02-02T02:02:02"
    duration: false,//持续检查时间（单位：分钟），在持续时间内不断检查，针对老师课间检查学生是否在线而发起二次签到的情况，没有此情况填写false，即代表默认持续时间（40分钟）
    refresh_frequency: false,//检查签到任务列表的时间间隔（单位：分钟），false代表默认检查间隔（2分钟）
    pageURL: "https://mobilelearn.chaoxing.com/widget/pcpick/stu/index?courseId=206931780&jclassId=13952640",//目标课程的签到页面url，注意：用双引号 "" 括起来。举例: "https://www.example.com/path?name=zhang_san"
}

function min2sec (min) {
    let seconds = min * 60 * 1000
    return seconds
}

function redirection () {document.location.href = profile.pageURL}

function getFinishTime () {//返回课程结束时间
    let time = Date.parse(profile.time) + min2sec(profile.duration)
    return time
}

function action () {
    let list = document.getElementById('startList')
    if (list.childElementCount !== 0) {
        let sign_ele = list.firstElementChild.firstElementChild
        sign_ele.click()
    } else {redirection()}
}

function getRemainingTime() {//返回剩余时间
    let time = Date.parse(profile.time) - Date.now()
    return time
}

function check_profile () {
    if (profile.refresh_frequency === false) {profile.refresh_frequency = 2}
    if (profile.duration === false) {profile.duration = 40}
    if (!Date.parse(profile.time)) {console.log(`日期的输入格式有误，请检查。`)}
}


(() => {
    check_profile()
    if (document.location.href === profile.pageURL && 0 <= getRemainingTime()) {
        console.log("页面打开，程序正在运行，在签到完成前不要关闭此页面，注意网络连接。")
        setTimeout(redirection,getRemainingTime())
    } else if (document.location.href !== profile.pageURL && Date.now() <= getFinishTime()) {
        console.log(`15秒后重新定向到签到页面`)
        setTimeout(redirection,15000)
    } else if (document.location.href === profile.pageURL && Date.now() <= getFinishTime()) {
        console.log(`${profile.refresh_frequency}分钟后重新检查签到页面`)
        setTimeout(action,min2sec(profile.refresh_frequency))
    } else {
        console.log("程序运行结束")
    }
})();